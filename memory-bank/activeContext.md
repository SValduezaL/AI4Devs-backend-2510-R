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

7. **Implementar tests unitarios básicos**:

    - Empezar con Value Objects y validadores
    - **Esfuerzo**: 2-3 días
    - **Referencia**: `documentation/best_practices.md` sección TDD
    - **Dónde**: `backend/src/tests/` (crear estructura)

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

## Incertidumbres marcadas

-   [ ] ¿Hay CI/CD configurado en otro lugar?
-   [ ] ¿Cuál es el entorno de producción?
-   [ ] ¿Hay requisitos de seguridad específicos (GDPR, etc.)?
-   [ ] ¿Se necesita integración con otros sistemas?
-   [ ] ¿Hay límites de escalabilidad conocidos?
