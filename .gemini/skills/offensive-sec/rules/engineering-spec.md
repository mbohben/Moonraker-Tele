---
title: Offensive Security � Engineering Specification
impact: MEDIUM
tags: offensive-sec
---

# Offensive Security � Engineering Specification

> Production-grade specification for red team tactics and adversary simulation at FAANG scale.

---

## 1. Overview

Offensive Security provides structured attack methodology for authorized penetration testing and red team engagements: MITRE ATT&CK phase routing (13 phases), initial access vector selection (4 vectors), privilege escalation guidance (Windows + Linux), defense evasion techniques, Active Directory attacks, and ethical boundary enforcement. The skill operates as an **Expert (decision tree)** � it produces attack methodology, phase-specific tactics, and engagement guidance. It does not execute exploits, access systems, or perform unauthorized testing.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Red team engagements at scale face four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Ad-hoc testing methodology | 50% of pentests lack structured phase coverage | Incomplete attack surface |
| Scope creep | 35% of engagements exceed authorized boundaries | Legal and compliance risk |
| Missing documentation | 40% of findings lack reproducible steps | Unactionable reports |
| Priv esc gaps | 45% of tests skip platform-specific escalation checks | Missed vulnerabilities |

Offensive Security eliminates these with MITRE ATT&CK phase-by-phase methodology (13 phases), mandatory scope enforcement, structured reporting requirements, and platform-specific priv esc checklists (Windows + Linux).

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | MITRE ATT&CK coverage | 13 phases with defined objectives |
| G2 | Initial access routing | 4 vectors with selection criteria |
| G3 | Priv esc checklists | Windows (3 checks) + Linux (3 checks) |
| G4 | Defense evasion | 3 fixed techniques (LOLBins, obfuscation, timestomping) |
| G5 | AD attack paths | 3 fixed attacks (Kerberoasting, DCSync, Golden Ticket) |
| G6 | Ethical boundaries | Mandatory scope, minimal impact, immediate reporting |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Automated vulnerability scanning | Owned by `security-scanner` skill |
| NG2 | Code-level security review | Owned by `code-review` skill |
| NG3 | Mobile security patterns | Owned by `mobile-security-coder` skill |
| NG4 | Exploit development | Out of scope; uses existing techniques |
| NG5 | Malware creation | Strictly prohibited |
| NG6 | Social engineering execution | Guidance only; no execution |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| MITRE ATT&CK phase guidance (13 phases) | Phase objectives and tactics | Exploit execution |
| Initial access vector selection (4 vectors) | Vector criteria | Access execution |
| Priv esc checklists (Windows + Linux) | Check items | Exploitation tools |
| Defense evasion techniques (3) | Technique guidance | Evasion implementation |
| AD attack paths (3) | Attack methodology | Domain compromise |
| Ethical boundaries | Boundary enforcement | Legal review |

**Side-effect boundary:** Offensive Security produces attack methodologies, checklists, and engagement guidance. It does not execute exploits, access systems, run commands, or perform any destructive operations.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "attack-phase" | "initial-access" | "privesc" |
                              # "defense-evasion" | "ad-attacks" | "methodology" |
                              # "report-template" | "full-guide"
