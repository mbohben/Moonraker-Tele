---
name: lifecycle-orchestrator
description: >-
  End-to-end task lifecycle management with state rollback and checkpoint/restore safety.
  Use for complex multi-phase tasks, autopilot coordination, or full lifecycle management.
  NOT for simple single-phase tasks.
metadata:
  author: pikakit
  version: "3.9.206"
  category: system-orchestrator
  triggers: ["complex multi-phase requests", "/autopilot", "/build workflows", "rollback"]
  coordinates_with: ["project-planner", "execution-reporter", "problem-checker"]
  success_metrics: ["100% restore accuracy", "0 skipped verification phases"]
---

# Lifecycle Orchestrator — Pipeline + Checkpoint/Restore

> 7 phases. Checkpoint before risk. 100% restore. No phase skipping.

---

## Prerequisites

**Required:** Node.js (for `state_manager.ts`).

---

## When to Use

| Situation | Action |
|-----------|--------|
| Complex multi-phase task | Use full 7-phase pipeline |
| `/autopilot` or `/build` | Coordinate all phases |
| Rollback needed | Restore from checkpoint |
| Multi-agent task | Monitor handoffs per phase |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| 7-phase pipeline management | Task planning (→ project-planner) |
| Checkpoint save/restore/rollback | Code execution (→ domain agents) |
| Phase enforcement (no skip verify) | Error detection (→ problem-checker) |
| Context monitoring (70%/80%) | Agent routing (→ smart-router) |

**Orchestrator skill:** Manages pipeline state, invokes agents, creates checkpoints. Non-idempotent.

---

## Safety Hierarchy

```
Safety > Recoverability > Correctness > Cleanliness > Convenience
```

---

## Pipeline Phases (7 — Fixed Order)

| Phase | Owner | Exit Criteria |
|-------|-------|--------------|
| **Input** | This skill | Task defined |
| **Plan** | project-planner | PLAN.md approved |
| **Execute** | domain agents | Code complete |
| **Verify** | problem-checker | 0 errors |
| **Deploy** | cicd-pipeline | Deploy complete |
| **Learn** | This skill | Lessons captured |
| **Complete** | This skill | Pipeline done |

**Checkpoint saved before:** Execute, Verify, Deploy. Never skipped.

---

## State Transitions

```
IDLE → INPUT                [start invoked]
INPUT → PLANNING            [advance, task defined]
PLANNING → EXECUTING        [advance, PLAN.md approved]
EXECUTING → VERIFYING       [advance, code complete]
VERIFYING → EXECUTING       [errors found, rollback]
VERIFYING → DEPLOYING       [advance, 0 errors]
DEPLOYING → LEARNING        [advance, deploy complete]
LEARNING → COMPLETED        [advance, lessons captured]  // terminal
VERIFYING → ROLLED_BACK     [rollback invoked]  // terminal
EXECUTING → ROLLED_BACK     [rollback invoked]  // terminal
ANY → FAILED                [unrecoverable error]  // terminal
```

---

## Checkpoint/Restore

| Trigger | Action |
|---------|--------|
| Before >3 file changes | Save state |
| Before risky refactoring | Save state |
| User says "rollback"/"undo" | Restore latest checkpoint |

```bash
node state_manager.ts save --files "file1.tsx,file2.tsx"
node state_manager.ts restore --latest
node state_manager.ts list
```

**Storage:** `.agent/state/{task_id}/`

---

## Context Monitoring

| Usage | Threshold | Action |
|-------|-----------|--------|
| < 70% | Normal | Continue |
| 70-80% | ⚠️ Warning | Compress context |
| > 80% | 🔴 Critical | Isolate sub-tasks |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_PHASE_FAILED` | Yes | Phase agent returned failure |
| `ERR_CHECKPOINT_FAILED` | Yes | Cannot write checkpoint |
| `ERR_RESTORE_FAILED` | No | Cannot restore from checkpoint |
| `ERR_PHASE_SKIP` | No | Attempted to skip a phase |
| `ERR_VERIFY_REQUIRED` | No | Deploy without verify |
| `ERR_INVALID_TASK` | Yes | Task ID not found |
| `WARN_CONTEXT_CRITICAL` | Yes | Context usage > 80% |

**Phase retries:** max 2. Checkpoint save retries: max 1. Restore retries: 0.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Skip verification phase | Complete verify with 0 errors |
| Deploy without checkpoint | Save state before every deploy |
| Ignore context warnings | Compress at 70%, isolate at 80% |
| Auto-delete checkpoints | Manual cleanup only |
| Run concurrent phases | Sequential phases within task |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `execution-reporter` | Skill | Task visibility |
| `problem-checker` | Skill | Error detection |
| `context-engineering` | Skill | Token management |
| `/autopilot` | Workflow | Auto execution |

---

⚡ PikaKit v3.9.206
