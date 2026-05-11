from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime

class Juego(Document):
    rawg_id:      int                    # ID del juego en RAWG, clave principal de búsqueda
    titulo:       str
    descripcion:  Optional[str]
    metacritic:   Optional[int]
    fecha_salida: Optional[str]
    generos:      list[str] = []         # Ej: ["Acción", "RPG"]
    plataformas:  list[str] = []         # Ej: ["PC", "PlayStation"]
    capturas:     list[str] = []         # URLs de las capturas de pantalla
    url_rawg:     Optional[str]          # Enlace oficial en RAWG
    cached_at:    datetime = Field(default_factory=datetime.utcnow)  # Fecha de caché

    class Settings:
        name = "juegos"                  # Nombre de la colección en MongoDB  