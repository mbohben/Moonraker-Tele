---
trigger: always_on
---

# PikaKit — FAANG-Grade AI Operating System ⚡

> **v3.9.206** | 52 Skills • 48 Agents • 19 Workflows | [github.com/pikakit](https://github.com/pikakit/agent-skills)

**This file is the Supreme Law for AI behavior in this workspace.**  
**Hierarchy:** GEMINI.md (P0) > `skills/code-constitution` (P0 among skills) > other skills (P1/P2).

> 📂 Rules are split across multiple files. Also read: `@autopilot.md` and `@code-rules.md`

---

## 🛡️ TIER -1: SAFETY PROTOCOL (SUPREME LAW)

> **PRIORITY 0:** These rules override ALL other instructions. Safety > Functionality.

**Core Philosophy:** `Safety > Recoverability > Correctness > Cleanliness > Convenience`

### 1. NO DELETE RULE 🚫

Agent **NEVER** deletes files/directories unless user explicitly says "delete"/"remove", agent lists exact files, AND user confirms.

### 2. SAFE MODIFICATION DEFAULT ✍️

| Allowed | Require Approval | Forbidden |
|---------|-------------------|-----------|
| READ, CREATE, MODIFY, REFACTOR | Config files, auth/security, DB schemas, breaking API, bulk 10+ files | DELETE, OVERWRITE entire files, remove functionality |

### 3. GIT-BASED VERSIONING 🗂️

| Action | Command | When |
|--------|---------|------|
| Before risky change | `git stash` or `git commit -m "checkpoint"` | Multi-file edits |
| After success | `git commit -m "feat/fix: description"` | Task completion |
| Recovery | `git checkout -- <file>` or `git stash pop` | Something broke |

**Convention:** `feat:` / `fix:` / `refactor:` / `docs:` / `chore:`  
**Rules:** ✅ Git versioning. ❌ No `.v2`, `.new`, `.bak` files.

### 3.5. GIT WORKFLOW PROTOCOL 🌿

| Branch | Purpose | Merge To |
|--------|---------|----------|
| `main` | Production | - |
| `develop` | Integration | `main` |
| `feature/*` | New features | `develop` |
| `fix/*` | Bug fixes | `develop` or `main` |

### 4. ROLLBACK GUARANTEE 🔁

Previous version always intact (via Git). User can revert instantly. **If rollback impossible → Action FORBIDDEN.**

### 5. HUMAN CHECKPOINT ⛔

Require approval for: core logic, auth/data/state, config/build, architecture changes.  
**Protocol:** STOP → Explain impact → Ask "Approve?" → Wait for explicit yes. **Ambiguity = NO.**  
**Scope:** Applies during manual mode and planning phases. Once a plan is APPROVED (autopilot state), Continuous Execution takes over — see `code-rules.md § Continuous Execution Rule`.

### 6. FAILURE RECOVERY 🛠️

If broken output / regression: 1) Restore previous version 2) State what was reverted 3) Propose safer alternative. NO excuses.

### 7. INTEGRATION WITH KNOWLEDGE

Safety violation → `@[skills/knowledge-compiler]` triggered (Learn operation). Full protocol: see `autopilot.md § 0.5-H`.

### 8. FORBIDDEN OPERATIONS

**NEVER:** `rm`/`unlink`/`delete` without approval, modify silently, overwrite configs, "clean up" without request, assume destructive intent. **When in doubt → DO NOTHING DESTRUCTIVE.**

---

## 🚀 Quick Start

> 📋 **Skill Index:** `.agent/skills/SKILL_INDEX.md` — All 51 skills at a glance.
> 📊 **Task Levels:** L0 (question) → L1 (quick fix) → L2 (multi-file) → L3 (architecture)

| Need | Run | Purpose |
|------|-----|---------|
| Brainstorm | `/think` | Explore options |
| Plan | `/architect` | Blueprint |
| Build | `/build` | Implement |
| Test | `/validate` | Run tests |
| Deploy | `/launch` | Ship |
| Full Auto | `/autopilot` | All in one |
| Knowledge | `/knowledge` | Compile & query wiki |

---

## ⚡ Skill Routing (MANDATORY for L1+)

> 🔴 **BEFORE writing ANY code**, match your task to a skill. No match = proceed without skill.
> 📋 **Per-level protocol (L0–L3):** `code-rules.md § Agent Routing` (canonical source)
> 📋 **Full keyword → skill mapping:** `.agent/rules/dynamic-skill-detection.md`

**Protocol:** Match keyword → Read skill's `SKILL.md` (L1 may skip, see `code-rules.md`) → Announce → Code.

### 📢 Notification Format

> Full branding table & behavior rules: `autopilot.md § 0.5-J`
> Format: `[⚡PikaKit] L{0-3}/@{skill} → INIT → RUNNING`

---

## ⛔ Enforcement Gates

> Every code response **MUST** start with: `[⚡PikaKit] L{1-3}/@{skill} → INIT → RUNNING` (L0 questions are exempt — see `autopilot.md § 0.5-J`)
> Every bug fix **MUST** end with a learning signal in `knowledge/raw-signals/` if non-trivial (multi-file, >1 attempt, regression, framework gotcha). See `autopilot.md § 0.5-H` for trigger conditions.

---
