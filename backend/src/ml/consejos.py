from fastapi import Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.ml.common import obtener_nombre_categoria
from src.models.presupuesto import Presupuesto
from src.models.transaccion import Transaccion


def generar_consejo(usuario_id, db: Session = Depends(get_db)):
    presupuestos = db.query(Presupuesto).filter(Presupuesto.usuario_id == usuario_id).all()
    if not presupuestos:
        return {
            "mensaje": "No hay presupuestos configurados",
            "consejo": "Configura al menos un presupuesto para recibir recomendaciones personalizadas.",
            "categoria_id": None,
            "categoria_nombre": None,
            "ahorro_estimado": None,
        }

    datos = []
    for presupuesto in presupuestos:
        gastos = (
            db.query(Transaccion)
            .filter(
                Transaccion.usuario_id == usuario_id,
                Transaccion.categoria_id == presupuesto.categoria_id,
                Transaccion.tipo == "gasto",
                Transaccion.fecha >= presupuesto.fecha_inicio,
                Transaccion.fecha <= presupuesto.fecha_fin,
            )
            .all()
        )

        total_gasto = round(sum(float(transaccion.monto) for transaccion in gastos), 2)
        exceso = round(total_gasto - float(presupuesto.monto_limite), 2)

        datos.append(
            {
                "categoria_id": str(presupuesto.categoria_id),
                "categoria_nombre": obtener_nombre_categoria(presupuesto.categoria_id, db),
                "limite": float(presupuesto.monto_limite),
                "gastado": total_gasto,
                "exceso": exceso,
            }
        )

    peor_categoria = max(datos, key=lambda item: item["exceso"])
    if peor_categoria["exceso"] <= 0:
        return {
            "mensaje": "Tus gastos estan bajo control",
            "consejo": "Vas muy bien, te mantienes dentro de tus presupuestos activos.",
            "categoria_id": peor_categoria["categoria_id"],
            "categoria_nombre": peor_categoria["categoria_nombre"],
            "ahorro_estimado": 0,
        }

    ahorro_semanal = round(peor_categoria["exceso"] / 4, 2)

    return {
        "mensaje": "Encontramos una oportunidad de ahorro",
        "consejo": (
            f"Tu mayor desviacion esta en {peor_categoria['categoria_nombre']}. "
            f"Llevas ${peor_categoria['gastado']} gastados con un limite de ${peor_categoria['limite']}. "
            f"Si reduces ${ahorro_semanal} por semana, volverias a tu presupuesto este mes."
        ),
        "categoria_id": peor_categoria["categoria_id"],
        "categoria_nombre": peor_categoria["categoria_nombre"],
        "ahorro_estimado": round(peor_categoria["exceso"], 2),
    }
