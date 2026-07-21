---
name: jwt-deep
description: JWT signing, rotation, claims, refresh token patterns, JWKS endpoint
title: "JWT Deep Dive"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: jwt, deep
---

# JWT Deep Dive

> Token design, signing, rotation, and refresh patterns.

---

## JWT Structure

```
Header.Payload.Signature
```

| Part | Contains | Example |
|------|----------|---------|
| Header | Algorithm, type | `{"alg": "RS256", "typ": "JWT"}` |
| Payload | Claims (data) | `{"sub": "user123", "exp": 1700000000}` |
| Signature | Verification | HMAC or RSA signature |

---

## Signing Algorithms

| Algorithm | Type | Best For |
|-----------|------|----------|
| `RS256` | Asymmetric (RSA) | Microservices (verify without secret) |
| `ES256` | Asymmetric (ECDSA) | Mobile, performance-sensitive |
| `HS256` | Symmetric (HMAC) | Monolith (single service) |
| `EdDSA` | Asymmetric (Ed25519) | Modern, fastest asymmetric |

> **Rule:** Use asymmetric for distributed systems. Symmetric only for single-service.

---

## Claims Best Practices

### Standard Claims (use these)

| Claim | Purpose | Required? |
|-------|---------|-----------|
| `sub` | Subject (user ID) | ✅ |
| `iss` | Issuer | ✅ |
| `aud` | Audience | ✅ |
| `exp` | Expiry (Unix timestamp) | ✅ |
| `iat` | Issued at | ✅ |
| `jti` | JWT ID (unique) | For revocation |

### Custom Claims

```typescript
// ✅ Minimal claims
{
  sub: "user_abc123",
  role: "admin",        // For quick authz checks
  org: "org_xyz",       // Multi-tenant
  scope: "read write",  // API permissions
}

// ❌ Too much data
{
  sub: "user_abc123",
  email: "user@example.com",  // PII in token
  address: "...",              // Never store PII
  fullProfile: {...},          // Token too large
}
```

---

## Access + Refresh Token Pattern

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Client    │     │  Auth Server │     │   Resource   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │  Login             │                    │
       │───────────────────>│                    │
       │  Access (15min)    │                    │
       │  + Refresh (7d)    │                    │
       │<───────────────────│                    │
       │                    │                    │
       │  API call + Access Token                │
       │────────────────────────────────────────>│
       │  Response                               │
       │<────────────────────────────────────────│
       │                    │                    │
       │  (Access expired)  │                    │
       │  Refresh request   │                    │
       │───────────────────>│                    │
       │  New Access        │                    │
       │  + New Refresh     │ (rotation!)        │
       │<───────────────────│                    │
```

### Implementation

```typescript
// Token generation
function generateTokenPair(userId: string) {
  const accessToken = jwt.sign(
    { sub: userId, type: 'access' },
    ACCESS_SECRET,
    { expiresIn: '15m', algorithm: 'RS256' }
  );

  const refreshToken = jwt.sign(
    { sub: userId, type: 'refresh', jti: crypto.randomUUID() },
    REFRESH_SECRET,
    { expiresIn: '7d', algorithm: 'RS256' }
  );

  return { accessToken, refreshToken };
}

// Refresh endpoint
async function refreshTokens(oldRefreshToken: string) {
  const payload = jwt.verify(oldRefreshToken, REFRESH_PUBLIC_KEY);

  // Check if token was already used (rotation detection)
  const isUsed = await redis.get(`used_refresh:${payload.jti}`);
  if (isUsed) {
    // Token reuse detected → compromise! Revoke all user sessions
    await revokeAllSessions(payload.sub);
    throw new SecurityError('Refresh token reuse detected');
  }

  // Mark old token as used
  await redis.setex(`used_refresh:${payload.jti}`, 7 * 86400, '1');

  return generateTokenPair(payload.sub);
}
```

---

## Key Rotation

### Why Rotate

- Limit blast radius of key compromise
- Compliance requirements (SOC 2, PCI)

### JWKS Endpoint Pattern

```typescript
// /.well-known/jwks.json
{
  "keys": [
    { "kid": "key-2025-01", "kty": "RSA", "use": "sig", ... },  // Current
    { "kid": "key-2024-07", "kty": "RSA", "use": "sig", ... }   // Previous (grace period)
  ]
}
```

### Rotation Schedule

| Environment | Frequency | Grace Period |
|-------------|-----------|--------------|
| Production | Every 90 days | 30 days overlap |
| High security | Every 30 days | 14 days overlap |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|------|
| Store JWT in localStorage | httpOnly secure cookie |
| Long-lived access tokens | 15 min max + refresh |
| Put PII in claims | Minimal claims, lookup from DB |
| Same key for all environments | Per-env signing keys |
| Skip `exp` validation | Always check expiry |
| Trust JWT without signature check | Always verify signature |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [oauth2.md](oauth2.md) | OAuth2 flows that issue JWTs |
| [session.md](session.md) | Stateful alternative to JWT |
| [rbac-abac.md](rbac-abac.md) | Permission claims in JWT |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

⚡ PikaKit v3.9.206
