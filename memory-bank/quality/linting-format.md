# Linting & Formatting

## Estado actual

### Backend

**ESLint configurado**:

-   `eslint`: ^9.2.0
-   `eslint-config-prettier`: ^9.1.0
-   `eslint-plugin-prettier`: ^5.1.3

**Prettier configurado**:

-   `prettier`: ^3.2.5

**Configuración**: No detectada en archivos (posible en `.eslintrc.*` o `package.json`)

### Frontend

**ESLint configurado** (via Create React App):

-   `eslintConfig` en `package.json`:
    ```json
    {
        "extends": ["react-app", "react-app/jest"]
    }
    ```

**Prettier**: No detectado explícitamente

## Configuración recomendada

### Backend ESLint

**Crear** `.eslintrc.js` o `.eslintrc.json`:

```javascript
// .eslintrc.js
module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    plugins: ["@typescript-eslint", "prettier"],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    env: {
        node: true,
        es6: true,
    },
    rules: {
        "prettier/prettier": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
    },
};
```

**Dependencia adicional**: `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`

### Backend Prettier

**Crear** `.prettierrc`:

```json
{
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 100,
    "tabWidth": 2,
    "useTabs": false
}
```

**Crear** `.prettierignore`:

```
node_modules
dist
coverage
*.log
```

### Frontend

**Create React App** ya tiene ESLint configurado.

**Añadir Prettier** (opcional):

```json
// .prettierrc
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2
}
```

## Scripts recomendados

### Backend `package.json`

```json
{
    "scripts": {
        "lint": "eslint src/**/*.ts",
        "lint:fix": "eslint src/**/*.ts --fix",
        "format": "prettier --write \"src/**/*.ts\"",
        "format:check": "prettier --check \"src/**/*.ts\"",
        "type-check": "tsc --noEmit"
    }
}
```

### Frontend `package.json`

```json
{
    "scripts": {
        "lint": "eslint src/**/*.{js,jsx,ts,tsx}",
        "lint:fix": "eslint src/**/*.{js,jsx,ts,tsx} --fix",
        "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx}\""
    }
}
```

## Reglas importantes

### TypeScript

-   **Evitar `any`**: Usar tipos específicos
-   **Return types**: Opcional pero recomendado para funciones públicas
-   **No unused variables**: Activar en ESLint

### General

-   **Consistent quotes**: Single o double (elegir uno)
-   **Semicolons**: Sí o no (elegir uno)
-   **Trailing commas**: Útiles para diffs más limpios
-   **Max line length**: 100 o 120 caracteres

## Pre-commit hooks

### Husky + lint-staged

**Instalar**:

```bash
npm install --save-dev husky lint-staged
```

**Configurar** (`package.json`):

```json
{
    "lint-staged": {
        "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
    },
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    }
}
```

**Inicializar**:

```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

## CI/CD integration

### GitHub Actions (ejemplo)

```yaml
- name: Lint
  run: npm run lint

- name: Format check
  run: npm run format:check

- name: Type check
  run: npm run type-check
```

## Convenciones detectadas (del código)

### Naming

-   **Archivos**: camelCase para servicios/rutas, PascalCase para modelos
-   **Clases**: PascalCase
-   **Funciones/variables**: camelCase
-   **Constantes**: No detectado (asumir UPPER_SNAKE_CASE)

### Formatting (inferido)

-   **Indentación**: 2 espacios (común en JS/TS)
-   **Quotes**: Dobles en algunos lugares, simples en otros (inconsistente)
-   **Semicolons**: Sí (detectado en código)

## Issues detectados

1. **Inconsistencia de quotes**: Mezcla de single y double
2. **Uso de `any`**: Varios lugares en código
3. **Sin return types**: Funciones sin tipos de retorno explícitos
4. **Comentarios en español/inglés**: Mezcla

## Quick wins

1. **Configurar ESLint + Prettier** (1 hora):

    - Crear archivos de configuración
    - Añadir scripts a package.json

2. **Fix automático** (30 min):

    - Ejecutar `npm run lint:fix` y `npm run format`
    - Commit cambios

3. **Pre-commit hook** (30 min):

    - Instalar Husky
    - Configurar lint-staged

4. **Eliminar `any` types** (2-3 horas):
    - Crear interfaces/types
    - Reemplazar `any` gradualmente

## Checklist

-   [ ] ESLint configurado (backend)
-   [ ] Prettier configurado (backend)
-   [ ] Scripts de lint/format añadidos
-   [ ] Pre-commit hooks configurados
-   [ ] CI/CD con lint checks
-   [ ] Documentar convenciones en README
