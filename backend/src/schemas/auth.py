from uuid import UUID

from pydantic import BaseModel, EmailStr, field_validator

class UsuarioLogin(BaseModel):
    email: EmailStr
    contrasena: str
    
    @field_validator("contrasena")
    @classmethod
    def vacio(cls, v):
        if v is not None and v.strip() == "":
            raise ValueError("La contrasena no puede estar vacia")
        if len(v) > 50:
            raise ValueError("La contrasena no puede tener mas de 50 caracteres")
        return v

class UsuarioRegistro(BaseModel):
    nombre: str
    email: EmailStr
    contrasena: str
    moneda: str = "MXN"
    
    @field_validator("nombre", "moneda")
    @classmethod
    def vacio(cls, v):
        if v is not None and v.strip() == "":
            raise ValueError("El campo no puede estar vacio")
        return v
    
    @field_validator("contrasena")
    @classmethod
    def validar_contrasena(cls, v):
        if v is not None and v.strip() == "":
            raise ValueError("La contrasena no puede estar vacia")
        
        if len(v) < 8:
            raise ValueError("La contrasena debe tener al menos 8 caracteres")
        
        if len(v) > 50:
            raise ValueError("La contrasena no puede tener mas de 50 caracteres")
        return v
class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str
    user_id: UUID
    rol_id: int