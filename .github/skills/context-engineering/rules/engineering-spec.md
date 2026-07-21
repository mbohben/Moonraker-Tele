---
title: Context Engineering � Engineering Specification
impact: MEDIUM
tags: context-engineering
---

# Context Engineering � Engineering Specification

> Production-grade specification for context window management and token consumption control at FAANG scale.

---

## 1. Overview

Context Engineering provides structured decision frameworks for managing LLM context windows: token budget monitoring, four-bucket reduction strategy (Write/Select/Compress/Isolate), degradation pattern detection, compression technique selection, and multi-agent context isolation. The skill operates as an expert knowledge base that produces context management decisions � it does not modify context windows or execute compression.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Context management at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Token exhaustion | 30% of complex tasks exceed context window | Truncation, lost instructions, failed tasks |
| Lost-in-middle degradation | Content in middle 40% of context receives 50% less attention | Critical information ignored |
| Multi-agent context overhead | Each sub-agent costs ~15x baseline tokens | Cost explosion on multi-agent workflows |
| No compression baseline | 60% of teams add context without measuring utilization | Preventable quality degradation |

Context Engineering eliminates these by providing fixed thresholds, deterministic bucket selection, and measurable compression targets.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Token utilization monitoring | Warning at 70%; action required at 80% |
| G2 | Compression with quality preservation | 50�70% token reduction; < 5% quality loss |
| G3 | Degradation detection | 4 named patterns with specific symptoms and fixes |
| G4 | Multi-agent cost control | Overhead tracked and budgeted per sub-agent |
| G5 | Cache effectiveness | Target > 70% cache hit rate for stable workloads |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Token counting implementation | Model-specific; not a strategy concern |
| NG2 | Embedding/vector search implementation | RAG pipeline is infrastructure |
| NG3 | LLM API cost billing | Financial tooling |
| NG4 | Agent orchestration execution | Owned by `lifecycle-orchestrator` skill |
| NG5 | System architecture design | Owned by `system-design` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Token utilization thresholds (70%/80%) | Threshold definition and monitoring strategy | Token counting library |
| Four-bucket strategy (Write/Select/Compress/Isolate) | Strategy selection and application | Implementation execution |
| Degradation pattern detection (4 patterns) | Pattern catalog and fix recommendations | Automatic detection tooling |
| Compression technique selection (3 strategies) | Strategy decision tree | Summarization model |
| Multi-agent context isolation (4 patterns) | Pattern selection | Agent instantiation |

**Side-effect boundary:** Context Engineering produces context management decisions, compression strategies, and isolation recommendations. It does not modify context windows, execute summarization, or instantiate agents.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "utilization-check" | "bucket-strategy" | "degradation-diagnosis" |
                              # "compression-plan" | "isolation-plan" | "full-audit"
