FROM node:18-alpine

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto del backend
EXPOSE 5000

# Iniciamos en modo desarrollo (asegúrate de tener "dev" en tu package.json)
CMD ["npm", "run", "dev"]