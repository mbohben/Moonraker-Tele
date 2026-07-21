---
name: doctrine-violation-playbook
version: "3.9.206"
status: LOCKED
authority: ENFORCEMENT
parent: master-constitution
---

# 🚨 Governance Doctrine Violation Playbook  
**(Incident Response · Governance Enforcement · System Integrity)**

This playbook defines **how PikaKit responds** when any doctrine,
law, or constitutional rule is violated.

Doctrine violations are **NOT personal failures**.  
They are **system protection events**.

Ignoring a violation causes:
- Architectural drift
- Hidden fragility
- Loss of trust

---

## 1. What Is a Doctrine Violation?

A doctrine violation occurs when **ANY** of the following happens:

- A Prime Directive is broken
- A system invariant is bypassed
- Data truth ownership is violated
- Historical or chart integrity is compromised
- Mobile UX or gesture invariants are broken
- Performance laws are violated
- An AI agent exceeds its authority
- A “temporary” exception is introduced

If the system works **by luck or memory**,  
it is already in violation.

---

## 2. Violation Severity Levels

### 🔴 SEV-1 — Constitutional Violation

Examples:

- Frontend mutates financial meaning
- Realtime data contaminates historical charts
- Backend truth is bypassed
- Irreversible breaking change deployed
- AI agent overrides doctrine or enforcement

**Required Response:**

- Immediate rollback or shutdown
- Incident declared
- Full audit required

---

### 🟠 SEV-2 — System Doctrine Violation

Examples:

- Page-specific gesture logic
- Multiple scroll containers introduced
- Performance regression masked as optimization
- Backend treated as thin proxy

**Required Response:**

- Block merge or revert
- Root cause analysis
- Doctrine reinforcement

---

### 🟡 SEV-3 — Process / Enforcement Violation

Examples:

- Missing checklist
- Doctrine not cited in PR
- Agent output merged without review
- Enforcement skipped “for speed”

**Required Response:**

- Fix process
- Retrain reviewers / agents
- Strengthen enforcement gates

---

## 3. Immediate Response Protocol

When a violation is detected:

1. **STOP** further rollout or merges
2. **ISOLATE** the violating change
3. **CLASSIFY** severity (SEV-1 / SEV-2 / SEV-3)
4. **REVERT or CONTAIN** the impact

Speed of containment  
is more important than explanation.

---

## 4. Root Cause Analysis (MANDATORY)

Every violation MUST answer:

- Which doctrine or law was violated?
- Why was the violation possible?
- Why was it not caught earlier?
- Was enforcement missing or bypassed?
- Was an AI agent involved?

Blame is **FORBIDDEN**.  
System learning is **REQUIRED**.

---

## 5. Remediation Paths

Exactly **ONE** remediation path must be chosen.

### A. Simple Restoration

Use when:
- Violation is clear
- Fix is obvious
- No doctrine change needed

Actions:
- Revert change
- Restore invariant
- Add test or checklist coverage

---

### B. Doctrine Clarification

Use when:
- Doctrine wording was ambiguous
- Behavior was unclear

Actions:
- Clarify doctrine text
- NO behavior change
- Release as **v1.0.x**

---

### C. Legitimate Limitation

Use when:
- Real-world constraint is discovered
- Current doctrine is insufficient

Actions:
- Submit **v1.1 Change Proposal**
- Doctrine remains authoritative until approved
- No workaround allowed

---

## 6. AI-Specific Violations

If an AI agent caused or contributed:

- Invalidate the agent output
- Restrict or disable the agent
- Audit past outputs
- Update prompts or enforcement rules

Repeated AI violations  
require **agent suspension**.

---

## 7. Communication Rules

All violations MUST be:

- Documented
- Visible to the team
- Free of retroactive justification

Forbidden behaviors:

- Silent fixes
- Normalizing exceptions
- “We’ll clean it up later”
- Blaming individuals

Transparency preserves trust.

---

## 8. Post-Incident Safeguards

After resolution, at least **ONE** must occur:

- New checklist item
- New automated test
- Stronger agent restriction
- Clearer doctrine wording

If nothing changes,  
the violation **WILL recur**.

---

## Final Principle

Doctrine violations are **signals**, not annoyances.

PikaKit chooses:

**Correction over comfort**  
**Integrity over speed**  
**Trust over convenience**

---

**Status:** LOCKED  
**Version:** 1.0.0  
**Parent:** PikaKit Master Constitution  
**Override Permission:** NONE

---

⚡ PikaKit v3.9.206
