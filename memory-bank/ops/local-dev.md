# Local Development

## Setup inicial

### Prerrequisitos

-   **Node.js**: Versión >= 14 (recomendado: LTS más reciente)
-   **npm**: Incluido con Node.js
-   **Docker Desktop**: Para PostgreSQL
-   **Git**: Para clonar el repositorio

### Pasos de instalación

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd AI4Devs-backend-2510-R

# 2. Iniciar base de datos
docker-compose up -d

# 3. Verificar que PostgreSQL está corriendo
docker ps
# Debe mostrar contenedor postgres

# 4. Instalar dependencias backend
cd backend
npm install

# 5. Configurar variables de entorno
# Crear .env en la RAÍZ del proyecto (no en backend/) con:
# DATABASE_URL=postgresql://USER:PASSWORD@localhost:5433/DATABASE
# DB_NAME=mydatabase
# DB_PORT=5433
# DB_USER=postgres
# DB_PASSWORD=password
# (Ver docker-compose.yml para valores)

# 6. Generar Prisma Client
npx prisma generate

# 7. Aplicar migraciones
npx prisma migrate dev

# 8. (Opcional) Poblar con datos de prueba
ts-node prisma/seed.ts

# 9. Instalar dependencias frontend
cd ../frontend
npm install

# 10. Volver a raíz
cd ..
```

## Ejecutar en desarrollo

### Backend

```bash
cd backend

# Modo desarrollo (hot reload)
npm run dev

# O compilar y ejecutar
npm run build
npm start
```

**Backend disponible en**: http://localhost:3010

**Verificar**: `curl http://localhost:3010/` debe retornar "Hola LTI!"

### Frontend

```bash
cd frontend
npm start
```

**Frontend disponible en**: http://localhost:3000

**Nota**: Create React App abre automáticamente el navegador.

## Estructura de desarrollo

### Backend

```
backend/
├── src/
│   ├── index.ts              # Entry point - modificar para nuevas rutas
│   ├── routes/               # Añadir nuevas rutas aquí
│   ├── presentation/         # Añadir controladores aquí
│   ├── application/          # Añadir servicios y validadores aquí
│   └── domain/               # Añadir modelos aquí
├── prisma/
│   ├── schema.prisma         # Modificar schema aquí
│   └── migrations/           # Migraciones generadas automáticamente
└── dist/                     # Código compilado (no commitear)
```

### Frontend

```
frontend/
├── src/
│   ├── components/           # Añadir componentes React aquí
│   ├── services/             # Añadir servicios API aquí
│   └── App.tsx               # Componente raíz
└── public/                   # Archivos estáticos
```

## Comandos útiles

### Backend

```bash
# Desarrollo con hot reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar tests (si existen)
npm test

# Generar Prisma Client después de cambiar schema
npx prisma generate

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Ver datos en Prisma Studio (GUI)
npx prisma studio

# Resetear base de datos (CUIDADO: borra todo)
npx prisma migrate reset
```

### Frontend

```bash
# Desarrollo
npm start

# Build de producción
npm run build

# Tests (si existen)
npm test

# Eject de Create React App (irreversible)
npm run eject
```

### Docker

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v
```

## Debugging

### Backend

**Logs**: `console.log` en código (ver terminal donde corre `npm run dev`)

**Prisma queries**: Añadir en `backend/src/index.ts`:

```typescript
const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});
```

**Debugger**: Usar VS Code debugger con configuración:

```json
{
    "type": "node",
    "request": "launch",
    "name": "Debug Backend",
    "runtimeExecutable": "npm",
    "runtimeArgs": ["run", "dev"],
    "skipFiles": ["<node_internals>/**"]
}
```

### Frontend

**React DevTools**: Instalar extensión del navegador

**Logs**: `console.log` en componentes (ver consola del navegador)

**Network**: Ver requests en DevTools → Network

## Variables de entorno

### Backend

Crear `.env` en la **raíz del proyecto** (no en `backend/`):

```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/mydatabase
DB_NAME=mydatabase
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=password
PORT=3010
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
UPLOAD_PATH=./uploads
```

**Nota**: Actualmente algunas variables están hardcodeadas. Ver `backend/src/index.ts`.

**⚠️ Bugs conocidos con `.env`**:

1. **Bug de path en desarrollo**: Si el código usa `path.resolve(__dirname, '../../.env')`, en desarrollo con `ts-node-dev`, `__dirname` apunta a `backend/src`, haciendo que busque en `backend/.env` en lugar de la raíz. **Solución**: Usar `process.cwd()` o `path.resolve(process.cwd(), '.env')`.

2. **Bug de validación de variables vacías**: Si una validación usa checks falsy (`!process.env.VAR`), rechazará strings vacíos (`VAR=`) aunque la variable exista. **Solución**: Usar `process.env.VAR === undefined` o `!process.env.VAR || process.env.VAR.trim() === ''` según el caso.

### Frontend

Crear `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3010
```

**Nota**: Variables de React deben empezar con `REACT_APP_`.

## Problemas comunes

### 1. Error de conexión a BD

**Síntoma**: `PrismaClientInitializationError`

**Solución**:

```bash
# Verificar que Docker está corriendo
docker ps

# Reiniciar contenedor
docker-compose restart

# Verificar variables de entorno
cat .env
```

### 2. Puerto ya en uso

**Síntoma**: `EADDRINUSE: address already in use :::3010`

**Solución**:

```bash
# Encontrar proceso
lsof -i :3010  # Linux/Mac
netstat -ano | findstr :3010  # Windows

# Matar proceso o cambiar puerto en .env
```

### 3. Prisma Client no generado

**Síntoma**: `Cannot find module '@prisma/client'`

**Solución**:

```bash
cd backend
npx prisma generate
```

### 4. Migraciones pendientes

**Síntoma**: Errores de schema en Prisma

**Solución**:

```bash
cd backend
npx prisma migrate dev
```

### 5. CORS error en frontend

**Síntoma**: `Access-Control-Allow-Origin` error

**Solución**: Verificar que CORS en backend permite el origen del frontend. Actualmente hardcodeado a `localhost:3000`.

## Hot reload

### Backend

**ts-node-dev**: Reinicia automáticamente al cambiar archivos `.ts`

**Configurado en**: `backend/package.json` script `dev`

### Frontend

**Create React App**: Hot reload automático (Fast Refresh)

**No requiere configuración adicional**

## Base de datos local

### Acceso directo

```bash
# Conectarse con psql
docker exec -it <container-name> psql -U postgres -d mydatabase

# O desde host
psql -h localhost -p 5433 -U postgres -d mydatabase
```

### Prisma Studio (GUI)

```bash
cd backend
npx prisma studio
```

Abre en: http://localhost:5555

## Archivos de uploads

**Ubicación**: `../uploads/` (relativo a donde se ejecuta el backend)

**Problema**: Ruta relativa puede fallar.

**Solución temporal**: Crear carpeta `uploads/` en raíz del proyecto.

**Solución permanente**: Usar path absoluto o variable de entorno.
