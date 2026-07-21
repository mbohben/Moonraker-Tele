---
name: auth-patterns
description: Authentication security patterns — TOTP 2FA, OAuth2, RBAC, password hashing, session management, rate limiting
---

# Authentication Security Patterns

> Fail closed. Hash everything. Short-lived tokens. Defense in depth.

---

## Password Hashing

```typescript
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12  // Cost factor — higher = slower = more secure

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Usage in signup
async function signup(email: string, password: string) {
  const hash = await hashPassword(password)
  await db.user.create({ data: { email, passwordHash: hash } })
}

// Usage in login
async function login(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } })
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new AuthError('Invalid credentials')  // Same message for both
  }
  return generateTokens(user)
}
```

---

## JWT Token Strategy

```typescript
import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

function generateTokens(user: User) {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }  // Short-lived
  )

  const refreshToken = jwt.sign(
    { sub: user.id, jti: crypto.randomUUID() },
    REFRESH_SECRET,
    { expiresIn: '7d' }  // Longer-lived, stored in httpOnly cookie
  )

  return { accessToken, refreshToken }
}

function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload
  } catch {
    throw new AuthError('Invalid or expired token')
  }
}
```

### Session Security Rules

| Rule | Implementation |
|------|---------------|
| Store access token | `httpOnly` cookie or memory (never localStorage) |
| Store refresh token | `httpOnly`, `Secure`, `SameSite=Strict` cookie |
| Rotate refresh token | Issue new one on each refresh, invalidate old |
| Logout | Delete both tokens + server-side invalidation |

---

## 2FA TOTP Implementation

```typescript
import { authenticator } from 'otplib'

// Setup — called once when user enables 2FA
function setup2FA(userId: string) {
  const secret = authenticator.generateSecret()
  const uri = authenticator.keyuri(userId, 'MyApp', secret)
  // Store secret (encrypted) in DB. Show QR code from uri to user.
  return { secret, uri }
}

// Verify — called on every login with 2FA enabled
function verify2FA(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret })
}

// Backup codes — generate on 2FA setup
function generateBackupCodes(): string[] {
  return Array.from({ length: 10 }, () =>
    crypto.randomBytes(4).toString('hex')  // 8-char codes
  )
  // Store hashed. Mark used on consumption. One-time only.
}
```

---

## Account Lockout

```typescript
const MAX_ATTEMPTS = 5
const LOCK_DURATION_MS = 15 * 60 * 1000 // 15 minutes

async function checkLockout(userId: string): Promise<void> {
  const record = await redis.get(`lockout:${userId}`)
  if (!record) return

  const { count, lastAttempt } = JSON.parse(record)
  if (count >= MAX_ATTEMPTS) {
    const lockExpiry = lastAttempt + LOCK_DURATION_MS
    if (Date.now() < lockExpiry) {
      throw new AccountLockedError(lockExpiry)
    }
    await redis.del(`lockout:${userId}`)  // Auto-unlock after timeout
  }
}

async function recordFailedAttempt(userId: string): Promise<void> {
  const key = `lockout:${userId}`
  const record = await redis.get(key)
  const current = record ? JSON.parse(record) : { count: 0 }

  await redis.setex(key, LOCK_DURATION_MS / 1000, JSON.stringify({
    count: current.count + 1,
    lastAttempt: Date.now(),
  }))
}
```

---

## Password Reset Token

```typescript
import crypto from 'node:crypto'

async function requestPasswordReset(email: string): Promise<void> {
  const user = await db.user.findUnique({ where: { email } })
  if (!user) return  // Don't reveal if email exists

  const token = crypto.randomBytes(32).toString('hex')
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  await db.passwordReset.create({
    data: {
      userId: user.id,
      token: hashedToken,             // Store hashed
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),  // 15 min
    },
  })

  await sendEmail(email, `Reset link: https://app.com/reset?token=${token}`)
}

async function resetPassword(token: string, newPassword: string): Promise<void> {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const record = await db.passwordReset.findFirst({
    where: { token: hashedToken, expiresAt: { gt: new Date() } },
  })
  if (!record) throw new AuthError('Invalid or expired reset token')

  await db.user.update({
    where: { id: record.userId },
    data: { passwordHash: await hashPassword(newPassword) },
  })

  await db.passwordReset.delete({ where: { id: record.id } })
  await invalidateAllSessions(record.userId)  // Force re-login
}
```

---

## RBAC (Role-Based Access Control)

```typescript
// Define roles and permissions
const PERMISSIONS = {
  admin:   ['read', 'write', 'delete', 'manage_users'],
  editor:  ['read', 'write'],
  viewer:  ['read'],
} as const

type Role = keyof typeof PERMISSIONS
type Permission = (typeof PERMISSIONS)[Role][number]

// Middleware — check permission before route handler
function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user  // From auth middleware
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const userPermissions = PERMISSIONS[user.role as Role] || []
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}

// Usage
app.delete('/api/users/:id', requirePermission('manage_users'), deleteUser)
app.put('/api/posts/:id', requirePermission('write'), updatePost)
app.get('/api/posts', requirePermission('read'), listPosts)
```

---

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit'

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, try again later' },
})

// Strict limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                     // 5 login attempts per 15 min
  skipSuccessfulRequests: true,
})

app.use('/api/', apiLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/reset', authLimiter)
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Store passwords as plain text or MD5 | bcrypt/argon2 with cost ≥ 12 |
| JWT in localStorage | `httpOnly` cookie |
| Same error for "user not found" vs "wrong password" visible to attacker | Same generic error for both |
| Unlimited login attempts | Rate limit + account lockout |
| Long-lived access tokens | 15 min access + 7 day refresh |
| Skip 2FA for admins | Require 2FA for elevated roles |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [checklists.md](checklists.md) | Pre-deployment checklist |
| [scripts/security_scan.ts](scripts/security_scan.ts) | Automated scanning |
| [SKILL.md](SKILL.md) | OWASP 2025 mapping |

---

⚡ PikaKit v3.9.206
