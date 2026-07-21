# auth-patterns

**Version 1.0.0**
Engineering
March 2026

> **Note:**
> This document is for agents and LLMs to follow when working on auth-patterns domain.
> Optimized for automation and consistency by AI-assisted workflows.

---

# Auth Patterns

> Authentication & authorization decisions for production applications. Fail closed. Defense in depth.

---

## Prerequisites

**Required:** None � Auth Patterns is a knowledge-based skill with no external dependencies.

**Optional:**
- `security-scanner` skill (for implementation validation)
- `offensive-sec` skill (for attack vector analysis)

---

## When to Use

| Situation | Reference |
|-----------|-----------|
| Choosing auth strategy | Decision tree below |
| OAuth2 / SSO / OIDC | `rules/oauth2.md` |
| JWT signing, rotation, refresh | `rules/jwt-deep.md` |
| Permission system (RBAC/ABAC) | `rules/rbac-abac.md` |
| Multi-factor authentication | `rules/mfa.md` |
| Session management | `rules/session.md` |
| Passwordless / Passkeys | `rules/passkey.md` |
| Architecture review, contracts | `rules/engineering-spec.md` |

**Selective Reading Rule:** Read ONLY the file matching the current request.

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Auth strategy selection (JWT/Session/OAuth/Passkey) | Auth library implementation |
| Token lifecycle design (TTL, rotation, revocation) | Secret/key generation |
| Permission model architecture (RBAC/ABAC) | Users/roles DB schema (? data-modeler) |
| MFA strategy selection (TOTP/WebAuthn) | MFA provider integration |
| Session config (cookie, store, invalidation) | Session store provisioning (? server-ops) |

**Pure decision skill:** Produces security guidance. Zero network calls, zero credential handling, zero side effects.

---

## Core Principles

| Principle | Enforcement |
|-----------|-------------|
| **Fail Closed** | Auth error or ambiguity ? deny access. Never implicit allow. |
| **Defense in Depth** | Every recommendation includes = 3 controls: auth + authz + rate limit + monitoring |
| **Least Privilege** | Grant minimum permissions; default to no-access |
| **Token Hygiene** | Access token = 15 min. Refresh token rotated on use. httpOnly storage. |
| **Zero Trust** | Verify every request. No implicit trust for internal services. |

---

## Auth Strategy Decision Tree

