# Domain Model

## Entidades principales

### Candidate (Candidato)

**Descripción**: Persona que aplica a posiciones o está en proceso de selección.

**Atributos**:

-   `id`: Int (PK, autoincrement)
-   `firstName`: String (100 chars, requerido)
-   `lastName`: String (100 chars, requerido)
-   `email`: String (255 chars, único, requerido)
-   `phone`: String (15 chars, opcional)
-   `address`: String (100 chars, opcional)

**Relaciones**:

-   `educations`: Education[] (1:N)
-   `workExperiences`: WorkExperience[] (1:N)
-   `resumes`: Resume[] (1:N)
-   `applications`: Application[] (1:N)

**Validaciones**:

-   Nombres: Solo letras, espacios, acentos (regex)
-   Email: Formato válido, único en BD
-   Teléfono: Formato español (6|7|9 + 8 dígitos)

**Dónde**: `backend/src/domain/models/Candidate.ts`, `backend/prisma/schema.prisma:17-28`

---

### Education (Educación)

**Descripción**: Historial educativo de un candidato.

**Atributos**:

-   `id`: Int (PK)
-   `institution`: String (100 chars, requerido)
-   `title`: String (250 chars, requerido)
-   `startDate`: DateTime (requerido)
-   `endDate`: DateTime (opcional, puede ser null)
-   `candidateId`: Int (FK a Candidate)

**Relaciones**:

-   `candidate`: Candidate (N:1)

**Validaciones**:

-   Fechas: Formato YYYY-MM-DD
-   **No validado**: `endDate >= startDate` (deuda técnica)

**Dónde**: `backend/src/domain/models/Education.ts`, `backend/prisma/schema.prisma:30-38`

---

### WorkExperience (Experiencia Laboral)

**Descripción**: Historial de trabajo de un candidato.

**Atributos**:

-   `id`: Int (PK)
-   `company`: String (100 chars, requerido)
-   `position`: String (100 chars, requerido)
-   `description`: String (200 chars, opcional)
-   `startDate`: DateTime (requerido)
-   `endDate`: DateTime (opcional)
-   `candidateId`: Int (FK a Candidate)

**Relaciones**:

-   `candidate`: Candidate (N:1)

**Validaciones**:

-   Similar a Education
-   **No validado**: `endDate >= startDate`

**Dónde**: `backend/src/domain/models/WorkExperience.ts`, `backend/prisma/schema.prisma:40-49`

---

### Resume (CV/Resumen)

**Descripción**: Archivo de currículum subido por el candidato.

**Atributos**:

-   `id`: Int (PK)
-   `filePath`: String (500 chars, requerido)
-   `fileType`: String (50 chars, requerido)
-   `uploadDate`: DateTime (requerido, auto)
-   `candidateId`: Int (FK a Candidate)

**Relaciones**:

-   `candidate`: Candidate (N:1)

**Validaciones**:

-   Tipos permitidos: PDF, DOCX
-   Tamaño máximo: 10MB

**Dónde**: `backend/src/domain/models/Resume.ts`, `backend/prisma/schema.prisma:51-58`

---

### Company (Empresa)

**Descripción**: Empresa que publica posiciones y emplea entrevistadores.

**Atributos**:

-   `id`: Int (PK)
-   `name`: String (único, requerido)

**Relaciones**:

-   `employees`: Employee[] (1:N)
-   `positions`: Position[] (1:N)

**Estado**: Modelado pero sin endpoints API

**Dónde**: `backend/prisma/schema.prisma:60-65`

---

### Employee (Empleado)

**Descripción**: Empleado de una empresa que puede realizar entrevistas.

**Atributos**:

-   `id`: Int (PK)
-   `companyId`: Int (FK a Company)
-   `name`: String (requerido)
-   `email`: String (único, requerido)
-   `role`: String (requerido)
-   `isActive`: Boolean (default: true)

**Relaciones**:

-   `company`: Company (N:1)
-   `interviews`: Interview[] (1:N)

**Estado**: Modelado pero sin endpoints API

**Dónde**: `backend/prisma/schema.prisma:67-76`

---

### Position (Posición/Job)

**Descripción**: Posición de trabajo ofrecida por una empresa.

**Atributos**:

-   `id`: Int (PK)
-   `companyId`: Int (FK a Company)
-   `interviewFlowId`: Int (FK a InterviewFlow)
-   `title`: String (requerido)
-   `description`: String (requerido)
-   `status`: String (default: "Draft")
-   `isVisible`: Boolean (default: false)
-   `location`: String (requerido)
-   `jobDescription`: String (requerido)
-   `requirements`: String (opcional)
-   `responsibilities`: String (opcional)
-   `salaryMin`: Float (opcional)
-   `salaryMax`: Float (opcional)
-   `employmentType`: String (opcional)
-   `benefits`: String (opcional)
-   `companyDescription`: String (opcional)
-   `applicationDeadline`: DateTime (opcional)
-   `contactInfo`: String (opcional)

