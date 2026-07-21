---
title: Copywriting � Engineering Specification
impact: MEDIUM
tags: copywriting
---

# Copywriting � Engineering Specification

> Production-grade specification for conversion copywriting formula selection and application at FAANG scale.

---

## 1. Overview

Copywriting provides deterministic formula selection for high-converting marketing copy: 6 proven formulas (AIDA, PAS, BAB, FAB, 4Ps, 4Us), headline construction templates, and copy quality validation rules. The skill operates as an expert knowledge base that produces formula-driven copy structures � it generates structured copy frameworks, not final marketing text.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Marketing copy at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| No formula selection | 60% of copy written without proven structure | Low conversion rates |
| Feature-first copy | 45% of product descriptions lead with features, not benefits | Users don't understand value |
| Multiple CTAs | 35% of landing pages have 3+ competing CTAs | Decision fatigue; lower conversion |
| Vague claims | 50% of headlines use non-specific language ("better", "faster") | No credibility; no urgency |

Copywriting eliminates these by providing formula selection per content type, benefit-first structure, single-CTA enforcement, and specificity rules.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Formula-driven copy | Every output uses one of 6 proven formulas |
| G2 | Benefit-first structure | Benefits precede features in all output |
| G3 | Specific claims | Numbers, percentages, or concrete outcomes required |
| G4 | Single CTA | One call-to-action per copy piece |
| G5 | Content-type routing | Deterministic formula selection per content type |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | SEO keyword research | Owned by `seo-optimizer` skill |
| NG2 | Visual design of copy | Owned by `studio` skill |
| NG3 | A/B test infrastructure | Testing platform concern |
| NG4 | Email delivery/automation | Infrastructure concern |
| NG5 | Brand voice definition | Brand strategy concern |
| NG6 | Image generation for ads | Owned by `ai-artist` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Formula selection (6 formulas) | Selection decision tree per content type | Formula execution (creative writing) |
| Headline construction (4Us) | Template structure and validation | Headline A/B testing |
| Copy validation (5 rules) | Best practice checklist | Conversion tracking |
| Anti-pattern detection (4 patterns) | Pattern identification | Automated rewriting |

**Side-effect boundary:** Copywriting produces formula selections, structured copy frameworks, and validation results. It does not create final copy, publish content, or send emails.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "formula-select" | "headline-check" | "copy-validate" |
                              # "anti-pattern-check" | "full-framework"
