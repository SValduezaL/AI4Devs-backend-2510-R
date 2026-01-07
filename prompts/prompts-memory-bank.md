# Prompts Memory Bank - 2026-01-07

## Prompt 1

**Prompt del usuario:**
```
Contexto / Rol
Eres Cursor (AI agent) actuando como arquitecto de software + tech writer. Tu memoria "entre sesiones" no es fiable, así que debes crear documentación persistente y estructurada para que cualquier IA (y humano) retome el proyecto sin contexto previo.

Objetivo
Crear un Memory Bank dentro de este repositorio, con:

Estructura estándar (core files requeridos)

Contenido real extraído del código (no inventes)

Reglas del proyecto para obligarte a leer y mantener el Memory Bank en cada tarea

Ejemplos concretos: diagramas, inventario de módulos, flujos, endpoints, decisiones técnicas, etc.

0) Reglas críticas (obligatorias)

No inventes. Si algo no se puede inferir del repo, marca como UNKNOWN y crea una lista "Preguntas al humano".

Antes de escribir, escanea el repo:

Lenguajes, frameworks, estructura de carpetas

Entrypoints (apps), módulos, paquetes (monorepo?), servicios, infra

Config (env, docker, CI), scripts, herramientas

Tests (si existen), linters, conventions

Escribe en Markdown claro y operativo.

Prioriza lo que un agente necesita para trabajar: qué es, cómo corre, dónde tocar, riesgos, patrones, estado actual.

1) Output esperado: árbol de ficheros

Crea esta estructura (si ya existe, actualízala):

/memory-bank/
  projectbrief.md
  productContext.md
  systemPatterns.md
  techContext.md
  activeContext.md
  progress.md

  /architecture/
    overview.md
    diagrams.md

  /decisions/
    ADR-0001-template.md
    ADR-0002-<slug>.md   (solo si detectas decisiones claras)

  /domains/
    domain-model.md
    key-flows.md

  /interfaces/
    api.md              (si hay API)
    events-jobs.md      (si hay colas, cron, workers)

  /ops/
    local-dev.md
    deployment.md
    observability.md

  /quality/
    testing.md
    linting-format.md


Además:

Crea reglas en formato moderno si el repo lo soporta:

.cursor/rules/memory-bank.mdc

.cursor/rules/engineering-standards.mdc

Si el proyecto usa legado o el equipo lo pide, crea también .cursorrules (opcional), pero prioriza .cursor/rules.
Cursor - Community Forum
+1

2) Contenido mínimo requerido (core files)
memory-bank/projectbrief.md

Debe responder, con bullets y secciones:

Qué es el producto (1–3 líneas)

Objetivo de negocio / problema que resuelve

Alcance dentro del repo (qué incluye/excluye)

Stakeholders / tipos de usuarios (si se deduce)

Requisitos no funcionales detectados (seguridad, rendimiento, compliance) si aparecen en código/docs

"Definition of Done" para cambios típicos en este repo

memory-bank/productContext.md

"Why": por qué existe

"What": cómo debería funcionar a alto nivel

UX/Flujos principales (si aplica)

Casos borde / riesgos de producto

memory-bank/systemPatterns.md

Arquitectura (monolito, microservicios, monorepo, etc.)

Patrones repetidos en el código (ej. repository pattern, DI, CQRS, event-driven)

Convenciones de carpetas y naming

Relaciones entre componentes (quién llama a quién)

Incluye diagrama Mermaid realista (aunque sea aproximado) y explica limitaciones

memory-bank/techContext.md

Stack (lenguajes, runtime, frameworks)

Dependencias clave (y para qué)

Setup local exacto (comandos reales del repo)

Config/env: lista de .env keys detectadas (sin secretos)

Restricciones: versiones, compatibilidades, limitaciones de entorno

memory-bank/activeContext.md

"En qué estamos ahora": si no hay historial, escribe:

Estado inicial: "Memory bank creado el <fecha>"

Hipótesis de foco: "pendiente de que el humano confirme"

"Next steps" sugeridos: backlog inicial de 5–15 ítems (derivados del repo), marcando incertidumbre

memory-bank/progress.md

Qué funciona hoy (a partir de tests, scripts, docs, build)

Qué falta / TODOs detectados en código (grep TODO/FIXME si es posible)

Known issues: errores comunes, deuda técnica

Lista de "Quick wins" (3–10)

3) Archivos adicionales (si aplican)

/interfaces/api.md: documenta endpoints y contratos si hay OpenAPI/Swagger o routes.

/ops/deployment.md: CI/CD, Docker, cloud, pipelines (solo si está en repo).

/quality/testing.md: cómo correr tests, pirámide, convenciones, mocks.

4) Reglas Cursor (obligación de leer y mantener el Memory Bank)
Crea .cursor/rules/memory-bank.mdc con este contenido base (ajústalo a tu repo):
---
description: "Memory Bank mandatory workflow"
globs: ["**/*"]
alwaysApply: true
---

# Mandatory Memory Bank Workflow

You MUST start every task by reading:
- memory-bank/projectbrief.md
- memory-bank/productContext.md
- memory-bank/systemPatterns.md
- memory-bank/techContext.md
- memory-bank/activeContext.md
- memory-bank/progress.md

## When to update
Update the Memory Bank:
- after implementing meaningful changes
- when you discover new architecture/patterns
- when assumptions are corrected
- when user requests "update memory bank"

## Output discipline
- Do not guess. Mark UNKNOWN and ask questions.
- Keep activeContext.md and progress.md current.

Crea .cursor/rules/engineering-standards.mdc

Incluye:

convenciones del repo (lint, formatting, commit style si existe)

"don't touch" zones (si hay)

test-first o no (según repo)

cómo proponer cambios: plan → diff → tests → doc update

5) Procedimiento de generación (paso a paso)

Ejecuta este plan internamente (sin pedírmelo):

Inventory

lista de carpetas top-level

detecta "apps/packages/services"

detecta gestores: npm/pnpm/yarn, poetry, pip, gradle, etc.

Runtime & Entrypoints

cómo se arranca local

cómo se construye

Architecture

diagrama mermaid (C4-ish light)

dependencias entre módulos

Interfaces

API/routes, colas, eventos, cron

Ops

docker/compose/k8s/terraform si existe

Quality

tests, linters, coverage (si existe)

Write files

rellena todos los core files

Create rules

.cursor/rules/*.mdc

Final check

valida enlaces internos

asegura que no hay secretos

6) Formato de redacción exigido

Todo en Markdown con encabezados consistentes.

Cada sección importante debe incluir:

Where to change (rutas/archivos)

How to verify (comandos)

Risks

Incluye ejemplos de comandos como bloques:

# ejemplo
pnpm install
pnpm test
pnpm dev

7) Entrega

Al terminar:

Imprime un resumen con:

archivos creados/modificados

10 hallazgos más relevantes del repo

5 preguntas "UNKNOWN" para que el humano confirme

No abras PRs: solo cambios locales en el workspace.
```

