# Events & Jobs

## Eventos

**Estado**: No implementado

No hay sistema de eventos (pub/sub, event bus, etc.) en el código actual.

**Posibles eventos futuros**:

-   `candidate.created`
-   `candidate.updated`
-   `application.submitted`
-   `interview.scheduled`
-   `interview.completed`

## Jobs / Tareas programadas

**Estado**: No implementado

No hay sistema de jobs, colas o tareas programadas (cron).

**Posibles jobs futuros**:

-   Limpieza de archivos temporales
-   Envío de emails de confirmación
-   Notificaciones de recordatorios de entrevistas
-   Reportes periódicos
-   Sincronización con sistemas externos

## Workers

**Estado**: No implementado

No hay workers separados del servidor principal.

## Procesamiento asíncrono

**Estado**: Todo es síncrono

Todas las operaciones son síncronas:

-   Crear candidato: bloquea hasta completar
-   Subir archivo: bloquea hasta guardar
-   Obtener candidato: bloquea hasta query completar

**Riesgo**: Operaciones largas (procesamiento de CVs, envío de emails) bloquearían el servidor.

## Notas

Si en el futuro se necesitan eventos o jobs:

1. **Eventos**: Considerar librerías como:

    - EventEmitter (Node.js nativo)
    - EventBus custom
    - RabbitMQ, Redis Pub/Sub para distribución

2. **Jobs**: Considerar:

    - Bull (Redis-based)
    - Agenda (MongoDB-based)
    - node-cron para tareas programadas

3. **Workers**: Considerar:
    - Proceso Node.js separado
    - PM2 para gestión de procesos
    - Kubernetes Jobs para escalado
