---
description: Project blueprint generator — requirements discovery, architecture decisions, hierarchical task breakdown, agent assignment, and PLAN.md creation without writing code.
skills: [idea-storm, project-planner, system-design, context-engineering, problem-checker, knowledge-compiler]
agents: [orchestrator, assessor, recovery, learner, project-planner]
---

# /plan - Project Blueprint

$ARGUMENTS

---

## Purpose

Create comprehensive project plans with task breakdown, architecture decisions, tech stack selection, and agent assignments — generating `docs/PLAN-{slug}.md` as the execution blueprint. **Differs from `/think` (explores options) and `/build` (writes code) by producing planning artifacts only — NO CODE.** Uses `project-planner` with `project-planner` skill for task decomposition and `idea-storm` for requirements discovery.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Flight** | `assessor` | Evaluate planning scope, risks, and knowledge-compiler context |
| **Execution** | `orchestrator` | Coordinate requirements, architecture, and task breakdown |
| **Safety** | `recovery` | Save state and recover from planning failures |
| **Post-Plan** | `learner` | Log architecture decisions and planning patterns |

```
Flow:
requirements → architecture → task breakdown
       ↓
assessor.evaluate(plan_risk)
       ↓
agent assignment → PLAN.md → learner.log()
       ↓
handoff to /build
```

---

## ⚡ MANDATORY: 4-Phase Planning Protocol

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
  Base skills: [idea-storm, project-planner, system-design, ...]
  Total active: [count]
```

> **Why:** Without Phase 0, `/plan` only loads 6 generic planning skills — missing domain expertise (SEO, auth, mobile, etc.) that could improve architecture decisions.


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
2. Trigger `recovery` agent to run Checkpoint (`git commit -m "chore(checkpoint): pre-plan"`).

### Phase 2: Requirements Discovery

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (project description) |
| **OUTPUT** | Requirements doc: goal, users, features, constraints |
| **AGENTS** | `project-planner`, `assessor` |
| **SKILLS** | `idea-storm`, `context-engineering` |

// turbo — telemetry: phase-2-requirements

Ask if not provided:

| Question | Purpose |
|----------|---------|
| What is the GOAL? | One sentence objective |
| Who are the USERS? | Target persona |
| MUST-HAVE features? | 3-5 core items |
| NICE-TO-HAVE? | Optional features |
| TIMELINE? | Deadline or estimate |
| CONSTRAINTS? | Budget, tech, team |

### Phase 3: Architecture Decision

| Field | Value |
|-------|-------|
| **INPUT** | Requirements from Phase 2 |
| **OUTPUT** | Tech stack decisions with rationale, architecture diagram |
| **AGENTS** | `project-planner`, `orchestrator` |
| **SKILLS** | `system-design`, `project-planner` |

// turbo — telemetry: phase-3-architecture

| Decision | Options | Selection Criteria |
|----------|---------|-------------------|
| Frontend | Next.js / Vite / Remix / Astro | SSR needs, SEO, complexity |
| Backend | Hono / Express / FastAPI / NestJS | Scale, team, language |
| Database | PostgreSQL / MongoDB / Supabase | Structure, scale, cost |
| Auth | Clerk / NextAuth / Custom | Speed, features, budget |
| Hosting | Cloudflare / Vercel / Railway / AWS | Scale, budget, complexity |

Architecture patterns:

| Pattern | When | Complexity |
|---------|------|-----------|
| **Monolith** | MVP, small team | Low |
| **Modular Monolith** | Growing team, future split | Medium |
| **Serverless** | Event-driven, variable load | Medium |
| **Microservices** | Large team, independent scaling | High |

Generate C4 architecture diagram (mermaid) and ADR for key decisions.

### Phase 4: Task Breakdown

| Field | Value |
|-------|-------|
| **INPUT** | Architecture decisions from Phase 3 |
| **OUTPUT** | Hierarchical task list: Epics → Stories → Tasks → Subtasks |
| **AGENTS** | `project-planner` |
| **SKILLS** | `project-planner` |

// turbo — telemetry: phase-4-breakdown

```
Level 1: Epics (major features)
Level 2: Stories (user-facing items)
Level 3: Tasks (technical work)
Level 4: Subtasks (atomic units)
```

### Phase 5: Agent Assignment & Plan Generation

| Field | Value |
|-------|-------|
| **INPUT** | Task breakdown from Phase 4 |
| **OUTPUT** | `docs/PLAN-{slug}.md` with execution plan |
| **AGENTS** | `project-planner`, `learner` |
| **SKILLS** | `project-planner`, `problem-checker`, `knowledge-compiler` |

// turbo — telemetry: phase-5-generate

1. Assign agents to tasks based on capability:

| Task Type | Agent | Skill |
|-----------|-------|-------|
| Schema design | `data-modeler` | `data-modeler` |
| API routes | `nodejs-pro` | `nodejs-pro` |
| UI components | `react-pro` | `react-pro` |
| Tests | `test-architect` | `test-architect` |

2. `assessor` evaluates architecture risk
3. Generate `docs/PLAN-{slug}.md`

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

> **Note:** /plan produces markdown artifacts, not code. This check applies to any generated config or schema files.


---

## 📚 MANDATORY: Post-Completion Knowledge Check

> **Protocol:** `.agent/rules/auto-knowledge-ingest.md`
> **Channel 2:** AI self-reflects on session to capture non-trivial lessons.

```
1. Self-reflect: "Was this session non-trivial?"
   - Did I fix a multi-file bug?
   - Did I discover a framework/API gotcha?
   - Did I make an architectural decision?
   - Did I work around a platform limitation?
