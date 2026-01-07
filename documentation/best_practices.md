# Guía de Buenas Prácticas de Ingeniería

## LTI - Talent Tracking System

> **Documento específico para este repositorio**  
> Este documento analiza la arquitectura, patrones y violaciones de principios SOLID, DDD, TDD y Clean Architecture **en el código actual** del proyecto LTI.

---

## 📌 Contexto del Proyecto

### ¿Qué hace el sistema?

**LTI - Talent Tracking System** es un ATS (Applicant Tracking System) que gestiona:

-   Candidatos y sus datos personales
-   Educación y experiencia laboral
-   CVs/Resúmenes (archivos PDF/DOCX)
-   Aplicaciones a posiciones
-   Entrevistas y flujos de selección

### Arquitectura actual

El proyecto implementa una **Clean Architecture parcial** con las siguientes capas:

```
backend/src/
├── domain/models/          # Modelos de dominio (con persistencia)
├── application/
│   ├── services/           # Servicios de aplicación
│   └── validator.ts        # Validación de datos
├── presentation/
│   └── controllers/        # Controladores HTTP
└── routes/                 # Definición de rutas Express
```

**Stack tecnológico:**

-   Backend: Express + TypeScript + Prisma
-   Frontend: React
-   Base de datos: PostgreSQL

### Reparto actual de responsabilidades

**Estado actual:**

-   ✅ Separación de capas presente (domain, application, presentation)
-   ❌ Modelos de dominio acoplados a Prisma (viola Clean Architecture)
-   ❌ Validación mezclada con lógica de negocio
-   ❌ Sin tests automatizados
-   ❌ Inconsistencias en el flujo de datos (rutas llaman directamente a servicios)

---

## 🧩 Domain-Driven Design (DDD)

### Estado actual del modelo de dominio

El proyecto **intenta** aplicar DDD pero con limitaciones significativas:

#### ✅ Lo que está bien

1. **Separación de modelos de dominio**: Cada entidad tiene su propia clase (`Candidate`, `Education`, `WorkExperience`, etc.)
2. **Agregados identificables**: `Candidate` actúa como agregado raíz, conteniendo `Education[]`, `WorkExperience[]`, `Resume[]`
3. **Relaciones bien definidas**: El schema Prisma refleja correctamente las relaciones del dominio

#### ❌ Violaciones de DDD

**1. Active Record Pattern en lugar de Repository Pattern**

Los modelos de dominio están **directamente acoplados a Prisma**, violando el principio de inversión de dependencias:

```34:127:backend/src/domain/models/Candidate.ts
    async save() {
        const candidateData: any = {};

        // Solo añadir al objeto candidateData los campos que no son undefined
        if (this.firstName !== undefined) candidateData.firstName = this.firstName;
        if (this.lastName !== undefined) candidateData.lastName = this.lastName;
        if (this.email !== undefined) candidateData.email = this.email;
        if (this.phone !== undefined) candidateData.phone = this.phone;
        if (this.address !== undefined) candidateData.address = this.address;

        // Añadir educations si hay alguna para añadir
        if (this.education.length > 0) {
            candidateData.educations = {
                create: this.education.map(edu => ({
                    institution: edu.institution,
                    title: edu.title,
                    startDate: edu.startDate,
                    endDate: edu.endDate
                }))
            };
        }

        // Añadir workExperiences si hay alguna para añadir
        if (this.workExperience.length > 0) {
            candidateData.workExperiences = {
                create: this.workExperience.map(exp => ({
                    company: exp.company,
                    position: exp.position,
                    description: exp.description,
                    startDate: exp.startDate,
                    endDate: exp.endDate
                }))
            };
        }

        // Añadir resumes si hay alguno para añadir
        if (this.resumes.length > 0) {
            candidateData.resumes = {
                create: this.resumes.map(resume => ({
                    filePath: resume.filePath,
                    fileType: resume.fileType
                }))
            };
        }

        // Añadir applications si hay alguna para añadir
        if (this.applications.length > 0) {
            candidateData.applications = {
                create: this.applications.map(app => ({
                    positionId: app.positionId,
                    candidateId: app.candidateId,
                    applicationDate: app.applicationDate,
                    currentInterviewStep: app.currentInterviewStep,
                    notes: app.notes,
                }))
            };
        }

        if (this.id) {
            // Actualizar un candidato existente
            try {
                return await prisma.candidate.update({
                    where: { id: this.id },
                    data: candidateData
                });
            } catch (error: any) {
                console.log(error);
                if (error instanceof Prisma.PrismaClientInitializationError) {
                    // Database connection error
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                } else if (error.code === 'P2025') {
                    // Record not found error
                    throw new Error('No se pudo encontrar el registro del candidato con el ID proporcionado.');
                } else {
                    throw error;
                }
            }
        } else {
            // Crear un nuevo candidato
            try {
                const result = await prisma.candidate.create({
                    data: candidateData
                });
                return result;
            } catch (error: any) {
                if (error instanceof Prisma.PrismaClientInitializationError) {
                    // Database connection error
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                } else {
                    throw error;
                }
            }
        }
    }
```

