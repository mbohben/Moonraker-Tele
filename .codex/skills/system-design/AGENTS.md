# system-design

**Version 1.0.0**
Engineering
March 2026

> **Note:**
> This document is for agents and LLMs to follow when working on system-design domain.
> Optimized for automation and consistency by AI-assisted workflows.

---

# System Design � Architecture Decision Framework

> Requirements drive architecture. Trade-offs inform decisions. ADRs capture rationale.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Starting architecture | Read context-discovery.md |
| Documenting decisions | Use ADR template |
| Choosing patterns | Check pattern-selection.md |
| Reference examples | See examples.md |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Context discovery (project classification) | API design (? api-architect) |
| Trade-off analysis (ADR format) | Database design (? data-modeler) |
| Pattern selection (decision trees) | Deployment (? cicd-pipeline) |
| Architecture validation (6-item checklist) | Code implementation |

**Expert decision skill:** Produces architecture recommendations. Does not write code.

---

## Core Principle (Fixed)

**"Simplicity is the ultimate sophistication."**

1. Start simple
2. Add complexity ONLY when proven necessary
3. You can always add patterns later
4. Removing complexity is MUCH harder than adding it

---

## ADR Format (6 Sections � Fixed)

| Section | Purpose |
|---------|---------|
| Title | Decision being made |
| Status | proposed / accepted / deprecated |
| Context | Why this decision is needed |
| Options | Each option with pros and cons |
| Decision | Selected option with rationale |
| Consequences | Impact of the decision |

---

## Validation Checklist (6 Items � Fixed)

