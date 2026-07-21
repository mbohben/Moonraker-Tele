---
title: Problem Checker � Engineering Specification
impact: MEDIUM
tags: problem-checker
---

# Problem Checker � Engineering Specification

> Production-grade specification for automated IDE problem detection and auto-fix at FAANG scale.

---

## 1. Overview

Problem Checker provides automated IDE error detection and resolution before task completion: reads `@[current_problems]`, classifies issues as auto-fixable or escalatable, applies fixes for known patterns, re-verifies after fix, and blocks completion if unfixed errors remain. The skill operates as an **Automation (scripted)** � it reads IDE problem state, applies file modifications (auto-fix), re-reads IDE state (verification loop), and may escalate to user. Side effects include: modifying source files (auto-fix), reading IDE problem state, and blocking task completion.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Code quality gates at scale face four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Tasks completed with IDE errors | 30% of completions have lingering errors | Broken builds |
| Missing imports | 40% of IDE errors are import-related | Quick auto-fix missed |
| Unused variable warnings | 25% of lint warnings are unused vars | Noise pollution |
| Manual error resolution | 60% of fixable issues require human intervention | Wasted developer time |

Problem Checker eliminates these with mandatory pre-completion checks, auto-fix for 4 known patterns (success rate target > 80%), and hard-block on unfixed errors.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Zero IDE errors at completion | `@[current_problems]` = 0 errors before notify_user |
| G2 | Auto-fix rate > 80% | 4 auto-fixable patterns |
| G3 | Max 3 fix-recheck cycles | Prevent infinite loops |
| G4 | 4 auto-fixable patterns | Missing import, JSX namespace, unused var, @import order |
| G5 | 3 escalation categories | Logic error, breaking change, missing dependency |
| G6 | Hard-block on unfixed | Never call notify_user with errors |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Pattern storage | Owned by `knowledge-compiler` skill |
| NG2 | Skill generation | Owned by `skill-generator` skill |
| NG3 | Full test execution | Owned by `/validate` workflow |
| NG4 | Code review | Owned by `code-review` skill |
| NG5 | Logic error repair | Beyond auto-fix capability |
| NG6 | Dependency installation | Requires user approval |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| IDE problem detection | `@[current_problems]` reading | IDE integration |
| Auto-fix (4 patterns) | File modification | Complex refactoring |
| Fix verification (re-check) | Re-read problems after fix | Test execution |
| Escalation (3 categories) | Block + notify | Resolution of escalated issues |
| Completion gate | Hard-block if errors remain | Task management |

