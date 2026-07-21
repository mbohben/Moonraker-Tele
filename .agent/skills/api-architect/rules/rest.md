---
name: rest
description: REST API design — resource naming, HTTP methods, status codes, filtering, sorting
title: "REST Principles"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: rest
---

# REST Principles

> Resource-based API design — nouns not verbs.

---

## Resource Naming Rules

```
Principles:
├── Use NOUNS, not verbs (resources, not actions)
├── Use PLURAL forms (/users not /user)
├── Use lowercase with hyphens (/user-profiles)
├── Nest for relationships (/users/123/posts)
└── Keep shallow (max 3 levels deep)
```

### Endpoint Examples

```
✅ Good:
GET    /users              → List users
GET    /users/123          → Get user 123
POST   /users              → Create user
PUT    /users/123          → Replace user 123
PATCH  /users/123          → Partial update user 123
DELETE /users/123          → Delete user 123
GET    /users/123/posts    → User 123's posts

❌ Bad:
GET    /getUsers           → Verb in URL
POST   /createUser         → Verb in URL
GET    /user               → Singular
GET    /users/123/posts/456/comments/789/likes  → Too deep (>3 levels)
```

## HTTP Method Selection

| Method | Purpose | Idempotent? | Body? |
|--------|---------|-------------|-------|
| **GET** | Read resource(s) | Yes | No |
| **POST** | Create new resource | No | Yes |
| **PUT** | Replace entire resource | Yes | Yes |
| **PATCH** | Partial update | No | Yes |
| **DELETE** | Remove resource | Yes | No |

## Status Code Selection

| Situation | Code | When |
|-----------|------|------|
| Success (read) | 200 | GET returning data |
| Created | 201 | POST success, include Location header |
| No content | 204 | DELETE success, PUT with no response body |
| Bad request | 400 | Malformed JSON, missing required field |
| Unauthorized | 401 | Missing or invalid auth token |
| Forbidden | 403 | Valid auth, insufficient permissions |
| Not found | 404 | Resource doesn't exist |
| Conflict | 409 | Duplicate key, state conflict |
| Validation error | 422 | Valid syntax, invalid semantics |
| Rate limited | 429 | Too many requests, include Retry-After |
| Server error | 500 | Unhandled exception |

## Filtering, Sorting & Search

```typescript
// Filtering — use query params
GET /users?role=admin&status=active

// Sorting — prefix with - for descending
GET /users?sort=-created_at,name

// Search — use q parameter
GET /users?q=john

// Fields projection (sparse fieldsets)
GET /users?fields=id,name,email

// Combined
GET /users?role=admin&sort=-created_at&fields=id,name&page=2&limit=20
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `/getUsers`, `/deleteUser/123` | `GET /users`, `DELETE /users/123` |
| `/user` (singular) | `/users` (plural) |
| Return 200 for errors | Use semantic HTTP status codes |
| Nest beyond 3 levels | Use flat endpoints with filters |
| Ignore idempotency | Design PUT/DELETE as idempotent |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [response.md](response.md) | Response envelope + pagination |
| [versioning.md](versioning.md) | API versioning strategy |
| [api-style.md](api-style.md) | REST vs GraphQL vs tRPC decision |

---

⚡ PikaKit v3.9.206
