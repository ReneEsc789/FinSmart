from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from src.database import get_db
from src.middleware.auth import verificar_token
from src.models.meta_financiera import MetaFinanciera
from src.schemas.meta_financiera import (
    MetaFinancieraCreate,
    MetaFinancieraResponse,
    MetaFinancieraResponseModel,
    MetaFinancieraUpdate,
)

router = APIRouter(prefix="/metas-financieras", tags=["Metas Financieras"])


@router.post("/", response_model=MetaFinancieraResponseModel, status_code=201)
def create_meta_financiera(
    meta: MetaFinancieraCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(verificar_token),
):
    usuario_id = payload.get("sub")

    existente = db.query(MetaFinanciera).filter(
        MetaFinanciera.usuario_id == usuario_id,
        func.lower(MetaFinanciera.nombre) == meta.nombre.lower(),
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe una meta con ese nombre")

    try:
        nueva_meta = MetaFinanciera(usuario_id=usuario_id, **meta.model_dump())
        db.add(nueva_meta)
        db.commit()
        db.refresh(nueva_meta)
        return MetaFinancieraResponseModel(message="Meta creada correctamente", data=nueva_meta)
    except Exception as error:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/", response_model=List[MetaFinancieraResponse])
def get_metas_financieras(db: Session = Depends(get_db), payload: dict = Depends(verificar_token)):
    usuario_id = payload.get("sub")
    try:
        return (
            db.query(MetaFinanciera)
            .filter(MetaFinanciera.usuario_id == usuario_id)
            .order_by(MetaFinanciera.fecha_creacion.desc())
            .all()
        )
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.patch("/{meta_id}", response_model=MetaFinancieraResponseModel)
def update_meta_financiera(
    meta_id: str,
    meta: MetaFinancieraUpdate,
    db: Session = Depends(get_db),
    payload: dict = Depends(verificar_token),
):
    usuario_id = payload.get("sub")

    try:
        parsed_id = UUID(meta_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID invalido")

    data = meta.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="Debes enviar al menos un campo para actualizar")

    try:
        meta_db = db.query(MetaFinanciera).filter(MetaFinanciera.id == parsed_id).first()
        if not meta_db:
            raise HTTPException(status_code=404, detail="Meta no encontrada")
        if str(meta_db.usuario_id) != usuario_id:
            raise HTTPException(status_code=403, detail="No tienes permiso para editar esta meta")

        if "nombre" in data:
          existente = db.query(MetaFinanciera).filter(
              MetaFinanciera.usuario_id == usuario_id,
              func.lower(MetaFinanciera.nombre) == data["nombre"].lower(),
              MetaFinanciera.id != parsed_id,
          ).first()
          if existente:
              raise HTTPException(status_code=400, detail="Ya existe una meta con ese nombre")

        for key, value in data.items():
            setattr(meta_db, key, value)

        db.commit()
        db.refresh(meta_db)
        return MetaFinancieraResponseModel(message="Meta actualizada correctamente", data=meta_db)
    except HTTPException:
        raise
    except Exception as error:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(error))


@router.delete("/{meta_id}", response_model=MetaFinancieraResponseModel)
def delete_meta_financiera(
    meta_id: str,
    db: Session = Depends(get_db),
    payload: dict = Depends(verificar_token),
):
    usuario_id = payload.get("sub")

    try:
        parsed_id = UUID(meta_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID invalido")

    try:
        meta_db = db.query(MetaFinanciera).filter(MetaFinanciera.id == parsed_id).first()
        if not meta_db:
            raise HTTPException(status_code=404, detail="Meta no encontrada")
        if str(meta_db.usuario_id) != usuario_id:
            raise HTTPException(status_code=403, detail="No tienes permiso para eliminar esta meta")

        db.delete(meta_db)
        db.commit()
        return MetaFinancieraResponseModel(message="Meta eliminada correctamente")
    except HTTPException:
        raise
    except Exception as error:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(error))
