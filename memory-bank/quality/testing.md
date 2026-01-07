# Testing

## Estado actual

**Tests unitarios**: ✅ Implementados (54 tests pasando)

-   `backend/src/tests/unit/applicationService.test.ts` - 18 tests (servicios)
-   `backend/src/tests/unit/positionController.test.ts` - 10 tests (controlador GET)
-   `backend/src/tests/unit/candidateController.test.ts` - 14 tests (controlador PUT)
-   `backend/src/tests/unit/apiSpec.test.ts` - 8 tests (validación OpenAPI)
-   **Cobertura**: Tests TDD completos para nuevos endpoints

**Tests de integración**: No implementados (recomendado pero no obligatorio)

**Tests E2E**: No implementados

**Coverage**: Tests implementados, cobertura objetivo ≥85% (líneas y branches)

**📋 Análisis TDD completo**: Ver `documentation/best_practices.md` sección "Test-Driven Development (TDD)"

**Problema crítico identificado**: No se puede aplicar TDD correctamente porque los modelos de dominio están acoplados a Prisma. Ver `documentation/best_practices.md` sección DDD para solución (Repository Pattern).

**Nota sobre implementación actual**: Para los nuevos servicios (`applicationService.ts`), se ha implementado TDD usando mocks de Prisma Client directamente, lo que permite testear la lógica de negocio sin necesidad de base de datos. Esta es una solución temporal hasta implementar Repository Pattern.

## Configuración detectada

### Backend

**Jest configurado** (`backend/jest.config.js`):

```javascript
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
};
```

**Dependencias**:

-   `jest`: ^29.7.0
-   `ts-jest`: ^29.1.2
-   `@types/jest`: ^29.5.12

**Carpeta de tests**: ✅ Creada y con tests implementados (`backend/src/tests/unit/`)

### Frontend

**Testing Library instalado**:

-   `@testing-library/jest-dom`: ^5.17.0
-   `@testing-library/react`: ^13.4.0
-   `@testing-library/user-event`: ^13.5.0

**Script**: `npm test` configurado pero sin tests

## Estrategia de testing recomendada

### Pirámide de testing

```
        /\
       /  \  E2E (pocos, críticos)
      /____\
     /      \  Integration (algunos, flujos)
    /________\
   /          \  Unit (muchos, componentes)
  /____________\
```

### Unit Tests

**Qué testear** (priorizado según `documentation/best_practices.md`):

1. **Value Objects** (cuando se implementen):

    - Email, Phone, DateRange
    - Fáciles de testear, alto impacto
    - **Referencia**: `documentation/best_practices.md` sección TDD - Ejemplo: Test de Value Object

2. **Validadores** (`backend/src/application/validator.ts`):

    - Lógica crítica de validación
    - Funciones puras, fáciles de testear

3. **Servicios** (`backend/src/application/services/*.ts`):

    - **⚠️ Problema actual**: Dependen de modelos con persistencia (difícil de mockear)
    - **Solución**: Implementar Repository Pattern primero (ver `documentation/best_practices.md`)
    - Con repositorios, se pueden mockear fácilmente

4. Utilidades y helpers
5. Componentes React (lógica, no UI)

**Ejemplo** (validador):

```typescript
// validator.test.ts
import { validateCandidateData } from "./validator";

describe("validateCandidateData", () => {
    it("should accept valid candidate data", () => {
        const data = {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            phone: "612345678",
        };
        expect(() => validateCandidateData(data)).not.toThrow();
    });

    it("should reject invalid email", () => {
        const data = {
            firstName: "John",
            lastName: "Doe",
            email: "invalid-email",
        };
        expect(() => validateCandidateData(data)).toThrow("Invalid email");
    });
});
```

**Ejemplo con Repository Pattern** (recomendado en `documentation/best_practices.md`):

```typescript
// candidateService.test.ts
import { CandidateService } from "./CandidateService";
import { ICandidateRepository } from "../../domain/repositories/ICandidateRepository";
import { Candidate } from "../../domain/models/Candidate";

describe("CandidateService", () => {
    let mockRepository: jest.Mocked<ICandidateRepository>;
    let service: CandidateService;

    beforeEach(() => {
        mockRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
        };
        service = new CandidateService(mockRepository);
    });

    it("should create candidate with valid data", async () => {
        const candidateData = {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
        };

        const savedCandidate = new Candidate({ ...candidateData, id: 1 });
        mockRepository.save.mockResolvedValue(savedCandidate);

        const result = await service.addCandidate(candidateData);

        expect(mockRepository.save).toHaveBeenCalled();
        expect(result.id).toBe(1);
    });
});
```

**Referencia**: Ver `documentation/best_practices.md` sección TDD para más ejemplos

**Dónde**: `backend/src/tests/unit/` o `backend/src/__tests__/`

### Integration Tests

**Qué testear**:

-   Endpoints API completos
-   Flujos de negocio (crear candidato con relaciones)
-   Interacción con base de datos

**Setup necesario**:

-   Base de datos de test (separada de desarrollo)
-   Seed de datos de test
-   Cleanup después de cada test

**Ejemplo**:

```typescript
// candidate.integration.test.ts
import request from "supertest";
import { app } from "../index";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("POST /candidates", () => {
    beforeEach(async () => {
        await prisma.candidate.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should create a candidate", async () => {
        const response = await request(app)
            .post("/candidates")
            .send({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
            })
            .expect(201);

        expect(response.body).toHaveProperty("id");
        expect(response.body.email).toBe("john@example.com");
    });
});
```

