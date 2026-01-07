# Active Context

## Estado actual

**Memory Bank creado el**: 2026-01-06

**Estado del proyecto**: Desarrollo activo / Ejercicio de aprendizaje

**Versión detectada**: 0.0.0.001 (archivo `VERSION`)

## En qué estamos ahora

### Funcionalidades implementadas

1. **API de Candidatos**:

    - ✅ POST `/candidates` - Crear candidato
    - ✅ GET `/candidates/:id` - Obtener candidato por ID
    - ✅ Validación de datos de entrada
    - ✅ Manejo de errores (email duplicado, validación)

2. **Subida de archivos**:

    - ✅ POST `/upload` - Subir CV (PDF/DOCX)
    - ✅ Validación de tipo y tamaño (10MB)
    - ✅ Almacenamiento en disco

3. **Frontend básico**:

    - ✅ Dashboard de reclutador
    - ✅ Formulario de candidato (componente presente)
    - ✅ Upload de archivos (componente presente)

4. **Base de datos**:
    - ✅ Schema completo con todas las entidades
    - ✅ Migraciones Prisma
    - ✅ Seed script disponible

### Funcionalidades modeladas pero no implementadas

1. **Gestión de posiciones**:

    - Modelo `Position` existe
    - No hay endpoints API
    - No hay UI

2. **Proceso de aplicación**:

    - Modelo `Application` conecta candidatos con posiciones
    - No hay endpoints para crear/gestionar aplicaciones

3. **Entrevistas**:

    - Modelos `Interview`, `InterviewStep`, `InterviewFlow`, `InterviewType` existen
    - No hay endpoints ni UI

4. **Gestión de empresas**:

    - Modelos `Company`, `Employee` existen
    - No hay endpoints ni UI

5. **Autenticación/Autorización**:
    - No implementado
    - No hay middleware de auth

## Hipótesis de foco

**Pendiente de confirmación del humano:**

1. ¿Es un proyecto de aprendizaje/ejercicio o un producto real?
2. ¿Cuál es la prioridad: completar funcionalidades existentes o añadir nuevas?
3. ¿Hay roadmap o requisitos específicos pendientes?
4. ¿Se necesita autenticación/autorización?
5. ¿Hay integraciones planificadas (emails, notificaciones, etc.)?

## Next steps sugeridos (backlog inicial)

### Quick wins (alta prioridad, bajo esfuerzo)

1. **Corregir inconsistencia en rutas**:

    - `candidateRoutes.ts` llama directamente al servicio
    - Debería usar `addCandidateController` o eliminar controlador duplicado
    - **Dónde**: `backend/src/routes/candidateRoutes.ts:9`

2. **Mejorar manejo de errores**:

    - Middleware de errores genérico retorna texto plano
    - Debería retornar JSON consistente
    - **Dónde**: `backend/src/index.ts:56-60`

3. **Configurar variables de entorno**:

    - Extraer puerto, CORS origin, ruta de uploads a `.env` (en raíz del proyecto)
    - Corregir bugs de carga de `.env` si se usa `path.resolve(__dirname, ...)`
    - **Dónde**: `backend/src/index.ts`

4. **Añadir endpoint GET all candidates**:

    - Con paginación básica
    - **Dónde**: `backend/src/routes/candidateRoutes.ts`

5. **Validar fechas**:
    - `endDate` debe ser >= `startDate` en educación y experiencia
    - **Dónde**: `backend/src/application/validator.ts`

### Mejoras de arquitectura (media prioridad)

6. **Separar lógica de persistencia de modelos**:

    - Crear repositorios o usar Prisma directamente en servicios
    - Reducir acoplamiento Domain → Prisma

7. **Añadir tests unitarios**:

    - Tests para validadores
    - Tests para servicios
    - **Dónde**: `backend/src/tests/` (carpeta existe pero vacía)

8. **Documentación API completa**:

    - Swagger UI funcionando
    - Endpoints documentados
    - **Dónde**: `backend/api-spec.yaml` existe, integrar con Express

9. **Mejorar estructura de frontend**:

    - Separar lógica de servicios
    - Añadir manejo de errores en llamadas API
    - **Dónde**: `frontend/src/services/candidateService.js`

10. **Añadir tipos TypeScript consistentes**:
    - Eliminar `any` types
    - Crear DTOs/interfaces para requests/responses
    - **Dónde**: Todo el backend

### Funcionalidades nuevas (baja prioridad, alto esfuerzo)

11. **Sistema de autenticación**:

    -   JWT o sesiones
    -   Middleware de auth
    -   Login/registro

12. **CRUD completo de posiciones**:

    -   Endpoints API
    -   UI para crear/editar/listar posiciones

13. **Sistema de aplicaciones**:

    -   Candidatos aplican a posiciones
    -   Seguimiento de estado
    -   UI de dashboard

14. **Gestión de entrevistas**:

    -   Crear entrevistas
    -   Asignar entrevistadores
    -   Registrar resultados

15. **Notificaciones**:
    -   Emails a candidatos
    -   Notificaciones a reclutadores

## Incertidumbres marcadas

-   [ ] ¿Hay CI/CD configurado en otro lugar?
-   [ ] ¿Cuál es el entorno de producción?
-   [ ] ¿Hay requisitos de seguridad específicos (GDPR, etc.)?
-   [ ] ¿Se necesita integración con otros sistemas?
-   [ ] ¿Hay límites de escalabilidad conocidos?
