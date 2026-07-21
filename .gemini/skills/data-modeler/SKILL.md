---
name: data-modeler
description: >-
  Database schema design, indexing, ORM selection (Prisma/Drizzle), and migrations.
  Use when designing tables, writing migrations, or optimizing queries.
  NOT for API endpoints (use api-architect) or server logic (use nodejs-pro).
metadata:
  author: pikakit
  version: "3.9.206"
  category: database-architecture
  triggers: ["database", "schema", "Prisma", "Drizzle", "SQL", "migration", "indexing"]
  coordinates_with: ["api-architect", "nodejs-pro", "python-pro", "security-scanner"]
  success_metrics: ["0 N+1 query warnings", "100% indexed foreign keys"]
---

# Data Modeler — Database Design

> Context-specific decisions. Ask before assuming. Never default to PostgreSQL blindly.

---

## 5 Must-Ask Questions (Socratic Gate)

| # | Question | Options |
|---|----------|---------|
| 1 | Database Platform? | PostgreSQL / SQLite / Turso / Neon |
| 2 | ORM Preference? | Drizzle / Prisma / Kysely / Raw SQL |
| 3 | Deployment Target? | Serverless / Edge / VPS / Managed |
| 4 | Expected Scale? | Prototype / Mid-tier / High-traffic |
| 5 | Migration Strategy? | Greenfield / Existing Schema |

---

## Prerequisites

**Required:** None — Data Modeler is a knowledge-based skill with no external dependencies.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Choosing database | Invoke database-select; read `database-selection.md` |
| Choosing ORM | Invoke orm-select; read `orm-selection.md` |
| Designing schema | Invoke schema-design; read `schema-design.md` |
| Planning indexes | Invoke index-strategy; read `indexing.md` |
| Changing schema | Invoke migration-plan; read `migrations.md` |
| Query performance | Invoke query-analysis; read `optimization.md` |
| Architecture review | Read `rules/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Database selection (PostgreSQL/Neon/Turso/SQLite) | Database provisioning (→ server-ops) |
| ORM selection (Drizzle/Prisma/Kysely) | API endpoint design (→ api-architect) |
| Schema design (normalization, PKs, relationships) | Security scanning (→ security-scanner) |
| Index strategy (B-tree/hash/GIN/GiST) | Database monitoring (→ observability) |
| Migration safety (additive/destructive/multi-phase) | SQL execution |

**Pure decision skill:** Produces database architecture decisions. Zero side effects.

---

## Core Principle

- **ASK** user for database/ORM preference when unclear
- Choose based on **CONTEXT** (deployment, scale, data model, budget)
- Don't default to PostgreSQL for everything
- If user states preference, skip decision tree

---

## Database Selection (Quick Reference)

| Context | Recommendation |
|---------|---------------|
| Prototype / embedded / simple | SQLite |
| Serverless / edge deployment | Turso |
| Serverless PostgreSQL | Neon |
| Production / complex queries | PostgreSQL |

---

## ORM Selection (Quick Reference)

| Context | Recommendation | N+1 Prevention |
|---------|---------------|----------------|
| Type-safe, lightweight | Drizzle | Manual join control |
| Rapid prototyping, relations | Prisma | `include` depth limits |
| Raw SQL with type safety | Kysely | Query-level control |

---

## Index Type Mapping

| Query Pattern | Index Type |
|--------------|-----------|
| Equality lookups | Hash |
| Range queries, sorting | B-tree |
| Full-text search | GIN |
| Spatial queries | GiST |

---

## Decision Checklist

| # | Check | Question |
|---|-------|----------|
| 1 | User preference? | Asked user about database/ORM choice? |
| 2 | Context match? | Chosen for THIS project's scale/deployment? |
| 3 | Deploy environment? | Considered serverless/edge/VPS constraints? |
| 4 | Index strategy? | Planned indexes for known query patterns? |
| 5 | Relationships? | Defined all relationship types with join strategy? |
| 6 | Migration safety? | Classified as additive/destructive/multi-phase? |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_CONTEXT` | Yes | Required context field missing |
| `ERR_INVALID_SCALE` | No | Scale not in supported list |
| `ERR_INVALID_DEPLOYMENT` | No | Deployment not in supported list |
| `ERR_CONTEXT_CONFLICT` | Yes | Contradictory context fields |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |

**Zero internal retries.** Deterministic; same context = same recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to PostgreSQL for simple apps | Choose SQLite when it suffices |
| Skip index planning | Plan indexes for every known query pattern |
| Use `SELECT *` in production | Select only needed columns |
| Store JSON when structured data fits | Use normalized relational schema |
| Ignore N+1 queries | Include N+1 prevention in ORM strategy |
| Run destructive migration without rollback | Plan rollback for every schema change |

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `schema_designed` | `{"tables_count": 5, "normalization": "3NF"}` | `INFO` |
| `platform_selected` | `{"platform": "neon", "deployment": "serverless"}` | `INFO` |
| `migration_planned` | `{"type": "additive", "tables_affected": 2}` | `INFO` |

All data-modeler outputs MUST emit `schema_designed`, `platform_selected`, or `migration_planned` events when applicable.

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [database-selection.md](rules/database-selection.md) | PostgreSQL vs Neon vs Turso vs SQLite | Choosing database |
| [orm-selection.md](rules/orm-selection.md) | Drizzle vs Prisma vs Kysely | Choosing ORM |
| [schema-design.md](rules/schema-design.md) | Normalization, PKs, relationships | Designing schema |
| [indexing.md](rules/indexing.md) | Index types, composite indexes | Performance tuning |
| [optimization.md](rules/optimization.md) | N+1, EXPLAIN ANALYZE | Query analysis |
| [migrations.md](rules/migrations.md) | Safe migrations, serverless DBs | Schema changes |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design patterns |
| `nodejs-pro` | Skill | Node.js backend |
| `python-pro` | Skill | Python backend |
| `security-scanner` | Skill | Security vulnerability detection |

---

⚡ PikaKit v3.9.206
