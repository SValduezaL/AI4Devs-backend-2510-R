# Prompts Guia Buenas Practicas — 2026-01-07

## Prompt 1

**Prompt del usuario:**
```
Eres un Arquitecto de Software Senior y Tech Lead experto en:
- Domain-Driven Design (DDD)
- Test-Driven Development (TDD)
- Principios SOLID (SRP, OCP, LSP, ISP, DIP)
- DRY
- Clean Architecture
- Patrones de diseño empresariales

Tu tarea es generar un **README de Buenas Prácticas específico para ESTE repositorio**.

NO debes escribir una guía genérica.
Debes analizar:
- La estructura de carpetas
- El modelo de dominio
- Los servicios de aplicación
- La capa de infraestructura y adaptadores
- Los tests (si existen)
- Convenciones de nombres
- Dependencias entre capas
- Cómo están distribuidas actualmente las responsabilidades

A partir de ese análisis debes inferir:
- El estilo arquitectónico realmente utilizado (aunque esté mal aplicado)
- Dónde el código cumple o viola DDD, SOLID, DRY, Clean Architecture y TDD
- Qué patrones de diseño están implícitos (Repository, Factory, Strategy, CQRS, Adapter, etc.)

---

## 1️⃣ Requisitos del documento

Debes:

1. Elegir un **nombre adecuado para el archivo**, coherente con el proyecto  
   Ejemplos:
   - `ARCHITECTURE_GUIDELINES.md`
   - `ENGINEERING_PRACTICES.md`
   - `DOMAIN_DESIGN_GUIDE.md`
   - `DEVELOPMENT_STANDARDS.md`

2. Guardarlo en la **carpeta más apropiada según la estructura del proyecto**  
   (raíz, docs/, architecture/, engineering/, etc.)

3. El documento debe estar en **formato Markdown**

---

## 2️⃣ Contenido obligatorio

El documento debe incluir estas secciones:

### 📌 Contexto del Proyecto
Describe brevemente (basado en el código):
- Qué hace el sistema
- Cuál es su dominio
- Qué arquitectura usa realmente
- Cómo se reparten hoy las responsabilidades

---

### 🧩 Domain-Driven Design (DDD)
Explica cómo aplica DDD en ESTE proyecto:
- Cuáles son los Aggregates, Entities, Value Objects, Domain Services y Repositories
- Dónde están los límites de contexto
- Qué está mal modelado o acoplado

---

### 🧪 Test-Driven Development (TDD)
Explica:
- Cómo están estructurados hoy los tests
- Qué falta para cumplir TDD real
- Cómo debería evolucionar el proyecto si se aplica TDD correctamente

---

### 🧱 Principios SOLID
Crear una subsección por principio:
- SRP
- OCP
- LSP
- ISP
- DIP

Para cada uno:
1. Explica cómo aplica a ESTE código
2. Muestra al menos **una violación real encontrada**
3. Muestra cómo debería quedar tras refactorizar

---

### ♻ DRY y Reutilización
Muestra:
- Duplicaciones actuales
- Dónde falta abstracción
- Qué componentes deberían extraerse o unificarse

---

### 🧰 Patrones de Diseño
Identifica:
- Patrones ya presentes (aunque estén mal implementados)
- Patrones que deberían introducirse

Explica por qué en cada caso.

---

## 3️⃣ Plantillas Before / After

El documento debe incluir **plantillas reutilizables** como:

```md
## Ejemplo – Violación de SRP

### ❌ Antes
(código real o reconstruido a partir del proyecto)
### ✅ Después
(versión refactorizada aplicando SRP)
### Por qué esto es mejor
(explicación técnica)


Estas plantillas deben usarse varias veces con **ejemplos reales del proyecto**, no código ficticio.

---

## 4️⃣ Estilo y nivel

- Escribe como un **arquitecto senior guiando a un equipo real**
- Sé técnico, concreto y con criterio
- No des explicaciones de libro
- Todas las recomendaciones deben estar ligadas a este repositorio

---

