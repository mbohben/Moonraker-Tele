# tailwind-kit

**Version 1.0.0**
Engineering
March 2026

> **Note:**
> This document is for agents and LLMs to follow when working on tailwind-kit domain.
> Optimized for automation and consistency by AI-assisted workflows.

---

# Tailwind Kit � Tailwind CSS v4 Patterns

> CSS-first `@theme`. OKLCH colors. Container queries. Mobile-first responsive.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Styling components | Use utility classes |
| Theme setup | CSS-first `@theme` |
| Dark mode | Use `dark:` prefix |
| Responsive | Mobile-first breakpoints |
| Migrating v3 ? v4 | Check migration table |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Tailwind class recommendations | Design theory (? design-system) |
| @theme configuration (OKLCH) | Next.js integration (? nextjs-pro) |
| v3 ? v4 migration paths | AI design (? studio) |
| Layout + responsive patterns | CSS processing pipeline |

**Expert decision skill:** Produces class recommendations. Does not write files.

---

## v3 ? v4 Migration (3 Breaking Changes)

| v3 (Legacy) | v4 (Current) |
|-------------|-------------|
| `tailwind.config.js` | CSS-based `@theme` |
| PostCSS plugin | Oxide engine (10� faster) |
| JIT mode | Native, always-on |

---

## Core Patterns (4 � Fixed)

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

## Layout Patterns (4 � Deterministic)

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

| ? Don't | ? Do |
|---------|-------|
| Arbitrary values everywhere | Use design system scale |
| `!important` | Fix specificity |
| Inline `style=` | Use utilities |
| Heavy `@apply` | Prefer components |
| Mix v3 config with v4 | Migrate fully |

---

## ?? Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [v4-config.md](rules/v4-config.md) | Full v4 configuration | New project setup |
| [responsive.md](rules/responsive.md) | Breakpoints + container queries | Responsive design |
| [components.md](rules/components.md) | Component extraction | Component patterns |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## ?? Related

| Item | Type | Purpose |
|------|------|---------|
| `design-system` | Skill | Design patterns |
| `nextjs-pro` | Skill | Next.js styling |
| `studio` | Skill | AI design |

---



---

## Detailed Rules


---

### Rule: components

---
name: components
description: Tailwind CSS v4 component patterns � cva variants, cn() utility, Button/Card/Input extraction, class ordering, TypeScript props
---

# Component Extraction

> React components first. @apply only for truly static patterns. Use cva for variants.

---

## When to Extract

| Signal | Action |
|--------|--------|
| Same class combo 3+ times | Extract component |
| Complex state variants | Use `cva` for variant map |
| Design system element | Extract + document + type |

---

## cn() Utility (Essential)

```typescript
// lib/utils.ts � merge Tailwind classes safely
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage � last class wins, no conflicts
cn('px-4 py-2', 'px-6')        // ? 'py-2 px-6'
cn('text-red-500', false && 'hidden')  // ? 'text-red-500'
```

---

## Button (cva + TypeScript)

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base classes (always applied)
  'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:   'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-surface border border-zinc-200 hover:bg-zinc-50',
        ghost:     'hover:bg-zinc-100 dark:hover:bg-zinc-800',
        danger:    'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}

// Usage
<Button variant="primary" size="lg">Save</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger" disabled>Delete</Button>
```

---

## Card

```tsx
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 bg-white shadow-sm',
        'dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn('p-6 pb-0', className)} {...props} />
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('p-6', className)} {...props} />
}

// Usage
<Card>
  <CardHeader><h3>Title</h3></CardHeader>
  <CardContent><p>Content</p></CardContent>
</Card>
```

---

## Input

```tsx
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'h-10 w-full rounded-md border px-3 text-sm',
          'bg-white dark:bg-zinc-950',
          'border-zinc-200 dark:border-zinc-800',
          'placeholder:text-zinc-400',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500/50',
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// Usage
<Input label="Email" type="email" placeholder="you@example.com" />
<Input label="Password" error="Required" />
```

---

## @apply (Static Only � Use Sparingly)

```css
/* Only for patterns that never need props or state */
.prose-content h2 {
  @apply text-2xl font-bold mt-8 mb-4 text-zinc-900 dark:text-white;
}