**Problema**: El modelo de dominio conoce detalles de infraestructura (Prisma). Esto hace imposible:

-   Testear sin base de datos
-   Cambiar de ORM sin modificar el dominio
-   Aplicar TDD correctamente

**2. Falta de Value Objects**

Campos como `email`, `phone`, `address` son primitivos (`string`) sin validación encapsulada:

```9:32:backend/src/domain/models/Candidate.ts
export class Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    education: Education[];
    workExperience: WorkExperience[];
    resumes: Resume[];
    applications: Application[];

    constructor(data: any) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.phone = data.phone;
        this.address = data.address;
        this.education = data.education || [];
        this.workExperience = data.workExperience || [];
        this.resumes = data.resumes || [];
        this.applications = data.applications || [];
    }
```

**Problema**: La validación está en `validator.ts` (capa de aplicación), no en el dominio. Un `Email` debería ser un Value Object que garantice su validez.

**3. Falta de Domain Services**

Lógica de negocio compleja está en servicios de aplicación en lugar de Domain Services:

```7:55:backend/src/application/services/candidateService.ts
export const addCandidate = async (candidateData: any) => {
    try {
        validateCandidateData(candidateData); // Validar los datos del candidato
    } catch (error: any) {
        throw new Error(error);
    }

    const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
    try {
        const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
        const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

        // Guardar la educación del candidato
        if (candidateData.educations) {
            for (const education of candidateData.educations) {
                const educationModel = new Education(education);
                educationModel.candidateId = candidateId;
                await educationModel.save();
                candidate.education.push(educationModel);
            }
        }

        // Guardar la experiencia laboral del candidato
        if (candidateData.workExperiences) {
            for (const experience of candidateData.workExperiences) {
                const experienceModel = new WorkExperience(experience);
                experienceModel.candidateId = candidateId;
                await experienceModel.save();
                candidate.workExperience.push(experienceModel);
            }
        }

        // Guardar los archivos de CV
        if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
            const resumeModel = new Resume(candidateData.cv);
            resumeModel.candidateId = candidateId;
            await resumeModel.save();
            candidate.resumes.push(resumeModel);
        }
        return savedCandidate;
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint failed on the fields: (`email`)
            throw new Error('The email already exists in the database');
        } else {
            throw error;
        }
    }
};
```

**Problema**: La lógica de "crear candidato con sus relaciones" debería estar en un Domain Service, no en un Application Service.

### Recomendaciones DDD

#### 1. Introducir Repository Pattern

**❌ Antes (Active Record):**

```typescript
// Candidate.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class Candidate {
    async save() {
        return await prisma.candidate.create({ data: ... });
    }
}
```

**✅ Después (Repository):**

```typescript
// domain/repositories/ICandidateRepository.ts
export interface ICandidateRepository {
    save(candidate: Candidate): Promise<Candidate>;
    findById(id: number): Promise<Candidate | null>;
    findByEmail(email: string): Promise<Candidate | null>;
}

// domain/models/Candidate.ts
export class Candidate {
    // Sin métodos de persistencia
    // Solo lógica de dominio
    addEducation(education: Education): void {
        // Validar reglas de negocio
        this.education.push(education);
    }
}

// infrastructure/repositories/PrismaCandidateRepository.ts
export class PrismaCandidateRepository implements ICandidateRepository {
    constructor(private prisma: PrismaClient) {}

    async save(candidate: Candidate): Promise<Candidate> {
        // Implementación con Prisma
    }
}
```

**Por qué es mejor:**

-   El dominio no depende de infraestructura
-   Fácil de testear (mock del repository)
-   Permite cambiar de ORM sin tocar el dominio

#### 2. Crear Value Objects

**❌ Antes:**

```typescript
export class Candidate {
    email: string; // Primitivo sin validación
}
```

**✅ Después:**

```typescript
// domain/value-objects/Email.ts
export class Email {
    private readonly value: string;

    constructor(email: string) {
        if (!this.isValid(email)) {
            throw new Error("Invalid email format");
        }
        this.value = email;
    }

    private isValid(email: string): boolean {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    }

    toString(): string {
        return this.value;
    }
}

// domain/models/Candidate.ts
export class Candidate {
    email: Email; // Value Object con validación encapsulada
}
```

**Por qué es mejor:**

-   Validación en el lugar correcto (dominio)
-   Imposible crear un `Candidate` con email inválido
-   Reutilizable en otros agregados

#### 3. Identificar Aggregates claramente

**Estado actual:** `Candidate` es el agregado raíz, pero no está explícito.

**Recomendación:** Documentar y hacer explícito:

```typescript
// domain/aggregates/CandidateAggregate.ts
/**
 * Aggregate Root: Candidate
 *
 * Invariantes:
 * - Un candidato no puede tener dos educaciones con fechas solapadas
 * - Un candidato no puede tener experiencia laboral con endDate < startDate
 * - Un candidato debe tener al menos un email válido
 */
export class Candidate {
    // Métodos que garantizan invariantes
    addEducation(education: Education): void {
        this.validateEducationOverlap(education);
        this.education.push(education);
    }
}
```

