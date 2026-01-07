import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

describe('API Specification Validation', () => {
    let apiSpec: any;

    beforeAll(() => {
        const specPath = path.join(__dirname, '../../../api-spec.yaml');
        const specContent = fs.readFileSync(specPath, 'utf8');
        apiSpec = yaml.load(specContent);
    });

    it('should have valid OpenAPI 3.0 YAML structure', () => {
        expect(apiSpec).toBeDefined();
        expect(apiSpec.openapi).toBe('3.0.0');
        expect(apiSpec.info).toBeDefined();
        expect(apiSpec.paths).toBeDefined();
    });

    it('should include GET /positions/{id}/candidates endpoint', () => {
        const endpoint = apiSpec.paths['/positions/{id}/candidates'];
        expect(endpoint).toBeDefined();
        expect(endpoint.get).toBeDefined();
        expect(endpoint.get.parameters).toBeDefined();
        expect(endpoint.get.parameters[0].name).toBe('id');
        expect(endpoint.get.parameters[0].in).toBe('path');
        expect(endpoint.get.responses).toBeDefined();
        expect(endpoint.get.responses['200']).toBeDefined();
        expect(endpoint.get.responses['400']).toBeDefined();
        expect(endpoint.get.responses['404']).toBeDefined();
        expect(endpoint.get.responses['500']).toBeDefined();
    });

    it('should include PUT /candidates/{id}/stage endpoint', () => {
        const endpoint = apiSpec.paths['/candidates/{id}/stage'];
        expect(endpoint).toBeDefined();
        expect(endpoint.put).toBeDefined();
        expect(endpoint.put.parameters).toBeDefined();
        expect(endpoint.put.parameters[0].name).toBe('id');
        expect(endpoint.put.parameters[0].in).toBe('path');
        expect(endpoint.put.requestBody).toBeDefined();
        expect(endpoint.put.responses).toBeDefined();
        expect(endpoint.put.responses['200']).toBeDefined();
        expect(endpoint.put.responses['400']).toBeDefined();
        expect(endpoint.put.responses['404']).toBeDefined();
        expect(endpoint.put.responses['500']).toBeDefined();
    });

    it('should have correct request body schema for PUT endpoint', () => {
        const endpoint = apiSpec.paths['/candidates/{id}/stage'];
        const requestBody = endpoint.put.requestBody.content['application/json'].schema;
        expect(requestBody.required).toContain('positionId');
        expect(requestBody.required).toContain('currentInterviewStep');
        expect(requestBody.properties.positionId.type).toBe('integer');
        expect(requestBody.properties.currentInterviewStep.type).toBe('integer');
        expect(requestBody.properties.positionId.minimum).toBe(1);
        expect(requestBody.properties.currentInterviewStep.minimum).toBe(1);
    });

    it('should have correct response schema for GET endpoint', () => {
        const endpoint = apiSpec.paths['/positions/{id}/candidates'];
        const response200 = endpoint.get.responses['200'].content['application/json'].schema;
        expect(response200.type).toBe('array');
        expect(response200.items.properties).toBeDefined();
        expect(response200.items.properties.candidateId).toBeDefined();
        expect(response200.items.properties.fullName).toBeDefined();
        expect(response200.items.properties.currentInterviewStep).toBeDefined();
        expect(response200.items.properties.averageScore).toBeDefined();
        expect(response200.items.properties.applicationId).toBeDefined();
    });

    it('should have correct response schema for PUT endpoint', () => {
        const endpoint = apiSpec.paths['/candidates/{id}/stage'];
        const response200 = endpoint.put.responses['200'].content['application/json'].schema;
        expect(response200.type).toBe('object');
        expect(response200.properties.id).toBeDefined();
        expect(response200.properties.positionId).toBeDefined();
        expect(response200.properties.candidateId).toBeDefined();
        expect(response200.properties.currentInterviewStep).toBeDefined();
        expect(response200.properties.candidate).toBeDefined();
        expect(response200.properties.interviewStep).toBeDefined();
    });

    it('should have error response schemas for both endpoints', () => {
        const getEndpoint = apiSpec.paths['/positions/{id}/candidates'];
        const putEndpoint = apiSpec.paths['/candidates/{id}/stage'];

        // Verificar GET endpoint
        expect(getEndpoint.get.responses['400'].content['application/json'].schema.properties.error).toBeDefined();
        expect(getEndpoint.get.responses['404'].content['application/json'].schema.properties.error).toBeDefined();
        expect(getEndpoint.get.responses['500'].content['application/json'].schema.properties.error).toBeDefined();

        // Verificar PUT endpoint
        expect(putEndpoint.put.responses['400'].content['application/json'].schema.properties.error).toBeDefined();
        expect(putEndpoint.put.responses['404'].content['application/json'].schema.properties.error).toBeDefined();
        expect(putEndpoint.put.responses['500'].content['application/json'].schema.properties.error).toBeDefined();
    });

    it('should have examples for both endpoints', () => {
        const getEndpoint = apiSpec.paths['/positions/{id}/candidates'];
        const putEndpoint = apiSpec.paths['/candidates/{id}/stage'];

        // Verificar GET endpoint tiene ejemplo
        expect(getEndpoint.get.responses['200'].content['application/json'].example).toBeDefined();

        // Verificar PUT endpoint tiene ejemplos
        expect(putEndpoint.put.requestBody.content['application/json'].example).toBeDefined();
        expect(putEndpoint.put.responses['200'].content['application/json'].example).toBeDefined();
    });
});