.prose-content p {
  @apply text-base leading-relaxed text-zinc-600 dark:text-zinc-400;
}
```

> ?? **Avoid heavy @apply.** If it needs variants, props, or state ? use React component + cva.

---

## Class Ordering Convention

```html
<div class="
  /* 1. Layout */     flex items-center justify-between
  /* 2. Sizing */     w-full h-12
  /* 3. Spacing */    px-4 py-2 gap-4
  /* 4. Typography */ text-sm font-medium
  /* 5. Colors */     bg-white text-zinc-900
  /* 6. Borders */    border border-zinc-200 rounded-lg
  /* 7. Effects */    shadow-sm
  /* 8. Transitions */transition-all duration-200
  /* 9. States */     hover:bg-zinc-50 focus:ring-2
  /* 10. Dark */      dark:bg-zinc-900 dark:text-white
  /* 11. Responsive */md:flex-row md:text-base
">
```

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|-------|
| String concat for variants | `cva` + variant map |
| `className={condition ? 'a' : 'b'}` | `cn()` with conditional |
| Heavy @apply for everything | React component + cva |
| Skip TypeScript on props | Type all component props |
| Duplicate class sets | Extract shared component |

---

## ?? Related

| File | When to Read |
|------|-------------|
| [responsive.md](responsive.md) | Responsive patterns |
| [v4-config.md](v4-config.md) | @theme setup |
| [SKILL.md](../SKILL.md) | Patterns overview |

---

### Rule: engineering-spec

---
title: Tailwind Kit � Engineering Specification
impact: MEDIUM
tags: tailwind-kit
---

# Tailwind Kit � Engineering Specification

> Production-grade specification for Tailwind CSS v4 patterns at FAANG scale.

---

## 1. Overview

Tailwind Kit provides structured guidance for Tailwind CSS v4: CSS-first configuration (`@theme` directive), v3?v4 migration (3 breaking changes), core patterns (theme, container queries, dark mode, responsive), layout patterns (4: center, vertical stack, space between, auto-fit grid), OKLCH color system (3 layers: primitive, semantic, component), typography scale (5 sizes), animation classes (4), and anti-patterns (5). The skill operates as an **Expert (decision tree)** � it produces Tailwind class recommendations, configuration guidance, and migration paths. It does not write CSS files, install packages, or modify codebases.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Tailwind CSS usage at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| v3 config in v4 project | 40% of projects still use tailwind.config.js | Build failures |
| Arbitrary values overuse | 35% of utility classes use arbitrary `[...]` | No design consistency |
| Viewport vs container confusion | 45% mix `md:` (viewport) with `@md:` (container) | Wrong responsive behavior |
| Missing dark mode | 30% of projects skip dark mode preparation | Rework when adding dark |

Tailwind Kit eliminates these with CSS-first `@theme` configuration, design system scale enforcement, explicit viewport vs container query routing, and dark mode patterns.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | CSS-first configuration | `@theme` directive with OKLCH colors |
| G2 | v3 ? v4 migration | 3 breaking changes documented |
| G3 | Core patterns | 4 patterns: theme, container queries, dark mode, responsive |
| G4 | Layout patterns | 4 composable layouts |
| G5 | Color system | 3 layers: primitive, semantic, component |
| G6 | Typography | 5 size levels |
| G7 | Anti-patterns | 5 avoidance rules |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Design system theory | Owned by `design-system` skill |
| NG2 | Next.js integration | Owned by `nextjs-pro` skill |
| NG3 | AI design intelligence | Owned by `studio` skill |
| NG4 | CSS specification | Tailwind-specific only |
| NG5 | Package installation | Runtime concern |
| NG6 | Build pipeline configuration | Tooling concern |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| @theme configuration | CSS-first setup with OKLCH | CSS processing |
| Utility class guidance | Class selection by pattern | DOM manipulation |
| v3 ? v4 migration | 3 breaking changes | Automated migration |
| Layout patterns | 4 composable flex/grid layouts | Component implementation |
| Color system | 3-layer token architecture | Color generation |

**Side-effect boundary:** Tailwind Kit produces class recommendations, configuration guidance, and migration paths. It does not write files, install packages, or modify projects.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "pattern" | "layout" | "color" | "typography" |
                              # "animation" | "dark-mode" | "responsive" |
                              # "migration" | "config" | "full-guide"
Context: {
  tailwind_version: string | null  # "v3" | "v4"
  use_case: string | null    # "theme" | "container-query" | "dark-mode" | "responsive"
  layout_type: string | null # "center" | "vertical-stack" | "space-between" | "auto-grid"
  color_layer: string | null # "primitive" | "semantic" | "component"
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  pattern: {
    name: string
    classes: string           # Tailwind utility classes
    html_example: string | null
    css_example: string | null
  } | null
  layout: {
    type: string
    classes: string
    html_example: string
  } | null
  color: {
    layer: string
    tokens: Array<{
      name: string
      value: string           # OKLCH value
      purpose: string
    }>
  } | null
  migration: {
    from: string
    to: string
    changes: Array<{
      v3: string
      v4: string
    }>
  } | null
  config: {
    css: string               # @theme block
    description: string
  } | null
  security: {
    rules_of_engagement_followed: boolean
  } | null
  code_quality: {
    problem_checker_run: boolean
  } | null
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

- Layout routing is fixed: center ? `flex items-center justify-center`; vertical stack ? `flex flex-col gap-4`; space between ? `flex justify-between items-center`; auto-grid ? `grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]`.
- Responsive routing is fixed: viewport ? `md:`; container ? `@md:`.
- Color system is fixed: 3 layers (primitive ? semantic ? component).
- Typography is fixed: 5 sizes (xs=0.75rem, sm=0.875rem, base=1rem, lg=1.125rem, xl+=1.25rem+).
- v3?v4 migration is fixed: 3 breaking changes.
- Same use case = same class recommendation.

#### What Agents May Assume

- Tailwind CSS v4 is installed and configured.
- `@theme` directive is supported.
- OKLCH color space is available.
- Container queries are supported.

#### What Agents Must NOT Assume

- v3 configuration works in v4.
- All browsers support container queries.
- OKLCH has same browser support as hex/rgb.
- `@apply` is recommended for all cases.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Pattern | None; class recommendation |
| Layout | None; class recommendation |
| Color | None; token recommendation |
| Migration | None; change documentation |
| Config | None; CSS snippet output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify styling need (layout, color, typography, etc.)
2. Invoke appropriate request type for class guidance
3. For new projects: invoke config for @theme setup
4. For v3 projects: invoke migration for change list
5. Write code (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- All decisions are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Unknown layout type | Return error | Use center, vertical-stack, space-between, or auto-grid |
| Unknown color layer | Return error | Use primitive, semantic, or component |
| Invalid request type | Return error | Use supported type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Pattern | Yes | Same use case = same classes |
| Layout | Yes | Same type = same classes |
| Color | Yes | Same layer = same tokens |
| Migration | Yes | Same version pair = same changes |
| Config | Yes | Same inputs = same @theme |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Parse use case, layout type, version | Classification |
| **Guide** | Generate class recommendation, config, or migration | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Configuration | v4: CSS-first `@theme { }` with OKLCH; v3: `tailwind.config.js` (legacy) |
| v3?v4 migration | `tailwind.config.js` ? CSS `@theme`; PostCSS plugin ? Oxide engine (10� faster); JIT mode ? native, always-on |
| Responsive | Viewport: `md:`, `lg:`; Container: `@md:`, `@lg:` (responds to parent width) |
| Dark mode | `dark:` prefix: `bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white` |
| Layout center | `flex items-center justify-center` |
| Layout vertical | `flex flex-col gap-4` |
| Layout space-between | `flex justify-between items-center` |
| Layout auto-grid | `grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]` |
| Color layers | Primitive (`--blue-500`) ? Semantic (`--color-primary`) ? Component (`--button-bg`) |
| Typography | xs=0.75rem, sm=0.875rem, base=1rem, lg=1.125rem, xl+=1.25rem+ |
| Animation | spin (rotation), pulse (opacity), `transition-all duration-200`, `hover:scale-105` |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown layout type | Return `ERR_UNKNOWN_LAYOUT` | Use valid type |
| Unknown color layer | Return `ERR_UNKNOWN_COLOR_LAYER` | Use primitive, semantic, or component |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** Every failure returns a structured error. No partial class recommendations.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_LAYOUT` | Validation | Yes | Layout type not one of 4 |
| `ERR_UNKNOWN_COLOR_LAYER` | Validation | Yes | Color layer not one of 3 |
| `ERR_VERSION_MISMATCH` | Validation | Yes | Mixing v3 config with v4 features |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format (OpenTelemetry Event Array)