---

## 🧪 Test-Driven Development (TDD)

### Estado actual de los tests

**❌ No hay tests implementados**

-   Carpeta `backend/src/tests/` no existe
-   `jest.config.js` configurado pero sin tests
-   Frontend tiene `@testing-library/*` instalado pero sin uso

### Cómo debería evolucionar con TDD

#### 1. Estructura de tests recomendada

```
backend/src/
├── tests/
│   ├── unit/
│   │   ├── domain/
│   │   │   ├── models/
│   │   │   │   └── Candidate.test.ts
│   │   │   └── value-objects/
│   │   │       └── Email.test.ts
│   │   ├── application/
│   │   │   ├── services/
│   │   │   │   └── candidateService.test.ts
│   │   │   └── validator.test.ts
│   │   └── presentation/
│   │       └── controllers/
│   │           └── candidateController.test.ts
│   └── integration/
│       └── api/
│           └── candidates.test.ts
```

#### 2. Ejemplo: Test de Value Object (TDD)

**Paso 1: Red** - Escribir test que falle:

```typescript
// tests/unit/domain/value-objects/Email.test.ts
import { Email } from "../../../../domain/value-objects/Email";

describe("Email Value Object", () => {
    it("should throw error for invalid email format", () => {
        expect(() => new Email("invalid-email")).toThrow(
            "Invalid email format"
        );
    });

    it("should create email for valid format", () => {
        const email = new Email("test@example.com");
        expect(email.toString()).toBe("test@example.com");
    });
});
```

**Paso 2: Green** - Implementar mínimo código:

```typescript
// domain/value-objects/Email.ts
export class Email {
    constructor(private value: string) {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            throw new Error("Invalid email format");
        }
    }

    toString(): string {
        return this.value;
    }
}
```

**Paso 3: Refactor** - Mejorar si es necesario.

#### 3. Ejemplo: Test de Repository (con mocks)

**❌ Problema actual:** No se puede testear `Candidate.save()` sin base de datos.

**✅ Con Repository Pattern:**

```typescript
// tests/unit/application/services/candidateService.test.ts
import { addCandidate } from "../../../application/services/candidateService";
import { ICandidateRepository } from "../../../domain/repositories/ICandidateRepository";
import { Candidate } from "../../../domain/models/Candidate";

describe("CandidateService", () => {
    let mockRepository: jest.Mocked<ICandidateRepository>;

    beforeEach(() => {
        mockRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
        };
    });

    it("should create candidate with valid data", async () => {
        const candidateData = {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
        };

        const savedCandidate = new Candidate({ ...candidateData, id: 1 });
        mockRepository.save.mockResolvedValue(savedCandidate);

        const result = await addCandidate(candidateData, mockRepository);

        expect(mockRepository.save).toHaveBeenCalled();
        expect(result.id).toBe(1);
    });
});
```

**Por qué es mejor:**

-   Tests rápidos (sin BD)
-   Tests determinísticos (sin dependencias externas)
-   Fácil de mockear diferentes escenarios

### Recomendaciones TDD

1. **Empezar con Value Objects**: Son fáciles de testear y alto impacto
2. **Testear validadores**: Lógica crítica de validación
3. **Tests de integración para endpoints**: Verificar flujo completo
4. **Mock de repositorios**: No depender de BD en tests unitarios

---

## 🧱 Principios SOLID

### Single Responsibility Principle (SRP)

#### Violación 1: Modelo de dominio con persistencia

**❌ Antes:**

```34:127:backend/src/domain/models/Candidate.ts
    async save() {
        const candidateData: any = {};

        // Solo añadir al objeto candidateData los campos que no son undefined
        if (this.firstName !== undefined) candidateData.firstName = this.firstName;
        if (this.lastName !== undefined) candidateData.lastName = this.lastName;
        if (this.email !== undefined) candidateData.email = this.email;
        if (this.phone !== undefined) candidateData.phone = this.phone;
        if (this.address !== undefined) candidateData.address = this.address;

        // Añadir educations si hay alguna para añadir
        if (this.education.length > 0) {
            candidateData.educations = {
                create: this.education.map(edu => ({
                    institution: edu.institution,
                    title: edu.title,
                    startDate: edu.startDate,
                    endDate: edu.endDate
                }))
            };
        }

        // Añadir workExperiences si hay alguna para añadir
        if (this.workExperience.length > 0) {
            candidateData.workExperiences = {
                create: this.workExperience.map(exp => ({
                    company: exp.company,
                    position: exp.position,
                    description: exp.description,
                    startDate: exp.startDate,
                    endDate: exp.endDate
                }))
            };
        }

        // Añadir resumes si hay alguno para añadir
        if (this.resumes.length > 0) {
            candidateData.resumes = {
                create: this.resumes.map(resume => ({
                    filePath: resume.filePath,
                    fileType: resume.fileType
                }))
            };
        }

        // Añadir applications si hay alguna para añadir
        if (this.applications.length > 0) {
            candidateData.applications = {
                create: this.applications.map(app => ({
                    positionId: app.positionId,
                    candidateId: app.candidateId,
                    applicationDate: app.applicationDate,
                    currentInterviewStep: app.currentInterviewStep,
                    notes: app.notes,
                }))
            };
        }

        if (this.id) {
            // Actualizar un candidato existente
            try {
                return await prisma.candidate.update({
                    where: { id: this.id },
                    data: candidateData
                });
            } catch (error: any) {
                console.log(error);
                if (error instanceof Prisma.PrismaClientInitializationError) {
                    // Database connection error
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                } else if (error.code === 'P2025') {
                    // Record not found error
                    throw new Error('No se pudo encontrar el registro del candidato con el ID proporcionado.');
                } else {
                    throw error;
                }
            }
        } else {
            // Crear un nuevo candidato
            try {
                const result = await prisma.candidate.create({
                    data: candidateData
                });
                return result;
            } catch (error: any) {
                if (error instanceof Prisma.PrismaClientInitializationError) {
                    // Database connection error
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                } else {
                    throw error;
                }
            }
        }
    }
```

