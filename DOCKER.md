# 🐳 Docker Setup - Teken App

Guía completa para ejecutar Teken App con Docker y Docker Compose.

## 📋 Requisitos

- Docker >= 20.10
- Docker Compose >= 2.0

## 🚀 Inicio Rápido

### Opción 1: Levantar toda la aplicación (Recomendado)

Desde la raíz del proyecto:

```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes (¡cuidado! elimina la BD)
docker-compose down -v
```

Esto levantará:
- ✅ PostgreSQL en `localhost:5432`
- ✅ Backend API en `http://localhost:3000`
- ✅ Frontend en `http://localhost:3001`
- ✅ pgAdmin en `http://localhost:5050` (opcional)

### Opción 2: Solo Backend + PostgreSQL

```bash
cd backend
docker-compose up -d
```

### Opción 3: Solo Frontend

```bash
cd frontend
docker-compose up -d
```

## 🗄️ Acceso a los Servicios

### Backend API
- URL: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`
- Login: `POST http://localhost:3000/api/auth/login`

### Frontend
- URL: `http://localhost:3001`
- Login: `http://localhost:3001/index.html`

### PostgreSQL
- Host: `localhost`
- Puerto: `5432`
- Usuario: `teken_user`
- Password: `teken_password`
- Database: `teken_db`

### pgAdmin (Administración de BD)
- URL: `http://localhost:5050`
- Email: `admin@teken.app`
- Password: `admin`

**Conectar a PostgreSQL desde pgAdmin:**
1. Añadir nuevo servidor
2. Nombre: `Teken DB`
3. Host: `postgres` (nombre del contenedor)
4. Puerto: `5432`
5. Usuario: `teken_user`
6. Password: `teken_password`

## 📊 Base de Datos

### Estructura de Tablas

El script `backend/init.sql` crea automáticamente:

- `users` - Usuarios del sistema
- `sessions` - Sesiones de usuario
- `locations` - Ubicaciones compartidas
- `meetings` - Encuentros programados
- `meeting_participants` - Participantes en encuentros
- `connections` - Conexiones entre usuarios
- `messages` - Mensajes entre usuarios
- `notifications` - Notificaciones del sistema

### Usuario Demo

El sistema incluye un usuario demo pre-creado:
- **Email:** `demo@teken.app`
- **Password:** `demo123`

### Comandos Útiles de PostgreSQL

```bash
# Conectar a PostgreSQL desde el contenedor
docker exec -it teken-postgres psql -U teken_user -d teken_db

# Ver tablas
\dt

# Describir una tabla
\d users

# Ver usuarios
SELECT * FROM users;

# Salir
\q
```

## 🔧 Comandos Docker Útiles

### Ver servicios activos
```bash
docker-compose ps
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Reiniciar un servicio
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Reconstruir imágenes
```bash
# Reconstruir todo
docker-compose build

# Reconstruir un servicio específico
docker-compose build backend

# Reconstruir sin caché
docker-compose build --no-cache
```

### Acceder a un contenedor
```bash
# Backend
docker exec -it teken-backend sh

# Frontend
docker exec -it teken-frontend sh

# PostgreSQL
docker exec -it teken-postgres sh
```

### Limpiar todo
```bash
# Parar y eliminar contenedores
docker-compose down

# Parar, eliminar contenedores y volúmenes
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Limpieza completa (¡cuidado!)
docker-compose down -v --rmi all --remove-orphans
```

## 🔍 Troubleshooting

### El backend no se conecta a PostgreSQL

Espera a que PostgreSQL esté completamente iniciado:
```bash
docker-compose logs postgres
```

El backend tiene un healthcheck que espera a PostgreSQL.

### Puerto ya en uso

Si algún puerto está ocupado, puedes cambiarlos en `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Puerto host:Puerto contenedor
```

### Reinstalar dependencias

```bash
# Borrar node_modules y reinstalar
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Ver todos los contenedores (incluso parados)

```bash
docker ps -a
```

### Liberar espacio en Docker

```bash
# Limpiar contenedores, redes, imágenes y volúmenes no utilizados
docker system prune -a --volumes
```

## 🌍 Variables de Entorno

Las variables de entorno se configuran en:
- `docker-compose.yml` (raíz) - Para toda la aplicación
- `backend/.env` - Para desarrollo local
- `backend/docker-compose.yml` - Para backend independiente

### Cambiar variables en producción

Crea un archivo `.env` en la raíz:

```bash
# .env
POSTGRES_USER=production_user
POSTGRES_PASSWORD=super_secure_password
JWT_SECRET=super-secure-jwt-secret-key
NODE_ENV=production
```

Y actualiza `docker-compose.yml` para usar:
```yaml
env_file:
  - .env
```

## 📦 Volúmenes

### Datos persistentes

- `postgres_data` - Datos de PostgreSQL (persiste entre reinicios)
- `pgadmin_data` - Configuración de pgAdmin

### Eliminar datos

```bash
docker-compose down -v
```

## 🚀 Despliegue en Producción

### Cambios recomendados:

1. **Variables de entorno seguras**
   - Usar secretos fuertes
   - No commitear el archivo `.env`

2. **Volúmenes en producción**
   - Usar volúmenes con backup
   - Configurar backups automáticos de PostgreSQL

3. **Networking**
   - Usar redes privadas
   - Exponer solo los puertos necesarios

4. **Imágenes optimizadas**
   - Multi-stage builds
   - Imágenes de producción más pequeñas

5. **Logs**
   - Configurar logging driver
   - Rotación de logs

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## 🆘 Ayuda

Si encuentras problemas:
1. Revisa los logs: `docker-compose logs -f`
2. Verifica que los puertos no estén en uso
3. Asegúrate de tener Docker actualizado
4. Consulta la sección de Troubleshooting

---

**Hecho con ❤️ por mdblabs**
