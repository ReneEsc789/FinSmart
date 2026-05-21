from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, field_validator


class MetaFinancieraBase(BaseModel):
    nombre: str
    monto_objetivo: float
    monto_actual: float = 0
    color: str = "#8B5CF6"

    @field_validator("nombre")
    @classmethod
    def validar_nombre(cls, value: str):
        if not value.strip():
            raise ValueError("El nombre no puede estar vacio")
        return value.strip()

    @field_validator("monto_objetivo", "monto_actual")
    @classmethod
    def validar_montos(cls, value: float):
        if value < 0:
            raise ValueError("Los montos no pueden ser negativos")
        return value


class MetaFinancieraCreate(MetaFinancieraBase):
    pass


class MetaFinancieraUpdate(BaseModel):
    nombre: Optional[str] = None
    monto_objetivo: Optional[float] = None
    monto_actual: Optional[float] = None
    color: Optional[str] = None

    @field_validator("nombre")
    @classmethod
    def validar_nombre(cls, value: Optional[str]):
        if value is None:
            return value
        if not value.strip():
            raise ValueError("El nombre no puede estar vacio")
        return value.strip()

    @field_validator("monto_objetivo", "monto_actual")
    @classmethod
    def validar_montos(cls, value: Optional[float]):
        if value is not None and value < 0:
            raise ValueError("Los montos no pueden ser negativos")
        return value


class MetaFinancieraResponse(MetaFinancieraBase):
    id: UUID
    usuario_id: UUID
    fecha_creacion: datetime

    class Config:
        from_attributes = True


class MetaFinancieraResponseModel(BaseModel):
    message: str
    data: Optional[MetaFinancieraResponse] = None

    class Config:
        from_attributes = True
