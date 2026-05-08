import firebase_admin
from firebase_admin import credentials, auth
import os

def inicializar_firebase():
    ruta_credenciales = os.getenv("FIREBASE_CREDENTIALS")
    print(f"Ruta credenciales Firebase: {ruta_credenciales}")
    cred = credentials.Certificate(ruta_credenciales)
    firebase_admin.initialize_app(cred)
    print("Firebase inicializado correctamente")

async def verificar_token(token: str):
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Error verificando token: {e}")
        return None