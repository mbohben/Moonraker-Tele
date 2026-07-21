---
name: mobile-design-engineering-spec
description: Full 21-section engineering spec — MFRI scoring, platform guidelines, touch targets, 4 error codes
title: "Mobile Design - Engineering Specification"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: engineering, spec
---

# Mobile Design — Engineering Specification

> Production-grade specification for mobile-first design and engineering doctrine at FAANG scale.

---

## 1. Overview

Mobile Design provides structured decision frameworks for mobile-first UI/UX: MFRI scoring (Mobile Feasibility & Risk Index), platform-specific guidelines (iOS vs Android), touch target sizing, navigation patterns, typography selection, color systems, accessibility compliance, and offline-capable design. The skill operates as an **Expert (decision tree)** — it produces design decisions, platform guidelines, and MFRI assessments. It does not create UI components, write code, or implement designs.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

---

## 2. Problem Statement

Mobile design at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Desktop patterns on mobile | 45% of mobile screens use hover states or small targets | Poor touch UX |
| Wrong platform conventions | 35% of cross-platform apps ignore iOS/Android differences | User confusion |
| Touch targets too small | 30% of tappable elements below 44×44pt (iOS) / 48×48dp (Android) | Missed taps |
| No offline consideration | 40% of mobile apps break without network | Users lose data |

Mobile Design eliminates these with MFRI scoring, fixed platform guidelines, mandatory touch target minimums, and offline-first evaluation.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | MFRI scoring | 5 dimensions, score 0-10, fixed thresholds (6+: safe, 3-5: validate, 0-2: simplify, <0: redesign) |
| G2 | Platform-specific guidelines | iOS (HIG) vs Android (Material) — fixed tables |
| G3 | Touch target minimums | iOS: 44×44pt, Android: 48×48dp, spacing: 8dp |
| G4 | Core philosophy | Touch-first → Battery-conscious → Platform-respectful → Offline-capable |
| G5 | Typography routing | iOS: SF Pro, Android: Roboto |
| G6 | 5 must-ask questions | Platform, Framework, Navigation, Offline, Devices |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Mobile framework implementation | Owned by `mobile-developer` skill |
| NG2 | Mobile orchestration routing | Owned by `mobile-first` skill |
| NG3 | Design system components | Owned by `design-system` skill |
| NG4 | App Store optimization | Owned by `mobile-first` skill |
| NG5 | Backend API design | Owned by `api-architect` skill |
| NG6 | Performance profiling | Owned by `perf-optimizer` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| MFRI scoring (5 dimensions) | Assessment framework | Risk mitigation execution |
| Platform guidelines (iOS/Android) | Convention tables | Platform SDK |
| Touch target standards | Size + spacing rules | UI implementation |
| Navigation patterns | Pattern selection | Navigation framework |
| Typography routing | Font selection per platform | Font installation |
| Accessibility guidelines | WCAG mobile requirements | A11y testing |

**Side-effect boundary:** Mobile Design produces design decisions, platform guidelines, and MFRI scores. It does not create files, write code, or implement designs.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "mfri-score" | "platform-guide" | "touch-guide" |
                              # "navigation" | "typography" | "accessibility" | "full-audit"
