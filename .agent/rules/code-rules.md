---
trigger: always_on
---

# PikaKit — Code & Design Rules

## 📋 TASK LEVEL CLASSIFICATION (STEP 1)

> Classify EVERY request before acting. Default = **L2** if unsure.

| Level | Criteria | Skill Protocol | Example |
|-------|----------|---------------|--------|
| **L0** | Question, explain, analyze | ❌ No skill needed | "explain this hook", "what is X?" |
| **L1** | Single-file fix, < 10 lines, obvious intent | ⚡ Identify skill + announce footer | "fix typo", "remove horizontal rule" |
| **L2** | Multi-file change, logic change | ✅ Read SKILL.md + announce header/footer | "add sparkline to 3 charts" |
| **L3** | Architecture, new feature, design system | ✅ Full protocol + plan required | "redesign chart system" |

**Classification Rules:**
- Default = **L2** (safe middle ground)
- Only L1 if ALL: single file, < 10 lines, zero ambiguity
- If unsure → L2. If multi-file or design decision → L3

---

## 🤖 INTELLIGENT AGENT ROUTING (STEP 2)

> 📋 **Quick Reference:** Scan `.agent/skills/SKILL_INDEX.md` for skill matching.

1. **Classify** task level (L0-L3) from table above
2. **Identify** skill(s) from SKILL_INDEX.md
3. **Execute** protocol for that level:

| Level | Step 1: Identify | Step 2: Read | Step 3: Announce | Step 4: Apply |
|-------|-----------------|-------------|-----------------|---------------|
| L0 | — | — | — | — |
| L1 | ✅ From SKILL_INDEX | ❌ Skip | ✅ Footer only | ⚡ Apply from memory |
| L2 | ✅ From SKILL_INDEX | ✅ SKILL.md | ✅ Header + Footer | ✅ Full rules |
| L3 | ✅ From SKILL_INDEX | ✅ SKILL.md + AGENTS.md | ✅ Header + Footer | ✅ Full rules + plan |

**Rules:** Silent analysis, professional tone, respect `@skill` overrides.

### 📢 NOTIFICATION FORMAT

> See `autopilot.md § 0.5-J` for full branding table (L0–L3 + Workflow).

### ⚠️ AGENT ROUTING CHECKLIST (L2+ ONLY)

> For L2 and L3 tasks, complete this checklist before writing code:

| Step | Check | If Unchecked |
|------|-------|--------------|
| 1 | Did I classify the task level? | → STOP. Classify first. |
| 2 | Did I identify the correct skill from SKILL_INDEX? | → STOP. Scan index. |
| 3 | Did I read the skill's SKILL.md? | → STOP. Read it. |
| 4 | Did I announce the skill? | → STOP. Add header. |

---

## TIER 0: UNIVERSAL RULES (Always Active)

### 🌐 Language Handling

Non-English prompt → translate internally, respond in user's language, code remains English.

### 🧹 Clean Code

ALL code follows `@[skills/code-craft]`: concise, self-documenting, mandatory testing (Unit > Int > E2E), Core Web Vitals, 5-phase deployment.

### 📁 File Dependency Awareness

Before modifying ANY file: check `CODEBASE.md` → identify dependents → update ALL affected files together.

### 🗺️ System Map

> 🔴 Read `ARCHITECTURE.md` at session start.

Skills: `.agent/skills/` | Workflows: `.agent/workflows/` | Scripts: `.agent/scripts/` | Knowledge: `.agent/knowledge/`

### 🧠 Read → Understand → Apply

❌ Read agent → Start coding. ✅ Read → Understand WHY → Apply PRINCIPLES → Code.

### 🎓 Knowledge Learning Protocol (MANDATORY)

> 🔴 When user indicates mistake → invoke `@[skills/knowledge-compiler]` Learn operation immediately.
> Full trigger words, categories, and ID patterns: see `autopilot.md § 0.5-H`.

### 🔄 Continuous Execution Rule (MANDATORY)

