---
name: security-scanner
description: >-
  Vulnerability analysis: OWASP 2025, supply chain security, and risk prioritization.
  Use when scanning for vulnerabilities, auditing dependencies, or assessing security risks.
  NOT for auth implementation (use auth-patterns) or penetration testing (use offensive-sec).
metadata:
  author: pikakit
  version: "3.9.206"
  category: security-auditor
  triggers: ["security", "vulnerability", "OWASP", "pentest", "threat modeling"]
  coordinates_with: ["offensive-sec", "auth-patterns", "cicd-pipeline", "code-review", "problem-checker", "knowledge-compiler"]
  success_metrics: ["Vulnerability Detection Rate", "OWASP Coverage", "Remediation Completeness"]
---

# Security Scanner — Vulnerability Analysis & OWASP

> Think like an attacker. Prioritize by exploitability (EPSS), not just severity (CVSS).

---

## 5 Must-Ask Questions (Before Scanning)

| # | Question | Options |
|---|----------|---------|
| 1 | Target Assets? | User data / API keys / PII / Financial / Source code |
| 2 | Threat Actors? | Automated bots / Insider threats / Nation-state / Script kiddies |
| 3 | Attack Vectors? | Web app / API / Supply chain / Social engineering |
| 4 | Business Impact? | Data breach / Downtime / Regulatory fines / Reputation |
| 5 | Compliance Requirements? | GDPR / HIPAA / SOC2 / PCI-DSS / None |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Pre-deployment | Run security scan |
| New dependencies | Check supply chain (A03) |
| Code review | Check 5 high-risk patterns |
| Secret detection | Scan 4 secret categories |
| Auth implementation | Read `auth-patterns.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| OWASP Top 10:2025 mapping | Red team execution (→ offensive-sec) |
| Risk prioritization (EPSS + CVSS) | CI/CD configuration (→ cicd-pipeline) |
| High-risk code patterns (5) | Authentication design (→ auth-patterns) |
| Secret detection guidance (4 types) | Code fixes |

**Expert decision skill:** Produces vulnerability assessments. Does not run scans.

---

## Core Principles (5 — Fixed)

| Principle | Application |
|-----------|-------------|
| **Assume Breach** | Design as if attacker is already inside |
| **Zero Trust** | Never trust, always verify |
| **Defense in Depth** | Multiple independent layers |
| **Least Privilege** | Minimum access required |
| **Fail Secure** | On error, deny access (fail closed) |

---

## Risk Prioritization (Deterministic)

```
Is it actively exploited (EPSS > 0.5)?
├── YES → CRITICAL: Immediate remediation
└── NO  → Check CVSS score:
         ├── ≥ 9.0        → HIGH
         ├── 7.0 - 8.9    → Check asset value → MEDIUM or HIGH
         └── < 7.0        → LOW: Schedule later
```

---

## OWASP Top 10:2025 (Fixed)

| Rank | Category | Key Indicators |
|------|----------|---------------|
| A01 | Broken Access Control | IDOR, SSRF, privilege escalation |
| A02 | Security Misconfiguration | Default creds, missing headers |
| A03 | Supply Chain 🆕 | Compromised deps, CI/CD tampering |
| A04 | Cryptographic Failures | Weak crypto, exposed secrets |
| A05 | Injection | String concat in queries, user→commands |
| A06 | Insecure Design | Missing threat model |
| A07 | Auth Failures | Broken sessions, weak credentials |
| A08 | Integrity Failures | Unsigned updates, untrusted pipelines |
| A09 | Logging & Alerting | Missing audit trail |
| A10 | Exceptional Conditions 🆕 | Unhandled errors exposing internals |

---

## High-Risk Code Patterns (5 — Fixed)

| Pattern | Risk | Fix |
|---------|------|-----|
| String concat in SQL/queries | Injection | Parameterized queries |
| `eval()`, `exec()` | Remote Code Execution | Remove or sandbox |
| `pickle.loads()` | Deserialization attack | Use JSON |
| User input in file paths | Path traversal | Sanitize + allowlist |
| `verify=False` (SSL) | Security bypass | Enable verification |

---

## Secret Detection (4 Categories)

| Type | Indicators |
|------|-----------|
| API Keys | `api_key`, `apikey`, high entropy strings |
| Tokens | `bearer`, `jwt`, `token` |
| Credentials | `password`, `secret`, `passwd` |
| Cloud | `AWS_`, `AZURE_`, `GCP_`, `GOOGLE_` |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_SCORES` | Yes | CVSS/EPSS required for risk |
| `ERR_INVALID_OWASP` | Yes | Category not A01-A10 |
| `ERR_INVALID_CVSS` | Yes | CVSS outside 0.0-10.0 |

**Zero internal retries.** Same vulnerability = same classification.

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `scan_started` | `{"scope": "full_audit", "owasp_focus": ["A01", "A05"]}` | `INFO` |
| `vulnerability_found` | `{"owasp_category": "A05", "pattern": "sql_injection", "file": "src/db.ts"}` | `WARN` |
| `risk_classified` | `{"severity": "critical", "cvss": 9.8, "epss": 0.7}` | `WARN` |
| `scan_completed` | `{"findings_total": 8, "critical": 1, "high": 2}` | `INFO` |

All scan outputs MUST emit `scan_started` and `scan_completed` events.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Scan without understanding | Map attack surface first |
| Alert on every CVE | Prioritize by EPSS exploitability |
| Fix symptoms only | Address root causes |
| Trust dependencies blindly | Verify integrity + audit |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [auth-patterns.md](rules/auth-patterns.md) | Authentication patterns | Auth implementation |
| [checklists.md](rules/checklists.md) | Security checklists | Pre-deployment |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | Pre-deploy integration |
| `code-review` | Skill | Manual review |
| `offensive-sec` | Skill | Red team tactics |

---

⚡ PikaKit v3.9.206
