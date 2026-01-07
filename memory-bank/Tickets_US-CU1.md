# Tickets Técnicos - US-CU1: Visualización y gestión de candidatos en proceso mediante interfaz Kanban

## User Story US-CU1 (Resumen)

**Objetivo**: Permitir a los reclutadores visualizar todos los candidatos en proceso para una posición específica en una interfaz tipo Kanban, mostrando información clave (nombre completo, etapa actual, puntuación media) y poder mover candidatos entre diferentes etapas del proceso de selección.

**Endpoints a implementar**:

-   `GET /positions/:id/candidates` - Obtener candidatos en proceso para una posición
-   `PUT /candidates/:id/stage` - Actualizar etapa del candidato en el proceso

---

## Backlog Técnico Desglosado

### Ticket 1: Implementar servicio para obtener candidatos en proceso de una posición

**Título**: Backend - Servicio para obtener candidatos en proceso con información agregada

**Descripción**:
Crear un servicio en la capa de aplicación que obtenga todas las aplicaciones (Application) asociadas a una posición específica, incluyendo información del candidato, etapa actual del proceso y cálculo de la puntuación media de las entrevistas. Este servicio será utilizado por el controlador del endpoint GET `/positions/:id/candidates`.

**Alcance**:

-   ✅ Crear función `getCandidatesByPosition` en `backend/src/application/services/applicationService.ts` (o crear el archivo si no existe)
-   ✅ Implementar query Prisma que obtenga aplicaciones con relaciones necesarias (Candidate, InterviewStep, Interview)
-   ✅ Calcular puntuación media de entrevistas (promedio de scores no null)
-   ✅ Formatear respuesta con nombre completo, etapa actual y puntuación media
-   ✅ Manejar casos donde no hay entrevistas o no hay scores
-   ❌ NO incluye validación de entrada (se hará en controlador)
-   ❌ NO incluye manejo de errores HTTP (se hará en controlador)

**Dependencias**:

-   Ninguna (puede desarrollarse en paralelo con Ticket 2)

**Criterios de aceptación técnicos**:

-   La función `getCandidatesByPosition(positionId: number)` existe y retorna una Promise
-   La función realiza una query Prisma que incluye:
    -   `Application` filtrado por `positionId`
    -   Relación `candidate` con campos `firstName`, `lastName`
    -   Relación `interviewStep` con campo `name`
    -   Relación `interviews` con campo `score`
-   El cálculo de puntuación media:
    -   Filtra entrevistas con `score !== null`
    -   Calcula promedio: `sum(scores) / count(scores)`
    -   Retorna `null` si no hay entrevistas con score
-   La respuesta tiene formato:
    ```typescript
    {
      candidateId: number,
      fullName: string, // firstName + " " + lastName
      currentInterviewStep: {
        id: number,
        name: string
      },
      averageScore: number | null,
      applicationId: number
    }[]
    ```
-   La función maneja correctamente casos donde:
    -   No hay aplicaciones para la posición (retorna array vacío)
    -   Hay aplicaciones pero sin entrevistas (averageScore = null)
    -   Hay entrevistas pero sin scores (averageScore = null)

**Requisitos funcionales**:

-   Obtener todas las aplicaciones activas para una posición
-   Mostrar nombre completo del candidato
-   Mostrar etapa actual con su nombre
-   Calcular y mostrar puntuación media de entrevistas

**Requisitos no funcionales**:

-   **Rendimiento**: Query debe usar `include` de Prisma para evitar N+1 queries
-   **Código**: Seguir patrón Service Layer existente (ver `candidateService.ts`)
-   **TypeScript**: Usar tipos específicos, evitar `any`
-   **Arquitectura**: Respetar Clean Architecture (servicio en `application/services/`)

**Tests Unitarios TDD** (Definition of Done - OBLIGATORIO):

**Archivo de test**: `backend/src/tests/unit/applicationService.test.ts`

**Estrategia TDD**:

1. Escribir tests primero (Red)
2. Implementar funcionalidad mínima (Green)
3. Refactorizar si es necesario (Refactor)

**Setup y Mocks necesarios**:

```typescript
import { PrismaClient } from "@prisma/client";
jest.mock("@prisma/client", () => ({
    PrismaClient: jest.fn(() => ({
        application: {
            findMany: jest.fn(),
        },
    })),
}));
```

**Casos de prueba a implementar**:

1. **should return empty array when position has no applications**

    - Mock: `prisma.application.findMany` retorna `[]`
    - Assert: Retorna `[]`
    - Assert: No se calcula puntuación

2. **should return candidates with full name concatenated correctly**

    - Mock: Aplicación con candidate `{ firstName: "Juan", lastName: "Pérez" }`
    - Assert: `fullName === "Juan Pérez"`

3. **should return current interview step with id and name**

    - Mock: Aplicación con interviewStep `{ id: 2, name: "Entrevista Técnica" }`
    - Assert: `currentInterviewStep.id === 2`
    - Assert: `currentInterviewStep.name === "Entrevista Técnica"`

4. **should calculate average score correctly from interviews with scores**

    - Mock: Aplicación con interviews `[{ score: 8 }, { score: 7 }, { score: 9 }]`
    - Assert: `averageScore === 8` (promedio correcto)

5. **should return null average score when no interviews exist**

    - Mock: Aplicación sin interviews o con array vacío
    - Assert: `averageScore === null`

6. **should return null average score when all interviews have null score**

    - Mock: Aplicación con interviews `[{ score: null }, { score: null }]`
    - Assert: `averageScore === null`