```json
{
  "traceId": "uuid",
  "spanId": "uuid",
  "events": [
    {
      "name": "css_class_recommended",
      "timestamp": "ISO8601",
      "attributes": {
        "component": "button",
        "pattern": "variants"
      }
    },
    {
      "name": "layout_pattern_generated",
      "timestamp": "ISO8601",
      "attributes": {
        "type": "auto-grid",
        "responsive": true
      }
    },
    {
      "name": "v3_v4_migration_started",
      "timestamp": "ISO8601",
      "attributes": {
        "legacy_theme_keys": 4
      }
    }
  ]
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Pattern recommended | INFO | use_case, classes |
| Layout recommended | INFO | layout_type, classes |
| Migration guidance | INFO | from_version, to_version |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `tailwindkit.decision.duration` | Histogram | ms |
| `tailwindkit.request_type.distribution` | Counter | per type |
| `tailwindkit.layout_type.distribution` | Counter | per layout |
| `tailwindkit.version.distribution` | Counter | per version |

---

## 14. Security & Trust Model

### Data Handling

- Tailwind Kit produces utility class recommendations and CSS snippets only.
- No credentials, no PII, no user data.
- No file access, no network calls, no package installation.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
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
| Pattern recommendation | < 2 ms | < 5 ms | 20 ms |
| Layout recommendation | < 2 ms | < 5 ms | 20 ms |
| Migration guidance | < 5 ms | < 15 ms | 50 ms |
| Full guide | < 15 ms | < 40 ms | 50 ms |
| Output size | = 3,000 chars | = 6,000 chars | 10,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Tailwind v5 release | Low | Major breaking changes | Track Tailwind roadmap |
| OKLCH browser support | Low | Color rendering issues | Fallback hex values |
| Container query support | Low | Responsive failures | Document browser support |
| Deprecation of @apply | Medium | Pattern changes | Reduce @apply recommendations |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | Tailwind CSS v4 installed |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: class recommendations, config guidance, migration paths |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to design-system, nextjs-pro, studio |
| Content Map for multi-file | ? | Links to rules/ + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | CSS-first @theme configuration | ? |
| **Functionality** | v3?v4 migration (3 breaking changes) | ? |
| **Functionality** | 4 core patterns (theme, container queries, dark mode, responsive) | ? |
| **Functionality** | 4 layout patterns | ? |
| **Functionality** | 3-layer OKLCH color system | ? |
| **Functionality** | 5 typography sizes + 4 animation classes | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 4 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed layout classes, fixed color layers, fixed migration | ? |
| **Security** | No files, no network, no packages | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---



---

### Rule: responsive

---
name: responsive
description: Tailwind CSS v4 responsive patterns � breakpoints, container queries, responsive grid/typography/images, hide/show, full layout example
---

# Responsive & Container Queries

> Mobile-first always. Container queries for components. Viewport breakpoints for page layout.

---

## Breakpoint System

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile-first base |
| `sm:` | 640px | Large phone |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Large desktop |

---

## Mobile-First Pattern

```html
<!-- Base = mobile, then override for larger -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2 lg:w-1/3">
    <p class="text-sm md:text-base lg:text-lg">
      Responsive text
    </p>
  </div>
