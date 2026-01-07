# API Documentation

## Base URL

**Desarrollo**: `http://localhost:3010`

**Producción**: UNKNOWN (no configurado)

## Autenticación

**Estado**: No implementada

Todos los endpoints son públicos actualmente.

## Endpoints

### 1. Crear Candidato

**POST** `/candidates`

**Descripción**: Crea un nuevo candidato con sus datos personales, educación, experiencia laboral y CV.

**Request Body**:

```json
{
    "firstName": "string (2-100 chars, solo letras y espacios)",
    "lastName": "string (2-100 chars, solo letras y espacios)",
    "email": "string (formato email válido, único)",
    "phone": "string (opcional, formato: 6|7|9 seguido de 8 dígitos)",
    "address": "string (opcional, máx 100 chars)",
    "educations": [
        {
            "institution": "string (máx 100 chars)",
            "title": "string (máx 100 chars)",
            "startDate": "string (YYYY-MM-DD)",
            "endDate": "string (YYYY-MM-DD, opcional)"
        }
    ],
    "workExperiences": [
        {
            "company": "string (máx 100 chars)",
            "position": "string (máx 100 chars)",
            "description": "string (opcional, máx 200 chars)",
            "startDate": "string (YYYY-MM-DD)",
            "endDate": "string (YYYY-MM-DD, opcional)"
        }
    ],
    "cv": {
        "filePath": "string (ruta del archivo subido)",
        "fileType": "string (MIME type: application/pdf o application/vnd.openxmlformats-officedocument.wordprocessingml.document)"
    }
}
```

**Ejemplo**:

```json
{
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-12-31",
            "endDate": "2010-12-26"
        }
    ],
    "workExperiences": [
        {
            "company": "Coca Cola",
            "position": "SWE",
            "description": "",
            "startDate": "2011-01-13",
            "endDate": "2013-01-17"
        }
    ],
    "cv": {
        "filePath": "uploads/1715760936750-cv.pdf",
        "fileType": "application/pdf"
    }
}
```

**Response 201 Created**:

```json
{
    "id": 1,
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona"
}
```

**Response 400 Bad Request**:

```json
{
    "message": "Invalid name"
}
```

O:

```json
{
    "message": "The email already exists in the database"
}
```

**Códigos de error**:

-   `400`: Datos inválidos o email duplicado
-   `500`: Error interno del servidor

**Dónde implementado**:

-   Ruta: `backend/src/routes/candidateRoutes.ts:6-18`
-   Servicio: `backend/src/application/services/candidateService.ts:7-55`
-   Validación: `backend/src/application/validator.ts`

---

### 2. Obtener Candidato por ID

**GET** `/candidates/:id`

**Descripción**: Obtiene un candidato por su ID, incluyendo todas sus relaciones (educación, experiencia, CVs, aplicaciones).

**Path Parameters**:

-   `id`: number (ID del candidato)

**Response 200 OK**:

```json
{
    "id": 1,
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "id": 1,
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-12-31T00:00:00.000Z",
            "endDate": "2010-12-26T00:00:00.000Z",
            "candidateId": 1
        }
    ],
    "workExperiences": [
        {
            "id": 1,
            "company": "Coca Cola",
            "position": "SWE",
            "description": "",
            "startDate": "2011-01-13T00:00:00.000Z",
            "endDate": "2013-01-17T00:00:00.000Z",
            "candidateId": 1
        }
    ],
    "resumes": [
        {
            "id": 1,
            "filePath": "uploads/1715760936750-cv.pdf",
            "fileType": "application/pdf",
            "uploadDate": "2024-05-15T10:30:00.000Z",
            "candidateId": 1
        }
    ],
    "applications": [
        {
            "id": 1,
            "positionId": 1,
            "candidateId": 1,
            "applicationDate": "2024-05-20T00:00:00.000Z",
            "currentInterviewStep": 1,
            "notes": null,
            "position": {
                "id": 1,
                "title": "Software Engineer"
            },
            "interviews": [
                {
                    "interviewDate": "2024-05-25T00:00:00.000Z",
                    "interviewStep": {
                        "name": "Technical Interview"
                    },
                    "notes": "Good performance",
                    "score": 8
                }
            ]
        }
    ]
}
```

**Response 400 Bad Request**:

```json
{
    "error": "Invalid ID format"
}
```

**Response 404 Not Found**:

```json
{
    "error": "Candidate not found"
}
```

**Response 500 Internal Server Error**:

```json
{
    "error": "Internal Server Error"
}
```

**Dónde implementado**:

-   Ruta: `backend/src/routes/candidateRoutes.ts:20`
-   Controlador: `backend/src/presentation/controllers/candidateController.ts:18-32`
-   Servicio: `backend/src/application/services/candidateService.ts:57-65`
-   Modelo: `backend/src/domain/models/Candidate.ts:129-162`

---

### 3. Subir Archivo

**POST** `/upload`

**Descripción**: Sube un archivo (CV) al servidor. Solo acepta PDF y DOCX.

**Content-Type**: `multipart/form-data`

**Request Body** (form-data):

-   `file`: File (PDF o DOCX, máx 10MB)

**Response 200 OK**:

```json
{
    "filePath": "uploads/1715760936750-cv.pdf",
    "fileType": "application/pdf"
}
```

**Response 400 Bad Request**:

```json
{
    "error": "Invalid file type, only PDF and DOCX are allowed!"
}
```

**Response 500 Internal Server Error**:

```json
{
    "error": "Error message"
}
```

**Limitaciones**:

-   Tipos permitidos: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
-   Tamaño máximo: 10MB
-   Ruta de almacenamiento: `../uploads/` (relativa, puede fallar)

**Dónde implementado**:

-   Ruta: `backend/src/index.ts:43`
-   Servicio: `backend/src/application/services/fileUploadService.ts`

---

## Endpoints no implementados (modelados en BD)

Los siguientes endpoints **no existen** pero las entidades están modeladas:

-   `GET /candidates` - Listar todos (con paginación)
-   `PUT /candidates/:id` - Actualizar candidato
-   `DELETE /candidates/:id` - Eliminar candidato
-   `GET /positions` - Listar posiciones
-   `POST /positions` - Crear posición
-   `GET /applications` - Listar aplicaciones
-   `POST /applications` - Crear aplicación
-   `GET /interviews` - Listar entrevistas
-   `POST /interviews` - Crear entrevista
-   `GET /companies` - Listar empresas
-   `POST /companies` - Crear empresa

## Especificación OpenAPI

**Archivo**: `backend/api-spec.yaml`

**Estado**: Existe pero no está integrado con Swagger UI en Express.

**Integración pendiente**: Usar `swagger-jsdoc` y `swagger-ui-express` (dependencias ya instaladas).

## Validaciones

### Nombres (firstName, lastName)

-   Regex: `^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$`
-   Longitud: 2-100 caracteres

### Email

-   Regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
-   Único en base de datos

### Teléfono

-   Regex: `^(6|7|9)\d{8}$` (formato español)
-   Opcional

### Fechas

-   Formato: `YYYY-MM-DD`
-   Regex: `^\d{4}-\d{2}-\d{2}$`

**Nota**: No se valida que `endDate >= startDate` (deuda técnica).

## CORS

**Configuración actual**: Solo `http://localhost:3000` permitido.

**Dónde**: `backend/src/index.ts:34-37`

**Riesgo**: No funciona en producción sin modificar.

## Rate Limiting

**Estado**: No implementado

**Riesgo**: API expuesta sin protección contra abuso.
