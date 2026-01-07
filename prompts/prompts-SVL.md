# Prompt SVL — 2026-01-07

## Prompt 1
**Prompt del usuario:**
```
# CONTEXTO GENERAL
Tenemos que crear dos nuevos endpoints que nos permitirán manipular la lista de candidatos de una aplicación en una interfaz tipo kanban.
## GET /positions/:id/candidates
Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:
- Nombre completo del candidato (de la tabla candidate).
- current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
- La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score
## PUT /candidates/:id/stage
Este endpoint actualizará la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico.

# Primero -> vamos a desarrollar la User Storie que define los cambios que vamos a hacer:  Utiliza tu experiencia como experto Product Owner y la especificació definida en @documentation/user_stories_specs.md  para descríbela en el formato utilizado en los ejemplos de dicho documento. Guarda la User Stories en un documento llamado "user_stories.md", en formato markdown, implementando un sistema de numeración donde ésta primera User Storie se la US-CU1, y guárdalo en la carpeta que consideres necesaria de la memory-bank (puedes crear una carpeta nueva si así lo consideras necesario)

# Segundo -> vamos a generar los Tickets necesarios para desarrollar esta User Storie y crear los 2 nuevos endpoints solicitados: Actúa como un Tech Lead + Product Owner senior en un equipo ágil para transformar la User Storie en Tickets:
1. Localiza y analiza la User Story definida en "user_stories.md".
2. Genera un desglose de tickets siguiendo estos principios:
- Cada ticket debe representar trabajo realista, estimable y alineado con prácticas de ingeniería modernas.
- Cada ticket debe ser independiente, evitar ambigüedades y tener un resultado verificable.
- La división debe reflejar el enfoque de planificación real: backend, frontend, integración, UX, QA, datos, arquitectura, pruebas, documentación o tareas de soporte.
- Incluir solo trabajo necesario para entregar la US completa (Definition of Done).
3. Para cada ticket, incluye obligatoriamente:
- Título conciso y técnico.
- Descripción clara explicando qué se debe hacer y por qué.
- Alcance: qué entra y qué NO entra.
- Dependencias (si las hay).
- Criterios de aceptación técnicos y testables.
- Requisitos funcionales relevantes derivados de la US.
- Requisitos no funcionales: rendimiento, seguridad, DX, estándares, accesibilidad, etc.
- Pruebas necesarias: unitarias, integración, end-to-end, performance, etc.
- Entregables del ticket.
- Estimación relativa en formato ágil (story points o nivel de complejidad).
4. Valida la coherencia del conjunto:
- Verifica que los tickets cubren toda la User Story sin solaparse.
- Verifica que la suma de tickets representa un entregable funcional final.
- Asegúrate de que el orden sugerido tiene sentido para ejecución (dependencias lógicas).
5. Devuelve los resultados en el siguiente formato:
User Story US-CU1 (resumen)
(Síntesis breve de la US original para dejar claro el objetivo).
Backlog Técnico Desglosado
Ticket 1: Título
- Descripción
- Alcance
- Dependencias
- Criterios de aceptación técnicos
- Requisitos funcionales
- Requisitos no funcionales
- Pruebas necesarias
- Entregables
- Estimación
Ticket 2: …
(Repite hasta cubrir toda la US)

Utiliza la información disponible en el Memory-Bank para completar las consideraciones de requistos técnicos que necesites.

Validación final del desglose
- Justificación del número de tickets
- Coherencia técnica
- Riesgos y mitigaciones
- Órdenes sugeridos para ejecución

Tu salida debe ser completa, exhaustiva y apta para copiar directamente a Jira, Linear o Azure DevOps.

Guárdala en un archivo con formato markdown llamado "Tickets_US-CU1.md"

# Tercero -> Desarrollaremos los Tickets uno a uno
```

**Resultado:**
La IA creó la User Story US-CU1 siguiendo el formato especificado y la guardó en `memory-bank/user_stories.md`. La US describe la funcionalidad de visualización y gestión de candidatos en proceso mediante interfaz Kanban. Luego generó un desglose técnico completo en `memory-bank/Tickets_US-CU1.md` con 6 tickets detallados que cubren toda la implementación: servicios backend, controladores, rutas, validaciones, manejo de errores y documentación API. Cada ticket incluye todos los elementos solicitados (descripción, alcance, dependencias, criterios de aceptación, requisitos funcionales y no funcionales, pruebas, entregables y estimación).