Context: {
  current_utilization: number | null  # 0.0�1.0 (percentage of window used)
  window_size: number | null          # Total context window tokens
  content_type: string                # "code" | "documentation" | "conversation" | "mixed"
  symptoms: Array<string> | null      # Observed quality issues
  agent_count: number | null          # Number of active sub-agents
  task_complexity: string             # "simple" | "moderate" | "complex" | "multi-phase"
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "healthy" | "warning" | "critical" | "error"
Data: {
  utilization: {
    current: number           # 0.0�1.0
    threshold_warning: number # 0.70
    threshold_critical: number # 0.80
    status: string            # "healthy" | "warning" | "critical"
  } | null
  strategy: {
    primary_bucket: string    # "write" | "select" | "compress" | "isolate"
    actions: Array<{
      action: string
      expected_reduction: string  # e.g., "30�50%"
      quality_risk: string        # "none" | "low" | "medium"
    }>
  } | null
  degradation: {
    pattern: string | null    # "lost-in-middle" | "context-poisoning" | "attention-dilution" | "token-exhaustion"
    fix: string
  } | null
  compression: {
    technique: string         # "hierarchical-summarization" | "selective-loading" | "progressive-disclosure"
    steps: Array<string>
    target_reduction: string  # "50�70%"
    quality_limit: string     # "< 5% quality loss"
  } | null
  isolation: {
    pattern: string           # "orchestrator" | "pipeline" | "parallel" | "hierarchical"
    rationale: string
    overhead_estimate: string # e.g., "~15x per sub-agent"
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

- Same `Request_Type` + `Context` = identical strategy output.
- Utilization thresholds are fixed: warning at 0.70, critical at 0.80.
- Compression target is fixed: 50�70% reduction with < 5% quality loss.
- Multi-agent overhead is fixed at ~15x baseline per sub-agent.
- Bucket selection order: Write ? Select ? Compress ? Isolate (escalating intervention).
- No randomization, no probabilistic scoring.

#### What Agents May Assume

- Utilization status accurately reflects thresholds.
- Bucket strategy is appropriate for the reported symptoms and utilization.
- Compression target (50�70%) is achievable for most content types.
- Degradation pattern diagnosis addresses the reported symptoms.

#### What Agents Must NOT Assume

- Token utilization numbers are automatically measured (caller provides them).
- Compression execution is handled by this skill.
- The skill instantiates sub-agents for isolation.
- Quality loss measurement is automated.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Utilization check | None; threshold comparison |
| Bucket strategy | None; decision output |
| Degradation diagnosis | None; pattern matching |
| Compression plan | None; strategy output |
| Isolation plan | None; architecture recommendation |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Measure current token utilization (caller's responsibility)
2. Invoke utilization-check with current percentage
3. If warning/critical: invoke bucket-strategy for reduction plan
4. If symptoms observed: invoke degradation-diagnosis
5. Execute recommended strategy (caller's responsibility)
6. Re-measure to verify reduction (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete, self-contained recommendation.
- No background processes, no deferred execution.
- Bucket strategies are ordered by intervention level (least invasive first).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported request type |
| Missing utilization data | Return error to caller | Measure and supply utilization |
| Invalid utilization range | Return error to caller | Supply value 0.0�1.0 |
| Unknown content type | Return warning; apply generic strategy | Supply known content type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.
- Callers re-measure and re-invoke after applying strategies.

#### Isolation Model

- Each invocation is stateless and independent.
- No shared state between invocations.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Utilization check | Yes | Same value = same status |
| Bucket strategy | Yes | Same context = same strategy |
| Degradation diagnosis | Yes | Same symptoms = same pattern |
| Compression plan | Yes | Deterministic per content type |
| Isolation plan | Yes | Deterministic per task complexity |

---

## 7. Execution Model

### 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate request type and context fields | Validated input or error |
| **Evaluate** | Apply decision tree for strategy/diagnosis | Recommendation |
| **Emit** | Return structured output with metadata | Complete output schema |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed utilization thresholds | Warning: 0.70; Critical: 0.80 |
| Fixed compression target | 50�70% reduction; < 5% quality loss |
| Fixed bucket escalation order | Write ? Select ? Compress ? Isolate |
| Fixed multi-agent overhead | ~15x baseline per sub-agent |
| Fixed degradation catalog | 4 patterns: lost-in-middle, context-poisoning, attention-dilution, token-exhaustion |
| No external calls | Decisions use only embedded rules |
| No ambient state | Each invocation operates solely on explicit inputs |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

Each invocation produces an identical output for identical inputs. No session, no memory, no accumulated context metrics.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported request type |
| Missing utilization value | Return `ERR_MISSING_UTILIZATION` | Measure and supply |
| Out-of-range utilization | Return `ERR_INVALID_RANGE` | Supply value 0.0�1.0 |
| Missing window size | Return `ERR_MISSING_WINDOW_SIZE` | Supply window size |
| Unknown content type | Return `WARN_UNKNOWN_CONTENT`; apply generic | Supply known type |
| No symptoms provided for diagnosis | Return `ERR_MISSING_SYMPTOMS` | Supply observed symptoms |

**Invariant:** Every failure returns a structured error. No silent fallback.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not one of the 6 supported types |
| `ERR_MISSING_UTILIZATION` | Validation | Yes | Current utilization not provided |
| `ERR_INVALID_RANGE` | Validation | No | Utilization value outside 0.0�1.0 |
| `ERR_MISSING_WINDOW_SIZE` | Validation | Yes | Context window size not provided |
| `ERR_MISSING_SYMPTOMS` | Validation | Yes | No symptoms for degradation diagnosis |
| `WARN_UNKNOWN_CONTENT` | Warning | Yes | Content type not recognized; generic strategy applied |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation timeout | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "context-engineering",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "utilization": "number|null",
  "strategy_bucket": "string|null",
  "degradation_pattern": "string|null",
  "compression_technique": "string|null",
  "status": "healthy|warning|critical|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Strategy generated | INFO | All fields |
| Utilization critical (= 0.80) | WARN | utilization, strategy_bucket |
| Degradation diagnosed | WARN | degradation_pattern, fix |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `context.decision.duration` | Histogram | ms |
| `context.utilization.distribution` | Histogram | 0.0�1.0 |
| `context.bucket.selected` | Counter | per bucket |
| `context.degradation.detected` | Counter | per pattern |
| `context.request_type.distribution` | Counter | per request type |

---

## 14. Security & Trust Model

### Data Handling

- Context Engineering does not access, read, or store actual context window content.
- It operates on metadata (utilization percentage, content type, symptoms) only.
- No PII handling. No credential handling.

### Input Integrity

- Utilization values are validated to 0.0�1.0 range.
- No code execution, no eval, no template injection.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Rule storage | Embedded rules (~3 KB) | Static; no growth |
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
| Strategy output | Emit phase | Caller | Invocation scope |
| Rule evaluation context | Parse phase | Invocation completion | Invocation scope |

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Utilization check | < 2 ms | < 5 ms | 20 ms |
| Full audit (all strategies) | < 10 ms | < 30 ms | 100 ms |
| Output size | = 500 chars | = 2,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Utilization self-reported inaccurately | Medium | Wrong strategy selected | Multiple symptoms required for critical actions |
| Compression overshoot (> 5% quality loss) | Low | Information loss | Fixed 50�70% target with quality limit |
| Multi-agent overhead underestimated | Medium | Cost overrun | Fixed ~15x multiplier documented |
| Degradation misdiagnosed | Low | Wrong fix applied | Pattern matching requires specific symptoms |
| Fixed thresholds too aggressive | Low | Premature intervention | 70% warning / 80% critical are conservative |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | LLM context window knowledge, token counting |
| When to Use section | ? | Utilization-based decision table |
| Core content matches skill type | ? | Expert type: decision trees, thresholds, patterns |
| Troubleshooting section | ? | Degradation patterns with fixes |
| Related section | ? | Cross-links to lifecycle-orchestrator, system-design |
| Content Map for multi-file | ? | Links to rules/ + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | Four-bucket strategy (Write/Select/Compress/Isolate) | ? |
| **Functionality** | 4 degradation patterns with fixes | ? |
| **Functionality** | 3 compression techniques | ? |
| **Functionality** | 4 multi-agent isolation patterns | ? |
| **Functionality** | Fixed utilization thresholds (70%/80%) | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Contracts** | Agent assumptions and non-assumptions documented | ? |
| **Failure** | Error taxonomy with 6 categorized codes | ? |
| **Failure** | No silent fallback; all failures return structured errors | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed thresholds, fixed bucket order, fixed compression target | ? |
| **Security** | No context content access; metadata-only operation | ? |
| **Observability** | Structured log schema with 5 mandatory fields + 4 log points | ? |
| **Observability** | 5 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel invocations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? ## OpenTelemetry Observability (MANDATORY)

- **Context Utilization Gauge**: EVERY context analysis MUST emit an OpenTelemetry Gauge metric recording token utilization percentage and signal quality distribution.
- **Threshold Alerts**: Utilization crossing 70% or 80% MUST trigger an OTel Event with recommended bucket strategy.

---

PikaKit v3.9.206
