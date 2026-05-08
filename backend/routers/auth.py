from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from db.mysql import obtener_db
from models.modelos_sql import Usuarios
from core.firebase import verificar_token

router = APIRouter(prefix="/auth", tags=["auth"])

# Dependencia para proteger endpoints — extrae y verifica el token de Firebase
async def obtener_usuario_actual(authorization: str = Header(...), db: Session = Depends(obtener_db)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")
    
    token = authorization.split(" ")[1]
    datos_token = await verificar_token(token)
    
    if not datos_token:
        raise HTTPException(status_code=401, detail="Token expirado o inválido")
    
    # Busca el usuario en MySQL por su uid de Firebase
    usuario = db.query(Usuario).filter(Usuario.firebase_uid == datos_token["uid"]).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return usuario

# Registro / Login — si el usuario no existe en MySQL lo crea automáticamente
@router.post("/sesion")
async def iniciar_sesion(authorization: str = Header(...), db: Session = Depends(obtener_db)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")
    
    token = authorization.split(" ")[1]
    datos_token = await verificar_token(token)
    
    if not datos_token:
        raise HTTPException(status_code=401, detail="Token expirado o inválido")
    
    # Busca si ya existe el usuario en MySQL
    usuario = db.query(Usuario).filter(Usuario.firebase_uid == datos_token["uid"]).first()
    
    # Si no existe lo crea automáticamente
    if not usuario:
        usuario = Usuario(
            firebase_uid=datos_token["uid"],
            email=datos_token.get("email", ""),
            username=datos_token.get("email", "").split("@")[0],
            rol="jugador"
        )
        db.add(usuario)
        db.commit()
        db.refresh(usuario)
        return {"mensaje": "Usuario registrado correctamente", "usuario_id": usuario.id}
    
    return {"mensaje": "Sesión iniciada correctamente", "usuario_id": usuario.id}