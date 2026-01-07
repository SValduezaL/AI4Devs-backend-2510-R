# Testing

## Estado actual

**Tests unitarios**: No implementados

**Tests de integración**: No implementados

**Tests E2E**: No implementados

**Coverage**: Desconocido (sin tests)

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

**Carpeta de tests**: Mencionada en README (`backend/src/tests/`) pero no existe

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

**Qué testear**:

-   Validadores (`backend/src/application/validator.ts`)
-   Servicios (`backend/src/application/services/*.ts`)
-   Utilidades y helpers
-   Componentes React (lógica, no UI)

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

**Prisma Client**: Mockear en tests unitarios

**Ejemplo**:

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

1. **Tests de validación** (1-2 horas):

    - Validadores son funciones puras, fáciles de testear
    - Alto impacto, bajo esfuerzo

2. **Tests de endpoints** (4-6 horas):

    - POST /candidates
    - GET /candidates/:id
    - POST /upload

3. **Setup de test DB** (2 horas):

    - Configurar Prisma con BD de test
    - Scripts de setup/teardown

4. **Coverage básico** (1 hora):
    - Configurar Jest coverage
    - Añadir a CI

## Checklist

-   [ ] Jest configurado (✅ hecho)
-   [ ] Tests de validación
-   [ ] Tests de servicios
-   [ ] Tests de endpoints (integration)
-   [ ] Test database setup
-   [ ] Coverage configurado
-   [ ] CI/CD con tests
-   [ ] E2E tests (opcional)