**Problema:** `Candidate` tiene **dos responsabilidades**:

1. Representar la lógica de negocio del candidato
2. Persistir datos en la base de datos

**✅ Después:**

```typescript
// domain/models/Candidate.ts
export class Candidate {
    // Solo lógica de dominio
    addEducation(education: Education): void {
        this.validateEducationOverlap(education);
        this.education.push(education);
    }

    // Sin métodos save(), findOne(), etc.
}

// infrastructure/repositories/PrismaCandidateRepository.ts
export class PrismaCandidateRepository {
    async save(candidate: Candidate): Promise<Candidate> {
        // Responsabilidad única: persistencia
        return await this.prisma.candidate.create({ ... });
    }
}
```

**Por qué es mejor:**

-   `Candidate` solo se encarga de lógica de negocio
-   `PrismaCandidateRepository` solo se encarga de persistencia
-   Cada clase tiene una razón para cambiar

#### Violación 2: Validador con múltiples responsabilidades

**❌ Antes:**

```80:107:backend/src/application/validator.ts
export const validateCandidateData = (data: any) => {
    if (data.id) {
        // If id is provided, we are editing an existing candidate, so fields are not mandatory
        return;
    }

    validateName(data.firstName);
    validateName(data.lastName);
    validateEmail(data.email);
    validatePhone(data.phone);
    validateAddress(data.address);

    if (data.educations) {
        for (const education of data.educations) {
            validateEducation(education);
        }
    }

    if (data.workExperiences) {
        for (const experience of data.workExperiences) {
            validateExperience(experience);
        }
    }

    if (data.cv && Object.keys(data.cv).length > 0) {
        validateCV(data.cv);
    }
};
```

**Problema:** `validateCandidateData` valida:

-   Campos individuales (nombre, email, etc.)
-   Colecciones (educations, workExperiences)
-   Lógica condicional (si hay id, no validar)

**✅ Después:**

```typescript
// application/validators/FieldValidator.ts
export class FieldValidator {
    static validateName(name: string): void { ... }
    static validateEmail(email: string): void { ... }
    static validatePhone(phone: string): void { ... }
}

// application/validators/EducationValidator.ts
export class EducationValidator {
    static validate(education: Education): void { ... }
    static validateCollection(educations: Education[]): void { ... }
}

// application/validators/CandidateValidator.ts
export class CandidateValidator {
    constructor(
        private fieldValidator: FieldValidator,
        private educationValidator: EducationValidator,
        private experienceValidator: ExperienceValidator
    ) {}

    validate(data: CandidateData, isUpdate: boolean): void {
        if (isUpdate) return; // Lógica de actualización separada

        this.fieldValidator.validateName(data.firstName);
        this.educationValidator.validateCollection(data.educations);
        // ...
    }
}
```

**Por qué es mejor:**

-   Cada validador tiene una responsabilidad específica
-   Fácil de testear individualmente
-   Reutilizable en otros contextos

---

### Open/Closed Principle (OCP)

#### Violación: Validación hardcodeada

**❌ Antes:**

```1:4:backend/src/application/validator.ts
const NAME_REGEX = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(6|7|9)\d{8}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
```

**Problema:** Para cambiar las reglas de validación (ej: permitir otros formatos de teléfono), hay que modificar el código.

**✅ Después (Strategy Pattern):**

