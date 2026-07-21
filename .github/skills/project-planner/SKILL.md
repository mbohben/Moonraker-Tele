---
name: project-planner
description: >-
  Structured task planning with breakdowns, dependencies, and verification criteria.
  Use when planning multi-step features, refactoring, or any work requiring task decomposition.
  NOT for quick single-file fixes or questions.
metadata:
  author: pikakit
  version: "3.9.206"
  category: project-planning
  triggers: ["plan", "breakdown", "tasks", "implementation strategy", "project scope"]
  coordinates_with: ["idea-storm", "smart-router", "problem-checker", "knowledge-compiler"]
  success_metrics: ["Verifiable Tasks", "Correct Delegations"]
---

# Project Planner — Structured Task Breakdown

> Max 10 tasks. 2-5 min each. Action + Verify format. Dependencies explicit.

---

## 5 Must-Ask Questions (Before Planning)

| # | Question | Options |
|---|----------|---------|
| 1 | Project Type? | Web / Mobile / Backend / Game |
| 2 | Target Goal? | What is the core issue/feature being planned? |
| 3 | Current Context? | Starting from scratch vs extending existing? |
| 4 | Complexity/Scale? | Single file vs architecture wide? |
| 5 | Constraints? | Target frameworks, strict dependencies, budget? |

---

## When to Use

| Situation | Action |
|-----------|--------|
| New project from scratch | Create full plan |
| Adding a feature | Plan affected files |
| Complex bug fix | Plan investigation steps |
| Refactoring multiple files | Plan change order |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Task breakdown (max 10) | Requirements gathering (→ idea-storm) |
| Verification criteria | Project scaffolding (→ app-scaffold) |
| Dependency ordering | Code implementation |
| Plan template | Test execution (→ test-architect) |

**Expert decision skill:** Produces plan documents. Does not write code.

---

## Task Breakdown Principles (Fixed)

| Principle | Constraint |
|-----------|-----------|
| **Small, Focused** | 2-5 minutes per task |
| **Verifiable** | Every task: action + how to verify |
| **Ordered** | Dependencies via `depends_on` |
| **Specific** | No vague descriptions |
| **Bounded** | Max 10 tasks; split into sub-plans if more |

---

## Plan Template (Fixed)

```markdown
# [Task Name]

## Goal
One sentence: What are we building/fixing?

## Tasks
- [ ] Task 1: [Specific action] → Verify: [How to check]
- [ ] Task 2: [Specific action] → Verify: [How to check]
- [ ] Task 3: [Specific action] → Verify: [How to check]

## Done When
- [ ] [Main success criteria]
```

---

## Specificity Rules (Non-Negotiable)

| ❌ Vague | ✅ Specific |
|----------|-----------|
| "Set up project" | "Run `npx create-next-app`" |
| "Add authentication" | "Install next-auth, create auth route" |
| "Style the UI" | "Add Tailwind classes to `Header.tsx`" |
| "Verify it works" | "Run dev, click button, see toast" |
| "Test the API" | "curl localhost:3000/api returns 200" |

---

## Project Type Scripts (Fixed)

| Project Type | Relevant Scripts |
|--------------|-----------------|
| Frontend/React | `ux_audit.ts`, `accessibility_checker.ts` |
| Backend/API | `api_validator.ts`, `security_scan.ts` |
| Mobile | `mobile_audit.ts` |
| Database | `schema_validator.ts` |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_VAGUE_GOAL` | Yes | Goal lacks specificity |
| `ERR_SCOPE_TOO_LARGE` | Yes | Requires > 10 tasks |
| `ERR_UNKNOWN_TYPE` | Yes | Project type not one of 4 |

**Zero internal retries.** Deterministic; same goal + scope = same plan.

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `plan_started` | `{"project_type": "...", "target_goal": "..."}` | `INFO` |
| `tasks_decomposed` | `{"task_count": 5, "dependencies_mapped": true}` | `INFO` |
| `plan_completed` | `{"plan_file": "{task-slug}.md", "agents_assigned": [...]}` | `INFO` |
| `plan_failed` | `{"reason": "ERR_SCOPE_TOO_LARGE"}` | `ERROR` |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Create plans with > 10 tasks | Split into sub-plans |
| Use vague task descriptions | Be specific: command, file, action |
| Use vague verification | Specify: URL, status code, visible result |
| Skip dependency ordering | Use `depends_on` task numbers |
| Estimate without bounds | Use 2-5 minute fixed range |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/plan` | Workflow | Architecture planning |
| `idea-storm` | Skill | Requirements gathering |
| `app-scaffold` | Skill | Project setup |

---

⚡ PikaKit v3.9.206
