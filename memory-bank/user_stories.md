# User Stories

## US-CU1: Visualización y gestión de candidatos en proceso mediante interfaz Kanban

**User Story**:

Como reclutador, quiero visualizar todos los candidatos que están en proceso para una posición específica en una interfaz tipo Kanban, y poder moverlos entre diferentes etapas del proceso de selección, para gestionar de forma visual y eficiente el flujo de candidatos y tomar decisiones más rápidas sobre el avance de cada candidato en el proceso.

**Descripción**:

Actualmente, los reclutadores no tienen una forma visual de ver el estado de todos los candidatos que están en proceso para una posición. Necesitan poder:

1. Ver una lista de todos los candidatos que han aplicado a una posición específica, organizados por su etapa actual en el proceso de selección.
2. Visualizar información clave de cada candidato: nombre completo, etapa actual del proceso y puntuación media obtenida en las entrevistas realizadas.
3. Mover candidatos entre diferentes etapas del proceso de selección cuando avancen o retrocedan en el flujo.

Esta funcionalidad permitirá a los reclutadores tener una visión clara del estado de todas las aplicaciones para una posición, identificar rápidamente qué candidatos están en cada fase, y gestionar el progreso de cada uno de forma intuitiva mediante una interfaz tipo Kanban.

**Criterios de aceptación**:

-   **Dado** que un reclutador accede a una posición específica, **cuando** solicita ver los candidatos en proceso, **entonces** debe recibir una lista con todos los candidatos que tienen una aplicación activa para esa posición, mostrando:
    -   Nombre completo del candidato (firstName + lastName)
    -   Etapa actual del proceso (currentInterviewStep) con el nombre de la etapa
    -   Puntuación media del candidato calculada como el promedio de todos los scores de las entrevistas (Interview) asociadas a su aplicación, o null si no tiene entrevistas con score
-   **Dado** que un reclutador visualiza un candidato en el Kanban, **cuando** mueve el candidato a una nueva etapa del proceso, **entonces** el sistema debe actualizar el campo `currentInterviewStep` de la aplicación correspondiente al nuevo paso seleccionado.

-   **Dado** que un reclutador intenta mover un candidato a una etapa inválida (que no pertenece al flujo de entrevistas de la posición), **cuando** realiza la actualización, **entonces** el sistema debe rechazar la operación con un error claro indicando que la etapa no es válida para esa posición.

-   **Dado** que un reclutador solicita los candidatos de una posición que no existe, **cuando** realiza la petición, **entonces** el sistema debe retornar un error 404 indicando que la posición no fue encontrada.

-   **Dado** que un reclutador intenta actualizar la etapa de un candidato que no tiene una aplicación para esa posición, **cuando** realiza la actualización, **entonces** el sistema debe retornar un error 404 indicando que no se encontró la aplicación correspondiente.

**Notas**:

-   La puntuación media debe calcularse solo con entrevistas que tengan un score definido (no null).
-   Si un candidato no tiene entrevistas con score, la puntuación media debe ser null.
-   El endpoint de actualización de etapa debe validar que el nuevo `currentInterviewStep` pertenezca al mismo `interviewFlowId` que la posición.
-   Los endpoints deben seguir las convenciones REST y retornar códigos HTTP apropiados (200, 201, 400, 404, 500).
-   La respuesta debe ser en formato JSON consistente con el resto de la API.

**Tareas técnicas**:

-   Implementar endpoint GET `/positions/:id/candidates` que:
    -   Obtenga todas las aplicaciones (Application) para la posición especificada
    -   Incluya información del candidato (nombre completo)
    -   Incluya información de la etapa actual (InterviewStep con nombre)
    -   Calcule la puntuación media de las entrevistas asociadas
    -   Retorne la información estructurada en formato JSON
-   Implementar endpoint PUT `/candidates/:id/stage` que:

    -   Reciba el ID del candidato y el nuevo `currentInterviewStep` en el body
    -   Valide que existe una aplicación para ese candidato (se requiere identificar la posición o aplicación específica)
    -   Valide que el nuevo paso pertenece al flujo de entrevistas de la posición
    -   Actualice el campo `currentInterviewStep` en la aplicación correspondiente
    -   Retorne la aplicación actualizada

-   Añadir validación de datos de entrada (IDs válidos, formato correcto)
-   Implementar manejo de errores apropiado (404, 400, 500)
-   Documentar los endpoints en `backend/api-spec.yaml`
-   Seguir la arquitectura existente: servicios en `application/services/`, controladores en `presentation/controllers/`, rutas en `routes/`

**Estado**: ✅ **COMPLETADA**

**Fecha de implementación**: 2026-01-07

**Endpoints implementados**:

-   ✅ GET `/positions/:id/candidates` - Implementado con tests TDD (10 tests)
-   ✅ PUT `/candidates/:id/stage` - Implementado con tests TDD (14 tests)

**Tests implementados**: 54 tests unitarios pasando

**Documentación**: `backend/api-spec.yaml` actualizado con ambos endpoints

**Ver tickets técnicos**: `memory-bank/Tickets_US-CU1.md`