```typescript
// application/validators/strategies/ValidationStrategy.ts
export interface ValidationStrategy {
    validate(value: string): boolean;
}

// application/validators/strategies/PhoneValidationStrategy.ts
export class SpanishPhoneValidationStrategy implements ValidationStrategy {
    validate(phone: string): boolean {
        return /^(6|7|9)\d{8}$/.test(phone);
    }
}

export class InternationalPhoneValidationStrategy
    implements ValidationStrategy
{
    validate(phone: string): boolean {
        return /^\+\d{1,3}\d{9,14}$/.test(phone);
    }
}

// application/validators/PhoneValidator.ts
export class PhoneValidator {
    constructor(private strategy: ValidationStrategy) {}

    validate(phone: string): void {
        if (!this.strategy.validate(phone)) {
            throw new Error("Invalid phone");
        }
    }
}

// Uso:
const validator = new PhoneValidator(new SpanishPhoneValidationStrategy());
// O cambiar a internacional sin modificar PhoneValidator:
const validator = new PhoneValidator(
    new InternationalPhoneValidationStrategy()
);
```

**Por qué es mejor:**

-   Abierto para extensión (nuevas estrategias)
-   Cerrado para modificación (no tocar `PhoneValidator`)
-   Fácil de testear cada estrategia

---

### Liskov Substitution Principle (LSP)

#### Estado actual

No hay herencia en el código actual, por lo que LSP no se viola directamente. Sin embargo, hay un riesgo potencial:

**⚠️ Riesgo futuro:** Si se crean subclases de modelos:

```typescript
// ❌ Violación potencial de LSP
class PremiumCandidate extends Candidate {
    async save() {
        // Cambia el comportamiento esperado
        throw new Error("Premium candidates must be saved differently");
    }
}
```

**✅ Cumplir LSP:**

```typescript
// Si se necesita herencia, garantizar que las subclases sean sustituibles
class PremiumCandidate extends Candidate {
    // No sobrescribir save() de forma que rompa el contrato
    // O usar composición en lugar de herencia
}
```

**Recomendación:** Preferir composición sobre herencia para modelos de dominio.

---

### Interface Segregation Principle (ISP)

#### Violación: Repository monolítico potencial

Si se implementa un `ICandidateRepository` con muchos métodos, se violaría ISP:

**❌ Antes (potencial):**

```typescript
interface ICandidateRepository {
    save(candidate: Candidate): Promise<Candidate>;
    findById(id: number): Promise<Candidate | null>;
    findByEmail(email: string): Promise<Candidate | null>;
    findByPhone(phone: string): Promise<Candidate[]>;
    findByEducation(institution: string): Promise<Candidate[]>;
    findByExperience(company: string): Promise<Candidate[]>;
    delete(id: number): Promise<void>;
    update(candidate: Candidate): Promise<Candidate>;
    // ... muchos más métodos
}
```

**Problema:** Una clase que solo necesita `findById` se ve forzada a implementar todos los métodos.

**✅ Después:**

```typescript
// Separar en interfaces específicas
interface IReadCandidateRepository {
    findById(id: number): Promise<Candidate | null>;
    findByEmail(email: string): Promise<Candidate | null>;
}

interface IWriteCandidateRepository {
    save(candidate: Candidate): Promise<Candidate>;
    delete(id: number): Promise<void>;
}

interface ICandidateSearchRepository {
    findByEducation(institution: string): Promise<Candidate[]>;
    findByExperience(company: string): Promise<Candidate[]>;
}

// Implementación puede implementar solo lo que necesita
class PrismaCandidateRepository
    implements IReadCandidateRepository, IWriteCandidateRepository {
    // Solo implementa lo necesario
}
```

**Por qué es mejor:**

-   Clientes solo dependen de lo que usan
-   Fácil de mockear en tests
-   Interfaces más pequeñas y cohesivas

---

### Dependency Inversion Principle (DIP)

#### Violación crítica: Dependencia directa de Prisma

**❌ Antes:**

```1:7:backend/src/domain/models/Candidate.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { Education } from './Education';
import { WorkExperience } from './WorkExperience';
import { Resume } from './Resume';
import { Application } from './Application';

const prisma = new PrismaClient();
```

**Problema:** El dominio (capa interna) depende de Prisma (infraestructura, capa externa). Viola la regla de dependencias de Clean Architecture.

**✅ Después:**

```typescript
// domain/repositories/ICandidateRepository.ts (interfaz en dominio)
export interface ICandidateRepository {
    save(candidate: Candidate): Promise<Candidate>;
    findById(id: number): Promise<Candidate | null>;
}

// domain/models/Candidate.ts (sin dependencias de infraestructura)
export class Candidate {
    // Sin importar Prisma
    // Solo lógica de dominio
}

// application/services/candidateService.ts
export class CandidateService {
    constructor(private repository: ICandidateRepository) {} // Depende de abstracción

    async addCandidate(data: CandidateData): Promise<Candidate> {
        const candidate = new Candidate(data);
        return await this.repository.save(candidate);
    }
}

// infrastructure/repositories/PrismaCandidateRepository.ts
export class PrismaCandidateRepository implements ICandidateRepository {
    constructor(private prisma: PrismaClient) {} // Implementación concreta
}
```

**Por qué es mejor:**

-   El dominio no conoce Prisma
-   Fácil de cambiar de ORM
-   Testeable con mocks
-   Cumple Clean Architecture