</div>
```

---

## Container Queries (v4 Native)

| Type | Prefix | Responds To |
|------|--------|-------------|
| Viewport | `md:` | Browser window width |
| Container | `@md:` | Parent container width |

```html
<!-- Define container on parent -->
<div class="@container">
  <!-- Children respond to parent width, not viewport -->
  <div class="flex flex-col @sm:flex-row @md:grid @md:grid-cols-3 gap-4">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
  </div>
</div>

<!-- Named containers for nested contexts -->
<div class="@container/sidebar">
  <nav class="@sm/sidebar:flex @md/sidebar:flex-col">
    Links
  </nav>
</div>
```

**When to use which:**

| Scenario | Use |
|----------|-----|
| Page-level layout (header, sidebar) | Viewport `md:` |
| Reusable components (card, widget) | Container `@md:` |
| Dashboard panels | Container `@md:` |

---

## Responsive Grid Patterns

```html
<!-- Auto-fit: fills available space, wraps naturally -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- Cards -->
</div>

<!-- Auto-fit with minmax (no breakpoints needed) -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
  <!-- Cards auto-wrap based on available space -->
</div>

<!-- Sidebar + content layout -->
<div class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
  <aside class="hidden lg:block">Sidebar</aside>
  <main>Content</main>
</div>
```

---

## Responsive Typography

```html
<!-- Fluid heading -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>