## Prompt 2
**Prompt del usuario:**
```
Como IA experta en desarrollo TDD, añade al plan los tests unitarios necesarios en cada ticket para que se puedan completar asegurando el Definition of Done.
```

**Resultado:**
La IA actualizó el archivo `memory-bank/Tickets_US-CU1.md` añadiendo secciones detalladas de "Tests Necesarios" a cada uno de los 6 tickets. Cada sección incluye casos de prueba específicos, estrategias de mocking (especialmente para Prisma Client), setup de tests, y objetivos de cobertura (≥85% líneas y branches). Los tests cubren casos exitosos, validaciones, manejo de errores, y casos edge como puntuaciones nulas, arrays vacíos, y errores de Prisma.

## Prompt 3
**Prompt del usuario:**
```
Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.
```

**Resultado:**
La IA implementó completamente todos los tickets del plan siguiendo metodología TDD. Implementó los servicios `getCandidatesByPosition` y `updateCandidateStage` en `applicationService.ts`, creó los controladores `positionController.ts` y actualizó `candidateController.ts`, añadió las rutas correspondientes, implementó validaciones robustas y manejo de errores mejorado (incluyendo manejo específico de errores Prisma P2025). Creó 54 tests unitarios completos (18 para servicios, 10 para positionController, 14 para candidateController, 8 para validación de API spec) que pasan exitosamente. Actualizó la documentación OpenAPI en `api-spec.yaml`. Todos los tests siguen TDD y cubren casos exitosos, validaciones, errores y casos edge.

## Prompt 4
**Prompt del usuario:**
```
Actualiza el Memmory Bank con todo lo desarrollado durante este Chat
```

**Resultado:**
La IA actualizó exhaustivamente el Memory Bank con toda la información desarrollada. Actualizó `progress.md` añadiendo los nuevos endpoints, tests implementados y una sección de cambios recientes. Actualizó `interfaces/api.md` documentando completamente los dos nuevos endpoints con ejemplos. Actualizó `activeContext.md` reflejando las nuevas funcionalidades implementadas. Actualizó `domains/key-flows.md` añadiendo los flujos 3 y 4 (visualizar candidatos y actualizar etapa). Actualizó `techContext.md` con las nuevas dependencias de testing. Actualizó `quality/testing.md` reflejando el estado actual de tests (54 tests pasando). Actualizó `systemPatterns.md` añadiendo referencia a estructura de tests. Y marcó `user_stories.md` como completada con fecha de implementación.

## Prompt 5
**Prompt del usuario:**
```
haz un commit con todos los cambios realizados
```

**Resultado:**
La IA ejecutó `git add .` para añadir todos los archivos modificados y nuevos al staging area, y luego creó un commit con el mensaje "feat(api): implement US-CU1 Kanban endpoints with TDD" siguiendo las convenciones del proyecto. El commit incluyó 22 archivos modificados (3,495 líneas añadidas, 45 eliminadas) y 9 archivos nuevos creados, incluyendo toda la implementación de endpoints, tests, documentación y actualizaciones del Memory Bank.

## Prompt 6
**Prompt del usuario:**
```
Estás operando dentro de un chat que ya contiene el historial completo de una conversación entre el usuario y una IA.

Tu tarea es generar un nuevo archivo Markdown llamado:

prompts-SVL.md

Este archivo debe contener un banco de memoria completo y ordenado de todos los prompts escritos por el USUARIO en este chat.

Debes cumplir estrictamente las siguientes reglas:

1. Debes extraer ÚNICAMENTE los mensajes escritos por el usuario.
   - No incluyas respuestas de la IA.
   - No resumas ni reformules los prompts del usuario.
   - Reproduce cada prompt EXACTAMENTE como aparece en el chat (verbatim, incluyendo formato, saltos de línea y bloques de código).

2. Enumera los prompts en orden cronológico, empezando por el primer mensaje del usuario en el chat.

3. Para cada prompt debes incluir:
   - El prompt exacto del usuario (verbatim).
   - Un resumen conciso pero técnicamente correcto de lo que produjo la IA en respuesta a ese prompt.

4. La estructura del archivo debe ser:

Prompts SVL — <FECHA>

## Prompt 1
**Prompt del usuario:**
<prompt literal>

**Resultado:**
<resumen de la respuesta de la IA>

## Prompt 2
...

5. La fecha <FECHA> debe ser la fecha real del día en que se ejecuta este prompt, que debes obtener automáticamente a partir del contexto del sistema o del entorno. No debe ser solicitada al usuario ni inferida manualmente.

6. Al final del archivo, añade una sección final:

# RESUMEN GENERAL

En esta sección debes sintetizar a alto nivel:
- En qué ha estado trabajando el usuario a lo largo de todo el chat.
- Los temas principales, objetivos y resultados generados.

7. Si en cualquier momento no tienes acceso al historial completo del chat, debes detenerte y devolver un error explicando que el contexto de la conversación es incompleto.

8. Cuando termines, escribe todo el contenido en el archivo:
prompts-SVL.md
y asegúrate de que se crea en una nueva carpeta llamada prompts/ dentro de la raíz del proyecto.
```

