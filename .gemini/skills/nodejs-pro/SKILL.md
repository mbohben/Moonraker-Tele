---
name: nodejs-pro
description: >-
  Node.js backend development with Hono, Fastify, Express, or NestJS.
  Use when building APIs, servers, backend logic, or choosing Node.js frameworks.
  NOT for frontend code (use react-pro) or database schema (use data-modeler).
metadata:
  author: pikakit
  version: "3.9.206"
  category: backend-architect
  triggers: ["Node.js", "Express", "Fastify", "Hono", "backend", "server", "API"]
  coordinates_with: ["api-architect", "data-modeler", "auth-patterns", "problem-checker", "knowledge-compiler", "typescript-expert"]
  success_metrics: ["0 Security Vulnerabilities", "0 IDE/Lint Errors", "0 Unhandled Promise Rejections"]
---

# Node.js Pro — Backend Decision Framework

> 5 frameworks. Async-first. Validate at boundary. No sync in production.

**Philosophy:** Learn to THINK, not memorize. Choose framework by context.

---

## 5 Must-Ask Questions (Before Any Development)

| # | Question | Options |
|---|----------|---------|
| 1 | Who are the Consumers? | SPA, mobile, third-party, internal |
| 2 | Runtime / Target? | Edge (Hono/Bun), Node.js, Serverless |
| 3 | Framework Preference? | Hono, Fastify, Express, NestJS |
| 4 | Database & ORM? | PostgreSQL/Neon, Turso/SQLite, Prisma/Drizzle |
| 5 | Authentication? | JWT, Session, OAuth2, None |

---

## When to Use

| Situation | Action |
|-----------|--------|
| Choosing Node.js framework | Use framework decision tree |
| Building API | Check framework comparison |
| Edge/serverless deployment | Consider Hono |
| Enterprise w/ large team | Consider NestJS |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Framework selection (5 options) | API design (→ api-architect) |
| Architecture routing | Database/ORM (→ data-modeler) |
| Async pattern guidance | TypeScript patterns (→ typescript-expert) |
| Error handling strategy | Performance profiling (→ perf-optimizer) |

**Expert decision skill:** Produces framework decisions and pattern guidance. Does not write code.

---

## Framework Decision Tree (Deterministic)

```
What are you building?
├── Edge / Serverless → Hono (fastest cold starts)
├── High-performance API → Fastify (2-3x faster than Express)
├── Enterprise / Large team → NestJS (structured, DI)
├── Legacy / Max ecosystem → Express
└── Full-stack → Next.js API Routes or tRPC
```

---

## Framework Comparison (Fixed)

| Factor | Hono | Fastify | Express | NestJS |
|--------|------|---------|---------|--------|
| **Best for** | Edge, serverless | Performance | Legacy | Enterprise |
| **Cold start** | Fastest | Fast | Moderate | Moderate |
| **TypeScript** | Native | Excellent | Good | Native |
| **Throughput** | Highest | High | Baseline | Moderate |

---

## Core Principles (Fixed)

| Principle | Enforcement |
|-----------|-------------|
| Async-first | No `*Sync()` methods in production |
| Validate at boundary | All inputs validated before business logic |
| Secrets via env vars | Never hardcode credentials |
| Layered separation | Controllers → Services → Repositories |
| Event loop protection | CPU work → worker threads |
| No `eval()` / `Function()` | Never in production |

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `architecture_decision` | `{"runtime": "nodejs|edge", "framework": "..."}` | `INFO` |
| `framework_selection` | `{"reason": "...", "database": "..."}` | `INFO` |
| `build_verification` | `{"status": "pass|fail", "metrics_met": true}` | `INFO` |

All executions MUST emit the `build_verification` span before reporting completion.

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_TARGET` | Yes | Deployment target not recognized |
| `ERR_UNKNOWN_FRAMEWORK` | Yes | Framework not one of 5 |

**Zero internal retries.** Deterministic; same context = same recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to Express for new projects | Choose framework by deployment target |
| Use sync methods in production | Always use async/await |
| Put business logic in controllers | Use layered architecture |
| Skip input validation | Validate all inputs at boundary |
| Block event loop with CPU work | Use worker threads |
| Hardcode secrets | Use environment variables |
| Ignore IDE warnings/errors | Call `problem-checker` to auto-fix |

---

## Decision Checklist

- [ ] Asked user about stack preference?
- [ ] Chosen framework for THIS context (not default)?
- [ ] Considered deployment target (edge/container/VM)?
- [ ] Planned error handling strategy?
- [ ] Identified input validation points?
- [ ] Considered security requirements?


## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [framework-selection.md](rules/framework-selection.md) | Framework decision criteria | Choosing framework |
| [runtime-modules.md](rules/runtime-modules.md) | Runtime & module system | Module decisions |
| [architecture-patterns.md](rules/architecture-patterns.md) | Architecture patterns | Structuring app |
| [error-handling.md](rules/error-handling.md) | Error handling patterns | Error strategy |
| [async-patterns.md](rules/async-patterns.md) | Async patterns | Async code |
| [validation-security.md](rules/validation-security.md) | Validation & security | Security planning |
| [testing-strategy.md](rules/testing-strategy.md) | Testing patterns | Test planning |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY the file relevant to current decision.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design |
| `data-modeler` | Skill | Database patterns |
| `typescript-expert` | Skill | TypeScript |

---

⚡ PikaKit v3.9.206