**Resultado:**
Se creó un Memory Bank completo con 19 archivos de documentación estructurada:
- 6 archivos core (projectbrief, productContext, systemPatterns, techContext, activeContext, progress)
- 2 archivos de arquitectura (overview, diagrams con diagramas Mermaid)
- 2 archivos de dominios (domain-model, key-flows)
- 2 archivos de interfaces (api, events-jobs)
- 3 archivos de operaciones (local-dev, deployment, observability)
- 2 archivos de calidad (testing, linting-format)
- 2 reglas de Cursor (.cursor/rules/memory-bank.mdc, engineering-standards.mdc)

Se documentó la arquitectura Clean Architecture, patrones detectados, stack tecnológico (Express, TypeScript, Prisma, React), endpoints API, flujos principales, y se identificaron 10 hallazgos relevantes y 5 preguntas UNKNOWN.

---

## Prompt 2

**Prompt del usuario:**
```
He detectado inconsistencia en las fechas. Hoy estamos a 6 de enero de 2026. Corrige todas las fecha de implementación que hayas puesto en los archivos recientemente creados.
```

**Resultado:**
Se corrigió la fecha de creación del Memory Bank en `memory-bank/activeContext.md` de "2024-12-19" a "2026-01-06". Se verificó que no había otras fechas de implementación incorrectas (las fechas en ejemplos de datos de la API son correctas como datos de prueba).

---

## Prompt 3

**Prompt del usuario:**
```
El archivo .env está situado en el directorio principal, el cual contiene DB_NAME, DB_PORT, DB_USER, DB_PASSWORD y DATABASE_URL, pero tu haces referencia a que se necesita uno en el backend con la DATABASE_URL. Corrige el problema teniendo en cuanta posibles issues como los siguientes: Bug 1: The `dotenv.config()` call uses `path.resolve(__dirname, '../../.env')` to load the root `.env` file. However, when running in development mode with `ts-node-dev`, `__dirname` refers to the source directory (`backend/src`), making the path resolve to `backend/.env` instead of the project root's `.env`. This works correctly only after compilation when `__dirname` is `backend/dist`, but breaks during development. The correct path should resolve to one level higher or use `process.cwd()` instead. Bug 2: The validation logic for required environment variables uses a falsy check that incorrectly rejects empty string values. If a variable like `DB_USER=` exists in `.env` but is empty, the filter treats it as missing and exits with an error, even though the variable is present.
```

