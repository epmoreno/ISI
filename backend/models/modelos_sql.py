from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.sql import func

class Base(DeclarativeBase):
    pass

class Usuarios(Base):
    __tablename__ = "usuarios"

    id         = Column(Integer, primary_key=True)
    firebase_uid = Column(String(128), unique=True, nullable=False)  # ← añade esta
    username     = Column(String(50),  unique=True, nullable=False)
    email        = Column(String(100), unique=True, nullable=False)
    password     = Column(String(255), nullable=True)                # ← ahora es opcional
    rol          = Column(Enum("jugador", "soporte", "superadmin"), default="jugador")
    creado_en    = Column(DateTime, server_default=func.now())        # Fecha de registro

class Carpetas(Base):
    __tablename__ = "carpetas"

    id         = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)  # Usuario propietario
    nombre     = Column(String(100), nullable=False)                      # Ej: "Favoritos"
    creado_en  = Column(DateTime, server_default=func.now())

class ListaJuegosUsuario(Base):
    __tablename__ = "lista_juegos"

    id           = Column(Integer, primary_key=True)
    usuario_id   = Column(Integer, ForeignKey("usuarios.id"),   nullable=False)  # Usuario propietario
    rawg_juego_id = Column(Integer, nullable=False)                           # Referencia al juego en MongoDB/RAWG
    carpeta_id   = Column(Integer, ForeignKey("carpetas.id"), nullable=True)   # NULL = sin carpeta asignada
    añadido_en   = Column(DateTime, server_default=func.now())