---
title: Code Review — Engineering Specification
impact: MEDIUM
tags: code-review
---

# Code Review — Engineering Specification

> Production-grade specification for code review and quality control at FAANG scale.

---

## 1. Overview

Code Review provides structured review methodology for production code: automated quality checks (linting, type checking, security scanning), manual review checklists (correctness, security, performance, quality, testing), review comment taxonomy (blocking/suggestion/nit/question), and a mandatory quality loop (edit → check → fix → repeat). The skill combines expert knowledge (review checklists) with automation scripts (lint runner, type coverage).

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

---

## 2. Problem Statement

Code review at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Inconsistent review quality | 40% of reviews miss security issues; 30% miss edge cases | Vulnerabilities ship to production |
| No automated quality gate | 25% of teams commit code with lint/type errors | Broken builds, wasted CI cycles |
| Review comment ambiguity | Comments lack severity classification in 50%+ reviews | Unclear which issues block merge |
| Missing review categories | Reviews focus on style, skip performance/security in 35% of cases | Critical issues missed |

Code Review eliminates these with a structured 5-category review checklist, mandatory quality loop, 4-level comment taxonomy, and automated lint/type/security scripts.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Zero lint/type errors before commit | Quality loop runs until lint + tsc pass |
| G2 | 5-category review coverage | Correctness, security, performance, quality, testing — all checked |
| G3 | Classified review comments | Every comment uses 4-level taxonomy (🔴/🟡/🟢/❓) |
| G4 | Automated first pass | Lint + type check + security scan before human review |
| G5 | Blocking issue resolution | All 🔴 BLOCKING issues resolved before merge |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Coding standards definition | Owned by `code-craft` skill |
| NG2 | Advanced security scanning | Owned by `security-scanner` skill |
| NG3 | Test writing and coverage | Owned by `test-architect` skill |
| NG4 | Constitutional governance | Owned by `code-constitution` skill |
| NG5 | PR management / git workflow | Owned by `git-workflow` skill |
| NG6 | Performance profiling | Owned by `perf-optimizer` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Quality loop (edit → check → fix) | Loop definition and enforcement | Linter/compiler implementation |
| Review checklist (5 categories, 14 items) | Checklist definition | Checklist tooling |
| Comment taxonomy (4 levels) | Taxonomy definition | Comment storage/display |
| Lint/type automation scripts | `lint_runner.ts`, `type_coverage.ts` | ESLint/TSC installation |
| Review commands (quick reference) | Command table | Script execution environment |

**Side-effect boundary:** Code Review produces review decisions, checklists, and comment classifications. The automation scripts (`scripts/`) execute lint and type commands with filesystem read access. Review decisions do not modify code.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "quality-check" | "review-checklist" | "comment-classify" |
                              # "lint-commands" | "full-review"
