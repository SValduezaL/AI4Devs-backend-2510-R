# Architecture Diagrams

## Diagrama de componentes (C4 Level 2)

```mermaid
graph TB
    subgraph "User"
        RECRUITER[Reclutador]
    end

    subgraph "Frontend Application"
        UI[React UI Components]
        ROUTER[React Router]
        API_CLIENT[API Service Layer]
    end

    subgraph "Backend API"
        EXPRESS[Express Server]
        ROUTES[Route Handlers]
        CONTROLLERS[Controllers]
        SERVICES[Application Services]
        VALIDATORS[Validators]
        MODELS[Domain Models]
    end

    subgraph "Infrastructure"
        PRISMA[Prisma ORM]
        POSTGRES[(PostgreSQL Database)]
        FILES[File System - uploads/]
        MULTER[Multer Middleware]
    end

    RECRUITER -->|HTTP| UI
    UI --> ROUTER
    ROUTER --> API_CLIENT
    API_CLIENT -->|HTTP REST| EXPRESS
    EXPRESS --> ROUTES
    ROUTES --> CONTROLLERS
    CONTROLLERS --> SERVICES
    SERVICES --> VALIDATORS
    SERVICES --> MODELS
    MODELS --> PRISMA
    PRISMA --> POSTGRES
    EXPRESS --> MULTER
    MULTER --> FILES

    style RECRUITER fill:#e1f5ff
    style POSTGRES fill:#336791
    style PRISMA fill:#2d3748
    style EXPRESS fill:#ff6b6b
```

## Diagrama de flujo de datos: Crear Candidato

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant R as Routes
    participant S as Service
    participant V as Validator
    participant M as Model
    participant P as Prisma
    participant DB as PostgreSQL

    U->>F: Completa formulario
    F->>F: Sube CV (opcional)
    F->>R: POST /candidates
    R->>S: addCandidate(data)
    S->>V: validateCandidateData(data)
    V-->>S: OK / Error
    alt Validación OK
        S->>M: new Candidate(data)
        M->>P: prisma.candidate.create()
        P->>DB: INSERT candidate
        DB-->>P: candidate.id
        loop Para cada educación
            S->>M: new Education(edu)
            M->>P: prisma.education.create()
            P->>DB: INSERT education
        end
        loop Para cada experiencia
            S->>M: new WorkExperience(exp)
            M->>P: prisma.workExperience.create()
            P->>DB: INSERT workExperience
        end
        alt CV presente
            S->>M: new Resume(cv)
            M->>P: prisma.resume.create()
            P->>DB: INSERT resume
        end
        P-->>M: savedCandidate
        M-->>S: candidate
        S-->>R: candidate
        R-->>F: 201 Created
        F-->>U: Éxito
    else Validación falla
        V-->>S: Error
        S-->>R: Error
        R-->>F: 400 Bad Request
        F-->>U: Error
    end
```

## Diagrama de modelo de datos (simplificado)

```mermaid
erDiagram
    Candidate ||--o{ Education : has
    Candidate ||--o{ WorkExperience : has
    Candidate ||--o{ Resume : has
    Candidate ||--o{ Application : makes

    Application }o--|| Position : applies_to
    Application }o--|| InterviewStep : current_step
    Application ||--o{ Interview : has

    Interview }o--|| InterviewStep : part_of
    Interview }o--|| Employee : conducted_by

    InterviewStep }o--|| InterviewFlow : belongs_to
    InterviewStep }o--|| InterviewType : is_type

    Position }o--|| Company : belongs_to
    Position }o--|| InterviewFlow : uses

    Company ||--o{ Employee : employs
    Company ||--o{ Position : offers

    Candidate {
        int id PK
        string firstName
        string lastName
        string email UK
        string phone
        string address
    }

    Education {
        int id PK
        int candidateId FK
        string institution
        string title
        date startDate
        date endDate
    }

    WorkExperience {
        int id PK
        int candidateId FK
        string company
        string position
        string description
        date startDate
        date endDate
    }

    Resume {
        int id PK
        int candidateId FK
        string filePath
        string fileType
        date uploadDate
    }

    Application {
        int id PK
        int positionId FK
        int candidateId FK
        int currentInterviewStep FK
        date applicationDate
        string notes
    }

    Position {
        int id PK
        int companyId FK
        int interviewFlowId FK
        string title
        string description
        string status
    }

    Interview {
        int id PK
        int applicationId FK
        int interviewStepId FK
        int employeeId FK
        date interviewDate
        string result
        int score
        string notes
    }
```

## Diagrama de deployment (actual)

```mermaid
graph TB
    subgraph "Development Machine"
        DEV[Developer]
    end

    subgraph "Local Development"
        FE_DEV[Frontend Dev Server<br/>localhost:3000]
        BE_DEV[Backend Server<br/>localhost:3010]
    end

    subgraph "Docker"
        POSTGRES_CONTAINER[PostgreSQL Container<br/>localhost:5433]
    end

    subgraph "File System"
        UPLOADS[uploads/ directory]
    end

    DEV --> FE_DEV
    DEV --> BE_DEV
    FE_DEV -->|HTTP| BE_DEV
    BE_DEV -->|SQL| POSTGRES_CONTAINER
    BE_DEV -->|Write| UPLOADS

    style FE_DEV fill:#61dafb
    style BE_DEV fill:#ff6b6b
    style POSTGRES_CONTAINER fill:#336791
```

## Limitaciones de los diagramas

1. **Simplificados**: No muestran todos los middleware, errores, edge cases
2. **Estáticos**: No reflejan cambios en tiempo de ejecución
3. **Sin detalles de implementación**: No muestran código específico
4. **Modelo de datos incompleto**: Algunas relaciones no mostradas (InterviewStep → InterviewType, etc.)
5. **Deployment básico**: No muestra producción, CI/CD, monitoring

## Notas sobre Mermaid

-   Los diagramas se renderizan en Markdown viewers que soporten Mermaid (GitHub, GitLab, muchos editores)
-   Si no se renderizan, usar herramientas online: https://mermaid.live/
-   Para editar: Modificar código Mermaid en este archivo