#### Violación 2: Servicio con dependencia directa

**❌ Antes:**

```7:55:backend/src/application/services/candidateService.ts
export const addCandidate = async (candidateData: any) => {
    try {
        validateCandidateData(candidateData); // Validar los datos del candidato
    } catch (error: any) {
        throw new Error(error);
    }

    const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
    try {
        const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
        const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

        // Guardar la educación del candidato
        if (candidateData.educations) {
            for (const education of candidateData.educations) {
                const educationModel = new Education(education);
                educationModel.candidateId = candidateId;
                await educationModel.save();
                candidate.education.push(educationModel);
            }
        }

        // Guardar la experiencia laboral del candidato
        if (candidateData.workExperiences) {
            for (const experience of candidateData.workExperiences) {
                const experienceModel = new WorkExperience(experience);
                experienceModel.candidateId = candidateId;
                await experienceModel.save();
                candidate.workExperience.push(experienceModel);
            }
        }

        // Guardar los archivos de CV
        if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
            const resumeModel = new Resume(candidateData.cv);
            resumeModel.candidateId = candidateId;
            await resumeModel.save();
            candidate.resumes.push(resumeModel);
        }
        return savedCandidate;
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint failed on the fields: (`email`)
            throw new Error('The email already exists in the database');
        } else {
            throw error;
        }
    }
};
```

**Problema:** El servicio llama directamente a `candidate.save()`, que internamente usa Prisma. Además, crea instancias de `Education`, `WorkExperience`, `Resume` y llama a sus métodos `save()`.

**✅ Después:**

```typescript
// application/services/CandidateService.ts
export class CandidateService {
    constructor(
        private candidateRepository: ICandidateRepository,
        private educationRepository: IEducationRepository,
        private experienceRepository: IExperienceRepository,
        private resumeRepository: IResumeRepository,
        private validator: ICandidateValidator
    ) {}

    async addCandidate(data: CandidateData): Promise<Candidate> {
        this.validator.validate(data);

        const candidate = new Candidate(data);
        const savedCandidate = await this.candidateRepository.save(candidate);

        // Guardar relaciones usando repositorios
        if (data.educations) {
            for (const eduData of data.educations) {
                const education = new Education({
                    ...eduData,
                    candidateId: savedCandidate.id,
                });
                await this.educationRepository.save(education);
            }
        }

        // ... similar para workExperiences y resumes

        return savedCandidate;
    }
}
```

**Por qué es mejor:**

-   Depende de abstracciones (interfaces)
-   Fácil de testear (mock de repositorios)
-   Cumple DIP

---

## ♻ DRY y Reutilización

### Duplicaciones detectadas

#### 1. Patrón `save()` duplicado en todos los modelos

**❌ Antes:**

Cada modelo (`Candidate`, `Education`, `WorkExperience`, `Resume`) tiene su propio método `save()` con lógica similar:

```22:46:backend/src/domain/models/Education.ts
    async save() {
        const educationData: any = {
            institution: this.institution,
            title: this.title,
            startDate: this.startDate,
            endDate: this.endDate,
        };

        if (this.candidateId !== undefined) {
            educationData.candidateId = this.candidateId;
        }

        if (this.id) {
            // Actualizar una experiencia laboral existente
            return await prisma.education.update({
                where: { id: this.id },
                data: educationData
            });
        } else {
            // Crear una nueva experiencia laboral
            return await prisma.education.create({
                data: educationData
            });
        }
    }
```

```24:49:backend/src/domain/models/WorkExperience.ts
    async save() {
        const workExperienceData: any = {
            company: this.company,
            position: this.position,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate
        };

        if (this.candidateId !== undefined) {
            workExperienceData.candidateId = this.candidateId;
        }

        if (this.id) {
            // Actualizar una experiencia laboral existente
            return await prisma.workExperience.update({
                where: { id: this.id },
                data: workExperienceData
            });
        } else {
            // Crear una nueva experiencia laboral
            return await prisma.workExperience.create({
                data: workExperienceData
            });
        }
    }
```

**Problema:** Mismo patrón repetido en múltiples clases.

**✅ Después (con Repository Pattern):**

```typescript
// infrastructure/repositories/BaseRepository.ts
export abstract class BaseRepository<T> {
    constructor(protected prisma: PrismaClient) {}

    abstract getModelName(): string;

    async save(entity: T): Promise<T> {
        const data = this.toPrismaData(entity);
        const modelName = this.getModelName();

        if (entity.id) {
            return await this.prisma[modelName].update({
                where: { id: entity.id },
                data,
            });
        } else {
            return await this.prisma[modelName].create({ data });
        }
    }

    abstract toPrismaData(entity: T): any;
}

// infrastructure/repositories/EducationRepository.ts
export class EducationRepository extends BaseRepository<Education> {
    getModelName(): string {
        return "education";
    }

    toPrismaData(education: Education): any {
        return {
            institution: education.institution,
            title: education.title,
            startDate: education.startDate,
            endDate: education.endDate,
            candidateId: education.candidateId,
        };
    }
}
```

