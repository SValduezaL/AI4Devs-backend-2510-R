# Progress

## Qué funciona hoy

### Backend API

✅ **Servidor Express funcionando**

-   Inicia en puerto 3010
-   Middleware configurado (JSON, CORS, Prisma injection)
-   Manejo básico de errores

✅ **Endpoints operativos**:

-   `POST /candidates` - Crea candidatos con validación
-   `GET /candidates/:id` - Obtiene candidato con relaciones (educación, experiencia, CVs, aplicaciones)
-   `POST /upload` - Sube archivos PDF/DOCX (máx 10MB)

✅ **Validación de datos**:

-   Nombres: regex + longitud (2-100)
-   Email: regex + unique constraint
-   Teléfono: regex español (6|7|9 seguido de 8 dígitos)
-   Fechas: formato YYYY-MM-DD
-   Educación y experiencia: validación de campos

✅ **Base de datos**:

-   Schema Prisma completo y funcional
-   Migraciones aplicadas
-   Seed script disponible
-   Relaciones funcionando (1:N, N:1)

✅ **Subida de archivos**:

-   Filtro de tipos (PDF, DOCX)
-   Límite de tamaño (10MB)
-   Almacenamiento en disco

### Frontend

✅ **Aplicación React funcionando**

-   Inicia en puerto 3000
-   Routing configurado (React Router)
-   Componentes Bootstrap renderizando

✅ **Componentes presentes**:

-   `RecruiterDashboard` - Dashboard principal
-   `AddCandidateForm` - Formulario (no verificado funcionalidad completa)
-   `FileUploader` - Upload de archivos (no verificado funcionalidad completa)

### Infraestructura

✅ **Docker Compose**:

-   PostgreSQL containerizable
-   Variables de entorno configurables

✅ **Build process**:

-   Backend compila TypeScript a JavaScript
-   Frontend tiene build de producción

## Qué falta / TODOs detectados en código

### En código (grep TODO/FIXME)

**No se encontraron comentarios TODO/FIXME** en el código fuente.

### Detectados por análisis

1. **Tests ausentes**:

    - Carpeta `backend/src/tests/` mencionada en README pero no existe
    - `jest.config.js` configurado pero sin tests
    - Frontend tiene `@testing-library/*` pero sin tests

2. **Inconsistencias arquitectónicas**:

    - `candidateRoutes.ts` no usa el controlador `addCandidateController`
    - Llamada directa a servicio desde ruta

3. **Funcionalidades incompletas**:

    - Modelos de dominio existen pero sin endpoints:
        - `Position`, `Company`, `Employee`, `Application`, `Interview`
    - No hay CRUD completo (solo CREATE y READ de Candidate)

4. **Documentación API**:

    - `api-spec.yaml` existe pero no está integrado con Swagger UI en Express
    - Endpoints no documentados en código (swagger-jsdoc no usado)

5. **Configuración**:

    - Variables hardcodeadas (puerto, CORS, ruta uploads)
    - Sin `.env.example`

6. **Frontend**:
    - Componentes presentes pero funcionalidad no verificada
    - Posible falta de manejo de errores en llamadas API
    - Sin estado global (Redux/Context) si se necesita

## Known issues: Errores comunes, deuda técnica

### Errores comunes

1. **Error de conexión a BD**:

    - Si PostgreSQL no está corriendo: `PrismaClientInitializationError`
    - Mensaje en español pero genérico
    - **Solución**: Verificar `docker-compose up -d`

2. **Email duplicado**:

    - Error `P2002` de Prisma
    - Mensaje claro: "The email already exists in the database"
    - **Prevención**: Validar antes de insertar (no implementado)

3. **Archivo inválido**:

    - Respuesta 400 si tipo no es PDF/DOCX
    - Mensaje: "Invalid file type, only PDF and DOCX are allowed!"
    - **Mejora**: Validar antes de subir (frontend)

4. **Candidato no encontrado**:

    - GET `/candidates/:id` retorna 404
    - **Mejora**: Mensaje más descriptivo

5. **Ruta de uploads**:

    - Ruta relativa `../uploads/` puede fallar
    - **Riesgo**: Depende del working directory
    - **Solución**: Usar path absoluto o variable de entorno

