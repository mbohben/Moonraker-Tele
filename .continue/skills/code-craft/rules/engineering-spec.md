---
title: Code Craft � Engineering Specification
impact: MEDIUM
tags: code-craft
---

# Code Craft � Engineering Specification

> Production-grade specification for pragmatic coding standards at FAANG scale.

---

## 1. Overview

Code Craft provides deterministic coding standards for production code: naming conventions, function design rules, code structure patterns, dependency awareness, and pre-completion validation. The skill operates as an expert knowledge base that produces coding guidance � it does not write, lint, or modify code.

The skill enforces 5 core principles (SRP, DRY, KISS, YAGNI, Boy Scout), 4 naming rules, 5 function rules, 4 structure patterns, and a 4-item self-check checklist.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Code quality at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Inconsistent naming | 40%+ of variables use ambiguous names (single letters, abbreviations) | 2�3x longer code comprehension time |
| God functions | 25% of functions exceed 20 lines; 10% exceed 50 lines | Untestable, unmaintainable code |
| Missing dependency awareness | 30% of file edits break dependents not edited in the same change | Regression bugs post-edit |
| No pre-completion validation | 20% of completed tasks have lint errors or failing tests | Wasted review cycles |

Code Craft eliminates these by providing fixed, measurable rules that agents apply during code generation and review.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Consistent naming | All variables reveal intent; all functions use verb+noun |
| G2 | Small functions | Max 20 lines per function; max 3 arguments |
| G3 | Flat code structure | Max 2 levels of nesting |
| G4 | Dependency awareness | Every file edit identifies importers and dependents |
| G5 | Pre-completion validation | 4-item self-check before every task completion |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Automated linting execution | Owned by `code-review` skill |
| NG2 | Test writing guidance | Owned by `test-architect` skill |
| NG3 | Constitutional governance | Owned by `code-constitution` skill |
| NG4 | Language-specific style guides | Too granular; frameworks handle this |
| NG5 | Code formatting (prettier, eslint config) | Tool-specific; not a standard concern |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Naming conventions (4 rules) | Variable, function, boolean, constant naming | Language-specific syntax |
| Function design (5 rules) | Size, responsibility, abstraction, arguments, side effects | Function implementation |
| Code structure (4 patterns) | Guard clauses, flat nesting, composition, colocation | Architectural patterns (? system-design) |
| Dependency awareness | Pre-edit dependency check protocol | Import resolution tooling |
| Self-check validation | 4-item checklist | Lint/test execution (? code-review) |

**Side-effect boundary:** Code Craft produces coding guidance and checklist outputs. It does not create files, modify code, or execute linters.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "naming-check" | "function-review" | "structure-review" |
                              # "dependency-check" | "self-check" | "full-review"
