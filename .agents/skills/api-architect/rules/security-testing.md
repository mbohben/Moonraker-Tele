---
name: security-testing
description: OWASP API Top 10, JWT testing, BOLA/IDOR, authorization and input validation testing
title: "API Security Testing"
impact: HIGH
impactDescription: "Important architectural or correctness impact"
tags: security, testing
---

# API Security Testing

> Principles for testing API security. OWASP API Top 10, authentication, authorization testing.

---

## OWASP API Security Top 10

| Vulnerability | Test Focus |
|---------------|------------|
| **API1: BOLA** | Access other users' resources |
| **API2: Broken Auth** | JWT, session, credentials |
| **API3: Property Auth** | Mass assignment, data exposure |
| **API4: Resource Consumption** | Rate limiting, DoS |
| **API5: Function Auth** | Admin endpoints, role bypass |
| **API6: Business Flow** | Logic abuse, automation |
| **API7: SSRF** | Internal network access |
| **API8: Misconfiguration** | Debug endpoints, CORS |
| **API9: Inventory** | Shadow APIs, old versions |
| **API10: Unsafe Consumption** | Third-party API trust |

---

## Authentication Testing

### JWT Testing

| Check | What to Test |
|-------|--------------|
| Algorithm | None, algorithm confusion |
| Secret | Weak secrets, brute force |
| Claims | Expiration, issuer, audience |
| Signature | Manipulation, key injection |

### Session Testing

| Check | What to Test |
|-------|--------------|
| Generation | Predictability |
| Storage | Client-side security |
| Expiration | Timeout enforcement |
| Invalidation | Logout effectiveness |

---

## Authorization Testing

| Test Type | Approach |
|-----------|----------|
| **Horizontal** | Access peer users' data |
| **Vertical** | Access higher privilege functions |
| **Context** | Access outside allowed scope |

### BOLA/IDOR Testing

1. Identify resource IDs in requests
2. Capture request with user A's session
3. Replay with user B's session
4. Check for unauthorized access

---

## Input Validation Testing

| Injection Type | Test Focus |
|----------------|------------|
| SQL | Query manipulation |
| NoSQL | Document queries |
| Command | System commands |
| LDAP | Directory queries |

**Approach:** Test all parameters, try type coercion, test boundaries, check error messages.

---

## Rate Limiting Testing

| Aspect | Check |
|--------|-------|
| Existence | Is there any limit? |
| Bypass | Headers, IP rotation |
| Scope | Per-user, per-IP, global |

**Bypass techniques:** X-Forwarded-For, different HTTP methods, case variations, API versioning.

---

## GraphQL Security

| Test | Focus |
|------|-------|
| Introspection | Schema disclosure |
| Batching | Query DoS |
| Nesting | Depth-based DoS |
| Authorization | Field-level access |

---

## Security Testing Checklist

**Authentication:**
- [ ] Test for bypass
- [ ] Check credential strength
- [ ] Verify token security

**Authorization:**
- [ ] Test BOLA/IDOR
- [ ] Check privilege escalation
- [ ] Verify function access

**Input:**
- [ ] Test all parameters
- [ ] Check for injection

**Config:**
- [ ] Check CORS
- [ ] Verify headers
- [ ] Test error handling

---

> **Remember:** APIs are the backbone of modern apps. Test them like attackers will.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [auth.md](auth.md) | Auth patterns to test |
| [rate-limiting.md](rate-limiting.md) | Rate limit bypass testing |
| [graphql.md](graphql.md) | GraphQL-specific security |
| [SKILL.md](../SKILL.md) | Full decision framework |

---

⚡ PikaKit v3.9.206
