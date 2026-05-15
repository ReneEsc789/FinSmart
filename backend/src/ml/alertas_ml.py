from src.models.transaccion import Transaccion
from src.models.presupuesto import Presupuesto
from src.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from src.ml.prediccion import predecir_gasto
from src.ml.common import obtener_nombre_categoria

def verificar_presupuestos(usuario_id, db: Session = Depends(get_db)):
    presupuestos = db.query(Presupuesto).filter(Presupuesto.usuario_id == usuario_id).all()
    alertas = []
    
    for presupuesto in presupuestos:
        transacciones = (
            db.query(Transaccion).filter(
                Transaccion.usuario_id == usuario_id,
                Transaccion.categoria_id == presupuesto.categoria_id,
                Transaccion.tipo == "gasto",
                Transaccion.fecha >= presupuesto.fecha_inicio,
                Transaccion.fecha <= presupuesto.fecha_fin
            ).all()
        )
        total_gasto = round(sum(float(transaccion.monto) for transaccion in transacciones), 2)
        resultado = predecir_gasto(usuario_id, db)
        prediccion_monto = resultado.get("prediccion") or 0
        proyeccion_total = round(total_gasto + float(prediccion_monto), 2)
        limite = float(presupuesto.monto.limite)
        
        if proyeccion_total > limite:
            alertas.append(
                {
                    "categoria_id": str(presupuesto.categoria_id),
                    "categoria_nombre": obtener_nombre_categoria(presupuesto.categoria_id, db),
                    "mensaje": (
                        f"Tu categoria {obtener_nombre_categoria(presupuesto.categoria_id, db)} lleva ${total_gasto} "
                        f"y podria cerrar en ${proyeccion_total}, superando tu limite de ${limite}."
                    ),
                    "gastado_actual": total_gasto,
                    "limite": limite,
                    "proyeccion_total": proyeccion_total,
                }
            )
    return alertas
    