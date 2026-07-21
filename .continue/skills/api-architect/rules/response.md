---
name: response
description: API response envelope pattern, error format, pagination, TypeScript types
title: "Response Format Principles"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: response
---

# Response Format Principles

> One envelope pattern for ALL endpoints — consistency is key.

---

## Envelope Pattern (Recommended)

```typescript
// Success response
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

// Error response
interface ApiError {
  success: false;
  error: {
    code: string;         // Machine-readable: "VALIDATION_ERROR"
    message: string;      // Human-readable: "Email is invalid"
    details?: Record<string, string[]>; // Field-level errors
    requestId: string;    // For support: "req_abc123"
  };
}

type ApiResult<T> = ApiResponse<T> | ApiError;
```

### Usage Example

```typescript
// Express middleware helper
function ok<T>(res: Response, data: T, meta?: PaginationMeta) {
  res.json({ success: true, data, meta });
}

function fail(res: Response, status: number, code: string, message: string) {
  res.status(status).json({
    success: false,
    error: { code, message, requestId: res.locals.requestId },
  });
}

// In route handler
app.get('/users/:id', async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  if (!user) return fail(res, 404, 'NOT_FOUND', 'User not found');
  ok(res, user);
});
```

## Error Response Standards

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Must be a valid email"],
      "age": ["Must be at least 18"]
    },
    "requestId": "req_abc123"
  }
}
```

**Never expose:** stack traces, SQL queries, internal paths, dependency versions.

## Pagination

| Type | Best For | Trade-offs |
|------|----------|------------|
| **Offset** | Simple, jumpable pages | Slow on large datasets, skip drift |
| **Cursor** | Large datasets, infinite scroll | Can't jump to page N |
| **Keyset** | Performance critical, sorted data | Requires sortable unique key |

### Pagination Response

```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Cursor-based alternative
interface CursorMeta {
  cursor: string | null;  // null = no more pages
  hasMore: boolean;
  limit: number;
}
```

### Selection Guide

1. Dataset < 10K rows → Offset pagination
2. Dataset > 10K, infinite scroll → Cursor pagination
3. Performance critical → Keyset pagination
4. Data frequently changing → Cursor (avoids skip drift)

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Different formats per endpoint | One envelope for all endpoints |
| Expose stack traces in errors | Map to safe client-facing codes |
| Return `200 OK` with error body | Use proper HTTP status codes |
| No request ID in errors | Always include for debugging/support |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [rest.md](rest.md) | HTTP methods + status codes |
| [rate-limiting.md](rate-limiting.md) | 429 response format |
| [SKILL.md](../SKILL.md) | Full decision framework |

---

⚡ PikaKit v3.9.206
