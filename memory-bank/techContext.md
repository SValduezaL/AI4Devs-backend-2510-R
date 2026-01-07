# Tech Context

## Stack

### Backend

-   **Runtime**: Node.js (versión no especificada, inferida: >=14 por dependencias)
-   **Lenguaje**: TypeScript 4.9.5
-   **Framework**: Express 4.19.2
-   **ORM**: Prisma 5.13.0
-   **Base de datos**: PostgreSQL (via Docker)
-   **File upload**: Multer 1.4.5-lts.1
-   **API Docs**: swagger-jsdoc 6.2.8, swagger-ui-express 5.0.0
-   **CORS**: cors 2.8.5

### Frontend

-   **Framework**: React 18.3.1
-   **Lenguaje**: TypeScript 4.9.5 (también JavaScript en algunos componentes)
-   **Build tool**: react-scripts 5.0.1 (Create React App)
-   **UI Library**: React Bootstrap 2.10.2, Bootstrap 5.3.3
-   **Routing**: react-router-dom 6.23.1
-   **Date picker**: react-datepicker 6.9.0
-   **Icons**: react-bootstrap-icons 1.11.4

### DevOps / Infraestructura

-   **Containerización**: Docker Compose
-   **Base de datos**: PostgreSQL (imagen oficial)
-   **Gestor de paquetes**: npm (package-lock.json presente)

## Dependencias clave y para qué

### Backend (`backend/package.json`)

**Producción:**

-   `@prisma/client`: Cliente Prisma para queries a BD
-   `express`: Framework web
-   `cors`: Middleware CORS
-   `multer`: Manejo de multipart/form-data (uploads)
-   `swagger-jsdoc` + `swagger-ui-express`: Documentación API
-   `dotenv`: Variables de entorno

**Desarrollo:**

-   `typescript`: Compilador TS
-   `ts-node`, `ts-node-dev`: Ejecutar TS sin compilar
-   `jest`, `ts-jest`: Testing (configurado, 54 tests implementados ✅)
-   `js-yaml`, `@types/js-yaml`: Para validación de especificación OpenAPI en tests
-   `@types/*`: Type definitions
-   `eslint`, `prettier`: Linting y formatting
-   `prisma`: CLI de Prisma

### Frontend (`frontend/package.json`)

**Producción:**

-   `react`, `react-dom`: Core React
-   `react-router-dom`: Routing
-   `react-bootstrap`, `bootstrap`: UI components
-   `react-datepicker`: Date inputs
-   `react-bootstrap-icons`: Iconos

**Desarrollo:**

-   `@testing-library/*`: Testing utilities (no usado)
-   `typescript`: Type checking
-   `react-scripts`: Build tooling (webpack, babel, etc.)

## Setup local exacto

### Prerrequisitos

-   Node.js (versión no especificada, asumir >=14)
-   npm
-   Docker Desktop (para PostgreSQL)

### Comandos paso a paso

```bash
# 1. Clonar repo (asumido)
git clone <repo-url>
cd AI4Devs-backend-2510-R

# 2. Iniciar base de datos
docker-compose up -d

# 3. Instalar dependencias backend
cd backend
npm install

# 4. Configurar Prisma
npx prisma generate
npx prisma migrate dev

# 5. (Opcional) Seed de datos
ts-node prisma/seed.ts

# 6. Iniciar backend (desarrollo)
npm run dev
# O compilar y ejecutar producción:
npm run build
npm start

# 7. En otra terminal: Instalar dependencias frontend
cd frontend
npm install

# 8. Iniciar frontend
npm start
```

### URLs locales

-   **Backend**: http://localhost:3010
-   **Frontend**: http://localhost:3000
-   **PostgreSQL**: localhost:5433

## Config/Env: Variables de entorno

### Detectadas en código

**Backend** (`.env` en **raíz del proyecto**, no en `backend/`):

