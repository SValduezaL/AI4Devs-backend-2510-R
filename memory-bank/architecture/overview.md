# Architecture Overview

## Estilo arquitectónico

**Clean Architecture / Layered Architecture** con separación de responsabilidades:

```
┌─────────────────────────────────────┐
│     Presentation Layer              │
│  (Controllers, Routes, Middleware)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Application Layer               │
│  (Services, Validators, Use Cases)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Domain Layer                     │
│  (Models, Business Logic)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Infrastructure Layer            │
│  (Prisma Client, File System)       │
└─────────────────────────────────────┘
```

## Componentes principales

### Backend

1. **Entry Point**: `backend/src/index.ts`

    - Configura Express
    - Inicializa Prisma Client
    - Registra middleware
    - Monta rutas
    - Inicia servidor

2. **Routes** (`backend/src/routes/`):

    - Define endpoints HTTP
    - Maneja errores HTTP básicos
    - Delega a controladores/servicios

3. **Controllers** (`backend/src/presentation/controllers/`):

    - Extrae datos de request
    - Llama a servicios
    - Formatea respuestas HTTP
    - Maneja errores de presentación

4. **Services** (`backend/src/application/services/`):

    - Lógica de aplicación
    - Coordina modelos de dominio
    - Valida datos (o delega a validadores)

5. **Validators** (`backend/src/application/validator.ts`):

    - Validación de datos de entrada
    - Reglas de negocio básicas (regex, longitudes)

6. **Domain Models** (`backend/src/domain/models/`):

    - Representan entidades de negocio
    - Contienen lógica de persistencia (Active Record)
    - Usan Prisma Client directamente

7. **Prisma** (`backend/prisma/`):
    - Schema de base de datos
    - Migraciones
    - Seed data

### Frontend

1. **Entry Point**: `frontend/src/index.tsx`

    - Renderiza App component
    - Configura React Router (inferido)

2. **Components** (`frontend/src/components/`):

    - Componentes React funcionales
    - UI con React Bootstrap

3. **Services** (`frontend/src/services/`):

    - Llamadas HTTP a backend
    - Transformación de datos

4. **App** (`frontend/src/App.tsx`):
    - Componente raíz
    - Routing (inferido)

## Flujo de datos típico

### Crear Candidato

```
1. Frontend: Usuario completa formulario
   ↓
2. Frontend: POST /candidates con JSON
   ↓
3. Backend: candidateRoutes.ts recibe request
   ↓
4. Backend: candidateService.addCandidate()
   ↓
5. Backend: validator.validateCandidateData()
   ↓
6. Backend: new Candidate(data)
   ↓
7. Backend: candidate.save() → Prisma
   ↓
8. Backend: Guardar relaciones (Education, WorkExperience, Resume)
   ↓
9. Backend: Response 201 con candidato creado
   ↓
10. Frontend: Muestra éxito/error
```

### Obtener Candidato

```
1. Frontend: GET /candidates/:id
   ↓
2. Backend: candidateRoutes.ts
   ↓
3. Backend: candidateService.findCandidateById()
   ↓
4. Backend: Candidate.findOne() → Prisma
   ↓
5. Prisma: Query con includes (educations, workExperiences, resumes, applications)
   ↓
6. Backend: Response 200 con JSON
   ↓
7. Frontend: Renderiza datos
```

## Dependencias entre módulos

### Backend

```
index.ts
├── candidateRoutes
│   └── candidateService
│       ├── validator
│       └── Candidate (domain model)
│           └── Prisma Client
├── fileUploadService (standalone)
│   └── Multer
└── Prisma Client (singleton)
```

**Regla**: Las capas superiores dependen de las inferiores, pero no al revés.

**Violación detectada**: Domain models dependen de Prisma (infrastructure), violando Clean Architecture estricta.

## Decisiones arquitectónicas

### 1. Active Record en Domain Models

**Decisión**: Modelos de dominio contienen métodos de persistencia (`save()`, `findOne()`).

**Razón**: Simplicidad, menos abstracciones.

**Trade-off**: Acoplamiento con Prisma, difícil testear sin BD.

**Alternativa**: Repository pattern o usar Prisma directamente en servicios.

### 2. Validación separada

**Decisión**: Validadores en capa de aplicación, no en modelos.

**Razón**: Separación de concerns, reutilizable.

**Trade-off**: Validación duplicada (también en OpenAPI spec).

### 3. Servicios sin inyección de dependencias

**Decisión**: Prisma Client instanciado globalmente.

**Razón**: Simplicidad.

**Trade-off**: Difícil testear, no permite múltiples instancias.

### 4. Sin capa de infraestructura explícita

**Decisión**: Prisma usado directamente en modelos y servicios.

**Razón**: Menos código, Prisma es suficientemente abstracto.

**Trade-off**: Cambiar de ORM requiere modificar múltiples archivos.

## Limitaciones actuales

1. **Sin separación clara de infraestructura**: Prisma mezclado con dominio
2. **Sin inyección de dependencias**: Dificulta testing y flexibilidad
3. **Sin eventos/observadores**: Cambios síncronos solamente
4. **Sin caché**: Todas las queries van a BD
5. **Sin transacciones explícitas**: Prisma las maneja automáticamente pero no visibles

## Escalabilidad

### Actual (monolito)

-   **Adecuado para**: < 1000 usuarios concurrentes, < 100K candidatos
-   **Límites**: Un solo proceso Node.js, una BD PostgreSQL

### Posibles mejoras

1. **Horizontal scaling**: Load balancer + múltiples instancias backend
2. **Caché**: Redis para queries frecuentes
3. **CDN**: Para archivos estáticos y uploads
4. **Queue**: Para procesamiento asíncrono (emails, notificaciones)
5. **Microservicios**: Separar por dominio (candidates, positions, interviews)

## Seguridad arquitectónica

### Implementado

-   Validación de entrada
-   CORS básico
-   Límites de tamaño de archivo

### Faltante

-   Autenticación/autorización
-   Rate limiting
-   Input sanitization (SQL injection protegido por Prisma)
-   HTTPS (asumido en producción)
-   Secrets management (variables de entorno)