Context: {
  code_snippet: string | null # Code to evaluate (for naming/function/structure)
  file_path: string | null    # File being edited (for dependency check)
  language: string | null     # Programming language
  task_description: string | null  # What the agent was asked to do (for self-check)
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "pass" | "violations" | "error"
Data: {
  violations: Array<{
    rule: string              # e.g., "FUNC-SIZE", "NAME-INTENT"
    severity: string          # "warning" | "error"
    location: string          # File/line or description
    current: string           # What was found
    suggested: string         # What it should be
  }> | null
  dependency_impact: {
    importers: Array<string>  # Files that import the edited file
    dependents: Array<string> # Files that depend on exports
    action_required: string   # "edit-together" | "verify-compatible" | "none"
  } | null
  self_check: {
    goal_met: boolean
    files_complete: boolean
    code_works: boolean
    no_errors: boolean
    all_passed: boolean
  } | null
  rules_applied: Array<string>
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
Message: string               # Human-readable, single line
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Same `Request_Type` + `Context` = identical violation list.
- Rule evaluation order: naming ? function ? structure ? dependency ? self-check.
- Thresholds are fixed: max 20 lines/function, max 3 args, max 2 nesting levels.
- No randomization, no probabilistic scoring.

#### What Agents May Assume

- Violation list covers all applicable rules for the request type.
- "pass" status means zero violations found for the evaluated rules.
- Dependency impact identifies all direct importers of the edited file.
- Self-check covers all 4 mandatory items.

#### What Agents Must NOT Assume

- "pass" means the code is production-ready (only checked rules are evaluated).
- The skill accounts for framework-specific conventions.
- Dependency analysis includes transitive dependencies.
- The skill executes lint or test commands.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Naming check | None; pure evaluation |
| Function review | None; pure evaluation |
| Structure review | None; pure evaluation |
| Dependency check | None; analysis output |
| Self-check | None; checklist output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Agent writes or modifies code
2. Invoke code-craft with appropriate request type
3. Review violations list
4. Fix violations (caller's responsibility)
5. Re-invoke to verify fixes (optional)
6. Run self-check before completing task
```

#### Execution Guarantees

- Each invocation produces a complete, self-contained evaluation.
- No background processes, no deferred execution.
- All rules are evaluated; partial evaluation is not supported.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported request type |
| Missing code snippet | Return error to caller | Supply code to evaluate |
| Unknown language | Return warning; apply language-agnostic rules | Supply language if possible |

#### Retry Boundaries

- Zero internal retries. Deterministic output.
- Callers fix violations and re-invoke to verify.

#### Isolation Model

- Each invocation is stateless and independent.
- No shared state between evaluations.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Naming check | Yes | Same code = same violations |
| Function review | Yes | Fixed thresholds |
| Structure review | Yes | Fixed nesting limit |
| Dependency check | Yes | Same file = same imports |
| Self-check | Yes | Fixed 4-item checklist |

---

## 7. Execution Model

### 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate request type and context | Validated input or error |
| **Evaluate** | Apply rules from applicable category | Violation list (may be empty) |
| **Emit** | Return structured output with metadata | Complete output schema |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed thresholds | 20 lines/function, 3 args max, 2 nesting levels |
| Fixed rule set | 5 principles, 4 naming rules, 5 function rules, 4 structure patterns |
| Fixed evaluation order | naming ? function ? structure ? dependency ? self-check |
| No external calls | Rules are embedded in skill; no remote fetching |
| No ambient state | Each invocation operates solely on explicit inputs |
| No learning overrides | Rules are fixed; no pattern-based exceptions |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

Each invocation produces an identical output for identical inputs. No session, no memory, no accumulated state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported request type |
| Missing code snippet | Return `ERR_MISSING_CODE` | Supply code to evaluate |
| Missing file path | Return `ERR_MISSING_FILE_PATH` | Supply file path |
| Unknown language | Return `WARN_UNKNOWN_LANGUAGE`; apply generic rules | Supply language |
| Empty code snippet | Return `ERR_EMPTY_CODE` | Supply non-empty code |

**Invariant:** Every failure returns a structured error. No silent pass on invalid input.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not one of the 6 supported types |
| `ERR_MISSING_CODE` | Validation | Yes | Code snippet required but not provided |
| `ERR_MISSING_FILE_PATH` | Validation | Yes | File path required for dependency check |
| `ERR_EMPTY_CODE` | Validation | Yes | Code snippet is empty string |
| `WARN_UNKNOWN_LANGUAGE` | Warning | Yes | Language not recognized; generic rules applied |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Rule evaluation timeout | N/A | N/A | Synchronous evaluation; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "code-craft",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "violations_count": "number",
  "rules_applied": ["string"],
  "language": "string|null",
  "status": "pass|violations|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Evaluation completed | INFO | All fields |
| Violations found | WARN | violations_count, rules_applied |
| Evaluation failed | ERROR | error_code, message |
| Self-check failed | WARN | which items failed |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `codecraft.evaluation.duration` | Histogram | ms |
| `codecraft.violations.count` | Counter | per rule |
| `codecraft.violations.severity` | Counter | per severity |
| `codecraft.request_type.distribution` | Counter | per request type |
| `codecraft.selfcheck.pass_rate` | Counter | pass/fail |

---

## 14. Security & Trust Model

### Code Handling

- Code snippets are evaluated in-memory; never persisted.
- No code execution, no eval, no dynamic interpretation.
- Code snippets are treated as immutable strings during evaluation.

### No Credential Exposure

- Code Craft does not handle credentials, tokens, or secrets.
- If a code snippet contains a hardcoded secret, a `NAME-SECRET` violation is flagged.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound rule evaluation | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Rule storage | Embedded rules (~2 KB) | Static; no growth |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

Each invocation is independent and stateless. Any number of concurrent evaluations are safe.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Violation list | Evaluate phase | Caller | Invocation scope |
| Rule evaluation context | Parse phase | Invocation completion | Invocation scope |

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Single rule evaluation | < 2 ms | < 5 ms | 20 ms |
| Full review (all rules) | < 10 ms | < 30 ms | 100 ms |
| Output size | = 500 chars | = 2,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Rules too strict for frameworks | Medium | False violations for framework patterns | `WARN_UNKNOWN_LANGUAGE` allows generic fallback |
| Function size rule blocks complex algorithms | Low | Forces artificial splitting | 20-line limit applies to business logic; algorithm functions documented as exception |
| Dependency check misses transitive deps | Medium | Broken transitive dependents | Documented as limitation; direct importers only |
| Self-check skipped by agent | Medium | Incomplete task delivery | Self-check is mandatory in workflow contract |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies |
| When to Use section | ? | Situation-based decision table |
| Core content matches skill type | ? | Expert type: fixed rules, deterministic evaluation |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to code-review, test-architect, code-constitution |
| Content Map for multi-file | ? | Links to verification-scripts.md + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 5 core principles (SRP, DRY, KISS, YAGNI, Boy Scout) | ? |
| **Functionality** | 4 naming rules, 5 function rules, 4 structure patterns | ? |
| **Functionality** | Dependency awareness protocol | ? |
| **Functionality** | 4-item self-check checklist | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Contracts** | Agent assumptions and non-assumptions documented | ? |
| **Failure** | Error taxonomy with 5 categorized codes | ? |
| **Failure** | No silent pass on invalid input | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed thresholds (20 lines, 3 args, 2 nesting) | ? |
| **Determinism** | Fixed evaluation order | ? |
| **Security** | No code execution; string-only evaluation | ? |
| **Security** | Hardcoded secret detection flagged | ? |
| **Observability** | Structured log schema with 5 mandatory fields + 4 log points | ? |
| **Observability** | 5 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel invocations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? ## OpenTelemetry Observability (MANDATORY)

- **Quality Trend Tracking**: EVERY code quality scan MUST emit OpenTelemetry Histogram metrics (violations per file, per rule) attached to the current 	race_id and commit SHA.
- **Distributed Tracing**: Quality check spans MUST be linked to the CI/CD pipeline trace for end-to-end visibility from code change to deployment.

---

PikaKit v3.9.206
