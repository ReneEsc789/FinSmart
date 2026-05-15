import numpy as np
from fastapi import Depends
from sqlalchemy.orm import Session

from src.database import get_db
from src.ml.common import obtener_gastos_categoria


def detectar_anomalia(usuario_id, categoria_id, db: Session = Depends(get_db)):
    transacciones = obtener_gastos_categoria(usuario_id, categoria_id, db)
    if len(transacciones) < 4:
        return {
            "anomalia": False,
            "mensaje": "No hay datos suficientes para evaluar anomalias en esta categoria",
            "monto_analizado": None,
            "promedio_historico": None,
        }

    montos = np.array([float(transaccion.monto) for transaccion in transacciones], dtype=float)
    historico = montos[:-1]
    ultimo_gasto = float(montos[-1])
    promedio = float(np.mean(historico))
    desviacion = float(np.std(historico))

    if desviacion == 0:
        anomalia = ultimo_gasto > promedio * 1.5 if promedio > 0 else False
    else:
        anomalia = abs((ultimo_gasto - promedio) / desviacion) >= 2

    if anomalia:
        mensaje = f"Gasto inusual detectado: registraste ${round(ultimo_gasto, 2)} cuando tu promedio es ${round(promedio, 2)}"
    else:
        mensaje = "El ultimo gasto esta dentro de tu comportamiento habitual"

    return {
        "anomalia": anomalia,
        "mensaje": mensaje,
        "monto_analizado": round(ultimo_gasto, 2),
        "promedio_historico": round(promedio, 2),
    }
