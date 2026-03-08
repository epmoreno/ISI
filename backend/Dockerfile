# Usamos una imagen ligera de Python
FROM python:3.11

# Evita que Python genere archivos .pyc y permite ver logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Establecemos el directorio de trabajo
WORKDIR /app

# Instalamos las librerías necesarias
# Tip: Crea un archivo requirements.txt en /backend con: fastapi, uvicorn, requests
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de FastAPI
EXPOSE 8000

# Comando para ejecutar con "Live Reload" (recarga automática)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]