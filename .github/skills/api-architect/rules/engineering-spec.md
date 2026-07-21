---
title: API Architect — Engineering Specification
impact: MEDIUM
tags: api-architect
---

# API Architect — Engineering Specification

> Production-grade specification for API design decision-making and pattern selection at FAANG scale.

---

## 1. Overview

API Architect provides structured decision frameworks for API design: style selection (REST vs GraphQL vs tRPC), response formats, versioning strategies, authentication patterns, rate limiting, and documentation standards. The skill operates as an expert knowledge base that produces architectural decisions and API specifications, not runtime code.

The skill codifies API design into deterministic decision trees backed by 10 reference documents covering style selection, REST patterns, GraphQL, tRPC, response formats, versioning, auth, rate limiting, documentation, and security testing.

---

## 2. Problem Statement

API design at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Wrong API style selection | REST chosen for 100% of projects regardless of context | Unnecessary complexity for internal TS monorepos; insufficient for complex data graphs |
| Inconsistent response formats | Different envelope patterns across endpoints within same API | Client-side parsing failures, increased integration cost |
| No versioning strategy | Breaking changes deployed without versioning | Client breakage, forced upgrades, SLA violations |
| Security gaps in API design | OWASP API Top 10 violations in 60%+ of first-design APIs | Vulnerability exposure, compliance failures |

API Architect eliminates these by providing context-aware decision trees that produce documented, justified API design choices.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Context-aware style selection | Decision tree produces one of REST/GraphQL/tRPC based on ≤ 5 input criteria |
| G2 | Consistent response format | Single envelope pattern per API; format documented before first endpoint |
| G3 | Versioning from day one | Versioning strategy defined and documented before API implementation begins |
| G4 | Security-first design | OWASP API Top 10 checklist completed before API goes to production |
| G5 | Decision traceability | Every design choice includes rationale that references project context |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | API implementation / code generation | This skill produces design decisions, not code; implementation is `backend-specialist` territory |
| NG2 | Runtime API validation | Owned by `scripts/api_validator.ts`; SKILL.md defines design-time patterns |
| NG3 | Database schema design | Owned by `data-modeler` skill |
| NG4 | Authentication implementation | Owned by `auth-patterns` skill; this skill selects auth strategy |
| NG5 | Infrastructure / deployment | Owned by `server-ops` and `cicd-pipeline` skills |
| NG6 | Client-side API consumption | Out of scope; this skill designs the API surface, not its consumers |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| API style selection | REST/GraphQL/tRPC decision tree | Implementation framework selection |
| Response format design | Envelope pattern, error format, pagination | Serialization libraries |
| Versioning strategy | URI/Header/Query versioning decision | Version deployment mechanics |
| Auth pattern selection | JWT/OAuth/Passkey/API Key decision | Auth implementation (→ auth-patterns) |
| Rate limiting strategy | Token bucket/sliding window selection | Rate limiter implementation |
| API documentation | OpenAPI/Swagger structure standards | Doc hosting/rendering |
| Security design | OWASP API Top 10 checklist | Penetration testing execution (→ security-scanner) |

**Side-effect boundary:** API Architect produces design documents, decision records, and API specifications. It does not create API endpoints, modify server configurations, or make network requests.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string      # One of: "style-selection" | "endpoint-design" | "response-format" |
                          #         "versioning" | "auth-selection" | "rate-limiting" |
                          #         "documentation" | "security-audit" | "full-design"
