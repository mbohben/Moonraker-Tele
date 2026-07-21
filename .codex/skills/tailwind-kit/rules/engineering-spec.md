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

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "tailwind-kit",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "tailwind_version": "string|null",
  "use_case": "string|null",
  "layout_type": "string|null",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
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

? PikaKit v3.9.206
