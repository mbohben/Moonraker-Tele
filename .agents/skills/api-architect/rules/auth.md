---
name: auth
description: API authentication patterns — JWT, OAuth2 PKCE, API Keys, Passkeys, token refresh
title: "Authentication Patterns"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: auth
---

# Authentication Patterns

> Choose auth pattern based on consumers and security requirements.

---

## Selection Guide

| Pattern | Best For | Security Level |
|---------|----------|:--------------:|
| **JWT** | Stateless APIs, microservices | Medium |
| **Session** | Traditional web, server-rendered | High |
| **OAuth 2.0 PKCE** | Third-party login, SPA/mobile | High |
| **API Keys** | Server-to-server, public APIs | Low-Medium |
| **Passkey** | Modern passwordless (2025+) | Very High |

## JWT Pattern

```typescript
import jwt from 'jsonwebtoken';

// Sign — keep payload minimal
function signTokens(userId: string) {
  const accessToken = jwt.sign(
    { sub: userId, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }   // Short-lived
  );

  const refreshToken = jwt.sign(
    { sub: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

// Verify middleware
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload as JwtPayload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

## Token Refresh Flow

```
Client                        Server
  │                              │
  ├── Request + Access Token ──→ │
  │                              ├── Verify token
  │ ←── 401 Token Expired ──────┤
  │                              │
  ├── POST /auth/refresh ──────→ │
  │    { refreshToken }          ├── Verify refresh token
  │                              ├── Issue new access + refresh
  │ ←── { accessToken,          │
  │       refreshToken } ───────┤
  │                              │
  ├── Retry original request ──→ │
```

## OAuth 2.0 PKCE (for SPAs/Mobile)

```typescript
// 1. Generate PKCE challenge
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

// 2. Redirect to provider
const authUrl = `https://provider.com/authorize?` +
  `client_id=${CLIENT_ID}&` +
  `code_challenge=${codeChallenge}&` +
  `code_challenge_method=S256&` +
  `redirect_uri=${REDIRECT_URI}&` +
  `response_type=code&scope=openid+email`;

// 3. Exchange code for tokens (server-side)
const tokens = await fetch('https://provider.com/token', {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    code_verifier: codeVerifier,
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
  }),
});
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Store sensitive data in JWT payload | Include only `sub`, `type`, `exp` |
| Use long-lived access tokens (>1h) | Short access (15m) + refresh (7d) |
| Send tokens in URL query params | Use `Authorization: Bearer` header |
| Use OAuth implicit flow | Use PKCE for SPAs and mobile |
| Skip token revocation | Maintain a revocation list for refresh tokens |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [security-testing.md](security-testing.md) | Auth testing patterns |
| [rate-limiting.md](rate-limiting.md) | Rate limit auth endpoints |
| [SKILL.md](../SKILL.md) | Full decision framework |

---

⚡ PikaKit v3.9.206