Context: {
  project_type: string    # "monorepo-ts" | "microservice" | "public-api" | "internal-api" | "bff"
  consumers: Array<string> # ["web-spa", "mobile", "third-party", "internal-service", "cli"]
  data_complexity: string  # "simple-crud" | "relational" | "graph" | "real-time"
  team_expertise: string   # "typescript-fullstack" | "polyglot" | "backend-only"
  scale: string           # "prototype" | "startup" | "growth" | "enterprise"
  existing_api: string | null  # Existing API style if evolving, null if greenfield
  constraints: Array<string> | null  # ["no-graphql", "must-version", "public-facing"]
}
contract_version: string  # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  decision: string         # The selected pattern/approach
  rationale: string        # Context-specific justification (references input criteria)
  reference_file: string   # Path to the detailed reference document
  checklist: Array<string> # Action items before implementation
  anti_patterns: Array<string>  # Context-specific things to avoid
  related_decisions: Array<{topic: string, reference: string}>  # Adjacent decisions to make
  metadata: {
    request_type: string
    context_hash: string   # Hash of input context for reproducibility
    version: string        # Skill version
    contract_version: string    # "2.0.0"
    backward_compatibility: string  # "breaking"
  }
}
Error: ErrorSchema | null
```

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

#### Error Schema

```
Code: string        # From Error Taxonomy (Section 11)
Message: string     # Human-readable, single line
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Same `Request_Type` + `Context` = identical `decision` + `rationale` output.
- Decision trees follow fixed evaluation order (project_type → consumers → data_complexity → team_expertise → scale).
- Reference file selection is deterministic based on request_type.
- No randomization, no A/B selection, no heuristic weighting.

#### What Agents May Assume

- Output `decision` is valid for the given `Context` and follows industry standards.
- `reference_file` points to a file that exists in the skill's `rules/` directory.
- `checklist` items are actionable and ordered by priority.
- The skill is stateless; no prior invocation affects current output.

#### What Agents Must NOT Assume