- [ ] Requirements clearly understood
- [ ] Constraints identified
- [ ] Each decision has trade-off analysis
- [ ] Simpler alternatives considered
- [ ] ADRs written for significant decisions
- [ ] Team expertise matches chosen patterns

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_PROJECT_TYPE` | Yes | Project type not one of 3 |
| `ERR_MISSING_TOPIC` | Yes | Trade-off requires decision topic |
| `ERR_UNKNOWN_SCALE` | Yes | Scale not startup, growth, or enterprise |

**Zero internal retries.** Same project type + constraints = same recommendation.

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|-------|
| Over-engineer from day one | Start simple, add complexity when needed |
| Skip trade-off analysis | Document pros/cons for every option |
| Copy architecture from tutorials | Match patterns to actual constraints |
| Ignore team expertise | Choose patterns team can maintain |

---

## ?? Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [context-discovery.md](context-discovery.md) | Project classification questions | Starting architecture |
| [trade-off-analysis.md](trade-off-analysis.md) | ADR templates, trade-off framework | Documenting decisions |
| [pattern-selection.md](pattern-selection.md) | Decision trees, anti-patterns | Choosing patterns |
| [patterns-reference.md](patterns-reference.md) | Quick pattern lookup | Pattern comparison |
| [examples.md](examples.md) | MVP, SaaS, Enterprise examples | Reference implementations |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## ?? Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design patterns |
| `data-modeler` | Skill | Database schema design |
| `cicd-pipeline` | Skill | Deployment architecture |

---



---

## Detailed Rules


---

### Rule: engineering-spec

---
name: system-design-engineering-spec
description: Full 21-section engineering spec � context discovery, ADR format, pattern selection, 6-item validation checklist
---

# System Design � Engineering Specification

> Production-grade specification for architectural decision-making at FAANG scale.

---

## 1. Overview

System Design provides a structured framework for architectural decision-making: requirements analysis (via context-discovery), trade-off evaluation (via ADR format), pattern selection (via decision trees), and architecture validation (6-item checklist). The skill operates as an **Expert (decision tree)** � it produces architecture recommendations, trade-off analyses, ADR documents, and pattern selections. It does not implement systems, write code, or deploy infrastructure.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Architecture decisions at scale face four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| No requirements discovery | 50% of projects skip context questions | Wrong architecture |
| Undocumented decisions | 60% of architecture choices lack ADRs | Lost rationale |
| Premature complexity | 45% of projects over-engineer from day one | Wasted effort |
| Wrong pattern selection | 35% of projects use mismatched patterns | Refactoring debt |

System Design eliminates these with structured context discovery (project classification), ADR templates (formal trade-off documentation), pattern decision trees (deterministic routing), and a validation checklist (6 mandatory checks).

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Requirements analysis | Structured context discovery with project classification |
| G2 | Trade-off evaluation | ADR format with explicit pros/cons/consequences |
| G3 | Pattern selection | Decision trees routing to specific patterns |
| G4 | Architecture validation | 6-item checklist before finalization |
| G5 | Simplicity principle | Start simple; add complexity only when proven necessary |
| G6 | Reference implementations | 3 example types: MVP, SaaS, Enterprise |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | API design specifics | Owned by `api-architect` skill |
| NG2 | Database schema design | Owned by `data-modeler` skill |
| NG3 | Deployment configuration | Owned by `cicd-pipeline` skill |
| NG4 | Code implementation | Architecture guidance only |
| NG5 | Performance benchmarking | Owned by `perf-optimizer` skill |
| NG6 | Security audit | Owned by `security-scanner` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Context discovery | Project classification questions | Requirements gathering |
| Trade-off analysis | ADR template + framework | Decision enforcement |
| Pattern selection | Decision trees for routing | Pattern implementation |
| Architecture validation | 6-item checklist | Testing/verification |
| Examples | MVP, SaaS, Enterprise references | Production deployments |

**Side-effect boundary:** System Design produces architecture recommendations, ADR documents, and pattern selections. It does not write code, create infrastructure, or modify systems.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "context-discovery" | "trade-off" | "pattern-selection" |
                              # "validation" | "example" | "full-review"
Context: {
  project_type: string | null # "mvp" | "saas" | "enterprise" | null
  scale: string | null        # "startup" | "growth" | "enterprise"
  constraints: Array<string> | null  # e.g., ["latency < 100ms", "global distribution"]
  current_patterns: Array<string> | null  # Existing patterns in use
  decision_topic: string | null  # What decision needs analysis
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  context: {
    classification: string
    questions: Array<string>
    constraints_identified: Array<string>
  } | null
  trade_off: {
    title: string
    status: string            # "proposed" | "accepted" | "deprecated"
    context: string
    options: Array<{
      name: string
      pros: Array<string>
      cons: Array<string>
    }>
    decision: string
    consequences: Array<string>
  } | null
  pattern: {
    recommended: string
    rationale: string
    alternatives: Array<string>
    anti_patterns: Array<string>
  } | null
  validation: {
    checklist: Array<{
      item: string
      status: boolean
      notes: string | null
    }>
    passed: boolean
  } | null
  example: {
    type: string              # "mvp" | "saas" | "enterprise"
    architecture: string
    patterns_used: Array<string>
  } | null
  security: {
    rules_of_engagement_followed: boolean
  } | null
  code_quality: {
    problem_checker_run: boolean
  } | null
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

- Context discovery produces the same questions for the same project type.
- Pattern selection routes deterministically based on scale + constraints.
- Validation checklist is fixed: 6 items, deterministic pass/fail.
- ADR format is fixed: title, status, context, options, decision, consequences.
- Same project type + same constraints = same pattern recommendation.

#### What Agents May Assume

- Context discovery includes project classification.
- Trade-off analysis follows ADR format.
- Pattern selection uses documented decision trees.
- Validation checklist covers 6 mandatory items.

#### What Agents Must NOT Assume

- Recommended pattern is the only valid option.
- All constraints are known upfront.
- Architecture is final after first pass.
- Simpler alternative has been considered unless explicitly stated.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Context discovery | None; questions output |
| Trade-off analysis | None; ADR document |
| Pattern selection | None; recommendation |
| Validation | None; checklist results |
| Example | None; reference output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Invoke context-discovery to classify project and identify constraints
2. Invoke pattern-selection for architecture pattern routing
3. Invoke trade-off for ADR documentation of key decisions
4. Invoke validation to verify 6-item checklist
5. Implement architecture (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete output.
- All operations are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Unknown project type | Return error | Specify mvp, saas, or enterprise |
| Missing constraints | Return warning | Provide constraints for better routing |
| Invalid request type | Return error | Use supported type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Context discovery | Yes | Same type = same questions |
| Trade-off | Yes | Same topic = same ADR structure |
| Pattern selection | Yes | Same constraints = same pattern |
| Validation | Yes | Same inputs = same checklist |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Parse project type, scale, constraints | Classification |
| **Guide** | Generate context questions, pattern recommendation, ADR, or validation | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Simplicity first | Start simple; add complexity ONLY when proven necessary |
| Context discovery | Structured questions by project classification |
| ADR format | Fixed 6-section format: title, status, context, options, decision, consequences |
| Pattern routing | Decision trees based on scale + constraints (see pattern-selection.md) |
| Validation checklist | 6 items: requirements understood, constraints identified, trade-offs analyzed, simpler alternatives considered, ADRs written, team expertise matches |
| Example types | 3 fixed: MVP (minimal), SaaS (multi-tenant), Enterprise (complex) |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown project type | Return `ERR_UNKNOWN_PROJECT_TYPE` | Specify mvp, saas, or enterprise |
| Missing decision topic | Return `ERR_MISSING_TOPIC` | Provide decision topic for trade-off |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** Every failure returns a structured error. No partial architecture guidance.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_PROJECT_TYPE` | Validation | Yes | Project type not one of 3 |
| `ERR_MISSING_TOPIC` | Validation | Yes | Trade-off analysis requires topic |
| `ERR_UNKNOWN_SCALE` | Validation | Yes | Scale not startup, growth, or enterprise |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format (OpenTelemetry Event Array)

