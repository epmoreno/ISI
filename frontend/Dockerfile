# Usamos Node.js para el desarrollo
FROM node:20

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Exponemos el puerto por defecto de Vite
EXPOSE 5173

# Comando para iniciar el servidor de desarrollo de Vite
# --host es vital para que Docker pueda sacar el tráfico al exterior
CMD ["npm", "run", "dev", "--", "--host"]