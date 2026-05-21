from sqlalchemy import Column, String, Integer
from src.database import Base

"""
Roles Disponibles:
-1 - Admin: acceso total de toda la app
-2 - User: acceso a sus propios datos
"""


class Rol(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True)
    nombre_rol = Column(String(20), nullable=False)