```json
{
  "traceId": "uuid",
  "spanId": "uuid",
  "events": [
    {
      "name": "architecture_analysis_started",
      "timestamp": "ISO8601",
      "attributes": {
        "project_type": "saas",
        "scale": "growth"
      }
    },
    {
      "name": "pattern_recommended",
      "timestamp": "ISO8601",
      "attributes": {
        "pattern": "event-driven",
        "rationale": "decoupling"
      }
    },
    {
      "name": "adr_generated",
      "timestamp": "ISO8601",
      "attributes": {
        "decision_topic": "database_selection",
        "status": "proposed"
      }
    },
    {
      "name": "analysis_completed",
      "timestamp": "ISO8601",
      "attributes": {
        "validation_passed": true,
        "trade_offs_analyzed": 3
      }
    }
  ]
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Context classified | INFO | project_type, scale |
| Pattern recommended | INFO | pattern_recommended, rationale |
| ADR generated | INFO | decision_topic, status |
| Validation complete | INFO | checklist_passed, items_count |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `systemdesign.decision.duration` | Histogram | ms |
| `systemdesign.project_type.distribution` | Counter | per type |
| `systemdesign.pattern.distribution` | Counter | per pattern |
| `systemdesign.validation.pass_rate` | Gauge | percentage |

---

## 14. Security & Trust Model

### Data Handling

- System Design processes project types, scales, and constraints only.
- No credentials, no PII, no infrastructure access.
- No network calls, no file modifications, no code execution.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
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
| Context discovery | < 2 ms | < 5 ms | 20 ms |
| Pattern selection | < 2 ms | < 5 ms | 20 ms |
| Trade-off analysis | < 5 ms | < 15 ms | 50 ms |
| Validation | < 2 ms | < 5 ms | 20 ms |
| Full review | < 15 ms | < 40 ms | 50 ms |
| Output size | = 5,000 chars | = 10,000 chars | 15,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| New architecture patterns | Medium | Outdated decision trees | Annual pattern review |
| Cloud provider changes | Low | Invalid scaling guidance | Track major cloud updates |
| Team ignores ADRs | Medium | Undocumented decisions | Enforce ADR in PR process |
| Over-engineering bias | Medium | Complexity debt | Simplicity-first validation check |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: context discovery, trade-off analysis, pattern selection |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to api-architect, data-modeler |
| Content Map for multi-file | ? | Links to 5 reference files + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | Context discovery with project classification | ? |
| **Functionality** | Trade-off analysis with ADR format | ? |
| **Functionality** | Pattern selection with decision trees | ? |
| **Functionality** | Architecture validation (6-item checklist) | ? |
| **Functionality** | 3 example types (MVP, SaaS, Enterprise) | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 4 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed ADR format, fixed checklist, fixed decision trees | ? |
| **Security** | No credentials, no infrastructure, no code | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
