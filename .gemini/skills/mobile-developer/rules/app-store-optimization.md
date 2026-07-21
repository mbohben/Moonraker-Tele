---
name: app-store-optimization
description: ASO strategies for iOS App Store and Google Play Store — visibility, conversion, compliance, and automation
title: "App Store Optimization (ASO)"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: app, store, optimization
---

# App Store Optimization (ASO)

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

## Core ASO Elements

| Element | iOS App Store | Google Play |
|---------|---------------|-------------|
| **Title** | 30 chars | 30 chars |
| **Subtitle** | 30 chars | N/A |
| **Short Description** | N/A | 80 chars |
| **Promotional Text** | 170 chars (updateable without review) | N/A |
| **Keywords** | 100 chars (hidden) | Indexed from all text |
| **Description** | 4000 chars | 4000 chars |
| **Screenshots** | Up to 10 | Up to 8 |
| **Video** | 15-30 sec preview | Up to 30 sec |

---

## Keyword Strategy

### iOS Keyword Field (100 chars)

```
task,manager,todo,productivity,checklist,reminder,planner,organize,gtd
```

**Rules:**
- Comma-separated, no spaces
- No duplicates (including title words)
- Singular forms (plurals indexed automatically)
- No competitor names (rejected)

### Google Play (Text-Based)

Keywords indexed from (highest to lowest weight):
1. Title
2. Short description
3. Full description
4. Developer name

**Best Practice:** Repeat important keywords 3-5 times naturally in description.

---

## Promotional Text (iOS)

> 170 chars. Can be updated without app review — use for time-sensitive messaging.

| Use Case | Example |
|----------|---------|
| Feature launch | "🆕 Dark mode is here! Try it now" |
| Seasonal | "☀️ Summer sale — 50% off Pro" |
| Social proof | "⭐ #1 in Productivity — thank you!" |
| Re-engagement | "📱 New widgets for iOS 18" |

---

## Screenshots That Convert

### Formula: Benefit + Visual

```
❌ "Home Screen"
✅ "Track habits effortlessly"

❌ "Settings Page"
✅ "Customize your experience"
```

### Screenshot Order

| Position | Purpose |
|----------|---------|
| 1-2 | Hook (best features) |
| 3-4 | Social proof / differentiators |
| 5+ | Additional features |

### Dimensions

