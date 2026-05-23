import numpy as np
from fastapi import Depends
from sklearn.linear_model import LinearRegression
from sqlalchemy.orm import Session
from src.database import get_db
from src.ml.common import gasto_semanal, obtener_gastos_usuario


def _filtrar_outliers(series: list[float]):
    if len(series) < 4:
        return series

    desviacion = float(np.std(series))
    if desviacion == 0:
        return series

    promedio = float(np.mean(series))
    return [value for value in series if abs((value - promedio) / desviacion) < 2]


def predecir_gasto(usuario_id, db: Session = Depends(get_db)):
    transacciones = obtener_gastos_usuario(usuario_id, db)
    semanas = gasto_semanal(transacciones)

    if len(semanas) == 0:
        return {
            "prediccion": None,
            "mensaje": "Aun no hay movimientos suficientes para proyectar tus gastos",
            "promedio_semanal": None,
            "tendencia": None,
        }

    montos = [float(semana["monto"]) for semana in semanas]

    if len(montos) < 4:
        promedio = float(np.mean(montos))
        ultimo = float(montos[-1])
        if len(montos) == 1:
            prediccion = ultimo
        else:
            prediccion = (ultimo * 0.6) + (promedio * 0.4)

        if ultimo > promedio * 1.1:
            tendencia = "alza"
        elif ultimo < promedio * 0.9:
            tendencia = "baja"
        else:
            tendencia = "estable"

        return {
            "prediccion": round(max(prediccion, 0.0), 2),
            "mensaje": (
                "Prediccion temprana basada en tu historial reciente: "
                f"podrias gastar ${round(max(prediccion, 0.0), 2)} la proxima semana"
            ),
            "promedio_semanal": round(promedio, 2),
            "tendencia": tendencia,
        }

    montos_filtrados = _filtrar_outliers(montos)

    if len(montos_filtrados) < 4:
        montos_filtrados = montos

    x = np.arange(1, len(montos_filtrados) + 1).reshape(-1, 1)
    y = np.array(montos_filtrados, dtype=float)

    modelo = LinearRegression()
    modelo.fit(x, y)

    prediccion = max(float(modelo.predict([[len(montos_filtrados) + 1]])[0]), 0.0)
    promedio = float(np.mean(y))

    if prediccion > promedio * 1.1:
        tendencia = "alza"
    elif prediccion < promedio * 0.9:
        tendencia = "baja"
    else:
        tendencia = "estable"

    return {
        "prediccion": round(prediccion, 2),
        "mensaje": f"Se estima que gastaras ${round(prediccion, 2)} la proxima semana",
        "promedio_semanal": round(promedio, 2),
        "tendencia": tendencia,
    }
