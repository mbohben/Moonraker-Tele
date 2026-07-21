---
name: idea-storm
description: >-
  Socratic questioning protocol for complex requirements and unclear user requests.
  Use when requirements are vague, ambiguous, or need strategic clarification before building.
  NOT for clear, well-defined tasks or quick fixes.
metadata:
  author: pikakit
  version: "3.9.206"
  category: verification-gate
  triggers: ["brainstorm", "understand requirements", "clarify", "unclear", "complex request"]
  coordinates_with: ["project-planner", "system-design"]
  success_metrics: ["100% vague requests intercepted", "< 5 questions per gate"]
---

# Idea Storm — Socratic Requirement Clarification

> STOP → ASK ≥ 3 questions → WAIT for answers → then implement. Never skip the gate.

---

## Prerequisites

**Required:** None — protocol skill with no external dependencies.

---

## When to Use

| Situation | Action |
|-----------|--------|
| "Build/Create [thing]" without details | 🛑 ASK ≥ 3 questions |
| Complex feature or architecture | 🛑 Clarify before implementing |
| Update/change request | 🛑 Confirm scope |
| Vague requirements | 🛑 Ask purpose, users, constraints |
| Simple, clear request | Skip gate; proceed directly |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| 3-question gate (STOP → ASK → WAIT) | Task planning (→ project-planner) |
| Structured question format | Architecture decisions (→ system-design) |
| Progress reporting (5 icons) | Project scaffolding (→ app-scaffold) |
| Error communication (4-step) | Implementation code |

**Expert skill:** Produces structured questions. Does not answer them or implement code.

---

## 🛑 SOCRATIC GATE (Mandatory)

### Protocol: STOP → ASK → WAIT

1. **STOP** — Do NOT start coding
2. **ASK** — Minimum 3 questions, covering 3 dimensions:

| Priority | Dimension | Example Question |
|----------|-----------|-----------------|
| P0 | 🎯 Purpose | What problem are you solving? |
| P0 | 👥 Users | Who will use this? |
| P1 | 📦 Scope | Must-have vs nice-to-have? |

3. **WAIT** — Get responses before proceeding

**Limits:** Minimum 3 questions, maximum 5 per round.

---

## Question Format (Fixed Template)

```markdown
### [PRIORITY] **[DECISION POINT]**

**Question:** [Clear question]

**Why This Matters:**
- [Architectural consequence]

**Options:**
| Option | Pros | Cons |
|--------|------|------|
| A | [+] | [-] |
| B | [+] | [-] |

**If Not Specified:** [Default + rationale]
```

**Rules:** Every question has ≥ 2 options with pros/cons AND a default.

---

## Progress Icons (Fixed)

| Icon | Status |
|------|--------|
| ✅ | Completed |
| 🔄 | Running |
| ⏳ | Waiting |
| ❌ | Error |
| ⚠️ | Warning |

---

## Error Communication (4-Step)

1. **Acknowledge** the error
2. **Explain** what happened (user-friendly)
3. **Offer** specific solutions with trade-offs
4. **Ask** user to choose

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_REQUEST` | Yes | User request text not provided |
| `ERR_INVALID_COMPLEXITY` | Yes | Not simple/complex/vague |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |

**Zero internal retries.** Deterministic; same request = same questions.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Jump to solutions | Ask ≥ 3 questions first |
| Assume requirements | Clarify with structured questions |
| Over-engineer v1 | Start with scope (must-have vs nice-to-have) |
| Use "I think" phrases | Ask questions with options instead |
| Skip gate for "urgent" requests | Gate is mandatory; no bypass |


## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [architecture-debate.md](rules/architecture-debate.md) | 8-phase debate, YAGNI/KISS/DRY | Architecture decisions |
| [dynamic-questioning.md](rules/dynamic-questioning.md) | Dynamic question generation | Advanced questioning |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/think` | Workflow | Ideation workflow |
| `project-planner` | Skill | Task planning |
| `app-scaffold` | Skill | Project setup |

---

⚡ PikaKit v3.9.206
