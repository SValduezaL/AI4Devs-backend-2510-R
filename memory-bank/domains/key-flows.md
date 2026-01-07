# Key Flows

## Flujo 1: Añadir Candidato (Implementado)

### Descripción

Flujo completo para añadir un nuevo candidato al sistema, incluyendo subida de CV opcional.

### Pasos

1. **Usuario accede al formulario**

    - Frontend: `/add-candidate`
    - Componente: `AddCandidateForm.js`

2. **Subir CV (opcional)**

    - Usuario selecciona archivo PDF/DOCX
    - Frontend: POST `/upload` con `multipart/form-data`
    - Backend: `fileUploadService.uploadFile()`
    - Validación: Tipo (PDF/DOCX), tamaño (10MB)
    - Almacenamiento: `../uploads/` con nombre único
    - Respuesta: `{ filePath, fileType }`

3. **Completar formulario**

    - Usuario completa:
        - Datos personales (nombre, apellido, email, teléfono, dirección)
        - Educación (múltiples entradas)
        - Experiencia laboral (múltiples entradas)
        - Referencia al CV (si se subió)

4. **Enviar formulario**

    - Frontend: POST `/candidates` con JSON
    - Backend: `candidateRoutes.ts` → `candidateService.addCandidate()`

5. **Validación**

    - `validator.validateCandidateData()`
    - Validaciones:
        - Nombres: regex + longitud
        - Email: regex + único
        - Teléfono: regex español
        - Fechas: formato YYYY-MM-DD
        - Educación y experiencia: campos requeridos

6. **Persistencia**

    - Crear Candidate en BD
    - Obtener ID del candidato creado
    - Crear Education records (si hay)
    - Crear WorkExperience records (si hay)
    - Crear Resume record (si hay CV)

7. **Respuesta**
    - Backend: 201 Created con candidato creado
    - Frontend: Mostrar éxito/error

### Archivos involucrados

-   `frontend/src/components/AddCandidateForm.js`
-   `frontend/src/components/FileUploader.js`
-   `frontend/src/services/candidateService.js`
-   `backend/src/routes/candidateRoutes.ts`
-   `backend/src/application/services/candidateService.ts`
-   `backend/src/application/validator.ts`
-   `backend/src/domain/models/Candidate.ts`
-   `backend/src/application/services/fileUploadService.ts`

### Casos de error

-   **Email duplicado**: 400 "The email already exists in the database"
-   **Validación falla**: 400 con mensaje específico
-   **Archivo inválido**: 400 "Invalid file type, only PDF and DOCX are allowed!"
-   **BD no disponible**: 500 con mensaje genérico

---

## Flujo 2: Obtener Candidato (Implementado)

### Descripción

Obtener información completa de un candidato por su ID.

### Pasos

1. **Solicitud**

    - Frontend/API: GET `/candidates/:id`
    - Backend: `candidateRoutes.ts` → `getCandidateById()`

2. **Validación de ID**

    - Parsear `req.params.id` a número
    - Si no es número: 400 "Invalid ID format"

3. **Búsqueda**

    - `candidateService.findCandidateById(id)`
    - `Candidate.findOne(id)` → Prisma query con includes:
        - `educations`
        - `workExperiences`
        - `resumes`
        - `applications` (con `position` e `interviews`)

4. **Respuesta**
    - Si encontrado: 200 con JSON completo
    - Si no encontrado: 404 "Candidate not found"
    - Si error: 500 "Internal Server Error"

### Archivos involucrados

-   `backend/src/routes/candidateRoutes.ts:20`
-   `backend/src/presentation/controllers/candidateController.ts:18-32`
-   `backend/src/application/services/candidateService.ts:57-65`
-   `backend/src/domain/models/Candidate.ts:129-162`

---

## Flujo 3: Aplicar a Posición (No implementado)

### Descripción

Un candidato aplica a una posición de trabajo.

### Pasos propuestos

1. **Candidato selecciona posición**

    - Frontend: Lista de posiciones disponibles
    - Usuario hace clic en "Aplicar"

