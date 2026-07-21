---
name: code-constitution
description: >-
  Constitutional governance for PikaKit: non-negotiable laws for correctness, trust, and durability.
  Use when reviewing breaking changes, critical data operations, or governance violations.
  NOT for general code review (use code-review) or security scanning (use security-scanner).
metadata:
  author: pikakit
  version: "3.9.206"
  category: governance
  triggers: ["architecture", "critical data", "breaking change", "governance", "doctrine"]
  coordinates_with: ["code-review", "security-scanner", "code-craft"]
  success_metrics: ["0 governance bypasses", "100% doctrine compliance"]
---

# PikaKit Governance — Code Constitution

> Supreme authority. Zero-trust agents. Fail-closed enforcement. Doctrine-first decisions.

**Status:** OFFICIAL · LOCKED | **Authority:** SUPREME | **Override:** NONE

---

## Prerequisites

**Required:** None — Code Constitution is a governance framework with no external dependencies.

**Doctrine library:** 16 rule files in `rules/` directory (required for evaluation).

---

## When to Use

| Scope | Activation | Default |
|-------|-----------|---------|
| System architecture or boundaries | **Mandatory** — always load | — |
| Data ownership or persistence | **Mandatory** | — |
| Critical business logic | **Mandatory** | — |
| Breaking changes or commercial risk | **Mandatory** | — |
| AI agent behavior or autonomy | **Mandatory** | — |
| Ambiguous intent | **Mandatory** — load by default | Refuse |
| Architecture review, contracts, security | See `rules/engineering-spec.md` | — |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Agent operating mode (STRICT/PROPOSAL_ONLY/ZERO_TRUST) | Agent implementation |
| Doctrine library (16 rules in `rules/`) | Rule execution in other skills |
| Enforcement behavior (Stop → Cite → Refuse) | Automated remediation |
| Authority hierarchy definition | Skill priority in GEMINI.md |
| Change Proposal review | Proposal tooling |

**Pure decision skill:** Produces governance decisions (approve/refuse/escalate). Zero side effects.

---

## Execution Model — 4-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate request type, extract scope, identify risk level | Validated input or error |
| **Evaluate** | Load applicable doctrines from `rules/`, check each against context | Violation list (may be empty) |
| **Decide** | 0 violations → approve; ≥1 blocking → refuse; ambiguous → escalate | Decision + conditions/violations |
| **Emit** | Return structured output with enforcement action | Complete output schema |

All phases synchronous. Fail-closed: any phase failure defaults to "refuse."

---

## Authority Hierarchy

```
Code Constitution (SUPREME)
  └── GEMINI.md (P0)
        └── Agent .md files (P1)
              └── Skill .md files (P2)
```

No skill, agent, or workflow may override a constitutional decision.

---

## Agent Operating Mode

| Setting | Value | Meaning |
|---------|-------|---------|
| POLICY_MODE | STRICT | All rules enforced without exception |
| AUTONOMY | PROPOSAL_ONLY | Agents propose; never self-approve |
| TRUST_LEVEL | ZERO | Agent declarations are inputs, not truth |

**Agents MAY:** Propose actions, explain trade-offs, identify risks, cite doctrines.

**Agents MUST NOT:** Approve without user consent, merge automatically, bypass enforcement.

---

## Enforcement Behavior

When violation detected:

1. **Stop** execution immediately
2. **Cite** specific violated doctrine (file + rule)
3. **Explain** systemic risk of the violation
4. **Refuse** the request

**Fail-closed invariant:** Partial compliance = enforcement failure. Ambiguity = refuse or escalate.

---

## Error Taxonomy

| Code | Recoverable | Default Action |
|------|-------------|----------------|
| `ERR_INVALID_REQUEST_TYPE` | No | Refuse |
| `ERR_MISSING_CONTEXT` | Yes | Refuse |
| `ERR_DOCTRINE_NOT_FOUND` | No | Refuse |
| `ERR_AMBIGUOUS_SCOPE` | Yes | Escalate |
| `ERR_TRUST_VIOLATION` | No | Refuse + restrict |
| `ERR_INVALID_PROPOSAL` | Yes | Refuse |
| `ERR_EVALUATION_FAILED` | No | Refuse |

**All failures default to refuse.** No silent approvals. Zero internal retries.

---

## Quick Start

```
1. Agent proposes action with context (scope, files, change type, risk level)
2. Code Constitution validates against applicable doctrines in rules/
3. Decision returned: approve | refuse | escalate
4. If refused: Stop, cite violation, do NOT proceed
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Self-approve agent actions | Propose and wait for user consent |
| Ignore governance for "quick fix" | Load constitution; validate first |
| Override constitution from another skill | Respect authority hierarchy |
| Assume no violation = safe | Explicitly check applicable doctrines |
| Modify doctrines directly | Submit Change Proposal |

---

## Troubleshooting

| Problem | Cause | Resolution |
|---------|-------|------------|
| Every action refused | Scope set to "critical" for minor changes | Set accurate `risk_level` and `scope` |
| Doctrine not found error | Skill installation incomplete | Verify `rules/doctrines/` contains all 8 domains |
| Escalation loop | Ambiguous scope keeps re-triggering | Provide explicit scope: architecture, data, security |
| Agent bypasses governance | Skill not loaded for the request type | Add trigger keywords to agent routing config |

---

## 📑 Content Map

| Folder | Content | When to Read |
|--------|---------|--------------|
| [rules/](rules/) | 16 domain-specific governance rules | Doctrine evaluation |
| [rules/engineering-spec.md](rules/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review |
| [metadata/](metadata/) | Routing & intent configuration | Skill routing |
| [resources/](resources/) | Templates & reference materials | Building governance artifacts |
| [examples/](examples/) | Governance usage examples | Learning patterns |
| [knowledge/](knowledge/) | Accumulated governance knowledge | Context building |
| [proposals/](proposals/) | Change Proposals for doctrine updates | Modifying constitution |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `code-review` | Skill | Code quality review |
| `security-scanner` | Skill | Security vulnerability detection |
| `code-craft` | Skill | Code standards enforcement |
| `skill-generator` | Skill | Skill file validation |

---

⚡ PikaKit v3.9.206
