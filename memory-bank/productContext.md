# Product Context

## Why: Por qué existe

El sistema LTI existe para digitalizar y centralizar el proceso de gestión de candidatos en procesos de selección. Permite:

-   Evitar pérdida de información de candidatos
-   Centralizar CVs y datos de contacto
-   Gestionar el flujo completo desde la aplicación hasta la contratación
-   Mantener historial de entrevistas y evaluaciones

## What: Cómo debería funcionar a alto nivel

### Flujo principal: Añadir candidato

1. **Reclutador accede al dashboard** (`/`)
2. **Navega a "Añadir Candidato"** (`/add-candidate`)
3. **Sube CV** (opcional): POST `/upload` → recibe `filePath` y `fileType`
4. **Completa formulario** con:
    - Datos personales (nombre, apellido, email, teléfono, dirección)
    - Educación (múltiples entradas: institución, título, fechas)
    - Experiencia laboral (múltiples entradas: empresa, posición, descripción, fechas)
    - Referencia al CV subido
5. **Envía formulario**: POST `/candidates` → candidato creado con ID
6. **Visualiza candidato**: GET `/candidates/:id` → datos completos incluyendo relaciones

### Flujos secundarios (modelados pero no implementados completamente)

-   **Gestión de posiciones**: Modelo `Position` existe pero no hay endpoints
-   **Proceso de aplicación**: Modelo `Application` conecta candidatos con posiciones
-   **Entrevistas**: Modelo `Interview` permite registrar entrevistas por paso del flujo
-   **Gestión de empresas**: Modelo `Company` y `Employee` para organizar entrevistadores

## UX/Flujos principales

### Frontend detectado

**Componentes principales:**

-   `RecruiterDashboard.js`: Dashboard principal con navegación
-   `AddCandidateForm.js`: Formulario para añadir candidatos
-   `FileUploader.js`: Componente para subir CVs

**Rutas (inferidas):**

-   `/`: Dashboard
-   `/add-candidate`: Formulario de candidato

**Tecnologías UI:**

-   React Bootstrap para componentes
-   React Router para navegación
-   React DatePicker para fechas

### Backend API

**Endpoints implementados:**

-   `POST /candidates`: Crear candidato
-   `GET /candidates/:id`: Obtener candidato por ID
-   `POST /upload`: Subir archivo (PDF/DOCX)

**Endpoints documentados pero no verificados:**

-   Ver `backend/api-spec.yaml` para especificación completa

## Casos borde / Riesgos de producto

### Detectados en código:

1. **Email duplicado**:

    - Validado en Prisma (unique constraint)
    - Error `P2002` manejado con mensaje claro

2. **Archivos inválidos**:

    - Solo PDF y DOCX permitidos
    - Límite 10MB
    - Respuesta 400 si tipo inválido

3. **Datos de entrada inválidos**:

    - Validación con regex (nombres, emails, teléfonos)
    - Validación de longitudes según schema DB
    - Respuestas 400 con mensajes de error

4. **Conexión a BD fallida**:

    - Error `PrismaClientInitializationError` detectado
    - Mensaje en español para usuario

5. **Candidato no encontrado**:
    - GET `/candidates/:id` retorna 404 si no existe

### Riesgos no mitigados detectados:

-   **Sin autenticación**: Cualquiera puede crear/leer candidatos
-   **CORS hardcodeado**: Solo `localhost:3000` permitido (no funciona en producción)
-   **Ruta de uploads relativa**: `../uploads/` puede fallar según dónde se ejecute
-   **Sin validación de fechas**: Fechas de fin deben ser posteriores a inicio (no validado)
-   **Sin paginación**: GET all no existe, pero si se añade puede ser problemático
-   **Sin rate limiting**: API expuesta sin protección