Context: {
  code_snippet: string | null # Code to review (for checklist/classify)
  file_paths: Array<string> | null  # Files to review
  language: string            # "typescript" | "javascript" | "python" | "go" | "rust"
  pr_description: string | null  # PR context for review
  review_scope: string       # "full" | "security-only" | "performance-only"
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "pass" | "issues-found" | "error"
Data: {
  quality_check: {
    lint_passed: boolean
    types_passed: boolean
    security_passed: boolean
    commands_run: Array<string>
  } | null
  review: {
    categories_checked: Array<string>
    issues: Array<{
      category: string        # "correctness" | "security" | "performance" | "quality" | "testing"
      severity: string        # "blocking" | "suggestion" | "nit" | "question"
      description: string
      location: string
      suggestion: string | null
    }>
    blocking_count: number
    merge_ready: boolean      # true only if blocking_count = 0
  } | null
  comment_template: string | null  # Formatted review comment
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

- Same `Request_Type` + `Context` = identical review checklist output.
- Comment taxonomy is fixed: 🔴 BLOCKING, 🟡 SUGGESTION, 🟢 NIT, ❓ QUESTION.
- Quality loop commands are deterministic per language.
- `merge_ready` is deterministic: `true` if and only if `blocking_count = 0`.
- Review categories are always the same 5: correctness, security, performance, quality, testing.

**Non-deterministic elements:** Code content analysis depends on the actual code being reviewed.

#### What Agents May Assume

- `merge_ready = true` means zero blocking issues found in reviewed categories.
- Quality check commands are valid for the specified language.
- Review checklist covers all 5 categories.
- Comment taxonomy has exactly 4 levels.

#### What Agents Must NOT Assume

- A "pass" means the code is safe/correct (only checked items are evaluated).
- The skill executes lint/type commands automatically (caller runs commands).
- Review recommendations account for all framework-specific patterns.
- All security issues are detected (deep scanning is `security-scanner`'s responsibility).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Quality check commands | None; returns commands to run |
| Review checklist | None; pure evaluation |
| Comment classify | None; taxonomy output |
| Lint runner script | Executes lint commands (read + process stdout) |
| Type coverage script | Executes tsc commands (read + process stdout) |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Agent writes/edits code
2. Run quality-check to get lint/type commands
3. Execute commands (caller's responsibility)
4. If commands fail: fix and re-run (quality loop)
5. Request review-checklist for manual review items
6. Classify findings using comment taxonomy
7. Resolve all 🔴 BLOCKING issues before completing
```

#### Execution Guarantees

- Each invocation produces a complete, self-contained review output.
- Quality loop continues until all checks pass; no partial completion.
- All 5 review categories are checked; no omission.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported request type |
| Missing language | Return error to caller | Supply language |
| Lint command failure | Return error with command output | Fix code and re-run |
| Unknown language | Return `WARN_UNKNOWN_LANGUAGE` | Apply generic review checklist |

#### Retry Boundaries

- Zero internal retries for review decisions.
- Quality loop is an explicit caller-driven retry (edit → check → fix → repeat).
- Scripts: zero retries; caller re-runs after fixing code.

#### Isolation Model

- Each invocation is stateless and independent.
- Scripts operate on the filesystem but produce only stdout output.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Quality check commands | Yes | Same language = same commands |
| Review checklist | Yes | Same code = same checklist items |
| Comment classify | Yes | Fixed taxonomy |
| Lint runner script | No | Output depends on current code state |
| Type coverage script | No | Output depends on current type state |

---

## 7. Execution Model

### 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate request type, language, and review scope | Validated input or error |
| **Evaluate** | Apply review checklist or generate quality commands | Review results or command list |
| **Emit** | Return structured output with metadata | Complete output schema |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed review categories | 5 categories: correctness, security, performance, quality, testing |
| Fixed comment taxonomy | 4 levels: 🔴 BLOCKING, 🟡 SUGGESTION, 🟢 NIT, ❓ QUESTION |
| Fixed merge gate | `merge_ready = (blocking_count === 0)` |
| Fixed quality commands per language | TypeScript: `npx tsc --noEmit && npm run lint`; Python: `ruff check --fix` |
| No external calls | Review logic embedded; no remote API |
| No ambient state | Each invocation operates solely on explicit inputs |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

Review decisions and checklist outputs are identical for identical inputs. Quality loop state (pass/fail) is managed by the caller, not the skill.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported request type |
| Missing language | Return `ERR_MISSING_LANGUAGE` | Supply language |
| Missing code/files | Return `ERR_MISSING_INPUT` | Supply code or file paths |
| Unknown language | Return `WARN_UNKNOWN_LANGUAGE`; apply generic | Supply known language |
| Script execution failure | Return `ERR_SCRIPT_FAILED` with stderr | Fix environment or code |
| No lint config found | Return `WARN_NO_CONFIG` | Create config file |

**Invariant:** Every failure returns a structured error. No silent pass.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_MISSING_LANGUAGE` | Validation | Yes | Language not specified |
| `ERR_MISSING_INPUT` | Validation | Yes | Code snippet or file paths not provided |
| `ERR_SCRIPT_FAILED` | Execution | Yes | Lint/type script execution error |
| `WARN_UNKNOWN_LANGUAGE` | Warning | Yes | Language not recognized; generic applied |
| `WARN_NO_CONFIG` | Warning | Yes | No lint/type config file found |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Review decision timeout | N/A | N/A | Synchronous; < 50ms |
| Lint script execution | 30,000 ms | 120,000 ms | Large codebases |
| Type check execution | 60,000 ms | 300,000 ms | Full project type check |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "code-review",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "language": "string",
  "review_scope": "string",
  "blocking_count": "number",
  "merge_ready": "boolean",
  "categories_checked": ["string"],
  "status": "pass|issues-found|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Review completed | INFO | All fields |
| Blocking issues found | WARN | blocking_count, categories |
| Review failed | ERROR | error_code, message |
| Quality check passed | INFO | lint_passed, types_passed |
| Script execution | DEBUG | command, duration_ms, exit_code |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `codereview.duration` | Histogram | ms |
| `codereview.blocking.count` | Counter | per review |
| `codereview.category.issues` | Counter | per category |
| `codereview.merge_ready.rate` | Counter | ready/not-ready |
| `codereview.language.distribution` | Counter | per language |

---

## 14. Security & Trust Model

### Code Access

- Code Review reads code snippets provided as input or via file paths.
- Scripts read files from disk but do not modify them.
- No code is persisted beyond the invocation.

### Secret Detection

- Review checklist includes "no hardcoded secrets" check.
- Scripts do not handle or store credentials.

### Comment Integrity

- Review comments are generated as structured output.
- No injection into version control systems directly.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput (decisions) | CPU-bound checklist | < 50ms; scales linearly |
| Throughput (scripts) | I/O-bound lint/type | Limited by project size |
| Concurrency | Stateless decisions | Unlimited parallel |
| Memory per invocation | < 1 MB (decisions) | No accumulation |
| Script memory | 50–200 MB (Node.js tsc) | One script at a time per project |

---

## 16. Concurrency Model

Fully parallel for review decisions. No shared state. No coordination required.

Scripts: one lint/type script at a time per project directory to avoid file lock conflicts.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation for review decisions. No persistent handles.

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Review output | Emit phase | Caller | Invocation scope |
| Lint process | Script execution | Process exit | Script timeout |
| Type check process | Script execution | Process exit | Script timeout |

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Review checklist generation | < 10 ms | < 30 ms | 100 ms |
| Comment classification | < 5 ms | < 10 ms | 50 ms |
| Lint script (small project) | < 5,000 ms | < 15,000 ms | 30,000 ms |
| Type check (small project) | < 10,000 ms | < 30,000 ms | 60,000 ms |
| Output size | ≤ 1,000 chars | ≤ 5,000 chars | 10,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Review checklist too generic | Medium | Misses framework-specific issues | Language-specific review extensions |
| Lint config missing | Medium | Scripts fail or apply defaults | `WARN_NO_CONFIG` with setup guidance |
| Type check slow on large projects | Medium | Timeout on full check | Incremental type checking; timeout configurable |
| Blocking issues overridden | Low | Unsafe code merged | `merge_ready` is deterministic; cannot be overridden |
| Security issues missed by lint | High | Vulnerabilities ship | Defer deep scanning to `security-scanner` skill |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | Node.js, ESLint, TypeScript per language |
| When to Use section | ✅ | Situation-based decision table |
| Core content matches skill type | ✅ | Expert + automation hybrid: checklists + scripts |
| Troubleshooting section | ✅ | Anti-patterns table |
| Related section | ✅ | Cross-links to code-craft, security-scanner, test-architect |
| Content Map for multi-file | ✅ | Links to scripts/ + rules/ |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 5-category review checklist (14 items) | ✅ |
| **Functionality** | 4-level comment taxonomy (🔴/🟡/🟢/❓) | ✅ |
| **Functionality** | Quality loop (edit→check→fix→repeat) | ✅ |
| **Functionality** | Lint/type automation scripts | ✅ |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ✅ |
| **Contracts** | Contract versioning with semver | ✅ |
| **Contracts** | Per-script idempotency classification | ✅ |
| **Failure** | Error taxonomy with 6 categorized codes | ✅ |
| **Failure** | No silent pass on invalid input | ✅ |
| **Failure** | Zero internal retries | ✅ |
| **Determinism** | Fixed categories, fixed taxonomy, fixed merge gate | ✅ |
| **Security** | No code modification; read-only file access for scripts | ✅ |
| **Observability** | Structured log schema with 5 mandatory fields + 5 log points | ✅ |
| **Observability** | 5 metrics defined | ✅ |
| **Performance** | P50/P99 targets for decisions and scripts | ✅ |
| **Scalability** | Stateless decisions; script concurrency documented | ✅ |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ✅ |

---

⚡ ## OpenTelemetry Observability (MANDATORY)

- **Review Velocity Tracking**: EVERY review decision MUST emit an OpenTelemetry Span with review.decision and review.blocking_count attributes.
- **Quality Loop Metrics**: Lint and type check iterations MUST be recorded as OTel Counter metrics to track first-pass success rate.

---

PikaKit v3.9.206
