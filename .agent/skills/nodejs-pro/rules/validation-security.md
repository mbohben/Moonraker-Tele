---
name: validation-security
description: Input validation with Zod, security middleware, rate limiting, CORS, secrets management, and security checklist
title: "Validation & Security"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: validation, security
---

# Validation & Security

> Validate at boundary. Trust nothing. **Every input is hostile until proven otherwise.**

---

## Validation Library Selection

| Library | Best For | Bundle | TypeScript |
|---------|----------|--------|-----------|
| **Zod** | TypeScript-first, type inference | 13KB | Native inference |
| **Valibot** | Smallest bundle (tree-shakeable) | 1KB | Native inference |
| **ArkType** | Performance-critical validation | 25KB | Native inference |
| **Yup** | React forms (existing usage) | 40KB | @types needed |

**Default recommendation:** Zod (best DX + ecosystem). Valibot if bundle size critical.

---

## Zod Validation Examples

### Request Schema

```typescript
import { z } from 'zod'

// Define schema
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().int().min(13).max(150).optional(),
  role: z.enum(['user', 'admin']).default('user'),
})

// Infer TypeScript type from schema
type CreateUser = z.infer<typeof CreateUserSchema>
// { email: string; name: string; age?: number; role: 'user' | 'admin' }
```

### Fastify Validation Middleware

```typescript
import { ZodSchema, ZodError } from 'zod'

function validate<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = schema.parse(request.body)
    } catch (err) {
      if (err instanceof ZodError) {
        reply.code(422).send({
          error: 'VALIDATION_ERROR',
          details: err.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message,
          }))
        })
      }
    }
  }
}

app.post('/users', { preHandler: validate(CreateUserSchema) }, async (request) => {
  return userService.create(request.body) // Already validated + typed
})
```

### Hono Validation Middleware

```typescript
import { zValidator } from '@hono/zod-validator'

app.post('/users',
  zValidator('json', CreateUserSchema),
  async (c) => {
    const data = c.req.valid('json') // Typed as CreateUser
    return c.json(await userService.create(data), 201)
  }
)
```

### Environment Validation (startup)

```typescript
// env.ts — Validate ALL env vars at startup, fail fast
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().url().optional(),
})

export const env = EnvSchema.parse(process.env)
// If any env var is missing/invalid → crash immediately at startup
```

---

## Security Middleware Stack

### Fastify

```typescript
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyCors from '@fastify/cors'

// Security headers
await app.register(fastifyHelmet)

// Rate limiting
await app.register(fastifyRateLimit, {
  max: 100,            // 100 requests
  timeWindow: '1 minute',
  keyGenerator: (req) => req.ip,
})

// CORS
await app.register(fastifyCors, {
  origin: env.CORS_ORIGINS?.split(',') || false,
  credentials: true,
})
```

### Hono

```typescript
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { rateLimiter } from 'hono-rate-limiter'

app.use('*', secureHeaders())
app.use('*', cors({ origin: env.CORS_ORIGINS?.split(',') || [] }))
app.use('*', rateLimiter({ windowMs: 60_000, limit: 100 }))
```

---

## Security Checklist

| Category | Check | Implementation |
|----------|-------|---------------|
| **Input** | All inputs validated | Zod/Valibot at boundary |
| **SQL** | Parameterized queries | Drizzle/Prisma (never string concat) |
| **Auth** | Password hashing | `argon2` (preferred) or `bcrypt` |
| **Auth** | JWT verification | Verify signature + expiry + issuer |
| **Network** | Rate limiting | `@fastify/rate-limit` or equivalent |
| **Headers** | Security headers | Helmet.js or `hono/secure-headers` |
| **Transport** | HTTPS everywhere | TLS termination at load balancer |
| **CORS** | Properly configured | Explicit origins, not `*` in production |
| **Secrets** | Environment variables | Never hardcode, validate at startup |
| **Deps** | Dependency audit | `npm audit` in CI, Renovate/Dependabot |
| **Code** | No `eval()`/`Function()` | Never in production |
| **Logging** | No secrets in logs | Redact tokens, passwords, keys |

---

## Common Vulnerabilities

| Vulnerability | Prevention |
|--------------|-----------|
| **SQL Injection** | Use ORM (Drizzle/Prisma). Never `db.query(\`SELECT * WHERE id = ${id}\`)` |
| **XSS** | React auto-escapes. Never `dangerouslySetInnerHTML` with user input |
| **CSRF** | SameSite cookies + CSRF token for non-API forms |
| **Path Traversal** | Validate file paths: `path.resolve()` + check prefix |
| **Mass Assignment** | Validate with schema, pick only allowed fields |
| **Prototype Pollution** | Use `Object.create(null)` for lookup maps, validate JSON |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Validate inside business logic | Validate at route boundary |
| `CORS: origin: '*'` in production | Explicit allowed origins |
| Store JWT secret in code | Environment variable, validate at startup |
| `bcrypt` with low rounds | `argon2` or `bcrypt` with rounds ≥ 12 |
| Trust `Content-Type` header | Parse and validate body explicitly |
| Log full request bodies | Redact sensitive fields |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [error-handling.md](error-handling.md) | Validation error responses |
| [framework-selection.md](framework-selection.md) | Framework-specific validation |
| [architecture-patterns.md](architecture-patterns.md) | Where validation sits in layers |
| [testing-strategy.md](testing-strategy.md) | Testing validation schemas |

---

⚡ PikaKit v3.9.206
