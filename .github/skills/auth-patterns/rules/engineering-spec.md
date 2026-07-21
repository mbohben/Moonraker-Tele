---
title: Auth Patterns � Engineering Specification
impact: MEDIUM
tags: auth-patterns
---

# Auth Patterns � Engineering Specification

> Production-grade specification for authentication and authorization pattern selection at FAANG scale.

---

## 1. Overview

Auth Patterns provides structured decision frameworks for authentication and authorization in production applications. The skill covers OAuth2/OIDC, JWT lifecycle, RBAC/ABAC permission models, MFA, Passkeys (WebAuthn/FIDO2), and session management. It operates as a security-focused expert knowledge base that produces architectural decisions and implementation guidance, not runtime auth code.

The skill enforces a "fail closed" design philosophy: ambiguous or missing auth configuration must result in access denial, never access grant.

---

## 2. Problem Statement

Authentication and authorization at scale present four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Wrong auth strategy selection | JWT in localStorage in 45%+ of SPAs | XSS-exploitable token theft |
| Long-lived access tokens | Access tokens with 24h+ expiry in 30% of APIs | Extended attack window on token compromise |
| Flat permission models | Binary admin/user roles in 60% of applications | Over-privileged users, compliance violations |
| Missing MFA | < 20% of B2B apps enforce MFA for sensitive operations | Account takeover vulnerability |

Auth Patterns eliminates these by providing context-aware decision trees that produce security-vetted auth architectures.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Context-aware auth selection | Decision tree produces one of JWT/Session/OAuth/Passkey based on = 4 input criteria |
| G2 | Fail-closed defaults | Every pattern defaults to deny-access on ambiguity; no implicit allow |
| G3 | Token hygiene enforcement | All JWT patterns specify = 15-minute access token lifetime |
| G4 | Defense in depth | Every auth recommendation includes = 3 complementary controls (auth + authz + rate limit + monitoring) |
| G5 | Decision traceability | Every recommendation includes security rationale and threat model reference |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Auth library implementation | This skill produces design decisions; code is the implementing agent's responsibility |
| NG2 | Credential storage | No secrets, keys, or tokens are stored by this skill |
| NG3 | Runtime token validation | Validation logic is part of application code, not design guidance |
| NG4 | User database schema | Owned by `data-modeler` skill |
| NG5 | API endpoint design | Owned by `api-architect` skill |
| NG6 | Penetration testing | Owned by `security-scanner` and `offensive-sec` skills |
| NG7 | Compliance certification (SOC2, HIPAA) | This skill aligns with security principles but does not produce compliance artifacts |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Auth strategy selection | JWT/Session/OAuth/Passkey decision tree | Auth library selection |
| Token lifecycle design | Expiry, rotation, revocation patterns | Token signing key generation |
| Permission model design | RBAC/ABAC/hybrid architecture | Permission database schema (? data-modeler) |
| MFA strategy | TOTP/WebAuthn/backup code patterns | MFA provider integration |
| Session management | Cookie config, store selection, invalidation | Session store provisioning (? server-ops) |
| Passkey architecture | WebAuthn/FIDO2 flow design | Browser API implementation |

**Side-effect boundary:** Auth Patterns produces design documents and security guidance. It does not generate secrets, create keys, modify configurations, or make network requests.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string       # One of: "strategy-selection" | "jwt-design" | "oauth-flow" |
                           #         "permission-model" | "mfa-strategy" | "session-design" |
                           #         "passkey-architecture" | "security-review"
