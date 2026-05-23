from fastapi import Depends
from sqlalchemy.orm import Session

from src.database import get_db
from src.ml.common import obtener_nombre_categoria
from src.ml.prediccion import predecir_gasto
from src.models.alerta import Alerta
from src.models.presupuesto import Presupuesto
from src.models.transaccion import Transaccion

def verificar_presupuestos(usuario_id, db: Session = Depends(get_db)):
    presupuestos = db.query(Presupuesto).filter(Presupuesto.usuario_id == usuario_id).all()
    alertas = []
    resultado = predecir_gasto(usuario_id, db)
    prediccion_monto = float(resultado.get("prediccion") or 0)
    promedio_semanal = float(resultado.get("promedio_semanal") or 0)
    
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
        if prediccion_monto > 0:
            proyeccion_total = round(max(total_gasto, prediccion_monto), 2)
        elif promedio_semanal > 0:
            proyeccion_total = round(total_gasto + (promedio_semanal / 4), 2)
        else:
            proyeccion_total = total_gasto
        limite = float(presupuesto.monto_limite)
        categoria_nombre = obtener_nombre_categoria(presupuesto.categoria_id, db)

        if proyeccion_total > limite:
            mensaje = (
                f"Tu categoria {categoria_nombre} lleva ${total_gasto} "
                f"y podria cerrar en ${proyeccion_total}, superando tu limite de ${limite}."
            )
            alertas.append(
                {
                    "categoria_id": str(presupuesto.categoria_id),
                    "categoria_nombre": categoria_nombre,
                    "mensaje": mensaje,
                    "gastado_actual": total_gasto,
                    "limite": limite,
                    "proyeccion_total": proyeccion_total,
                }
            )

            existente = db.query(Alerta).filter(
                Alerta.usuario_id == usuario_id,
                Alerta.tipo_alerta == "presupuesto",
                Alerta.mensaje == mensaje,
                Alerta.leida.is_(False),
            ).first()
            if not existente:
                db.add(
                    Alerta(
                        usuario_id=usuario_id,
                        tipo_alerta="presupuesto",
                        mensaje=mensaje,
                        valor_detectado=proyeccion_total,
                    )
                )

    if db.new:
        db.commit()
    return alertas
    
