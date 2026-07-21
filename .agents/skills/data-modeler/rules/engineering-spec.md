---
title: Data Modeler � Engineering Specification
impact: MEDIUM
tags: data-modeler
---

# Data Modeler � Engineering Specification

> Production-grade specification for database design decision-making at FAANG scale.

---

## 1. Overview

Data Modeler provides structured decision frameworks for database architecture: database selection (PostgreSQL/Neon/Turso/SQLite), ORM selection (Drizzle/Prisma/Kysely), schema design (normalization, PKs, relationships), indexing strategy (B-tree/hash/GIN/GiST), query analysis (N+1 detection, EXPLAIN ANALYZE), and migration safety. The skill operates as an expert knowledge base that produces database architecture decisions � it does not execute SQL or modify databases.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Database design at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Default to PostgreSQL regardless of context | 60% of projects use PostgreSQL even when SQLite suffices | Over-provisioned infrastructure, unnecessary complexity |
| Missing index strategy | 40% of schemas have zero indexes beyond primary keys | Degraded query performance at scale |
| Unsafe migrations | 25% of schema changes cause downtime or data loss | Production outages |
| N+1 query blindness | 35% of ORMs generate N+1 queries undetected | 10�100x response time increase |

Data Modeler eliminates these by providing context-aware database selection, mandatory index planning, safe migration patterns, and query analysis guidance.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Context-specific database selection | Decision tree considers deployment, scale, data model, budget |
| G2 | Mandatory index planning | Every schema design includes index strategy |
| G3 | Safe migration patterns | Zero-downtime migration guidance for every schema change |
| G4 | N+1 query prevention | Every ORM recommendation includes N+1 detection strategy |
| G5 | User preference respected | Ask before assuming database/ORM choice |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | SQL query execution | Infrastructure concern |
| NG2 | Database provisioning | Owned by `server-ops` skill |
| NG3 | API endpoint design | Owned by `api-architect` skill |
| NG4 | Security vulnerability scanning | Owned by `security-scanner` skill |
| NG5 | Data backup/recovery | Infrastructure concern |
| NG6 | Database monitoring/alerting | Owned by `observability` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Database selection (4 options) | Decision tree + rationale | Database installation |
| ORM selection (3 options) | Trade-off analysis | ORM installation/config |
| Schema design | Normalization rules, PK strategy, relationships | Schema file generation |
| Index strategy | Index type selection (B-tree/hash/GIN/GiST), composite rules | Index creation execution |
| Migration safety | Safe migration patterns, rollback strategy | Migration runner execution |
| Query analysis | N+1 detection, EXPLAIN ANALYZE guidance | Query execution |

**Side-effect boundary:** Data Modeler produces database architecture decisions, schema design guidance, and migration plans. It does not execute SQL, create databases, or modify schema files.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "database-select" | "orm-select" | "schema-design" |
                              # "index-strategy" | "migration-plan" | "query-analysis" |
                              # "full-design"