```
What type of application?
+-- SPA / Mobile App
�   +-- First-party only ? JWT (=15min access) + Refresh Token (httpOnly cookie)
�   +-- Third-party login ? OAuth 2.0 + PKCE (mandatory for public clients)
+-- Traditional Web (SSR)
�   +-- Session-based (httpOnly secure cookies, SameSite=Strict)
+-- API / Microservices
�   +-- Service-to-service ? mTLS or API Keys + HMAC
�   +-- User-facing ? JWT with gateway validation
+-- Enterprise / B2B
�   +-- SAML 2.0 or OIDC (SSO)
+-- Modern Passwordless
    +-- Passkeys (WebAuthn/FIDO2)
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not one of the 8 supported types |
| `ERR_MISSING_CONTEXT` | Yes | Required context field is null or empty |
| `ERR_CONSTRAINT_CONFLICT` | Yes | Contradictory constraints |
| `ERR_INVALID_APP_TYPE` | No | App type not recognized |
| `ERR_INVALID_SENSITIVITY` | No | Sensitivity not one of: low, medium, high, critical |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |
| `ERR_UNSUPPORTED_COMPLIANCE` | Yes | Compliance standard combination not covered |

**Zero internal retries.** Deterministic output; same context = same recommendation.

---

## Decision Checklist

- [ ] **Auth strategy chosen for THIS app type?** (JWT / Session / OAuth / Passkey)
- [ ] **Token storage decided?** (httpOnly secure cookie � NOT localStorage)
- [ ] **Access token TTL = 15 minutes?**
- [ ] **Refresh token rotation configured?** (rotate on every use)
- [ ] **Permission model chosen?** (RBAC / ABAC / hybrid)
- [ ] **MFA required for sensitive operations?** (high/critical sensitivity)
- [ ] **Session invalidation on password change?**
- [ ] **Rate limiting on auth endpoints?**
- [ ] **PKCE enabled for all public clients?** (SPA, mobile)

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|-------|
| Store JWT in localStorage | Use httpOnly secure cookies |
| Access tokens with 24h+ expiry | Access token = 15 min + refresh token |
| Roll your own crypto | Use battle-tested libraries (jose, passport) |
| Same signing key for all services | Per-service signing keys |
| Skip PKCE for public clients | PKCE mandatory for SPA/mobile OAuth |
| Hardcode roles in application code | Store permissions in database |
| Implicit trust for internal services | Zero trust: verify every request |

---

## ?? Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [oauth2.md](rules/oauth2.md) | OAuth 2.0 + OIDC flows, PKCE, scopes, providers | Third-party login, SSO |
| [jwt-deep.md](rules/jwt-deep.md) | JWT signing, rotation, claims, refresh patterns | Token-based auth |
| [rbac-abac.md](rules/rbac-abac.md) | Role-Based + Attribute-Based access control | Permission systems |
| [mfa.md](rules/mfa.md) | TOTP, WebAuthn, backup codes, recovery | Multi-factor auth |
| [session.md](rules/session.md) | Cookie sessions, Redis store, stateless vs stateful | Session design |
| [passkey.md](rules/passkey.md) | WebAuthn/FIDO2 implementation guide | Passwordless auth |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec: contracts, security model, scalability | Architecture review |

---

## ?? Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API auth integration patterns |
| `security-scanner` | Skill | Auth vulnerability scanning |
| `data-modeler` | Skill | Users/roles schema design |
| `offensive-sec` | Skill | Auth attack vectors and pen testing |

---



---

## Detailed Rules


---

### Rule: engineering-spec

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



---

### Rule: jwt-deep

---
name: jwt-deep
description: JWT signing, rotation, claims, refresh token patterns, JWKS endpoint
---

# JWT Deep Dive

> Token design, signing, rotation, and refresh patterns.

---

## JWT Structure

```
Header.Payload.Signature
```

| Part | Contains | Example |
|------|----------|---------|
| Header | Algorithm, type | `{"alg": "RS256", "typ": "JWT"}` |
| Payload | Claims (data) | `{"sub": "user123", "exp": 1700000000}` |
| Signature | Verification | HMAC or RSA signature |

---

## Signing Algorithms

| Algorithm | Type | Best For |
|-----------|------|----------|
| `RS256` | Asymmetric (RSA) | Microservices (verify without secret) |
| `ES256` | Asymmetric (ECDSA) | Mobile, performance-sensitive |
| `HS256` | Symmetric (HMAC) | Monolith (single service) |
| `EdDSA` | Asymmetric (Ed25519) | Modern, fastest asymmetric |

> **Rule:** Use asymmetric for distributed systems. Symmetric only for single-service.

---

## Claims Best Practices

### Standard Claims (use these)

| Claim | Purpose | Required? |
|-------|---------|-----------|
| `sub` | Subject (user ID) | ? |
| `iss` | Issuer | ? |
| `aud` | Audience | ? |
| `exp` | Expiry (Unix timestamp) | ? |
| `iat` | Issued at | ? |
| `jti` | JWT ID (unique) | For revocation |

### Custom Claims

```typescript
// ? Minimal claims
{
  sub: "user_abc123",
  role: "admin",        // For quick authz checks
  org: "org_xyz",       // Multi-tenant
  scope: "read write",  // API permissions
}

