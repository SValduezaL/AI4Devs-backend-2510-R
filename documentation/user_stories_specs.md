# user_stories_specs

# Guía para Crear User Stories de Alta Calidad

Este documento recoge buenas prácticas consolidadas en la industria para la redacción, gestión y validación de user stories. Está enriquecido con recomendaciones basadas en más de dos décadas de experiencia en desarrollo de productos, incluyendo plataformas ATS y sistemas complejos multi-equipo.

---

## 1. Principios Fundamentales

### Enfoque absoluto en el usuario

- Las user stories deben describir **necesidades, motivaciones y beneficios** desde la perspectiva del usuario, no del sistema.
- Usa *personas* o segmentos reales siempre que sea posible. Esto evita definir historias que no resuelven problemas del mundo real.
- Si no puedes nombrar un usuario concreto, probablemente la historia es una **tarea técnica**, no una user story.

### Lenguaje simple y sin tecnicismos

- Sigue el formato estándar:
**“Como [usuario], quiero [acción] para [beneficio]”**.
- Evita detalles de implementación (API, endpoints, tablas, etc.). El *qué* importa más que el *cómo*.
- La historia debe ser pequeña, entregable en un sprint y aportar valor por sí misma.

### Priorización basada en valor

- Prioriza con criterios claros: impacto en negocio, urgencia, riesgo o reducción de deuda.
- Estima el esfuerzo con participación real del equipo.
- Reevalúa la prioridad cada vez que cambie el contexto o el alcance.

### Colaboración continua

- Las user stories son un **recordatorio de una conversación**, no su sustituto.
- Trabájalas junto al equipo de desarrollo, UX, negocio y QA.
- Utiliza las historias como base para discusiones sobre decisiones, supuestos y riesgos.

### Criterios de aceptación claros y testables

- Usa el formato:
**Dado [contexto], cuando [acción], entonces [resultado esperado]**.
- Deben permitir al equipo de QA verificar la funcionalidad sin depender de interpretaciones.
- Evita redactar criterios que describan la implementación.

### Evolución continua

- Refina sin miedo mientras avanza el proyecto.
- Usa **User Story Mapping** para ordenar flujos, detectar huecos y definir releases.
- Elimina historias obsoletas; no acumules ruido en el backlog.

---

## 2. Estructura Recomendada de una User Story

### 2.1 Formato básico

**Como [tipo de usuario], quiero [acción] para [beneficio].**

### 2.2 Descripción

Explica en lenguaje cotidiano **qué problema se quiere resolver** y qué contexto rodea la necesidad.

### 2.3 Criterios de aceptación

Usa siempre condiciones claras y medibles. Ejemplo:
- **Dado** que el usuario ha iniciado sesión,
- **cuando** accede a su panel de control,
- **entonces** debe ver un resumen de sus próximas tareas.

### 2.4 Notas adicionales

Incluye cualquier aclaración útil para evitar malentendidos.
- Reglas de negocio
- Restricciones conocidas
- Supuestos

### 2.5 Tareas

Lista mínima del trabajo necesario para completar la historia.
- No deben reemplazar la conversación técnica.
- Se actualizan durante el refinamiento.

---

## 3. Ejemplos Enriquecidos de User Stories

### Ejemplo 1: Desarrollo de Productos

**User Story**:

Como gerente de producto, quiero que los miembros del equipo tengan visibilidad clara de cómo sus tareas contribuyen a los objetivos estratégicos, para que puedan priorizar mejor su trabajo.

**Criterios de aceptación**:
- Dado que un miembro del equipo accede a su dashboard, cuando abre una tarea, entonces debe ver un campo que muestre la iniciativa o KPI al que contribuye.
- Dado que hay cambios en la prioridad de una iniciativa, cuando el PM actualiza su estado, entonces las tareas asociadas deben reflejar la nueva prioridad.

**Notas**:
- Las prioridades deben heredarse automáticamente del nivel superior.

**Tareas**:
- Diseñar campo “Objective Link”.
- Implementar lógica de herencia de prioridades.
- Validación con PMs reales.

---

### Ejemplo 2: Experiencia del Cliente (E-commerce)

**User Story**:

Como cliente recurrente, quiero que mis datos de envío y pago se guarden de forma segura, para completar compras más rápido.

**Criterios de aceptación**:
- Dado que el cliente ya compró antes, cuando inicia un nuevo checkout, entonces debe ver sus datos pre-rellenados.
- Dado que el cliente cambia su dirección, cuando guarda los cambios, entonces se debe actualizar en su perfil.
- Dado que hay datos sensibles, cuando se almacenan, entonces deben cumplir con las normativas de seguridad vigentes.

**Notas**:
- No almacenar datos de tarjeta sin tokenización.

**Tareas**:
- Mapeo de flujos de checkout.
- Integración con servicio de tokenización.
- Validación UX con clientes frecuentes.

---

### Ejemplo 3: Aplicación Móvil (Consumo de Información)

**User Story**:

Como usuario frecuente, quiero que la app muestre primero la información más relevante para mí, para ahorrar tiempo.

**Criterios de aceptación**:
- Dado que el usuario tiene historial de uso, cuando abre la app, entonces el contenido debe ordenarse según sus preferencias y comportamiento previo.
- Dado que es un usuario nuevo, cuando abre la app por primera vez, entonces se debe mostrar contenido genérico relevante.

**Notas**:
- Revisar las reglas de personalización para evitar sesgos.

**Tareas**:
- Definir algoritmo de priorización.
- Implementar categorías de contenido.
- Pruebas A/B con segmentos de usuarios.

---

### Ejemplo 4: ATS (Applicant Tracking System)

**User Story**:

Como reclutador, quiero filtrar rápidamente candidatos por experiencia, habilidades y disponibilidad, para reducir el tiempo de selección.

**Criterios de aceptación**:
- Dado que accedo a la lista de candidatos, cuando aplico filtros combinados, entonces la lista debe actualizarse en menos de 2 segundos.
- Dado que selecciono un candidato, cuando abro su perfil, entonces debo ver sus datos estructurados y documentos clave.
- Dado que un candidato actualiza su información, cuando sincroniza su perfil, entonces debe aparecer actualizado de forma inmediata.

**Notas**:
- Importante manejar altos volúmenes de datos.

**Tareas**:
- Optimización de consultas.
- Implementar filtros avanzados.
- Probar rendimiento bajo carga.

---

## 4. Técnicas Complementarias

### User Story Mapping

- Permite visualizar el flujo completo del usuario.
- Ayuda a identificar dependencias, MVPs y releases.

### INVEST

Toda user story debe ser:
- **I**ndependiente
- **N**egociable
- **V**aliosa
- **E**stimable
- **S**mall (pequeña)
- **T**estable

### Definition of Ready (DoR)

Una historia está lista para entrar en sprint cuando:
- Tiene criterios de aceptación completos.
- Está estimada.
- No hay bloqueos pendientes.

### Definition of Done (DoD)

Una historia se considera terminada cuando:
- Cumple criterios de aceptación.
- Tiene pruebas pasadas.
- Está integrada y desplegada según los estándares del equipo.

---

## 5. Conclusión

Unas buenas user stories permiten construir productos centrados en valor, bien alineados con los usuarios y con la organización. No son simplemente campos en un backlog: son el pilar que sostiene el desarrollo ágil.