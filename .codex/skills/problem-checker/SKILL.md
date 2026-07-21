---
name: problem-checker
description: >-
  Automated IDE problem detection and auto-fix before task completion.
  Use before marking any task complete to check and fix IDE errors, lint issues, and type errors.
  NOT for root cause analysis (use debug-pro) or code review (use code-review).
metadata:
  author: pikakit
  version: "3.9.206"
  category: system-tool
  triggers: ["before notify_user", "after code modification", "IDE errors", "check for errors"]
  coordinates_with: ["knowledge-compiler", "skill-generator", "code-review"]
  success_metrics: ["0 IDE Errors", "Clean notify_user"]
---

# Problem Checker — Automated IDE Error Gate

> 4 auto-fix patterns. 3 escalation categories. Max 3 cycles. Hard-block on errors.

---

## 5 Must-Ask Questions (Before Execution)

| # | Question | Options |
|---|----------|---------|
| 1 | Target Scope? | Single file / Directory / Workspace |
| 2 | Current State? | All files saved? |
| 3 | Max Cycles? | 3 (default) vs custom override |
| 4 | Escalation Policy? | Hard Block (default) vs Warn only |
| 5 | Environment? | TypeScript / JavaScript / CSS / Config |

---

## 🚨 Critical Rule

**NEVER mark a task complete if `@[current_problems]` shows errors.**

---

## When to Use

| Situation | Action |
|-----------|--------|
| Before any `notify_user` | Run full-cycle check |
| After modifying `.ts`, `.tsx`, `.js` | TypeScript check |
| After modifying `.css` | CSS validation |
| User says "check for errors" | Full check |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| IDE problem detection (`@[current_problems]`) | Pattern storage (→ knowledge-compiler) |
| Auto-fix (4 patterns) | Skill generation (→ skill-generator) |
| Fix-verify loop (max 3 cycles) | Full test execution (→ /validate) |
| Completion gate (hard-block) | Code review (→ code-review) |

**Automation (scripted):** Reads IDE state, modifies files (auto-fix), re-checks. Sequential only.

---

## Check Protocol (Decision Tree)

```
Read @[current_problems]
├── 0 problems → CLEAN (proceed)
└── Problems found → Classify each:
    ├── Auto-fixable → Fix → Re-check (max 3 cycles)
    │   ├── 0 remaining → CLEAN (proceed)
    │   └── Still remaining → BLOCKED (escalate)
    └── Not fixable → BLOCKED (escalate)
```

---

## State Transitions

```
IDLE → CHECKING               [action received]
CHECKING → CLEAN              [0 problems]  // terminal
CHECKING → FIXING             [auto-fixable found]
CHECKING → BLOCKED            [only non-fixable]  // terminal
FIXING → VERIFYING            [fix applied]
VERIFYING → CLEAN             [0 remaining]  // terminal
VERIFYING → FIXING            [fixable + cycles < max]
VERIFYING → BLOCKED           [cycles >= max OR only non-fixable]  // terminal
```

---

## Auto-Fixable Patterns (4 — Fixed)

| Pattern | IDE Message Match | Fix Action |
|---------|------------------|------------|
| Missing import | `Cannot find name 'X'` | Add import statement |
| JSX namespace | `Cannot find namespace 'JSX'` | Import ReactNode / JSX types |
| Unused variable | `'x' is declared but never used` | Remove or prefix with `_` |
| CSS @import order | `@import must precede all other rules` | Move @import to top |

---

## Escalation Categories (3 — Fixed)

| Category | Indicators | Action |
|----------|-----------|--------|
| Logic error | Type mismatch, null ref | Notify user with context |
| Breaking change | Interface removed, property changed | Block, explain impact |
| Missing dependency | Module not found | Ask user to install |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_IDE_UNAVAILABLE` | Yes | Cannot read @[current_problems] |
| `ERR_FILE_WRITE_DENIED` | Yes | Cannot modify source file |
| `ERR_MAX_CYCLES_EXCEEDED` | Yes | Fix cycles exhausted (> 3) |
| `ERR_FIX_REGRESSION` | Yes | Fix introduced new error |
| `ERR_BLOCKED` | No | Unfixed errors remain |

**Fix regression:** If auto-fix introduces new errors → revert fix → escalate.

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `check_started` | `{"scope": "...", "max_cycles": 3}` | `INFO` |
| `auto_fix_applied` | `{"pattern": "...", "file": "..."}` | `WARN` |
| `check_escalated` | `{"unfixed_count": 2, "reason": "logic error"}` | `ERROR` |
| `check_completed_clean` | `{"errors_fixed": 1}` | `INFO` |

All executions MUST emit `check_completed_clean` or `check_escalated` upon completion.

---

## Required Output Schema

Since this is a system script invoked by agents, it must yield the following JSON structure to confirm execution compliance:

```json
{
  "code_quality": {
    "problem_checker_run": true,
    "errors_fixed": 1,
    "unresolved_errors": 0,
    "status": "CLEAN"
  }
}
```

---

## Quick Reference

```bash
# Run TypeScript check
node .agent/skills/problem-checker/scripts/check_problems.ts

# Check specific file
npx tsc --noEmit <file>
```

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [scripts/check_problems.ts](scripts/check_problems.ts) | Problem check script | Running checks |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `knowledge-compiler` | Skill | Stores learned patterns |
| `skill-generator` | Skill | Generates from patterns |
| `/validate` | Workflow | Run all checks |

---

⚡ PikaKit v3.9.206
