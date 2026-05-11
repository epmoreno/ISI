import firebase_admin
from firebase_admin import credentials, auth
import os
from concurrent.futures import ThreadPoolExecutor
import asyncio

def inicializar_firebase():
    ruta_credenciales = os.getenv("FIREBASE_CREDENTIALS")
    print(f"Ruta credenciales Firebase: {ruta_credenciales}")
    cred = credentials.Certificate(ruta_credenciales)
    firebase_admin.initialize_app(cred)
    print("Firebase inicializado correctamente")

async def verificar_token(token: str):
    try:
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as pool:
            decoded_token = await loop.run_in_executor(
                pool, lambda: auth.verify_id_token(token)
            )
        return decoded_token
    except Exception as e:
        print(f"Error verificando token: {e}")
        return None