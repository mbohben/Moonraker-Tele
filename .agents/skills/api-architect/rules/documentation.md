---
name: documentation
description: OpenAPI 3.1 specs, Swagger UI setup, API documentation best practices
title: "API Documentation Principles"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: documentation
---

# API Documentation Principles

> Good docs = happy developers = API adoption.

---

## OpenAPI 3.1 Example

```yaml
openapi: 3.1.0
info:
  title: Users API
  version: 1.0.0
  description: User management endpoints

paths:
  /users:
    get:
      summary: List users
      operationId: listUsers
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
      responses:
        '200':
          description: Paginated user list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'

    post:
      summary: Create user
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserInput'
      responses:
        '201':
          description: User created
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    User:
      type: object
      properties:
        id: { type: string, format: uuid }
        name: { type: string }
        email: { type: string, format: email }
      required: [id, name, email]

    ErrorResponse:
      type: object
      properties:
        success: { type: boolean, enum: [false] }
        error:
          type: object
          properties:
            code: { type: string }
            message: { type: string }
            requestId: { type: string }
```

## Swagger UI Setup (Express)

```typescript
import swaggerUi from 'swagger-ui-express';
import spec from './openapi.json';

app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Documentation',
}));
```

## Good Documentation Includes

| Section | Purpose |
|---------|---------|
| **Quick Start** | Get running in 5 minutes |
| **Authentication** | How to get and use tokens |
| **API Reference** | Every endpoint with examples |
| **Error Handling** | Error codes and recovery |
| **Rate Limits** | Limits and headers |
| **Changelog** | Breaking changes and deprecations |
| **Code Examples** | Multiple languages (curl, JS, Python) |

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Write docs after shipping | Generate from OpenAPI spec |
| Skip request/response examples | Include full JSON examples |
| Documentation-only errors | Use consistent error schema |
| Outdated examples | Auto-generate from tests |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [response.md](response.md) | Response format for docs |
| [versioning.md](versioning.md) | Documenting API versions |
| [SKILL.md](../SKILL.md) | Full decision framework |

---

⚡ PikaKit v3.9.206
