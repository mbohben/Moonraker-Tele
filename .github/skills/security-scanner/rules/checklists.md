---
name: security-checklists
description: Security audit checklists — OWASP 2025, API security, auth, data protection, headers with implementation code
---

# Security Checklists

> Copy relevant checklists into PLAN.md or security report. Use alongside security_scan.ts.

---

## OWASP Top 10:2025 Checklist

### A01: Broken Access Control
- [ ] Authorization on all protected routes
- [ ] Deny by default (fail closed)
- [ ] Rate limiting on all endpoints
- [ ] CORS properly configured (no wildcard + credentials)
- [ ] IDOR protection (validate resource ownership)

### A02: Security Misconfiguration
- [ ] Debug mode disabled in production
- [ ] Default credentials changed
- [ ] Error messages sanitized (no stack traces)
- [ ] Security headers configured (see below)
- [ ] Unnecessary features/ports disabled

### A03: Supply Chain 🆕
- [ ] Lock file committed (package-lock.json / pnpm-lock.yaml)
- [ ] `npm audit` or `pnpm audit` passes
- [ ] CI/CD pipeline uses pinned dependencies
- [ ] No `postinstall` scripts from untrusted packages
- [ ] Dependency integrity verified (checksums)

### A04: Cryptographic Failures
- [ ] Passwords hashed (bcrypt cost ≥ 12 or argon2)
- [ ] Sensitive data encrypted at rest (AES-256)
- [ ] TLS 1.2+ enforced for all connections
- [ ] No secrets in code, logs, or version control
- [ ] Key rotation policy in place

### A05: Injection
- [ ] Parameterized queries (no string concat)
- [ ] Input validation on all user data
- [ ] Output encoding for XSS prevention
- [ ] No `eval()`, `exec()`, or dynamic code execution
- [ ] CSP header blocks inline scripts

### A06: Insecure Design
- [ ] Threat modeling completed
- [ ] Business logic validated
- [ ] Abuse cases documented
- [ ] Security requirements defined

### A07: Auth Failures
- [ ] MFA available for all users
- [ ] Session invalidation on logout
- [ ] Session timeout (15 min access, 7 day refresh)
- [ ] Brute force protection (lockout + rate limit)
- [ ] Password policy enforced (min 8 chars, no common passwords)

### A08: Integrity Failures
- [ ] CI/CD pipeline secured (branch protection, signed commits)
- [ ] Dependency integrity verified
- [ ] Update mechanism uses signatures
- [ ] Build artifacts are reproducible

### A09: Logging & Alerting
- [ ] Security events logged (login, failed auth, access denied)
- [ ] Logs protected from tampering
- [ ] No sensitive data in logs (passwords, tokens, PII)
- [ ] Alerting configured for suspicious activity
- [ ] Audit trail for admin actions

### A10: Exceptional Conditions 🆕
- [ ] All errors handled gracefully
- [ ] No internal details exposed in error responses
- [ ] Unhandled exceptions don't crash the application
- [ ] Error monitoring configured (Sentry, etc.)

---

## Security Headers Implementation

### Next.js (next.config.js)

```javascript
const securityHeaders = [
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'" },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

### Express Middleware

```typescript
import helmet from 'helmet'

app.use(helmet())  // Sets all security headers automatically

// Or manual:
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'")
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})
```

### Header Reference

| Header | Purpose | Value |
|--------|---------|-------|
| `Content-Security-Policy` | XSS prevention | `default-src 'self'` |
| `X-Content-Type-Options` | MIME sniffing | `nosniff` |
| `X-Frame-Options` | Clickjacking | `DENY` |
| `Strict-Transport-Security` | Force HTTPS | `max-age=31536000; includeSubDomains` |
| `Referrer-Policy` | Referrer control | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Feature access | `camera=(), microphone=()` |

---

## Quick Audit Commands

```bash
# Dependencies
npm audit                             # Node.js vulnerabilities
npm audit --audit-level=high          # Only high+ severity
pnpm audit                            # pnpm equivalent
pip-audit                             # Python dependencies

# Secrets
npx secretlint "**/*"                 # Scan for secrets
git log --all -p | grep -i "password\|api_key\|secret"  # Git history

# Code patterns
npx eslint --rule 'no-eval: error' .  # Detect eval()
grep -rn "dangerouslySetInnerHTML" src/  # XSS vectors

# Full scan (this skill)
node .agent/skills/security-scanner/scripts/security_scan.ts . --output=summary

# HTTPS/TLS
openssl s_client -connect example.com:443  # Check TLS version
curl -I https://example.com | grep -i "strict\|content-security\|x-frame"  # Headers
```

---

## CI/CD Security Checklist

- [ ] Branch protection on `main` (require PR + approvals)
- [ ] Secrets stored in CI/CD variables (not in repo)
- [ ] Dependencies scanned on every PR (`npm audit`)
- [ ] SAST (Static Analysis) runs on every commit
- [ ] No `--force` push to protected branches
- [ ] Build environment isolated (ephemeral containers)
- [ ] Deployment requires manual approval for production
- [ ] Artifact signing enabled

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [auth-patterns.md](auth-patterns.md) | Auth implementation |
| [scripts/security_scan.ts](scripts/security_scan.ts) | Automated scanning |
| [SKILL.md](SKILL.md) | OWASP 2025 mapping, risk prioritization |

---

⚡ PikaKit v3.9.206
