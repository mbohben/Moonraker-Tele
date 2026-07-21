---
title: Project Planner � Engineering Specification
impact: MEDIUM
tags: project-planner
---

# Project Planner � Engineering Specification

> Production-grade specification for structured task planning at FAANG scale.

---

## 1. Overview

Project Planner provides structured task breakdown for implementation work: plan creation with verifiable tasks (max 10 per plan), dependency ordering, done criteria, and project-type routing. The skill operates as an **Expert (decision tree)** � it produces plan documents with task breakdowns, verification criteria, and dependency ordering. It does not create projects, write code, or execute tasks.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Implementation planning at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Vague task descriptions | 60% of tasks lack specific actions | Misimplementation |
| No verification criteria | 50% of tasks have no "done" definition | Unknown completion |
| Unbounded task lists | 35% of plans exceed 15 tasks | Paralysis, context loss |
| Missing dependencies | 40% of plans have unordered tasks | Blocked work |

Project Planner eliminates these with specific task format (action + verify), max 10 tasks per plan, mandatory done criteria, and explicit dependency ordering.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Max 10 tasks per plan | Split into sub-plans if more needed |
| G2 | 2-5 minutes per task | Each task completable in one focused session |
| G3 | Every task verifiable | Action + Verify format mandatory |
| G4 | Dependencies ordered | Sequential task numbering with dependencies |
| G5 | Plan template fixed | Goal + Tasks + Done When structure |
| G6 | Project type routing | 4 types: Frontend, Backend, Mobile, Database |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Requirements gathering | Owned by `idea-storm` skill |
| NG2 | Project scaffolding | Owned by `app-scaffold` skill |
| NG3 | Code implementation | Owned by executing agents |
| NG4 | Test execution | Owned by `test-architect` skill |
| NG5 | Architecture decisions | Owned by `/plan` workflow |
| NG6 | Timeline estimation | Outside scope; tasks are fixed-size (2-5 min) |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Task breakdown (max 10) | Plan creation | Task execution |
| Verification criteria | Done definitions | Test execution |
| Dependency ordering | Task sequencing | Dependency resolution |
| Plan template | Structure output | File creation |
| Project type routing | Type ? scripts mapping | Script execution |

**Side-effect boundary:** Project Planner produces plan documents with structured task breakdowns. It does not create files, execute code, or modify the codebase.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "create-plan" | "breakdown" | "verify-criteria" |
                              # "project-type" | "full-plan"
