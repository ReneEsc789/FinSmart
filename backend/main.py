from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware  # ← agregar
from dotenv import load_dotenv
from src.routers.auth import router as auth_router
from src.routers.alerta import router as alertas_router
from src.routers.categoria import router as categorias_router
from src.routers.cuenta import router as cuentas_router
from src.routers.meta_financiera import router as metas_financieras_router
from src.routers.presupuesto import router as presupuestos_router
from src.routers.transaccion import router as transacciones_router
from src.routers.usuario import router as usuarios_router
from src.routers.rol import router as roles_router
from src.routers.ml import router as ml_routers
from src.utils.logger import logger
from src.middleware.rate_limiter import setup_rate_limiter
import os

load_dotenv()

app = FastAPI(title="FinSmart API", version="1.0.0")

limiter = setup_rate_limiter(app)

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
logger.info(f"Iniciando en ambiente: {ENVIRONMENT}")

if ENVIRONMENT == "production":
    app.add_middleware(HTTPSRedirectMiddleware)  # ← agregar
    allowed_origins = [
        "https://finsmart.vercel.app",
    ]
    allowed_methods = ["GET", "POST", "PATCH", "DELETE"]
    allowed_headers = ["Content-Type", "Authorization"]
    logger.info(f"Produccion: {allowed_origins}")
else:
    allowed_origins = [
        "http://localhost:5173",
    ]
    allowed_methods = ["*"]
    allowed_headers = ["*"]
    logger.info(f"Desarrollo: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=allowed_methods,
    allow_headers=allowed_headers,
    max_age=3600,
)

app.include_router(auth_router)
app.include_router(alertas_router)
app.include_router(categorias_router)
app.include_router(cuentas_router)
app.include_router(metas_financieras_router)
app.include_router(presupuestos_router)
app.include_router(transacciones_router)
app.include_router(usuarios_router)
app.include_router(roles_router)
app.include_router(ml_routers)

@app.get("/")
def root():
    return {"message": "FinSmart API running", "environment": ENVIRONMENT}