// ? Too much data
{
  sub: "user_abc123",
  email: "user@example.com",  // PII in token
  address: "...",              // Never store PII
  fullProfile: {...},          // Token too large
}
```

---

## Access + Refresh Token Pattern

```
+--------------+     +--------------+     +--------------+
�    Client    �     �  Auth Server �     �   Resource   �
+--------------+     +--------------+     +--------------+
       �  Login             �                    �
       �------------------->�                    �
       �  Access (15min)    �                    �
       �  + Refresh (7d)    �                    �
       �<-------------------�                    �
       �                    �                    �
       �  API call + Access Token                �
       �---------------------------------------->�
       �  Response                               �
       �<----------------------------------------�
       �                    �                    �
       �  (Access expired)  �                    �
       �  Refresh request   �                    �
       �------------------->�                    �
       �  New Access        �                    �
       �  + New Refresh     � (rotation!)        �
       �<-------------------�                    �
```

### Implementation

```typescript
// Token generation
function generateTokenPair(userId: string) {
  const accessToken = jwt.sign(
    { sub: userId, type: 'access' },
    ACCESS_SECRET,
    { expiresIn: '15m', algorithm: 'RS256' }
  );

  const refreshToken = jwt.sign(
    { sub: userId, type: 'refresh', jti: crypto.randomUUID() },
    REFRESH_SECRET,
    { expiresIn: '7d', algorithm: 'RS256' }
  );

  return { accessToken, refreshToken };
}

// Refresh endpoint
async function refreshTokens(oldRefreshToken: string) {
  const payload = jwt.verify(oldRefreshToken, REFRESH_PUBLIC_KEY);

  // Check if token was already used (rotation detection)
  const isUsed = await redis.get(`used_refresh:${payload.jti}`);
  if (isUsed) {
    // Token reuse detected ? compromise! Revoke all user sessions
    await revokeAllSessions(payload.sub);
    throw new SecurityError('Refresh token reuse detected');
  }

  // Mark old token as used
  await redis.setex(`used_refresh:${payload.jti}`, 7 * 86400, '1');

  return generateTokenPair(payload.sub);
}
```

---

## Key Rotation

### Why Rotate

- Limit blast radius of key compromise
- Compliance requirements (SOC 2, PCI)

### JWKS Endpoint Pattern

```typescript
// /.well-known/jwks.json
{
  "keys": [
    { "kid": "key-2025-01", "kty": "RSA", "use": "sig", ... },  // Current
    { "kid": "key-2024-07", "kty": "RSA", "use": "sig", ... }   // Previous (grace period)
  ]
}
```

### Rotation Schedule

| Environment | Frequency | Grace Period |
|-------------|-----------|--------------|
| Production | Every 90 days | 30 days overlap |
| High security | Every 30 days | 14 days overlap |

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|------|
| Store JWT in localStorage | httpOnly secure cookie |
| Long-lived access tokens | 15 min max + refresh |
| Put PII in claims | Minimal claims, lookup from DB |
| Same key for all environments | Per-env signing keys |
| Skip `exp` validation | Always check expiry |
| Trust JWT without signature check | Always verify signature |

---



---

## ?? Related

| File | When to Read |
|------|-------------|
| [oauth2.md](oauth2.md) | OAuth2 flows that issue JWTs |
| [session.md](session.md) | Stateful alternative to JWT |
| [rbac-abac.md](rbac-abac.md) | Permission claims in JWT |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

### Rule: mfa

---
name: mfa
description: Multi-factor authentication � TOTP setup, backup codes, WebAuthn for MFA, recovery flows
---

# Multi-Factor Authentication (MFA)

> TOTP, WebAuthn, backup codes, and recovery flows.
> **See also:** `security-scanner/auth-patterns.md` for TOTP code pattern and account lockout.

---

## MFA Strategy Selection

| Method | Security | UX | Best For |
|--------|----------|-----|---------|
| TOTP (authenticator app) | ???? | ??? | General purpose |
| WebAuthn / Passkey | ????? | ???? | Modern apps |
| SMS OTP | ?? | ???? | Legacy, low-risk |
| Email OTP | ?? | ??? | Fallback only |
| Hardware key (YubiKey) | ????? | ?? | High security |

> ?? **SMS OTP is vulnerable to SIM swapping.** Avoid for high-value targets.

---

## TOTP Implementation

> **Reference:** See `security-scanner/auth-patterns.md` for base TOTP code pattern.

### Enhanced Setup Flow

```typescript
import { authenticator } from 'otplib';
import qrcode from 'qrcode';

