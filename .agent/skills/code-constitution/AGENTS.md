# Code Constitution Skills Governance

**Version 3.9.121**
Engineering
April 2026

> **Note:**
> This document is for agents and LLMs to follow when working on code-constitution-skills-governance tasks.
> Optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

This document compiles 1 rules across 1 categories for the Code Constitution Skills Governance skill. Constitutional governance for PikaKit: non-negotiable laws for correctness, trust, and durability.

---

## Table of Contents

1. [Engineering](#1-engineering) — **MEDIUM**
   - 1.1 [Engineering Spec](#11-engineering-spec)

---

## 1. Engineering

**Impact: MEDIUM**

Full engineering specification covering contracts, security, and scalability.

---
title: Code Constitution — Engineering Specification
impact: MEDIUM
tags: code-constitution
---

# Code Constitution — Engineering Specification

> Production-grade specification for PikaKit governance and constitutional enforcement at FAANG scale.

---

## 1. Overview

Code Constitution defines the supreme governance framework for the PikaKit agent system. It enforces non-negotiable laws for correctness, trust, and durability across all agents, skills, and workflows. This is a **meta-governance skill** — it governs how other skills operate, not how code is written.

The skill has supreme authority: it overrides all other skills, framework defaults, agent preferences, and developer convenience. Output that violates this skill is invalid regardless of functional correctness.

**Skill Type:** Expert (decision tree) — stateless, zero side effects, fully idempotent.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version; previous version lacked formal contracts)
**Breaking Changes:** None — new spec for first governance hardening.
**Migration Notes:** Metadata version bumped from 3.0.0 to 2.0.0 to align with contract versioning. No schema changes for downstream consumers; all changes are additive specification.

---

## 2. Problem Statement

Agent governance at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Uncontrolled agent autonomy | Agents auto-merging, auto-deleting without consent | Data loss, unauthorized changes |
| Governance drift across skills | 30%+ of skills lack enforcement model | Inconsistent safety guarantees |
| Constitutional ambiguity | Governance rules stated as suggestions, not laws | Non-compliance treated as acceptable |
| No violation audit trail | Violations not logged or tracked | Repeat violations go undetected |

Code Constitution eliminates these by establishing binding laws with explicit enforcement behavior, zero-trust agent operating mode, and structured violation handling.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|----------------------|
| G1 | Supreme authority | Overrides all other skills; zero exceptions |
| G2 | Zero-trust agent mode | Agents operate in PROPOSAL_ONLY mode; zero autonomous approvals |
| G3 | Deterministic enforcement | Same violation + same doctrine = identical enforcement action |
| G4 | Audit-ready violation handling | 100% of violations logged with doctrine reference and systemic risk |
| G5 | Change control | Constitution changes require approved Change Proposal; zero direct edits |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Code style enforcement | Owned by `code-craft` skill |
| NG2 | Security vulnerability scanning | Owned by `security-scanner` skill |
| NG3 | Code review workflow | Owned by `code-review` skill |
| NG4 | Testing standards | Owned by `test-architect` skill |
| NG5 | Deployment governance | Owned by `cicd-pipeline` skill |
| NG6 | Skill file validation | Owned by `skill-generator` / `skill-design-guide.md` |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Agent operating mode (STRICT/PROPOSAL_ONLY/ZERO_TRUST) | Mode definition + enforcement | Agent implementation |
| Doctrine library | 16 domain-specific rules in `rules/` | Rule execution in other skills |
| Enforcement behavior | Stop → Cite → Explain → Refuse | Automated remediation |
| Change control policy | Change Proposal process | Proposal tooling |
| Violation logging | Log schema definition | Log storage/aggregation |
| Authority hierarchy | Supreme override definition | Skill priority in GEMINI.md |

**Side-effect boundary:** Code Constitution produces governance decisions (approve/refuse) and violation reports. It does not modify files, execute code, or invoke other skills.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "validate" | "check-doctrine" | "enforcement-report" |
                              # "authority-query" | "change-proposal-review"
Context: {
  action: string              # What the agent proposes to do
  scope: string               # "architecture" | "data" | "security" | "breaking-change" |
                              # "agent-behavior" | "governance"
  affected_files: Array<string> | null  # Files being modified
  change_type: string         # "additive" | "modification" | "deletion" | "refactor"
  risk_level: string          # "low" | "medium" | "high" | "critical"
  agent_id: string            # Requesting agent identifier
  justification: string | null # Why this action is needed
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "approved" | "refused" | "escalated" | "error"
Data: {
  decision: string            # "approve" | "refuse" | "escalate-to-user"
  doctrines_checked: Array<string>  # List of doctrine files consulted
  violations: Array<{
    doctrine: string          # Violated doctrine file
    rule: string              # Specific rule within doctrine
    severity: string          # "warning" | "blocking" | "critical"
    risk_explanation: string  # Systemic risk of violation
  }> | null
  conditions: Array<string> | null  # Conditions for approval (if approved)
  enforcement_action: string | null # "stop" | "restrict" | "audit"
  metadata: {
    contract_version: string  # "2.0.0"
    backward_compatibility: string  # "breaking"
    breaking_changes: Array<string> | null  # List of breaking changes
    authority_level: string   # "supreme"
    agent_operating_mode: string  # "STRICT"
  }
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string                  # From Error Taxonomy (Section 11)
Message: string               # Human-readable, single line
Request_Type: string          # Echo of input Request_Type
Recoverable: boolean
```

#### Deterministic Guarantees

- Same `Request_Type` + `Context` = identical decision output, character-for-character.
- Violation detection is deterministic: same action against same doctrine = same violation list.
- Authority level is fixed at "supreme"; never downgraded at runtime.
- Agent operating mode is fixed at "STRICT"; never relaxed at runtime.
- Zero randomization, zero probabilistic assessment, zero machine-learning inference.

#### What Agents May Assume

- A "refused" decision is binding; the action must not proceed.
- "approved" with conditions means ALL conditions must be met before proceeding.
- Doctrine files in `rules/` are the single source of truth for governance rules.
- Supreme authority means no other skill can override this decision.

#### What Agents Must NOT Assume

- An "approved" decision for one context applies to a different context.
- The skill accounts for business urgency or deadlines (governance is atemporal).
- A lack of violation means the action is safe (only checked doctrines are evaluated).
- The skill performs automated remediation (it decides; caller acts).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Validate action | None; pure decision producing structured output |
| Check doctrine | None; read-only rule evaluation against `rules/` |
| Enforcement report | None; report generation from evaluation results |
| Authority query | None; returns static authority model |
| Change proposal review | None; reviews proposal text against doctrine |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Agent proposes action with context (scope, files, change type, risk level)
2. Code Constitution validates against applicable doctrines in rules/
3. Decision returned: approve (with conditions) | refuse (with violations) | escalate
4. If refused: Agent stops, cites violation, does NOT proceed
5. If escalated: Agent requests user approval with violation context
6. If approved with conditions: Agent verifies all conditions before proceeding
```

#### Execution Guarantees

- Every invocation produces a complete, self-contained decision.
- Violation list includes all matching doctrines, not just the first match.
- "Refuse" is final within the invocation; no override without user intervention.
- No partial decisions; output is complete or an error is returned.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported request type |
| Missing context field | Return error to caller | Supply missing context |
| Doctrine file missing | Return error; refuse by default | Verify skill installation |
| Ambiguous scope | Escalate to user | User resolves ambiguity |

**Fail-closed invariant:** Any failure defaults to "refuse." Ambiguity defaults to escalation.

#### Retry Boundaries

- Zero internal retries. Deterministic output makes retries meaningless for same input.
- Callers may retry with modified context after resolving violations.
- No retry backoff; each invocation is independent.

#### Isolation Model

- Each invocation is stateless and independent.
- Doctrine files in `rules/` are read-only during evaluation.
- No shared state between concurrent invocations.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Validate action | Yes | Same context = same decision |
| Check doctrine | Yes | Read-only rule evaluation |
| Enforcement report | Yes | Deterministic report generation |
| Authority query | Yes | Fixed authority model |
| Change proposal review | Yes | Same proposal = same review |

---

## 7. Execution Model

### 4-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate request type, extract scope, identify risk level | Validated input or error |
| **Evaluate** | Load applicable doctrines from `rules/`, check each against context | Violation list (may be empty) |
| **Decide** | Apply decision logic: 0 violations → approve, ≥1 blocking → refuse | Decision + conditions/violations |
| **Emit** | Return structured output with enforcement action | Complete output schema |

All phases execute synchronously in a single invocation. Fail-closed: any phase failure defaults to "refuse."

### Decision Logic

```
IF violations.count == 0:
  decision = "approve"
ELSE IF violations.any(severity == "blocking" OR severity == "critical"):
  decision = "refuse"
ELSE IF violations.all(severity == "warning") AND scope_is_ambiguous:
  decision = "escalate-to-user"
ELSE:
  decision = "refuse"  # fail-closed default
```

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed authority hierarchy | Constitution > all skills > all agents; zero override paths |
| Fixed agent operating mode | STRICT / PROPOSAL_ONLY / ZERO_TRUST; immutable at runtime |
| Fail-closed default | Ambiguity → refuse or escalate; never approve by default |
| Doctrine evaluation order | Alphabetical by doctrine file name; deterministic traversal |
| No external calls | Decisions use only local doctrine files in `rules/` |
| No ambient state | Each invocation operates solely on explicit inputs |
| No learning overrides | Constitution rules are immutable; no pattern-based exceptions |
| No probabilistic decisions | All decisions are binary against doctrine rules; zero ML inference |

---

## 9. State & Idempotency Model

### State Machine

```
IDLE → IDLE  [every invocation starts and ends in IDLE]  // terminal state
```

Stateless. Fully idempotent. No persistent state.

Each invocation produces an identical output for identical inputs. The constitution is immutable between explicit Change Proposals. No session, no pipeline state, no accumulated context.

### Doctrine Versioning

- Doctrine files are versioned via the Change Proposal process in `proposals/`.
- Doctrine changes require explicit user approval before taking effect.
- No hot-reloading of doctrine changes during evaluation.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Default |
|---------------|----------|---------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Refuse |
| Missing context field | Return `ERR_MISSING_CONTEXT` with missing field name | Refuse |
| Missing doctrine file | Return `ERR_DOCTRINE_NOT_FOUND` with file path | Refuse |
| Ambiguous scope | Return `ERR_AMBIGUOUS_SCOPE` with scope value | Escalate |
| Agent trust violation | Return `ERR_TRUST_VIOLATION` with agent_id | Refuse + restrict |
| Change proposal invalid | Return `ERR_INVALID_PROPOSAL` with validation errors | Refuse |
| Internal evaluation error | Return `ERR_EVALUATION_FAILED` with phase name | Refuse |

**Fail-closed invariant:** Every unhandled failure results in "refuse." Zero silent approvals. Zero partial decisions.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Default Action | Description |
|------|----------|-------------|----------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Refuse | Request type not one of: validate, check-doctrine, enforcement-report, authority-query, change-proposal-review |
| `ERR_MISSING_CONTEXT` | Validation | Yes | Refuse | Required context field is null or empty |
| `ERR_DOCTRINE_NOT_FOUND` | Infrastructure | No | Refuse | Doctrine file missing from `rules/` directory |
| `ERR_AMBIGUOUS_SCOPE` | Validation | Yes | Escalate | Scope cannot be classified into a single domain |
| `ERR_TRUST_VIOLATION` | Security | No | Refuse + restrict | Agent attempted self-approval or enforcement bypass |
| `ERR_INVALID_PROPOSAL` | Validation | Yes | Refuse | Change Proposal fails structural or content validation |
| `ERR_EVALUATION_FAILED` | Internal | No | Refuse | Doctrine evaluation encountered an internal error |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Full evaluation timeout | 200 ms | 500 ms | Synchronous rule check across 16 doctrine files |
| Single doctrine file read | 50 ms | 1,000 ms | Local filesystem; single file ≤ 3 KB |
| Decision generation | 10 ms | 50 ms | In-memory logic after evaluation |
| Internal retries | 0 | 0 | Deterministic; same input = same output; retries are meaningless |
| Caller retry limit | No default | No maximum | Callers may retry with modified context after resolving violations |

**Retry policy:** Zero internal retries. Since output is deterministic, retrying the same input produces the same result. Callers must modify context between invocations.

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "code-constitution",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "scope": "string",
  "decision": "approved|refused|escalated",
  "violations_count": "number",
  "doctrines_checked": ["string"],
  "enforcement_action": "string|null",
  "agent_id": "string",
  "risk_level": "string",
  "duration_ms": "number"
}
```

**Mandatory fields (non-negotiable):** `trace_id`, `skill_name`, `contract_version`, `execution_id`, `timestamp`.

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Action approved | INFO | All fields |
| Action refused | WARN | All fields + violations list |
| Trust violation detected | ERROR | All fields + agent_id + violation details |
| Doctrine evaluation completed | DEBUG | doctrines_checked, duration_ms |
| Ambiguous scope escalated | WARN | scope, escalation reason |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `constitution.decision.duration` | Histogram | ms |
| `constitution.decision.distribution` | Counter | per decision (approve/refuse/escalate) |
| `constitution.violation.count` | Counter | per doctrine |
| `constitution.violation.severity` | Counter | per severity (warning/blocking/critical) |
| `constitution.scope.distribution` | Counter | per scope |

---

## 14. Security & Trust Model

### Agent Trust Level

- All agents operate at **ZERO_TRUST** by default.
- No agent may self-approve, self-merge, or bypass enforcement.
- Trust level cannot be elevated without explicit user consent.
- Trust violations are logged at ERROR level and trigger `restrict` enforcement.

### Doctrine Integrity

- Doctrine files in `rules/` are read-only during evaluation.
- Doctrine modification requires a Change Proposal (stored in `proposals/`).
- No runtime injection, template expansion, or dynamic rule generation.
- Doctrine files are not user-supplied; they are part of the skill installation.

### Authority Hierarchy

```
Code Constitution (SUPREME)
  └── GEMINI.md (P0)
        └── Agent .md files (P1)
              └── Skill .md files (P2)
```

No skill, agent, or workflow may override a constitutional decision. Authority is non-negotiable and atemporal.

### Fail-Closed Security

- Every ambiguous input defaults to "refuse" or "escalate."
- No implicit approval. Absence of violation is not approval without explicit doctrine check.
- No credential handling; governance decisions are content-based, not identity-based.

### Input Sanitization

- Context fields are evaluated as literal strings against doctrine rules.
- No template evaluation engine (no eval, no code execution from context fields).
- Context containing executable syntax is treated as literal text.

### Multi-Tenant Boundaries

- Each invocation is stateless; no data persists between invocations.
- No invocation can access context or decisions from another invocation.
- Agent identifiers are logged but do not affect decision logic.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound rule evaluation | < 100 ms for 16 doctrine files per invocation |
| Concurrency | Stateless invocations | Unlimited parallel; no shared state |
| Doctrine storage | 16 files in `rules/` (~20 KB total) | Static; growth controlled by Change Proposals |
| Memory per invocation | < 2 MB | No accumulation; scoped to invocation |
| Network | Zero network calls | No external dependency |

### Capacity Planning

| Metric | Per Invocation | Per Node |
|--------|---------------|----------|
| CPU | < 10 ms computation | 100,000+ invocations/second (single core) |
| Memory | < 2 MB | Bound by concurrent invocations × 2 MB |
| Disk I/O | 16 doctrine file reads (~20 KB) | Cached by OS after first read |
| Network | Zero | Zero |

---

## 16. Concurrency Model

| Scope | Model | Behavior |
|-------|-------|----------|
| Within invocation | Sequential | Classify → Evaluate → Decide → Emit; no internal parallelism |
| Across invocations | Fully parallel | No shared state, no locks, no coordination needed |
| Doctrine access | Read-only shared | Multiple concurrent reads are safe; no write contention |

**No undefined behavior:** Since the skill is stateless with read-only resource access, any level of concurrency is safe by design. Doctrine files are immutable between Change Proposals.

---

## 17. Resource Lifecycle Management

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Decision output | Emit phase | Caller (after consumption) | Invocation scope |
| Doctrine file handles | Evaluate phase | Auto-close after read | < 50 ms |
| Violation report | Decide phase | Caller (after consumption) | Invocation scope |
| Context input | Caller | Invocation completion | Invocation scope |

**Leak prevention:** All resources are scoped to a single invocation. No persistent handles, connections, or buffers. No resource created outlives the invocation that created it.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Single doctrine check | < 5 ms | < 10 ms | 50 ms |
| Full validation (16 doctrines) | < 30 ms | < 80 ms | 500 ms |
| Decision generation | < 5 ms | < 10 ms | 50 ms |
| Total invocation latency | < 40 ms | < 100 ms | 500 ms |
| Output size | ≤ 1,000 chars | ≤ 3,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Overly restrictive enforcement | Medium | Blocks legitimate agent actions | Escalation path to user for ambiguous cases |
| Doctrine staleness | Low | Rules do not reflect current architecture | Change Proposal process for updates |
| Constitution bypass via new skill | Medium | New skill ignores constitutional rules | Authority hierarchy enforced in GEMINI.md |
| False negative (missed violation) | Low | Unapproved action proceeds | Doctrine coverage reviewed quarterly |
| Agent spoofing scope/risk level | Medium | Agent underreports risk to get approval | Zero-trust: agent declarations are inputs, not truth |
| Doctrine file corruption | Low | Evaluation errors, false refusals | `ERR_DOCTRINE_NOT_FOUND`; re-install skill from source |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines; details in `rules/engineering-spec.md` |
| Prerequisites documented | ✅ | No external dependencies; doctrine library documented |
| When to Use section | ✅ | Scope-based activation table with 7 trigger conditions |
| Quick Reference with commands | ✅ | Quick Start section with invocation pattern and script references |
| Core content matches skill type | ✅ | Expert (decision tree): authority model, enforcement behavior, operating modes |
| Troubleshooting section | ✅ | Problem/cause/resolution table with 4 entries |
| Related section | ✅ | Cross-links to code-review, security-scanner, code-craft, skill-generator |
| Contract versioning | ✅ | contract_version: "2.0.0", backward_compatibility, breaking_changes in Section 6 |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence per requirement |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Governance** | Supreme authority model defined with hierarchy diagram | ✅ |
| **Governance** | Zero-trust agent operating mode (STRICT/PROPOSAL_ONLY/ZERO_TRUST) | ✅ |
| **Governance** | Fail-closed enforcement default on all failure paths | ✅ |
| **Governance** | Change Proposal process for doctrine updates in `proposals/` | ✅ |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ✅ |
| **Contracts** | Contract versioning with semver (2.0.0) | ✅ |
| **Contracts** | Agent assumptions and non-assumptions documented | ✅ |
| **Contracts** | Side-effect boundaries per operation | ✅ |
| **Failure** | Error taxonomy with 7 categorized error codes | ✅ |
| **Failure** | Fail-closed invariant: all failures default to refuse | ✅ |
| **Failure** | Zero internal retries; deterministic output | ✅ |
| **Determinism** | Fixed doctrine evaluation order (alphabetical) | ✅ |
| **Determinism** | Fixed authority hierarchy (Constitution > GEMINI.md > Agent > Skill) | ✅ |
| **Determinism** | Decision logic codified with explicit branches | ✅ |
| **Security** | Zero-trust agent mode; no self-approval | ✅ |
| **Security** | Doctrine files read-only during evaluation | ✅ |
| **Security** | Input sanitization: literal evaluation, no eval | ✅ |
| **Observability** | Structured log schema with 5 mandatory fields | ✅ |
| **Observability** | 5 log points defined with log levels | ✅ |
| **Observability** | 5 metrics defined with types and units | ✅ |
| **Performance** | P50/P99/hard limit targets for all operations | ✅ |
| **Performance** | Total invocation latency hard limit: 500 ms | ✅ |
| **Scalability** | Stateless; unlimited parallel invocations | ✅ |
| **Scalability** | Capacity planning table with per-node estimates | ✅ |
| **Concurrency** | No shared state; read-only doctrine access | ✅ |
| **Resources** | All resources scoped to invocation lifetime | ✅ |
| **Idempotency** | Fully idempotent — all operations are pure functions | ✅ |
| **Timeouts** | All timeouts specify default AND maximum values | ✅ |
| **State** | State transitions use explicit `→` notation | ✅ |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ✅ |

---

⚡ ## OpenTelemetry Observability (MANDATORY)

- **Immutable Audit Logging**: EVERY decision (Approve/Refuse) made by Code Constitution MUST emit an OpenTelemetry Span with an Immutable flag. These logs must be pushed to a Centralized SIEM to ensure no governance bypass occurs undetected.
- **Distributed Tracing**: The 	race_id of the governance decision MUST be attached to the resulting deployment or PR merge event.

---

PikaKit v3.9.206

---

⚡ PikaKit v3.9.206
