from pydantic import BaseModel, EmailStr, field_validator, model_validator
from uuid import UUID
from datetime import datetime
from typing import Optional

class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
    moneda: str = "MXN"
    
    @field_validator("nombre", "email", "moneda")
    @classmethod
    def vacio(cls, v):
        if v is not None and v.strip() == "":
            raise ValueError("El campo no puede estar vacio")
        return v
    
class UsuarioCreate(UsuarioBase):
    rol_id: int = 2
    contrasena: str

    
class UsuarioUpdate(BaseModel): 
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    moneda: Optional[str] = None
    contrasena_actual: Optional[str] = None
    contrasena_nueva: Optional[str] = None
    confirmar_contrasena: Optional[str] = None
    
    class Config:
        extra = "forbid"
    
    @model_validator(mode="after")
    def validar_contrasena(self):
        cambiar = any([
            self.contrasena_actual,
            self.contrasena_nueva,
            self.confirmar_contrasena
        ])
        if not cambiar:
            return self
        
        if not self.contrasena_actual:
            raise ValueError("La contrasena actual es requerida para cambiar la contrasena")
        
        if not self.contrasena_nueva:
            raise ValueError("Debes proporcionar una nueva contrasena para cambiar la contrasena")
        
        if not self.confirmar_contrasena:
            raise ValueError("Debes confirmar la nueva contrasena para cambiar la contrasena")
        
        if self.contrasena_nueva != self.confirmar_contrasena:
            raise ValueError("Las contrasenas no coinciden")
        
        if len(self.contrasena_nueva.strip()) < 8:
            raise ValueError("La nueva contrasena debe tener al menos 8 caracteres")
        
        if len(self.contrasena_nueva.strip()) > 50:
            raise ValueError("La nueva contrasena no puede tener mas de 50 caracteres")
        
        return self

class UsuarioResponse(UsuarioBase):
    id: UUID
    rol_id: int
    fecha_creacion: datetime
    
    class Config:
        from_attributes = True
        
class UsuarioResponseModel(BaseModel):
    message: str
    data: Optional[UsuarioResponse] = None
    
    class Config: 
        from_attributes = True
