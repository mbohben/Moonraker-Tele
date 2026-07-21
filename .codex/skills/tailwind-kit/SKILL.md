---
name: tailwind-kit
description: >-
  Tailwind CSS v4 utility classes, @theme configuration, responsive patterns, and v3→v4 migration.
  Use when styling with Tailwind, configuring themes, or writing utility-first CSS.
  NOT for design decisions (use design-system) or vanilla CSS projects.
metadata:
  author: pikakit
  version: "3.9.206"
  category: frontend-styling
  triggers: ["Tailwind", "CSS", "styling", "utility classes", "oklch"]
  coordinates_with: ["nextjs-pro", "design-system"]
  success_metrics: ["Component Consistency", "DOM Optimization", "Responsive Robustness"]
---

# Tailwind Kit — Tailwind CSS v4 Patterns

> CSS-first `@theme`. OKLCH colors. Container queries. Mobile-first responsive.

---

## 5 Must-Ask Questions (Socratic Gate)

| # | Question | Options |
|---|----------|---------|
| 1 | Project Stack? | Next.js / React+Vite / Angular / Vanilla HTML |
| 2 | Tailwind Version? | v4 / Migrating from v3 |
| 3 | Design System Context? | Strict / Loose / Arbitrary Values Allowed |
| 4 | Responsive Need? | Mobile-first / Desktop-heavy |
| 5 | Specific Component? | Button / Card / Input / Generic Layout |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Styling components | Use utility classes |
| Theme setup | CSS-first `@theme` |
| Dark mode | Use `dark:` prefix |
| Responsive | Mobile-first breakpoints |
| Migrating v3 → v4 | Check migration table |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Tailwind class recommendations | Design theory (→ design-system) |
| @theme configuration (OKLCH) | Next.js integration (→ nextjs-pro) |
| v3 → v4 migration paths | AI design (→ studio) |
| Layout + responsive patterns | CSS processing pipeline |

**Expert decision skill:** Produces class recommendations. Does not write files.

---

## v3 → v4 Migration (3 Breaking Changes)

| v3 (Legacy) | v4 (Current) |
|-------------|-------------|
| `tailwind.config.js` | CSS-based `@theme` |
| PostCSS plugin | Oxide engine (10× faster) |
| JIT mode | Native, always-on |

---

## Core Patterns (4 — Fixed)

### Theme (CSS-First)
```css
@theme {
  --color-primary: oklch(0.7 0.15 250);
  --color-surface: oklch(0.98 0 0);
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

### Responsive vs Container
| Prefix | Responds To |
|--------|-------------|
| `md:` | Viewport width |
| `@md:` | Parent container width |

### Dark Mode
```html
<div class="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
```

---

## Layout Patterns (4 — Deterministic)

| Pattern | Classes |
|---------|---------|
| Center both | `flex items-center justify-center` |
| Vertical stack | `flex flex-col gap-4` |
| Space between | `flex justify-between items-center` |
| Auto-fit grid | `grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]` |

---

## OKLCH Color System (3 Layers)

| Layer | Example | Purpose |
|-------|---------|---------|
| Primitive | `--blue-500` | Raw values |
| Semantic | `--color-primary` | Purpose-based |
| Component | `--button-bg` | Component-specific |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_LAYOUT` | Yes | Layout type not one of 4 |
| `ERR_UNKNOWN_COLOR_LAYER` | Yes | Color layer not one of 3 |
| `ERR_VERSION_MISMATCH` | Yes | Mixing v3 config with v4 |

**Zero internal retries.** Same use case = same class recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Arbitrary values everywhere | Use design system scale |
| `!important` | Fix specificity |
| Inline `style=` | Use utilities |
| Heavy `@apply` | Prefer components |
| Mix v3 config with v4 | Migrate fully |

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `css_class_recommended` | `{"component": "button", "pattern": "variants"}` | `INFO` |
| `layout_pattern_generated` | `{"type": "auto-grid", "responsive": true}` | `INFO` |
| `v3_v4_migration_started` | `{"legacy_theme_keys": 4}` | `INFO` |

All tailwind-kit outputs MUST emit `css_class_recommended` and `layout_pattern_generated` events when applicable.


## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [v4-config.md](rules/v4-config.md) | Full v4 configuration | New project setup |
| [responsive.md](rules/responsive.md) | Breakpoints + container queries | Responsive design |
| [components.md](rules/components.md) | Component extraction | Component patterns |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `design-system` | Skill | Design patterns |
| `nextjs-pro` | Skill | Next.js styling |
| `studio` | Skill | AI design |

---

⚡ PikaKit v3.9.206