7. **should filter out interviews with null scores when calculating average**

    - Mock: Aplicación con interviews `[{ score: 8 }, { score: null }, { score: 7 }]`
    - Assert: `averageScore === 7.5` (solo cuenta los no null)

8. **should handle multiple applications for same position**

    - Mock: `findMany` retorna array con 3 aplicaciones diferentes
    - Assert: Retorna array de longitud 3
    - Assert: Cada elemento tiene estructura correcta

9. **should include applicationId in response**

    - Mock: Aplicación con `id: 123`
    - Assert: `applicationId === 123`

10. **should handle Prisma errors gracefully**
    - Mock: `prisma.application.findMany` lanza error
    - Assert: Error se propaga correctamente (para que controlador lo maneje)

**Cobertura objetivo**:

-   Líneas: ≥ 90%
-   Branches: ≥ 85%
-   Funciones: 100%
-   Statements: ≥ 90%

**Entregables**:

-   Archivo `backend/src/application/services/applicationService.ts` con función `getCandidatesByPosition`
-   Archivo `backend/src/tests/unit/applicationService.test.ts` con todos los casos de prueba
-   Tests pasando (`npm test`)
-   Código documentado con comentarios JSDoc
-   Tipos TypeScript definidos para request/response

**Estimación**: 5 puntos (medio-alto) - Aumenta por incluir tests TDD completos

---

### Ticket 2: Implementar controlador y ruta GET /positions/:id/candidates

**Título**: Backend - Endpoint GET para obtener candidatos en proceso de una posición

**Descripción**:
Crear el controlador HTTP y la ruta para el endpoint `GET /positions/:id/candidates` que exponga el servicio desarrollado en el Ticket 1. El endpoint debe validar el ID de posición, manejar errores apropiadamente y retornar la información de candidatos en formato JSON.

**Alcance**:

-   ✅ Crear controlador `getCandidatesByPosition` en `backend/src/presentation/controllers/positionController.ts` (o crear archivo)
-   ✅ Crear ruta en `backend/src/routes/positionRoutes.ts` (o crear archivo)
-   ✅ Registrar ruta en `backend/src/index.ts`
-   ✅ Validar que `positionId` es un número válido
-   ✅ Manejar errores: 400 (ID inválido), 404 (posición no encontrada), 500 (error interno)
-   ✅ Retornar respuesta JSON con formato consistente
-   ❌ NO incluye lógica de negocio (está en servicio)
-   ❌ NO incluye cálculo de puntuación (está en servicio)

**Dependencias**:

-   **Ticket 1** (requiere servicio `getCandidatesByPosition`)

**Criterios de aceptación técnicos**:

-   El endpoint `GET /positions/:id/candidates` está registrado y accesible
-   El controlador valida que `:id` sea un número válido (retorna 400 si no)
-   El controlador llama al servicio `getCandidatesByPosition(positionId)`
-   El controlador verifica si la posición existe (el servicio debe validar esto o el controlador)
-   Respuesta 200 OK con formato:
    ```json
    [
        {
            "candidateId": 1,
            "fullName": "Juan Pérez",
            "currentInterviewStep": {
                "id": 2,
                "name": "Entrevista Técnica"
            },
            "averageScore": 7.5,
            "applicationId": 1
        }
    ]
    ```
-   Respuesta 400 Bad Request si ID inválido:
    ```json
    {
        "error": "Invalid position ID format"
    }
    ```
-   Respuesta 404 Not Found si posición no existe:
    ```json
    {
        "error": "Position not found"
    }
    ```
-   Respuesta 500 Internal Server Error con mensaje genérico en caso de error inesperado
-   El código sigue el patrón de `candidateController.ts` (manejo de errores, tipos)

**Requisitos funcionales**:

-   Exponer información de candidatos en proceso para una posición
-   Validar entrada del usuario
-   Proporcionar mensajes de error claros

**Requisitos no funcionales**:

-   **Rendimiento**: Respuesta en menos de 500ms para hasta 100 candidatos
-   **Seguridad**: Validar entrada para prevenir inyección SQL (Prisma ya lo protege, pero validar tipos)
-   **Código**: Seguir patrón Controller existente
-   **API**: Formato JSON consistente con otros endpoints
-   **HTTP**: Códigos de estado apropiados (200, 400, 404, 500)

**Tests Unitarios TDD** (Definition of Done - OBLIGATORIO):

**Archivo de test**: `backend/src/tests/unit/positionController.test.ts`

**Estrategia TDD**:

1. Escribir tests primero para validaciones y manejo de errores
2. Implementar controlador
3. Refactorizar

**Setup y Mocks necesarios**:

```typescript
import { Request, Response } from 'express';
import * as applicationService from '../../../application/services/applicationService';

jest.mock('../../../application/services/applicationService');
const mockGetCandidatesByPosition = applicationService.getCandidatesByPosition as jest.MockedFunction<...>;
```

**Casos de prueba a implementar**:

1. **should return 200 with candidates array when positionId is valid**

    - Mock: `getCandidatesByPosition` retorna array con candidatos
    - Request: `params.id = "1"`
    - Assert: Status 200
    - Assert: Body es array con estructura correcta

2. **should return 200 with empty array when position has no candidates**

    - Mock: `getCandidatesByPosition` retorna `[]`
    - Request: `params.id = "1"`
    - Assert: Status 200
    - Assert: Body es `[]`

3. **should return 400 when positionId is not a number**

    - Request: `params.id = "abc"`
    - Assert: Status 400
    - Assert: Body contiene `{ error: "Invalid position ID format" }`

