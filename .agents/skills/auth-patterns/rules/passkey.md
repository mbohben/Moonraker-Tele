---
name: passkey
description: WebAuthn/FIDO2 passkeys — registration, authentication, browser + server implementation
title: "Passkeys (WebAuthn / FIDO2)"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: passkey
---

# Passkeys (WebAuthn / FIDO2)

> Passwordless authentication using public-key cryptography.

---

## What Are Passkeys?

| Aspect | Detail |
|--------|--------|
| Standard | WebAuthn (W3C) + FIDO2 (FIDO Alliance) |
| Mechanism | Public-key cryptography (device holds private key) |
| Phishing resistance | ✅ Origin-bound (can't be phished) |
| UX | Biometric (fingerprint, Face ID) or PIN |
| Syncing | iCloud Keychain, Google Password Manager, 1Password |

---

## Flow Overview

```
Registration:
1. Server sends challenge + user info
2. Browser calls navigator.credentials.create()
3. User authenticates locally (biometric/PIN)
4. Browser returns public key + signed challenge
5. Server stores public key

Authentication:
1. Server sends challenge + allowed credential IDs
2. Browser calls navigator.credentials.get()
3. User authenticates locally
4. Browser returns signed challenge
5. Server verifies signature with stored public key
```

---

## Server Implementation

### Using @simplewebauthn/server

```bash
npm install @simplewebauthn/server @simplewebauthn/browser
```

### Registration

```typescript
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

const rpName = 'Your App';
const rpID = 'example.com';
const origin = 'https://example.com';

// Step 1: Generate options
async function startRegistration(user: User) {
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: user.email,
    attestationType: 'none',     // Don't need hardware attestation
    authenticatorSelection: {
      residentKey: 'preferred',  // Discoverable credential (passkey)
      userVerification: 'required',
    },
    excludeCredentials: user.credentials.map(c => ({
      id: c.credentialId,
      type: 'public-key',
    })),
  });

  // Store challenge temporarily
  await redis.setex(`webauthn:${user.id}`, 300, options.challenge);

  return options;
}

// Step 2: Verify response
async function finishRegistration(user: User, response: RegistrationResponse) {
  const expectedChallenge = await redis.get(`webauthn:${user.id}`);

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (verification.verified && verification.registrationInfo) {
    const { credentialPublicKey, credentialID, counter } =
      verification.registrationInfo;

    // Store credential
    await db.credential.create({
      data: {
        userId: user.id,
        credentialId: Buffer.from(credentialID),
        publicKey: Buffer.from(credentialPublicKey),
        counter,
        deviceType: verification.registrationInfo.credentialDeviceType,
        backedUp: verification.registrationInfo.credentialBackedUp,
      },
    });
  }
}
```

### Authentication

```typescript
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

// Step 1: Generate challenge
async function startAuth(user?: User) {
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
    // If user known, limit to their credentials
    ...(user && {
      allowCredentials: user.credentials.map(c => ({
        id: c.credentialId,
        type: 'public-key',
      })),
    }),
  });

  await redis.setex(`webauthn:auth:${options.challenge}`, 300, '1');
  return options;
}

// Step 2: Verify
async function finishAuth(response: AuthenticationResponse) {
  const credential = await db.credential.findUnique({
    where: { credentialId: response.id },
    include: { user: true },
  });

  if (!credential) throw new Error('Credential not found');

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: storedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialPublicKey: credential.publicKey,
      credentialID: credential.credentialId,
      counter: credential.counter,
    },
  });

  if (verification.verified) {
    // Update counter (replay protection)
    await db.credential.update({
      where: { id: credential.id },
      data: { counter: verification.authenticationInfo.newCounter },
    });

    return credential.user;
  }
}
```

---

## Frontend (Browser)

```typescript
import {
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';

// Registration
const regOptions = await fetch('/api/auth/passkey/register').then(r => r.json());
const regResult = await startRegistration(regOptions);
await fetch('/api/auth/passkey/register/verify', {
  method: 'POST',
  body: JSON.stringify(regResult),
});

// Authentication
const authOptions = await fetch('/api/auth/passkey/login').then(r => r.json());
const authResult = await startAuthentication(authOptions);
await fetch('/api/auth/passkey/login/verify', {
  method: 'POST',
  body: JSON.stringify(authResult),
});
```

---

## Adoption Strategy

| Phase | Action |
|-------|--------|
| 1 | Offer passkey as optional MFA |
| 2 | Prompt existing users to add passkey |
| 3 | Allow passkey-only login (passwordless) |
| 4 | Keep password as fallback recovery |

---

## Browser Support (2025)

| Browser | Passkey Support |
|---------|-----------------|
| Chrome 108+ | ✅ Full |
| Safari 16+ | ✅ Full |
| Firefox 122+ | ✅ Full |
| Edge 108+ | ✅ Full |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [mfa.md](mfa.md) | MFA with passkeys as second factor |
| [oauth2.md](oauth2.md) | OAuth alternative to passkeys |
| [session.md](session.md) | Session after passkey auth |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

⚡ PikaKit v3.9.206