Context: {
  app_type: string         # "spa" | "ssr" | "mobile" | "api" | "microservice" | "b2b-enterprise"
  auth_consumers: Array<string>  # ["first-party", "third-party", "service-to-service"]
  sensitivity: string      # "low" | "medium" | "high" | "critical"
  compliance: Array<string> | null  # ["soc2", "hipaa", "gdpr", "pci-dss"]
  existing_auth: string | null     # Current auth system if migrating
  constraints: Array<string> | null # ["no-cookies", "must-use-oauth", "stateless-only"]
}
contract_version: string   # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  strategy: string          # Selected auth pattern
  rationale: string         # Security-focused justification
  threat_model: Array<string>  # Threats this pattern mitigates
  controls: {
    primary: string         # Main auth mechanism
    secondary: string       # Complementary control (e.g., MFA)
    rate_limiting: string   # Auth endpoint protection
    monitoring: string      # Anomaly detection recommendation
  }
  token_config: {           # For JWT/token-based strategies
    access_ttl: string      # e.g., "15 minutes"
    refresh_ttl: string     # e.g., "7 days"
    storage: string         # "httpOnly-secure-cookie" | "secure-storage"
    rotation: string        # "on-use" | "on-expiry"
  } | null
  permission_model: {       # For permission-related requests
    type: string            # "rbac" | "abac" | "hybrid"
    granularity: string     # "role" | "permission" | "attribute"
  } | null
  reference_file: string    # Path to detailed reference document
  checklist: Array<string>  # Security action items
  anti_patterns: Array<string>  # Context-specific security mistakes to avoid
  metadata: {
    version: string
    context_hash: string
    sensitivity_level: string
    contract_version: string    # "2.0.0"
    backward_compatibility: string  # "breaking"
  }
}
Error: ErrorSchema | null
```

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

#### Error Schema

```
Code: string         # From Error Taxonomy (Section 11)
Message: string      # Human-readable, single line
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Same `Request_Type` + `Context` = identical `strategy` + `rationale` output.
- Decision tree evaluation order: app_type ? auth_consumers ? sensitivity ? compliance ? constraints.
- Token configuration values are fixed per strategy (access TTL = 15 min for JWT, never variable).
- No randomization, no A/B selection, no heuristic weighting.

#### What Agents May Assume

- Output `strategy` follows current industry security standards (OWASP, NIST).
- `token_config` values enforce secure defaults (short-lived access, httpOnly storage).
- `anti_patterns` are specific to the chosen strategy and project context.
- The skill is stateless; no prior invocation affects current output.

#### What Agents Must NOT Assume

