---
title: CI/CD Pipeline � Engineering Specification
impact: MEDIUM
tags: cicd-pipeline
---

# CI/CD Pipeline � Engineering Specification

> Production-grade specification for deployment decision-making and safe release workflows at FAANG scale.

---

## 1. Overview

CI/CD Pipeline provides structured decision frameworks for production deployment: platform selection, deployment strategy (rolling/blue-green/canary), rollback procedures, pre-deployment validation, and post-deployment verification. The skill operates as an expert knowledge base that produces deployment architecture decisions and operational runbooks, not deployment automation code.

The skill covers a 5-phase deployment lifecycle (Prepare ? Backup ? Deploy ? Verify ? Confirm), platform-specific rollback strategies, and zero-downtime deployment patterns.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Production deployments at scale face four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| No rollback plan | 40% of deployments have no documented rollback procedure | Extended outage on failure |
| Skip staging validation | 30% of teams deploy directly to production | Preventable production incidents |
| Deploy-and-forget | 25% of deployments have no post-deploy monitoring | Silent failures undetected for hours |
| Multi-change deployments | Bundling 3+ changes per deploy in 35% of releases | Blame ambiguity; harder rollback |

CI/CD Pipeline eliminates these by enforcing a 5-phase deployment lifecycle with mandatory rollback plans, staging validation, and post-deploy verification.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Zero-downtime deployments | Every recommendation includes zero-downtime strategy selection |
| G2 | Rollback within 5 minutes | Every platform recommendation includes rollback procedure with = 5-minute target |
| G3 | Single-change releases | Recommendations enforce one logical change per deployment |
| G4 | Mandatory pre-deploy validation | 6-item checklist required before any deployment |
| G5 | Post-deploy monitoring window | = 15-minute active monitoring after every deployment |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | CI/CD tool configuration (GitHub Actions, Jenkins) | Implementation concern; this skill produces strategy decisions |
| NG2 | Docker/Kubernetes YAML generation | Owned by `server-ops` and `gitops` skills |
| NG3 | Security scanning execution | Owned by `security-scanner` skill |
| NG4 | Git workflow management | Owned by `git-workflow` skill |
| NG5 | Feature flag management | Owned by `feature-flags` skill |
| NG6 | Infrastructure provisioning | Owned by `server-ops` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Deployment strategy selection | Rolling/blue-green/canary decision tree | Strategy implementation |
| Platform selection | Platform recommendation per project type | Platform configuration |
| Rollback procedures | Per-platform rollback runbook | Rollback execution |
| Pre-deploy validation | 6-item checklist | Test execution (? test-architect) |
| Post-deploy verification | Monitoring window + health check plan | Monitoring infrastructure (? observability) |
| Emergency procedures | Incident response runbook | Incident management tooling |

**Side-effect boundary:** CI/CD Pipeline produces deployment decisions, checklists, and runbooks. It does not execute deployments, modify infrastructure, or run commands.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string       # "strategy-selection" | "platform-selection" | "rollback-plan" |
                           # "pre-deploy-check" | "post-deploy-plan" | "emergency-procedure" |
                           # "full-deployment-plan"
Context: {
  project_type: string     # "static" | "web-app" | "api" | "microservices" | "monolith"
  scale: string            # "single-instance" | "multi-instance" | "distributed"
  risk_level: string       # "low" | "medium" | "high" | "critical"
  current_platform: string | null  # Existing deployment target
  has_staging: boolean     # Whether staging environment exists
  change_type: string      # "feature" | "bugfix" | "hotfix" | "infrastructure" | "security-patch"
  constraints: Array<string> | null  # ["no-downtime", "database-migration", "breaking-api"]
}
contract_version: string   # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  strategy: string         # "rolling" | "blue-green" | "canary"
  platform: string         # Recommended platform
  deployment_phases: Array<{
    phase: string          # Phase name
    actions: Array<string> # Required actions
    duration: string       # Estimated duration
  }>
  rollback: {
    method: string         # Platform-specific rollback method
    target_time: string    # e.g., "= 5 minutes"
    trigger: Array<string> # Conditions that trigger rollback
  }
  pre_deploy_checklist: Array<string>
  post_deploy: {
    monitoring_window: string  # e.g., "15 minutes"
    health_checks: Array<string>
    success_criteria: Array<string>
  }
  zero_downtime: {
    strategy: string
    rationale: string
  }
  reference_file: string | null
  anti_patterns: Array<string>
  metadata: {
    contract_version: string
    backward_compatibility: string
    context_hash: string
  }
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string         # From Error Taxonomy (Section 11)
Message: string      # Human-readable, single line
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Same `Request_Type` + `Context` = identical strategy + platform + rollback output.
- Decision tree evaluation order: project_type ? scale ? risk_level ? change_type ? constraints.
- Rollback target time is fixed at = 5 minutes for all platforms.
- Post-deploy monitoring window is fixed at = 15 minutes.
- No randomization, no A/B selection.