2. If ALL answers are NO → skip (trivial session)
3. If ANY answer is YES:
   a. Score significance (multi-file: +2, workaround: +3, API quirk: +3)
   b. If score ≥ 3 → generate signal to raw-signals/SIG-{NNN}.md
   c. If uncompiled signals > 5 → auto-compile
4. Proceed to "Suggest Next Workflow"
```

---

## ⏭️ MANDATORY: Suggest Next Workflow

> **After completing /plan, you MUST suggest the next pipeline step to the user.**

```
✅ /plan complete → Suggest: "Run `/build` to start implementation."
```

---

## 🔄 Rollback & Recovery

If planning produces an invalid architecture or overwrites an existing valid PLAN.md:
1. Revert the file changes using `recovery` meta-agent.
2. Review past architecture decisions through `learner`.
3. Prompt for correct requirements before generating the plan again.

---

## Output Format

Generated file: `docs/PLAN-{slug}.md`

```markdown
## 📋 Plan: [Project Name]

### Overview

| Aspect | Value |
|--------|-------|
| Goal | [One sentence] |
| Timeline | [X days/weeks] |
| Complexity | Low / Medium / High |
| Agents | [Count] assigned |

### Stack Decision

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | Next.js 15 | SSR, edge-ready |
| Backend | Hono | Type-safe, edge |
| Database | PostgreSQL | Structured, scalable |

### Architecture

[Mermaid C4 diagram]

### Task Breakdown

- [ ] Epic 1: [Feature]
  - [ ] Story 1.1: [Description]
    - [ ] Task 1.1.1: [Work item]

### Agent Execution Plan

| Phase | Agent | Task | Duration |
|-------|-------|------|----------|
| 1 | `data-modeler` | Schema | 30m |
| 2 | `nodejs-pro` | API | 2h |
| 3 | `react-pro` | UI | 3h |
| 4 | `test-architect` | Tests | 1h |

### Next Steps

- [ ] Review architecture decisions
- [ ] Approve plan
- [ ] Run `/build` to start implementation
```

---

## Examples

```
/plan e-commerce site with cart and checkout
/plan REST API for user management
/plan mobile fitness app with tracking
/plan SaaS dashboard with analytics
/plan microservices architecture for fintech
```

---

## Key Principles

- **No code** — /plan produces planning artifacts only, never implementations
- **Ask before assuming** — clarify requirements with Socratic questions
- **Decisions with rationale** — every tech choice must explain WHY
- **Atomic tasks** — break down to the smallest executable unit
- **Agent-ready** — assign agents so `/build` can execute immediately

---

## 🔗 Workflow Chain

**Skills Loaded (6):**

- `idea-storm` - Socratic questioning and requirements clarification
- `project-planner` - Task breakdown and dependency planning
- `system-design` - Architecture decision-making framework
- `context-engineering` - Codebase parsing and context extraction
- `problem-checker` - Generated config and schema problem verification
- `knowledge-compiler` - Learning and logging planning patterns

```mermaid
graph LR
    A["/think"] --> B["/plan"]
    B --> C["/build"]
    C --> D["/validate"]
    style B fill:#10b981
```

| After /plan | Run | Purpose |
|------------|-----|---------|
| Plan approved | `/build` | Start implementation |
| Complex project | `/autopilot` | Full orchestration |
| Need more thinking | `/think` | Explore alternatives |

**Handoff to /build:**

```markdown
✅ Plan created: docs/PLAN-{slug}.md
Stack: [stack]. Tasks: [count]. Agents: [count].
Review and run `/build` to start implementation.
```