## 5️⃣ Resultado final

Al final debes:
- Mostrar el archivo Markdown completo
- Indicar la ruta donde lo has guardado

Este documento será la **referencia oficial de ingeniería del proyecto**, así que debe tener calidad de producción.
```

**Resultado:**
La IA generó el documento `ENGINEERING_PRACTICES.md` (posteriormente renombrado a `documentation/best_practices.md`) con un análisis completo de la arquitectura del proyecto. El documento incluye:

- **Contexto del proyecto**: Descripción del sistema LTI, arquitectura actual y reparto de responsabilidades
- **Análisis DDD**: Identificación de agregados, violaciones (Active Record vs Repository, falta de Value Objects, falta de Domain Services) con ejemplos Before/After
- **Análisis TDD**: Estado actual (sin tests), estructura recomendada, ejemplos de tests con Value Objects y Repository Pattern
- **Análisis SOLID**: Violaciones específicas de cada principio (SRP, OCP, LSP, ISP, DIP) con código real del proyecto y soluciones propuestas
- **Análisis DRY**: Duplicaciones detectadas (patrón `save()`, manejo de errores, validación de fechas) con soluciones
- **Patrones de diseño**: Patrones presentes (Active Record, Service Layer, Controller, Validator) y recomendados (Repository, Factory, Strategy, Adapter, Unit of Work)
- **Recomendaciones priorizadas**: Lista de tareas organizadas por prioridad (Alta, Media, Baja) con estimaciones de esfuerzo

El documento tiene 1,574 líneas y utiliza referencias de código real del proyecto con el formato `startLine:endLine:filepath`.

---

## Prompt 2

**Prompt del usuario:**
```
Actualiza el memory-bank teniendo en cuenta el nuevo documento creado y las propuestas que en dicho archivo se realizan
```

**Resultado:**
La IA actualizó 4 archivos del Memory Bank con referencias al nuevo documento de buenas prácticas:

- **`memory-bank/systemPatterns.md`**: Añadidas violaciones de principios SOLID (SRP, DIP) en cada patrón, referencias al documento, y nueva sección "Documentación de buenas prácticas"
- **`memory-bank/progress.md`**: Actualizada sección "Deuda técnica" con violaciones específicas, referencias al documento con soluciones, y reorganizada "Lista de Quick wins" con recomendaciones priorizadas
- **`memory-bank/activeContext.md`**: Añadida referencia al documento en "Estado actual", actualizado "Next steps sugeridos" con recomendaciones priorizadas del documento
- **`memory-bank/quality/testing.md`**: Añadida referencia al análisis TDD, identificado problema crítico (imposibilidad de aplicar TDD sin Repository Pattern), actualizados ejemplos con Repository Pattern, y reorganizada estrategia de testing

Total: 38 referencias actualizadas en el Memory Bank apuntando al documento de buenas prácticas.

---

## Prompt 3

**Prompt del usuario:**
```
commitea todos los cambios realizados
```

**Resultado:**
La IA realizó un commit con todos los cambios:

- **Mensaje**: `docs(engineering): add engineering practices guide and update memory bank`
- **Archivos**: 5 archivos modificados (ENGINEERING_PRACTICES.md creado + 4 archivos del memory-bank actualizados)
- **Estadísticas**: 1,895 líneas añadidas, 85 líneas eliminadas
- **Hash del commit**: `d1b65a8`

---

## Prompt 4

**Prompt del usuario:**
```
Cambie el nombre del archivo ENGINEERING_PRACTICES.md a best_practices.md, y lo moví a la carpeta documentation colgando directamente de la raíz. En dicha carpeta iré subiendo otra documentación guía y especificaciones con las mejores prácticas.
Refleja estos cambios en el memory-bank.
```

**Resultado:**
La IA actualizó todas las referencias en el Memory Bank:

- Reemplazó todas las referencias de `ENGINEERING_PRACTICES.md` a `documentation/best_practices.md` en:
  - `memory-bank/quality/testing.md` (12 referencias)
  - `memory-bank/activeContext.md` (9 referencias)
  - `memory-bank/progress.md` (11 referencias)
  - `memory-bank/systemPatterns.md` (6 referencias)
- Total: 38 referencias actualizadas correctamente
- Verificación: Sin errores de linting, todas las referencias apuntan a la nueva ubicación

---

## Prompt 5

**Prompt del usuario:**
```
haz el commit
```

**Resultado:**
La IA realizó un commit con los cambios de reorganización:

- **Mensaje**: `refactor(docs): move best practices guide to documentation folder`
- **Archivos**: 6 archivos modificados
  - `ENGINEERING_PRACTICES.md` → `documentation/best_practices.md` (renombrado, 100% similar)
  - `documentation/user_stories_specs.md` (nuevo archivo detectado)
  - 4 archivos del memory-bank actualizados
- **Estadísticas**: 240 líneas añadidas, 38 líneas eliminadas
- **Hash del commit**: `f894f86`
- Git detectó automáticamente el renombrado del archivo

---

## Prompt 6

**Prompt del usuario:**
```
Estás operando dentro de un chat que ya contiene el historial completo de una conversación entre el usuario y una IA.

