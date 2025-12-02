FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# El "--host" es obligatorio para que Vite funcione en Docker
CMD ["npm", "run", "dev", "--", "--host"]