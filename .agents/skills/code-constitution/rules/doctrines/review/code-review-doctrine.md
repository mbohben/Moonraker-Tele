---
name: code-review-doctrine
version: "3.9.206"
status: LOCKED
authority: CONSTITUTIONAL
parent: architecture-doctrine
---

# 🛡️ PikaKit Code Review Doctrine  
**(Engineering Review · Enforcement · System Integrity Law)**

This doctrine defines the **non-negotiable laws** governing how code is reviewed,
approved, or rejected in PikaKit.

Code review exists to:
- Protect system correctness
- Prevent architectural erosion
- Preserve long-term maintainability
- Enforce constitutional law

Approval is an act of **responsibility**,  
not politeness.

---

## 1. Reviewer Role & Authority

A reviewer is the **guardian of the system**,
not a collaborator seeking compromise.

If a proposed change threatens:

- Data integrity
- Architectural boundaries
- System invariants
- User trust
- Commercial safety

The reviewer **MUST BLOCK** it,  
regardless of effort, intent, or sunk cost.

---

## 2. Review Priority Order (NON-NEGOTIABLE)

All code MUST be evaluated in the following order:

1. PikaKit Master Constitution
2. Architecture & System Doctrines
3. Commercial Guardrails
4. Performance Doctrine
5. Functional correctness
6. Long-term maintainability
7. Style & readability

If a change fails at a higher level,  
lower-level qualities are **IRRELEVANT**.

---

## 3. Mandatory Blocking Conditions

A change **MUST BE REJECTED** if it:

- Violates any doctrine or system law
- Introduces ambiguity in data ownership
- Creates page-specific or feature-specific behavior
- Adds hidden coupling or implicit dependencies
- Fixes symptoms instead of root causes
- Introduces “temporary” violations

“Works as intended”  
is **NOT** sufficient justification.

---

## 4. Local vs System Correctness Law

Local correctness does **NOT** imply system correctness.

If a locally correct change:

- Breaks global invariants
- Adds special cases or exceptions
- Requires future engineers to “remember rules”

Then it **MUST BE REJECTED**.

Systems must be safe by design,  
not safe by memory.

---

## 5. Reviewer Obligations

When blocking a change, the reviewer MUST:

- Cite the violated doctrine or law explicitly
- Explain the **systemic risk**, not just the bug
- Suggest a compliant direction (not implementation)

Review feedback must improve
**system understanding**, not just code quality.

---

## 6. Review Anti-Patterns (ZERO TOLERANCE)

The following behaviors are **STRICTLY FORBIDDEN**:

- Approving code “to unblock progress”
- Deferring architectural fixes
- Accepting “temporary” violations
- Allowing undocumented exceptions
- Prioritizing speed over correctness

These behaviors accumulate
**technical debt and organizational debt**.

---

## 7. Escalation & Disagreement Rule

If disagreement arises:

- Escalate to higher authority doctrine
- Defer to constitutional precedence
- Do NOT compromise system safety

Consensus is secondary to correctness.

---

## 8. Enforcement Rule

Any change that:

- Compromises long-term integrity
- Weakens architectural law
- Increases cognitive load for future engineers
- Surprises an experienced reviewer

**MUST NOT BE MERGED**.

Missed deadlines are recoverable.  
System erosion is not.

---

## Final Authority

This doctrine overrides:

- Personal relationships
- Reviewer fatigue
- Delivery pressure
- “It works” arguments

PikaKit code review exists to protect:

**Correctness · Architecture · Trust**

Not velocity.

---

**Status:** LOCKED  
**Version:** 1.0.0  
**Parent:** PikaKit Architecture Doctrine  
**Override Permission:** NONE

---

⚡ PikaKit v3.9.206
