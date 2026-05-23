from collections import defaultdict
from datetime import datetime, timedelta
from typing import Iterable
from sqlalchemy.orm import Session
from src.models.categoria import Categoria
from src.models.transaccion import Transaccion

def _comienzo_semana(value: datetime):
    return value - timedelta(days = value.weekday())

def obtener_gastos_usuario(usuario_id, db: Session):
    return (
        db.query(Transaccion).filter(
            Transaccion.usuario_id == usuario_id,
            Transaccion.tipo == "gasto"
        ).order_by(
            Transaccion.fecha.asc(),
            Transaccion.fecha_creacion.asc()
        ).all()
    )
    
def obtener_gastos_categoria(usuario_id, categoria_id, db: Session):
    return (
        db.query(Transaccion).filter(
            Transaccion.usuario_id == usuario_id,
            Transaccion.categoria_id == categoria_id,
            Transaccion.tipo == "gasto"
        ).order_by(
            Transaccion.fecha.asc(),
            Transaccion.fecha_creacion.asc()
        ).all()
    )

def gasto_semanal(transacciones: Iterable[Transaccion]):
    acumulado = defaultdict(float)
    for transaccion in transacciones:
        acumulado[_comienzo_semana(transaccion.fecha)] += float(transaccion.monto)

    semanas = sorted(acumulado.items(), key=lambda item: item[0])
    return [{"indice": index + 1, "semana_inicio": semana, "monto": monto} for index, (semana, monto) in enumerate(semanas)]


def obtener_nombre_categoria(categoria_id, db: Session):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    return categoria.nombre if categoria else "Categoria"