4. **should return 400 when positionId is negative**

    - Request: `params.id = "-1"`
    - Assert: Status 400
    - Assert: Mensaje de error apropiado

5. **should return 400 when positionId is zero**

    - Request: `params.id = "0"`
    - Assert: Status 400

6. **should return 400 when positionId is decimal**

    - Request: `params.id = "1.5"`
    - Assert: Status 400

7. **should return 404 when position does not exist**

    - Mock: `getCandidatesByPosition` lanza error "Position not found"
    - Request: `params.id = "999"`
    - Assert: Status 404
    - Assert: Body contiene `{ error: "Position not found" }`

8. **should return 500 when service throws unexpected error**

    - Mock: `getCandidatesByPosition` lanza Error genérico
    - Request: `params.id = "1"`
    - Assert: Status 500
    - Assert: Body contiene mensaje de error genérico

9. **should call service with parsed integer positionId**

    - Request: `params.id = "123"`
    - Assert: `getCandidatesByPosition` fue llamado con `123` (number)

10. **should handle service returning null gracefully**
    - Mock: `getCandidatesByPosition` retorna `null`
    - Assert: Status 404 o 500 según lógica de negocio

**Tests de Integración** (Recomendado pero no obligatorio para DoD):

-   Usar `supertest` para probar endpoint completo
-   Requiere BD de test configurada

**Cobertura objetivo**:

-   Líneas: ≥ 85%
-   Branches: ≥ 80%
-   Funciones: 100%

**Entregables**:

-   Archivo `backend/src/presentation/controllers/positionController.ts` con función `getCandidatesByPosition`
-   Archivo `backend/src/routes/positionRoutes.ts` con ruta GET `/positions/:id/candidates`
-   Archivo `backend/src/tests/unit/positionController.test.ts` con todos los casos de prueba
-   Modificación en `backend/src/index.ts` para registrar rutas de posición
-   Tests pasando (`npm test`)
-   Código documentado

**Estimación**: 3 puntos (medio) - Aumenta por incluir tests TDD completos

---

### Ticket 3: Implementar servicio para actualizar etapa de candidato

**Título**: Backend - Servicio para actualizar etapa de proceso de un candidato

**Descripción**:
Crear un servicio en la capa de aplicación que actualice el campo `currentInterviewStep` de una aplicación específica. El servicio debe validar que la aplicación existe, que el nuevo paso pertenece al flujo de entrevistas de la posición, y actualizar el registro en la base de datos.

**Alcance**:

-   ✅ Crear función `updateCandidateStage` en `backend/src/application/services/applicationService.ts`
-   ✅ Validar que existe la aplicación (por candidateId y positionId, o por applicationId)
-   ✅ Validar que el nuevo `currentInterviewStep` pertenece al `interviewFlowId` de la posición
-   ✅ Actualizar campo `currentInterviewStep` en la aplicación
-   ✅ Retornar aplicación actualizada con relaciones
-   ❌ NO incluye validación de formato de entrada (se hará en controlador)
-   ❌ NO incluye manejo de errores HTTP (se hará en controlador)

**Dependencias**:

-   Ninguna (puede desarrollarse en paralelo con otros tickets)

**Criterios de aceptación técnicos**:

-   La función `updateCandidateStage(candidateId: number, positionId: number, newStepId: number)` existe
-   La función busca la aplicación por `candidateId` y `positionId` (o recibe `applicationId` directamente)
-   La función valida que la aplicación existe (lanza error si no)
-   La función obtiene el `interviewFlowId` de la posición
-   La función valida que `newStepId` pertenece al mismo `interviewFlowId`:
    ```typescript
    // Pseudocódigo
    const step = await prisma.interviewStep.findUnique({
        where: { id: newStepId },
    });
    if (!step || step.interviewFlowId !== position.interviewFlowId) {
        throw new Error("Invalid interview step for this position");
    }
    ```
-   La función actualiza `currentInterviewStep` en la aplicación
-   La función retorna la aplicación actualizada con relaciones (candidate, interviewStep, position)
-   La función maneja errores de Prisma apropiadamente

**Requisitos funcionales**:

-   Actualizar etapa de proceso de un candidato
-   Validar que la nueva etapa es válida para la posición
-   Retornar información actualizada

**Requisitos no funcionales**:

-   **Rendimiento**: Operación debe completarse en menos de 200ms
-   **Transaccionalidad**: La actualización debe ser atómica (Prisma update es atómico)
-   **Código**: Seguir patrón Service Layer existente
-   **TypeScript**: Usar tipos específicos
-   **Arquitectura**: Respetar Clean Architecture

**Tests Unitarios TDD** (Definition of Done - OBLIGATORIO):

**Archivo de test**: `backend/src/tests/unit/applicationService.test.ts` (añadir tests a archivo existente)

**Estrategia TDD**:

1. Escribir tests primero para cada validación
2. Implementar validaciones una por una
3. Refactorizar

**Setup y Mocks necesarios**:

```typescript
import { PrismaClient } from "@prisma/client";
jest.mock("@prisma/client", () => ({
    PrismaClient: jest.fn(() => ({
        application: {
            findFirst: jest.fn(),
            update: jest.fn(),
        },
        position: {
            findUnique: jest.fn(),
        },
        interviewStep: {
            findUnique: jest.fn(),
        },
    })),
}));
```

**Casos de prueba a implementar**:

1. **should update currentInterviewStep when all validations pass**

    - Mock: Aplicación existe, posición existe, step pertenece al flujo
    - Mock: `prisma.application.update` retorna aplicación actualizada
    - Assert: Retorna aplicación con `currentInterviewStep` actualizado
    - Assert: `prisma.application.update` fue llamado con datos correctos

