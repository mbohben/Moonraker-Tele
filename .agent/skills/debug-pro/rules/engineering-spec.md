---
title: Debug Pro � Engineering Specification
impact: MEDIUM
tags: debug-pro
---

# Debug Pro � Engineering Specification

> Production-grade specification for systematic debugging methodology at FAANG scale.

---

## 1. Overview

Debug Pro provides a deterministic 4-phase debugging methodology: Reproduce, Isolate, Understand (5 Whys), Fix & Verify. The skill produces debugging strategies, root cause analysis frameworks, isolation technique recommendations, and verification checklists. It operates as an expert knowledge base � it does not execute code, run debuggers, or modify source files.

The skill includes 3 advanced frameworks: defense-in-depth analysis, root-cause tracing, and verification-before-completion.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Debugging at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Random fix attempts | 55% of debugging sessions start with "try changing X" | 3�5x longer resolution time |
| Surface-level fixes | 40% of fixes address symptoms, not root cause | Bug recurrence within 30 days |
| No reproduction step | 30% of fixes applied without consistent reproduction | Unverifiable fix correctness |
| Missing regression tests | 45% of fixes lack regression tests | Same bug reintroduced later |

Debug Pro eliminates these by enforcing a strict 4-phase methodology with mandatory verification.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Structured reproduction | Every debug session starts with reproducible case |
| G2 | Evidence-based root cause | 5 Whys applied; root cause explains ALL symptoms |
| G3 | Verified fix | Bug no longer reproduces after fix |
| G4 | Regression protection | Regression test added for every fix |
| G5 | No random changes | All changes justified by root cause analysis |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Automated bug detection | Owned by `code-review` skill |
| NG2 | Test writing methodology | Owned by `test-architect` skill |
| NG3 | Code quality review | Owned by `code-craft` skill |
| NG4 | Performance profiling | Owned by `perf-optimizer` skill |
| NG5 | Debugger tool execution | Infrastructure concern |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| 4-phase methodology (Reproduce?Isolate?Understand?Fix&Verify) | Phase definitions, checklists, transitions | Debugger tool execution |
| 5 Whys root cause analysis | Framework and validation criteria | Automated root cause detection |
| Isolation techniques (git bisect, blame, log) | Technique selection | Git command execution |
| Verification checklist (4 items) | Checklist definition | Test execution |
| Red flag detection (5 patterns) | Pattern catalog | Automated enforcement |
| 3 advanced frameworks | Framework content files | Framework tooling |

**Side-effect boundary:** Debug Pro produces debugging strategies, checklists, and technique recommendations. It does not execute commands, modify code, or run tests.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "phase-guide" | "isolation-technique" | "root-cause-analysis" |
                              # "verification-checklist" | "red-flag-check" | "full-methodology"