2. **Crear Application**

    - Frontend: POST `/applications`
    - Body: `{ positionId, candidateId }`
    - Backend: Validar que posición existe y está visible
    - Backend: Validar que candidato no ha aplicado antes (opcional)

3. **Inicializar flujo de entrevista**

    - Obtener `interviewFlow` de la posición
    - Obtener primer `interviewStep` (orderIndex = 1)
    - Crear Application con `currentInterviewStep = primer paso`

4. **Notificaciones** (futuro)
    - Email a candidato confirmando aplicación
    - Notificación a reclutadores

### Estado

**No implementado**. Modelos existen pero sin endpoints.

---

## Flujo 4: Realizar Entrevista (No implementado)

### Descripción

Un empleado realiza una entrevista a un candidato en una aplicación.

### Pasos propuestos

1. **Programar entrevista**

    - Reclutador: Selecciona aplicación
    - Selecciona paso de entrevista
    - Selecciona entrevistador (Employee)
    - Fija fecha/hora

2. **Crear Interview**

    - POST `/interviews`
    - Body: `{ applicationId, interviewStepId, employeeId, interviewDate }`

3. **Realizar entrevista**

    - Entrevistador completa formulario:
        - Resultado (aprobado/rechazado/pendiente)
        - Score (opcional)
        - Notas

4. **Actualizar Application**
    - Si entrevista aprobada: Avanzar a siguiente paso
    - Si rechazada: Marcar aplicación como rechazada
    - Actualizar `currentInterviewStep`

### Estado

**No implementado**. Modelos existen pero sin endpoints.

---

## Flujo 5: Gestionar Posiciones (No implementado)

### Descripción

Reclutador crea y gestiona posiciones de trabajo.

### Pasos propuestos

1. **Crear posición**

    - POST `/positions`
    - Body: Datos de la posición (title, description, requirements, etc.)
    - Asignar `interviewFlow`
    - Estado inicial: "Draft"

2. **Publicar posición**

    - PUT `/positions/:id`
    - Cambiar `status` a "Published"
    - Cambiar `isVisible` a true

3. **Listar posiciones**
    - GET `/positions?status=Published&isVisible=true`
    - Filtros: status, company, location

### Estado

**No implementado**. Modelos existen pero sin endpoints.

---

## Diagrama de flujo: Añadir Candidato

```mermaid
flowchart TD
    A[Usuario accede a formulario] --> B{¿Subir CV?}
    B -->|Sí| C[POST /upload]
    B -->|No| D[Completar formulario]
    C --> E{¿Archivo válido?}
    E -->|No| F[Error: Tipo inválido]
    E -->|Sí| G[Archivo guardado]
    G --> D
    D --> H[POST /candidates]
    H --> I{¿Validación OK?}
    I -->|No| J[Error 400]
    I -->|Sí| K[Crear Candidate]
    K --> L{¿Email único?}
    L -->|No| M[Error: Email duplicado]
    L -->|Sí| N[Guardar Education]
    N --> O[Guardar WorkExperience]
    O --> P{¿Hay CV?}
    P -->|Sí| Q[Guardar Resume]
    P -->|No| R[Éxito 201]
    Q --> R
    R --> S[Mostrar éxito en UI]
    J --> T[Mostrar error en UI]
    M --> T
    F --> T
```

---

## Notas sobre flujos

### Implementados

-   ✅ Añadir candidato (completo)
-   ✅ Obtener candidato (completo)
-   ✅ Subir archivo (completo)

### Parcialmente implementados

-   ⚠️ Dashboard: UI existe pero funcionalidad limitada

### No implementados

-   ❌ Aplicar a posición
-   ❌ Gestionar entrevistas
-   ❌ Gestionar posiciones
-   ❌ Gestionar empresas
-   ❌ Autenticación/autorización
-   ❌ Notificaciones

### Mejoras futuras

1. **Validación de fechas**: `endDate >= startDate`
2. **Transacciones**: Operaciones atómicas (candidate + relaciones)
3. **Eventos**: Publicar eventos al crear candidato (para notificaciones)
4. **Caché**: Cachear queries frecuentes
5. **Paginación**: Para listados