async function enableMFA(userId: string) {
  // 1. Generate secret
  const secret = authenticator.generateSecret();

  // 2. Create otpauth URI
  const otpauthUrl = authenticator.keyuri(
    user.email,
    'YourApp',
    secret
  );

  // 3. Generate QR code
  const qrDataUrl = await qrcode.toDataURL(otpauthUrl);

  // 4. Store secret (encrypted) � NOT active yet
  await db.user.update({
    where: { id: userId },
    data: { mfaSecret: encrypt(secret), mfaPending: true },
  });

  // 5. Generate backup codes
  const backupCodes = generateBackupCodes(10);
  await storeBackupCodes(userId, backupCodes);

  return { qrDataUrl, backupCodes };
}

// 6. Verify first code to activate
async function confirmMFA(userId: string, code: string) {
  const secret = decrypt(user.mfaSecret);
  const isValid = authenticator.verify({ token: code, secret });

  if (!isValid) throw new InvalidCodeError();

  await db.user.update({
    where: { id: userId },
    data: { mfaEnabled: true, mfaPending: false },
  });
}
```

### Backup Codes

```typescript
function generateBackupCodes(count: number = 10): string[] {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString('hex') // 8-char codes
  );
}

async function storeBackupCodes(userId: string, codes: string[]) {
  // Hash each code before storing
  const hashed = codes.map(code => ({
    userId,
    codeHash: crypto.createHash('sha256').update(code).digest('hex'),
    used: false,
  }));
  await db.backupCode.createMany({ data: hashed });
}

async function useBackupCode(userId: string, code: string): Promise<boolean> {
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  const result = await db.backupCode.updateMany({
    where: { userId, codeHash: hash, used: false },
    data: { used: true, usedAt: new Date() },
  });
  return result.count > 0;
}
```

---

## WebAuthn / Passkey for MFA

```typescript
import { generateAuthenticationOptions, verifyAuthenticationResponse }
  from '@simplewebauthn/server';

// Challenge generation (server)
const options = await generateAuthenticationOptions({
  rpID: 'example.com',
  allowCredentials: user.credentials.map(c => ({
    id: c.credentialId,
    type: 'public-key',
  })),
  userVerification: 'required',
});

// Verify response (server)
const verification = await verifyAuthenticationResponse({
  response: clientResponse,
  expectedChallenge: storedChallenge,
  expectedOrigin: 'https://example.com',
  expectedRPID: 'example.com',
  authenticator: storedCredential,
});
```

---

## Recovery Flow

```
User cannot access MFA device?
+-- Has backup codes ? Enter backup code
+-- Has recovery email ? Email verification + admin review
+-- Has trusted device ? Device-based recovery
+-- None of above ? Manual identity verification (support)
```

### Recovery Best Practices

| Practice | Why |
|----------|-----|
| Show backup codes ONCE at setup | Prevent later access |
| Allow re-generating backup codes | When old ones run out |
| Log all recovery events | Audit trail |
| Rate limit recovery attempts | Prevent brute force |
| Notify on MFA changes | Alert user to compromise |

---



---

## ?? Related

| File | When to Read |
|------|-------------|
| [passkey.md](passkey.md) | Passkeys as MFA or passwordless |
| [jwt-deep.md](jwt-deep.md) | Token lifecycle after MFA |
| [session.md](session.md) | Session management with MFA |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

### Rule: oauth2

---
name: oauth2
description: OAuth 2.0 + OpenID Connect flows, PKCE, scopes, provider integration
---

# OAuth 2.0 & OpenID Connect

> Third-party login, SSO, and delegated authorization.

---

## OAuth 2.0 Flows

### Authorization Code + PKCE (Recommended for SPA/Mobile)

```
1. Client generates code_verifier (random 43-128 chars)
2. Client creates code_challenge = SHA256(code_verifier)
3. Redirect to auth server with code_challenge
4. User authenticates ? redirect back with auth code
5. Client exchanges code + code_verifier for tokens
```

```typescript
import crypto from 'crypto';

