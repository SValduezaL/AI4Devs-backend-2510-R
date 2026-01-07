# Project Brief

## ¿Qué es el producto?

**LTI - Talent Tracking System** es un sistema de seguimiento de talento (ATS - Applicant Tracking System) que permite a los reclutadores gestionar candidatos, sus currículums, historial educativo, experiencia laboral y procesos de selección.

## Objetivo de negocio / Problema que resuelve

-   **Problema**: Gestión manual e ineficiente de candidatos en procesos de selección
-   **Solución**: Sistema centralizado para almacenar y gestionar información de candidatos, incluyendo CVs, educación, experiencia laboral y seguimiento de entrevistas
-   **Valor**: Facilita el proceso de reclutamiento desde la captación hasta la contratación

## Alcance dentro del repo

### Incluye:

-   Backend API REST (Express + TypeScript + Prisma)
-   Frontend React (TypeScript/JavaScript)
-   Base de datos PostgreSQL con esquema completo para:
    -   Candidatos (Candidate)
    -   Educación (Education)
    -   Experiencia laboral (WorkExperience)
    -   CVs/Resúmenes (Resume)
    -   Empresas (Company)
    -   Empleados (Employee)
    -   Posiciones/Jobs (Position)
    -   Aplicaciones (Application)
    -   Entrevistas (Interview)
    -   Flujos de entrevista (InterviewFlow, InterviewStep, InterviewType)
-   Subida de archivos (PDF, DOCX)
-   Validación de datos de candidatos
-   API documentada con OpenAPI/Swagger

### Excluye:

-   Sistema de autenticación/autorización (no detectado en código)
-   Notificaciones/emails
-   Dashboard completo de métricas
-   Integraciones con otros sistemas (LinkedIn, etc.)
-   Tests automatizados (estructura presente pero sin tests implementados)

## Stakeholders / Tipos de usuarios

**Deducidos del código:**

-   **Reclutadores**: Usuarios principales que añaden candidatos y gestionan procesos
-   **Empleados de empresa**: Participan en entrevistas (modelo Employee)
-   **Candidatos**: No tienen acceso directo al sistema (solo datos almacenados)

## Requisitos no funcionales detectados

### Seguridad

-   Validación de tipos de archivo (solo PDF y DOCX)
-   Límite de tamaño de archivo: 10MB
-   Validación de datos de entrada (regex para nombres, emails, teléfonos)
-   CORS configurado para `http://localhost:3000` (desarrollo)

### Rendimiento

-   Base de datos relacional con índices (Prisma)
-   Límites de tamaño de campos según schema

### Compliance / Calidad

-   Validación estricta de datos según OpenAPI spec
-   Manejo de errores con códigos HTTP apropiados
-   Logging básico de requests

## Definition of Done para cambios típicos

Para considerar un cambio completo en este repo:

1. **Código implementado** siguiendo la arquitectura Clean Architecture:

    - Domain models en `backend/src/domain/models/`
    - Lógica de aplicación en `backend/src/application/services/`
    - Controladores en `backend/src/presentation/controllers/`
    - Rutas en `backend/src/routes/`

2. **Validación**: Datos validados según reglas del dominio

3. **Base de datos**: Migraciones Prisma si hay cambios de schema

4. **API**: Endpoints documentados en `backend/api-spec.yaml` si aplica

5. **Frontend**: Componentes React actualizados si afecta UI

6. **Sin errores de compilación**: `npm run build` exitoso en backend

7. **Funcionalidad verificada manualmente**: Al menos prueba básica de flujo

**Nota**: No hay pipeline CI/CD detectado, ni tests automatizados implementados.
