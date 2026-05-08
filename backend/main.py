from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.mongo import conectar_mongo, cerrar_mongo
from core.firebase import inicializar_firebase
from routers.auth import router as auth_router
import httpx
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    inicializar_firebase()
    await conectar_mongo()
    yield
    await cerrar_mongo()

app = FastAPI(lifespan=lifespan)
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("RAWG_API_KEY")

@app.get("/juegos")
async def obtener_juegos(pagina: int = 1):
    url = f"https://api.rawg.io/api/games?key={API_KEY}&page={pagina}&page_size=20"
    async with httpx.AsyncClient() as cliente:
        respuesta = await cliente.get(url)
    return respuesta.json()

@app.get("/juegos/{juego_id}")
async def obtener_detalle_juego(juego_id: int):
    url = f"https://api.rawg.io/api/games/{juego_id}?key={API_KEY}"
    async with httpx.AsyncClient() as cliente:
        respuesta = await cliente.get(url)
    return respuesta.json()

@app.get("/generos")
async def obtener_generos():
    url = f"https://api.rawg.io/api/genres?key={API_KEY}"
    async with httpx.AsyncClient() as cliente:
        respuesta = await cliente.get(url)
    return respuesta.json()