**Resultado:**
La IA está generando este archivo `prompts-SVL.md` extrayendo todos los prompts del usuario del historial del chat, reproduciéndolos exactamente (verbatim) y añadiendo resúmenes técnicos de las respuestas de la IA para cada uno.

---

# RESUMEN GENERAL

## Trabajo realizado

El usuario ha trabajado en la implementación completa de una funcionalidad de gestión de candidatos en proceso mediante interfaz tipo Kanban (User Story US-CU1). El trabajo se desarrolló siguiendo metodología ágil con desglose en tickets técnicos y enfoque TDD (Test-Driven Development).

## Temas principales

1. **Definición de User Story**: Creación de US-CU1 siguiendo especificaciones de Product Owner, documentando funcionalidad de visualización y gestión de candidatos en proceso.

2. **Planificación técnica**: Transformación de la User Story en 6 tickets técnicos detallados, cada uno con alcance, dependencias, criterios de aceptación, requisitos funcionales/no funcionales, pruebas y estimaciones.

3. **Enfoque TDD**: Integración de tests unitarios en el plan de desarrollo, especificando casos de prueba, estrategias de mocking y objetivos de cobertura para cada ticket.

4. **Implementación completa**: Desarrollo de dos endpoints REST:
   - `GET /positions/:id/candidates`: Obtiene candidatos en proceso con nombre completo, etapa actual y puntuación media
   - `PUT /candidates/:id/stage`: Actualiza la etapa del proceso de un candidato

5. **Testing exhaustivo**: Implementación de 54 tests unitarios siguiendo TDD, cubriendo servicios, controladores y validación de especificación API.

6. **Documentación**: Actualización completa del Memory Bank y documentación OpenAPI con los nuevos endpoints.

## Objetivos alcanzados

- ✅ User Story US-CU1 completamente implementada
- ✅ 2 endpoints REST funcionales con validaciones robustas
- ✅ 54 tests unitarios pasando (100% de cobertura del plan)
- ✅ Documentación técnica completa (API spec, Memory Bank)
- ✅ Manejo de errores mejorado (especialmente errores Prisma)
- ✅ Código siguiendo arquitectura limpia y convenciones del proyecto

## Resultados generados

**Archivos nuevos creados**:
- `backend/src/application/services/applicationService.ts`
- `backend/src/presentation/controllers/positionController.ts`
- `backend/src/routes/positionRoutes.ts`
- `backend/src/tests/unit/applicationService.test.ts`
- `backend/src/tests/unit/positionController.test.ts`
- `backend/src/tests/unit/candidateController.test.ts`
- `backend/src/tests/unit/apiSpec.test.ts`
- `memory-bank/user_stories.md`
- `memory-bank/Tickets_US-CU1.md`

**Archivos modificados**:
- `backend/src/presentation/controllers/candidateController.ts`
- `backend/src/routes/candidateRoutes.ts`
- `backend/src/index.ts`
- `backend/api-spec.yaml`
- Múltiples archivos del Memory Bank actualizados

**Métricas**:
- 3,495 líneas de código añadidas
- 54 tests unitarios implementados
- 6 tickets técnicos completados
- 1 User Story completada

El trabajo se completó exitosamente siguiendo metodología TDD, con todos los tests pasando y documentación completa actualizada.

