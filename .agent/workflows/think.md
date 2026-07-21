---
description: Strategic decision engine — generate 3+ distinct alternatives with weighted scoring matrices, risk assessments, and actionable recommendations before writing any code.
skills: [idea-storm, system-design, project-planner, context-engineering, problem-checker, knowledge-compiler]
agents: [orchestrator, assessor, recovery, critic, learner, project-planner]
---

# /think - Strategic Decision Engine

$ARGUMENTS

---

## Purpose

Activate structured ideation mode for architecture decisions, feature planning, and problem-solving — generating 3+ distinct options with weighted scoring matrices and risk assessments. **Differs from `/plan` (creates task breakdown and PLAN.md) and `/build` (writes code) by producing actionable decision matrices only — NO CODE, NO PLANS.** Uses `project-planner` with `idea-storm` for Socratic questioning and `system-design` for trade-off evaluation.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Flight** | `assessor` | Evaluate decision scope and knowledge-compiler context |
| **Execution** | `orchestrator` / `critic` | Coordinate problem framing, option generation and resolve scoring conflicts |
| **Safety** | `recovery` | Save state and recover from decision generation failures |
| **Post-Think** | `learner` | Log decision outcomes and scoring intelligence |

```
Flow:
generate options ’ score(decision_matrix)
       ↓
scores too close? ’ critic.arbitrate()
       ↓
decision made ’ recommendation + next steps
```

---

## 🔴 MANDATORY: Decision Framework

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
  Base skills: [idea-storm, system-design, project-planner, ...]
  Total active: [count]
```

> **Why:** `/think` loads 6 strategic skills by default. Dynamic detection ensures domain-specific context (SEO, auth, mobile, etc.) is available for better option generation and trade-off analysis.

### Phase 0.5: Pre-flight & Auto-Learned Context

> **Rule 0.5-K:** Auto-learned pattern check.

1. Read `.agent/knowledge/patterns/` for past failures before proceeding.
2. Trigger `recovery` agent to run Checkpoint (`git commit -m "chore(checkpoint): pre-think"`).


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
2. Trigger `recovery` agent to run Checkpoint (`git commit -m "chore(checkpoint): pre-think"`).

### Phase 2: Problem Framing

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (decision topic or problem statement) |
| **OUTPUT** | Framed problem: outcome, constraints, stakeholders, risk tolerance |
| **AGENTS** | `project-planner`, `assessor` |
| **SKILLS** | `idea-storm`, `context-engineering` |

// turbo — telemetry: phase-2-framing

Ask if not provided:

| Question | Purpose |
|----------|---------|
| What OUTCOME do we want? | Define success criteria |
| What CONSTRAINTS exist? | Time, budget, tech limitations |
| Who are the STAKEHOLDERS? | Users, team, business |
| What is the RISK TOLERANCE? | MVP / Production / Enterprise |

### Phase 3: Generate 3+ Options

| Field | Value |
|-------|-------|
| **INPUT** | Problem frame from Phase 2 |
| **OUTPUT** | 3+ distinct approaches with pros/cons |
| **AGENTS** | `project-planner`, `orchestrator` |
| **SKILLS** | `idea-storm`, `system-design` |

// turbo — telemetry: phase-3-options

**Minimum 3 distinct approaches. Include one "unconventional" option.**

For each option:
- Description and approach
- Pros / Cons table
- Effort estimate (Low / Medium / High)

### Phase 4: Decision Matrix & Recommendation

| Field | Value |
|-------|-------|
| **INPUT** | Options from Phase 3 |
| **OUTPUT** | Scored decision matrix, recommended option, risk assessment |
| **AGENTS** | `project-planner`, `critic`, `learner` |
| **SKILLS** | `system-design`, `problem-checker`, `knowledge-compiler` |

// turbo — telemetry: phase-4-decision

Score each option 1-5:

| Criteria | Weight | Option A | Option B | Option C |
|----------|--------|----------|----------|----------|
| Implementation Speed | 20% | → | → | → |
| Scalability | 25% | → | → | → |
| Maintainability | 20% | → | → | → |
| Team Expertise | 15% | → | → | → |
| Cost | 20% | → | → | → |
| **Weighted Score** | 100% | **?** | **?** | **?** |

If scores too close ’ `critic` arbitrates.

Risk assessment for top option:
- 🔴 **Blockers** — what could make this fail?
- 🟡 **Mitigations** — how to reduce risk?
- 🟢 **Quick Wins** — what to validate first?

---

## ⛔ MANDATORY: Problem Verification Before Completion

> **CRITICAL:** This check MUST be performed before any `notify_user` or task completion.

### Check @[current_problems]

```
1. Read @[current_problems] from IDE
2. If errors/warnings > 0:
   a. Auto-fix: imports, types, lint errors
   b. Re-check @[current_problems]
   c. If still > 0 ’ STOP ’ Notify user