- The decision is the only valid choice (multiple valid API styles may exist for a given context).
- The decision accounts for undisclosed constraints (only explicit `Context` inputs affect output).
- Implementation details are included (the skill produces design decisions, not code).
- Security audit output replaces a full security review (it covers OWASP API Top 10, not exhaustive pen testing).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Style selection | None; pure decision output |
| Endpoint design | None; specification output |
| Security audit | None; checklist output |
| Validator script | Read-only filesystem scan; no modifications |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Define project context (type, consumers, complexity, scale)
2. Select request type (style-selection → response-format → versioning → auth → documentation)
3. Receive decision with rationale and checklist
4. Review and apply decision (caller's responsibility)
5. Run api_validator.ts for implementation validation (optional)
6. Repeat for adjacent decisions referenced in related_decisions
```

**Recommended ordering:** style-selection → endpoint-design → response-format → versioning → auth-selection → rate-limiting → documentation → security-audit.

#### Execution Guarantees

- Each invocation produces a complete, self-contained decision.
- No background processes, no deferred execution.
- Output includes all necessary context for the caller to act without re-invoking.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported request type |
| Missing context field | Return error to caller | Supply missing context |
| Conflicting constraints | Return error to caller | Resolve constraint conflict |
| Reference file missing | Return error to caller | Verify skill installation |

Failures are isolated to the current invocation. No state carries between invocations.

#### Retry Boundaries

- Zero internal retries. Deterministic output makes retrying identical inputs meaningless.
- Callers should modify `Context` between invocations to explore alternative decisions.

#### Isolation Model

- Each invocation is stateless and independent.
- No shared state between invocations, sessions, or agents.
- Reference files in `rules/` are read-only resources.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Decision generation | Yes | Same context = same decision |
| Reference lookup | Yes | Read-only, no mutation |
| Validator script | Yes | Read-only filesystem scan |

---

## 7. Execution Model

### 4-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate request type and context | Validated input or error |
| **Evaluate** | Traverse decision tree for request type | Selected pattern with rationale |
| **Enrich** | Attach checklist, anti-patterns, related decisions | Complete decision package |
| **Emit** | Return structured output with metadata | Complete output schema |

All phases execute synchronously in a single invocation. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed decision tree ordering | project_type → consumers → data_complexity → team_expertise → scale |
| No external calls | Decisions use only local reference files and input context |
| No ambient state | Each invocation operates solely on explicit inputs |
| No randomization | Decision trees are deterministic if-then-else chains |
| Reproducible output | Input context hash echoed in output for audit trail |

---

## 9. State & Idempotency Model

### State Machine

```
States: IDLE (single state — skill is stateless)
Transitions: None — each invocation is independent
```

API Architect maintains zero persistent state. Every invocation starts from a clean state. Invoking N times with identical inputs produces N identical outputs.

### Decision Versioning

- Decision trees are versioned via `metadata.version` in SKILL.md frontmatter.
- Reference file changes that alter decision outcomes require a version bump.
- Callers can reference specific versions for decision auditability.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported request type |
| Missing context field | Return `ERR_MISSING_CONTEXT` with field name | Supply missing field |
| Conflicting constraints | Return `ERR_CONSTRAINT_CONFLICT` with conflicting items | Resolve conflict |
| Invalid consumer type | Return `ERR_INVALID_CONSUMER` | Use supported consumer type |
| Reference file missing | Return `ERR_REFERENCE_NOT_FOUND` | Verify skill installation |
| Validator script failure | Return `ERR_VALIDATOR_FAILED` with exit code | Check project path |

**Invariant:** Every failure returns a structured error. No invocation fails silently or returns partial decisions.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not one of the 8 supported types |
| `ERR_MISSING_CONTEXT` | Validation | Yes | Required context field is null or empty |
| `ERR_CONSTRAINT_CONFLICT` | Validation | Yes | Two constraints contradict each other |
| `ERR_INVALID_CONSUMER` | Validation | Yes | Consumer type not recognized |
| `ERR_REFERENCE_NOT_FOUND` | Infrastructure | No | Reference file missing from rules/ directory |
| `ERR_VALIDATOR_FAILED` | Runtime | Yes | api_validator.ts exited with non-zero code |
| `ERR_INVALID_SCALE` | Validation | No | Scale value not one of: prototype, startup, growth, enterprise |

---

## 12. Timeout & Retry Policy

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Decision generation timeout | N/A | Synchronous decision tree traversal; completes in < 50ms |
| Internal retries | Zero | Deterministic output makes retries meaningless |
| Validator script timeout | 30,000 ms | Filesystem scan; fail if project is inaccessible |
| Reference file read timeout | 1,000 ms | Local filesystem; fail immediately if inaccessible |

**Retry policy:** Zero internal retries. Callers should modify context between invocations to explore alternatives.

---

## 13. Observability & Logging Schema

### OpenTelemetry Integration (MANDATORY)

- **Distributed Tracing**: EVERY API endpoint designed via this skill MUST propagate tracing headers (e.g., X-B3-TraceId or W3C 	raceparent).
- **Telemetry Emission**: The pi_validator.js script MUST emit traces via OpenTelemetry SDK during its execution.
- **Log Correlation**: All JSON outputs from the validation layer MUST contain the current 	race_id.


### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "api-architect",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "decision": "string",
  "context_hash": "string",
  "status": "success|error",
  "error_code": "string|null",
  "reference_files_read": ["string"],
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Decision generated | INFO | All fields |
| Decision failed | ERROR | All fields + error_code |
| Reference file read | DEBUG | file path, read duration |
| Constraint conflict detected | WARN | conflicting constraints |
| Validator script executed | INFO | project_path, exit_code, duration |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `api.decision.duration` | Histogram | ms |
| `api.decision.error_rate` | Counter | per error_code |
| `api.request_type.usage` | Counter | per request_type |
| `api.style.selected` | Counter | per style (REST/GraphQL/tRPC) |
| `api.validator.duration` | Histogram | ms |
| `api.validator.pass_rate` | Counter | pass/fail |

---

## 14. Security & Trust Model

### Design-Time Security

- API Architect enforces OWASP API Top 10 awareness through the `security-audit` request type.
- Security checklist is generated before API implementation, not after.
- Auth pattern selection references `rules/auth.md` for current industry standards.

### Credential Handling

- API Architect does not store, process, or transmit credentials.
- Auth pattern selection produces strategy recommendations, not credential configurations.

### Reference Integrity

- Reference files in `rules/` are read-only resources.
- Modifications require a version bump in SKILL.md frontmatter.
- No runtime code injection; reference files are static markdown, not executable.

### Input Sanitization

- Context parameters are used for decision tree traversal, not code execution.
- No eval, no template injection, no dynamic code generation from inputs.

### Multi-Tenant Boundaries

- Each invocation is stateless; no data persists between invocations.
- No invocation can access context or outputs from another invocation.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree traversal | Completes in < 50ms; scales linearly with CPU |
| Concurrency | Stateless invocations | Unlimited parallel invocations |
| Reference storage | 10 rule files (~12 KB total) | Static files; no growth concern |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls (except validator against local filesystem) | No external dependency |

### Capacity Planning

| Metric | Per Invocation | Per Node |
|--------|---------------|----------|
| CPU | < 10 ms computation | 100,000+ invocations/second |
| Memory | < 1 MB | Bound only by concurrent invocations |
| Disk I/O | 1–2 rule file reads (~1–3 KB each) | Cached by OS after first read |
| Network | Zero | Zero |

---

## 16. Concurrency Model

| Scope | Model | Behavior |
|-------|-------|----------|
| Within invocation | Sequential | Classify → Evaluate → Enrich → Emit |
| Across invocations | Fully parallel | No shared state, no coordination |
| Reference access | Read-only shared | Multiple concurrent reads safe |
| Validator script | Isolated per invocation | Each run scans independently |

**No undefined behavior:** Stateless skill with read-only resource access; any concurrency level is safe.

---

## 17. Resource Lifecycle Management

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Decision output | Emit phase | Caller (after consumption) | Invocation scope |
| Rule file handle | Evaluate phase | Auto-close after read | < 10 ms |
| Validator process | Caller (script invocation) | Process exit | 30,000 ms max |
| Input context | Caller | Invocation completion | Invocation scope |

**Leak prevention:** All resources scoped to single invocation. Validator script is a separate process with its own lifecycle.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Decision generation | < 5 ms | < 20 ms | 50 ms |
| Rule file read | < 1 ms | < 5 ms | 1,000 ms |
| Full design (8 request types) | < 40 ms | < 160 ms | 400 ms |
| Validator script execution | < 5,000 ms | < 15,000 ms | 30,000 ms |
| Output decision size | ≤ 500 chars | ≤ 2,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Decision tree staleness | Medium | Recommends outdated patterns | Version bumps with periodic review; rules/ files track dates |
| Context under-specification | High | Generic decision instead of context-specific | `ERR_MISSING_CONTEXT` for required fields; checklist prompts for common gaps |
| Over-reliance on single decision | Medium | Team skips alternative evaluation | Output includes `related_decisions` to prompt adjacent thinking |
| Validator script false positives | Low | Flags correct implementations | Validator results are advisory; caller makes final judgment |
| Rule file conflicts | Low | Contradictory guidance across files | Each file owns a single concern; cross-references are explicit |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines; details in rules/ |
| Prerequisites documented | ✅ | No external dependencies |
| When to Use section | ✅ | Request-type-based decision matrix |
| Quick Reference | ✅ | Decision checklist and content map |
| Core content matches skill type | ✅ | Expert type: decision trees, checklists |
| Troubleshooting section | ✅ | Anti-patterns table |
| Related section | ✅ | Cross-links to data-modeler, security-scanner, auth-patterns |
| Content Map for multi-file | ✅ | Links to 10 rule files + engineering-spec.md |
| Scripts documented | ✅ | api_validator.ts with command example |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 8 request types specified | ✅ |
| **Functionality** | 3 API styles (REST/GraphQL/tRPC) with decision tree | ✅ |
| **Functionality** | 10 reference files covering all API design concerns | ✅ |
| **Contracts** | Input/output/error schemas defined | ✅ |
| **Contracts** | Agent assumptions and non-assumptions documented | ✅ |
| **Contracts** | Workflow invocation pattern with recommended ordering | ✅ |
| **Failure** | Error taxonomy with 7 categorized error codes | ✅ |
| **Failure** | No silent failures; every error returns structured response | ✅ |
| **Failure** | Retry policy: zero internal retries | ✅ |
| **Determinism** | Fixed decision tree ordering | ✅ |
| **Determinism** | No randomization, no external calls | ✅ |
| **Security** | OWASP API Top 10 checklist integrated | ✅ |
| **Security** | No credential handling; design-time only | ✅ |
| **Observability** | Structured log schema with 5 log points | ✅ |
| **Observability** | 6 metrics defined with types and units | ✅ |
| **Performance** | P50/P99 targets for all operations | ✅ |
| **Scalability** | Stateless; unlimited parallel invocations | ✅ |
| **Concurrency** | No shared state; read-only reference access | ✅ |
| **Resources** | All resources scoped to invocation lifetime | ✅ |
| **Idempotency** | Fully idempotent — all operations are pure functions | ✅ |
| **Compliance** | All skill-design-guide.md sections present | ✅ |

---

⚡ PikaKit v3.9.206
