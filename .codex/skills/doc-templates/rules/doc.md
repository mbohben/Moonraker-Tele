---
name: doc-templates-reference
description: Full templates and examples for README, API docs, ADR, changelog, llms.txt, and comment guidelines
title: "Doc Templates - Full Reference"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: doc
---

# Doc Templates — Full Reference

> Complete templates with examples. Fill in content, not structure.

---

## 1. README Template (6 Required Sections)

Every README must contain these 6 sections in this order:

```markdown
# Project Name

Brief one-line description of what this project does.

## Quick Start

```bash
# Clone and install
git clone https://github.com/org/project.git
cd project
npm install

# Configure
cp .env.example .env

# Run
npm run dev
```

## Features

- **Feature 1** — Brief description
- **Feature 2** — Brief description
- **Feature 3** — Brief description

## Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | No |
| `DATABASE_URL` | PostgreSQL connection string | — | Yes |
| `API_KEY` | External API key | — | Yes |

## Documentation

- [API Reference](./docs/api.md)
- [Architecture Decisions](./docs/adr/)
- [Contributing Guide](./CONTRIBUTING.md)

## License

MIT © 2025 Your Organization
```

### README Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|------|
| Skip Quick Start | Always include runnable steps |
| List features without description | One line per feature explaining value |
| Hardcode config values | Use env variables with table |
| Link to non-existent docs | Verify all links before commit |

---

## 2. API Endpoint Template

Every endpoint must document: method, path, parameters, response codes.

### Single Endpoint

```markdown
## GET /api/users/:id

Get a user by ID.

**Authentication:** Bearer token required

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `id` | path | string (UUID) | Yes | User ID |
| `include` | query | string | No | Comma-separated relations: `posts,profile` |

**Response:**

| Status | Description | Body |
|--------|-------------|------|
| `200` | Success | `{ id, name, email, createdAt }` |
| `401` | Unauthorized | `{ error: "Invalid token" }` |
| `404` | Not found | `{ error: "User not found" }` |

**Example:**

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://api.example.com/api/users/abc-123
```
```

### Batch Endpoint

```markdown
## POST /api/users/batch

Create multiple users in a single request.

**Request Body:**

```json
{
  "users": [
    { "name": "Alice", "email": "alice@example.com" },
    { "name": "Bob", "email": "bob@example.com" }
  ]
}
```

**Response:** `201` — Array of created user objects
```

### API Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|------|
| Undocumented parameters | Document all params with types |
| Missing error responses | List every possible status code |
| No example request | Include curl or fetch example |
| Assume auth is obvious | State auth requirement explicitly |

---

## 3. ADR Template (4 Required Sections)

Architecture Decision Records capture **why** decisions were made.

```markdown
# ADR-001: Use PostgreSQL for Primary Database

## Status

Accepted | 2025-01-15

## Context

We need a primary database for the user service. Requirements:
- ACID compliance for financial transactions
- JSON support for flexible user profiles
- Proven at scale (>10M rows)
- Team has existing expertise

Alternatives considered:
1. **MySQL** — Less JSON support, team less experienced
2. **MongoDB** — No ACID, schema flexibility unnecessary
3. **PostgreSQL** — Meets all requirements

## Decision

Use **PostgreSQL 16** with Prisma ORM.

- Connection pooling via PgBouncer
- Read replicas for analytics queries
- JSONB columns for extensible metadata

## Consequences

**Positive:**
- Strong ACID guarantees for transactions
- JSONB enables schema evolution without migrations
- Team already proficient

**Negative:**
- Vertical scaling limits (mitigated by read replicas)
- More complex setup than SQLite for local dev
- Requires connection pool management
```

### ADR Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|------|
| Skip Consequences | Always include trade-offs |
| No alternatives listed | Show what was considered |
| Vague context | Quantify requirements |
| No date on status | Include decision date |

---

## 4. Changelog Template

Follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-01-20

### Added
- User profile photo upload (max 5MB, JPEG/PNG)
- Email verification flow with 24h expiry

### Changed
- Upgraded Prisma from 5.x to 6.x
- Password hashing from bcrypt to argon2id

### Fixed
- Race condition in concurrent checkout (#234)
- Memory leak in WebSocket handler (#256)

### Deprecated
- `GET /api/v1/users` — Use `GET /api/v2/users` instead

## [1.1.0] - 2025-01-10

### Added
- Two-factor authentication via TOTP
```

### Changelog Categories (Fixed Order)

| Category | When to Use |
|----------|-------------|
| **Added** | New features |
| **Changed** | Changes to existing functionality |
| **Deprecated** | Features to be removed |
| **Removed** | Features removed |
| **Fixed** | Bug fixes |
| **Security** | Vulnerability patches |

---

## 5. llms.txt Template (AI Context)

Provide AI agents with project context:

```markdown
# Project Name

> One-line description

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL 16 + Prisma 6
- **Auth:** NextAuth.js v5
- **Styling:** Tailwind CSS v4

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # Shared React components
├── lib/           # Utility functions
├── server/        # Server-side logic
│   ├── api/       # API route handlers
│   └── db/        # Database queries
└── types/         # TypeScript type definitions
```

## Key Patterns

- Server Components by default, `'use client'` only when needed
- All database access through `src/server/db/`
- Feature-based directory structure within `app/`
- Environment variables in `.env.local` (see `.env.example`)

## Important Files

- `prisma/schema.prisma` — Database schema
- `src/lib/auth.ts` — Authentication configuration
- `src/server/api/router.ts` — API route definitions
```

---

## 6. Comment Guidelines

### What to Comment (Why)

```typescript
// Business rule: orders over $500 require manager approval
// due to fraud prevention policy (POLICY-2024-03)
if (order.total > 500) {
  await requireApproval(order, 'manager');
}

// Quadratic probe instead of linear for better cache behavior
// when load factor > 0.7 (measured 2x throughput improvement)
const index = quadraticProbe(hash, table.length);

// WARNING: This endpoint is called by the legacy billing system
// which sends dates as MM/DD/YYYY. Do not change the format
// without updating the billing service first.
function parseLegacyDate(dateStr: string): Date {
```

### What NOT to Comment (What)

```typescript
// ❌ Don't: states the obvious
// Increment counter by 1
counter++;

// ❌ Don't: restates the code
// Set user name to the input value
user.name = input.value;

// ❌ Don't: comments every line
// Get the users
const users = await getUsers();
// Filter active users
const active = users.filter(u => u.active);
// Return the active users
return active;
```

### Comment Decision Table

| Situation | Comment? | Example |
|-----------|----------|---------|
| Business rule | ✅ Yes | Why this threshold/limit exists |
| Complex algorithm | ✅ Yes | Why this approach, not the obvious one |
| API contract | ✅ Yes | External dependencies, format requirements |
| Workaround/hack | ✅ Yes | Why, and link to tracking issue |
| Obvious code | ❌ No | `i++`, `return result` |
| Well-named function | ❌ No | `calculateTotalWithTax()` |
| Type declarations | ❌ No | Types are self-documenting |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [engineering-spec.md](engineering-spec.md) | Full engineering spec and contracts |
| [../SKILL.md](../SKILL.md) | Quick reference and anti-patterns |

---

⚡ PikaKit v3.9.206