| Device | iOS | Android |
|--------|-----|---------|
| Phone | 1290 x 2796 (6.7") | 1080 x 1920 min |
| Tablet | 2048 x 2732 | 1200 x 1920 |

### Screenshot Automation (fastlane)

```bash
# iOS — fastlane snapshot
fastlane snapshot --devices "iPhone 15 Pro Max" --languages "en-US,ja"

# Android — fastlane screengrab
fastlane screengrab --app_package_name "com.example.myapp"
```

Config: `Snapfile` (iOS) / `Screengrabfile` (Android)

---

## In-App Events (iOS) & LiveOps (Android)

> Store-featured events that boost visibility and re-engagement.

| Platform | Feature | Duration | Use Case |
|----------|---------|----------|----------|
| iOS | In-App Events | 1-30 days | Challenges, new content, live events |
| Android | LiveOps | Custom | Sales, competitions, updates |

**Best practices:**
- Use event card image (1920×1080)
- Time-sensitive events get priority boost
- Link directly to relevant in-app screen

---

## Custom Product Pages (iOS) / Store Listing Experiments (Android)

| Platform | Feature | Limit |
|----------|---------|-------|
| iOS | Custom Product Pages | 35 pages |
| Android | Store Listing Experiments | A/B testing built-in |

**Use for:** Paid campaigns with audience-specific messaging. Each custom page can have unique screenshots, description, and promotional text.

```
Campaign A (Fitness audience) → Custom Page with health screenshots
Campaign B (Students)         → Custom Page with study features
```

---

## Conversion Rate Optimization

### Icon Best Practices

| Do | Don't |
|----|-------|
| Simple, bold design | Complex details |
| Stand out on white/dark | Blend with background |
| No text | Tiny unreadable text |
| Test with A/B | Assume first design works |

### A/B Testing (Google Play Experiments)

Test these in order:
1. Icon (highest impact)
2. Screenshots
3. Short description
4. Feature graphic

---

## Ratings & Reviews

### Prompting Strategy

```
WHEN to ask for rating:
✅ After successful task completion
✅ After 3+ sessions
✅ After "happy moment" (achievement, level up)

WHEN NOT to ask:
❌ During onboarding
❌ After error/crash
❌ Too frequently (Apple rejects)
```

### iOS (SwiftUI — iOS 16+)

```swift
import StoreKit

// SwiftUI
@Environment(\.requestReview) private var requestReview

Button("Rate Us") {
    requestReview()
}

// UIKit fallback
if let scene = UIApplication.shared.connectedScenes
    .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene {
    SKStoreReviewController.requestReview(in: scene)
}
```

### Responding to Reviews

| Rating | Response Strategy |
|--------|-------------------|
| 1-2 ⭐ | Apologize, offer support, request update |
| 3 ⭐ | Thank, ask what would make it 5-star |
| 4-5 ⭐ | Thank, mention new features coming |

---

## Localization Impact

| Region | Potential Increase |
|--------|-------------------|
| Top 10 languages | +40-80% downloads |
| Localized screenshots | +25% conversion |
| Localized keywords | +15% visibility |

**Priority Languages:**
English (US+UK), Spanish, Portuguese (Brazil), German, French, Japanese, Korean, Chinese (Simplified)

---

## Privacy & Compliance

| Requirement | iOS | Android |
|-------------|-----|---------|
| **Privacy labels** | App Privacy section (required) | Data Safety section (required) |
| **ATT prompt** | `ATTrackingManager.requestTrackingAuthorization` | N/A |
| **GDPR** | Consent before analytics/ads | Consent before analytics/ads |
| **COPPA** | If targeting <13, declare in App Store Connect | Declare in Play Console |
| **Review guidelines** | [Apple Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) | [Google Play Policy](https://play.google.com/about/developer-content-policy/) |

### Common Rejection Reasons (iOS)

| Reason | Fix |
|--------|-----|
| 2.1 — App Completeness | No placeholder content, all links working |
| 2.3 — Accurate Metadata | Screenshots match actual app |
| 4.0 — Design | Follow HIG, no web-view-only apps |
| 5.1.1 — Data Collection | Complete privacy labels |
| 5.1.2 — Data Use | Request only necessary permissions |

---

## Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| Impression to Page View | > 8% | Store Console |
| Page View to Install | > 25% | Store Console |
| Keyword Rankings | Top 10 | Sensor Tower / AppTweak |
| Organic vs Paid | > 60% organic | Store Console |
| Day 1 retention | > 25% | Firebase / Adjust |

---

## Metadata Automation (fastlane deliver)

```bash
# Upload metadata to App Store
fastlane deliver --skip_binary_upload --skip_screenshots

# Upload metadata to Play Store
fastlane supply --skip_upload_apk --skip_upload_aab
```

Directory structure:
```
fastlane/metadata/
├── en-US/
│   ├── title.txt
│   ├── subtitle.txt
│   ├── description.txt
│   ├── keywords.txt
│   ├── promotional_text.txt
│   └── release_notes.txt
├── ja/
│   └── ...
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Keywords not ranking | Low installs for term | Target less competitive keywords |
| Conversion dropped | Screenshots outdated | Update with current UI |
| App rejected | Metadata mismatch | Screenshots must match build |
| Rating dropping | Bug in recent release | Hotfix + respond to reviews |
| Not appearing in search | Title too generic | Add category keyword to title |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Generic title | Include category + keyword |
| No keywords in first 3 lines | Front-load important terms |
| Outdated screenshots | Update with each major release |
| Ignoring bad reviews | Respond within 24 hours |
| Skip Promotional Text | Update for every campaign |
| Ignore privacy labels | Audit quarterly |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [deep-linking.md](deep-linking.md) | Store listing → app screen routing |
| [push-notifications.md](push-notifications.md) | Re-engagement after install |
| [../frameworks/react-native.md](../frameworks/react-native.md) | RN build & EAS Submit |
| [../frameworks/flutter.md](../frameworks/flutter.md) | Flutter build & Fastlane |
| [../frameworks/native.md](../frameworks/native.md) | Native build & Xcode Cloud |

---

⚡ PikaKit v3.9.206
