---
title: Security Scanner � Engineering Specification
impact: MEDIUM
tags: security-scanner
---

# Security Scanner � Engineering Specification

> Production-grade specification for vulnerability analysis and OWASP compliance at FAANG scale.

---

## 1. Overview

Security Scanner provides structured vulnerability analysis: OWASP Top 10:2025 checklist (10 categories), risk prioritization (EPSS + CVSS decision tree), high-risk code pattern detection (5 patterns), secret detection (4 categories), supply chain security, and 5 core security principles. The skill operates as an **Expert (decision tree)** � it produces vulnerability classifications, risk priorities, and remediation guidance. It does not execute scans, modify code, or install security tools.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Security analysis at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Unprioritized CVEs | 70% of alerts are noise (CVSS < 7.0) | Alert fatigue |
| Missing supply chain checks | 45% of projects skip dependency audits | Compromised dependencies |
| Secret exposure | 30% of repos contain hardcoded credentials | Data breach |
| High-risk code patterns | 40% of injection vulnerabilities from string concat | Exploitable code |

Security Scanner eliminates these with EPSS + CVSS risk prioritization (3-tier tree), OWASP Top 10:2025 coverage, 5 high-risk pattern detection, and 4-category secret scanning.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | OWASP Top 10:2025 coverage | All 10 categories |
| G2 | Risk prioritization | 3-tier tree: EPSS > 0.5 ? CRITICAL, CVSS = 9.0 ? HIGH, 7.0-8.9 ? check asset |
| G3 | High-risk code patterns | 5 patterns detected |
| G4 | Secret detection | 4 categories (API keys, tokens, credentials, cloud) |
| G5 | Core principles | 5 principles enforced |
| G6 | Supply chain (OWASP A03) | Dependency + CI/CD integrity |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Red team execution | Owned by `offensive-sec` skill |
| NG2 | Code implementation fixes | Guidance only; execution is caller's responsibility |
| NG3 | CI/CD pipeline configuration | Owned by `cicd-pipeline` skill |
| NG4 | Authentication design | Owned by `auth-patterns` skill |
| NG5 | Runtime intrusion detection | Infrastructure concern |
| NG6 | Compliance certification | External auditor responsibility |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Vulnerability classification | OWASP mapping | Scan execution |
| Risk prioritization | EPSS + CVSS tree | CVSS score calculation |
| Code pattern detection | 5 high-risk patterns | Static analysis tooling |
| Secret scanning guidance | 4 categories, detection patterns | Secret rotation |
| Supply chain analysis | Dependency audit guidance | Package installation |

**Side-effect boundary:** Security Scanner produces vulnerability classifications, risk priorities, and remediation guidance. It does not run scans, modify files, or access external vulnerability databases.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "owasp-check" | "risk-prioritize" | "code-patterns" |
                              # "secret-scan" | "supply-chain" | "principles" |
                              # "full-audit"
