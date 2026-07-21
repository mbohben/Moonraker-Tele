---
name: auth-patterns
description: >-
  Authentication and authorization: OAuth2, JWT, RBAC/ABAC, MFA, Passkeys, session management.
  Use when implementing login, permissions, tokens, or security flows.
  NOT for vulnerability scanning (use security-scanner) or API design (use api-architect).
metadata:
  author: pikakit
  version: "3.9.206"
  category: security
  triggers: ["auth", "login", "OAuth", "JWT", "RBAC", "permissions", "MFA", "passkey"]
  coordinates_with: ["api-architect", "security-scanner", "data-modeler", "offensive-sec"]
  success_metrics: ["0 authorization bypass vulnerabilities", "100% FAANG audit compliance"]
---

# Auth Patterns

> Authentication & authorization decisions for production applications. Fail closed. Defense in depth.

---

## Prerequisites

**Required:** None — Auth Patterns is a knowledge-based skill with no external dependencies.

**Optional:**
- `security-scanner` skill (for implementation validation)
- `offensive-sec` skill (for attack vector analysis)

---

## When to Use

| Situation | Reference |
|-----------|-----------|
| Choosing auth strategy | Decision tree below |
| OAuth2 / SSO / OIDC | `rules/oauth2.md` |
| JWT signing, rotation, refresh | `rules/jwt-deep.md` |
| Permission system (RBAC/ABAC) | `rules/rbac-abac.md` |
| Multi-factor authentication | `rules/mfa.md` |
| Session management | `rules/session.md` |
| Passwordless / Passkeys | `rules/passkey.md` |
| Architecture review, contracts | `rules/engineering-spec.md` |

**Selective Reading Rule:** Read ONLY the file matching the current request.

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Auth strategy selection (JWT/Session/OAuth/Passkey) | Auth library implementation |
| Token lifecycle design (TTL, rotation, revocation) | Secret/key generation |
| Permission model architecture (RBAC/ABAC) | Users/roles DB schema (→ data-modeler) |
| MFA strategy selection (TOTP/WebAuthn) | MFA provider integration |
| Session config (cookie, store, invalidation) | Session store provisioning (→ server-ops) |

**Pure decision skill:** Produces security guidance. Zero network calls, zero credential handling, zero side effects.

---

## Core Principles

| Principle | Enforcement |
|-----------|-------------|
| **Fail Closed** | Auth error or ambiguity → deny access. Never implicit allow. |
| **Defense in Depth** | Every recommendation includes ≥ 3 controls: auth + authz + rate limit + monitoring |
| **Least Privilege** | Grant minimum permissions; default to no-access |
| **Token Hygiene** | Access token ≤ 15 min. Refresh token rotated on use. httpOnly storage. |
| **Zero Trust** | Verify every request. No implicit trust for internal services. |

---

## Auth Strategy Decision Tree

```
What type of application?
├── SPA / Mobile App
│   ├── First-party only → JWT (≤15min access) + Refresh Token (httpOnly cookie)
│   └── Third-party login → OAuth 2.0 + PKCE (mandatory for public clients)
├── Traditional Web (SSR)
│   └── Session-based (httpOnly secure cookies, SameSite=Strict)
├── API / Microservices
│   ├── Service-to-service → mTLS or API Keys + HMAC
│   └── User-facing → JWT with gateway validation
├── Enterprise / B2B
│   └── SAML 2.0 or OIDC (SSO)
└── Modern Passwordless
    └── Passkeys (WebAuthn/FIDO2)
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not one of the 8 supported types |
| `ERR_MISSING_CONTEXT` | Yes | Required context field is null or empty |
| `ERR_CONSTRAINT_CONFLICT` | Yes | Contradictory constraints |
| `ERR_INVALID_APP_TYPE` | No | App type not recognized |
| `ERR_INVALID_SENSITIVITY` | No | Sensitivity not one of: low, medium, high, critical |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |
| `ERR_UNSUPPORTED_COMPLIANCE` | Yes | Compliance standard combination not covered |

**Zero internal retries.** Deterministic output; same context = same recommendation.

---

## Decision Checklist

- [ ] **Auth strategy chosen for THIS app type?** (JWT / Session / OAuth / Passkey)
- [ ] **Token storage decided?** (httpOnly secure cookie — NOT localStorage)
- [ ] **Access token TTL ≤ 15 minutes?**
- [ ] **Refresh token rotation configured?** (rotate on every use)
- [ ] **Permission model chosen?** (RBAC / ABAC / hybrid)
- [ ] **MFA required for sensitive operations?** (high/critical sensitivity)
- [ ] **Session invalidation on password change?**
- [ ] **Rate limiting on auth endpoints?**
- [ ] **PKCE enabled for all public clients?** (SPA, mobile)

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Store JWT in localStorage | Use httpOnly secure cookies |
| Access tokens with 24h+ expiry | Access token ≤ 15 min + refresh token |
| Roll your own crypto | Use battle-tested libraries (jose, passport) |
| Same signing key for all services | Per-service signing keys |
| Skip PKCE for public clients | PKCE mandatory for SPA/mobile OAuth |
| Hardcode roles in application code | Store permissions in database |
| Implicit trust for internal services | Zero trust: verify every request |


## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [oauth2.md](rules/oauth2.md) | OAuth 2.0 + OIDC flows, PKCE, scopes, providers | Third-party login, SSO |
| [jwt-deep.md](rules/jwt-deep.md) | JWT signing, rotation, claims, refresh patterns | Token-based auth |
| [rbac-abac.md](rules/rbac-abac.md) | Role-Based + Attribute-Based access control | Permission systems |
| [mfa.md](rules/mfa.md) | TOTP, WebAuthn, backup codes, recovery | Multi-factor auth |
| [session.md](rules/session.md) | Cookie sessions, Redis store, stateless vs stateful | Session design |
| [passkey.md](rules/passkey.md) | WebAuthn/FIDO2 implementation guide | Passwordless auth |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec: contracts, security model, scalability | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API auth integration patterns |
| `security-scanner` | Skill | Auth vulnerability scanning |
| `data-modeler` | Skill | Users/roles schema design |
| `offensive-sec` | Skill | Auth attack vectors and pen testing |

---

⚡ PikaKit v3.9.206