**Por qué es mejor:**

-   Elimina duplicación
-   Cambios en lógica de persistencia en un solo lugar
-   Fácil de extender para nuevos modelos

#### 2. Manejo de errores duplicado

**❌ Antes:**

```99:125:backend/src/domain/models/Candidate.ts
            } catch (error: any) {
                console.log(error);
                if (error instanceof Prisma.PrismaClientInitializationError) {
                    // Database connection error
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                } else if (error.code === 'P2025') {
                    // Record not found error
                    throw new Error('No se pudo encontrar el registro del candidato con el ID proporcionado.');
                } else {
                    throw error;
                }
            }
        } else {
            // Crear un nuevo candidato
            try {
                const result = await prisma.candidate.create({
                    data: candidateData
                });
                return result;
            } catch (error: any) {
                if (error instanceof Prisma.PrismaClientInitializationError) {
                    // Database connection error
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                } else {
                    throw error;
                }
            }
```

**Problema:** Mismo manejo de errores repetido en múltiples lugares.

**✅ Después:**

```typescript
// infrastructure/errors/PrismaErrorHandler.ts
export class PrismaErrorHandler {
    static handle(error: any): Error {
        if (error instanceof Prisma.PrismaClientInitializationError) {
            return new Error(
                "No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución."
            );
        }

        if (error.code === "P2025") {
            return new Error("No se pudo encontrar el registro solicitado.");
        }

        if (error.code === "P2002") {
            return new Error("Ya existe un registro con estos datos únicos.");
        }

        return error;
    }
}

// Uso en Repository:
try {
    return await prisma.candidate.create({ data });
} catch (error) {
    throw PrismaErrorHandler.handle(error);
}
```

**Por qué es mejor:**

-   Un solo lugar para manejar errores de Prisma
-   Consistencia en mensajes de error
-   Fácil de extender con nuevos códigos de error

#### 3. Validación de fechas duplicada

**❌ Antes:**

```26:30:backend/src/application/validator.ts
const validateDate = (date: string) => {
    if (!date || !DATE_REGEX.test(date)) {
        throw new Error('Invalid date');
    }
};
```

Y luego se usa en múltiples lugares:

```47:51:backend/src/application/validator.ts
    validateDate(education.startDate);

    if (education.endDate && !DATE_REGEX.test(education.endDate)) {
        throw new Error('Invalid end date');
    }
```

**✅ Después:**

```typescript
// domain/value-objects/DateRange.ts
export class DateRange {
    constructor(
        public readonly startDate: Date,
        public readonly endDate?: Date
    ) {
        if (endDate && endDate < startDate) {
            throw new Error("End date must be after start date");
        }
    }

    static fromStrings(start: string, end?: string): DateRange {
        if (!DATE_REGEX.test(start)) {
            throw new Error("Invalid start date format");
        }
        if (end && !DATE_REGEX.test(end)) {
            throw new Error("Invalid end date format");
        }

        return new DateRange(new Date(start), end ? new Date(end) : undefined);
    }
}

// Uso:
const dateRange = DateRange.fromStrings(education.startDate, education.endDate);
```

**Por qué es mejor:**

-   Validación de formato y lógica de negocio en un solo lugar
-   Reutilizable en `Education` y `WorkExperience`
-   Imposible crear un `DateRange` inválido

---

## 🧰 Patrones de Diseño

### Patrones ya presentes (parcialmente implementados)

#### 1. Active Record Pattern

**Estado:** Implementado en todos los modelos de dominio.

**Problema:** Viola Clean Architecture y DIP.

**Recomendación:** Migrar a Repository Pattern (ver sección DDD).

#### 2. Service Layer Pattern

**Estado:** Implementado en `candidateService.ts`.

**✅ Bien aplicado:**

-   Separa lógica de negocio de controladores
-   Coordina múltiples modelos

**❌ Mejorable:**

-   Debería usar inyección de dependencias
-   Debería depender de abstracciones (repositorios)

#### 3. Controller Pattern

**Estado:** Implementado en `candidateController.ts`.

**Problema:** No se usa consistentemente. Las rutas llaman directamente a servicios:

```6:18:backend/src/routes/candidateRoutes.ts
router.post('/', async (req, res) => {
  try {
    // console.log(req.body); //Just in case you want to inspect the request body
    const result = await addCandidate(req.body);
    res.status(201).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({ message: "An unexpected error occurred" });
    }
  }
});
```

**✅ Debería ser:**

```typescript
router.post("/", addCandidateController); // Usar el controlador existente
```

#### 4. Validator Pattern

**Estado:** Implementado en `validator.ts`.

**Problema:** Validación mezclada (formato + lógica de negocio).

**Recomendación:** Separar en:

-   Validadores de formato (Value Objects)
-   Validadores de reglas de negocio (Domain Services)

### Patrones que deberían introducirse

#### 1. Repository Pattern

**Por qué:** Desacoplar dominio de infraestructura.

**Cómo:** Ver sección DDD - Recomendaciones.

