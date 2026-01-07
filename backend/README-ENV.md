# Configuración de Variables de Entorno

## Arquitectura: Un solo `.env` en la raíz

Este proyecto usa **un solo archivo `.env` en la raíz del proyecto** (no en `backend/`). Esta es la mejor práctica para monorepos porque:

- ✅ **Una sola fuente de verdad**: Todas las variables en un lugar
- ✅ **Sin duplicación**: Evita inconsistencias entre archivos
- ✅ **Compartido con Docker**: `docker-compose.yml` también lee de la raíz
- ✅ **Más fácil de mantener**: Un solo archivo que actualizar

## Cómo funciona

### 1. Código de la aplicación (`backend/src/index.ts`)

El código carga el `.env` de la raíz usando `path.resolve`:

```typescript
import dotenv from 'dotenv';
import path from 'path';

// Cargar .env desde la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
```

**Funciona en:**

- ✅ Desarrollo: `__dirname` = `backend/src` → sube 2 niveles → raíz
- ✅ Producción: `__dirname` = `backend/dist` → sube 2 niveles → raíz

### 2. Comandos de Prisma CLI

Los comandos de Prisma usan `dotenv-cli` para cargar el `.env` de la raíz:

```json
{
  "scripts": {
    "prisma:generate": "dotenv -e ../.env -- npx prisma generate",
    "prisma:migrate": "dotenv -e ../.env -- npx prisma migrate dev",
    "prisma:studio": "dotenv -e ../.env -- npx prisma studio"
  }
}
```

## Uso

### Comandos normales (desde `backend/`)

```bash
# Generar Prisma Client
npm run prisma:generate

# Aplicar migraciones
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio

# Seed de datos
npm run prisma:seed
```

### Si necesitas ejecutar Prisma directamente

Si ejecutas `npx prisma` directamente, necesitas especificar el `.env`:

```bash
# Opción 1: Usar dotenv-cli manualmente
dotenv -e ../.env -- npx prisma migrate dev

# Opción 2: Establecer variable de entorno
$env:DATABASE_URL = "postgresql://USER:PASS@localhost:5433/DB"; npx prisma migrate dev
```

## Estructura del `.env` (en la raíz)

```env
# Base de datos
DATABASE_URL=postgresql://LTIdbUser:PASSWORD@localhost:5433/LTIdb
DB_NAME=LTIdb
DB_PORT=5433
DB_USER=LTIdbUser
DB_PASSWORD=tu_password

# Backend
PORT=3010
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
UPLOAD_PATH=./uploads
```

## Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"

**Causa**: Prisma no encuentra el `.env`

**Solución**: Usa los scripts de npm que ya están configurados:

```bash
npm run prisma:migrate  # ✅ Correcto
npx prisma migrate dev  # ❌ No funcionará sin dotenv-cli
```

### Error: "Can't reach database server"

**Causa**: Docker no está corriendo o puerto incorrecto

**Solución**:

```bash
# Verificar Docker
docker ps

# Verificar puerto en .env (debe ser 5433)
cat .env | grep DB_PORT
```

### El backend no carga las variables

**Causa**: El path del `.env` no es correcto

**Solución**: Verifica que `backend/src/index.ts` tenga:

```typescript
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
```