// Generate PKCE pair
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

// Authorization URL
const authUrl = new URL('https://auth.example.com/authorize');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('scope', 'openid profile email');
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');
authUrl.searchParams.set('state', crypto.randomBytes(16).toString('hex'));
```

### Flow Selection Guide

| Flow | Best For | PKCE? |
|------|----------|-------|
| Authorization Code + PKCE | SPA, Mobile, Server | ? Always |
| Client Credentials | Machine-to-machine | N/A |
| Device Code | TV, CLI, IoT | N/A |
| ~~Implicit~~ | **DEPRECATED** � never use | ? |
| ~~Password~~ | **DEPRECATED** � never use | ? |

---

## OpenID Connect (OIDC)

OIDC = OAuth 2.0 + Identity Layer

### ID Token Claims

| Claim | Purpose |
|-------|---------|
| `sub` | Unique user identifier |
| `iss` | Token issuer |
| `aud` | Intended audience (your client_id) |
| `exp` | Expiration time |
| `iat` | Issued at |
| `nonce` | Replay attack prevention |
| `email` | User email (with scope) |
| `name` | User display name (with scope) |

### Scopes

| Scope | Data Returned |
|-------|---------------|
| `openid` | Required � returns `sub` |
| `profile` | name, picture, locale |
| `email` | email, email_verified |
| `offline_access` | Refresh token |

---

## Provider Integration

### Popular Providers

| Provider | Docs | Notes |
|----------|------|-------|
| Google | `accounts.google.com` | OIDC compliant |
| GitHub | `github.com/login/oauth` | OAuth 2.0 only (no OIDC) |
| Microsoft | `login.microsoftonline.com` | OIDC + Azure AD |
| Apple | `appleid.apple.com` | Required for iOS apps |

### Auth Libraries (Node.js)

| Library | Use Case |
|---------|----------|
| `next-auth` / `Auth.js` | Next.js integration |
| `passport` | Express middleware |
| `arctic` | Lightweight OAuth 2.0 |
| `lucia` | Session + OAuth (modern) |
| `better-auth` | Full-featured (2025+) |

---

## Security Checklist

- [ ] Always use PKCE for public clients
- [ ] Validate `state` parameter to prevent CSRF
- [ ] Verify ID token signature and claims (`iss`, `aud`, `exp`)
- [ ] Use `nonce` to prevent replay attacks
- [ ] Store tokens in httpOnly cookies, not localStorage
- [ ] Implement token refresh before expiry

---



---

## ?? Related

| File | When to Read |
|------|-------------|
| [jwt-deep.md](jwt-deep.md) | Token lifecycle after OAuth login |
| [session.md](session.md) | Session-based alternative |
| [passkey.md](passkey.md) | Passwordless alternative |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

### Rule: passkey

---
name: passkey
description: WebAuthn/FIDO2 passkeys � registration, authentication, browser + server implementation
---

# Passkeys (WebAuthn / FIDO2)

> Passwordless authentication using public-key cryptography.

---

## What Are Passkeys?

| Aspect | Detail |
|--------|--------|
| Standard | WebAuthn (W3C) + FIDO2 (FIDO Alliance) |
| Mechanism | Public-key cryptography (device holds private key) |
| Phishing resistance | ? Origin-bound (can't be phished) |
| UX | Biometric (fingerprint, Face ID) or PIN |
| Syncing | iCloud Keychain, Google Password Manager, 1Password |

---

## Flow Overview

```
Registration:
1. Server sends challenge + user info
2. Browser calls navigator.credentials.create()
3. User authenticates locally (biometric/PIN)
4. Browser returns public key + signed challenge
5. Server stores public key

Authentication:
1. Server sends challenge + allowed credential IDs
2. Browser calls navigator.credentials.get()
3. User authenticates locally
4. Browser returns signed challenge
5. Server verifies signature with stored public key
```

---

## Server Implementation

### Using @simplewebauthn/server

```bash
npm install @simplewebauthn/server @simplewebauthn/browser
```

### Registration

```typescript
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