Context: {
  target: string | null       # File path, module, or package name
  vulnerability: {
    cve_id: string | null     # CVE identifier
    cvss_score: number | null # 0.0 - 10.0
    epss_score: number | null # 0.0 - 1.0 (Exploit Prediction Scoring System)
  } | null
  code_snippet: string | null # Code to analyze for high-risk patterns
  dependencies: Array<string> | null  # Package list for supply chain check
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  owasp: {
    category: string          # "A01" - "A10"
    name: string
    risk_indicators: Array<string>
    remediation: string
  } | null
  risk: {
    severity: string          # "critical" | "high" | "medium" | "low"
    action: string            # "immediate" | "schedule" | "monitor"
    rationale: string
  } | null
  patterns: Array<{
    pattern: string
    risk: string
    location: string | null
    fix: string
  }> | null
  secrets: Array<{
    type: string              # "api_key" | "token" | "credential" | "cloud"
    indicators: Array<string>
    severity: string
  }> | null
  supply_chain: {
    risks: Array<string>
    recommendations: Array<string>
  } | null
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

- Risk prioritization is deterministic: EPSS > 0.5 ? CRITICAL; CVSS = 9.0 ? HIGH; CVSS 7.0-8.9 ? check asset value; CVSS < 7.0 ? schedule.
- OWASP mapping is fixed: 10 categories (A01-A10) with defined indicators.
- Code patterns are fixed: 5 patterns with deterministic detection.
- Secret categories are fixed: 4 types with defined indicators.
- Core principles are fixed: 5 principles with defined applications.
- Same vulnerability + same context = same risk classification.

#### What Agents May Assume

- OWASP Top 10:2025 categories are current.
- EPSS scores range 0.0-1.0.
- CVSS scores range 0.0-10.0.
- Code patterns apply to all languages (language-agnostic indicators).

#### What Agents Must NOT Assume

- CVSS/EPSS scores are provided (may be null).
- All vulnerabilities have CVE identifiers.
- Supply chain audit is exhaustive (depends on dependency list).
- Secret patterns catch all secrets (high-entropy detection is supplementary).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| OWASP check | None; classification |
| Risk prioritize | None; severity + action |
| Code patterns | None; pattern matches |
| Secret scan | None; indicator matches |
| Supply chain | None; risk assessment |
| Full audit | None; combined output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify security concern (vulnerability, code, secrets, deps)
2. Invoke appropriate request type
3. For vulnerabilities: invoke risk-prioritize with CVSS/EPSS
4. For code: invoke code-patterns with snippet
5. For dependencies: invoke supply-chain with package list
6. Review findings and apply fixes (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete assessment.
- All decisions are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Missing CVSS/EPSS | Return error | Provide scores |
| Invalid OWASP category | Return error | Use A01-A10 |
| Invalid request type | Return error | Use supported type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| OWASP check | Yes | Same indicators = same category |
| Risk prioritize | Yes | Same CVSS/EPSS = same severity |
| Code patterns | Yes | Same code = same matches |
| Secret scan | Yes | Same input = same findings |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Parse vulnerability, code, or dependency context | Classification |
| **Assess** | Generate risk priority, OWASP mapping, or pattern matches | Complete assessment |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Risk prioritization tree | EPSS > 0.5 ? CRITICAL (immediate); CVSS = 9.0 ? HIGH; CVSS 7.0-8.9 ? check asset value; CVSS < 7.0 ? schedule later |
| OWASP mapping fixed | A01: Broken Access Control; A02: Security Misconfiguration; A03: Supply Chain; A04: Cryptographic Failures; A05: Injection; A06: Insecure Design; A07: Auth Failures; A08: Integrity Failures; A09: Logging & Alerting; A10: Exceptional Conditions |
| Code patterns fixed | String concat in queries ? Injection; eval()/exec() ? RCE; pickle.loads() ? Deserialization; User input in paths ? Traversal; verify=False ? Security disabled |
| Secret patterns fixed | API keys (api_key, high entropy); Tokens (bearer, jwt); Credentials (password, secret); Cloud (AWS_, AZURE_, GCP_) |
| Principles fixed | Assume Breach, Zero Trust, Defense in Depth, Least Privilege, Fail Secure |
| Prioritize by exploitability | EPSS score > CVSS score for urgency |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Missing CVSS/EPSS for prioritization | Return `ERR_MISSING_SCORES` | Provide CVSS and/or EPSS |
| Invalid OWASP category | Return `ERR_INVALID_OWASP` | Use A01-A10 |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** Every failure returns a structured error. No partial assessments.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_MISSING_SCORES` | Validation | Yes | CVSS or EPSS required for prioritization |
| `ERR_INVALID_OWASP` | Validation | Yes | OWASP category not A01-A10 |
| `ERR_INVALID_CVSS` | Validation | Yes | CVSS score outside 0.0-10.0 range |

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
  "skill_name": "security-scanner",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "owasp_category": "string|null",
  "risk_severity": "string|null",
  "patterns_found": "number",
  "secrets_found": "number",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Risk classified | INFO | cvss_score, epss_score, severity |
| OWASP category mapped | INFO | owasp_category, risk_indicators |
| Code patterns detected | WARN | patterns_found, pattern_types |
| Secrets detected | WARN | secrets_found, secret_types |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `secscanner.decision.duration` | Histogram | ms |
| `secscanner.severity.distribution` | Counter | per severity level |
| `secscanner.owasp_category.distribution` | Counter | per OWASP category |
| `secscanner.patterns.count` | Counter | per pattern type |
| `secscanner.secrets.count` | Counter | per secret type |

---

## 14. Security & Trust Model

### Data Handling

- Security Scanner processes vulnerability metadata (CVE IDs, CVSS/EPSS scores).
- Code snippets are analyzed for patterns only; not stored.
- Secret pattern detection uses indicator matching; does not extract actual secrets.
- No network calls, no external database access.

### Sensitivity

- CVSS/EPSS scores are non-sensitive metadata.
- Code snippets may contain sensitive logic; scoped to invocation only.
- Findings should be treated as confidential by the caller.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Pattern matching | 5 fixed patterns | No growth expected |
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
| Risk prioritization | < 2 ms | < 5 ms | 20 ms |
| OWASP mapping | < 2 ms | < 5 ms | 20 ms |
| Code pattern scan | < 5 ms | < 15 ms | 30 ms |
| Full audit | < 15 ms | < 40 ms | 50 ms |
| Output size | = 3,000 chars | = 6,000 chars | 10,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| OWASP Top 10 changes | Low (every 3-4 years) | Outdated categories | Track OWASP releases |
| New code patterns emerge | Medium | Missed vulnerabilities | Annual pattern review |
| EPSS model changes | Low | Scoring drift | Track FIRST.org updates |
| Language-specific patterns | Medium | Missed language-specific vulns | Add language-aware patterns |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies for guidance |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: OWASP mapping, risk tree, pattern detection |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to cicd-pipeline, code-review, offensive-sec |
| Content Map for multi-file | ? | Links to auth-patterns.md, checklists.md, scripts/, engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | OWASP Top 10:2025 (10 categories) | ? |
| **Functionality** | Risk prioritization (EPSS + CVSS tree) | ? |
| **Functionality** | 5 high-risk code patterns | ? |
| **Functionality** | 4 secret detection categories | ? |
| **Functionality** | 5 core security principles | ? |
| **Functionality** | Supply chain guidance (A03) | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 4 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed risk tree, fixed OWASP, fixed patterns | ? |
| **Security** | No secrets extracted, no network, scoped to invocation | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 5 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
