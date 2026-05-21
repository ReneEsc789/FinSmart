from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from src.database import get_db
from src.models.usuario import Usuario
from src.schemas.usuario import UsuarioCreate, UsuarioResponseModel
from src.schemas.auth import UsuarioLogin, LoginResponse
from datetime import datetime, timedelta, timezone
from sqlalchemy import func
from src.utils.logger import logger
from src.config.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from src.middleware.rate_limiter import limiter
import os

router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hashear_contrasena(contrasena):
    return pwd_context.hash(contrasena)

def verificar_contrasena(contrasena: str, hash: str):
    return pwd_context.verify(contrasena, hash)

def crear_token(data: dict):
    datos = data.copy()
    expiracion = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    datos.update({"exp": expiracion})
    token = jwt.encode(datos, SECRET_KEY, algorithm=ALGORITHM)
    return token

@router.post("/registro", response_model= UsuarioResponseModel, status_code=201)
@limiter.limit("5/5minute")
def registrar(request: Request, usuario: UsuarioCreate, db: Session = Depends(get_db)):
    correo_formato = usuario.email.strip().lower()
    
    exist = db.query(Usuario).filter(func.lower(Usuario.email) == correo_formato).first()
    if exist:
        raise HTTPException(
            status_code=400, 
            detail="Ya existe un usuario con ese correo electronico"
        )
    
    try:
    
        nuevo_usuario = Usuario(
            nombre = usuario.nombre,
            email = correo_formato,
            contrasena_hash = hashear_contrasena(usuario.contrasena),
            moneda = usuario.moneda or "MXN",
            rol_id = usuario.rol_id or 2
        )
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        return UsuarioResponseModel(
            message = "Usuario registrado con exito", 
            data = nuevo_usuario
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error al registrar usuario: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno, por favor intente nuevamente")
    
@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/5minute")
def login(request: Request, response: Response, usuario: UsuarioLogin, db: Session = Depends(get_db)):
    correo_formato = usuario.email.strip().lower()
    correo = db.query(Usuario).filter(func.lower(Usuario.email) == correo_formato).first()
    
    if not correo:
        raise HTTPException(
            status_code=400, 
            detail= "Correo o contrasena incorrectos"
        )
    
    if not verificar_contrasena(usuario.contrasena, correo.contrasena_hash):
        raise HTTPException(
            status_code=400, 
            detail = "Correo o contrasena incorrectos"
        )
    
    token = crear_token({"sub": str(correo.id), "rol": correo.rol_id})
    
    response.set_cookie (
        key = "access_token",
        value = token,
        httponly = True,           
        secure = os.getenv("ENVIRONMENT") == "production",           
        samesite = "strict",      
        max_age = 3600,            
        path = "/"
    )
    
    return LoginResponse(
        message = "Login exitoso",
        access_token = token,
        token_type = "bearer",
        user_id = correo.id,
        rol_id = correo.rol_id
    )
        