2. **should throw error when application does not exist**

    - Mock: `prisma.application.findFirst` retorna `null`
    - Assert: Lanza error "Application not found"

3. **should throw error when position does not exist**

    - Mock: Aplicación existe pero `prisma.position.findUnique` retorna `null`
    - Assert: Lanza error "Position not found"

4. **should throw error when interview step does not exist**

    - Mock: Aplicación y posición existen, pero `prisma.interviewStep.findUnique` retorna `null`
    - Assert: Lanza error "Interview step not found"

5. **should throw error when step belongs to different interview flow**

    - Mock: Step existe pero `step.interviewFlowId !== position.interviewFlowId`
    - Assert: Lanza error "Invalid interview step for this position"

6. **should find application by candidateId and positionId**

    - Mock: `prisma.application.findFirst` con where correcto
    - Assert: `findFirst` fue llamado con `{ where: { candidateId, positionId } }`

7. **should return updated application with all relations**

    - Mock: `prisma.application.update` con `include: { candidate, interviewStep, position }`
    - Assert: Retorna aplicación con relaciones incluidas

8. **should handle Prisma update errors gracefully**

    - Mock: `prisma.application.update` lanza Prisma error
    - Assert: Error se propaga correctamente

9. **should validate that newStepId is positive number**

    - Parámetros: `newStepId = 0` o negativo
    - Assert: Lanza error de validación (o se valida en controlador)

10. **should handle case when application has no current step initially**
    - Mock: Aplicación existe pero `currentInterviewStep` es null
    - Assert: Actualización funciona correctamente

**Cobertura objetivo**:

-   Líneas: ≥ 90%
-   Branches: ≥ 90% (validaciones críticas)
-   Funciones: 100%
-   Statements: ≥ 90%

**Entregables**:

-   Función `updateCandidateStage` en `backend/src/application/services/applicationService.ts`
-   Tests añadidos a `backend/src/tests/unit/applicationService.test.ts` con todos los casos
-   Tests pasando (`npm test`)
-   Código documentado con JSDoc
-   Tipos TypeScript definidos

**Estimación**: 8 puntos (alto) - Aumenta por incluir tests TDD completos y validaciones complejas

---

### Ticket 4: Implementar controlador y ruta PUT /candidates/:id/stage

**Título**: Backend - Endpoint PUT para actualizar etapa de candidato en proceso

**Descripción**:
Crear el controlador HTTP y la ruta para el endpoint `PUT /candidates/:id/stage` que permita actualizar la etapa de proceso de un candidato. El endpoint debe recibir el `positionId` y el nuevo `currentInterviewStep` en el body, validar la entrada, y llamar al servicio desarrollado en el Ticket 3.

**Alcance**:

-   ✅ Crear controlador `updateCandidateStage` en `backend/src/presentation/controllers/candidateController.ts` (añadir a archivo existente)
-   ✅ Crear ruta PUT en `backend/src/routes/candidateRoutes.ts` (añadir a archivo existente)
-   ✅ Validar que `candidateId` es número válido
-   ✅ Validar body: `positionId` (number) y `currentInterviewStep` (number) requeridos
-   ✅ Manejar errores: 400 (validación), 404 (aplicación/step no encontrado), 500 (error interno)
-   ✅ Retornar respuesta JSON con aplicación actualizada
-   ❌ NO incluye lógica de negocio (está en servicio)
-   ❌ NO incluye validación de flujo (está en servicio)

**Dependencias**:

-   **Ticket 3** (requiere servicio `updateCandidateStage`)

**Criterios de aceptación técnicos**:

-   El endpoint `PUT /candidates/:id/stage` está registrado y accesible
-   El controlador valida que `:id` sea un número válido (400 si no)
-   El controlador valida body:
    ```typescript
    {
      positionId: number, // requerido
      currentInterviewStep: number // requerido
    }
    ```
-   Respuesta 200 OK con aplicación actualizada:
    ```json
    {
        "id": 1,
        "positionId": 1,
        "candidateId": 1,
        "currentInterviewStep": 2,
        "applicationDate": "2024-01-15T00:00:00.000Z",
        "candidate": {
            "id": 1,
            "firstName": "Juan",
            "lastName": "Pérez"
        },
        "interviewStep": {
            "id": 2,
            "name": "Entrevista Técnica"
        }
    }
    ```
-   Respuesta 400 Bad Request si validación falla:
    ```json
    {
        "error": "Invalid request body. positionId and currentInterviewStep are required"
    }
    ```
-   Respuesta 404 Not Found si aplicación no existe o step inválido:
    ```json
    {
        "error": "Application not found" // o "Invalid interview step for this position"
    }
    ```
-   Respuesta 500 Internal Server Error con mensaje genérico
-   El código sigue patrón de `candidateController.ts`

**Requisitos funcionales**:

-   Permitir actualizar etapa de candidato
-   Validar entrada del usuario
-   Proporcionar mensajes de error claros

**Requisitos no funcionales**:

-   **Rendimiento**: Respuesta en menos de 300ms
-   **Seguridad**: Validar entrada, prevenir inyección
-   **Código**: Seguir patrón Controller existente
-   **API**: Formato JSON consistente
-   **HTTP**: Códigos de estado apropiados (200, 400, 404, 500)

**Tests Unitarios TDD** (Definition of Done - OBLIGATORIO):

**Archivo de test**: `backend/src/tests/unit/candidateController.test.ts` (añadir tests a archivo existente o crear nuevo)

**Estrategia TDD**:

1. Escribir tests primero para validaciones de entrada
2. Implementar controlador
3. Refactorizar

**Setup y Mocks necesarios**:

```typescript
import { Request, Response } from 'express';
import * as applicationService from '../../../application/services/applicationService';

jest.mock('../../../application/services/applicationService');
const mockUpdateCandidateStage = applicationService.updateCandidateStage as jest.MockedFunction<...>;
```

**Casos de prueba a implementar**:

1. **should return 200 with updated application when update succeeds**

    - Mock: `updateCandidateStage` retorna aplicación actualizada
    - Request: `params.id = "1"`, body válido
    - Assert: Status 200
    - Assert: Body contiene aplicación actualizada

2. **should return 400 when candidateId is not a number**

    - Request: `params.id = "abc"`
    - Assert: Status 400
    - Assert: Body contiene `{ error: "Invalid candidate ID format" }`

3. **should return 400 when candidateId is negative or zero**

    - Request: `params.id = "-1"` o `"0"`
    - Assert: Status 400

4. **should return 400 when body is missing positionId**

    - Request: Body `{ currentInterviewStep: 2 }`
    - Assert: Status 400
    - Assert: Mensaje indica que positionId es requerido

5. **should return 400 when body is missing currentInterviewStep**

    - Request: Body `{ positionId: 1 }`
    - Assert: Status 400
    - Assert: Mensaje indica que currentInterviewStep es requerido

6. **should return 400 when positionId is not a number**

    - Request: Body `{ positionId: "abc", currentInterviewStep: 2 }`
    - Assert: Status 400

7. **should return 400 when currentInterviewStep is not a number**

    - Request: Body `{ positionId: 1, currentInterviewStep: "abc" }`
    - Assert: Status 400

8. **should return 400 when positionId is negative or zero**

    - Request: Body `{ positionId: -1, currentInterviewStep: 2 }`
    - Assert: Status 400

9. **should return 400 when currentInterviewStep is negative or zero**

    - Request: Body `{ positionId: 1, currentInterviewStep: 0 }`
    - Assert: Status 400

10. **should return 404 when application does not exist**

    - Mock: `updateCandidateStage` lanza error "Application not found"
    - Request: Parámetros válidos
    - Assert: Status 404
    - Assert: Body contiene mensaje de error apropiado

11. **should return 404 when interview step is invalid for position**

    - Mock: `updateCandidateStage` lanza error "Invalid interview step for this position"
    - Request: Parámetros válidos
    - Assert: Status 404
    - Assert: Body contiene mensaje de error apropiado

12. **should return 500 when service throws unexpected error**

    - Mock: `updateCandidateStage` lanza Error genérico
    - Request: Parámetros válidos
    - Assert: Status 500
    - Assert: Body contiene mensaje genérico

13. **should call service with correct parameters**

    - Request: `params.id = "123"`, body `{ positionId: 1, currentInterviewStep: 2 }`
    - Assert: `updateCandidateStage` fue llamado con `(123, 1, 2)`

14. **should handle empty body gracefully**
    - Request: Body `{}`
    - Assert: Status 400

**Cobertura objetivo**:

-   Líneas: ≥ 85%
-   Branches: ≥ 85%
-   Funciones: 100%

**Entregables**:

-   Función `updateCandidateStage` añadida a `backend/src/presentation/controllers/candidateController.ts`
-   Ruta PUT añadida a `backend/src/routes/candidateRoutes.ts`
-   Tests añadidos a `backend/src/tests/unit/candidateController.test.ts` con todos los casos
-   Tests pasando (`npm test`)
-   Código documentado

**Estimación**: 5 puntos (medio-alto) - Aumenta por incluir tests TDD completos

---

### Ticket 5: Documentar endpoints en API specification

**Título**: Documentación - Añadir especificación OpenAPI para nuevos endpoints

**Descripción**:
Actualizar el archivo `backend/api-spec.yaml` con la documentación completa de los dos nuevos endpoints (`GET /positions/:id/candidates` y `PUT /candidates/:id/stage`), incluyendo parámetros, respuestas, códigos de error y ejemplos.

**Alcance**:

-   ✅ Añadir especificación para `GET /positions/:id/candidates` en `backend/api-spec.yaml`
-   ✅ Añadir especificación para `PUT /candidates/:id/stage` en `backend/api-spec.yaml`
-   ✅ Incluir ejemplos de request/response
-   ✅ Documentar códigos de error (400, 404, 500)
-   ✅ Seguir formato OpenAPI 3.0 existente en el archivo
-   ❌ NO incluye integración con Swagger UI (tarea separada)

**Dependencias**:

-   **Ticket 2** y **Ticket 4** (para conocer estructura exacta de respuestas)

**Criterios de aceptación técnicos**:

-   El archivo `backend/api-spec.yaml` contiene especificación completa para ambos endpoints
-   La especificación incluye:
    -   Path parameters (donde aplique)
    -   Request body schema (para PUT)
    -   Response schemas (200, 400, 404, 500)
    -   Ejemplos de request/response
    -   Descripciones claras
-   La especificación sigue formato OpenAPI 3.0
-   La especificación es consistente con endpoints existentes en el archivo

**Requisitos funcionales**:

-   Documentar API para desarrolladores
-   Proporcionar ejemplos de uso

**Requisitos no funcionales**:

-   **Documentación**: Formato estándar OpenAPI
-   **Mantenibilidad**: Fácil de actualizar cuando cambien endpoints
-   **Claridad**: Ejemplos y descripciones comprensibles

**Tests Unitarios TDD** (Definition of Done - OBLIGATORIO):