#### 2. Factory Pattern

**Cuándo usar:** Para crear agregados complejos.

**Ejemplo:**

```typescript
// domain/factories/CandidateFactory.ts
export class CandidateFactory {
    static create(data: CandidateData): Candidate {
        const candidate = new Candidate({
            firstName: data.firstName,
            lastName: data.lastName,
            email: new Email(data.email), // Value Object
            phone: data.phone ? new Phone(data.phone) : undefined,
        });

        // Añadir educación si existe
        if (data.educations) {
            data.educations.forEach((edu) => {
                candidate.addEducation(
                    new Education({
                        institution: edu.institution,
                        title: edu.title,
                        dateRange: DateRange.fromStrings(
                            edu.startDate,
                            edu.endDate
                        ),
                    })
                );
            });
        }

        return candidate;
    }
}
```

**Por qué es mejor:**

-   Encapsula lógica de creación compleja
-   Garantiza que los objetos se crean en estado válido
-   Fácil de testear

#### 3. Strategy Pattern

**Cuándo usar:** Para validación configurable (ver sección OCP).

#### 4. Adapter Pattern

**Cuándo usar:** Si se necesita integrar con sistemas externos (ej: APIs de terceros).

**Ejemplo futuro:**

```typescript
// Si se integra con LinkedIn API
interface IExternalCandidateSource {
    fetchCandidate(email: string): Promise<CandidateData>;
}

class LinkedInAdapter implements IExternalCandidateSource {
    async fetchCandidate(email: string): Promise<CandidateData> {
        // Adaptar respuesta de LinkedIn a nuestro formato
    }
}
```

#### 5. Unit of Work Pattern

**Cuándo usar:** Para transacciones que involucran múltiples agregados.

**Ejemplo:**

```typescript
// application/unit-of-work/IUnitOfWork.ts
export interface IUnitOfWork {
    candidates: ICandidateRepository;
    educations: IEducationRepository;
    experiences: IExperienceRepository;

    commit(): Promise<void>;
    rollback(): Promise<void>;
}

// Uso en servicio:
async addCandidateWithRelations(data: CandidateData): Promise<Candidate> {
    const uow = this.unitOfWorkFactory.create();

    try {
        const candidate = new Candidate(data);
        await uow.candidates.save(candidate);

        for (const edu of data.educations) {
            const education = new Education({ ...edu, candidateId: candidate.id });
            await uow.educations.save(education);
        }

        await uow.commit();
        return candidate;
    } catch (error) {
        await uow.rollback();
        throw error;
    }
}
```

**Por qué es mejor:**

-   Garantiza consistencia transaccional
-   Fácil de testear (mock del UoW)

---

## 📋 Resumen de Recomendaciones Prioritarias

### Prioridad Alta (Impacto inmediato)

1. **Introducir Repository Pattern**

    - Desacoplar modelos de Prisma
    - Habilitar testing sin BD
    - **Esfuerzo:** 2-3 días

2. **Corregir inconsistencia en rutas**

    - Usar controladores en lugar de llamar servicios directamente
    - **Esfuerzo:** 1 hora

3. **Extraer configuración a variables de entorno**
    - PORT, CORS_ORIGIN, UPLOAD_PATH
    - **Esfuerzo:** 30 minutos

### Prioridad Media (Mejora de calidad)

4. **Crear Value Objects**

    - Email, Phone, DateRange
    - **Esfuerzo:** 1 día

5. **Separar validadores por responsabilidad**

    - FieldValidator, EducationValidator, etc.
    - **Esfuerzo:** 1 día

6. **Implementar tests unitarios básicos**
    - Empezar con Value Objects y validadores
    - **Esfuerzo:** 2-3 días

### Prioridad Baja (Refactorización a largo plazo)

7. **Introducir Factory Pattern**

    - Para creación de agregados complejos
    - **Esfuerzo:** 1 día

8. **Implementar Unit of Work Pattern**

    - Para transacciones complejas
    - **Esfuerzo:** 2 días

9. **Migrar a Domain Services**
    - Mover lógica de negocio compleja del Application Service
    - **Esfuerzo:** 2-3 días

---

## 🎯 Conclusión

Este proyecto tiene una **base sólida** con separación de capas y estructura clara. Sin embargo, hay **violaciones críticas** de principios SOLID y DDD que limitan:

-   **Testabilidad:** Imposible testear sin base de datos
-   **Mantenibilidad:** Cambios en Prisma afectan el dominio
-   **Extensibilidad:** Difícil añadir nuevas funcionalidades sin romper código existente

**Próximos pasos recomendados:**

1. Implementar Repository Pattern (mayor impacto)
2. Introducir Value Objects (mejora inmediata de validación)
3. Añadir tests unitarios (garantizar calidad)
4. Refactorizar gradualmente siguiendo este documento

Este documento debe ser la **referencia oficial** para todas las decisiones arquitectónicas futuras del proyecto.

---

**Última actualización:** 2026-01-07
**Versión del documento:** 1.0
