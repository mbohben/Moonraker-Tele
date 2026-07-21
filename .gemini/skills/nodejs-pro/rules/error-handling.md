---
name: error-handling
description: Centralized error handling — custom error classes, framework middleware, async patterns, and structured logging
title: "Every error must be caught, classified, and communicated. No silent failures."
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: error, handling
---

# Error Handling

> Every error must be caught, classified, and communicated. **No silent failures.**

---

## Custom Error Classes

```typescript
// errors/index.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public isOperational = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: unknown) {
    super(message, 422, 'VALIDATION_ERROR')
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT')
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}
```

---

## Framework Error Handlers

### Fastify

```typescript
// Fastify handles async errors automatically — no try/catch needed!
app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    reply.code(error.statusCode).send({
      error: error.code,
      message: error.message,
      ...(error.details && { details: error.details })
    })
    return
  }

  // Unexpected error — log full details, send generic response
  request.log.error(error)
  reply.code(500).send({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred'
  })
})
```

### Hono

```typescript
import { HTTPException } from 'hono/http-exception'

// Global error handler
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json({
      error: err.code,
      message: err.message,
    }, err.statusCode as any)
  }

  console.error('Unexpected error:', err)
  return c.json({ error: 'INTERNAL_ERROR', message: 'Unexpected error' }, 500)
})
```

### Express (requires wrapper)

```typescript
// Express does NOT handle async errors — you MUST wrap or use a library

// Option 1: express-async-errors (recommended)
import 'express-async-errors' // Import once at top

// Option 2: Manual wrapper
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next)

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUser(req.params.id) // Errors auto-forwarded
  res.json(user)
}))

// Error middleware (must be last, must have 4 params)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message
    })
    return
  }

  console.error('Unexpected error:', err)
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Unexpected error' })
})
```

---

## Error Response Format (Fixed)

```typescript
// Client gets:
{
  "error": "NOT_FOUND",           // Machine-readable code
  "message": "User not found",    // Human-readable message
  "details": { ... }              // Optional: validation details
}

// Client NEVER gets:
// - Stack traces
// - Internal file paths
// - Database query details
// - Environment variables
```

---

## Status Code Selection

| Situation | Status | Code | When |
|-----------|:------:|------|------|
| Bad input format | 400 | `BAD_REQUEST` | Malformed JSON, missing fields |
| No auth | 401 | `UNAUTHORIZED` | Missing or invalid token |
| No permission | 403 | `FORBIDDEN` | Valid auth, insufficient role |
| Not found | 404 | `NOT_FOUND` | Resource doesn't exist |
| Conflict | 409 | `CONFLICT` | Duplicate email, version conflict |
| Validation | 422 | `VALIDATION_ERROR` | Schema valid but business rules fail |
| Rate limited | 429 | `RATE_LIMITED` | Too many requests |
| Server error | 500 | `INTERNAL_ERROR` | Our fault — log everything |

---

## Operational vs Programming Errors

```
Operational (expected, handle gracefully):
├── User not found → 404
├── Invalid input → 422
├── Duplicate email → 409
├── Rate limited → 429
└── External API timeout → 503

Programming (bugs, crash + restart):
├── TypeError: Cannot read property of undefined
├── RangeError: Array index out of bounds
├── Unhandled promise rejection
└── → Log, crash, let process manager restart
```

```typescript
// Crash on programming errors — don't try to recover
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error)
  process.exit(1) // Let PM2/Docker restart
})

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason)
  process.exit(1)
})
```

---

## Structured Logging

```typescript
// Use structured JSON logging (Pino is default in Fastify)
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: { target: 'pino-pretty' }
  })
})

// Log context, not messages
logger.error({ err, userId, requestId, path: req.url }, 'User fetch failed')
// ✅ Structured, searchable in Datadog/CloudWatch

// NOT: logger.error(`Error fetching user ${userId}: ${err.message}`)
// ❌ String, unsearchable
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `try/catch` in every Express route | Use `express-async-errors` or Fastify |
| Return stack traces to client | Return error code + message only |
| `console.log` for errors | Use structured logger (Pino) |
| Swallow errors (empty catch) | Always log or rethrow |
| Generic `throw new Error('fail')` | Throw specific `AppError` subclass |
| Recover from programming errors | Crash and restart (PM2/Docker) |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [architecture-patterns.md](architecture-patterns.md) | Where errors flow through layers |
| [async-patterns.md](async-patterns.md) | Async error handling |
| [validation-security.md](validation-security.md) | Validation errors at boundary |
| [framework-selection.md](framework-selection.md) | Framework-specific error behavior |

---

⚡ PikaKit v3.9.206