**Archivo de test**: `backend/src/tests/unit/apiSpec.test.ts` (nuevo archivo para validar especificación)

**Estrategia TDD**:

1. Validar estructura YAML
2. Validar esquemas OpenAPI
3. Validar consistencia con implementación

**Casos de prueba a implementar**:

1. **should have valid OpenAPI 3.0 YAML structure**

    - Assert: YAML se puede parsear sin errores
    - Assert: Tiene estructura OpenAPI 3.0 válida

2. **should include GET /positions/:id/candidates endpoint**

    - Assert: Endpoint está documentado
    - Assert: Tiene parámetro `id` en path
    - Assert: Tiene respuestas 200, 400, 404, 500

3. **should include PUT /candidates/:id/stage endpoint**

    - Assert: Endpoint está documentado
    - Assert: Tiene parámetro `id` en path
    - Assert: Tiene request body schema
    - Assert: Tiene respuestas 200, 400, 404, 500

4. **should have correct request body schema for PUT endpoint**

    - Assert: Schema incluye `positionId` (number, required)
    - Assert: Schema incluye `currentInterviewStep` (number, required)

5. **should have correct response schema for GET endpoint**

    - Assert: Response 200 tiene array de objetos con estructura correcta
    - Assert: Incluye campos: candidateId, fullName, currentInterviewStep, averageScore, applicationId

6. **should have correct response schema for PUT endpoint**

    - Assert: Response 200 tiene objeto Application con relaciones
    - Assert: Incluye campos: id, positionId, candidateId, currentInterviewStep

7. **should have error response schemas for both endpoints**

    - Assert: Respuestas 400, 404, 500 tienen schema de error
    - Assert: Schema incluye campo `error` (string)

8. **should have examples for both endpoints**
    - Assert: GET tiene ejemplo de response
    - Assert: PUT tiene ejemplo de request y response

**Herramientas de validación**:

-   Usar `swagger-parser` o `@apidevtools/swagger-parser` para validar OpenAPI
-   Validar YAML con parser estándar

**Cobertura objetivo**:

-   Validación completa de estructura
-   Validación de esquemas
-   Consistencia con implementación

**Entregables**:

-   Archivo `backend/api-spec.yaml` actualizado con ambos endpoints
-   Archivo `backend/src/tests/unit/apiSpec.test.ts` con validaciones
-   Tests pasando (`npm test`)
-   Especificación validada con herramienta OpenAPI

**Estimación**: 3 puntos (medio) - Aumenta por incluir tests de validación

---

### Ticket 6: Validación y manejo de errores mejorado

**Título**: Backend - Mejorar validación y manejo de errores en nuevos endpoints

**Descripción**:
Asegurar que los nuevos endpoints tengan validación robusta de entrada y manejo de errores consistente con el resto de la API. Esto incluye validar tipos, rangos, y proporcionar mensajes de error claros y útiles.

**Alcance**:

-   ✅ Validar que `positionId` en GET es número positivo
-   ✅ Validar que `candidateId` en PUT es número positivo
-   ✅ Validar que `positionId` y `currentInterviewStep` en body son números positivos
-   ✅ Asegurar mensajes de error consistentes con otros endpoints
-   ✅ Manejar errores de Prisma apropiadamente (P2025 para "record not found")
-   ❌ NO incluye creación de validadores reutilizables (mejora futura)

**Dependencias**:

-   **Ticket 2** y **Ticket 4** (para añadir validaciones)

**Criterios de aceptación técnicos**:

-   Validación de `positionId`: debe ser número entero positivo (> 0)
-   Validación de `candidateId`: debe ser número entero positivo (> 0)
-   Validación de `currentInterviewStep`: debe ser número entero positivo (> 0)
-   Mensajes de error siguen formato:
    ```json
    {
        "error": "Mensaje descriptivo"
    }
    ```
-   Errores de Prisma se manejan apropiadamente:
    -   `P2025`: "Record not found" → 404
    -   Otros errores Prisma → 500 con mensaje genérico
-   Los errores de validación retornan 400 con mensaje específico

**Requisitos funcionales**:

-   Prevenir errores por datos inválidos
-   Proporcionar feedback claro al usuario

**Requisitos no funcionales**:

-   **Seguridad**: Validar entrada para prevenir inyección
-   **UX**: Mensajes de error claros y accionables
-   **Consistencia**: Mismo formato de errores que otros endpoints

**Tests Unitarios TDD** (Definition of Done - OBLIGATORIO):

**Archivos de test**:

-   `backend/src/tests/unit/positionController.test.ts` (añadir tests de validación)
-   `backend/src/tests/unit/candidateController.test.ts` (añadir tests de validación)

**Estrategia TDD**:

1. Escribir tests para cada validación
2. Implementar validaciones
3. Refactorizar código común

**Casos de prueba adicionales a implementar**:

**Para GET /positions/:id/candidates**:

1. **should validate positionId is positive integer**
    - Request: `params.id = "-1"` → Assert: 400
    - Request: `params.id = "0"` → Assert: 400
    - Request: `params.id = "1.5"` → Assert: 400
    - Request: `params.id = "1"` → Assert: No error de validación

**Para PUT /candidates/:id/stage**:

2. **should validate candidateId is positive integer**

    - Request: `params.id = "-1"` → Assert: 400
    - Request: `params.id = "0"` → Assert: 400

3. **should validate positionId in body is positive integer**

    - Request: Body `{ positionId: -1, currentInterviewStep: 2 }` → Assert: 400
    - Request: Body `{ positionId: 0, currentInterviewStep: 2 }` → Assert: 400
    - Request: Body `{ positionId: 1.5, currentInterviewStep: 2 }` → Assert: 400

