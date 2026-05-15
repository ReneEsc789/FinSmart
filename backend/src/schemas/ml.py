from pydantic import BaseModel
from typing import Optional

class PrediccionResponse(BaseModel):
    prediccion: Optional[float] = None
    mensaje: str
    promedio_semanal: Optional[float] = None
    tendencia: Optional[str] = None
    
class AnomaliasResponse(BaseModel):
    anomalia: bool = False
    mensaje: str
    monto_analizado: Optional[float] = None
    promedio_historico: Optional[float] = None
    
class ConsejosResponse(BaseModel):
    mensaje: Optional[str] = None
    consejo: str
    categoria_id: Optional[str] = None
    categoria_nombre: Optional[str] = None
    ahorro_estimado: Optional[float] = None
    
class AlertaPresupuestoResponse(BaseModel):
    categoria_id: str
    mensaje: str
    categoria_nombre: str
    gastado_actual: float
    limite: float
    proyeccion_total: float
    