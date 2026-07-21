---
trigger: always_on
---

# PikaKit — Autopilot

# TIER 0.5: AUTONOMOUS EXECUTION (AUTOPILOT RULES)

> Enable true autonomous execution after plan approval. Applies to /autopilot, multi-phase workflows.

## 0.5-A: Agent Hierarchy

| Role | Decides | Executes | Owns |
|------|---------|----------|------|
| **User** | Approve/reject plans | - | Final authority |
| **Lead** | Strategic direction | - | Plan vision |
| **Orchestrator** | Execution order, retry | Runtime control | Execution state |
| **Domain Agent** | Technical approach | Code/tests/docs | Deliverables |
| **Meta Agent** | Risk, recovery | Checkpoints | Safety |

**Rules:** Single Root (Orchestrator). No Bypass. Escalation: Agent → Orchestrator → Lead → User.

## 0.5-B: Plan Approval

| State | Gate | Description |
|-------|------|-------------|
| `DRAFT` | Socratic: ON | Plan being created |
| `PENDING_APPROVAL` | Socratic: ON | Waiting for user |
| `APPROVED` | **Socratic: OFF** | User said "approved/proceed/yes/go" |
| `EXECUTING` | **Socratic: OFF** | Continuous execution |
| `PAUSED` | Socratic: ON | User interrupted |
| `COMPLETED` | - | All done |

> 🔴 Once APPROVED, Socratic Gate is **BYPASSED** until COMPLETED or PAUSED.

## 0.5-C: Autopilot Protocol (10 Phases)

| Phase | Actor | Action |
|-------|-------|--------|
| 1-3 | Planner | Intent → Decomposition → PLAN.md (sequential, may ask questions) |
| 4 | **User** | **Plan Approval** (BLOCKING) |
| 5-10 | Orchestrator + Agents | Assignment → Workflow → Execute → Track → Recover → Report (CONTINUOUS) |

**Handoff:** Always pass original_request, decisions_made, previous_work, current_plan.  
**Stop:** All complete, blocking error, user pause, or critical decision needed.

## 0.5-D: Metrics (11 Required)

| Metric | Target |
|--------|--------|
| `time_to_completion` | minimize |
| `skill_reuse_rate` | >50% |
| `human_intervention_count` | 0 (autopilot) |
| `error_retry_rate` | <10% |
| `first_time_success_rate` | >85% |
| `auto_fix_rate` | >85% |
| `plan_adherence` | 100% |

Storage: `.agent/metrics/` (JSON, 30-day retention).

## 0.5-E: Failure Recovery (6 Levels)

> **Scope:** Applies during autopilot/multi-phase execution. For manual mode, follow `GEMINI.md § FAILURE RECOVERY` (restore → state → propose).

| Level | Action | Escalation |
|-------|--------|------------|
| 1 | Auto-fix (imports, lint, types) | → 2 |
| 2 | Retry with backoff (max 3) | → 3 |
| 3 | Restore checkpoint | → 4 |
| 4 | Undo phase, retry | → 5 |
| 5 | Full rollback | → 6 |
| 6 | Notify user | - |

> Exhaust all automated levels before escalating to user.

## 0.5-F: Meta-Agents (5)

| Agent | Role | When |
|-------|------|------|
| `orchestrator` | Root executor | Multi-agent coordination |
| `assessor` | Risk evaluation | Before risky operations |
| `recovery` | State management | Save/restore checkpoints |
| `critic` | Conflict resolution | Agent disagreements |
| `learner` | Continuous improvement | After success/failure |

## 0.5-G: SLO Enforcement

> Canonical rule lives in `code-rules.md § Problem Verification (MANDATORY)`.  
> This section defers entirely to that canonical source — do not duplicate here.

## 0.5-H: Auto-Learn Triggers

**Trigger conditions:**
1. **User-initiated:** User says "mistake", "wrong", "fix this", "broken"
2. **AI regression fix:** AI fixes a bug caused by its own previous change
3. **Retry pattern:** AI retries the same operation > 1 time before success
4. **Multi-file fix:** AI fixes a bug involving CSS/framework quirks across files
5. **Workflow violation:** AI breaks a workflow protocol (e.g., writing code in `/think`)

**When triggered:** Analyze → Extract lesson → `@[skills/knowledge-compiler]` Learn operation → Confirm: `📚 Learned: [LEARN-XXX]`

| Category | ID Pattern |
|----------|------------|
| Safety | `SAFE-XXX` |
| Code | `CODE-XXX` |
| Workflow | `FLOW-XXX` |
| Integration | `INT-XXX` |

> Skills generated from patterns MUST comply with `docs/SKILL_DESIGN_GUIDE.md` (YAML, <200 lines, registered).

## 0.5-I: Context Passing