**Dependencia**: `supertest` para testing de Express

**Dónde**: `backend/src/tests/integration/`

### E2E Tests

**Qué testear**:

-   Flujos completos de usuario
-   Frontend + Backend integrados

**Herramientas**:

-   **Cypress**: Popular para React
-   **Playwright**: Alternativa moderna
-   **Puppeteer**: Otra opción

**Ejemplo** (Cypress):

```javascript
// cypress/e2e/candidate.cy.js
describe("Candidate Management", () => {
    it("should create a candidate", () => {
        cy.visit("/add-candidate");
        cy.get('[name="firstName"]').type("John");
        cy.get('[name="lastName"]').type("Doe");
        cy.get('[name="email"]').type("john@example.com");
        cy.get('button[type="submit"]').click();
        cy.contains("Candidate added successfully");
    });
});
```

**Dónde**: `cypress/` o `e2e/` en raíz

## Mocks y stubs

### Para Unit Tests

**⚠️ Problema actual**: Los modelos de dominio usan Prisma directamente, lo que hace difícil mockear sin base de datos.

**✅ Solución recomendada** (ver `documentation/best_practices.md`):

-   Implementar Repository Pattern
-   Mockear interfaces de repositorios en lugar de Prisma
-   Tests rápidos y determinísticos

**Ejemplo con Repository Pattern** (recomendado):

```typescript
// Mock del repositorio (no de Prisma)
const mockRepository: jest.Mocked<ICandidateRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
};
```

**Ejemplo antiguo** (no recomendado, requiere BD):

```typescript
jest.mock("@prisma/client", () => ({
    PrismaClient: jest.fn(() => ({
        candidate: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
    })),
}));
```

### Para Integration Tests

**No mockear**: Usar base de datos real (de test)

## Coverage

### Configurar Jest

```javascript
// jest.config.js
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
};
```

### Ver coverage

```bash
npm test -- --coverage
```

**Objetivo inicial**: 70% coverage

**Objetivo a largo plazo**: 80-90%

## Test Data

### Seed de test

**Archivo**: `backend/prisma/seed.ts` existe pero para desarrollo

**Crear**: `backend/prisma/seed.test.ts` para datos de test

### Factories

**Librería**: `@faker-js/faker` para datos aleatorios

**Ejemplo**:

```typescript
import { faker } from "@faker-js/faker";

export const createCandidateData = () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
});
```

## CI/CD para tests

### GitHub Actions (ejemplo)

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
    test:
        runs-on: ubuntu-latest
        services:
            postgres:
                image: postgres
                env:
                    POSTGRES_PASSWORD: test
                options: >-
                    --health-cmd pg_isready
                    --health-interval 10s
                    --health-timeout 5s
                    --health-retries 5
        steps:
            - uses: actions/checkout@v2
            - uses: actions/setup-node@v2
            - run: npm install
            - run: npm test
```

## Convenciones

### Naming

-   **Archivos**: `*.test.ts` o `*.spec.ts`
-   **Describe blocks**: Nombre del módulo/función
-   **It blocks**: "should [comportamiento esperado]"

### Estructura

```
backend/src/tests/
├── unit/
│   ├── validator.test.ts
│   └── candidateService.test.ts
├── integration/
│   ├── candidate.integration.test.ts
│   └── upload.integration.test.ts
└── helpers/
    ├── testDb.ts
    └── factories.ts
```

## Quick wins para testing

**📋 Ver `documentation/best_practices.md` sección TDD para estrategia completa**

**Recomendación priorizada** (según `documentation/best_practices.md`):

1. **Empezar con Value Objects** (cuando se implementen):

    - Son fáciles de testear y alto impacto
    - **Esfuerzo**: 1-2 horas
    - **Referencia**: `documentation/best_practices.md` sección TDD

2. **Tests de validación** (1-2 horas):

    - Validadores son funciones puras, fáciles de testear
    - Alto impacto, bajo esfuerzo

3. **Implementar Repository Pattern primero** (2-3 días):

    - **⚠️ CRÍTICO**: Sin esto, no se pueden testear servicios sin BD
    - Habilitará testing real de servicios
    - **Referencia**: `documentation/best_practices.md` sección DDD

4. **Tests de servicios** (después de Repository Pattern):

    - Con repositorios mockeados
    - **Esfuerzo**: 2-3 días

5. **Tests de endpoints** (4-6 horas):

    - POST /candidates
    - GET /candidates/:id
    - POST /upload

6. **Setup de test DB** (2 horas):

    - Configurar Prisma con BD de test
    - Scripts de setup/teardown
    - Solo necesario para tests de integración

7. **Coverage básico** (1 hora):
    - Configurar Jest coverage
    - Añadir a CI

## Checklist

-   [x] Jest configurado (✅ hecho)
-   [x] Tests de servicios (✅ 18 tests en `applicationService.test.ts`)
-   [x] Tests de controladores (✅ 24 tests en `positionController.test.ts` y `candidateController.test.ts`)
-   [x] Tests de validación de API spec (✅ 8 tests en `apiSpec.test.ts`)
-   [ ] Tests de integración (recomendado pero no obligatorio)
-   [ ] Test database setup (para tests de integración)
-   [ ] Coverage configurado (Jest configurado, thresholds pendientes)
-   [ ] CI/CD con tests
-   [ ] E2E tests (opcional)
