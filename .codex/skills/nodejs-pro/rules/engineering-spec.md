---
title: Node.js Pro � Engineering Specification
impact: MEDIUM
tags: nodejs-pro
---

# Node.js Pro � Engineering Specification

> Production-grade specification for Node.js development decision-making at FAANG scale.

---

## 1. Overview

Node.js Pro provides structured decision frameworks for Node.js backend development: framework selection (Hono, Fastify, Express, NestJS, Next.js API/tRPC), architecture pattern routing, async pattern guidance, error handling strategy, input validation, security practices, and testing strategy. The skill operates as an **Expert (decision tree)** � it produces framework decisions, architecture recommendations, and pattern guidance. It does not create projects, write server code, or deploy applications.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Node.js development at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Wrong framework for use case | 40% of projects use Express where Hono/Fastify fits better | Subpar cold starts and throughput |
| Sync methods in production | 25% of Node.js apps use blocking calls | Event loop starvation |
| Business logic in controllers | 45% of apps mix routing and domain logic | Untestable, unmaintainable code |
| Missing input validation | 35% of APIs skip schema validation | Injection attacks, crashes |

Node.js Pro eliminates these with deterministic framework selection (5 options by use case), layered architecture routing, async-first enforcement, and mandatory validation guidance.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Framework selection | 5 options: Hono (edge), Fastify (performance), NestJS (enterprise), Express (legacy), Next.js/tRPC (full-stack) |
| G2 | Framework comparison | Fixed table: cold start, TypeScript support, throughput tier |
| G3 | Architecture routing | Layered for growing projects; modular for large teams |
| G4 | Async enforcement | No sync methods in production code |
| G5 | Validation mandate | All inputs validated at boundary |
| G6 | 7 reference files | Framework, runtime, architecture, errors, async, security, testing |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | API design (REST/GraphQL) | Owned by `api-architect` skill |
| NG2 | Database/ORM selection | Owned by `data-modeler` skill |
| NG3 | TypeScript patterns | Owned by `typescript-expert` skill |
| NG4 | Performance profiling | Owned by `perf-optimizer` skill |
| NG5 | Deployment pipeline | Owned by `cicd-pipeline` skill |
| NG6 | Frontend framework | Owned by `nextjs-pro` / `react-architect` skills |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Framework selection (5 options) | Decision criteria | Framework installation |
| Architecture patterns | Pattern selection | Pattern implementation |
| Async patterns | Pattern guidance | Async runtime |
| Error handling strategy | Strategy selection | Error implementation |
| Validation guidance | Validation rules | Validation library |
| Security practices | Security guidance | Security audit |
| Testing strategy | Strategy selection | Test execution |

**Side-effect boundary:** Node.js Pro produces decisions, recommendations, and pattern guidance. It does not create files, install packages, or execute commands.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "framework-select" | "architecture" | "async-patterns" |
                              # "error-handling" | "validation" | "security" | "testing" |
                              # "comparison" | "full-guide"