-   `DATABASE_URL`: Connection string de PostgreSQL
    -   Formato: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
    -   Ejemplo en schema: `postgresql://LTIdbUser:D1ymf8wyQEGthFR1E9xhCq@localhost:5433/LTIdb`
-   `DB_NAME`: Nombre de base de datos (usado por docker-compose)
-   `DB_PORT`: Puerto PostgreSQL (usado por docker-compose)
-   `DB_USER`: Usuario PostgreSQL (usado por docker-compose)
-   `DB_PASSWORD`: Contraseña PostgreSQL (usado por docker-compose)

**Docker Compose** (`docker-compose.yml`):

-   Usa las mismas variables del `.env` de la raíz: `DB_PASSWORD`, `DB_USER`, `DB_NAME`, `DB_PORT`

**⚠️ IMPORTANTE**: El archivo `.env` está en la **raíz del proyecto**, no en `backend/`. El código usa `dotenv.config()` que busca el archivo desde el directorio de trabajo actual.

**Frontend**:

-   No se detectan variables de entorno en código (posible `.env` para `REACT_APP_API_URL`)

### Variables no detectadas pero probables

-   `PORT` (backend, default 3010 hardcodeado)
-   `NODE_ENV` (development/production)
-   `REACT_APP_API_URL` (frontend, para apuntar a backend)

**⚠️ IMPORTANTE**: No incluir valores reales de `.env` en el repo. Usar `.env.example` si existe.

## Restricciones: Versiones, compatibilidades, limitaciones

### Versiones específicas

-   **TypeScript**: 4.9.5 (ambos proyectos)
-   **Prisma**: 5.13.0
-   **React**: 18.3.1
-   **Express**: 4.19.2

### Compatibilidades

-   **Node.js**: No especificado, pero Prisma 5.x requiere Node >=14
-   **PostgreSQL**: Versión no especificada (imagen `postgres` latest en docker-compose)
-   **Navegadores**: React Scripts 5.0.1 soporta navegadores modernos (ver `browserslist` en `frontend/package.json`)

### Limitaciones de entorno

1. **CORS hardcodeado**: Solo `http://localhost:3000` permitido

    - **Dónde**: `backend/src/index.ts:34-37`
    - **Impacto**: No funciona en producción sin cambiar

2. **Ruta de uploads relativa**: `../uploads/` en `fileUploadService.ts:6`

    - **Riesgo**: Depende del working directory al ejecutar
    - **Solución**: Usar path absoluto o variable de entorno

3. **Puerto hardcodeado**: `3010` en `backend/src/index.ts:50`

    - **Solución**: Usar `process.env.PORT || 3010`

4. **Prisma Client singleton**: Instancia global en `index.ts:19`

    - **Riesgo**: Puede causar problemas en tests o múltiples instancias

5. **Sin gestión de conexión BD**: Prisma Client no se cierra explícitamente
    - **Riesgo**: Conexiones abiertas en shutdown

### Dependencias desactualizadas (potencial)

-   TypeScript 4.9.5 (actual es 5.x)
-   Algunas dependencias pueden tener vulnerabilidades (verificar con `npm audit`)

## Scripts disponibles

### Backend (`backend/package.json`)

```bash
npm start          # Ejecuta dist/index.js (requiere build)
npm run dev        # Desarrollo con ts-node-dev (hot reload)
npm run build      # Compila TypeScript a dist/
npm test           # Ejecuta Jest (54 tests unitarios implementados)
npm run prisma:generate  # Genera Prisma Client
npm run start:prod # Build + start
```

### Frontend (`frontend/package.json`)

```bash
npm start          # Dev server (http://localhost:3000)
npm run build      # Build de producción
npm test           # Ejecuta tests (Jest, sin tests)
npm run eject      # Eject de Create React App (irreversible)
```

### Root (`package.json`)

```bash
# Solo tiene dotenv como dependencia
# Prisma schema apunta a backend/prisma/schema.prisma
```