4. **should validate currentInterviewStep in body is positive integer**

    - Request: Body `{ positionId: 1, currentInterviewStep: -1 }` → Assert: 400
    - Request: Body `{ positionId: 1, currentInterviewStep: 0 }` → Assert: 400
    - Request: Body `{ positionId: 1, currentInterviewStep: 1.5 }` → Assert: 400

5. **should handle Prisma error P2025 as 404**

    - Mock: Servicio lanza Prisma error con código `P2025`
    - Assert: Status 404
    - Assert: Mensaje apropiado

6. **should handle other Prisma errors as 500**

    - Mock: Servicio lanza Prisma error con otro código
    - Assert: Status 500
    - Assert: Mensaje genérico

7. **should have consistent error message format**
    - Assert: Todos los errores retornan `{ error: string }`
    - Assert: Mensajes son descriptivos y accionables

**Cobertura objetivo**:

-   Líneas: ≥ 90% (validaciones críticas)
-   Branches: ≥ 90%
-   Funciones: 100%

**Entregables**:

-   Validaciones añadidas en controladores
-   Tests añadidos a archivos de test existentes con todos los casos
-   Manejo de errores mejorado
-   Tests pasando (`npm test`)
-   Código documentado

**Estimación**: 3 puntos (medio) - Aumenta por incluir tests TDD completos

---

## Validación final del desglose

### Justificación del número de tickets

Se han creado **6 tickets** que cubren:

1. **Servicios (Tickets 1 y 3)**: Lógica de negocio separada en capa de aplicación
2. **Controladores y rutas (Tickets 2 y 4)**: Capa de presentación HTTP
3. **Documentación (Ticket 5)**: Especificación API
4. **Calidad (Ticket 6)**: Validación y manejo de errores

**Razón de la división**:

-   Separación de responsabilidades (servicios vs controladores)
-   Permite desarrollo en paralelo (Tickets 1 y 3 pueden hacerse simultáneamente)
-   Tickets pequeños y enfocados (cada uno entregable independiente)
-   Facilita code review y testing

### Coherencia técnica

-   ✅ **Arquitectura**: Respeta Clean Architecture (servicios en `application/`, controladores en `presentation/`)
-   ✅ **Patrones**: Sigue patrones existentes (Service Layer, Controller Pattern)
-   ✅ **Convenciones**: Naming y estructura consistentes con código actual
-   ✅ **Dependencias**: Orden lógico (servicios antes de controladores)
-   ✅ **TypeScript**: Uso de tipos específicos, evitar `any`

### Riesgos y mitigaciones

**Riesgo 1**: El endpoint PUT `/candidates/:id/stage` necesita identificar qué aplicación actualizar (un candidato puede tener múltiples aplicaciones).

**Mitigación**: Se requiere `positionId` en el body para identificar la aplicación específica. Alternativa: usar `PUT /positions/:positionId/candidates/:candidateId/stage` (más RESTful pero diferente a lo especificado).

**Riesgo 2**: Validación de que `currentInterviewStep` pertenece al flujo de la posición puede ser compleja.

**Mitigación**: Ticket 3 incluye validación explícita consultando `interviewFlowId` de la posición y verificando que el step pertenece a ese flujo.

**Riesgo 3**: Cálculo de puntuación media puede ser lento con muchas entrevistas.

**Mitigación**: Usar agregación de Prisma (`_avg`) si es posible, o calcular en memoria para datasets pequeños. Si hay problemas de rendimiento, optimizar en iteración futura.

**Riesgo 4**: Falta de tests automatizados puede llevar a bugs.

**Mitigación**: Incluir pruebas manuales exhaustivas. Considerar añadir tests automatizados como ticket separado (fuera de scope de US-CU1).

### Orden sugerido para ejecución

**Fase 1 - Servicios (Paralelo)**:

1. Ticket 1: Servicio GET candidatos
2. Ticket 3: Servicio PUT actualizar etapa

**Fase 2 - Endpoints HTTP (Secuencial)**: 3. Ticket 2: Endpoint GET (depende de Ticket 1) 4. Ticket 4: Endpoint PUT (depende de Ticket 3)

**Fase 3 - Calidad y documentación (Paralelo)**: 5. Ticket 6: Validación y errores (depende de Tickets 2 y 4) 6. Ticket 5: Documentación API (depende de Tickets 2 y 4)

**Tiempo estimado total**: 27 puntos (aproximadamente 4-5 días de desarrollo con TDD completo)

**Nota sobre estimación**: La estimación aumenta significativamente porque ahora incluye:

-   Desarrollo de tests unitarios completos siguiendo TDD
-   Refactorización después de implementación
-   Asegurar cobertura de código adecuada
-   Validación de Definition of Done con tests pasando

---

## Notas adicionales

### Consideraciones de diseño

1. **Endpoint PUT `/candidates/:id/stage`**:

    - Requiere `positionId` en body para identificar aplicación específica
    - Alternativa más RESTful: `PUT /positions/:positionId/candidates/:candidateId/stage` (no implementada por seguir especificación)

2. **Puntuación media**:

    - Se calcula solo con entrevistas que tienen `score !== null`
    - Si no hay entrevistas con score, retorna `null`
    - Cálculo: `sum(scores) / count(scores)`

3. **Validación de etapa**:
    - Debe pertenecer al mismo `interviewFlowId` que la posición
    - Validación en servicio (Ticket 3)

### Mejoras futuras (fuera de scope)

