# Observability

## Estado actual

**Logging**: Básico (`console.log`)

**Monitoring**: No implementado

**Tracing**: No implementado

**Metrics**: No implementado

## Logging

### Implementado

**Backend** (`backend/src/index.ts`):

```typescript
console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
console.error(err.stack); // En error handler
```

**Frontend**: No detectado (posible `console.log` en componentes)

### Limitaciones

1. **No estructurado**: Logs en texto plano, difícil de parsear
2. **Sin niveles**: No diferencia entre info, warn, error
3. **Sin contexto**: No incluye request ID, user ID, etc.
4. **Sin persistencia**: Solo stdout/stderr
5. **Sin rotación**: Logs pueden crecer indefinidamente

### Mejoras recomendadas

**Librerías**:

-   **Winston**: Popular, flexible
-   **Pino**: Rápido, JSON por defecto
-   **Bunyan**: Estructurado, streams

**Ejemplo con Pino**:

```typescript
import pino from "pino";

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
});

logger.info({ method: req.method, path: req.path }, "Request received");
logger.error({ err }, "Error occurred");
```

**Dónde añadir**: `backend/src/index.ts`, servicios, controladores

## Monitoring

### No implementado

**Faltante**:

-   Health checks
-   Uptime monitoring
-   Performance metrics
-   Error rates
-   Request rates

### Recomendaciones

1. **Health check endpoint**:

```typescript
app.get("/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: "ok", database: "connected" });
    } catch (err) {
        res.status(503).json({ status: "error", database: "disconnected" });
    }
});
```

2. **APM tools**:

-   New Relic
-   Datadog APM
-   Elastic APM
-   AppDynamics

3. **Uptime monitoring**:

-   UptimeRobot
-   Pingdom
-   StatusCake

## Tracing

### No implementado

**Distributed tracing**: No hay sistema para rastrear requests a través de servicios.

**Recomendaciones**:

-   OpenTelemetry
-   Jaeger
-   Zipkin

**Nota**: Actualmente es monolito, pero útil para debugging.

## Metrics

### No implementado

**Métricas útiles**:

-   Request rate (req/s)
-   Response time (p50, p95, p99)
-   Error rate (%)
-   Database query time
-   Memory usage
-   CPU usage

### Recomendaciones

1. **Prometheus + Grafana**:

    - Exponer métricas en `/metrics`
    - Grafana para visualización

2. **Librerías**:

    - `prom-client` para métricas Prometheus
    - `express-prometheus-middleware` para Express

3. **Ejemplo básico**:

```typescript
import promClient from "prom-client";

const httpRequestDuration = new promClient.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status"],
});

app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = (Date.now() - start) / 1000;
        httpRequestDuration.observe(
            {
                method: req.method,
                route: req.route?.path,
                status: res.statusCode,
            },
            duration
        );
    });
    next();
});

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", promClient.register.contentType);
    res.end(await promClient.register.metrics());
});
```

## Error tracking

### No implementado

**Recomendaciones**:

-   **Sentry**: Popular, fácil de integrar
-   **Rollbar**: Similar a Sentry
-   **Bugsnag**: Otra opción

**Ejemplo con Sentry**:

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
});

// En error handler
app.use((err, req, res, next) => {
    Sentry.captureException(err);
    // ... resto del handler
});
```

## Logging estructurado recomendado

### Setup con Pino

```typescript
// logger.ts
import pino from "pino";

export const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport:
        process.env.NODE_ENV === "development"
            ? { target: "pino-pretty" }
            : undefined,
});
```

```typescript
// En index.ts
import { logger } from "./logger";

app.use((req, res, next) => {
    logger.info(
        {
            method: req.method,
            path: req.path,
            ip: req.ip,
        },
        "Incoming request"
    );
    next();
});
```

## Checklist de observabilidad

### Mínimo viable

-   [ ] Logging estructurado (JSON)
-   [ ] Health check endpoint
-   [ ] Error tracking (Sentry o similar)
-   [ ] Logs en archivo o servicio externo

### Recomendado

-   [ ] APM tool
-   [ ] Métricas básicas (Prometheus)
-   [ ] Dashboard (Grafana)
-   [ ] Alertas (errores, latencia alta)

### Avanzado

-   [ ] Distributed tracing
-   [ ] Log aggregation (ELK, Loki)
-   [ ] Custom dashboards
-   [ ] SLA monitoring