When invoking ANY sub-agent, MUST include: Original Request, Decisions Made, Previous Agent Work, Current Plan.  
> **VIOLATION:** Invoking agent without context = wrong assumptions!

## 0.5-J: Output Branding (Aligned with Task Levels)

| Task Level | Start | End |
|-----------|-------|-----|
| L0 (Question) | — | — |
| L1 (Quick fix) | `[⚡PikaKit] L1/@{skill} → INIT → RUNNING` | `[⚡PikaKit] Task → COMPLETED` |
| L2 (Multi-file) | `[⚡PikaKit] System` Tree | `[⚡PikaKit] Task → COMPLETED ({file_count} files)` |
| L3 (Architecture) | `[⚡PikaKit] System` Tree | `[⚡PikaKit] Task → COMPLETED ({file_count} files)` |
| Workflow (/cmd) | `[⚡PikaKit] Workflow:/{name} → INIT → RUNNING` | `[⚡PikaKit] Workflow → COMPLETED` |

## 0.5-K: Knowledge Pattern Check (MANDATORY)

> **Purpose:** AI MUST consult learned patterns before repeating known mistakes.

**BEFORE any of these actions, read `.agent/knowledge/patterns/` for matches:**

| Action | Check Files | Example |
|--------|-------------|---------|
| Running terminal commands | `shell-syntax-patterns.md` | PowerShell `&&` → use `;` |
| Writing imports | `import-patterns.md` | Missing imports, wrong paths |
| Fixing type errors | `type-patterns.md` | Type mismatches, property errors |
| npm/git operations | `npm-patterns.md`, `git-patterns.md` | Known failures |
| Any error you just caused | ALL pattern files | Prevent immediate repeat |

### Protocol

```
BEFORE executing command or writing code:
1. Check if knowledge/patterns/ exists
2. Scan relevant {category}-patterns.md for matching context
3. If match found → Apply the solution, do NOT repeat the mistake
4. If no match → Proceed normally
```

### Enforcement (Tiered — P2 Level)

> **Priority:** P2 (Suggestion). Learned patterns are auto-generated and advisory.
> Context may differ from when the pattern was learned. Use judgment.

| Occurrence | Level | Action |
|-----------|-------|--------|
| 1st time ignoring pattern | 💡 **Log** | Note in console, increment occurrence count |
| 2nd time same pattern | ⚠️ **Warn** | Re-read patterns/, apply if applicable |
| 3+ same pattern | 📊 **Flag** | Mark as high-frequency, prioritize for skill generation |

```
IF action matches a learned pattern:
  → SHOULD apply the solution (not MUST)
  → If context differs → OK to skip, but log reason
  → If same context AND ignored → increment + warn
```

> 💡 **Rule:** Learned patterns are advisory (P2), not safety-critical (P0).
> Treat them as "strong suggestions from past experience".

<!-- PIKAKIT ACTIVE PATTERNS (auto-updated, do not edit manually) -->
<!-- END PIKAKIT ACTIVE PATTERNS -->

---

## CRITICAL: AGENT & SKILL PROTOCOL

> **MANDATORY:** Read the appropriate skill's AGENTS.md BEFORE implementation.
> **NON-NEGOTIABLE:** `skills/code-constitution` = SUPREME LAW among skills. GEMINI.md (P0) > Constitution > any other skill.
> **Per-level routing (L0–L3):** See `code-rules.md § Agent Routing` (canonical). This section covers skill priority and invocation contracts.

### 1. Modular Skill Loading

```
User Request → Skill Description Match → Load SKILL.md → Read AGENTS.md (if exists) → Read rules/
```

**Rule Priority:** P0 (`.agent/rules/` — global rules) > P1 (SKILL.md + AGENTS.md) > P2 (skill-local `rules/` folders). All binding.  
**Selective Reading:** Read SKILL.md first, then AGENTS.md for domain expertise, then only sections matching user's request.

### 2. Enforcement

✅ Read Rules → Match Skill → Load SKILL.md → Read AGENTS.md → Apply All.  
❌ Never skip reading skill instructions for L2+ tasks. L1 tasks may apply from memory (see `code-rules.md § Agent Routing`).

### 3. Skill Invocation Contract

| Trigger | Description |
|---------|-------------|
| **Explicit** | User mentions skill name |
| **Implicit** | Request matches skill keywords |
| **Chained** | Skill A `coordinates_with` Skill B |

**Pre-conditions:** skill exists, no P0/P1 conflict, context matches.  
**Post-conditions:** deliverable created, no regression, rules applied.  
**Chaining:** A→B OK if declared in `coordinates_with`. No circular deps (A→B→A forbidden).  
**Fallback:** Skill not found → proceed with GEMINI.md rules. Conflict with P0 → P0 wins.

---