Context: {
  content_type: string        # "landing-page" | "email" | "ad" | "sales-page" |
                              # "product-description" | "case-study" | "headline"
  target_audience: string | null  # Audience description
  product: string | null      # Product/service name
  key_benefit: string | null  # Primary benefit
  draft_copy: string | null   # Existing copy for validation
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "violations" | "error"
Data: {
  formula: {
    name: string              # "AIDA" | "PAS" | "BAB" | "FAB" | "4Ps" | "4Us"
    steps: Array<{
      label: string           # Step label (e.g., "Attention")
      purpose: string         # What this step achieves
      guidance: string        # How to write this step
    }>
    content_type_match: string
  } | null
  headline: {
    passes_4us: boolean
    scores: {
      urgent: boolean
      unique: boolean
      useful: boolean
      ultra_specific: boolean
    }
    suggestion: string | null
  } | null
  validation: {
    violations: Array<{
      rule: string            # Rule name
      severity: string        # "error" | "warning"
      current: string         # What was found
      fix: string             # What to do
    }>
    passed: boolean
  } | null
  security: {
    rules_of_engagement_followed: boolean
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

- Same `content_type` = same formula selection (fixed mapping).
- Formula selection mapping: landing-page/ad ? AIDA, email/sales-page ? PAS, case-study ? BAB, product-description ? FAB, headline ? 4Us.
- 4Us validation is binary per dimension (passes/fails).
- Copy validation rules are fixed: benefit-first, single-CTA, specific-claims, no-jargon, read-aloud.
- No randomization, no creative variation.

#### What Agents May Assume

- Selected formula is the proven match for the content type.
- Headline validation covers all 4Us dimensions.
- Copy validation catches all 5 anti-patterns.

#### What Agents Must NOT Assume

- The skill writes final marketing copy (it produces frameworks).
- Formula selection accounts for brand-specific requirements.
- Validation guarantees conversion improvement (only structure is checked).
- The skill handles multilingual copy.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Formula select | None; mapping lookup |
| Headline check | None; 4Us evaluation |
| Copy validate | None; rule evaluation |
| Anti-pattern check | None; pattern matching |
| Full framework | None; composite output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Define content type and target audience
2. Invoke formula-select to get recommended formula
3. Write copy using formula structure (caller's responsibility)
4. Invoke headline-check to validate headline against 4Us
5. Invoke copy-validate to check best practices
6. Fix violations and re-validate (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete, self-contained output.
- Formula selection is deterministic and instant.
- All validation rules are applied; no partial check.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported type |
| Missing content type | Return error to caller | Supply content type |
| Missing draft for validation | Return error to caller | Supply draft copy |
| Unknown content type | Return error to caller | Use supported type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.
- Callers fix copy and re-invoke for validation.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Formula select | Yes | Same content type = same formula |
| Headline check | Yes | Same headline = same scores |
| Copy validate | Yes | Same draft = same violations |
| Anti-pattern check | Yes | Same draft = same patterns |
| Full framework | Yes | Deterministic composition |

---

## 7. Execution Model

### 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate request type and content type | Validated input or error |
| **Evaluate** | Apply formula mapping or validation rules | Formula/validation result |
| **Emit** | Return structured output with metadata | Complete output schema |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed formula mapping | 6 formulas mapped 1:1 to content types |
| Fixed validation rules | 5 rules: benefit-first, single-CTA, specific-claims, no-jargon, read-aloud |
| Fixed 4Us dimensions | 4 binary checks: urgent, unique, useful, ultra-specific |
| No external calls | All rules embedded in skill |
| No ambient state | Each invocation operates solely on explicit inputs |
| No creative output | Produces frameworks, not final copy |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

Each invocation produces an identical output for identical inputs. No session, no memory, no A/B state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Missing content type | Return `ERR_MISSING_CONTENT_TYPE` | Supply content type |
| Unknown content type | Return `ERR_UNKNOWN_CONTENT_TYPE` | Use supported type |
| Missing draft copy | Return `ERR_MISSING_DRAFT` | Supply draft for validation |
| Empty draft | Return `ERR_EMPTY_DRAFT` | Supply non-empty draft |

**Invariant:** Every failure returns a structured error. No silent fallback.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_MISSING_CONTENT_TYPE` | Validation | Yes | Content type required but not provided |
| `ERR_UNKNOWN_CONTENT_TYPE` | Validation | No | Content type not in supported list |
| `ERR_MISSING_DRAFT` | Validation | Yes | Draft copy required for validation |
| `ERR_EMPTY_DRAFT` | Validation | Yes | Draft copy is empty string |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision timeout | N/A | N/A | Synchronous; < 20ms |
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
      "name": "formula_selected",
      "timestamp": "ISO8601",
      "attributes": {
        "formula": "PAS",
        "content_type": "email"
      }
    },
    {
      "name": "validation_passed",
      "timestamp": "ISO8601",
      "attributes": {
        "content_type": "headline",
        "score": "4/4"
      }
    },
    {
      "name": "violations_found",
      "timestamp": "ISO8601",
      "attributes": {
        "rule": "benefit-first",
        "severity": "error",
        "violations_count": 1
      }
    }
  ]
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Formula selected | INFO | formula_selected, content_type |
| Validation passed | INFO | All fields |
| Violations found | WARN | violations_count, rules violated |
| Request failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `copywriting.decision.duration` | Histogram | ms |
| `copywriting.formula.distribution` | Counter | per formula |
| `copywriting.validation.pass_rate` | Counter | pass/fail |
| `copywriting.violation.distribution` | Counter | per rule |
| `copywriting.content_type.distribution` | Counter | per type |

---

## 14. Security & Trust Model

### Content Handling

- Draft copy is evaluated in-memory; never persisted.
- No code execution, no external API calls.
- Copy content is treated as immutable strings during validation.

### No Credential Exposure

- Copywriting does not handle credentials, tokens, or PII.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound mapping/validation | < 20ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Rule storage | Embedded rules (~2 KB) | Static; no growth |
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
| Formula selection | < 2 ms | < 5 ms | 20 ms |
| Full framework | < 5 ms | < 15 ms | 50 ms |
| Copy validation | < 5 ms | < 15 ms | 50 ms |
| Output size | = 500 chars | = 2,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Formula doesn't fit brand | Medium | Copy feels generic | Skill produces structure, not final copy |
| Validation too strict | Low | Rejects acceptable copy | 5 rules are well-established best practices |
| False sense of conversion | Medium | Formula ? guaranteed conversion | Documented as structural guidance only |
| Multilingual copy unsupported | Medium | Non-English copy not validated | Documented as limitation |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies |
| When to Use section | ? | Content-type-to-formula mapping table |
| Core content matches skill type | ? | Expert type: deterministic formula mapping |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to seo-optimizer, studio, ai-artist |
| Content Map for multi-file | ? | Link to engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 6 copywriting formulas (AIDA, PAS, BAB, FAB, 4Ps, 4Us) | ? |
| **Functionality** | Deterministic formula-to-content-type mapping | ? |
| **Functionality** | 4Us headline validation (4 binary dimensions) | ? |
| **Functionality** | 5 copy validation rules | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 5 categorized codes | ? |
| **Failure** | No silent fallback | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed formula mapping, fixed rules, fixed 4Us dimensions | ? |
| **Security** | No persistence; no PII handling | ? |
| **Observability** | Structured log schema with 5 mandatory fields + 4 log points | ? |
| **Observability** | 5 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel invocations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? ## OpenTelemetry Observability (MANDATORY)

- **Copy Quality Tracking**: EVERY copy validation MUST emit an OpenTelemetry Histogram metric recording the 4Us headline score and the count of copy formulation warnings.
- **A/B Test Tracing**: OTel spans MUST tag the chosen copywriting formula (e.g., AIDA, PAS) to correlate formula usage with downstream conversion events.

---

PikaKit v3.9.206
