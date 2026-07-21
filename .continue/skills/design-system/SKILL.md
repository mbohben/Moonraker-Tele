---
name: design-system
description: >-
  Design thinking for web UI: color theory, typography, visual effects, UX psychology, and animation.
  Use when choosing colors, fonts, layouts, or validating UX decisions.
  NOT for CSS implementation (use tailwind-kit) or code architecture (use react-pro).
metadata:
  author: pikakit
  version: "3.9.206"
  category: design-architecture
  triggers: ["design", "UI", "UX", "color palette", "typography", "component design"]
  coordinates_with: ["studio", "tailwind-kit"]
  success_metrics: ["0 WCAG accessibility violations", "100% Hick's law compliance"]
---

# Design System — UI Design Decisions

> Every pixel has purpose. Restraint is luxury. User psychology drives decisions.

---

## 5 Must-Ask Questions (Socratic Gate)

| # | Question | Options |
|---|----------|---------|
| 1 | Project Type? | SaaS / E-commerce / Portfolio / Dashboard |
| 2 | Brand Mood? | Professional / Playful / Luxury / Minimal |
| 3 | Light or Dark Mode? | Light / Dark / Both / User preference |
| 4 | Target Audience? | Enterprise / Consumer / Developer / Creative |
| 5 | Component Scope? | Full system / Color only / Typography only |

---

## Prerequisites

**Required:** None — Design System is a knowledge-based skill with no external dependencies.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Color selection | Invoke color-palette; read `rules/color-system.md` |
| Typography | Invoke typography-system; read `rules/typography-system.md` |
| Visual effects | Invoke visual-effect; read `rules/visual-effects.md` |
| Animation/motion | Invoke animation-select; read `rules/animation-guide.md` |
| UX validation | Invoke ux-audit; read `rules/ux-psychology.md` |
| Design decisions | Read `rules/decision-trees.md` |
| Architecture review | Read `rules/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Color theory (3 harmony types + semantic palette) | CSS/Tailwind generation (→ tailwind-kit) |
| Typography system (max 2 families, modular scale) | AI style recommendations (→ studio) |
| Visual effects selection criteria | Component implementation |
| Animation principles (3 functional categories) | WCAG accessibility (→ web-design-guidelines) |
| UX psychology audit (Hick's, Fitts's, Gestalt) | Image/asset generation (→ ai-artist) |
| 3 design anti-pattern bans | Frontend code architecture (→ frontend-design) |

**Pure decision skill:** Produces design specifications. Zero side effects (except UX audit script reads files).

---

## ⚠️ Anti-Pattern Bans (Enforced on ALL Outputs)

| # | Ban | Reason |
|---|-----|--------|
| 1 | **Purple Ban** | Do not use generic purple themes (AI-generated cliché) |
| 2 | **Bento Ban** | Do not default to Bento grids without explicit justification |
| 3 | **Dark Mode Default** | Do not assume dark mode unless `dark_mode_requested = true` |

---

## Color System (Quick Reference)

| Project + Mood | Harmony |
|---------------|---------|
| Professional / Corporate | Complementary |
| Creative / Playful | Triadic |
| Minimal / Luxury | Analogous |

Every palette includes: primary, secondary, accent, 5 neutrals, 4 semantic (success/warning/error/info).

---

## Typography Rules

| Rule | Constraint |
|------|-----------|
| Max font families | 2 (heading + body) |
| Scale | Modular ratio (1.25 or 1.333) |
| Line height | 1.4–1.6 for body text |

---

## Animation Categories

| Category | Purpose | Duration |
|----------|---------|----------|
| **Feedback** | Confirm user action | 100–200ms |
| **Orientation** | Guide spatial awareness | 200–400ms |
| **Continuity** | Connect state transitions | 300–500ms |

Every animation must serve one of these 3 functions. Decorative-only motion is not allowed.

---

## Studio Integration

```bash
# Generate complete design system

# Search specific domain
```

**Available domains:** style, color, typography, landing, ux, chart, product

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_PROJECT_TYPE` | Yes | Project type not provided |
| `ERR_MISSING_BRAND_MOOD` | Yes | Brand mood not provided |
| `ERR_RULE_NOT_FOUND` | No | Rule file missing |
| `WARN_ANTI_PATTERN` | Yes | Purple/bento/dark mode ban violated |
| `WARN_UX_VIOLATION` | Yes | UX psychology law violated |

**Zero internal retries.** Deterministic; same context = same design.

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [ux-psychology.md](rules/ux-psychology.md) | 🔴 **REQUIRED** — Core UX psychology laws | Always |
| [color-system.md](rules/color-system.md) | Color theory and palette selection | Color decisions |
| [typography-system.md](rules/typography-system.md) | Font pairing and scale | Typography |
| [visual-effects.md](rules/visual-effects.md) | Shadows, gradients, glassmorphism | Effects selection |
| [animation-guide.md](rules/animation-guide.md) | Motion principles | Animation |
| [motion-graphics.md](rules/motion-graphics.md) | Advanced motion (Lottie, 3D) | Complex animation |
| [decision-trees.md](rules/decision-trees.md) | Design decision framework | All decisions |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

| Script | Purpose |
|--------|---------|

**Selective reading:** Read ONLY files relevant to the request.

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `palette_generated` | `{"harmony": "complementary", "brand_mood": "professional"}` | `INFO` |
| `typography_selected` | `{"heading_font": "Inter", "scale_ratio": 1.25}` | `INFO` |
| `ux_audit_completed` | `{"violations": 0, "laws_checked": ["Hicks", "Fitts"]}` | `INFO` |

All design-system outputs MUST emit `palette_generated`, `typography_selected`, or `ux_audit_completed` events when applicable.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `studio` | Skill | AI-powered design recommendations |
| `tailwind-kit` | Skill | CSS/Tailwind implementation |
| `frontend-design` | Skill | Frontend code architecture |
| `/studio` | Workflow | Comprehensive design workflow |

---

⚡ PikaKit v3.9.206