**Resultado:**
Se corrigieron todas las referencias al archivo `.env` en el Memory Bank para indicar que está en la raíz del proyecto (no en `backend/`). Se documentaron los dos bugs conocidos:
- Bug 1: Path incorrecto en desarrollo con `ts-node-dev`
- Bug 2: Validación de variables vacías con checks falsy

Se actualizaron los archivos `memory-bank/techContext.md`, `memory-bank/ops/local-dev.md`, y `memory-bank/progress.md` con la información correcta y los bugs documentados.

---

## Prompt 4

**Prompt del usuario:**
```
Cambia todas las referencias del DB_PORT de 5432 a 5433
```

**Resultado:**
Se cambiaron todas las referencias al puerto de PostgreSQL de 5432 a 5433 en 8 ubicaciones:
- `memory-bank/ops/local-dev.md` (3 cambios: ejemplos de DATABASE_URL y DB_PORT)
- `memory-bank/techContext.md` (2 cambios: URL local y ejemplo en schema)
- `memory-bank/architecture/diagrams.md` (1 cambio: diagrama de deployment)

---

## Prompt 5

**Prompt del usuario:**
```
crea una rama en Git que se llame "backend-SVL", trasladando todos los cambios a esta nueva rama y haz un commit bien explicado
```

**Resultado:**
Se creó la rama `backend-SVL` y se hizo commit de todos los cambios del Memory Bank (19 archivos, 4,506 líneas añadidas) con un mensaje descriptivo que documentaba la creación completa del Memory Bank, incluyendo estructura, contenido, reglas de Cursor, y documentación de bugs conocidos.

---

## Prompt 6

**Prompt del usuario:**
```
corrige el fichero .gitignore atendiendo las mejores prácticas
```

**Resultado:**
Se reescribió completamente el archivo `.gitignore` siguiendo mejores prácticas para proyectos Node.js/TypeScript con React y Prisma. Se organizó por secciones claras (Dependencies, Testing, Production builds, Environment variables, Logs, Cache, OS files, IDEs, etc.), se añadieron patrones para Prisma, uploads, TypeScript, y se corrigió que `.env.example` NO debe estar ignorado (debe estar en el repo como template).

---

## Prompt 7

**Prompt del usuario:**
```
Por qué si tengo los archivos .env en .gitignore me sigue haciendo seguimiento del archivo .env cuando le hago un cambio?
```

**Resultado:**
Se explicó que `.gitignore` solo previene que Git rastree archivos nuevos, pero si un archivo ya estaba siendo rastreado antes de añadirlo a `.gitignore`, Git seguirá rastreándolo. Se verificó que `.env` estaba siendo rastreado con `git ls-files`, se usó `git rm --cached .env` para quitarlo del índice sin borrarlo del disco, y se hizo commit del cambio. Ahora Git ignora correctamente los cambios en `.env`.

---

## Prompt 8

**Prompt del usuario:**
```
guíame paso a paso para arrancar y comprobar que todo funciona perfectamente, incluyendo el levantamiento del docker y la conexión con la base de datos mediante dbbeaver una vez se haya levantado el docker
```

**Resultado:**
Se proporcionó una guía paso a paso completa que incluyó:
1. Verificación de prerrequisitos (Node.js, npm, Docker)
2. Corrección del archivo `.env` (DATABASE_URL con interpolación)
3. Levantamiento de Docker con `docker-compose up -d`
4. Verificación del contenedor PostgreSQL corriendo en puerto 5433
5. Instalación de dependencias del backend
6. Corrección del `schema.prisma` para usar `env("DATABASE_URL")`
7. Generación de Prisma Client y aplicación de migraciones
8. Verificación de conexión a la base de datos
9. Inicio del backend (corriendo en background)
10. Verificación de que el backend responde en http://localhost:3010
11. Instalación de dependencias del frontend
12. Instrucciones detalladas para conectarse con DBeaver

---

## Prompt 9

**Prompt del usuario:**
```
Cómo le hago para que @backend/prisma/schema.prisma lea bien la url del fichero .env guardado en el directorio raíz?
```

**Resultado:**
Se implementó la solución recomendada: un solo `.env` en la raíz del proyecto. Se modificó `backend/src/index.ts` para cargar el `.env` desde la raíz usando `path.resolve(__dirname, '../../.env')`. Se instaló `dotenv-cli` como dependencia de desarrollo. Se actualizaron los scripts de Prisma en `package.json` para usar `dotenv-cli` (prisma:generate, prisma:migrate, prisma:studio, prisma:seed). Se creó `backend/README-ENV.md` con documentación completa. Se actualizó el Memory Bank para reflejar la solución implementada.

