from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from db.mysql import obtener_db
from models.modelos_sql import Usuarios, ListaJuegosUsuario
from core.firebase import verificar_token

router = APIRouter(prefix="/biblioteca", tags=["biblioteca"])

async def obtener_usuario(authorization: str = Header(...), db: Session = Depends(obtener_db)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")
    token = authorization.split(" ")[1]
    datos_token = await verificar_token(token)
    if not datos_token:
        raise HTTPException(status_code=401, detail="Token inválido")
    usuario = db.query(Usuarios).filter(Usuarios.firebase_uid == datos_token["uid"]).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.get("/")
async def obtener_biblioteca(usuario = Depends(obtener_usuario), db: Session = Depends(obtener_db)):
    juegos = db.query(ListaJuegosUsuario).filter(ListaJuegosUsuario.usuario_id == usuario.id).all()
    return {"juegos": [{"id": j.id, "rawg_juego_id": j.rawg_juego_id, "carpeta_id": j.carpeta_id} for j in juegos]}

@router.post("/agregar/{rawg_juego_id}")
async def agregar_juego(rawg_juego_id: int, usuario = Depends(obtener_usuario), db: Session = Depends(obtener_db)):
    existe = db.query(ListaJuegosUsuario).filter(
        ListaJuegosUsuario.usuario_id == usuario.id,
        ListaJuegosUsuario.rawg_juego_id == rawg_juego_id
    ).first()
    if existe:
        raise HTTPException(status_code=400, detail="El juego ya está en tu biblioteca")
    juego = ListaJuegosUsuario(usuario_id=usuario.id, rawg_juego_id=rawg_juego_id)
    db.add(juego)
    db.commit()
    return {"mensaje": "Juego añadido correctamente"}

@router.delete("/eliminar/{rawg_juego_id}")
async def eliminar_juego(rawg_juego_id: int, usuario = Depends(obtener_usuario), db: Session = Depends(obtener_db)):
    juego = db.query(ListaJuegosUsuario).filter(
        ListaJuegosUsuario.usuario_id == usuario.id,
        ListaJuegosUsuario.rawg_juego_id == rawg_juego_id
    ).first()
    if not juego:
        raise HTTPException(status_code=404, detail="Juego no encontrado en tu biblioteca")
    db.delete(juego)
    db.commit()
    return {"mensaje": "Juego eliminado correctamente"}