from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.config.config import SECRET_KEY, ALGORITHM
from src.utils.logger import logger

security = HTTPBearer()

def verificar_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": True})
        return payload
    except ExpiredSignatureError:
        logger.warning("Token expirado intentado")
        raise HTTPException(
            status_code=401, 
            detail="Tu sesison ha expirado, por favor inicia sesión nuevamente"
        )
    except JWTError as e:
        logger.warning(f"Token invalido: {type(e).__name__}")
        raise HTTPException(
            status_code=401, 
            detail="Token invalido o expirado"
        )