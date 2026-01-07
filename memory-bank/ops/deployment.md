# Deployment

## Estado actual

**Producción**: UNKNOWN (no configurado en repo)

**CI/CD**: UNKNOWN (no detectado)

**Entorno de producción**: UNKNOWN

## Configuración detectada

### Docker Compose (desarrollo)

**Archivo**: `docker-compose.yml`

**Servicios**:

-   PostgreSQL database

**Uso**: Solo para desarrollo local

### Build process

**Backend**:

```bash
npm run build  # Compila TypeScript a dist/
npm start      # Ejecuta dist/index.js
```

**Frontend**:

```bash
npm run build  # Crea build/ con archivos estáticos
```

**Nota**: Frontend build necesita servidor web (nginx, Apache, etc.) o CDN.

## Consideraciones para producción

### Backend

1. **Variables de entorno**:

    - `DATABASE_URL`: Connection string de producción
    - `PORT`: Puerto del servidor (o usar variable del host)
    - `NODE_ENV=production`
    - `CORS_ORIGIN`: Origen permitido (no `localhost:3000`)
    - `UPLOAD_PATH`: Ruta absoluta para archivos

2. **Proceso manager**:

    - PM2 recomendado para Node.js
    - O usar Docker con restart policy
    - O usar sistema de init (systemd, etc.)

3. **Base de datos**:

    - PostgreSQL en servidor separado o managed service (AWS RDS, etc.)
    - No usar Docker Compose en producción

4. **Archivos estáticos**:

    - Uploads en volumen persistente o S3/cloud storage
    - No usar ruta relativa

5. **Seguridad**:
    - HTTPS (nginx reverse proxy o load balancer)
    - Autenticación (no implementada)
    - Rate limiting (no implementado)
    - Secrets management (no hardcodear en código)

### Frontend

1. **Build de producción**:

    ```bash
    cd frontend
    npm run build
    ```

2. **Servir archivos**:

    - Nginx, Apache, o CDN (CloudFront, Cloudflare, etc.)
    - O servir desde backend Express (no recomendado)

3. **Variables de entorno**:
    - `REACT_APP_API_URL`: URL del backend en producción
    - Build-time variables (no runtime)

## Opciones de deployment

### Opción 1: VPS tradicional

**Stack**:

-   VPS (DigitalOcean, Linode, etc.)
-   Nginx como reverse proxy
-   PM2 para Node.js
-   PostgreSQL en mismo servidor o separado

**Pasos** (no probados):

1. Clonar repo en servidor
2. Instalar Node.js, npm, PostgreSQL
3. Configurar variables de entorno
4. Build backend y frontend
5. Configurar Nginx
6. Iniciar con PM2

### Opción 2: Docker

**Stack**:

-   Docker Compose o Kubernetes
-   Imágenes Docker para backend y frontend
-   PostgreSQL en contenedor o servicio externo

**Necesario**:

-   `Dockerfile` para backend (no existe)
-   `Dockerfile` para frontend (no existe)
-   `docker-compose.prod.yml` (no existe)

### Opción 3: Platform as a Service

**Opciones**:

-   **Backend**: Heroku, Railway, Render, Fly.io
-   **Frontend**: Vercel, Netlify, GitHub Pages
-   **Base de datos**: Managed PostgreSQL (Supabase, Neon, etc.)

**Ventajas**: Menos configuración, escalado automático

## CI/CD (no implementado)

### Posibles pipelines

**GitHub Actions**:

```yaml
# .github/workflows/deploy.yml (no existe)
name: Deploy
on:
    push:
        branches: [main]
jobs:
    deploy:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v2
            - name: Setup Node.js
              uses: actions/setup-node@v2
            - name: Install dependencies
              run: npm install
            - name: Build
              run: npm run build
            - name: Deploy
              run: # deploy commands
```

**GitLab CI**:

-   Similar pero con `.gitlab-ci.yml`

## Monitoring (no implementado)

### Recomendaciones

1. **Logging**:

    - Reemplazar `console.log` con librería estructurada (Winston, Pino)
    - Enviar logs a servicio (Datadog, LogRocket, etc.)

2. **APM**:

    - New Relic, Datadog APM, o similar

3. **Health checks**:

    - Endpoint `/health` (no existe)
    - Verificar conexión a BD

4. **Error tracking**:
    - Sentry, Rollbar, o similar

## Checklist de deployment

### Pre-deployment

-   [ ] Variables de entorno configuradas
-   [ ] Base de datos de producción creada
-   [ ] Migraciones aplicadas
-   [ ] Secrets no en código
-   [ ] CORS configurado correctamente
-   [ ] HTTPS configurado
-   [ ] Rate limiting implementado (recomendado)
-   [ ] Autenticación implementada (recomendado)

### Post-deployment

-   [ ] Health check funcionando
-   [ ] Logs accesibles
-   [ ] Monitoring configurado
-   [ ] Backup de BD configurado
-   [ ] Documentación actualizada

## Notas

**Este documento es especulativo**. No hay configuración de producción en el repo actual.

**Recomendación**: Confirmar con el equipo:

-   Dónde se despliega
-   Qué herramientas usan
-   Cuál es el proceso actual