<!-- Fluid body with line height -->
<p class="text-sm md:text-base lg:text-lg leading-relaxed md:leading-loose">
  Body text that adapts to screen size
</p>

<!-- Clamp (v4 arbitrary) � smooth scaling without breakpoints -->
<h1 class="text-[clamp(1.5rem,4vw,3rem)] font-bold">
  Fluid without breakpoints
</h1>
```

---

## Show / Hide

```html
<!-- Hide on mobile, show on desktop -->
<nav class="hidden lg:flex">Desktop nav</nav>

<!-- Show on mobile, hide on desktop -->
<button class="lg:hidden">? Menu</button>

<!-- Show only on specific range -->
<div class="hidden md:block xl:hidden">Tablet only</div>
```

---

## Responsive Images

```html
<!-- Aspect ratio container -->
<div class="aspect-video overflow-hidden rounded-lg">
  <img
    src="/hero.jpg"
    alt="Hero"
    class="h-full w-full object-cover"
  />
</div>

<!-- Responsive image with srcset (HTML) -->
<img
  srcset="/img-400.jpg 400w, /img-800.jpg 800w, /img-1200.jpg 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  src="/img-800.jpg"
  alt="Responsive"
  class="w-full rounded-lg"
/>
```

---

## Full Layout Example

```html
<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <header class="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-zinc-950/80">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
      <div class="font-bold text-lg">Logo</div>
      <nav class="hidden md:flex gap-6 text-sm">
        <a href="#">Features</a>
        <a href="#">Pricing</a>
      </nav>
      <button class="md:hidden">?</button>
    </div>
  </header>

  <!-- Main with optional sidebar -->
  <div class="mx-auto flex w-full max-w-7xl flex-1 px-4 lg:px-8">
    <aside class="hidden lg:block w-64 shrink-0 border-r py-8 pr-6">
      Sidebar
    </aside>
    <main class="flex-1 py-8 lg:pl-8">
      Content
    </main>
  </div>

  <!-- Footer -->
  <footer class="border-t py-8">
    <div class="mx-auto max-w-7xl px-4 lg:px-8 text-sm text-zinc-500">
      � 2025
    </div>
  </footer>
</div>
```

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|-------|
| Desktop-first (override down) | Mobile-first (build up) |
| Viewport breakpoints for components | Container queries `@md:` |
| Fixed pixel widths everywhere | Use `max-w-7xl`, `w-full` |
| Skip `aspect-ratio` | Use `aspect-video`, `aspect-square` |
| Hard-code show/hide in JS | Use `hidden md:block` |

---

## ?? Related

| File | When to Read |
|------|-------------|
| [components.md](components.md) | Component extraction |
| [v4-config.md](v4-config.md) | @theme setup + breakpoints |
| [SKILL.md](../SKILL.md) | Layout patterns |

---

### Rule: v4-config

---
title: Tailwind v4 Configuration
impact: MEDIUM
tags: tailwind-kit
---

# Tailwind v4 Configuration

## Full Theme Configuration

```css
@theme {
  /* Colors - OKLCH for perceptual uniformity */
  --color-primary: oklch(0.7 0.15 250);
  --color-primary-hover: oklch(0.65 0.18 250);
  --color-secondary: oklch(0.6 0.1 180);
  
  --color-surface: oklch(0.98 0 0);
  --color-surface-dark: oklch(0.15 0 0);
  --color-surface-elevated: oklch(1 0 0);
  
  --color-text: oklch(0.2 0 0);
  --color-text-muted: oklch(0.5 0 0);
  --color-text-inverse: oklch(0.95 0 0);
  
  /* Spacing scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-display: 'Outfit', sans-serif;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

## Extending vs Overriding

| Action | Use When |
|--------|----------|
| **Extend** | Adding new values alongside defaults |
| **Override** | Replacing default scale entirely |
| **Semantic tokens** | Project-specific naming |

## OKLCH Color Format

```
oklch(lightness chroma hue)
     0-1       0-0.4  0-360
```

- **Lightness:** 0 = black, 1 = white
- **Chroma:** 0 = gray, higher = more colorful
- **Hue:** 0 = red, 120 = green, 240 = blue

---

? PikaKit v3.9.206