**Side-effect boundary:** Problem Checker reads IDE problem state, modifies source files (auto-fix for known patterns), re-reads state for verification, and blocks task completion. It does not install packages, run tests, or perform complex refactoring.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Action: string                # "check" | "auto-fix" | "full-cycle"
Context: {
  trigger: string             # "pre-completion" | "post-modification" | "manual"
  file_types: Array<string> | null  # [".ts", ".tsx", ".js", ".css"] (null = all)
  max_fix_cycles: number      # Max fix-recheck iterations (default: 3, max: 5)
  target_file: string | null  # Specific file to check (null = all)
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "blocked" | "error"
Data: {
  problems_found: number      # Total problems detected
  auto_fixed: number          # Problems auto-fixed
  remaining: number           # Problems still present
  fix_cycles_used: number     # How many fix-recheck loops ran
  issues: Array<{
    file: string
    line: number
    message: string
    category: string          # "auto-fixable" | "escalate"
    fix_applied: boolean
  }>
  blocked: boolean            # True if unfixed errors remain
  escalation: Array<{
    file: string
    issue: string
    action: string            # "notify-user" | "block-explain" | "ask-install"
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
Action: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Auto-fix patterns are fixed: 4 patterns with deterministic fixes.
- Escalation categories are fixed: 3 categories with defined actions.
- Max fix cycles bounded: default 3, maximum 5.
- Completion gate is absolute: errors remain ? blocked = true.
- Same problems ? same classification (auto-fixable vs escalate).

#### What Agents May Assume

- `@[current_problems]` returns current IDE error state.
- Auto-fix modifies only the affected file.
- Fix verification re-reads `@[current_problems]` after each fix.
- Blocked status prevents task completion.

#### What Agents Must NOT Assume

- Auto-fix succeeds on first attempt.
- All problems are auto-fixable.
- Fix cycles complete within 1 iteration.
- IDE state refreshes instantly after file modification.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Check | Reads IDE state (read-only) |
| Auto-fix | Modifies source file (adds import, removes unused var, reorders @import) |
| Full-cycle | Check + fix + re-check (up to max_fix_cycles) |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Read @[current_problems] for current IDE state
2. Classify each problem: auto-fixable (4 patterns) or escalate (3 categories)
3. Apply auto-fix for fixable problems
4. Re-read @[current_problems] (verification)
5. Repeat steps 2-4 up to max_fix_cycles (default: 3)
6. If remaining > 0: set blocked = true, list escalations
7. If remaining = 0: set blocked = false, proceed
```

#### State Transitions

```
IDLE ? CHECKING               [check action received]
CHECKING ? CLEAN              [0 problems found]  // terminal
CHECKING ? FIXING             [auto-fixable problems found]
CHECKING ? BLOCKED            [only non-fixable problems]  // terminal
FIXING ? VERIFYING            [fix applied]
VERIFYING ? CLEAN             [0 problems remain]  // terminal
VERIFYING ? FIXING            [fixable problems remain AND cycles < max]
VERIFYING ? BLOCKED           [problems remain AND cycles >= max]  // terminal
VERIFYING ? BLOCKED           [only non-fixable remain]  // terminal
```

#### Execution Guarantees

- Maximum `max_fix_cycles` iterations (prevents infinite loops).
- Each fix cycle reads current state (not cached).
- Blocked status is definitive: unfixed errors = cannot proceed.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| IDE state unavailable | Return error | Retry manually |
| Fix causes new error | Detected in verification | Revert fix, escalate |
| Max cycles exceeded | Set blocked | Escalate remaining |
| File write denied | Return error | Check permissions |

#### Retry Boundaries

- Fix-recheck cycles: max 3 (default), max 5 (hard limit).
- IDE state reads: zero retries (immediate read).

#### Isolation Model

- Each invocation operates on current IDE state.
- Multiple invocations are sequential (not parallel).

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Check | Yes | Re-reads current state |
| Auto-fix | No | Modifies files; re-applying import is harmless but not guaranteed |
| Full-cycle | No | State changes between cycles |

---

## 7. Execution Model

### 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Detect** | Read `@[current_problems]` | Problem list |
| **Fix** | Apply auto-fix for 4 known patterns | Modified files |
| **Verify** | Re-read problems, check if resolved | Final status |

Fix + Verify may repeat up to `max_fix_cycles` times.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| 4 auto-fixable patterns | Missing import, JSX namespace, unused var, @import order |
| 3 escalation categories | Logic error ? notify; breaking change ? block+explain; missing dep ? ask install |
| Max 3 fix cycles (default) | Hard upper bound: 5 |
| Completion hard-block | Errors present ? blocked = true; never complete with errors |
| Fix verification mandatory | Every fix followed by re-check |
| No cascading fixes | Fix one category per cycle to detect introduced errors |

### Auto-Fix Pattern Table (Fixed)

| Pattern | IDE Message Match | Fix Action |
|---------|------------------|------------|
| Missing import | `Cannot find name 'X'` | Add import statement |
| JSX namespace | `Cannot find namespace 'JSX'` | Import ReactNode / JSX types |
| Unused variable | `'x' is declared but never used` | Remove or prefix with `_` |
| CSS @import order | `@import must precede all other rules` | Move @import to top of file |

### Escalation Category Table (Fixed)

| Category | Indicators | Action |
|----------|-----------|--------|
| Logic error | Type mismatch, null ref, undefined | Notify user with context |
| Breaking change | Interface change, removed property | Block, explain impact |
| Missing dependency | Module not found, package missing | Ask user to install |

---

## 9. State & Idempotency Model

Session-based with fix-verify loop state. No persistent state across invocations.

| State | Persistent | Scope |
|-------|-----------|-------|
| IDE problem list | External (IDE) | Per invocation |
| Fix cycle count | In-memory | Per invocation |
| Modified files | Persistent (filesystem) | Side effect |

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| IDE state unavailable | Return `ERR_IDE_UNAVAILABLE` | Retry or run manual check |
| Fix introduces new error | Revert fix, escalate | Manual resolution |
| Max cycles exceeded | Return blocked with remaining | Manual fix for remaining |
| File write permission denied | Return `ERR_FILE_WRITE_DENIED` | Check file permissions |

**Invariant:** Fix must never make the problem count worse. If fix introduces new errors, revert and escalate.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_IDE_UNAVAILABLE` | Infrastructure | Yes | Cannot read @[current_problems] |
| `ERR_FILE_WRITE_DENIED` | Filesystem | Yes | Cannot modify source file |
| `ERR_MAX_CYCLES_EXCEEDED` | Execution | Yes | Fix cycles exhausted |
| `ERR_FIX_REGRESSION` | Execution | Yes | Fix introduced new error |
| `ERR_BLOCKED` | Gate | No | Unfixed errors remain; cannot complete |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| IDE state read | 2,000 ms | 5,000 ms | IDE response time |
| Auto-fix per file | 1,000 ms | 3,000 ms | File write + parse |
| Verification re-check | 3,000 ms | 10,000 ms | IDE refresh after modification |
| Full cycle (all iterations) | 15,000 ms | 60,000 ms | 3 cycles � (fix + verify) |
| Fix-recheck cycles | 3 | 5 | Prevent infinite loops |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "problem-checker",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "action": "check|auto-fix|full-cycle",
  "trigger": "pre-completion|post-modification|manual",
  "problems_found": "number",
  "auto_fixed": "number",
  "remaining": "number",
  "fix_cycles": "number",
  "blocked": "boolean",
  "status": "success|blocked|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Problems detected | INFO | problems_found, file_types |
| Auto-fix applied | INFO | pattern, file, line |
| Fix verified | INFO | remaining after fix |
| Completion blocked | WARN | remaining, escalations |
| Fix regression | ERROR | original_error, new_error |
| IDE unavailable | ERROR | error_code |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `problemchecker.problems.detected` | Counter | per invocation |
| `problemchecker.auto_fixed.count` | Counter | per invocation |
| `problemchecker.blocked.count` | Counter | blocked completions |
| `problemchecker.fix_cycles.used` | Histogram | cycles per invocation |
| `problemchecker.auto_fix_rate` | Gauge | percentage |

---

## 14. Security & Trust Model

### Data Handling

- Problem Checker reads IDE state and modifies source files.
- No credentials, API keys, or PII processed.
- File modifications are limited to 4 known patterns.
- No network calls, no external data.

### File Modification Security

| Rule | Enforcement |
|------|-------------|
| Only 4 fix patterns | No arbitrary file modification |
| Revert on regression | Fix reverted if new errors introduced |
| No deletion | Fixes add/move/prefix; never delete files |
| Source files only | Only .ts, .tsx, .js, .css modified |

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Problems per invocation | < 500 | Prioritize by severity |
| Fix cycles | Max 5 | Bounded iteration |
| File modifications per cycle | < 50 | One fix per problem |
| Memory per invocation | < 10 MB | Problem list + fix context |
| Concurrent invocations | 1 (sequential) | IDE state is global |

---

## 16. Concurrency Model

| Dimension | Boundary |
|-----------|----------|
| Invocations | Sequential only; IDE state is global |
| Fix application | Serial per file |
| Verification | Waits for IDE refresh |

**No parallel invocations.** IDE problem state is shared; concurrent fixes would cause race conditions.

---

## 17. Resource Lifecycle Management

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| IDE state snapshot | Check phase | End of invocation | Per invocation |
| Fix context | Fix phase | End of cycle | Per cycle |
| Modified files | Auto-fix | Persistent (side effect) | Permanent |

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| IDE state read | < 500 ms | < 2,000 ms | 5,000 ms |
| Single auto-fix | < 200 ms | < 1,000 ms | 3,000 ms |
| Verification re-check | < 1,000 ms | < 3,000 ms | 10,000 ms |
| Full cycle (3 iterations) | < 5,000 ms | < 15,000 ms | 60,000 ms |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Fix introduces regression | Medium | New errors | Revert + escalate |
| IDE state stale after fix | Medium | False positive clean | Wait for IDE refresh |
| Infinite fix loop | Low | Hang | Max 5 cycles hard limit |
| Pattern mismatch | Low | Wrong fix applied | Exact string matching |
| File permission denied | Low | Fix blocked | ERR_FILE_WRITE_DENIED |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | IDE with @[current_problems] |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Automation: fix loop, state transitions, file modification |
| Troubleshooting section | ? | Escalation categories |
| Related section | ? | Cross-links to knowledge-compiler, skill-generator, /validate |
| Content Map for multi-file | ? | Link to scripts + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 4 auto-fix patterns | ? |
| **Functionality** | 3 escalation categories | ? |
| **Functionality** | Fix-verify loop (max 3 cycles default) | ? |
| **Functionality** | Hard-block on unfixed errors | ? |
| **Contracts** | Input/output/error schemas | ? |
| **Contracts** | State transitions with terminal states | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 5 categorized codes | ? |
| **Failure** | Fix regression revert | ? |
| **Security** | Only 4 fix patterns; no arbitrary modification | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 5 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Concurrency** | Sequential only (IDE state is global) | ? |
| **Compliance** | All skill-design-guide.md sections mapped | ? |

---

? PikaKit v3.9.206
