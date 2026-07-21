---
name: session
description: Cookie sessions, Redis store, stateless vs stateful, session lifecycle and security
title: "Session Management"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: session
---

# Session Management

> Cookie-based sessions, Redis store, stateless vs stateful trade-offs.

---

## Stateless vs Stateful

| Aspect | Stateless (JWT) | Stateful (Session) |
|--------|-----------------|-------------------|
| Storage | Token contains data | Server stores data |
| Scalability | ✅ No shared state | ⚠️ Needs shared store |
| Revocation | ❌ Hard (need blocklist) | ✅ Delete from store |
| Size | Can grow large | Fixed session ID |
| Best for | Microservices, API | Traditional web SSR |

### Hybrid Approach (Recommended)

```
Use JWT for access (short-lived, stateless)
+ Session-based refresh (stateful, revocable in Redis)
```

---

## Cookie-Based Session

### Secure Cookie Configuration

```typescript
app.use(session({
  name: '__session',                    // Avoid default 'connect.sid'
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,                     // No JS access
    secure: true,                       // HTTPS only
    sameSite: 'lax',                    // CSRF protection
    maxAge: 24 * 60 * 60 * 1000,       // 24 hours
    domain: '.example.com',            // Cross-subdomain if needed
    path: '/',
  },
}));
```

### Cookie Security Flags

| Flag | Purpose | Always Set? |
|------|---------|-------------|
| `httpOnly` | Prevent XSS token theft | ✅ |
| `secure` | HTTPS only | ✅ (prod) |
| `sameSite: lax` | Basic CSRF protection | ✅ |
| `sameSite: strict` | Full CSRF protection | For sensitive ops |
| `__Host-` prefix | Origin-bound | High security |

---

## Redis Session Store

### Why Redis

| Feature | Benefit |
|---------|---------|
| In-memory speed | < 1ms session lookup |
| TTL support | Automatic expiry |
| Cluster support | Horizontal scaling |
| Pub/Sub | Session invalidation across nodes |

### Setup

```typescript
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'lax' },
}));
```

### Session Data Structure

```typescript
// Keep session data minimal
interface SessionData {
  userId: string;
  role: string;
  orgId?: string;
  loginAt: number;
  lastActiveAt: number;
  // DON'T store: full user profile, preferences, cart items
}
```

---

## Session Lifecycle

### Login

```typescript
async function login(req: Request) {
  const user = await authenticate(req.body);

  // Regenerate session ID (prevent fixation)
  req.session.regenerate(() => {
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.loginAt = Date.now();
  });
}
```

### Logout

```typescript
async function logout(req: Request) {
  const sessionId = req.sessionID;

  // Destroy server-side session
  req.session.destroy(() => {
    // Clear cookie
    res.clearCookie('__session');
  });
}
```

### Invalidate All Sessions (password change)

```typescript
async function invalidateAllSessions(userId: string) {
  // Scan Redis for user's sessions
  const keys = await redis.keys(`sess:*`);
  for (const key of keys) {
    const data = await redis.get(key);
    if (data && JSON.parse(data).userId === userId) {
      await redis.del(key);
    }
  }
}
```

---

## Session Security Checklist

- [ ] Regenerate session ID after login
- [ ] Set `httpOnly`, `secure`, `sameSite` on cookies
- [ ] Use Redis/Memcached for distributed sessions
- [ ] Implement idle timeout (30 min) + absolute timeout (24h)
- [ ] Invalidate sessions on password change
- [ ] Log session creation/destruction for audit

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [jwt-deep.md](jwt-deep.md) | JWT as stateless alternative |
| [oauth2.md](oauth2.md) | OAuth sessions |
| [mfa.md](mfa.md) | MFA with sessions |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

⚡ PikaKit v3.9.206