6. **Carga de variables de entorno**:
    - **Bug 1**: Si se usa `path.resolve(__dirname, '../../.env')`, en desarrollo con `ts-node-dev`, `__dirname` apunta a `backend/src`, haciendo que busque en `backend/.env` en lugar de la raíz donde está el archivo real.
    - **Solución**: Usar `process.cwd()` o `path.resolve(process.cwd(), '.env')` para cargar desde la raíz del proyecto.
    - **Bug 2**: Validación de variables requeridas con checks falsy (`!process.env.VAR`) rechaza strings vacíos (`VAR=`) aunque la variable exista en `.env`.
    - **Solución**: Usar `process.env.VAR === undefined` o validar explícitamente strings vacíos según el caso.

### Deuda técnica

1. **Acoplamiento Domain → Prisma**:

    - Modelos de dominio usan Prisma directamente
    - Viola principio de inversión de dependencias
    - **Impacto**: Difícil testear, cambiar ORM requiere modificar modelos

2. **Sin separación de concerns en validación**:

    - Validación mezclada con lógica de negocio
    - **Mejora**: Usar librería de validación (Zod, Joi, class-validator)

3. **Manejo de errores inconsistente**:

    - Algunos errores retornan JSON, otros texto plano
    - Códigos HTTP no siempre correctos
    - **Mejora**: Middleware centralizado de errores

4. **Sin logging estructurado**:

    - Solo `console.log` básico
    - **Mejora**: Winston, Pino, o similar

5. **Sin rate limiting**:

    - API expuesta sin protección
    - **Riesgo**: Abuso, DoS

6. **CORS hardcodeado**:

    - Solo `localhost:3000` permitido
    - **Riesgo**: No funciona en producción
    - **Solución**: Variable de entorno

7. **Sin autenticación**:

    - Cualquiera puede crear/leer candidatos
    - **Riesgo**: Seguridad, privacidad

8. **TypeScript `any` types**:

    - Uso de `any` en varios lugares
    - **Mejora**: Tipos estrictos, DTOs

9. **Sin paginación**:

    - Si se añade GET all, puede ser problemático con muchos registros
    - **Prevención**: Implementar paginación desde el inicio

10. **Sin migraciones de datos**:
    - Solo migraciones de schema
    - **Riesgo**: Datos de prueba pueden quedar inconsistentes

## Lista de Quick wins (3-10)

### Prioridad Alta (hacer primero)

1. **Corregir ruta de uploads**:

    - Cambiar `../uploads/` a path absoluto o variable de entorno
    - **Esfuerzo**: 15 min
    - **Dónde**: `backend/src/application/services/fileUploadService.ts:6`

2. **Extraer configuración a variables de entorno**:

    - PORT, CORS_ORIGIN, UPLOAD_PATH
    - **Esfuerzo**: 30 min
    - **Dónde**: `backend/src/index.ts`

3. **Unificar manejo de errores**:
    - Middleware que siempre retorna JSON
    - **Esfuerzo**: 1 hora
    - **Dónde**: `backend/src/index.ts:56-60`

### Prioridad Media

4. **Añadir GET all candidates con paginación**:

    - Endpoint básico con limit/offset
    - **Esfuerzo**: 2 horas
    - **Dónde**: `backend/src/routes/candidateRoutes.ts`

5. **Validar fechas (endDate >= startDate)**:

    - En educación y experiencia
    - **Esfuerzo**: 1 hora
    - **Dónde**: `backend/src/application/validator.ts`

6. **Integrar Swagger UI**:

    - Usar `swagger-jsdoc` y `swagger-ui-express`
    - **Esfuerzo**: 2 horas
    - **Dónde**: `backend/src/index.ts`

7. **Crear `.env.example`**:

    - Template con todas las variables necesarias (DB_NAME, DB_PORT, DB_USER, DB_PASSWORD, DATABASE_URL)
    - **Esfuerzo**: 15 min
    - **Dónde**: Raíz del proyecto

8. **Corregir bugs de carga de `.env`**:
    - Si se usa `path.resolve(__dirname, ...)`, cambiar a `process.cwd()`
    - Corregir validación de variables vacías
    - **Esfuerzo**: 30 min
    - **Dónde**: `backend/src/index.ts` o donde se cargue dotenv

### Prioridad Baja (nice to have)

8. **Añadir tests básicos**:

    - Tests de validación
    - Tests de servicios
    - **Esfuerzo**: 4 horas
    - **Dónde**: `backend/src/tests/`

9. **Mejorar tipos TypeScript**:

    - Eliminar `any`, crear interfaces
    - **Esfuerzo**: 3 horas
    - **Dónde**: Todo el backend

10. **Añadir logging estructurado**:
    - Reemplazar `console.log`
    - **Esfuerzo**: 2 horas
    - **Dónde**: Todo el backend
