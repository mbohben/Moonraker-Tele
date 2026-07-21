---
name: anti-patterns
description: Quick-reference anti-pattern table for mobile development — performance, UX, security, architecture
title: "Mobile Anti-Patterns"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: anti, patterns
---

# Mobile Anti-Patterns

> 🚫 Common AI default tendencies that MUST be avoided!

## Performance Sins

| ❌ NEVER DO | Why It's Wrong | ✅ ALWAYS DO |
|-------------|----------------|--------------|
| ScrollView for long lists | Renders ALL items, memory explodes | Use `FlatList` / `FlashList` / `ListView.builder` |
| Inline renderItem function | New function every render | `useCallback` + `React.memo` |
| Missing keyExtractor | Index-based keys cause bugs | Unique, stable ID from data |
| Skip getItemLayout | Async layout = janky scroll | Provide when items have fixed height |
| setState() everywhere | Unnecessary widget rebuilds | Targeted state, `const` constructors |
| Native driver: false | Animations blocked by JS thread | `useNativeDriver: true` always |
| console.log in production | Blocks JS thread severely | Remove before release build |
| Skip React.memo/const | Every item re-renders | Memoize list items ALWAYS |

## Touch/UX Sins

| ❌ NEVER DO | Why It's Wrong | ✅ ALWAYS DO |
|-------------|----------------|--------------|
| Touch target < 44px | Impossible to tap accurately | Minimum 44pt (iOS) / 48dp (Android) |
| Spacing < 8px between targets | Accidental taps | Minimum 8-12px gap |
| Gesture-only interactions | Motor impaired users excluded | Always provide button alternative |
| No loading state | User thinks app crashed | ALWAYS show loading feedback |
| No error state | User stuck, no recovery path | Show error with retry option |
| No offline handling | Crash/block when network lost | Graceful degradation, cached data |
| Ignore platform conventions | Users confused | iOS feels iOS, Android feels Android |

## Security Sins

| ❌ NEVER DO | Why It's Wrong | ✅ ALWAYS DO |
|-------------|----------------|--------------|
| Token in AsyncStorage | Easily stolen on rooted device | `SecureStore` / `Keychain` / `EncryptedSharedPreferences` |
| Hardcode API keys | Reverse engineered from APK/IPA | Environment variables, secure storage |
| Skip SSL pinning | MITM attacks possible | Pin certificates in production |
| Log sensitive data | Logs can be extracted | Never log tokens, passwords, PII |

## Architecture Sins

| ❌ NEVER DO | Why It's Wrong | ✅ ALWAYS DO |
|-------------|----------------|--------------|
| Business logic in UI | Untestable, unmaintainable | Service layer separation |
| Global state for everything | Unnecessary re-renders | Local state default, lift when needed |
| Deep linking as afterthought | Notifications, shares broken | Plan deep links from day one |
| Skip dispose/cleanup | Memory leaks | Clean up subscriptions, timers |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [mobile-performance.md](mobile-performance.md) | Performance anti-pattern details |
| [mobile-debugging.md](mobile-debugging.md) | Debugging workflows |
| [decision-trees.md](decision-trees.md) | Correct patterns to use instead |
| [touch-psychology.md](touch-psychology.md) | Touch UX guidance |

---

⚡ PikaKit v3.9.206
