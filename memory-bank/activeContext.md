# Active Context

## Estado actual

**Memory Bank creado el**: 2026-01-06

**Estado del proyecto**: Desarrollo activo / Ejercicio de aprendizaje

**Versión detectada**: 0.0.0.001 (archivo `VERSION`)

**📋 Documento de Buenas Prácticas creado**: 2026-01-07

-   **Archivo**: `documentation/best_practices.md`
-   **Contenido**: Análisis completo de violaciones SOLID, DDD, TDD, DRY y recomendaciones priorizadas
-   **Uso**: Referencia oficial para decisiones arquitectónicas futuras

## En qué estamos ahora

### Funcionalidades implementadas

1. **API de Candidatos**:

    - ✅ POST `/candidates` - Crear candidato
    - ✅ GET `/candidates/:id` - Obtener candidato por ID
    - ✅ PUT `/candidates/:id/stage` - Actualizar etapa del proceso
    - ✅ Validación de datos de entrada
    - ✅ Manejo de errores (email duplicado, validación, errores Prisma)

2. **API de Posiciones**:

    - ✅ GET `/positions/:id/candidates` - Obtener candidatos en proceso para una posición
    - ✅ Incluye cálculo de puntuación media de entrevistas
    - ✅ Información formateada para visualización Kanban

3. **Subida de archivos**:

    - ✅ POST `/upload` - Subir CV (PDF/DOCX)
    - ✅ Validación de tipo y tamaño (10MB)
    - ✅ Almacenamiento en disco

4. **Servicios de Aplicaciones**:

    - ✅ `getCandidatesByPosition()` - Obtiene candidatos con información agregada
    - ✅ `updateCandidateStage()` - Actualiza etapa del proceso con validaciones

5. **Tests Unitarios TDD**:

    - ✅ 54 tests unitarios implementados y pasando
    - ✅ Tests para servicios (`applicationService.test.ts` - 18 tests)
    - ✅ Tests para controladores (`positionController.test.ts` - 10 tests, `candidateController.test.ts` - 14 tests)
    - ✅ Tests de validación de API spec (`apiSpec.test.ts` - 8 tests)
    - ✅ Cobertura completa de casos edge y validaciones

6. **Frontend básico**:

    - ✅ Dashboard de reclutador
    - ✅ Formulario de candidato (componente presente)
    - ✅ Upload de archivos (componente presente)

7. **Base de datos**:

    - ✅ Schema completo con todas las entidades
    - ✅ Migraciones Prisma
    - ✅ Seed script disponible

8. **Documentación API**:
    - ✅ `api-spec.yaml` actualizado con nuevos endpoints
    - ✅ Tests de validación de especificación OpenAPI

### Funcionalidades parcialmente implementadas

1. **Gestión de posiciones**:

    - ✅ Modelo `Position` existe
    - ✅ Endpoint GET `/positions/:id/candidates` implementado
    - ❌ CRUD completo de posiciones pendiente
    - ❌ No hay UI

2. **Proceso de aplicación**:

    - ✅ Modelo `Application` conecta candidatos con posiciones
    - ✅ Endpoint PUT `/candidates/:id/stage` para actualizar etapa
    - ❌ Endpoints para crear/gestionar aplicaciones pendientes

### Funcionalidades modeladas pero no implementadas

3. **Entrevistas**:

    - Modelos `Interview`, `InterviewStep`, `InterviewFlow`, `InterviewType` existen
    - No hay endpoints CRUD ni UI

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

**📋 Ver `documentation/best_practices.md` sección "Resumen de Recomendaciones Prioritarias" para análisis detallado**

### Prioridad Alta (Impacto inmediato) ⭐

1. **Introducir Repository Pattern** ⭐ **MAYOR IMPACTO**:

    - Desacoplar modelos de Prisma
    - Habilitar testing sin BD
    - Cumplir DIP y SRP
    - **Esfuerzo**: 2-3 días
    - **Referencia**: `documentation/best_practices.md` sección DDD y SOLID

2. **Corregir inconsistencia en rutas**:

    - `candidateRoutes.ts` llama directamente al servicio
    - Debería usar `addCandidateController`
    - **Esfuerzo**: 1 hora
    - **Dónde**: `backend/src/routes/candidateRoutes.ts:9`

3. **Extraer configuración a variables de entorno**:

    - PORT, CORS_ORIGIN, UPLOAD_PATH
    - **Esfuerzo**: 30 min
    - **Dónde**: `backend/src/index.ts`

4. **Unificar manejo de errores**:

    - Middleware que siempre retorna JSON
    - **Esfuerzo**: 1 hora
    - **Dónde**: `backend/src/index.ts:56-60`

