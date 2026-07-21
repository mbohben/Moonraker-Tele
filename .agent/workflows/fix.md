---
description: Targeted error remediation — triage, patch, and verify specific errors, lint failures, or broken tests with minimal diff and automatic rollback safety.
chain: debug-complex
skills: [debug-pro, code-craft, problem-checker, context-engineering, smart-router, knowledge-compiler]
agents: [orchestrator, assessor, recovery, learner, debugger, backend-specialist, frontend-specialist, test-engineer]
---

# /fix - The Mechanic

$ARGUMENTS

---

## Purpose

Apply immediate, targeted fixes for known errors, lint issues, or test failures — focusing on remediation rather than root cause analysis. **Differs from `/diagnose` (investigates unknown root causes with hypothesis testing) by assuming the problem is already identified and applying the solution directly.** Uses the domain-appropriate specialist agent (auto-routed) with `debug-pro` for fix methodology and `code-craft` for coding standards.

---

## Workflow Modes

| Mode | When | Behavior |
|------|------|----------|
| **--auto** (default) | Simple/moderate fixes | Auto-approve if confidence = 9.5 |
| **--review** | Critical/production code | Pause for user approval |
| **--quick** | Type/lint errors | Fast fix cycle, minimal analysis |

## Complexity Routing

| Level | Indicators | Action |
|-------|-----------|--------|
| **Simple** | Single file, clear error | Quick fix → verify |
| **Moderate** | Multi-file, unclear scope | Standard workflow with `recovery` |
| **Complex** | System-wide impact | Escalate to `/diagnose` first |

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Flight** | `assessor` | Evaluate fix risk and knowledge-compiler context |
| **Execution** | `orchestrator` | Route fix to specialist agents and coordinate repair |
| **Safety** | `recovery` | Save state and recover from failed fixes |
| **Post-Fix** | `learner` | Log error resolution patterns for reuse |

```
Flow:
recovery.save() → analyze error → apply fix → verify
       → fail
recovery.restore() → learner.log(failure)
       → success
learner.log(pattern)
```

---

## ⚡ MANDATORY: Repair Protocol

### Phase 0: Dynamic Skill Detection

> **Protocol:** `.agent/rules/dynamic-skill-detection.md`

1. Scan `$ARGUMENTS` for domain signals (case-insensitive).
2. Match signals against the Domain Signal → Skill Mapping table.
3. Inject matched skills (max 5, priority: High > Medium > Low) into active skill set.
4. Skip skills already in workflow defaults.
5. Announce injected skills:

```
[⚡PikaKit] Dynamic Skills Detected:
  + {skill-name} (signal: "{matched keywords}")
  Base skills: [debug-pro, code-craft, problem-checker, ...]
  Total active: [count]
```

> **Why:** `/fix` loads 6 debugging skills by default. Dynamic detection ensures domain-specific knowledge (e.g., `data-modeler` for Prisma errors, `typescript-expert` for type errors) is available for more accurate fixes.


### Phase 0.5: Auto-Knowledge Ingest (Git Scanner)

> **Protocol:** `.agent/rules/auto-knowledge-ingest.md`
> **Channel 1:** Scans recent git commits for project-specific lessons.

```
1. Check if .agent/knowledge/ exists — if not, skip
2. Read _index.md → get last_git_scan SHA
3. Run: git log --since="7 days ago" --grep="^fix:\|^feat:" -n 20
4. For qualifying commits (≥2 files changed OR keywords: fallback, guard, CORS, rate-limit):
   a. Skip if signal with same commit SHA exists
   b. Generate signal to raw-signals/SIG-{NNN}.md
5. Update last_git_scan in _index.md
6. If uncompiled signals > 5 → auto-compile (max 10 per batch)
```
### Phase 1: Pre-flight & knowledge-compiler Context

> **Rule 0.5-K:** knowledge-compiler pattern check.

1. Read `.agent/skills/knowledge-compiler/patterns/` for past failures before proceeding.
2. Trigger `recovery` agent to run Checkpoint (`git commit -m "chore(checkpoint): pre-fix"`).

### Phase 2: Triage

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (error message, failing test, or issue description) |
| **OUTPUT** | Located error: file, line, immediate context, fix type |
| **AGENTS** | `debugger`, `assessor` |
| **SKILLS** | `debug-pro`, `context-engineering` |

// turbo — telemetry: phase-2-triage

1. Read error message or failure log
2. Locate the specific file and line
3. Classify fix type:

| Type | Action |
|------|--------|
| **Code Logic** | Correct algorithms, fix null handling, missing await |
| **Configuration** | Update env, tsconfig, or package.json |
| **Database** | Create migrations, fix schema, update queries |
| **Security** | Sanitize inputs, update dependencies, fix permissions |
| **Performance** | Optimize queries, add caching, reduce bundle |

4. `recovery` saves checkpoint of affected files

### Phase 3: Apply Fix

| Field | Value |
|-------|-------|
| **INPUT** | Located error and fix type from Phase 2 |
| **OUTPUT** | Modified source files with the fix applied |
| **AGENTS** | `orchestrator`, Auto-routed specialist (`nodejs-pro`, `react-pro`, etc.) |
| **SKILLS** | `code-craft`, `debug-pro`, `smart-router` |

