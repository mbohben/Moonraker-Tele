---
name: api-architect
description: >-
  API design patterns for REST, GraphQL, and tRPC services.
  Use when designing endpoints, versioning APIs, or choosing API architecture.
  NOT for code implementation (use nodejs-pro/python-pro) or database schema (use data-modeler).
metadata:
  author: pikakit
  version: "3.9.206"
  category: architecture
  triggers: ["API design", "REST", "GraphQL", "tRPC", "endpoint", "versioning"]
  coordinates_with: ["data-modeler", "security-scanner", "auth-patterns", "nodejs-pro"]
  success_metrics: ["0 breaking API changes without explicit version bump", "100% compliant with OWASP API Top 10"]
---

# API Architect

> Context-aware API design decisions. Learn to THINK about API style for THIS project, not default to REST.

---

## Prerequisites

**Required:** None — API Architect is a knowledge-based skill with no external dependencies.

**Optional:**

---

## When to Use

| Situation | Reference |
|-----------|-----------|
| Choosing API style (REST/GraphQL/tRPC) | `rules/api-style.md` |
| Designing REST endpoints | `rules/rest.md` |
| Response format / error envelope | `rules/response.md` |
| GraphQL schema design | `rules/graphql.md` |
| tRPC for TypeScript fullstack | `rules/trpc.md` |
| API versioning strategy | `rules/versioning.md` |
| Auth pattern selection | `rules/auth.md` |
| Rate limiting strategy | `rules/rate-limiting.md` |
| OpenAPI documentation | `rules/documentation.md` |
| OWASP API security audit | `rules/security-testing.md` |
| Architecture review, contracts | `rules/engineering-spec.md` |

**Selective Reading Rule:** Read ONLY the file matching the current request. Do not read all files.

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| API style selection (REST/GraphQL/tRPC) | API implementation code (→ backend-specialist) |
| Response format and envelope design | Database schema (→ data-modeler) |
| Versioning strategy selection | Auth implementation (→ auth-patterns) |
| Rate limiting pattern selection | Security pen testing (→ security-scanner) |
| OWASP API Top 10 checklist | Infrastructure / deployment (→ server-ops) |
| OpenAPI documentation standards | Client-side consumption |

**Pure decision skill:** Produces design documents and specifications. Zero code generation, zero network calls.

---

## Execution Model — 4-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate request type and project context | Validated input or error |
| **Evaluate** | Traverse decision tree (project_type → consumers → complexity → scale) | Selected pattern |
| **Enrich** | Attach checklist, anti-patterns, related decisions | Complete decision |
| **Emit** | Return structured output with rationale | Decision with metadata |

All phases synchronous. Decision tree ordering is fixed and deterministic.

---

## API Style Decision Tree

| Project Context | Recommended Style | Rationale |
|----------------|-------------------|-----------|
| TypeScript monorepo, internal consumers only | **tRPC** | End-to-end type safety, zero serialization overhead |
| Complex relational data, multiple consumer types | **GraphQL** | Client-specific queries, no over-fetching |
| Public API, third-party consumers | **REST** | Widest compatibility, cacheable, well-understood |
| Simple CRUD, single consumer | **REST** | Minimal complexity, HTTP semantics sufficient |
| Real-time data requirements | **GraphQL** (subscriptions) or **WebSocket** | Native subscription support |

**Constraint:** `existing_api` context field takes precedence — avoid mixing styles unless justified.

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not one of the 8 supported types |
| `ERR_MISSING_CONTEXT` | Yes | Required context field is null or empty |
| `ERR_CONSTRAINT_CONFLICT` | Yes | Contradictory constraints in input |
| `ERR_INVALID_CONSUMER` | Yes | Consumer type not recognized |
| `ERR_REFERENCE_NOT_FOUND` | No | Rule file missing from rules/ directory |
| `ERR_VALIDATOR_FAILED` | Yes | api_validator.ts exited with non-zero code |
| `ERR_INVALID_SCALE` | No | Scale not one of: prototype, startup, growth, enterprise |

**Zero internal retries.** Deterministic output; same context = same decision.

---

## Decision Checklist

Before designing an API, confirm:

- [ ] **Consumers identified?** (web-spa, mobile, third-party, internal-service, cli)
- [ ] **API style chosen for THIS context?** (REST/GraphQL/tRPC — not defaulted)
- [ ] **Response envelope format defined?** (consistent across all endpoints)
- [ ] **Versioning strategy selected?** (URI/Header/Query — before first endpoint)
- [ ] **Auth pattern selected?** (JWT/OAuth/Passkey/API Key)
- [ ] **Rate limiting strategy defined?** (token bucket/sliding window)
- [ ] **OpenAPI documentation approach set?**
- [ ] **OWASP API Top 10 reviewed?**

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to REST for every project | Choose API style based on project context |
| Use verbs in REST endpoints (`/getUsers`) | Use resource nouns (`/users`) with HTTP methods |
| Different response formats per endpoint | Define one envelope pattern, apply uniformly |
| Expose internal error details to clients | Map internal errors to safe client-facing codes |
| Skip rate limiting on public APIs | Define rate limits before deployment |
| Version after breaking changes occur | Define versioning strategy before first endpoint |

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [api-style.md](rules/api-style.md) | REST vs GraphQL vs tRPC decision tree | Choosing API type |
| [rest.md](rules/rest.md) | Resource naming, HTTP methods, status codes | REST API design |
| [response.md](rules/response.md) | Envelope pattern, error format, pagination | Response structure |
| [graphql.md](rules/graphql.md) | Schema design, security, when to use | GraphQL consideration |
| [trpc.md](rules/trpc.md) | TypeScript monorepo, type safety | TS fullstack projects |
| [versioning.md](rules/versioning.md) | URI/Header/Query versioning strategies | API evolution |
| [auth.md](rules/auth.md) | JWT, OAuth, Passkey, API Keys | Auth selection |
| [rate-limiting.md](rules/rate-limiting.md) | Token bucket, sliding window | API protection |
| [documentation.md](rules/documentation.md) | OpenAPI/Swagger standards | API documentation |
| [security-testing.md](rules/security-testing.md) | OWASP API Top 10, auth/authz testing | Security audits |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review |

---

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `data-modeler` | Skill | Database schema design for API data |
| `security-scanner` | Skill | Security vulnerability scanning |
| `auth-patterns` | Skill | Authentication implementation patterns |
| `nodejs-pro` | Skill | Node.js API implementation |
| `/api` | Workflow | Full API build workflow |

---

⚡ PikaKit v3.9.206