User approval = execute ALL phases automatically. No `notify_user` between phases. Only stop for: blocking errors, decision forks, plan completed, explicit user pause.  
**Scope:** Applies post-approval only. Pre-approval, `GEMINI.md § Human Checkpoint` still requires approval for core logic, auth, config, and architecture changes.

### 🔍 Problem Verification (MANDATORY) — *Canonical SLO Rule*

After ANY task: check `@[current_problems]` → auto-fix (CSS, imports, lint, types) → verify → only notify if can't auto-fix.  
**Rule:** Don't mark complete until `@[current_problems]` is empty or all non-blocking.  
**SLO:** NEVER call `notify_user` with completion if `@[current_problems]` shows errors.

### 📚 Knowledge Verification (MANDATORY)

After ANY bug fix or error correction:
1. Check: "Did I fix a non-trivial bug?" (multi-file, > 1 attempt, regression, framework quirk)
2. If YES → Ingest signal to `.agent/knowledge/raw-signals/` via `knowledge-compiler`
3. If uncompiled signal count > 5 → Auto-trigger compile operation
4. Only mark task complete AFTER knowledge check passes

**Rule:** Don't mark complete if you fixed a learnable bug but didn't record it.  
**Trigger conditions & categories:** See `autopilot.md § 0.5-H` (canonical source).

---

## TIER 1: CODE RULES (When Writing Code)

### 📱 Project Type Routing

| Type | Primary Skill | Supporting Skills |
|------|---------------|-------------------|
| MOBILE | `mobile-developer` | `mobile-design` |
| WEB | `react-pro` | `design-system`, `tailwind-kit` |
| BACKEND | `nodejs-pro` | `api-architect`, `data-modeler` |

> 🔴 Mobile + react-pro = WRONG. Mobile = `mobile-developer` ONLY.

### 🛑 SOCRATIC GATE (Proportional to Task Level)

| Task Level | Strategy |
|-----------|----------|
| L0 (Question) | Answer directly |
| L1 (Quick fix) | Proceed if intent is clear |
| L2 (Multi-file) | Confirm understanding before starting |
| L3 (Architecture) | ASK 1-3 strategic questions, then plan |
| Vague / Ambiguous | Ask Purpose + Scope before classifying |

**Never Assume.** Reference: `@[skills/idea-storm]` for complex requirements.  
**Override:** Once a plan is APPROVED (autopilot state), Socratic Gate is BYPASSED regardless of task level. See `autopilot.md § 0.5-B`.

### 🏁 Final Checklist

| Stage | Command |
|-------|---------|
| Development | `npm run checklist` |
| Pre-Deploy | `npm run verify <URL>` |

**Order:** Security → Lint → Schema → Tests → UX → SEO → Lighthouse/E2E

### 🎭 Gemini Mode Mapping

| Mode | Agent | Behavior |
|------|-------|----------|
| **plan** | `project-planner` | 4-phase: Analysis → Planning → Solutioning → Implementation |
| **ask** | - | Focus on understanding |
| **edit** | `orchestrator` | Check `{task-slug}.md` first. Multi-file → offer plan. Single-file → proceed. |

---

## TIER 2: DESIGN RULES (Reference)

Design rules are in specialist agents, NOT here.

| Task | Read |
|------|------|
| Web UI/UX | `.agent/skills/react-pro/AGENTS.md` |
| Mobile UI/UX | `.agent/skills/mobile-developer/AGENTS.md` |

---

## 📜 Scripts & Quick Reference

**Core Scripts:** `checklist.ts` (dev), `verify_all.ts` (deploy), `auto_preview.ts` (staging), `version-sync.ts` (versioning)

**Usage:** `npm run checklist` (dev) | `npm run verify http://localhost:3000` (deploy)

### Quick Skill Reference

> Full keyword → skill mapping: `.agent/rules/dynamic-skill-detection.md`
> Complete skill index: `.agent/skills/SKILL_INDEX.md`

---


