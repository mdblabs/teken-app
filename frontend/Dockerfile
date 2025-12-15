# Frontend
FROM node:20-alpine

# Información del mantenedor
LABEL maintainer="mdblabs"
LABEL description="Teken App Frontend - Static Server"

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar archivos públicos
COPY public ./public

# Exponer puerto
EXPOSE 3001

# Variable de entorno
ENV NODE_ENV=development

# Comando por defecto
CMD ["npm", "run", "serve"]