3. If count = 0 ’ Proceed to completion
```

> **Note:** /think produces decisions, not code. This check applies only if any artifacts were generated.


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

> **After completing /think, you MUST suggest the next pipeline step to the user.**

```
✅ /think complete → Suggest: "Run `/plan` to create implementation plan."
```

---

## 🔙 Rollback & Recovery

If the generated decision matrix is flawed, overly generic, or hallucinates constraints:
1. Revert any generated markdown files using the `recovery` meta-agent.
2. Feed the failed reasoning back to the `critic` agent to identify logic gaps.
3. Retry Phase 3 with more explicit constraints or a completely different Socratic framing.

---

## Output Format

```markdown
## 🧠 Decision: [Topic]

### Context
[1-2 sentence problem statement]

### Constraints
- ⏱️ Timeline: [deadline]
- ’ Budget: [resources]
- 🛠️ Tech: [stack requirements]

### Option A: [Name] ⭐ RECOMMENDED
[Description]

| Pros | Cons |
|------|------|
| ✅ [benefit] | ❌ [drawback] |

📊 Score: 4.2/5 | ⏱️ Effort: Medium

### Option B: [Name]
[Description]

📊 Score: 3.5/5 | ⏱️ Effort: Low

### Option C: [Name] 🚀 UNCONVENTIONAL
[Description]

📊 Score: 3.0/5 | ⏱️ Effort: High

### Decision Matrix

| Criteria | Weight | A | B | C |
|----------|--------|---|---|---|
| Speed | 20% | 4 | 5 | 2 |
| Scalability | 25% | 5 | 3 | 5 |
| Maintainability | 20% | 4 | 4 | 3 |
| Team Fit | 15% | 4 | 5 | 2 |
| Cost | 20% | 3 | 4 | 2 |
| **Total** | | **4.1** | **4.0** | **2.9** |

### Recommendation

**Option A** wins with score 4.1/5.
- 🔴 Blocker: [potential issue]
- 🟡 Mitigation: [how to address]
- 🟢 Validate First: [quick experiment]

### Next Steps

- [ ] Approve Option A
- [ ] Run `/plan` to create implementation plan
- [ ] Or `/think` again for deeper analysis
```

---

## Examples

```
/think authentication: JWT vs Session vs OAuth
/think state management: Redux vs Zustand vs Context
/think database: PostgreSQL vs MongoDB vs Supabase
/think hosting: Vercel vs AWS vs Railway
/think monorepo vs polyrepo for microservices
```

---

## Key Principles

- **Quantify decisions** — use weighted scoring, not just vibes
- **Include unconventional** — the wild option often sparks insights
- **Risk-first thinking** — identify blockers before committing
- **Actionable output** — end with clear next steps, not abstract analysis
- **No code** — this is strategy, not implementation

---

## — Workflow Chain

**Skills Loaded (6):**

- `idea-storm` - Socratic questioning and brainstorming
- `system-design` - Trade-off evaluation and ADR
- `project-planner` - Task breakdown and feasibility
- `context-engineering` - Codebase parsing and context extraction
- `problem-checker` - Generated artifacts validation
- `knowledge-compiler` - Learning and logging decision patterns

```mermaid
graph LR
    A["/think"] --> B["/plan"]
    B --> C["/build"]
    style A fill:#10b981
```

| After /think | Run | Purpose |
|-------------|-----|---------|
| Decision made | `/plan` | Create detailed implementation plan |
| Need more research | `/think` | Explore deeper with different framing |
| Complex task | `/autopilot` | Full autonomous coordination |

**Handoff to /plan:**

```markdown
🧠 Decision: Option [X] approved — [name] ([score]/5).
Run `/plan` to create implementation plan.
```
