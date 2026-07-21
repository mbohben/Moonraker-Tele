---
name: mobile-developer
description: >-
  Mobile development with React Native, Flutter, or native iOS/Android.
  Use when building mobile apps, configuring native modules, or optimizing mobile performance.
  NOT for web frontend (use react-pro) or mobile design decisions (use mobile-design).
metadata:
  author: pikakit
  version: "3.9.206"
  category: mobile-architect
  triggers: ["React Native", "Flutter", "iOS", "Android", "mobile app", "cross-platform", "native app"]
  coordinates_with: ["mobile-design", "test-architect", "perf-optimizer", "code-craft", "problem-checker"]
  success_metrics: ["100% Build Pass", "0 IDE/Lint Errors", "OWASP MASVS Compliant"]
---

# Mobile Developer — Cross-Platform & Native Expert

> 4 frameworks. 4 architectures. 4 test levels. 6 security items. 60fps target.

---

## 5 Must-Ask Questions (Before Any Development)

| # | Question | Options |
|---|----------|---------|
| 1 | Platform? | iOS, Android, or both |
| 2 | Framework? | React Native, Flutter, native |
| 3 | Navigation? | Tabs, stack, drawer |
| 4 | Offline? | Must work offline? |
| 5 | Devices? | Phone only or tablet too |

---

## When to Use

| Situation | Action |
|-----------|--------|
| Choose mobile framework | Framework selection tree |
| Design app architecture | Architecture routing |
| Plan testing strategy | 4-level test plan |
| Security compliance | OWASP MASVS checklist |
| Store submission | ASO checklist |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Framework selection (4 options) | Mobile design (→ mobile-design) |
| Architecture routing (4 patterns) | Mobile orchestration (→ mobile-first) |
| Testing strategy (4 levels) | Security code review (→ mobile-security-coder) |
| Security checklist (6 items) | Performance profiling (→ perf-optimizer) |

**Expert decision skill:** Produces recommendations and checklists. Does not write code.

---

## Framework Selection (Deterministic)

| Need | Framework |
|------|-----------|
| OTA updates, rapid iteration | **React Native + Expo** |
| Pixel-perfect custom UI | **Flutter** |
| Deep iOS platform features | **SwiftUI** |
| Deep Android platform features | **Kotlin + Compose** |
| Cross-platform, no special needs | **React Native + Expo** (default) |

---

## Architecture Routing (Deterministic)

| Context | Pattern |
|---------|---------|
| Complex app + large team (6+) | **Clean Architecture** |
| UI-driven app, moderate complexity | **MVVM** |
| Complex state management | **BLoC / Redux** |
| Data abstraction needed | **Repository** |

---

## Performance Targets (Fixed)

| Target | Value |
|--------|-------|
| Animation framerate | 60fps |
| App startup (cold) | < 2,000 ms |
| List rendering | Virtualized (FlatList / ListView) |
| Memory leaks | Zero (enforce cleanup) |

---

## Platform Services

| Service | Technologies |
|---------|-------------|
| Push | FCM, APNs |
| Auth | OAuth, Biometric, Social |
| Payments | Stripe, Apple Pay, Google Pay |
| Maps | Google Maps, Apple MapKit |
| Analytics | Firebase, Sentry |

---

## Testing Strategy (4 Levels)

| Level | Tools |
|-------|-------|
| Unit | Jest, Dart test, XCTest |
| Component | React Native Testing Library |
| E2E | Detox, Maestro, Patrol |
| Device | Firebase Test Lab, Bitrise |

---

## Security Checklist (OWASP MASVS — 6 Items)

- [ ] OWASP MASVS compliance
- [ ] Certificate pinning
- [ ] Biometric authentication
- [ ] Secure storage (Keychain/Keystore)
- [ ] Code obfuscation (ProGuard/R8)
- [ ] GDPR/privacy compliance

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `build_verification` | `{"framework": "...", "platform": "...", "status": "pass/fail"}` | `INFO` |
| `architecture_decision` | `{"state_management": "...", "storage": "..."}` | `INFO` |
| `security_audit` | `{"masvs_compliant": true, "token_storage": "SecureStore"}` | `INFO` |

All executions MUST emit the `build_verification` span before reporting completion.

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_PLATFORM` | Yes | Platform not ios/android/both |
| `ERR_MISSING_PLATFORM` | Yes | Platform not provided |
| `WARN_CONFLICT` | Yes | Conflicting requirements |

**Zero internal retries.** Deterministic; same context = same recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Pick framework without criteria | Use framework selection tree |
| Skip architecture for "simple" apps | At minimum use Repository pattern |
| Assume network availability | Design offline-first |
| Skip security for MVP | OWASP MASVS from day 1 |
| Test only on simulator | Include real device testing |
| Ignore IDE errors without fixing | Call `problem-checker` to auto-fix |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| iOS build fails | `pod install --repo-update` |
| Android Gradle error | Check Gradle version, sync project |
| Hot reload broken | Restart Metro/Flutter, clear cache |
| Native module linking | `npx react-native link` or `flutter pub get` |
| App store rejection | Check guidelines, test on real devices |


## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `mobile-first` | Skill | Mobile orchestrator |
| `mobile-design` | Skill | Design patterns |
| `mobile-security-coder` | Skill | Security implementation |

---

⚡ PikaKit v3.9.206