Context: {
  bug_description: string     # What is the observed behavior
  expected_behavior: string   # What should happen
  current_phase: string | null  # "reproduce" | "isolate" | "understand" | "fix-verify"
  symptoms: Array<string> | null  # Observed symptoms
  hypotheses: Array<string> | null  # Current hypotheses
  changes_made: Array<string> | null  # Changes attempted so far
  environment: string | null  # Runtime environment details
  red_flag_text: string | null  # Agent's internal reasoning for red-flag check
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "red-flag" | "error"
Data: {
  phase: {
    current: string           # Current phase name
    checklist: Array<{
      item: string
      completed: boolean
    }>
    next_phase: string | null # Next phase if current complete
    blocked: boolean          # True if prerequisites unmet
    blocker_reason: string | null
  } | null
  isolation: {
    technique: string         # "git-bisect" | "git-blame" | "git-log" | "binary-search" | "printf-debug"
    command: string           # Exact command to run
    rationale: string
  } | null
  root_cause: {
    whys: Array<string>       # 5 levels of why
    root_cause: string        # Identified root cause
    validates_all_symptoms: boolean
    confidence: string        # "confirmed" | "probable" | "hypothesis"
  } | null
  verification: {
    checklist: Array<{
      check: string
      question: string
    }>
    regression_test_required: boolean
  } | null
  red_flags: Array<{
    pattern: string           # The red flag pattern matched
    correction: string        # Which phase to return to
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

- Phase transitions follow strict order: Reproduce ? Isolate ? Understand ? Fix&Verify.
- A phase cannot be skipped; prerequisites must be met.
- 5 Whys always produces exactly 5 levels.
- Root cause validity: must explain ALL reported symptoms.
- Red flag patterns are fixed (5 patterns); matching is deterministic.
- Verification checklist is fixed (4 items).

#### What Agents May Assume

- Phase guide provides a complete checklist for the current phase.
- Isolation technique is appropriate for the described context.
- Root cause analysis framework produces a structured 5 Whys chain.
- Verification checklist covers all mandatory post-fix checks.

#### What Agents Must NOT Assume

- The skill executes debugging commands or runs tests.
- Root cause analysis is automated (agent drives the analysis).
- Skipping phases is acceptable under any circumstance.
- "Tests pass" alone constitutes verification.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Phase guide | None; checklist output |
| Isolation technique | None; command recommendation |
| Root cause analysis | None; framework output |
| Verification checklist | None; checklist output |
| Red flag check | None; pattern matching |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Receive bug report with description and expected behavior
2. Invoke phase-guide with current_phase = "reproduce"
3. Complete reproduction checklist (caller executes)
4. Invoke phase-guide with current_phase = "isolate"
5. Invoke isolation-technique for command recommendation
6. Execute isolation (caller responsibility)
7. Invoke root-cause-analysis with hypotheses and symptoms
8. Invoke phase-guide with current_phase = "fix-verify"
9. Apply fix (caller responsibility)
10. Invoke verification-checklist
11. Add regression test (caller responsibility)
```

#### State Transitions

```
REPRODUCE ? ISOLATE     [reproduction checklist complete]
ISOLATE ? UNDERSTAND    [source narrowed to specific component]
UNDERSTAND ? FIX_VERIFY [root cause identified, explains all symptoms]
FIX_VERIFY ? RESOLVED   [verification checklist passed, regression test added]  // terminal state
FIX_VERIFY ? REPRODUCE  [verification failed, new symptoms observed]
UNDERSTAND ? ISOLATE    [root cause hypothesis disproven]
ANY_PHASE ? REPRODUCE   [red flag detected]
```

#### Execution Guarantees

- Each invocation produces a complete, self-contained recommendation.
- Phase order is enforced; skipping returns `ERR_PHASE_SKIP`.
- Red flag detection can reset to Phase 1 from any phase.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported type |
| Missing bug description | Return error to caller | Supply description |
| Phase skip attempt | Return error to caller | Complete current phase first |
| Red flag detected | Return red-flag status | Return to Phase 1 |

#### Retry Boundaries

- Zero internal retries. Deterministic output.
- Phase looping (Understand ? Isolate ? Understand) is explicit, not a retry.

#### Isolation Model

- Each invocation is stateless and independent.
- Phase tracking is caller's responsibility.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Phase guide | Yes | Same phase + context = same checklist |
| Isolation technique | Yes | Same context = same recommendation |
| Root cause analysis | Yes | Same symptoms + hypotheses = same framework |
| Verification checklist | Yes | Fixed 4-item checklist |
| Red flag check | Yes | Same text = same patterns matched |

---

## 7. Execution Model

### 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate request type, current phase, context | Validated input or error |
| **Evaluate** | Apply methodology rules for request type | Recommendation/checklist |
| **Emit** | Return structured output with phase transition info | Complete output schema |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed phase order | Reproduce ? Isolate ? Understand ? Fix&Verify |
| Fixed phase checklists | 4 items per phase (Reproduce: 4, Fix&Verify: 4) |
| Fixed 5 Whys depth | Exactly 5 levels, no more, no less |
| Fixed root cause criteria | Must explain ALL symptoms; "it just happens" is invalid |
| Fixed red flag patterns | 5 patterns; deterministic matching |
| Fixed verification checklist | 4 items: no reproduce, related works, no new issues, regression test |
| No external calls | Methodology embedded in skill |
| No ambient state | Phase state tracked by caller |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

Phase state (which phase is current) is tracked by the caller, not the skill. Each invocation provides current phase as input and receives phase-appropriate guidance.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Missing bug description | Return `ERR_MISSING_DESCRIPTION` | Supply description |
| Missing expected behavior | Return `ERR_MISSING_EXPECTED` | Supply expected behavior |
| Phase skip attempt | Return `ERR_PHASE_SKIP` | Complete current phase |
| Invalid phase name | Return `ERR_INVALID_PHASE` | Use valid phase name |
| Red flag detected | Return `RED_FLAG` status | Return to Phase 1 |

**Invariant:** Every failure returns a structured error. No silent progression.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_MISSING_DESCRIPTION` | Validation | Yes | Bug description not provided |
| `ERR_MISSING_EXPECTED` | Validation | Yes | Expected behavior not provided |
| `ERR_PHASE_SKIP` | Methodology | No | Attempted to skip a phase |
| `ERR_INVALID_PHASE` | Validation | No | Phase name not recognized |
| `RED_FLAG` | Methodology | Yes | Red flag pattern detected; return to Phase 1 |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision timeout | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "debug-pro",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "current_phase": "string|null",
  "red_flags_detected": "number",
  "root_cause_confidence": "string|null",
  "phase_transition": "string|null",
  "status": "success|red-flag|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Phase guidance generated | INFO | current_phase, checklist items |
| Red flag detected | WARN | pattern matched, correction phase |
| Root cause identified | INFO | confidence, validates_all_symptoms |
| Phase skip blocked | ERROR | attempted phase, current phase |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `debugpro.decision.duration` | Histogram | ms |
| `debugpro.phase.distribution` | Counter | per phase |
| `debugpro.redflag.count` | Counter | per pattern |
| `debugpro.rootcause.confidence` | Counter | per confidence level |
| `debugpro.request_type.distribution` | Counter | per request type |

---

## 14. Security & Trust Model

### Data Handling

- Bug descriptions and symptoms are evaluated in-memory; never persisted.
- No code execution, no file modification, no debugger invocation.
- Source code snippets in context are treated as immutable strings.

### No Credential Exposure

- Debug Pro does not access databases, APIs, or credentials.
- Stack traces with credentials are not parsed or stored.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound methodology | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Framework storage | 3 subdirectories (~4 KB total) | Static; no growth |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

Each invocation is independent and stateless. Phase state is caller-managed.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Phase guidance | Emit phase | Caller | Invocation scope |
| Root cause framework | Evaluate phase | Caller | Invocation scope |

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Phase guidance | < 5 ms | < 15 ms | 50 ms |
| Full methodology | < 10 ms | < 30 ms | 100 ms |
| Red flag check | < 2 ms | < 5 ms | 20 ms |
| Output size | = 500 chars | = 2,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Phase skipping under time pressure | High | Surface-level fix; bug recurrence | `ERR_PHASE_SKIP` blocks progression |
| Red flags ignored | Medium | Random fix attempts | Red flag detection is deterministic |
| Root cause not found after 5 Whys | Low | Stuck in Understand phase | Loop back to Isolate with narrower scope |
| Verification skipped | Medium | Unverified fix shipped | Verification checklist is mandatory |
| Flaky reproduction | Medium | Cannot confirm fix | Minimal reproduction case required |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies |
| When to Use section | ? | Situation-based decision table |
| Core content matches skill type | ? | Expert type: 4-phase methodology, decision trees |
| Troubleshooting section | ? | Anti-patterns + red flags tables |
| Related section | ? | Cross-links to test-architect, code-review, /diagnose |
| Content Map for multi-file | ? | Links to 3 framework directories + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 4-phase methodology (Reproduce?Isolate?Understand?Fix&Verify) | ? |
| **Functionality** | 5 Whys root cause analysis (exactly 5 levels) | ? |
| **Functionality** | 5 red flag patterns with deterministic detection | ? |
| **Functionality** | 4-item verification checklist | ? |
| **Functionality** | 3 advanced frameworks (defense-in-depth, root-cause tracing, verification) | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Contracts** | Phase state transitions with explicit arrow notation | ? |
| **Failure** | Error taxonomy with 6 categorized codes | ? |
| **Failure** | Phase skip blocked by ERR_PHASE_SKIP | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed phase order, fixed checklists, fixed 5 Whys depth | ? |
| **Security** | No code execution; no debugger invocation | ? |
| **Observability** | Structured log schema with 5 mandatory fields + 5 log points | ? |
| **Observability** | 5 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel invocations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? ## OpenTelemetry Observability (MANDATORY)

- **Resolution Time Tracking**: EVERY completed debug verification MUST emit an OpenTelemetry Histogram metric recording Mean Time To Resolution (MTTR).
- **Red Flag Events**: Any detected Red Flags (e.g., skip phase attempt, missing 5-Whys) MUST trigger OTel Events attached to the main debugging Trace ID to enforce accountability.

---

PikaKit v3.9.206