#### What Agents May Assume

- Output `strategy` is appropriate for the risk level and scale.
- `rollback` method is valid for the selected platform.
- `pre_deploy_checklist` covers all mandatory pre-deploy validations.
- Post-deploy monitoring window is sufficient for initial failure detection.

#### What Agents Must NOT Assume

- The recommendation accounts for all infrastructure-specific constraints.
- Rollback procedures are tested (they must be validated in staging first).
- The skill executes any deployment commands.
- Database migrations are automatically handled by rollback.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Strategy selection | None; pure decision output |
| Platform selection | None; recommendation |
| Rollback plan | None; runbook output |
| Pre-deploy check | None; checklist output |
| Emergency procedure | None; runbook output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Define deployment context (project type, scale, risk, change type)
2. Request full-deployment-plan (or individual phases)
3. Execute pre-deploy checklist (caller's responsibility)
4. Deploy using recommended strategy (caller's responsibility)
5. Monitor for recommended window (caller's responsibility)
6. Confirm or rollback based on criteria (caller's responsibility)
```

**Recommended ordering:** strategy-selection ? platform-selection ? rollback-plan ? pre-deploy-check ? post-deploy-plan.

#### Execution Guarantees

- Each invocation produces a complete, self-contained deployment plan.
- No background processes, no deferred execution.
- Output includes all necessary context for deployment without re-invoking.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported request type |
| Missing context field | Return error to caller | Supply missing context |
| Conflicting constraints | Return error to caller | Resolve constraint conflict |
| Unsupported platform | Return error to caller | Choose supported platform |

#### Retry Boundaries

- Zero internal retries. Deterministic output.
- Callers modify context to explore alternative strategies.

#### Isolation Model

- Each invocation is stateless and independent.
- No shared state between invocations.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Strategy selection | Yes | Same context = same strategy |
| Platform selection | Yes | Same project type = same platform |
| Rollback plan | Yes | Fixed per platform |
| Pre-deploy check | Yes | Fixed checklist |
| Full deployment plan | Yes | Deterministic composition |

---

## 7. Execution Model

### 4-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate request type, risk level, project context | Validated input or error |
| **Evaluate** | Traverse deployment decision tree | Strategy + platform selection |
| **Compose** | Assemble deployment plan with rollback, checklists, monitoring | Complete deployment plan |
| **Emit** | Return structured output with metadata | Complete output schema |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed decision tree ordering | project_type ? scale ? risk_level ? change_type ? constraints |
| Fixed rollback target | = 5 minutes for all platforms |
| Fixed monitoring window | = 15 minutes post-deploy |
| Fixed pre-deploy checklist | 6 items; no optional items |
| No external calls | Decisions use only local reference files |
| No ambient state | Each invocation operates solely on explicit inputs |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

Each invocation produces an identical output for identical inputs. No session, no memory, no accumulated state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported request type |
| Missing context field | Return `ERR_MISSING_CONTEXT` with field name | Supply missing field |
| Conflicting constraints | Return `ERR_CONSTRAINT_CONFLICT` | Resolve conflict |
| Invalid project type | Return `ERR_INVALID_PROJECT_TYPE` | Use supported project type |
| Invalid risk level | Return `ERR_INVALID_RISK_LEVEL` | Use: low, medium, high, critical |
| Unsupported platform | Return `ERR_UNSUPPORTED_PLATFORM` | Choose supported platform |
| Reference file missing | Return `ERR_REFERENCE_NOT_FOUND` | Verify skill installation |
| Database migration conflict | Return `ERR_MIGRATION_CONFLICT` | Separate migration from deploy |

**Invariant:** Every failure returns a structured error. No silent failures. On ambiguous risk, default to highest risk level.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not one of the 7 supported types |
| `ERR_MISSING_CONTEXT` | Validation | Yes | Required context field is null or empty |
| `ERR_CONSTRAINT_CONFLICT` | Validation | Yes | Constraints contradict each other |
| `ERR_INVALID_PROJECT_TYPE` | Validation | No | Project type not recognized |
| `ERR_INVALID_RISK_LEVEL` | Validation | No | Risk level not one of: low, medium, high, critical |
| `ERR_UNSUPPORTED_PLATFORM` | Validation | Yes | Platform not in supported list |
| `ERR_REFERENCE_NOT_FOUND` | Infrastructure | No | Reference file missing |
| `ERR_MIGRATION_CONFLICT` | Validation | Yes | Database migration bundled with feature deploy |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation timeout | N/A | N/A | Synchronous decision tree; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |
| Reference file read timeout | 1,000 ms | 1,000 ms | Local filesystem |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "cicd-pipeline",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "strategy": "string",
  "platform": "string",
  "risk_level": "string",
  "project_type": "string",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Deployment plan generated | INFO | All fields |
| Plan generation failed | ERROR | All fields + error_code |
| High-risk deployment planned | WARN | risk_level, strategy, constraints |
| Reference file read | DEBUG | file path, duration |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `cicd.decision.duration` | Histogram | ms |
| `cicd.decision.error_rate` | Counter | per error_code |
| `cicd.strategy.selected` | Counter | per strategy |
| `cicd.risk_level.distribution` | Counter | per risk level |
| `cicd.platform.selected` | Counter | per platform |

---

## 14. Security & Trust Model

### Credential Handling

- CI/CD Pipeline does not store, process, or transmit credentials, API keys, or deployment tokens.
- Deployment secrets are referenced by name (e.g., "use `DEPLOY_KEY` from vault"), never by value.

### Pre-Deploy Security

- Every deployment plan includes security-scanner invocation as a pre-deploy step.
- Plans flag database migrations, breaking API changes, and security patches for elevated review.

### Input Sanitization

- Context parameters are used for decision tree traversal, not code execution.
- No eval, no template injection, no dynamic code generation.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Reference storage | 2 reference files (~5 KB total) | Static; no growth |
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
| Strategy selection | < 5 ms | < 20 ms | 50 ms |
| Full deployment plan | < 10 ms | < 30 ms | 100 ms |
| Reference file read | < 1 ms | < 5 ms | 1,000 ms |
| Output size | = 1,000 chars | = 3,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Outdated platform recommendations | Medium | Incorrect deployment target | Version-bumped references; periodic review |
| Rollback procedure mismatch | Low | Failed rollback attempt | Per-platform validated rollback methods |
| Database migration in rollback | High | Data loss on rollback | Flag migration separately; `ERR_MIGRATION_CONFLICT` |
| Risk level under-estimation | Medium | Insufficient deployment precautions | Default to highest risk on ambiguity |
| Post-deploy monitoring skipped | Medium | Silent production failures | Mandatory 15-minute monitoring window in every plan |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies |
| When to Use section | ? | Deployment scenario decision table |
| Quick Reference | ? | 5-phase deployment, platform selection |
| Core content matches skill type | ? | Expert type: decision trees, checklists |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to git-workflow, security-scanner, gitops |
| Content Map for multi-file | ? | Links to reference files + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes in Integration Model |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 5-phase deployment lifecycle defined | ? |
| **Functionality** | 3 zero-downtime strategies (rolling, blue-green, canary) | ? |
| **Functionality** | Per-platform rollback procedures | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Contracts** | Agent assumptions and non-assumptions documented | ? |
| **Failure** | Error taxonomy with 8 categorized error codes | ? |
| **Failure** | No silent failures; default to highest risk on ambiguity | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed decision tree ordering | ? |
| **Determinism** | Fixed rollback target (= 5 min) and monitoring window (= 15 min) | ? |
| **Security** | No credential storage; secrets referenced by name | ? |
| **Security** | Pre-deploy security scan mandatory in every plan | ? |
| **Observability** | Structured log schema with 5 mandatory fields + 4 log points | ? |
| **Observability** | 5 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel invocations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? ## OpenTelemetry Observability (MANDATORY)

- **DORA Metrics**: EVERY CI/CD pipeline job MUST emit OpenTelemetry Spans to calculate DORA Metrics (Deployment Frequency, Lead Time for Changes).
- **Distributed Tracing**: Trace context MUST be propagated from PR creation through the entire deployment pipeline to production.

---

PikaKit v3.9.206
