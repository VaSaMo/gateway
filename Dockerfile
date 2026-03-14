# Usamos una imagen ligera de Node.js
FROM node:18-slim

# Creamos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las librerías
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto que usa App Runner (8080 por defecto)
EXPOSE 8080

# Comando para arrancar
CMD ["node", "index.js"]