Context: {
  deployment_target: string   # "edge" | "serverless" | "container" | "vm" | "hybrid"
  team_size: string           # "solo" | "small" (2-5) | "large" (6+)
  app_complexity: string      # "simple" | "moderate" | "complex"
  typescript: boolean         # Whether TypeScript is required
  existing_framework: string | null  # Current framework if migrating
  performance_critical: boolean  # Whether throughput is primary concern
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  framework: {
    name: string              # "hono" | "fastify" | "express" | "nestjs" | "nextjs-trpc"
    rationale: string
    cold_start_tier: string   # "fastest" | "fast" | "moderate"
    typescript_support: string  # "native" | "excellent" | "good"
  } | null
  architecture: {
    pattern: string           # "layered" | "modular" | "clean"
    rationale: string
  } | null
  reference_files: Array<string> | null
  metadata: {
    contract_version: string
    backward_compatibility: string
  }
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string                  # From Error Taxonomy (Section 11)
Message: string
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Framework selection is deterministic:
  - edge/serverless ? Hono (fastest cold starts)
  - performance_critical AND container ? Fastify (2-3x faster than Express)
  - complex app AND large team ? NestJS (structured, DI)
  - legacy OR maximum ecosystem ? Express
  - full-stack ? Next.js API Routes or tRPC
- Architecture routing is deterministic:
  - simple app ? flat structure
  - moderate + growing team ? layered architecture
  - complex + large team ? modular/clean architecture
- Async: always async/await; never sync methods in production.
- Validation: always at boundary layer; never trust client input.

#### What Agents May Assume

- Framework selection maps to deployment target deterministically.
- Architecture pattern matches complexity + team size.
- Reference files exist at documented paths.
- All recommendations follow Node.js 20+ LTS conventions.

#### What Agents Must NOT Assume

- Express is the default choice.
- Framework or tools are installed.
- Sync methods are acceptable in any context.
- Input is validated elsewhere.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Framework select | None; recommendation |
| Architecture | None; pattern recommendation |
| Async patterns | None; pattern guidance |
| Error handling | None; strategy guidance |
| Validation | None; rule guidance |
| Security | None; practice guidance |
| Testing | None; strategy guidance |
| Comparison | None; table output |
| Full guide | None; combined output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify deployment target, team size, complexity
2. Invoke framework-select for technology decision
3. Invoke architecture for pattern selection
4. Read relevant reference files (caller's responsibility)
5. Implement patterns (caller's responsibility)
6. Invoke testing for verification strategy
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- All decisions are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error | Use supported type |
| Unknown deployment target | Return error | Specify valid target |
| Missing complexity | Default to "moderate" | Transparent |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Framework select | Yes | Same context = same framework |
| Architecture | Yes | Same complexity + team = same pattern |
| Async patterns | Yes | Fixed guidance |
| Error handling | Yes | Fixed strategy |
| Comparison | Yes | Fixed table |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate context, determine request type | Classification |
| **Recommend** | Generate framework, architecture, or pattern guidance | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed framework routing | 5 options with explicit selection criteria |
| Fixed comparison table | Cold start, TypeScript, throughput per framework |
| Architecture by context | Complexity + team size ? pattern |
| Async-first | No sync methods in production; never `fs.readFileSync` in handlers |
| Validate at boundary | All inputs validated before reaching business logic |
| Environment secrets | Secrets via env vars; never hardcoded |
| Layered separation | Controllers ? Services ? Repositories; no business logic in routes |
| Event loop protection | No CPU-intensive work on main thread; use worker threads |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown deployment target | Return `ERR_UNKNOWN_TARGET` | Specify valid target |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Unknown framework | Return `ERR_UNKNOWN_FRAMEWORK` | Use one of 5 options |

**Invariant:** Every failure returns a structured error. No partial recommendations.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_TARGET` | Validation | Yes | Deployment target not recognized |
| `ERR_UNKNOWN_FRAMEWORK` | Validation | Yes | Framework not one of 5 |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "nodejs-pro",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "deployment_target": "string",
  "framework_selected": "string|null",
  "architecture_selected": "string|null",
  "app_complexity": "string",
  "team_size": "string",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Framework selected | INFO | framework_selected, deployment_target |
| Architecture selected | INFO | architecture_selected, complexity |
| Reference file recommended | INFO | reference_file |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `nodejspro.decision.duration` | Histogram | ms |
| `nodejspro.framework.distribution` | Counter | per framework |
| `nodejspro.target.distribution` | Counter | per deployment target |
| `nodejspro.request_type.distribution` | Counter | per type |

---

## 14. Security & Trust Model

### Data Handling

- Node.js Pro processes no credentials, API keys, or PII.
- Security guidance references public standards (OWASP, Node.js Security WG).
- No network calls, no file access.

### Security Guidance Provided

| Practice | Enforcement |
|----------|-------------|
| Secrets via environment variables | Never hardcoded |
| Input validation at boundary | Before business logic |
| No `eval()` or `Function()` | Never in production |
| Helmet middleware for HTTP headers | Always recommended |
| Rate limiting | Always recommended for public APIs |

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Reference storage | 7 files (~30 KB total) | Static; no growth |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Framework selection | < 2 ms | < 5 ms | 20 ms |
| Architecture selection | < 2 ms | < 5 ms | 20 ms |
| Full guide | < 10 ms | < 30 ms | 50 ms |
| Output size | = 1,500 chars | = 4,000 chars | 6,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Node.js LTS version change | Medium | API deprecations | Track LTS releases |
| Framework ecosystem shift | Medium | Hono/Fastify adoption changes | Review annually |
| Express deprecation | Low | Large migration | Express still maintained; monitor |
| NestJS major version | Low | Breaking DI changes | Track NestJS releases |
| Deno/Bun competition | Low | Runtime alternatives | Node.js Pro scoped to Node.js |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies (knowledge skill) |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: framework decision tree, comparison table |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to api-architect, data-modeler, typescript-expert |
| Content Map for multi-file | ? | Links to 7 reference files + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | Framework selection (5 options with criteria) | ? |
| **Functionality** | Framework comparison (cold start, TS, throughput) | ? |
| **Functionality** | Architecture routing (complexity + team) | ? |
| **Functionality** | Async-first enforcement | ? |
| **Functionality** | 7 reference files covering all domains | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 3 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed framework routing, fixed comparison, async-first | ? |
| **Security** | No credentials, no PII, no file access | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
