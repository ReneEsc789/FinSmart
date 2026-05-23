from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from src.database import get_db
from src.models.transaccion import Transaccion
from src.models.categoria import Categoria
from src.schemas.transaccion import TransaccionCreate, TransaccionResponse, TransaccionResponseModel, TransaccionUpdate, TransaccionListResponse
from src.models.cuenta import Cuenta
from src.middleware.auth import verificar_token
from sqlalchemy import or_
from typing import List
from uuid import UUID

router = APIRouter(prefix="/transacciones", tags=["Transacciones"])

@router.post("/", response_model=TransaccionResponseModel, status_code=201)
def create_transaccion(transaccion: TransaccionCreate, db: Session = Depends(get_db), payload: dict = Depends(verificar_token)):
    usuario_id = payload.get("sub")
    try:
        cuenta = db.query(Cuenta).filter(Cuenta.id == transaccion.cuenta_id).first()
        if not cuenta: 
            raise HTTPException(status_code=404, detail="Cuenta no encontrada")
        if str(cuenta.usuario_id) != usuario_id:
            raise HTTPException(status_code=400, detail="No tienes permiso para usar esta cuenta")
        
        categoria = (
            db.query(Categoria)
            .filter(Categoria.id == transaccion.categoria_id, or_(Categoria.es_default.is_(True), Categoria.usuario_id == usuario_id))
            .first()
        )
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoria no encontrada o no autorizada")
        nueva_transaccion = Transaccion(
            monto = transaccion.monto,
            tipo = transaccion.tipo,
            nota = transaccion.nota,
            fecha = transaccion.fecha,
            usuario_id = usuario_id,
            cuenta_id = transaccion.cuenta_id,
            categoria_id = transaccion.categoria_id
        )
        if transaccion.tipo == "ingreso":
            cuenta.saldo_actual += transaccion.monto
        elif transaccion.tipo == "gasto":
            cuenta.saldo_actual -= transaccion.monto
            
        db.add(nueva_transaccion)
        db.commit()
        db.refresh(nueva_transaccion)
        return TransaccionResponseModel(message="Transaccion creada correctamente", data=nueva_transaccion)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/", response_model = TransaccionListResponse)
def get_transacciones(limit: int = Query(20, ge = 1, le = 100), offset: int = Query(0, ge = 0), db: Session = Depends(get_db), payload: dict = Depends(verificar_token)):
    usuario_id = payload.get("sub")
    try:
        base_query = db.query(Transaccion).filter(Transaccion.usuario_id == usuario_id)
        total = base_query.count()
        transacciones = (
            base_query.order_by(Transaccion.fecha.desc(), Transaccion.fecha_creacion.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        return TransaccionListResponse (
            items = transacciones,
            total = total,
            limit = limit,
            offset = offset,
            has_more = offset + len(transacciones) < total
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{id}", response_model=TransaccionResponse)
def get_transaccion_by_id(id: str, db: Session = Depends(get_db), payload: dict = Depends(verificar_token)):
    usuario_id = payload.get("sub")
    
    try:
        id = UUID(id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID invalido")
    
    try:
        transaccion = db.query(Transaccion).filter(Transaccion.id == id).first()
        if not transaccion:
            raise HTTPException(status_code=404, detail="Transaccion no encontrada")
        if str(transaccion.usuario_id) != usuario_id:
            raise HTTPException(status_code=403, detail="No tienes permiso para ver esta transaccion")
        return transaccion
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{id}", response_model=TransaccionResponseModel)
def update_transaccion(id: str, transaccion: TransaccionUpdate, db: Session = Depends(get_db), payload: dict = Depends(verificar_token)):
    usuario_id = payload.get("sub")

    try:
        id = UUID(id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID invalido")

    data = transaccion.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="Debes enviar al menos un campo para actualizar")

    try:
        transaccion_db = db.query(Transaccion).filter(Transaccion.id == id).first()
        if not transaccion_db:
            raise HTTPException(status_code=404, detail="Transaccion no encontrada")
        if str(transaccion_db.usuario_id) != usuario_id:
            raise HTTPException(status_code=403, detail="No tienes permiso para editar esta transaccion")

        cuenta_actual = db.query(Cuenta).filter(Cuenta.id == transaccion_db.cuenta_id).first()
        if not cuenta_actual:
            raise HTTPException(status_code=404, detail="Cuenta actual no encontrada")

        if transaccion_db.tipo == "ingreso":
            cuenta_actual.saldo_actual -= transaccion_db.monto
        elif transaccion_db.tipo == "gasto":
            cuenta_actual.saldo_actual += transaccion_db.monto

        cuenta_destino = cuenta_actual
        if "cuenta_id" in data:
            cuenta_destino = db.query(Cuenta).filter(Cuenta.id == data["cuenta_id"]).first()
            if not cuenta_destino:
                raise HTTPException(status_code=404, detail="Cuenta no encontrada")
            if str(cuenta_destino.usuario_id) != usuario_id:
                raise HTTPException(status_code=400, detail="No tienes permiso para usar esta cuenta")

        if "categoria_id" in data:
            categoria = (
                db.query(Categoria)
                .filter(Categoria.id == data["categoria_id"], or_(Categoria.es_default.is_(True), Categoria.usuario_id == usuario_id))
                .first()
            )
            if not categoria:
                raise HTTPException(status_code=404, detail="Categoria no encontrada o no autorizada")

        nuevo_monto = data.get("monto", transaccion_db.monto)
        nuevo_tipo = data.get("tipo", transaccion_db.tipo)

        for key, value in data.items():
            setattr(transaccion_db, key, value)

        if nuevo_tipo == "ingreso":
            cuenta_destino.saldo_actual += nuevo_monto
        elif nuevo_tipo == "gasto":
            cuenta_destino.saldo_actual -= nuevo_monto

        db.commit()
        db.refresh(transaccion_db)
        return TransaccionResponseModel(message="Transaccion actualizada correctamente", data=transaccion_db)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
            
@router.delete("/{id}", response_model=TransaccionResponseModel)
def delete_transaccion(id: str, db: Session = Depends(get_db), payload: dict = Depends(verificar_token)):
    usuario_id = payload.get("sub")
    
    try:
        id = UUID(id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID invalido")
    
    try:
        transaccion = db.query(Transaccion).filter(Transaccion.id == id).first()
        if not transaccion:
            raise HTTPException(status_code=404, detail="Transaccion no encontrada")
        if str(transaccion.usuario_id) != usuario_id:
            raise HTTPException(status_code=403, detail="No esta autorizado para eliminar este campo")
        cuenta = db.query(Cuenta).filter(Cuenta.id == transaccion.cuenta_id).first()
        if transaccion.tipo == "ingreso":
            cuenta.saldo_actual -= transaccion.monto
        elif transaccion.tipo == "gasto":
            cuenta.saldo_actual += transaccion.monto
        db.delete(transaccion)
        db.commit()
        return TransaccionResponseModel(message="Transaccion eliminada correctamente")
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
