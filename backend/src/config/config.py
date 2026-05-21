import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError (
        "No esta configurada"
    )

ALGORITHM = os.getenv("ALGORITHM", "HS256")
if ALGORITHM not in ["HS256", "RS256"]:
    raise RuntimeError (f"ALGORITHM {ALGORITHM} no valido")

try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    if ACCESS_TOKEN_EXPIRE_MINUTES < 5 or ACCESS_TOKEN_EXPIRE_MINUTES > 1440:
        raise ValueError("Debe estar entre 5 y 1440 minutos")
except ValueError as e:
    raise RuntimeError(f"ACCESS_TOKEN_EXPIRE_MINUTES inválido: {e}")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL no configurada")