const rpName = 'Your App';
const rpID = 'example.com';
const origin = 'https://example.com';

// Step 1: Generate options
async function startRegistration(user: User) {
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: user.email,
    attestationType: 'none',     // Don't need hardware attestation
    authenticatorSelection: {
      residentKey: 'preferred',  // Discoverable credential (passkey)
      userVerification: 'required',
    },
    excludeCredentials: user.credentials.map(c => ({
      id: c.credentialId,
      type: 'public-key',
    })),
  });

  // Store challenge temporarily
  await redis.setex(`webauthn:${user.id}`, 300, options.challenge);

  return options;
}

// Step 2: Verify response
async function finishRegistration(user: User, response: RegistrationResponse) {
  const expectedChallenge = await redis.get(`webauthn:${user.id}`);

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (verification.verified && verification.registrationInfo) {
    const { credentialPublicKey, credentialID, counter } =
      verification.registrationInfo;

    // Store credential
    await db.credential.create({
      data: {
        userId: user.id,
        credentialId: Buffer.from(credentialID),
        publicKey: Buffer.from(credentialPublicKey),
        counter,
        deviceType: verification.registrationInfo.credentialDeviceType,
        backedUp: verification.registrationInfo.credentialBackedUp,
      },
    });
  }
}
```

### Authentication

```typescript
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

// Step 1: Generate challenge
async function startAuth(user?: User) {
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
    // If user known, limit to their credentials
    ...(user && {
      allowCredentials: user.credentials.map(c => ({
        id: c.credentialId,
        type: 'public-key',
      })),
    }),
  });

  await redis.setex(`webauthn:auth:${options.challenge}`, 300, '1');
  return options;
}

