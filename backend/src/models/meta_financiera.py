from sqlalchemy import Column, Float, ForeignKey, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from src.database import Base


class MetaFinanciera(Base):
    __tablename__ = "metas_financieras"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    nombre = Column(String(120), nullable=False)
    monto_objetivo = Column(Float, nullable=False)
    monto_actual = Column(Float, nullable=False, default=0)
    color = Column(String(30), nullable=False, default="#8B5CF6")
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