// turbo — telemetry: phase-3-fix

1. Apply the fix following existing code patterns
2. Minimal diff — change only what's needed
3. No unrelated formatting or refactoring

### Phase 4: Verification

| Field | Value |
|-------|-------|
| **INPUT** | Modified files from Phase 3 |
| **OUTPUT** | Verification result: error cleared, tests passing, no regressions |
| **AGENTS** | `test-architect`, `learner` |
| **SKILLS** | `problem-checker`, `knowledge-compiler` |

// turbo — telemetry: phase-4-test
```bash
npx cross-env OTEL_SERVICE_NAME="workflow:fix" TRACE_ID="$TRACE_ID" npm test
```

// turbo — telemetry: phase-4-lint-typecheck
```bash
npx cross-env OTEL_SERVICE_NAME="workflow:fix" TRACE_ID="$TRACE_ID" npm run lint; npx cross-env OTEL_SERVICE_NAME="workflow:fix" TRACE_ID="$TRACE_ID" npx tsc --noEmit
```

1. Verify the original error is resolved
2. Check for regressions in related components
3. If fix fails → `recovery.restore()` → escalate to `/diagnose`
4. `learner` logs error pattern for future reference

---

## → MANDATORY: Problem Verification Before Completion

> **CRITICAL:** This check MUST be performed before any `notify_user` or task completion.

### Check @[current_problems]

```
1. Read @[current_problems] from IDE
2. If errors/warnings > 0:
   a. Auto-fix: imports, types, lint errors
   b. Re-check @[current_problems]
   c. If still > 0 → STOP → Notify user
3. If count = 0 → Proceed to completion
```

### Auto-Fixable

| Type | Fix |
|------|-----|
| Missing import | Add import statement |
| Unused variable | Remove or prefix `_` |
| Type mismatch | Fix type annotation |
| Lint errors | Run eslint --fix |

> **Rule:** Never mark complete with errors in `@[current_problems]`.

---



---

## MANDATORY: Post-Completion Knowledge Check

> **Protocol:** `.agent/rules/auto-knowledge-ingest.md`
> **Channel 2:** AI self-reflects on session to capture non-trivial lessons.

```
1. Self-reflect: "Was this session non-trivial?"
   - Did I fix a multi-file bug?
   - Did I discover a framework/API gotcha?
   - Did I make an architectural decision?
2. If ALL answers are NO - skip
3. If ANY answer is YES and score >= 3:
   Generate signal to raw-signals/SIG-{NNN}.md
   If uncompiled > 5 - auto-compile
```

## u{2B50}u{FE0F} MANDATORY: Suggest Next Workflow

> **After completing /fix, you MUST suggest the next pipeline step to the user.**

```
u{2705} /fix complete u{2192} Suggest: "Run `/validate` to verify the fix."
```

---

## 🔄 Rollback & Recovery

If the attempted fix introduces new errors or fails verification:
1. Restore to pre-fix checkpoint (`git checkout -- .` or `git stash pop`).
2. Log failure via `learner` meta-agent to prevent loop.
3. Automatically escalate to `/diagnose` if root cause is unclear.

---

## Output Format

```markdown
## 🔧 Fixed: [Error Description]

### The Issue

[Brief description of what was broken]

### The Fix

| File | Change | Type | Status |
|------|--------|------|--------|
| `path/to/file.ts` | Added null check | Code Logic | → |

### Verification

| Check | Result |
|-------|--------|
| Error cleared | → |
| Tests passing | → |
| Lint clean | → |
| IDE Problems | → 0 |

### Next Steps

- [ ] Run `/validate` for full regression suite
- [ ] Deploy with `/launch` when ready
```

---

## Examples

```
/fix "TypeError: Cannot read property 'map' of undefined"
/fix "Login tests failing with 401 error"
/fix "ESLint: no-unused-vars in auth.ts"
/fix "TypeScript error TS2345 in UserService"
/fix "failing GitHub Actions CI for test suite"
```

---

## Key Principles

- **Fix, don't investigate** — assume the problem is known, apply the solution
- **Minimal diff** — change only what's needed, no unrelated refactoring
- **Verify immediately** — run tests and lint after every fix
- **Rollback ready** — checkpoint before fixing, restore on failure

---

## 🔗 Workflow Chain

**Skills Loaded (6):**

- `debug-pro` - Fix methodology and error analysis
- `code-craft` - Coding standards for fix implementation
- `problem-checker` - IDE error detection and auto-fix
- `context-engineering` - Codebase parsing and error trace analysis
- `smart-router` - Agent routing for targeted fixes
- `knowledge-compiler` - Learning and logging failure patterns

```mermaid
graph LR
    A["/diagnose"] --> B["/fix"]
    B --> C["/validate"]
    C --> D["/launch"]
    style B fill:#10b981
```

| After /fix | Run | Purpose |
|-----------|-----|---------|
| Fix applied | `/validate` | Full regression suite |
| Ready to deploy | `/launch` | Deploy the fix |
| Fix failed | `/diagnose` | Re-analyze root cause |

**Handoff to /validate:**

```markdown
✅ Fix applied to [files]. Error: [description] → resolved.
Run `/validate` to ensure no regressions or `/launch` to deploy.
```
