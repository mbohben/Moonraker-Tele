---
title: Secret Prefilter Gate
impact: CRITICAL
impactDescription: Prevents API keys, tokens, and credentials from being committed to knowledge signals
tags: security, prefilter, secrets, regex
---

# 🔒 Secret Prefilter Gate (MANDATORY)

**Impact: CRITICAL — prevents accidental secret leakage into git-tracked knowledge files.**

> 12-pattern regex gate to prevent API keys, tokens, and credentials from leaking into git-tracked knowledge files.

---

## When This Applies

**BEFORE writing ANY file to `knowledge/raw-signals/`, `knowledge/patterns/`, or `knowledge/concepts/`**, the agent MUST scan the content for secrets.

## Protocol

```
BEFORE writing signal/pattern/concept content to disk:
1. Scan the full text content against the Secret Pattern Table below
2. If ANY pattern matches:
   a. DO NOT write the file
   b. WARN the user: "🔒 Blocked: detected {type} in signal content"
   c. Ask user to redact the secret and retry
3. If no match → proceed with write
```

## Secret Pattern Table (12 Patterns)

| ID | Type | Pattern | Example |
|----|------|---------|---------|
| SEC-01 | Anthropic API Key | `sk-ant-[A-Za-z0-9_-]{20,}` | `sk-ant-api03-xxxx...` |
| SEC-02 | OpenAI API Key | `sk-(?:proj-)?[A-Za-z0-9][A-Za-z0-9_-]{20,}` | `sk-proj-xxxx...` |
| SEC-03 | GitHub Token | `gh[pousr]_[A-Za-z0-9]{20,}` or `github_pat_[A-Za-z0-9_]{80,}` | `ghp_xxxx...` |
| SEC-04 | AWS Access Key | `(?:AKIA\|ASIA)[0-9A-Z]{16}` | `AKIAIOSFODNN7EXAMPLE` |
| SEC-05 | DB Connection URI | `(?:postgres\|mysql\|mongodb\|redis\|amqp)://[^:\s/@]+:[^@\s]{4,}@\S+` | `postgres://user:pass@host` |
| SEC-06 | Slack Token | `xox[baprs]-[A-Za-z0-9-]{10,}` | `xoxb-xxxx...` |
| SEC-07 | Stripe Live Key | `sk_live_[A-Za-z0-9]{24,}` | `sk_live_xxxx...` |
| SEC-08 | Google API Key | `AIza[0-9A-Za-z_-]{35}` | `AIzaSyxxxx...` |
| SEC-09 | Vault Token | `(?:hvs\|hvb\|s)\.[A-Za-z0-9._-]{20,}` | `hvs.xxxx...` |
| SEC-10 | JWT | `eyJ[A-Za-z0-9_=-]+\.[A-Za-z0-9_=-]+\.[A-Za-z0-9_.+/=-]*` | `eyJhbGci...` |
| SEC-11 | PEM Private Key | `-----BEGIN (?:RSA \|OPENSSH \|DSA \|EC )?PRIVATE KEY-----` | `-----BEGIN RSA PRIVATE KEY-----` |
| SEC-12 | Bearer Token | `(?i)bearer\s+[A-Za-z0-9._~+/-]{20,}` | `Bearer eyJhbGci...` |

## Evasion Awareness

Agents should also be aware of obfuscation techniques:
- **Zero-width characters**: `s\u200Bk-ant-...` — strip zero-width chars before scanning
- **Fullwidth ASCII**: `ｓｋ-ant-...` — normalize Unicode (NFKC) before scanning
- **Split across lines**: If content looks like a key split with newlines, flag it

## What Is NOT a Secret

Do NOT block these (false positive prevention):
- Pattern descriptions like `"sk-ant-[A-Za-z0-9_-]{20,}"` in documentation
- Placeholder examples like `sk-ant-YOUR-KEY-HERE` or `sk_live_EXAMPLE`
- Redacted keys like `sk-ant-***REDACTED***`

## Correct Behavior

**Incorrect (what's wrong):**
```markdown
## Signal
Used OpenAI API with key sk-proj-abc123def456ghi789jkl012mno345pqr678 to test embedding.
```

**Correct (what's right):**
```markdown
## Signal
Used OpenAI API to test embedding. API key stored in .env (not committed).
```

---

## Automation

For CLI-based scanning, use: `node .agent/skills/knowledge-compiler/scripts/secret-scanner.ts <path>`

---

⚡ PikaKit v3.9.206