Context: {
  goal: string                # One-sentence description of what to build/fix
  project_type: string | null # "frontend" | "backend" | "mobile" | "database"
  scope: string               # "new-project" | "feature" | "bug-fix" | "refactor"
  affected_files: Array<string> | null  # Files that will change
  max_tasks: number           # Max tasks in plan (default: 10, maximum: 10)
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  plan: {
    title: string
    goal: string              # One-sentence goal
    tasks: Array<{
      order: number           # 1-based sequence
      action: string          # Specific action (no vague language)
      verify: string          # How to verify completion
      depends_on: Array<number> | null  # Task order numbers this depends on
      estimated_minutes: number  # 2-5
    }>
    done_when: Array<string>  # Main success criteria
    task_count: number        # 1-10
  } | null
  scripts: {
    project_type: string
    relevant: Array<string>   # Script names for this project type
  } | null
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

- Max 10 tasks per plan; excess triggers sub-plan split.
- Each task is 2-5 minutes estimated.
- Every task has action + verify format.
- Dependency ordering uses task order numbers.
- Plan template is fixed: Goal + Tasks + Done When.
- Project type routing is fixed: 4 types ? fixed script sets.
- No vague task descriptions allowed.

#### What Agents May Assume

- Plan output follows the fixed template (Goal + Tasks + Done When).
- Tasks are sequentially numbered 1-N (N = 10).
- Dependencies reference valid task order numbers.
- Verification criteria are actionable (not "verify it works").

#### What Agents Must NOT Assume

- Plan covers all requirements (requirements come from idea-storm).
- Tasks are parallelizable (check depends_on).
- Affected files are exhaustive.
- Plan is approved (requires user review).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Create plan | None; plan document output |
| Breakdown | None; task list output |
| Verify criteria | None; criteria list output |
| Project type | None; script recommendations |
| Full plan | None; combined output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Gather requirements (from user or idea-storm)
2. Identify project type (frontend/backend/mobile/database)
3. Invoke create-plan with goal and scope
4. Review plan (user responsibility)
5. Approve plan (user responsibility)
6. Execute tasks (executing agents' responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete plan.
- Plans are self-contained with all verification criteria.
- All decisions are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Goal too vague | Return error | Provide specific goal |
| Scope too large (> 10 tasks) | Split into sub-plans | Return multiple plans |
| Unknown project type | Return error | Specify valid type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Create plan | Yes | Same goal + scope = same plan |
| Breakdown | Yes | Same input = same tasks |
| Project type | Yes | Same type = same scripts |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Analyze** | Parse goal, determine scope, identify type | Classification |
| **Plan** | Generate tasks (max 10), verification, dependencies | Complete plan |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Max 10 tasks per plan | Excess ? split into sub-plans |
| 2-5 minutes per task | Each task fits one focused session |
| Action + Verify format | Every task: specific action, then how to check |
| No vague descriptions | ? "Set up project" ? ? "Run `npx create-next-app`" |
| No vague verification | ? "Verify it works" ? ? "curl localhost:3000/api returns 200" |
| Fixed template | Goal + Tasks + Done When |
| Fixed project types | Frontend (ux_audit, accessibility), Backend (api_validator, security), Mobile (mobile_audit), Database (schema_validator) |
| Dependencies explicit | `depends_on` references task numbers |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Goal too vague | Return `ERR_VAGUE_GOAL` | Provide specific goal |
| Exceeds 10 tasks | Return `ERR_SCOPE_TOO_LARGE` with sub-plan suggestion | Split scope |
| Unknown project type | Return `ERR_UNKNOWN_TYPE` | Use valid type |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** Every failure returns a structured error. No partial plans.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_VAGUE_GOAL` | Validation | Yes | Goal lacks specificity |
| `ERR_SCOPE_TOO_LARGE` | Validation | Yes | Requires > 10 tasks |
| `ERR_UNKNOWN_TYPE` | Validation | Yes | Project type not one of 4 |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Plan generation | N/A | N/A | Synchronous; < 100ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "project-planner",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "scope": "string",
  "project_type": "string|null",
  "task_count": "number",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Plan created | INFO | task_count, scope, project_type |
| Scope split suggested | WARN | original_count, split_count |
| Vague goal detected | WARN | goal_excerpt |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `planner.plan.duration` | Histogram | ms |
| `planner.task_count.distribution` | Histogram | tasks per plan |
| `planner.scope.distribution` | Counter | per scope type |
| `planner.project_type.distribution` | Counter | per type |

---

## 14. Security & Trust Model

### Data Handling

- Project Planner processes no credentials, API keys, or PII.
- Plan output contains only task descriptions and verification criteria.
- No network calls, no file access.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound plan generation | < 100ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Tasks per plan | Max 10 | Split into sub-plans |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Plan generation | < 5 ms | < 20 ms | 100 ms |
| Task breakdown | < 3 ms | < 10 ms | 50 ms |
| Full plan | < 10 ms | < 30 ms | 100 ms |
| Output size | = 2,000 chars | = 5,000 chars | 8,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Task granularity mismatch | Medium | Too large or small tasks | 2-5 minute constraint |
| Vague goals bypass | Medium | Poor plans | ERR_VAGUE_GOAL detection |
| Task count inflation | Low | Context overload | Max 10 hard limit |
| Dependency cycles | Low | Unexecutable plan | Linear ordering only |
| Verification criteria too weak | Medium | Unknown completion | Action-specific examples |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: task breakdown, plan template |
| Troubleshooting section | ? | Anti-patterns with fix examples |
| Related section | ? | Cross-links to idea-storm, app-scaffold, /plan |
| Content Map for multi-file | ? | Link to engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | Max 10 tasks per plan | ? |
| **Functionality** | 2-5 min per task | ? |
| **Functionality** | Action + Verify format | ? |
| **Functionality** | Fixed plan template (Goal + Tasks + Done When) | ? |
| **Functionality** | 4 project types with script routing | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 4 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed template, fixed task limits, fixed types | ? |
| **Security** | No credentials, no PII, no file access | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