**Relaciones**:

-   `company`: Company (N:1)
-   `interviewFlow`: InterviewFlow (N:1)
-   `applications`: Application[] (1:N)

**Estado**: Modelado pero sin endpoints API

**Dónde**: `backend/prisma/schema.prisma:104-126`

---

### Application (Aplicación)

**Descripción**: Aplicación de un candidato a una posición.

**Atributos**:

-   `id`: Int (PK)
-   `positionId`: Int (FK a Position)
-   `candidateId`: Int (FK a Candidate)
-   `applicationDate`: DateTime (requerido)
-   `currentInterviewStep`: Int (FK a InterviewStep)
-   `notes`: String (opcional)

**Relaciones**:

-   `position`: Position (N:1)
-   `candidate`: Candidate (N:1)
-   `interviewStep`: InterviewStep (N:1)
-   `interviews`: Interview[] (1:N)

**Estado**: Modelado pero sin endpoints API

**Dónde**: `backend/prisma/schema.prisma:128-139`

---

### Interview (Entrevista)

**Descripción**: Entrevista realizada a un candidato en una aplicación.

**Atributos**:

-   `id`: Int (PK)
-   `applicationId`: Int (FK a Application)
-   `interviewStepId`: Int (FK a InterviewStep)
-   `employeeId`: Int (FK a Employee)
-   `interviewDate`: DateTime (requerido)
-   `result`: String (opcional)
-   `score`: Int (opcional)
-   `notes`: String (opcional)

**Relaciones**:

-   `application`: Application (N:1)
-   `interviewStep`: InterviewStep (N:1)
-   `employee`: Employee (N:1)

**Estado**: Modelado pero sin endpoints API

**Dónde**: `backend/prisma/schema.prisma:141-153`

---

### InterviewFlow (Flujo de Entrevista)

**Descripción**: Secuencia de pasos de entrevista para un proceso de selección.

**Atributos**:

-   `id`: Int (PK)
-   `description`: String (opcional)

**Relaciones**:

-   `interviewSteps`: InterviewStep[] (1:N)
-   `positions`: Position[] (1:N)

**Estado**: Modelado pero sin endpoints API

**Dónde**: `backend/prisma/schema.prisma:85-90`

---

### InterviewStep (Paso de Entrevista)

**Descripción**: Paso individual dentro de un flujo de entrevista.

**Atributos**:

-   `id`: Int (PK)
-   `interviewFlowId`: Int (FK a InterviewFlow)
-   `interviewTypeId`: Int (FK a InterviewType)
-   `name`: String (requerido)
-   `orderIndex`: Int (requerido)

**Relaciones**:

-   `interviewFlow`: InterviewFlow (N:1)
-   `interviewType`: InterviewType (N:1)
-   `applications`: Application[] (1:N)
-   `interviews`: Interview[] (1:N)

**Estado**: Modelado pero sin endpoints API

**Dónde**: `backend/prisma/schema.prisma:92-102`

---

### InterviewType (Tipo de Entrevista)

**Descripción**: Tipo de entrevista (técnica, cultural, HR, etc.).

**Atributos**:

-   `id`: Int (PK)
-   `name`: String (requerido)
-   `description`: String (opcional)

**Relaciones**:

-   `interviewSteps`: InterviewStep[] (1:N)

**Estado**: Modelado pero sin endpoints API

**Dónde**: `backend/prisma/schema.prisma:78-83`

---

## Diagrama de relaciones

Ver `memory-bank/architecture/diagrams.md` para diagrama ER completo.

## Reglas de negocio

### Implementadas

1. **Email único**: Un candidato no puede tener el mismo email que otro
2. **Validación de formato**: Nombres, emails, teléfonos validados con regex
3. **Límites de tamaño**: Campos con límites según schema

### No implementadas (deuda)

1. **Fechas coherentes**: `endDate >= startDate` en Education y WorkExperience
2. **Unicidad de aplicaciones**: Un candidato no puede aplicar dos veces a la misma posición (no validado)
3. **Estados de aplicación**: Transiciones de estado no validadas
4. **Orden de pasos**: `orderIndex` en InterviewStep no validado para ser secuencial

## Agregados (Aggregates)

### Candidate Aggregate

**Root**: Candidate

**Entidades relacionadas**: Education, WorkExperience, Resume, Application

**Regla**: Al eliminar un Candidate, se eliminan sus relaciones (CASCADE en Prisma)

### Position Aggregate

**Root**: Position

**Entidades relacionadas**: Application, Interview (a través de Application)

**Regla**: Al eliminar una Position, las Applications pueden quedar huérfanas (comportamiento no definido)

## Value Objects

**No detectados explícitamente**. Los siguientes podrían ser Value Objects:

-   Email (con validación)
-   Phone (con validación)
-   DateRange (startDate, endDate con validación)

**Mejora futura**: Extraer a clases separadas para reutilización.