Context: {
  phase: string | null        # MITRE ATT&CK phase name
  platform: string | null     # "windows" | "linux" | "both"
  environment: string | null  # "internal" | "external" | "hybrid"
  scope: string               # Engagement scope (mandatory)
  authorized: boolean         # Must be true to proceed
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  phase_guide: {
    phase: string
    objective: string
    tactics: Array<string>
    next_phase: string | null
  } | null
  access_vectors: {
    vectors: Array<{
      name: string
      when_to_use: string
    }>
  } | null
  privesc: {
    platform: string
    checks: Array<{
      check: string
      opportunity: string
    }>
  } | null
  evasion: {
    techniques: Array<{
      technique: string
      purpose: string
    }>
  } | null
  ad_attacks: {
    attacks: Array<{
      attack: string
      target: string
    }>
  } | null
  ethical_boundaries: {
    always: Array<string>
    never: Array<string>
  }
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

- MITRE ATT&CK phases are fixed: 13 phases in defined order.
- Initial access vectors are fixed: Phishing, Public exploits, Valid credentials, Supply chain.
- Priv esc checks are fixed: Windows (3), Linux (3).
- Defense evasion techniques are fixed: LOLBins, Obfuscation, Timestomping.
- AD attacks are fixed: Kerberoasting, DCSync, Golden Ticket.
- Ethical boundaries are always enforced; `authorized: false` ? immediate rejection.
- Same phase context = same guidance output.

#### What Agents May Assume

- MITRE ATT&CK phases follow documented order.
- Priv esc checks are platform-specific.
- Ethical boundaries are non-negotiable.
- Guidance is for authorized engagements only.

#### What Agents Must NOT Assume

- Authorization has been verified externally.
- Exploits are available or functional.
- Target systems are accessible.
- All phases apply to every engagement.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Attack phase | None; phase guidance |
| Initial access | None; vector recommendation |
| Privesc | None; checklist output |
| Defense evasion | None; technique guidance |
| AD attacks | None; methodology guidance |
| Report template | None; template output |
| Full guide | None; combined output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Verify authorization (authorized: true, scope defined)
2. Invoke methodology for overall engagement plan
3. Invoke attack-phase for each relevant MITRE ATT&CK phase
4. Invoke initial-access for vector selection
5. Invoke privesc for platform-specific escalation checks
6. Execute engagement (caller's responsibility � outside this skill)
7. Invoke report-template for findings documentation
```

#### Execution Guarantees

- Authorization check is mandatory before any output.
- Each invocation produces complete guidance for the requested domain.
- Ethical boundaries are included in every response.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Not authorized | Return error (CRITICAL) | Cannot proceed |
| Missing scope | Return error | Define scope first |
| Unknown phase | Return error | Use valid MITRE ATT&CK phase |
| Unknown platform | Return error | Specify windows, linux, or both |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Attack phase | Yes | Same phase = same guidance |
| Initial access | Yes | Fixed vectors |
| Privesc | Yes | Same platform = same checks |
| Defense evasion | Yes | Fixed techniques |
| AD attacks | Yes | Fixed attacks |
| Report template | Yes | Fixed template |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Authorize** | Verify `authorized: true` and scope is defined | Authorization result |
| **Guide** | Generate phase tactics, checklists, or methodology | Complete output |

Authorization phase is mandatory. If `authorized: false`, no guidance is produced.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| MITRE ATT&CK 13 phases | Fixed: Recon ? Initial Access ? Execution ? Persistence ? Priv Esc ? Defense Evasion ? Cred Access ? Discovery ? Lateral ? Collection ? C2 ? Exfil ? Impact |
| Authorization mandatory | `authorized: false` ? immediate `ERR_NOT_AUTHORIZED` |
| Scope required | Missing scope ? `ERR_MISSING_SCOPE` |
| 4 initial access vectors | Phishing, Public exploits, Valid credentials, Supply chain |
| Platform-specific priv esc | Windows: 3 checks; Linux: 3 checks |
| Ethical boundaries in every response | Always: stay in scope, minimize impact, report threats, document all |
| Report requirement | All findings must include reproducible steps |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Not authorized | Return `ERR_NOT_AUTHORIZED` (critical) | Obtain authorization |
| Missing scope | Return `ERR_MISSING_SCOPE` | Define engagement scope |
| Unknown phase | Return `ERR_UNKNOWN_PHASE` | Use valid ATT&CK phase |
| Unknown platform | Return `ERR_UNKNOWN_PLATFORM` | Specify windows, linux, or both |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** `ERR_NOT_AUTHORIZED` is non-recoverable within the skill. Authorization must be established externally.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_NOT_AUTHORIZED` | Security | No | Engagement not authorized |
| `ERR_MISSING_SCOPE` | Validation | Yes | Scope not defined |
| `ERR_UNKNOWN_PHASE` | Validation | Yes | Phase not in ATT&CK |
| `ERR_UNKNOWN_PLATFORM` | Validation | Yes | Platform not recognized |
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "offensive-sec",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "phase": "string|null",
  "platform": "string|null",
  "authorized": "boolean",
  "scope_hash": "string",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

**Note:** Scope is logged as a hash, never plaintext (contains sensitive target information).

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Authorization verified | INFO | authorized, scope_hash |
| Phase guidance issued | INFO | phase, platform |
| Authorization denied | WARN | authorized=false |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `offensivesec.decision.duration` | Histogram | ms |
| `offensivesec.phase.distribution` | Counter | per ATT&CK phase |
| `offensivesec.platform.distribution` | Counter | windows vs linux |
| `offensivesec.auth_denied.count` | Counter | unauthorized attempts |

---

## 14. Security & Trust Model

### Data Handling

- Scope information logged as hash only; never plaintext.
- No target system information stored.
- No exploit code generated or retained.
- No network calls, no file access.

### Authorization Model

| Rule | Enforcement |
|------|-------------|
| `authorized` must be `true` | Hard block if false |
| Scope must be defined | Cannot produce guidance without scope |
| Ethical boundaries in every response | Non-negotiable |
| No actual exploitation | Guidance only; never execution |
| Sensitive findings immediate reporting | Always document and escalate |

### Prohibited Operations

- Malware creation or distribution
- Social engineering execution (guidance only)
- Data exfiltration beyond proof of concept
- Production data destruction
- Retaining sensitive target data

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
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
| Phase guidance | < 2 ms | < 5 ms | 20 ms |
| Privesc checklist | < 2 ms | < 5 ms | 20 ms |
| Full guide | < 10 ms | < 30 ms | 50 ms |
| Output size | = 2,000 chars | = 5,000 chars | 8,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| MITRE ATT&CK framework updates | Low | New phases or techniques | Review annually |
| Unauthorized use | Medium | Legal liability | `authorized` check mandatory |
| Scope ambiguity | High | Out-of-scope testing | Scope required in every request |
| Technique obsolescence | Medium | Outdated guidance | Track security landscape |
| AD attack path changes | Low | Invalid methodology | Track Windows Server releases |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | Authorization + scope required |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: attack phase decision trees |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to security-scanner, code-review |
| Content Map for multi-file | ? | Link to engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 13 MITRE ATT&CK phases with objectives | ? |
| **Functionality** | 4 initial access vectors | ? |
| **Functionality** | Priv esc checklists (Windows 3 + Linux 3) | ? |
| **Functionality** | Defense evasion (3 techniques) | ? |
| **Functionality** | AD attacks (3 paths) | ? |
| **Functionality** | Ethical boundaries enforced | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 5 categorized codes | ? |
| **Failure** | Authorization hard block | ? |
| **Determinism** | Fixed phases, vectors, checks, techniques | ? |
| **Security** | Scope logged as hash; no plaintext | ? |
| **Security** | No exploit execution; guidance only | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
