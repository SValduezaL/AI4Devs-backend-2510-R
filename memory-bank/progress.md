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

6. **Carga de variables de entorno**: ✅ **RESUELTO**
    - **Solución implementada**: Un solo `.env` en la raíz del proyecto
    - **Código**: `backend/src/index.ts` usa `dotenv.config({ path: path.resolve(__dirname, '../../.env') })`
    - **Prisma CLI**: Usa `dotenv-cli` en scripts de `package.json` para cargar `.env` de la raíz
    - **Scripts disponibles**: `prisma:generate`, `prisma:migrate`, `prisma:studio`, `prisma:seed`
    - **Documentación**: Ver `backend/README-ENV.md`

### Deuda técnica

**📋 Análisis completo disponible en `ENGINEERING_PRACTICES.md`**

1. **Acoplamiento Domain → Prisma** (CRÍTICO):

    - Modelos de dominio usan Prisma directamente
    - Viola **Dependency Inversion Principle (DIP)**
    - Viola **Single Responsibility Principle (SRP)**
    - **Impacto**: Difícil testear, cambiar ORM requiere modificar modelos
    - **Solución recomendada**: Repository Pattern (ver `ENGINEERING_PRACTICES.md` sección DDD)
    - **Esfuerzo estimado**: 2-3 días

2. **Sin separación de concerns en validación**:

    - Validación mezclada con lógica de negocio
    - Viola **Single Responsibility Principle (SRP)**
    - Viola **Open/Closed Principle (OCP)**: Validación hardcodeada
    - Falta de Value Objects (Email, Phone, DateRange)
    - **Mejora**:
        - Crear Value Objects para validación en dominio
        - Separar validadores por responsabilidad (FieldValidator, EducationValidator, etc.)
        - Usar Strategy Pattern para validación configurable
    - **Referencia**: Ver `ENGINEERING_PRACTICES.md` sección SOLID y DRY
    - **Esfuerzo estimado**: 1-2 días

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

    - Uso de `any` en varios lugares (candidateData, error handling, etc.)
    - **Mejora**: Tipos estrictos, DTOs, interfaces para requests/responses
    - **Esfuerzo estimado**: 3 horas

9. **Sin paginación**:

    - Si se añade GET all, puede ser problemático con muchos registros
    - **Prevención**: Implementar paginación desde el inicio

10. **Sin migraciones de datos**:
    - Solo migraciones de schema
    - **Riesgo**: Datos de prueba pueden quedar inconsistentes

## Lista de Quick wins (3-10)

**📋 Recomendaciones priorizadas detalladas en `ENGINEERING_PRACTICES.md` sección "Resumen de Recomendaciones Prioritarias"**

### Prioridad Alta (hacer primero)

1. **Introducir Repository Pattern** ⭐ **MAYOR IMPACTO**:

    - Desacoplar modelos de Prisma
    - Habilitar testing sin BD
    - Cumplir DIP y SRP
    - **Esfuerzo**: 2-3 días
    - **Referencia**: `ENGINEERING_PRACTICES.md` sección DDD y SOLID

2. **Corregir inconsistencia en rutas**:

    - Usar controladores en lugar de llamar servicios directamente
    - **Esfuerzo**: 1 hora
    - **Dónde**: `backend/src/routes/candidateRoutes.ts:9`

3. **Extraer configuración a variables de entorno**:

    - PORT, CORS_ORIGIN, UPLOAD_PATH
    - **Esfuerzo**: 30 min
    - **Dónde**: `backend/src/index.ts`

4. **Corregir ruta de uploads**:

    - Cambiar `../uploads/` a path absoluto o variable de entorno
    - **Esfuerzo**: 15 min
    - **Dónde**: `backend/src/application/services/fileUploadService.ts:6`

5. **Unificar manejo de errores**:
    - Middleware que siempre retorna JSON
    - **Esfuerzo**: 1 hora
    - **Dónde**: `backend/src/index.ts:56-60`

### Prioridad Media (Mejora de calidad)

4. **Crear Value Objects**:

    - Email, Phone, DateRange
    - Validación encapsulada en dominio
    - **Esfuerzo**: 1 día
    - **Referencia**: `ENGINEERING_PRACTICES.md` sección DDD

5. **Separar validadores por responsabilidad**:

    - FieldValidator, EducationValidator, etc.
    - Cumplir SRP
    - **Esfuerzo**: 1 día
    - **Referencia**: `ENGINEERING_PRACTICES.md` sección SOLID

6. **Implementar tests unitarios básicos**:

    - Empezar con Value Objects y validadores
    - **Esfuerzo**: 2-3 días
    - **Referencia**: `ENGINEERING_PRACTICES.md` sección TDD

7. **Añadir GET all candidates con paginación**:

    - Endpoint básico con limit/offset
    - **Esfuerzo**: 2 horas
    - **Dónde**: `backend/src/routes/candidateRoutes.ts`

8. **Validar fechas (endDate >= startDate)**:

    - En educación y experiencia
    - **Esfuerzo**: 1 hora
    - **Dónde**: `backend/src/application/validator.ts` (o mejor: DateRange Value Object)

9. **Integrar Swagger UI**:

    - Usar `swagger-jsdoc` y `swagger-ui-express`
    - **Esfuerzo**: 2 horas
    - **Dónde**: `backend/src/index.ts`

10. **Crear `.env.example`**:

    - Template con todas las variables necesarias (DB_NAME, DB_PORT, DB_USER, DB_PASSWORD, DATABASE_URL, PORT, CORS_ORIGIN, UPLOAD_PATH)
    - **Esfuerzo**: 15 min
    - **Dónde**: Raíz del proyecto

### Prioridad Baja (Refactorización a largo plazo)

11. **Introducir Factory Pattern**:

    -   Para creación de agregados complejos
    -   **Esfuerzo**: 1 día
    -   **Referencia**: `ENGINEERING_PRACTICES.md` sección Patrones de Diseño

12. **Implementar Unit of Work Pattern**:

    -   Para transacciones complejas
    -   **Esfuerzo**: 2 días
    -   **Referencia**: `ENGINEERING_PRACTICES.md` sección Patrones de Diseño

13. **Migrar a Domain Services**:

    -   Mover lógica de negocio compleja del Application Service
    -   **Esfuerzo**: 2-3 días
    -   **Referencia**: `ENGINEERING_PRACTICES.md` sección DDD

14. **Mejorar tipos TypeScript**:

    -   Eliminar `any`, crear interfaces, DTOs
    -   **Esfuerzo**: 3 horas
    -   **Dónde**: Todo el backend

15. **Añadir logging estructurado**:
    -   Reemplazar `console.log` (Winston, Pino)
    -   **Esfuerzo**: 2 horas
    -   **Dónde**: Todo el backend