Tu tarea es generar un nuevo archivo Markdown llamado:

prompts-guia-buenas-practicas.md

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

# Prompts Guia Buenas Practicas — <FECHA>

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
prompts-guia-buenas-practicas.md
y asegúrate de que se crea en una nueva carpeta llamada prompts/ dentro de la raíz del proyecto.
```

**Resultado:**
La IA está generando este archivo (`prompts-guia-buenas-practicas.md`) con todos los prompts del usuario extraídos del historial de la conversación, incluyendo este mismo prompt. El archivo se está creando en la carpeta `prompts/` con la estructura solicitada, incluyendo la fecha actual (2026-01-07) y un resumen general al final.

---

# RESUMEN GENERAL

## Trabajo realizado por el usuario

A lo largo de esta conversación, el usuario ha trabajado en la **creación y organización de documentación de buenas prácticas de ingeniería** para el proyecto LTI (Talent Tracking System).

## Temas principales

1. **Generación de documento de buenas prácticas arquitectónicas**:
   - Creación de un documento exhaustivo (`ENGINEERING_PRACTICES.md` → `documentation/best_practices.md`) que analiza violaciones de principios SOLID, DDD, TDD, DRY y Clean Architecture en el código actual del proyecto
   - Análisis específico del repositorio (no genérico) con ejemplos reales de código
   - Identificación de patrones presentes y recomendaciones de patrones a introducir

2. **Actualización del Memory Bank**:
   - Integración del nuevo documento en la documentación del proyecto
   - Actualización de referencias cruzadas en múltiples archivos del Memory Bank
   - Reorganización de tareas y recomendaciones según prioridades del documento

3. **Organización de documentación**:
   - Reorganización del documento de buenas prácticas en la carpeta `documentation/`
   - Establecimiento de estructura para futuras guías y especificaciones
   - Renombrado del archivo para mejor claridad (`best_practices.md`)

4. **Gestión de versiones**:
   - Commits organizados siguiendo convenciones del proyecto
   - Seguimiento de cambios en el repositorio Git

## Objetivos alcanzados

- ✅ Documento de referencia oficial de ingeniería creado (1,574 líneas)
- ✅ Memory Bank actualizado con 38 referencias al nuevo documento
- ✅ Estructura de documentación organizada (`documentation/`)
- ✅ Historial de prompts documentado para referencia futura

## Resultados generados

- **Documento técnico completo**: Análisis detallado de arquitectura con violaciones identificadas y soluciones propuestas
- **Memory Bank actualizado**: 4 archivos modificados con referencias y mejoras basadas en el análisis
- **2 commits realizados**: Cambios documentados y versionados correctamente
- **Archivo de prompts**: Este documento que registra todo el proceso de trabajo

El usuario ha establecido una base sólida de documentación técnica que servirá como referencia para futuras decisiones arquitectónicas y mejoras del proyecto.