// Step 2: Verify
async function finishAuth(response: AuthenticationResponse) {
  const credential = await db.credential.findUnique({
    where: { credentialId: response.id },
    include: { user: true },
  });

  if (!credential) throw new Error('Credential not found');

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: storedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialPublicKey: credential.publicKey,
      credentialID: credential.credentialId,
      counter: credential.counter,
    },
  });

  if (verification.verified) {
    // Update counter (replay protection)
    await db.credential.update({
      where: { id: credential.id },
      data: { counter: verification.authenticationInfo.newCounter },
    });

    return credential.user;
  }
}
```

---

## Frontend (Browser)

```typescript
import {
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';

// Registration
const regOptions = await fetch('/api/auth/passkey/register').then(r => r.json());
const regResult = await startRegistration(regOptions);
await fetch('/api/auth/passkey/register/verify', {
  method: 'POST',
  body: JSON.stringify(regResult),
});

// Authentication
const authOptions = await fetch('/api/auth/passkey/login').then(r => r.json());
const authResult = await startAuthentication(authOptions);
await fetch('/api/auth/passkey/login/verify', {
  method: 'POST',
  body: JSON.stringify(authResult),
});
```

---

## Adoption Strategy

| Phase | Action |
|-------|--------|
| 1 | Offer passkey as optional MFA |
| 2 | Prompt existing users to add passkey |
| 3 | Allow passkey-only login (passwordless) |
| 4 | Keep password as fallback recovery |

---

## Browser Support (2025)

| Browser | Passkey Support |
|---------|-----------------|
| Chrome 108+ | ? Full |
| Safari 16+ | ? Full |
| Firefox 122+ | ? Full |
| Edge 108+ | ? Full |

---



---

## ?? Related

| File | When to Read |
|------|-------------|
| [mfa.md](mfa.md) | MFA with passkeys as second factor |
| [oauth2.md](oauth2.md) | OAuth alternative to passkeys |
| [session.md](session.md) | Session after passkey auth |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

### Rule: rbac-abac

---
name: rbac-abac
description: Role-Based and Attribute-Based access control � Prisma schema, middleware, ABAC policy engine
---

# RBAC & ABAC � Access Control

> Role-Based and Attribute-Based authorization patterns.

---

## Model Selection

```
How complex are your permissions?
+-- Simple (admin/user/viewer)
�   +-- RBAC (Role-Based)
+-- Medium (roles + resource ownership)
�   +-- RBAC + ownership checks
+-- Complex (context-dependent rules)
�   +-- ABAC (Attribute-Based)
+-- Enterprise (multi-tenant + compliance)
    +-- ABAC or hybrid RBAC+ABAC
```

---

## RBAC (Role-Based Access Control)

### Schema Design

```typescript
// Database models
interface User {
  id: string;
  roles: Role[];         // Many-to-many
}

interface Role {
  id: string;
  name: string;          // "admin", "editor", "viewer"
  permissions: Permission[];  // Many-to-many
}

interface Permission {
  id: string;
  resource: string;      // "posts", "users", "billing"
  action: string;        // "create", "read", "update", "delete"
}
```

### Prisma Schema

```prisma
model User {
  id    String     @id @default(cuid())
  roles UserRole[]
}

model Role {
  id          String           @id @default(cuid())
  name        String           @unique
  permissions RolePermission[]
  users       UserRole[]
}

model Permission {
  id       String           @id @default(cuid())
  resource String
  action   String
  roles    RolePermission[]
  @@unique([resource, action])
}

model UserRole {
  userId String
  roleId String
  user   User @relation(fields: [userId], references: [id])
  role   Role @relation(fields: [roleId], references: [id])
  @@id([userId, roleId])
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])
  @@id([roleId, permissionId])
}
```

### Permission Check (Middleware)

```typescript
function requirePermission(resource: string, action: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const hasPermission = user.roles.some(role =>
      role.permissions.some(p =>
        p.resource === resource && p.action === action
      )
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage
app.delete('/api/posts/:id', requirePermission('posts', 'delete'), deletePost);
```

---

## ABAC (Attribute-Based Access Control)

### When to Use

| Scenario | Example |
|----------|---------|
| Context-dependent | "Editors can only edit posts they authored" |
| Time-based | "Access only during business hours" |
| Location-based | "Only from corporate network" |
| Multi-tenant | "Users can only see their organization's data" |

### Policy Pattern

```typescript
interface PolicyContext {
  subject: { id: string; role: string; orgId: string; };
  resource: { type: string; ownerId: string; orgId: string; };
  action: string;
  environment: { time: Date; ip: string; };
}

function evaluatePolicy(ctx: PolicyContext): boolean {
  const policies: Policy[] = [
    // Owners can do anything to their resources
    {
      effect: 'allow',
      condition: (c) => c.subject.id === c.resource.ownerId,
    },
    // Admins can do anything in their org
    {
      effect: 'allow',
      condition: (c) =>
        c.subject.role === 'admin' &&
        c.subject.orgId === c.resource.orgId,
    },
    // Editors can read/update (not delete) in their org
    {
      effect: 'allow',
      condition: (c) =>
        c.subject.role === 'editor' &&
        c.subject.orgId === c.resource.orgId &&
        ['read', 'update'].includes(c.action),
    },
  ];

  // Default deny � allow only if at least one policy matches
  return policies.some(p => p.effect === 'allow' && p.condition(ctx));
}
```

---

## Libraries & Services

| Solution | Type | Best For |
|----------|------|----------|
| CASL | Library (JS) | Frontend + backend RBAC/ABAC |
| Casbin | Library (multi-lang) | Policy engine |
| Oso | Library | Application-embedded authz |
| Auth0 FGA | Service | Fine-grained authorization |
| Permit.io | Service | Managed RBAC/ABAC |

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|------|
| Hardcode roles in if/else | Use permission table |
| Check role name in code | Check permission (resource + action) |
| Forget resource ownership | Always check `ownerId` |
| Skip multi-tenant isolation | Always scope queries by `orgId` |

---



---

## ?? Related

| File | When to Read |
|------|-------------|
| [jwt-deep.md](jwt-deep.md) | Role/permission claims in JWT |
| [session.md](session.md) | Session-based permission checks |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

### Rule: session

---
name: session
description: Cookie sessions, Redis store, stateless vs stateful, session lifecycle and security
---

# Session Management

> Cookie-based sessions, Redis store, stateless vs stateful trade-offs.

---

## Stateless vs Stateful

| Aspect | Stateless (JWT) | Stateful (Session) |
|--------|-----------------|-------------------|
| Storage | Token contains data | Server stores data |
| Scalability | ? No shared state | ?? Needs shared store |
| Revocation | ? Hard (need blocklist) | ? Delete from store |
| Size | Can grow large | Fixed session ID |
| Best for | Microservices, API | Traditional web SSR |

### Hybrid Approach (Recommended)

```
Use JWT for access (short-lived, stateless)
+ Session-based refresh (stateful, revocable in Redis)
```

---

## Cookie-Based Session

### Secure Cookie Configuration

```typescript
app.use(session({
  name: '__session',                    // Avoid default 'connect.sid'
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,                     // No JS access
    secure: true,                       // HTTPS only
    sameSite: 'lax',                    // CSRF protection
    maxAge: 24 * 60 * 60 * 1000,       // 24 hours
    domain: '.example.com',            // Cross-subdomain if needed
    path: '/',
  },
}));
```

### Cookie Security Flags

| Flag | Purpose | Always Set? |
|------|---------|-------------|
| `httpOnly` | Prevent XSS token theft | ? |
| `secure` | HTTPS only | ? (prod) |
| `sameSite: lax` | Basic CSRF protection | ? |
| `sameSite: strict` | Full CSRF protection | For sensitive ops |
| `__Host-` prefix | Origin-bound | High security |

---

## Redis Session Store

### Why Redis

| Feature | Benefit |
|---------|---------|
| In-memory speed | < 1ms session lookup |
| TTL support | Automatic expiry |
| Cluster support | Horizontal scaling |
| Pub/Sub | Session invalidation across nodes |

### Setup

```typescript
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'lax' },
}));
```

### Session Data Structure

```typescript
// Keep session data minimal
interface SessionData {
  userId: string;
  role: string;
  orgId?: string;
  loginAt: number;
  lastActiveAt: number;
  // DON'T store: full user profile, preferences, cart items
}
```

---

## Session Lifecycle

### Login

```typescript
async function login(req: Request) {
  const user = await authenticate(req.body);

  // Regenerate session ID (prevent fixation)
  req.session.regenerate(() => {
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.loginAt = Date.now();
  });
}
```

### Logout

```typescript
async function logout(req: Request) {
  const sessionId = req.sessionID;

  // Destroy server-side session
  req.session.destroy(() => {
    // Clear cookie
    res.clearCookie('__session');
  });
}
```

### Invalidate All Sessions (password change)

```typescript
async function invalidateAllSessions(userId: string) {
  // Scan Redis for user's sessions
  const keys = await redis.keys(`sess:*`);
  for (const key of keys) {
    const data = await redis.get(key);
    if (data && JSON.parse(data).userId === userId) {
      await redis.del(key);
    }
  }
}
```

---

## Session Security Checklist

- [ ] Regenerate session ID after login
- [ ] Set `httpOnly`, `secure`, `sameSite` on cookies
- [ ] Use Redis/Memcached for distributed sessions
- [ ] Implement idle timeout (30 min) + absolute timeout (24h)
- [ ] Invalidate sessions on password change
- [ ] Log session creation/destruction for audit

---



---

## ?? Related

| File | When to Read |
|------|-------------|
| [jwt-deep.md](jwt-deep.md) | JWT as stateless alternative |
| [oauth2.md](oauth2.md) | OAuth sessions |
| [mfa.md](mfa.md) | MFA with sessions |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

? ## Security Audit Logging (MANDATORY)

- EVERY sensitive auth event MUST be audited to SIEM with ip_address and 	imestamp.

---

PikaKit v3.9.206
