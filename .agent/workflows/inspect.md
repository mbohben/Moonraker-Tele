---
description: Defense-in-depth code review — four-layer validation across build, tests, security, and logic to eliminate false completion claims with evidence-based verification.
chain: security-audit
skills: [security-scanner, code-review, problem-checker, context-engineering, knowledge-compiler]
agents: [orchestrator, assessor, recovery, learner, security-auditor]
---

# /inspect - Defense-in-Depth Review

$ARGUMENTS

---

## Purpose

Systematic code review with multi-layer validation — preventing false completion claims through evidence-based verification across build, tests, security, and logic layers. **Differs from `/validate` (runs tests) and `/diagnose` (finds bugs) by performing comprehensive quality audit across all dimensions before deployment.** Uses `security-scanner` with `security-scanner` for vulnerability scanning and `code-review` for quality validation.

---

## Sub-Commands

| Command | Purpose |
|---------|---------|
| `/inspect` | Review current changes |
| `/inspect [file-path]` | Review specific file |
| `/inspect --pr` | PR-style review |
| `/inspect --security` | Security-focused review |

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Flight** | `assessor` | Evaluate review scope, risks and knowledge-compiler patterns |
| **Execution** | `orchestrator` | Coordinate 4-layer validation sequence |
| **Safety** | `recovery` | Save workspace checkpoint before validation |
| **Post-Review** | `learner` | Log review patterns for future reference |

```
Flow:
assessor.evaluate(scope) → 4-layer validation
       ↓
build → tests → security → logic
       ↓
report → learner.log(patterns)
```

---

## ⚡ MANDATORY: 4-Layer Validation Protocol


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
  Base skills: [workflow defaults]
  Total active: [count]
```


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
2. Trigger `recovery` agent to run Checkpoint (`git commit -m "chore(checkpoint): pre-inspect"`).

### Phase 2: Build Verification

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (target files/scope or current changes) |
| **OUTPUT** | Build result: compilation status, lint errors, warnings |
| **AGENTS** | `orchestrator`, `assessor` |
| **SKILLS** | `code-review`, `context-engineering` |

// turbo — telemetry: phase-2-build
```bash
npx cross-env OTEL_SERVICE_NAME="workflow:inspect" TRACE_ID="$TRACE_ID" npm run build
```

| Check | Required |
|-------|----------|
| TypeScript compiles | → |
| No lint errors | → |
| No warnings | ⚠️ |

### Phase 3: Test Verification

| Field | Value |
|-------|-------|
| **INPUT** | Build result from Phase 2 |
| **OUTPUT** | Test result: pass/fail count, coverage, skipped tests |
| **AGENTS** | `orchestrator` |
| **SKILLS** | `code-review` |

// turbo — telemetry: phase-3-test
```bash
npx cross-env OTEL_SERVICE_NAME="workflow:inspect" TRACE_ID="$TRACE_ID" npm test
```

| Check | Required |
|-------|----------|
| All tests pass | → |
| No skipped tests | ⚠️ |
| Coverage maintained | ⚠️ |

### Phase 4: Security Scan

| Field | Value |
|-------|-------|
| **INPUT** | Source files in scope |
| **OUTPUT** | Security report: vulnerabilities found, severity levels |
| **AGENTS** | `security-scanner` |
| **SKILLS** | `security-scanner`, `code-review` |

| Check | Required |
|-------|----------|
| No hardcoded secrets | → |
| Input validation present | → |
| SQL injection safe | → |
| XSS prevention | → |

### Phase 5: Logic Review

| Field | Value |
|-------|-------|
| **INPUT** | All results from Phases 2-4 + source code |
| **OUTPUT** | Logic review: issues found with severity, required actions |
| **AGENTS** | `security-scanner`, `learner` |
| **SKILLS** | `code-review`, `problem-checker`, `knowledge-compiler` |

| Category | Questions |
|----------|----------|
| **Correctness** | Does it solve the stated problem? |
| **Edge Cases** | Null, empty, max values handled? |
| **Error Handling** | All failure modes covered? |
| **Performance** | N+1 queries? Memory leaks? |
| **Maintainability** | Clear naming? Single responsibility? |

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

> **After completing /inspect, you MUST suggest the next pipeline step to the user.**

```
u{2705} /inspect complete u{2192} Suggest: "Run `/fix` to address found issues."
```

---

## 🔄 Rollback & Recovery

If the inspection process (builds, scans) creates ghost artifacts or fails to complete legitimately:
1. Restore workspace to pre-inspect checkpoint (`git reset --hard HEAD` and `git clean -fd`).
2. Log failure via `learner` meta-agent.
3. Automatically escalate to `/diagnose` to understand why the pipeline failed.

---

### Evidence-Based Completion

**NEVER claim completion without proof:**

```
✅ CORRECT: "Build passed: `npm run build` completed in 3.2s"
✅ CORRECT: "Tests: 42/42 passed (npm test output attached)"
❌ WRONG:  "I believe the code should work"
❌ WRONG:  "This should fix the issue"
```

---

## Output Format

```markdown
## 🔍 Inspect: [Target]

### Layer Results

| Layer | Status | Details |
|-------|--------|---------|
| Build | → Pass | 0 errors, 2 warnings |
| Tests | → Pass | 42/42 passed, 78% coverage |
| Security | ⚠️ Warning | 1 issue found |
| Logic | ⚠️ Issues | 3 issues found |

### Issues Found

| File | Issue | Severity |
|------|-------|----------|
| `user.ts:45` | Missing null check | High |
| `api.ts:23` | No rate limiting | Medium |
| `auth.ts:89` | Unused variable | Low |

### Verdict

⚠️ **NEEDS FIXES** before completion

### Required Actions

1. Add null check in user.ts:45
2. Add CSRF token to POST endpoints
3. Consider rate limiting

### Next Steps

- [ ] Fix identified issues with `/fix`
- [ ] Re-run `/inspect` after fixes
- [ ] Run `/validate` for full test suite
```

---

## Examples

```
/inspect
/inspect src/services/auth.ts
/inspect --pr
/inspect --security
/inspect src/routes/ --security
```

---

## Key Principles

- **Evidence over belief** — prove it works with command output, not assumptions
- **Every layer matters** — don't skip build, tests, security, or logic checks
- **Security first** — always scan for vulnerabilities before marking complete
- **Fix before claiming** — no "should work" — verify with evidence
- **Document issues** — clear action items with file, line, and severity

---

## 🔗 Workflow Chain

**Skills Loaded (5):**

- `security-scanner` - OWASP 2025 vulnerability analysis
- `code-review` - Multi-layer code quality validation
- `context-engineering` - Codebase parsing and context extraction
- `problem-checker` - IDE problem verification
- `knowledge-compiler` - Learning and logging review patterns

```mermaid
graph LR
    A["/inspect"] --> B["/fix"]
    B --> C["/validate"]
    C --> D["/launch"]
    style A fill:#10b981
```

| After /inspect | Run | Purpose |
|---------------|-----|---------|
| Issues found | `/fix` | Fix identified issues |
| All clear | `/validate` | Run full test suite |
| Security issue | `/diagnose` | Deep investigation |

**Handoff to /fix:**

```markdown
✅ Review complete. [X] issues found across 4 layers.
Verdict: [PASS/NEEDS FIXES]. Run `/fix` to resolve or `/validate` if all clear.
```