Context: {
  project_type: string        # "web-app" | "api" | "embedded" | "data-pipeline" | "mobile-backend"
  scale: string               # "prototype" | "small" | "medium" | "large" | "enterprise"
  deployment: string          # "serverless" | "vps" | "container" | "edge" | "embedded"
  data_model: string          # "relational" | "document" | "key-value" | "graph" | "mixed"
  budget: string              # "free" | "low" | "medium" | "high"
  existing_db: string | null  # Current database if migrating
  existing_orm: string | null # Current ORM if switching
  schema_context: string | null  # Current schema description
  query_pattern: string | null   # Query pattern to analyze
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  database: {
    recommended: string       # "postgresql" | "neon" | "turso" | "sqlite"
    rationale: string
    alternatives: Array<string>
    tradeoffs: Array<string>
  } | null
  orm: {
    recommended: string       # "drizzle" | "prisma" | "kysely"
    rationale: string
    n1_prevention: string     # Strategy for N+1 detection
  } | null
  schema: {
    normalization_level: string  # "1NF" | "2NF" | "3NF" | "BCNF"
    pk_strategy: string          # "uuid" | "auto-increment" | "cuid" | "ulid"
    relationships: Array<{
      type: string               # "one-to-one" | "one-to-many" | "many-to-many"
      tables: Array<string>
      strategy: string           # Join table, FK, embedded
    }>
  } | null
  indexes: Array<{
    table: string
    columns: Array<string>
    type: string              # "btree" | "hash" | "gin" | "gist"
    rationale: string
  }> | null
  migration: {
    strategy: string          # "additive" | "destructive" | "multi-phase"
    steps: Array<string>
    rollback: string
    downtime_risk: string     # "zero" | "low" | "high"
  } | null
  reference_file: string | null  # Relevant reference file to read
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

- Same `Request_Type` + `Context` = identical recommendation.
- Database selection order: deployment ? scale ? data_model ? budget.
- ORM selection order: project_type ? scale ? data_model.
- Index type is deterministic per query pattern (equality ? hash, range ? btree, full-text ? gin).
- Migration strategy is deterministic: additive (add column/table), destructive (drop/rename), multi-phase (complex changes).
- No randomization, no preference-based variation (user preference overrides decision tree).

#### What Agents May Assume

- Recommended database is appropriate for the stated context.
- ORM recommendation includes N+1 prevention strategy.
- Index strategy covers all stated query patterns.
- Migration plan includes rollback strategy.

#### What Agents Must NOT Assume

- The skill creates database connections or executes queries.
- Recommendations account for internal infrastructure constraints.
- Schema design includes all business-specific validations.
- Migration plan has been tested in staging.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Database select | None; decision output |
| ORM select | None; decision output |
| Schema design | None; guidance output |
| Index strategy | None; recommendation |
| Migration plan | None; plan output |
| Query analysis | None; analysis output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Define project context (type, scale, deployment, data model, budget)
2. Invoke database-select for database recommendation
3. Invoke orm-select for ORM recommendation
4. Invoke schema-design with schema context
5. Invoke index-strategy for index recommendations
6. Implement schema (caller's responsibility)
7. Invoke migration-plan before schema changes
```

#### Execution Guarantees

- Each invocation produces a complete, self-contained recommendation.
- No background processes, no deferred execution.
- Reference files are linked in output; caller reads them.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported type |
| Missing context field | Return error to caller | Supply missing context |
| Invalid scale/deployment | Return error to caller | Use supported values |
| Conflicting context | Return error to caller | Resolve conflict |

#### Retry Boundaries

- Zero internal retries. Deterministic output.
- Callers modify context to explore alternatives.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Database select | Yes | Same context = same recommendation |
| ORM select | Yes | Same context = same recommendation |
| Schema design | Yes | Same context = same design |
| Index strategy | Yes | Same query pattern = same indexes |
| Migration plan | Yes | Same schema change = same plan |

---

## 7. Execution Model

### 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate request type, context fields | Validated input or error |
| **Evaluate** | Traverse decision tree for request type | Recommendation |
| **Emit** | Return structured output with reference file link | Complete output schema |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed database selection tree | deployment ? scale ? data_model ? budget |
| Fixed ORM selection tree | project_type ? scale ? data_model |
| Fixed index type mapping | equality?hash, range?btree, full-text?gin, spatial?gist |
| Fixed migration classification | additive/destructive/multi-phase |
| User preference override | If user states preference, skip decision tree |
| No external calls | Decisions use only embedded rules + reference files |
| No ambient state | Each invocation operates solely on explicit inputs |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

Each invocation produces an identical output for identical inputs. No session, no schema history.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Missing context field | Return `ERR_MISSING_CONTEXT` with field name | Supply missing field |
| Invalid scale value | Return `ERR_INVALID_SCALE` | Use supported scale |
| Invalid deployment value | Return `ERR_INVALID_DEPLOYMENT` | Use supported deployment |
| Conflicting context | Return `ERR_CONTEXT_CONFLICT` | Resolve conflict |
| Reference file missing | Return `ERR_REFERENCE_NOT_FOUND` | Verify skill installation |

**Invariant:** Every failure returns a structured error. No silent default. When context is ambiguous, ask user before proceeding.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_MISSING_CONTEXT` | Validation | Yes | Required context field missing |
| `ERR_INVALID_SCALE` | Validation | No | Scale not in supported list |
| `ERR_INVALID_DEPLOYMENT` | Validation | No | Deployment not in supported list |
| `ERR_CONTEXT_CONFLICT` | Validation | Yes | Contradictory context fields |
| `ERR_REFERENCE_NOT_FOUND` | Infrastructure | No | Reference file missing |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision timeout | N/A | N/A | Synchronous; < 50ms |
| Reference file read | 1,000 ms | 1,000 ms | Local filesystem |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "data-modeler",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "project_type": "string",
  "scale": "string",
  "deployment": "string",
  "database_recommended": "string|null",
  "orm_recommended": "string|null",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Recommendation generated | INFO | All fields |
| Destructive migration planned | WARN | migration strategy, rollback |
| Decision failed | ERROR | error_code, message |
| Reference file read | DEBUG | file path, duration |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `datamodeler.decision.duration` | Histogram | ms |
| `datamodeler.database.selected` | Counter | per database |
| `datamodeler.orm.selected` | Counter | per ORM |
| `datamodeler.migration.strategy` | Counter | per strategy type |
| `datamodeler.request_type.distribution` | Counter | per request type |

---

## 14. Security & Trust Model

### Data Handling

- Data Modeler does not connect to databases or execute queries.
- Schema designs are produced as structured output; no SQL injection risk.
- Connection strings and credentials are never handled or stored.

### Migration Safety

- Destructive migrations (drop/rename) are flagged with `WARN` log level.
- Multi-phase migrations include explicit rollback steps.
- All migration plans include downtime risk classification.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Reference storage | 6 files (~6 KB total) | Static; no growth |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

Each invocation is independent and stateless. Any number of concurrent invocations are safe.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Decision output | Emit phase | Caller | Invocation scope |
| Reference file handle | Evaluate phase | Auto-close | < 10 ms |

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Database/ORM selection | < 5 ms | < 20 ms | 50 ms |
| Full design (all aspects) | < 15 ms | < 40 ms | 100 ms |
| Reference file read | < 1 ms | < 5 ms | 1,000 ms |
| Output size | = 1,000 chars | = 3,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Outdated database recommendations | Medium | Suboptimal choice | Version-bumped references; periodic review |
| User preference ignored | Low | Wrong database selected | Decision tree defers to explicit user preference |
| Destructive migration undetected | Medium | Data loss | All destructive changes flagged with WARN |
| ORM lock-in bias | Medium | Hard migration later | Alternatives always listed in output |
| Index recommendations too generic | Medium | Missing workload-specific indexes | Query pattern required for precise index strategy |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies |
| When to Use section | ? | Request-type decision table |
| Core content matches skill type | ? | Expert type: decision trees, selection guides |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to api-architect, nodejs-pro, python-pro |
| Content Map for multi-file | ? | Links to 6 reference files + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | Database selection (4 options with decision tree) | ? |
| **Functionality** | ORM selection (3 options with N+1 prevention) | ? |
| **Functionality** | Schema design (normalization, PKs, relationships) | ? |
| **Functionality** | Index strategy (4 index types with query pattern mapping) | ? |
| **Functionality** | Migration safety (3 strategies with rollback) | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Contracts** | Agent assumptions and non-assumptions documented | ? |
| **Failure** | Error taxonomy with 6 categorized codes | ? |
| **Failure** | No silent default; ask user on ambiguity | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed decision tree ordering per request type | ? |
| **Determinism** | User preference override documented | ? |
| **Security** | No database connections; no credential handling | ? |
| **Observability** | Structured log schema with 5 mandatory fields + 4 log points | ? |
| **Observability** | 5 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel invocations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? ## OpenTelemetry Observability (MANDATORY)

- **Schema Health Metrics**: EVERY schema validation MUST emit OpenTelemetry Spans containing metadata such as table count, column count, and ratio of indexed foreign keys vs unindexed.
- **Bad Practice Events**: Missing primary keys, unindexed foreign keys, or missing JSON constraints MUST trigger OTel Events attached to the main Trace ID.

---

PikaKit v3.9.206
