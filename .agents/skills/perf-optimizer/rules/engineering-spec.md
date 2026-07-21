---
title: Performance Profiler � Engineering Specification
impact: MEDIUM
tags: perf-optimizer
---

# Performance Profiler � Engineering Specification

> Production-grade specification for performance profiling and Core Web Vitals at FAANG scale.

---

## 1. Overview

Performance Profiler provides structured performance analysis: Core Web Vitals targeting (LCP < 2.5s, INP < 200ms, CLS < 0.1), profiling tool selection (5 tools), 4-step profiling workflow (Baseline ? Identify ? Fix ? Validate), bundle analysis (4 issues, 4 actions), runtime profiling (4 task patterns, 3 memory patterns), bottleneck diagnosis (4 symptom?cause mappings), and prioritized quick wins (5 ranked). The skill operates as an **Expert (decision tree)** � it produces profiling methodologies, tool recommendations, and fix strategies. It does not execute profiling tools, modify code, or run Lighthouse.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Performance work at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| No baseline measurement | 55% of performance fixes lack before/after data | Unknown improvement |
| Wrong profiling tool | 40% of developers use Lighthouse for runtime issues | Misdiagnosis |
| Guessing at bottlenecks | 50% of changes target non-critical paths | Wasted effort |
| Missing Core Web Vitals | 35% of sites exceed LCP 4.0s threshold | Poor user experience, SEO penalty |

Performance Profiler eliminates these with mandatory baseline measurement, deterministic tool selection (symptom ? tool), bottleneck diagnosis (symptom ? cause), and fixed Core Web Vitals targets.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Core Web Vitals targets | LCP < 2.5s, INP < 200ms, CLS < 0.1 |
| G2 | 4-step profiling workflow | Baseline ? Identify ? Fix ? Validate |
| G3 | Tool selection | 5 tools mapped to 5 problem types |
| G4 | Bundle analysis | 4 issues with 4 fix actions |
| G5 | Runtime profiling | 4 task patterns + 3 memory patterns |
| G6 | Quick wins ranked | 5 priorities ordered by impact |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Running Lighthouse | Guidance only; execution is caller's responsibility |
| NG2 | Code modification | Owned by executing agents |
| NG3 | E2E testing | Owned by `e2e-automation` skill |
| NG4 | Browser automation | Owned by Lighthouse script in `scripts/` |
| NG5 | Backend profiling implementation | Guidance in `backend-patterns.md`; execution external |
| NG6 | CDN configuration | Infrastructure concern |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Core Web Vitals targets | Threshold definitions | Measurement execution |
| Profiling tool selection | Tool ? problem mapping | Tool installation |
| Bundle analysis guidance | Issue identification + fix actions | Bundle build |
| Runtime profiling guidance | Pattern recognition | DevTools execution |
| Quick win prioritization | Ranked actions | Implementation |
| Backend profiling patterns | N+1 query detection guidance | Query execution |

**Side-effect boundary:** Performance Profiler produces methodologies, tool recommendations, and fix strategies. It does not run profiling tools, modify code, or access production systems.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "core-web-vitals" | "profiling-workflow" | "tool-select" |
                              # "bundle-analysis" | "runtime-profiling" | "memory-profiling" |
                              # "bottleneck-diagnosis" | "quick-wins" | "backend-patterns" |
                              # "full-guide"