---

## Prompt 10

**Prompt del usuario:**
```
¿Cuál es la mejor práctica al respecto? Tener dos ficheros .env diferenciados, uno en el directorio raiz y otro en el directorio backend para la url de la base de datos, o todo en un fichero .env en el directorio raiz y redirigir las lecturas del mismo
```

**Resultado:**
Se explicó que la mejor práctica es tener un solo `.env` en la raíz del proyecto, documentando las ventajas:
- Una sola fuente de verdad
- Sin duplicación
- Compartido con docker-compose.yml
- Más fácil de mantener

Se comparó con la alternativa de dos archivos separados y se confirmó que la solución implementada (un solo `.env` en la raíz con redirección de lecturas) es la correcta según mejores prácticas para monorepos.

---

## Prompt 11

**Prompt del usuario:**
```
commit de todos los cambios
```

**Resultado:**
Se hizo commit de todos los cambios relacionados con la implementación de la carga de `.env` desde la raíz:
- Modificación de `backend/src/index.ts` para cargar `.env` desde raíz
- Instalación de `dotenv-cli`
- Actualización de scripts de Prisma en `package.json`
- Corrección de `schema.prisma` para usar `env("DATABASE_URL")`
- Creación de `backend/README-ENV.md`
- Actualización del Memory Bank

Commit hash: `2e35dc2` en la rama `backend-SVL` con 8 archivos modificados (256 líneas añadidas, 14 eliminadas).

---


# RESUMEN GENERAL

## Trabajo realizado por el usuario

El usuario ha trabajado en la creación y mejora de un **Memory Bank completo** para el proyecto LTI (Talent Tracking System), un sistema de seguimiento de talento con backend Express/TypeScript/Prisma y frontend React.

## Temas principales

### 1. Creación del Memory Bank (Prompt 1)
- Estructura de 19 archivos de documentación
- 6 archivos core con información del proyecto
- Documentación de arquitectura, dominios, interfaces, operaciones y calidad
- Reglas de Cursor para mantener el Memory Bank actualizado
- Identificación de 10 hallazgos relevantes y 5 preguntas UNKNOWN

### 2. Correcciones y ajustes (Prompts 2-4)
- Corrección de fechas de implementación (2026-01-06)
- Corrección de referencias al archivo `.env` (ubicado en raíz, no en backend/)
- Documentación de bugs conocidos con `.env`
- Cambio de puerto de base de datos de 5432 a 5433

### 3. Gestión de Git y configuración (Prompts 5-7)
- Creación de rama `backend-SVL` y commit inicial del Memory Bank
- Mejora del `.gitignore` siguiendo mejores prácticas
- Resolución del problema de `.env` siendo rastreado por Git (usando `git rm --cached`)

### 4. Setup y configuración del proyecto (Prompts 8-10)
- Guía paso a paso para arrancar el proyecto completo
- Levantamiento de Docker y conexión con DBeaver
- Implementación de solución para que Prisma lea el `.env` de la raíz
- Decisión sobre mejor práctica: un solo `.env` en la raíz vs. dos archivos separados

### 5. Finalización (Prompt 11)
- Commit de todos los cambios de configuración de `.env`

## Objetivos alcanzados

1. ✅ Memory Bank completo y estructurado creado
2. ✅ Documentación técnica exhaustiva del proyecto
3. ✅ Configuración correcta de variables de entorno (un solo `.env` en raíz)
4. ✅ Integración de Prisma con `.env` de la raíz usando `dotenv-cli`
5. ✅ Mejora de `.gitignore` siguiendo mejores prácticas
6. ✅ Gestión correcta de Git (rama, commits, exclusión de `.env`)
7. ✅ Guía completa de setup y verificación del proyecto
8. ✅ Documentación de bugs conocidos y soluciones implementadas

## Resultados generados

- **19 archivos** de documentación en `memory-bank/`
- **2 reglas** de Cursor en `.cursor/rules/`
- **1 archivo** de documentación de `.env` en `backend/README-ENV.md`
- **1 archivo** `.gitignore` mejorado
- **2 commits** en la rama `backend-SVL`:
  - Creación del Memory Bank completo
  - Implementación de carga de `.env` desde raíz
- **Solución técnica** implementada para carga de variables de entorno
- **Guía operativa** completa para desarrollo local

El proyecto ahora tiene documentación completa, configuración correcta de variables de entorno, y está listo para ser retomado por cualquier desarrollador o IA sin contexto previo.

