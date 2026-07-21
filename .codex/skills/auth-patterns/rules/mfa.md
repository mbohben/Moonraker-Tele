---
name: mfa
description: Multi-factor authentication — TOTP setup, backup codes, WebAuthn for MFA, recovery flows
title: "Multi-Factor Authentication (MFA)"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: mfa
---

# Multi-Factor Authentication (MFA)

> TOTP, WebAuthn, backup codes, and recovery flows.
> **See also:** `security-scanner/auth-patterns.md` for TOTP code pattern and account lockout.

---

## MFA Strategy Selection

| Method | Security | UX | Best For |
|--------|----------|-----|---------|
| TOTP (authenticator app) | ★★★★ | ★★★ | General purpose |
| WebAuthn / Passkey | ★★★★★ | ★★★★ | Modern apps |
| SMS OTP | ★★ | ★★★★ | Legacy, low-risk |
| Email OTP | ★★ | ★★★ | Fallback only |
| Hardware key (YubiKey) | ★★★★★ | ★★ | High security |

> ⚠️ **SMS OTP is vulnerable to SIM swapping.** Avoid for high-value targets.

---

## TOTP Implementation

> **Reference:** See `security-scanner/auth-patterns.md` for base TOTP code pattern.

### Enhanced Setup Flow

```typescript
import { authenticator } from 'otplib';
import qrcode from 'qrcode';

async function enableMFA(userId: string) {
  // 1. Generate secret
  const secret = authenticator.generateSecret();

  // 2. Create otpauth URI
  const otpauthUrl = authenticator.keyuri(
    user.email,
    'YourApp',
    secret
  );

  // 3. Generate QR code
  const qrDataUrl = await qrcode.toDataURL(otpauthUrl);

  // 4. Store secret (encrypted) — NOT active yet
  await db.user.update({
    where: { id: userId },
    data: { mfaSecret: encrypt(secret), mfaPending: true },
  });

  // 5. Generate backup codes
  const backupCodes = generateBackupCodes(10);
  await storeBackupCodes(userId, backupCodes);

  return { qrDataUrl, backupCodes };
}

// 6. Verify first code to activate
async function confirmMFA(userId: string, code: string) {
  const secret = decrypt(user.mfaSecret);
  const isValid = authenticator.verify({ token: code, secret });

  if (!isValid) throw new InvalidCodeError();

  await db.user.update({
    where: { id: userId },
    data: { mfaEnabled: true, mfaPending: false },
  });
}
```

### Backup Codes

```typescript
function generateBackupCodes(count: number = 10): string[] {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString('hex') // 8-char codes
  );
}

async function storeBackupCodes(userId: string, codes: string[]) {
  // Hash each code before storing
  const hashed = codes.map(code => ({
    userId,
    codeHash: crypto.createHash('sha256').update(code).digest('hex'),
    used: false,
  }));
  await db.backupCode.createMany({ data: hashed });
}

async function useBackupCode(userId: string, code: string): Promise<boolean> {
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  const result = await db.backupCode.updateMany({
    where: { userId, codeHash: hash, used: false },
    data: { used: true, usedAt: new Date() },
  });
  return result.count > 0;
}
```

---

## WebAuthn / Passkey for MFA

```typescript
import { generateAuthenticationOptions, verifyAuthenticationResponse }
  from '@simplewebauthn/server';

// Challenge generation (server)
const options = await generateAuthenticationOptions({
  rpID: 'example.com',
  allowCredentials: user.credentials.map(c => ({
    id: c.credentialId,
    type: 'public-key',
  })),
  userVerification: 'required',
});

// Verify response (server)
const verification = await verifyAuthenticationResponse({
  response: clientResponse,
  expectedChallenge: storedChallenge,
  expectedOrigin: 'https://example.com',
  expectedRPID: 'example.com',
  authenticator: storedCredential,
});
```

---

## Recovery Flow

```
User cannot access MFA device?
├── Has backup codes → Enter backup code
├── Has recovery email → Email verification + admin review
├── Has trusted device → Device-based recovery
└── None of above → Manual identity verification (support)
```

### Recovery Best Practices

| Practice | Why |
|----------|-----|
| Show backup codes ONCE at setup | Prevent later access |
| Allow re-generating backup codes | When old ones run out |
| Log all recovery events | Audit trail |
| Rate limit recovery attempts | Prevent brute force |
| Notify on MFA changes | Alert user to compromise |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [passkey.md](passkey.md) | Passkeys as MFA or passwordless |
| [jwt-deep.md](jwt-deep.md) | Token lifecycle after MFA |
| [session.md](session.md) | Session management with MFA |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

⚡ PikaKit v3.9.206