-   **Tests de integración**: Tests E2E con supertest y BD de test (recomendado pero no obligatorio para DoD)
-   **Tests E2E**: Tests completos frontend-backend (fuera de scope)
-   Paginación para GET si hay muchos candidatos
-   Filtros adicionales (por etapa, por puntuación)
-   Cache de puntuaciones si hay problemas de rendimiento
-   Frontend Kanban (no incluido en US-CU1, solo backend)

### Definition of Done (DoD) - Actualizado con TDD

Un ticket se considera **completado** cuando:

1. ✅ Código implementado según especificación
2. ✅ **Tests unitarios escritos y pasando (TDD)**
3. ✅ **Cobertura de código ≥ 85% (líneas y branches)**
4. ✅ **Todos los casos de prueba implementados**
5. ✅ Código documentado (JSDoc)
6. ✅ Tipos TypeScript definidos (sin `any`)
7. ✅ Sin errores de linting
8. ✅ Code review aprobado (si aplica)
9. ✅ Integrado en rama principal sin conflictos

**⚠️ IMPORTANTE**: Sin tests unitarios pasando, el ticket NO está completo según DoD.

---

## Estrategia TDD - Guía de Implementación

### Flujo de trabajo TDD recomendado

Para cada ticket que requiera tests unitarios, seguir este flujo:

1. **RED - Escribir test que falle**

    ```typescript
    // 1. Escribir test primero
    it("should return candidates with full name", async () => {
        // Arrange: Setup mocks y datos
        // Act: Llamar función
        // Assert: Verificar resultado
    });
    ```

    - Ejecutar: `npm test` → Test debe fallar (rojo)
    - Verificar que el test falla por la razón correcta

2. **GREEN - Implementar funcionalidad mínima**

    ```typescript
    // 2. Implementar código mínimo para que pase
    export const getCandidatesByPosition = async (positionId: number) => {
        // Código mínimo necesario
    };
    ```

    - Ejecutar: `npm test` → Test debe pasar (verde)
    - No optimizar todavía

3. **REFACTOR - Mejorar código**
    ```typescript
    // 3. Refactorizar manteniendo tests verdes
    // - Extraer funciones
    // - Mejorar nombres
    // - Eliminar duplicación
    ```
    - Ejecutar: `npm test` → Tests siguen pasando
    - Aplicar principios SOLID, DRY

### Estructura de archivos de test

```
backend/src/tests/
├── unit/
│   ├── applicationService.test.ts    # Tests para servicios
│   ├── positionController.test.ts    # Tests para controladores
│   ├── candidateController.test.ts   # Tests para controladores
│   └── apiSpec.test.ts               # Tests para validación de API spec
└── helpers/
    ├── testHelpers.ts                # Helpers para tests
    └── mocks.ts                       # Mocks reutilizables
```

### Convenciones de testing

**Naming**:

-   Archivos: `*.test.ts`
-   Describe blocks: `describe('NombreDelMódulo', () => { ... })`
-   It blocks: `it('should [comportamiento esperado]', () => { ... })`

**Estructura AAA** (Arrange-Act-Assert):

```typescript
it('should calculate average score correctly', async () => {
  // Arrange: Preparar datos y mocks
  const mockData = { ... };
  jest.spyOn(...).mockResolvedValue(mockData);

  // Act: Ejecutar función bajo test
  const result = await getCandidatesByPosition(1);

  // Assert: Verificar resultado
  expect(result).toEqual(expectedResult);
});
```

**Mocks de Prisma**:

```typescript
// Ejemplo de mock de Prisma Client
const mockPrisma = {
    application: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
    },
    position: {
        findUnique: jest.fn(),
    },
    interviewStep: {
        findUnique: jest.fn(),
    },
};

jest.mock("@prisma/client", () => ({
    PrismaClient: jest.fn(() => mockPrisma),
}));
```

### Configuración de Jest para cobertura

Añadir a `backend/jest.config.js`:

```javascript
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageThreshold: {
        global: {
            branches: 85,
            functions: 100,
            lines: 85,
            statements: 85,
        },
    },
    testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
};
```

### Comandos útiles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con cobertura
npm test -- --coverage

# Ejecutar tests de un archivo específico
npm test -- applicationService.test.ts

# Ejecutar tests en modo verbose
npm test -- --verbose
```

### Dependencias necesarias

Verificar que están instaladas (ya están en `package.json`):

-   `jest`: ^29.7.0
-   `ts-jest`: ^29.1.2
-   `@types/jest`: ^29.5.12

**Opcional pero recomendado**:

-   `@faker-js/faker`: Para generar datos de test aleatorios
-   `supertest`: Para tests de integración de endpoints

### Troubleshooting común

**Problema**: Tests fallan porque Prisma Client no se puede mockear
**Solución**: Usar `jest.mock('@prisma/client')` antes de importar el módulo

**Problema**: Tests son lentos
**Solución**: Asegurar que se usan mocks, no conexiones reales a BD

**Problema**: Cobertura no alcanza el umbral
**Solución**: Revisar qué líneas/branches no están cubiertas y añadir tests

### Checklist antes de marcar ticket como completo

-   [ ] Todos los tests unitarios escritos según casos de prueba del ticket
-   [ ] Todos los tests pasan (`npm test`)
-   [ ] Cobertura ≥ 85% (líneas y branches)
-   [ ] Tests siguen convenciones (AAA, naming)
-   [ ] Mocks están bien configurados
-   [ ] No hay tests duplicados o redundantes
-   [ ] Código refactorizado después de implementación
-   [ ] Sin `console.log` de debug en código de producción
-   [ ] Documentación JSDoc actualizada