### Prioridad Media (Mejora de calidad)

5. **Crear Value Objects**:

    - Email, Phone, DateRange
    - Validación encapsulada en dominio
    - **Esfuerzo**: 1 día
    - **Referencia**: `documentation/best_practices.md` sección DDD

6. **Separar validadores por responsabilidad**:

    - FieldValidator, EducationValidator, etc.
    - Cumplir SRP
    - **Esfuerzo**: 1 día
    - **Referencia**: `documentation/best_practices.md` sección SOLID

7. **Tests unitarios básicos**:

    - ✅ Tests unitarios implementados para nuevos endpoints (54 tests pasando)
    - ⚠️ Tests para Value Objects y validadores pendientes (cuando se implementen)
    - **Referencia**: `documentation/best_practices.md` sección TDD
    - **Dónde**: `backend/src/tests/unit/` (estructura creada)

8. **Añadir endpoint GET all candidates**:

    - Con paginación básica
    - **Esfuerzo**: 2 horas
    - **Dónde**: `backend/src/routes/candidateRoutes.ts`

9. **Documentación API completa**:

    - Swagger UI funcionando
    - Endpoints documentados
    - **Dónde**: `backend/api-spec.yaml` existe, integrar con Express

10. **Añadir tipos TypeScript consistentes**:
    - Eliminar `any` types
    - Crear DTOs/interfaces para requests/responses
    - **Dónde**: Todo el backend

### Prioridad Baja (Refactorización a largo plazo)

11. **Introducir Factory Pattern**:

    -   Para creación de agregados complejos
    -   **Esfuerzo**: 1 día
    -   **Referencia**: `documentation/best_practices.md` sección Patrones de Diseño

12. **Implementar Unit of Work Pattern**:

    -   Para transacciones complejas
    -   **Esfuerzo**: 2 días
    -   **Referencia**: `documentation/best_practices.md` sección Patrones de Diseño

13. **Migrar a Domain Services**:

    -   Mover lógica de negocio compleja del Application Service
    -   **Esfuerzo**: 2-3 días
    -   **Referencia**: `documentation/best_practices.md` sección DDD

### Funcionalidades nuevas (baja prioridad, alto esfuerzo)

14. **Sistema de autenticación**:

    -   JWT o sesiones
    -   Middleware de auth
    -   Login/registro

15. **CRUD completo de posiciones**:

    -   Endpoints API
    -   UI para crear/editar/listar posiciones

16. **Sistema de aplicaciones**:

    -   Candidatos aplican a posiciones
    -   Seguimiento de estado
    -   UI de dashboard

17. **Gestión de entrevistas**:

    -   Crear entrevistas
    -   Asignar entrevistadores
    -   Registrar resultados

18. **Notificaciones**:
    -   Emails a candidatos
    -   Notificaciones a reclutadores

## Cambios recientes (2026-01-07)

### US-CU1: Endpoints Kanban Candidatos - COMPLETADA ✅

**Implementación completa con TDD**:

-   ✅ Endpoints GET `/positions/:id/candidates` y PUT `/candidates/:id/stage` implementados
-   ✅ 54 tests unitarios TDD pasando (100% de casos de prueba del plan)
-   ✅ Documentación API actualizada en `api-spec.yaml`
-   ✅ Validaciones robustas y manejo de errores mejorado (P2025 → 404)
-   ✅ Cálculo de puntuación media implementado correctamente
-   ✅ Validación de flujo de entrevistas implementada

**Archivos nuevos**:

-   `backend/src/application/services/applicationService.ts`
-   `backend/src/presentation/controllers/positionController.ts`
-   `backend/src/routes/positionRoutes.ts`
-   `backend/src/tests/unit/applicationService.test.ts` (18 tests)
-   `backend/src/tests/unit/positionController.test.ts` (10 tests)
-   `backend/src/tests/unit/candidateController.test.ts` (14 tests)
-   `backend/src/tests/unit/apiSpec.test.ts` (8 tests)
-   `memory-bank/user_stories.md`
-   `memory-bank/Tickets_US-CU1.md`

**Ver detalles completos**: `memory-bank/progress.md` sección "Cambios recientes"

## Incertidumbres marcadas

-   [ ] ¿Hay CI/CD configurado en otro lugar?
-   [ ] ¿Cuál es el entorno de producción?
-   [ ] ¿Hay requisitos de seguridad específicos (GDPR, etc.)?
-   [ ] ¿Se necesita integración con otros sistemas?
-   [ ] ¿Hay límites de escalabilidad conocidos?