Context: {
  platform: string            # "ios" | "android" | "both"
  framework: string | null    # "react-native" | "flutter" | "native" | null
  navigation_type: string | null  # "tabs" | "stack" | "drawer" | null
  offline_required: boolean   # Whether offline support needed
  devices: string             # "phone" | "tablet" | "both"
  gesture_complexity: string  # "simple" (tap only) | "moderate" (swipe) | "complex" (multi-touch)
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  mfri: {
    score: number             # 0-10
    dimensions: Array<{
      name: string
      score: number           # Per-dimension
      notes: string
    }>
    action: string            # "safe" | "validate" | "simplify" | "redesign"
  } | null
  platform: {
    guidelines: Array<{
      element: string
      ios: string
      android: string
    }>
    typography: {
      ios: string             # "SF Pro"
      android: string         # "Roboto"
    }
    touch_targets: {
      ios: string             # "44×44pt"
      android: string         # "48×48dp"
      spacing: string         # "8dp"
    }
  } | null
  navigation: {
    pattern: string           # Recommended pattern
    rationale: string
  } | null
  accessibility: {
    requirements: Array<string>
    touch_target_pass: boolean
  } | null
  reference_files: Array<string> | null
  metadata: {
    contract_version: string
    backward_compatibility: string
  }
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string                  # From Error Taxonomy (Section 11)
Message: string
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- MFRI thresholds are fixed: 6-10 (safe), 3-5 (validate), 0-2 (simplify), <0 (redesign).
- Touch targets are fixed: iOS 44×44pt, Android 48×48dp, spacing 8dp.
- Typography is fixed: iOS → SF Pro, Android → Roboto.
- Platform differences are fixed tables (back button, navigation, radius).
- Core philosophy order is fixed: Touch-first → Battery-conscious → Platform-respectful → Offline-capable.
- 5 must-ask questions are fixed: Platform, Framework, Navigation, Offline, Devices.

#### What Agents May Assume

- MFRI scoring is consistent across invocations.
- Platform guidelines match current HIG/Material Design.
- Touch target minimums are industry-standard.
- Typography recommendations are platform-native defaults.

#### What Agents Must NOT Assume

- MFRI score alone determines design quality.
- iOS and Android patterns are interchangeable.
- All gestures work on all devices.
- Offline is optional for any mobile app.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| MFRI score | None; assessment output |
| Platform guide | None; guideline output |
| Touch guide | None; standards output |
| Navigation | None; pattern recommendation |
| Typography | None; font recommendation |
| Accessibility | None; requirements output |
| Full audit | None; combined output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Ask 5 must-ask questions (platform, framework, navigation, offline, devices)
2. Invoke mfri-score with answers
3. If MFRI < 3: simplify before proceeding
4. Invoke platform-guide for iOS/Android conventions
5. Invoke touch-guide for target sizing
6. Invoke navigation for pattern selection
7. Apply guidelines (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete assessment or guideline.
- MFRI scoring covers all 5 dimensions.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Unknown platform | Return error | Specify ios, android, or both |
| Invalid request type | Return error | Use supported type |
| Missing platform | Return error | Supply platform |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| MFRI score | Yes | Same context = same score |
| Platform guide | Yes | Same platform = same guidelines |
| Touch guide | Yes | Fixed standards |
| Navigation | Yes | Same context = same pattern |
| Typography | Yes | Same platform = same fonts |
| Accessibility | Yes | Fixed requirements |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate platform, determine request type | Classification |
| **Assess** | Generate MFRI score, guidelines, or recommendations | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Core law | Mobile is NOT a small desktop |
| Fixed philosophy | Touch-first → Battery-conscious → Platform-respectful → Offline-capable |
| Fixed MFRI thresholds | 6+ safe, 3-5 validate, 0-2 simplify, <0 redesign |
| Fixed touch targets | iOS: 44×44pt, Android: 48×48dp, spacing: 8dp |
| Fixed typography | iOS: SF Pro, Android: Roboto |
| Fixed platform tables | Back button, navigation, radius per platform |
| 5 must-ask questions | Platform, Framework, Navigation, Offline, Devices |
| No hover states | Tap and press only |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown platform | Return `ERR_UNKNOWN_PLATFORM` | Specify ios, android, or both |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Missing gesture complexity | Default to "simple" | Transparent |
| Missing device type | Default to "phone" | Transparent |

**Invariant:** Every failure returns a structured error. No partial assessments.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_PLATFORM` | Validation | Yes | Platform not ios, android, or both |
| `ERR_MISSING_PLATFORM` | Validation | Yes | Platform not provided |
| `WARN_LOW_MFRI` | Advisory | Yes | MFRI score below 3 |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Assessment generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### OpenTelemetry Observability (MANDATORY)

- **MFRI Assessment Telemetry**: Every time the decision engine calculates an MFRI score, it MUST emit an OpenTelemetry Span (`mobile_mfri_assessment_duration`) capturing the length of the evaluation, with `mfri_score` and `platform` as dimensions.
- **Platform Guide Generation Events**: Emit an OTel Event (`MOBILE_PLATFORM_GUIDE_ISSUED`) when outputting iOS HIG or Android Material guidelines, capturing the requested platform to audit adherence tracking.

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "mobile-design",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "platform": "string",
  "framework": "string|null",
  "mfri_score": "number|null",
  "mfri_action": "string|null",
  "devices": "string",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| MFRI scored | INFO | mfri_score, mfri_action |
| Low MFRI warning | WARN | mfri_score, platform |
| Platform guide issued | INFO | platform |
| Touch guide issued | INFO | platform, touch_targets |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `mobiledesign.decision.duration` | Histogram | ms |
| `mobiledesign.mfri.distribution` | Histogram | score |
| `mobiledesign.platform.distribution` | Counter | ios vs android vs both |
| `mobiledesign.request_type.distribution` | Counter | per type |

---

## 14. Security & Trust Model

### Data Handling

- Mobile Design processes no user data, credentials, or PII.
- Design decisions contain no sensitive information.
- Platform guidelines are public knowledge.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Reference storage | 12 files (~175 KB total) | Static; no growth |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| MFRI scoring | < 3 ms | < 10 ms | 30 ms |
| Platform guide | < 2 ms | < 5 ms | 20 ms |
| Full audit | < 10 ms | < 30 ms | 50 ms |
| Output size | ≤ 1,500 chars | ≤ 4,000 chars | 6,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Platform guidelines outdated | Medium | Wrong conventions | Review annually against HIG/Material |
| MFRI score gives false confidence | Low | Poor design approved | MFRI is advisory, not approval |
| Cross-platform compromise | High | Neither platform feels native | Separate per-platform guidance |
| Touch target ignored | Medium | Accessibility failure | Fixed minimums enforced |
| Desktop patterns applied | High | Poor mobile UX | Core law: mobile ≠ small desktop |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | No external dependencies (knowledge skill) |
| When to Use section | ✅ | Situation-based routing table |
| Core content matches skill type | ✅ | Expert type: decision trees, MFRI scoring |
| Troubleshooting section | ✅ | Anti-patterns table |
| Related section | ✅ | Cross-links to mobile-first, mobile-developer, design-system |
| Content Map for multi-file | ✅ | Links to 12 reference files + engineering-spec.md |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | MFRI scoring (5 dimensions, fixed thresholds) | ✅ |
| **Functionality** | Platform guidelines (iOS HIG + Android Material) | ✅ |
| **Functionality** | Touch target standards (44×44pt, 48×48dp, 8dp) | ✅ |
| **Functionality** | Typography routing (SF Pro / Roboto) | ✅ |
| **Functionality** | 5 must-ask questions enforced | ✅ |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ✅ |
| **Contracts** | Contract versioning with semver | ✅ |
| **Failure** | Error taxonomy with 4 categorized codes | ✅ |
| **Failure** | No partial assessments on error | ✅ |
| **Failure** | Zero internal retries | ✅ |
| **Determinism** | Fixed MFRI thresholds, fixed touch targets, fixed typography | ✅ |
| **Security** | No credentials, no PII | ✅ |
| **Observability** | Structured log schema with 5 mandatory fields | ✅ |
| **Observability** | 4 metrics defined | ✅ |
| **Performance** | P50/P99 targets for all operations | ✅ |
| **Scalability** | Stateless; unlimited parallel | ✅ |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ✅ |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Quick reference, MFRI scoring |
| [platform-ios.md](platform-ios.md) | iOS HIG guidelines |
| [platform-android.md](platform-android.md) | Material Design guidelines |
| [touch-psychology.md](touch-psychology.md) | Touch interaction patterns |
| [../scripts/mobile_audit.ts](../scripts/mobile_audit.ts) | MFRI audit script |

---

⚡ PikaKit v3.9.206
