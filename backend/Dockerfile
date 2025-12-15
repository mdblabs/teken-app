# Backend Node.js
FROM node:20-alpine

# Información del mantenedor
LABEL maintainer="mdblabs"
LABEL description="Teken App Backend - Node.js/Express"

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 3000

# Variable de entorno
ENV NODE_ENV=development

# Comando por defecto
CMD ["npm", "run", "dev"]