- The recommendation constitutes a security audit (it provides patterns, not certification).
- Token configuration is universally correct (sensitivity and compliance context may require adjustments).
- Implementation details are included (this skill produces architecture, not code).
- The skill verifies that the recommendation was correctly implemented.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Strategy selection | None; pure decision output |
| Token config generation | None; fixed value lookup |
| Permission model design | None; architecture output |
| Security review | None; checklist output |
| Reference file lookup | Read-only access to `rules/` |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Define app context (type, consumers, sensitivity, compliance)
2. Select request type (strategy-selection ? token/session design ? permission model ? MFA)
3. Receive recommendation with rationale, threat model, and checklist
4. Review and implement (caller's responsibility)
5. Run security-scanner for implementation validation (separate skill)
```

**Recommended ordering:** strategy-selection ? jwt-design or session-design ? permission-model ? mfa-strategy ? security-review.

#### Execution Guarantees

- Each invocation produces a complete, self-contained recommendation.
- No background processes, no deferred execution.
- Output includes all necessary context for implementation without re-invoking.

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
- Callers should modify `Context` between invocations to explore alternative strategies.

#### Isolation Model

- Each invocation is stateless and independent.
- No shared state between invocations, sessions, or agents.
- Reference files in `rules/` are read-only resources.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Strategy selection | Yes | Same context = same strategy |
| Token config | Yes | Fixed values per strategy |
| Permission model design | Yes | Deterministic per context |
| Reference lookup | Yes | Read-only, no mutation |

---

## 7. Execution Model

### 4-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate request type and security context | Validated input or error |
| **Evaluate** | Traverse auth decision tree | Selected strategy with threat model |
| **Harden** | Apply defense-in-depth controls, token config, anti-patterns | Complete security recommendation |
| **Emit** | Return structured output with metadata | Complete output schema |

All phases execute synchronously in a single invocation. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed decision tree ordering | app_type ? auth_consumers ? sensitivity ? compliance ? constraints |
| Fail-closed defaults | Ambiguous context ? most restrictive recommendation |
| No external calls | Decisions use only local reference files and input context |
| No ambient state | Each invocation operates solely on explicit inputs |
| Fixed token values | Access TTL, refresh TTL, storage method are constants per strategy |
| No randomization | Decision trees are deterministic if-then-else chains |

---

## 9. State & Idempotency Model

### State Machine

```
States: IDLE (single state � skill is stateless)
Transitions: None � each invocation is independent
```

Auth Patterns maintains zero persistent state. Every invocation starts from a clean state. Invoking N times with identical inputs produces N identical outputs.

### Reference Versioning

- Reference files are versioned via `metadata.version` in SKILL.md frontmatter.
- Security recommendation changes require a version bump.
- Callers can reference specific versions for audit trail purposes.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported request type |
| Missing context field | Return `ERR_MISSING_CONTEXT` with field name | Supply missing field |
| Conflicting constraints | Return `ERR_CONSTRAINT_CONFLICT` | Resolve conflict |
| Invalid app type | Return `ERR_INVALID_APP_TYPE` | Use supported app type |
| Invalid sensitivity level | Return `ERR_INVALID_SENSITIVITY` | Use: low, medium, high, critical |
| Reference file missing | Return `ERR_REFERENCE_NOT_FOUND` | Verify skill installation |
| Unsupported compliance combo | Return `ERR_UNSUPPORTED_COMPLIANCE` | Check supported compliance standards |

**Invariant:** Every failure returns a structured error. No invocation fails silently. On ambiguous input, the most restrictive recommendation is produced (fail-closed).

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not one of the 8 supported types |
| `ERR_MISSING_CONTEXT` | Validation | Yes | Required context field is null or empty |
| `ERR_CONSTRAINT_CONFLICT` | Validation | Yes | Constraints contradict each other |
| `ERR_INVALID_APP_TYPE` | Validation | No | App type not recognized |
| `ERR_INVALID_SENSITIVITY` | Validation | No | Sensitivity not one of: low, medium, high, critical |
| `ERR_REFERENCE_NOT_FOUND` | Infrastructure | No | Reference file missing from rules/ directory |
| `ERR_UNSUPPORTED_COMPLIANCE` | Validation | Yes | Compliance standard combination not covered |

---

## 12. Timeout & Retry Policy

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Decision generation timeout | N/A | Synchronous decision tree traversal; completes in < 50ms |
| Internal retries | Zero | Deterministic output makes retries meaningless |
| Reference file read timeout | 1,000 ms | Local filesystem; fail immediately if inaccessible |

**Retry policy:** Zero internal retries. Callers should modify context inputs to explore alternative auth strategies.

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "auth-patterns",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "strategy": "string",
  "app_type": "string",
  "sensitivity": "string",
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
| Recommendation generated | INFO | All fields |
| Recommendation failed | ERROR | All fields + error_code |
| Reference file read | DEBUG | file path, read duration |
| Fail-closed fallback applied | WARN | original context, fallback strategy |
| High-sensitivity request | INFO | invocation_id, sensitivity, strategy |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `auth.decision.duration` | Histogram | ms |
| `auth.decision.error_rate` | Counter | per error_code |
| `auth.request_type.usage` | Counter | per request_type |
| `auth.strategy.selected` | Counter | per strategy |
| `auth.sensitivity.distribution` | Counter | per sensitivity level |
| `auth.compliance.requested` | Counter | per compliance standard |

---

## 14. Security & Trust Model

### Fail-Closed Design

- Every decision tree branch terminates in an explicit recommendation; no branch returns "no recommendation."
- Ambiguous or under-specified context triggers the most restrictive strategy for the given app type.
- The skill never returns guidance that weakens security below baseline (e.g., no long-lived tokens, no localStorage for JWTs).

### Credential Handling

- Auth Patterns does not store, process, or transmit any credentials, secrets, or tokens.
- Token configuration values are architectural parameters (TTLs, storage locations), not actual secrets.
- Secret management guidance references patterns; it does not generate or rotate secrets.

### Reference Integrity

- Reference files in `rules/` are read-only, security-reviewed resources.
- Changes to reference files require a version bump and security review.
- No runtime injection; references are static markdown files.

### Input Sanitization

- Context parameters are used for decision tree traversal, not code execution.
- No eval, no template injection, no dynamic code generation from inputs.

### Multi-Tenant Boundaries

- Each invocation is stateless; no data persists between invocations.
- No invocation can access context or outputs from another invocation.
- Sensitivity level does not cross invocation boundaries.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree traversal | Completes in < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel invocations |
| Reference storage | 6 reference files (~12 KB total) | Static files; no growth concern |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

| Scope | Model | Behavior |
|-------|-------|----------|
| Within invocation | Sequential | Classify ? Evaluate ? Harden ? Emit |
| Across invocations | Fully parallel | No shared state, no coordination |
| Reference access | Read-only shared | Multiple concurrent reads safe |

**No undefined behavior:** Stateless skill with read-only resource access; any concurrency level is safe.

---

## 17. Resource Lifecycle Management

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Decision output | Emit phase | Caller (after consumption) | Invocation scope |
| Reference file handle | Evaluate phase | Auto-close after read | < 10 ms |
| Input context | Caller | Invocation completion | Invocation scope |

**Leak prevention:** All resources scoped to single invocation. No persistent handles, connections, or buffers.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Strategy selection | < 5 ms | < 20 ms | 50 ms |
| Full recommendation (with controls) | < 10 ms | < 30 ms | 100 ms |
| Reference file read | < 1 ms | < 5 ms | 1,000 ms |
| Output size | = 800 chars | = 2,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Outdated security recommendations | Medium | Vulnerable auth architecture | Version-bumped references; periodic review cycle aligned with OWASP updates |
| Over-application of restrictive defaults | Low | Friction for low-sensitivity apps | Sensitivity input controls restriction level; low = relaxed, critical = maximum |
| Missing compliance standard | Medium | Incomplete guidance for regulated industries | `ERR_UNSUPPORTED_COMPLIANCE` returned; manual review required |
| Context under-specification | High | Generic recommendation | Fail-closed: produces most restrictive recommendation for app type |
| Decision tree staleness for new auth methods | Low | Missing new auth approaches (e.g., device-bound sessions) | Version bump process; references updated on new standard adoption |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines; details in rules/ |
| Prerequisites documented | ? | No external dependencies required |
| When to Use section | ? | Auth domain decision matrix |
| Quick Reference | ? | Decision tree and checklist |
| Core content matches skill type | ? | Expert type: decision trees, security principles |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to api-architect, security-scanner, data-modeler, offensive-sec |
| Content Map for multi-file | ? | Links to 6 reference files + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 8 request types covering auth lifecycle | ? |
| **Functionality** | Decision tree for 6 app types | ? |
| **Functionality** | 6 reference files covering OAuth2, JWT, RBAC, MFA, Session, Passkey | ? |
| **Contracts** | Input/output/error schemas defined | ? |
| **Contracts** | Agent assumptions and non-assumptions documented | ? |
| **Contracts** | Workflow invocation pattern specified | ? |
| **Failure** | Error taxonomy with 7 categorized error codes | ? |
| **Failure** | No silent failures; fail-closed on ambiguity | ? |
| **Failure** | Retry policy: zero internal retries | ? |
| **Determinism** | Fixed decision tree ordering | ? |
| **Determinism** | Fixed token config values per strategy | ? |
| **Security** | Fail-closed design: ambiguity ? most restrictive | ? |
| **Security** | No credential storage or processing | ? |
| **Security** | Anti-patterns: no localStorage JWTs, no long-lived tokens | ? |
| **Observability** | Structured log schema with 5 log points | ? |
| **Observability** | 6 metrics defined with types and units | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel invocations | ? |
| **Concurrency** | No shared state; read-only reference access | ? |
| **Resources** | All resources scoped to invocation lifetime | ? |
| **Idempotency** | Fully idempotent � all operations are pure functions | ? |
| **Compliance** | All skill-design-guide.md sections present | ? |

---

? ## Security Audit Logging (MANDATORY)

- **SIEM Integration**: EVERY sensitive auth event MUST be audited to a centralized SIEM system.
- **Log Determinism**: All auth audit logs MUST contain ip_address, user_agent, 	imestamp (ISO-8601), and a correlation_id.
- **Immutability**: Audit logs must be append-only and immutable.

---

PikaKit v3.9.206
