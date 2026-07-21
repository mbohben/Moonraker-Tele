---
description: Rapid-fire implementation — execute targeted coding tasks directly from instructions or plans with minimal overhead, following existing patterns and verified output.
chain: build-web-app
skills: [code-craft, problem-checker, smart-router, context-engineering, knowledge-compiler]
agents: [orchestrator, assessor, recovery, learner, backend-specialist, frontend-specialist]
---

# /cook - The Implementer

$ARGUMENTS

---

## Purpose

Rapidly implement specific features, components, or logic based on clear instructions — skipping architectural debate to focus on pure coding speed. **Differs from `/build` (creates entire projects) and `/autopilot` (multi-agent orchestration) by executing targeted, single-scope tasks with minimal overhead.** Uses the domain-appropriate specialist agent (auto-routed) with `code-craft` for coding standards.

---

## Workflow Modes

| Mode | Research | Testing | Review Gates | Use When |
|------|----------|---------|--------------|----------|
| **interactive** (default) | → | → | User approval | Standard features |
| **--auto** | → | → | Auto if score = 9.5 | Trusted autonomous |
| **--fast** | → | → | User approval | Quick prototypes |
| **--no-test** | → | → | User approval | Experimental code |

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Flight** | `assessor` | Evaluate risk and check knowledge-compiler patterns |
| **Execution** | `orchestrator` | Route tasks to specialist agents |
| **Safety** | `recovery` | Save checkpoint before code writes |
| **Post-Cook** | `learner` | Log execution pattern for reuse |

```
Flow:
instruction → implement → verify → learner.log() → done
```

---

## ⚡ MANDATORY: Cooking Protocol

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
  Base skills: [code-craft, problem-checker, smart-router, ...]
  Total active: [count]
```

> **Why:** `/cook` only loads 5 utility skills by default. Dynamic detection ensures domain expertise (e.g., SEO for blog tasks, auth for login tasks) is available during implementation.


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
2. Trigger `recovery` agent to run Checkpoint (`git commit -m "chore(checkpoint): pre-cook"`).

### Phase 2: Mise en Place (Preparation)

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (implementation instruction or plan file path) |
| **OUTPUT** | Understanding of task, related files identified, dependencies mapped |
| **AGENTS** | `orchestrator`, `assessor` |
| **SKILLS** | `context-engineering`, `smart-router` |

1. Parse the instruction to understand exact scope
2. Read related files (imports, types, dependencies)
3. Identify existing code patterns to follow
4. Determine which specialist agent to invoke (frontend, backend, etc.)

### Phase 3: Implementation

| Field | Value |
|-------|-------|
| **INPUT** | Task understanding + related files from Phase 2 |
| **OUTPUT** | Created/modified source files implementing the requested feature |
| **AGENTS** | Auto-routed specialist (`nodejs-pro`, `react-pro`, etc.) |
| **SKILLS** | `code-craft` |

1. Write code following existing patterns strictly
2. One file at a time unless multi-file change is necessary
3. No whitespace changes in unrelated areas
4. Follow `code-craft` standards: 20 lines/function, 3 args max, 2 nesting levels

### Phase 4: Taste Test (Verification)

| Field | Value |
|-------|-------|
| **INPUT** | Modified/created files from Phase 3 |
| **OUTPUT** | Verification result: lint clean, no IDE errors |
| **AGENTS** | `learner` |
| **SKILLS** | `problem-checker`, `knowledge-compiler` |

// turbo — telemetry: phase-4-lint
```bash
npx cross-env OTEL_SERVICE_NAME="workflow:cook" TRACE_ID="$TRACE_ID" npm run lint
```

1. Check `@[current_problems]` for IDE errors
2. Auto-fix if possible (imports, types, lint)
3. Log pattern via `learner`

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

> **After completing /cook, you MUST suggest the next pipeline step to the user.**

```
u{2705} /cook complete u{2192} Suggest: "Run `/validate` to verify changes."
```

---

## 🔄 Rollback & Recovery

If implementation introduces errors that cannot be auto-fixed:
1. Restore previous state (`git checkout -- .` or `git stash pop`).
2. Log failure via `learner` meta-agent to prevent repeating the mistake.
3. Notify user with the specific errors to rethink the approach.

---

## Output Format

```markdown
## 🍳 Cooked: [Component/File Name]

### Changes Applied

| File | Action | Status |
|------|--------|--------|
| `path/to/file.ts` | Created | → |
| `path/to/other.ts` | Modified | → |

### Verification

| Check | Result |
|-------|--------|
| Syntax | → Passed |
| Lint | → No errors |
| IDE Problems | → 0 |

### Next Steps

- [ ] Review the implementation
- [ ] Run `/validate` for full test suite
```

---

## Examples

```
/cook "Create a Button component with primary and secondary variants"
/cook "Implement login logic in auth.ts with JWT validation"
/cook "Refactor UserCard to use Tailwind v4 classes"
/cook "Add pagination to the products API endpoint"
/cook path/to/plan.md --auto
```

---

## Key Principles

- **Speed over ceremony** — no planning documents, no architecture debates, just code
- **Follow existing patterns** — match the codebase style, don't introduce new conventions
- **Minimal diff** — change only what's needed, no unrelated whitespace or refactoring
- **Verify before done** — always lint and check IDE problems, even for quick tasks

---

## 🔗 Workflow Chain

**Skills Loaded (5):**

- `code-craft` - Pragmatic coding standards and clean code
- `problem-checker` - IDE error detection and auto-fix
- `smart-router` - Request classifier and agent routing
- `context-engineering` - Codebase parsing and context gathering
- `knowledge-compiler` - Pattern reading and logging

```mermaid
graph LR
    A["/plan"] --> B["/cook"]
    B --> C["/validate"]
    style B fill:#10b981
```

| After /cook | Run | Purpose |
|------------|-----|---------|
| Task complete | `/validate` | Run tests to ensure correctness |
| Errors found | `/fix` | Fix any resulting issues |
| Need more features | `/build` | Add complex enhancements |

**Handoff to /validate:**

```markdown
✅ Implementation complete. [X] files created/modified.
Run `/validate` to verify behavior with full test suite.
```