Context: {
  symptom: string | null      # "slow-load" | "slow-interaction" | "scroll-jank" |
                              # "memory-growth" | "large-bundle" | null
  stage: string | null        # "development" | "ci-cd" | "production"
  framework: string | null    # "react" | "next" | "vue" | "angular" | null
  current_lcp: number | null  # Current LCP in seconds
  current_inp: number | null  # Current INP in milliseconds
  current_cls: number | null  # Current CLS score
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  vitals: {
    lcp: { target: string, current: number | null, status: string }
    inp: { target: string, current: number | null, status: string }
    cls: { target: string, current: number | null, status: string }
  } | null
  workflow: {
    steps: Array<{
      order: number
      phase: string           # "baseline" | "identify" | "fix" | "validate"
      action: string
    }>
  } | null
  tool: {
    recommended: string
    problem_type: string
  } | null
  bundle: {
    issues: Array<{ issue: string, indicator: string, action: string }>
  } | null
  quick_wins: Array<{
    priority: number
    action: string
    impact: string            # "high" | "medium"
  }> | null
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

- Core Web Vitals targets are fixed: LCP < 2.5s, INP < 200ms, CLS < 0.1.
- Profiling workflow is fixed: 4 steps in defined order.
- Tool selection is deterministic: symptom ? tool mapping.
- Bundle issues/actions are fixed: 4 issues, 4 actions.
- Quick wins are fixed: 5 priorities in ranked order.
- Same symptom = same tool recommendation.

#### What Agents May Assume

- Core Web Vitals thresholds match Google's published standards.
- Profiling tools are available in standard browser DevTools.
- Bundle analyzer is npm-installable.
- Lighthouse is available via CLI or browser.

#### What Agents Must NOT Assume

- Profiling tools are pre-installed.
- Current metrics are available (may be null).
- Framework-specific patterns always apply.
- Quick wins are sufficient (may need deeper analysis).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Core Web Vitals | None; threshold output |
| Tool selection | None; recommendation |
| Bundle analysis | None; issue guidance |
| Runtime profiling | None; pattern guidance |
| Quick wins | None; prioritized list |
| Backend patterns | None; guidance output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify performance symptom (slow load, jank, memory, bundle)
2. Invoke tool-select for appropriate profiling tool
3. Invoke profiling-workflow for 4-step process
4. Run profiling tool (caller's responsibility)
5. Invoke bottleneck-diagnosis with results
6. Invoke quick-wins for prioritized fix actions
7. Apply fixes (caller's responsibility)
8. Re-invoke profiling-workflow for validation
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- All decisions are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Unknown symptom | Return error | Describe symptom more specifically |
| Unknown framework | Return error | Specify supported framework |
| Invalid request type | Return error | Use supported type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Core Web Vitals | Yes | Fixed thresholds |
| Tool selection | Yes | Same symptom = same tool |
| Quick wins | Yes | Fixed ranking |
| Bundle analysis | Yes | Fixed issues/actions |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Map symptom to profiling domain | Classification |
| **Guide** | Generate tool recommendation, workflow, or fix strategy | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Core Web Vitals fixed | LCP < 2.5s (good), > 4.0s (poor); INP < 200ms (good), > 500ms (poor); CLS < 0.1 (good), > 0.25 (poor) |
| 4-step workflow fixed | Baseline ? Identify ? Fix ? Validate |
| Tool selection deterministic | Page load ? Lighthouse; Bundle ? Analyzer; Runtime ? DevTools Perf; Memory ? DevTools Memory; Network ? DevTools Network |
| Bundle issues fixed | Large deps ? import specific; Duplicates ? dedupe; Unused ? tree-shake; Missing splits ? code split |
| Quick wins ranked | 1: Compression, 2: Lazy images, 3: Code split, 4: Cache static, 5: Image formats |
| Long task threshold | > 50ms = UI blocking |
| Measure before fixing | Baseline mandatory; no guessing |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown symptom | Return `ERR_UNKNOWN_SYMPTOM` | Describe symptom |
| Unknown framework | Return `ERR_UNKNOWN_FRAMEWORK` | Specify framework |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** Every failure returns a structured error. No partial guidance.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_SYMPTOM` | Validation | Yes | Symptom not in known set |
| `ERR_UNKNOWN_FRAMEWORK` | Validation | Yes | Framework not recognized |

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
  "skill_name": "perf-optimizer",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "symptom": "string|null",
  "framework": "string|null",
  "tool_recommended": "string|null",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Tool recommended | INFO | symptom, tool_recommended |
| Vitals assessed | INFO | current_lcp, current_inp, current_cls |
| Quick wins generated | INFO | priority_count |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `perfoptimizer.decision.duration` | Histogram | ms |
| `perfoptimizer.symptom.distribution` | Counter | per symptom type |
| `perfoptimizer.tool.distribution` | Counter | per recommended tool |
| `perfoptimizer.framework.distribution` | Counter | per framework |

---

## 14. Security & Trust Model

### Data Handling

- Performance Profiler processes no credentials, API keys, or PII.
- Current metric values (LCP, INP, CLS) are numeric only.
- No network calls, no file access, no system profiling.

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
| Tool selection | < 2 ms | < 5 ms | 20 ms |
| Vitals assessment | < 2 ms | < 5 ms | 20 ms |
| Full guide | < 10 ms | < 30 ms | 50 ms |
| Output size | = 2,000 chars | = 5,000 chars | 8,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Core Web Vitals thresholds change | Low | Outdated targets | Track Google updates |
| New profiling tools emerge | Low | Missing recommendations | Annual review |
| Framework-specific patterns change | Medium | Stale guidance | Track framework releases |
| Bundle analyzer API changes | Low | Script breakage | Pin analyzer version |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies for guidance |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: tool selection, profiling workflow, vitals targets |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to e2e-automation, /optimize |
| Content Map for multi-file | ? | Links to backend-patterns.md, scripts/, engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | Core Web Vitals (LCP, INP, CLS) with thresholds | ? |
| **Functionality** | 4-step profiling workflow | ? |
| **Functionality** | 5 profiling tools with symptom mapping | ? |
| **Functionality** | Bundle analysis (4 issues + 4 actions) | ? |
| **Functionality** | Quick wins (5 ranked by impact) | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 3 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed thresholds, fixed rankings, fixed tool mappings | ? |
| **Security** | No credentials, no PII, no network access | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
