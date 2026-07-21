---
name: nextjs-pro
description: >-
  Next.js App Router patterns, Server Components, data fetching, routing, and caching.
  Use when working with Next.js projects, SSR/SSG/ISR, App Router files, or server actions.
  NOT for plain React SPA (use react-pro) or CSS styling (use tailwind-kit).
metadata:
  author: pikakit
  version: "3.9.206"
  category: frontend-architect
  triggers: ["Next.js", "App Router", "RSC", "React", "frontend", "SSR"]
  coordinates_with: ["tailwind-kit", "perf-optimizer", "problem-checker", "code-craft"]
  success_metrics: ["100% CWV Targets Met", "0 Server/Client Boundaries Errors", "0 IDE/Lint Errors"]
---

# Next.js Pro — App Router & React Performance

> Server-first. 3 data strategies. 4 route files. 57 rules. 8 categories. CWV targets.

**Philosophy:** Performance is a feature. Waterfalls are the enemy. Server first.

---

## 5 Must-Ask Questions (Before Any Development)

| # | Question | Options |
|---|----------|---------|
| 1 | Rendering Strategy? | SSR, SSG, ISR, CSR |
| 2 | Data Volatility? | Static, Periodic, Real-time |
| 3 | Authentication? | Middleware, Server Actions, Client |
| 4 | SEO/Metadata? | Dynamic metadata, sitemap |
| 5 | Interactivity Level? | Mostly static vs Highly interactive |

---

## When to Use

| Situation | Action |
|-----------|--------|
| Building React frontend | Use App Router patterns |
| Server vs Client decision | Use component decision tree |
| Data fetching strategy | Route by volatility |
| Performance patterns | Read rules/ by category |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Server/Client component decision | React architecture (→ react-architect) |
| Data fetching strategy (3 options) | CSS/styling (→ tailwind-kit) |
| Routing conventions (4 files) | Design system (→ design-system) |
| 57 performance rules (8 categories) | Performance profiling (→ perf-optimizer) |

**Expert decision skill:** Produces patterns and rule references. Does not write code.

---

## Server vs Client Decision (Binary)

```
Need useState / useEffect / event handlers?
├── YES → 'use client'
└── NO  → Server Component (default, no directive)
```

| Type | Use For |
|------|---------|
| **Server** | Data fetching, layouts, static content |
| **Client** | Forms, buttons, interactive UI |

---

## Data Fetching (3 Strategies — Fixed)

| Volatility | Strategy | Cache Config | Use Case |
|-----------|----------|-------------|----------|
| Static | Default | `cache: 'force-cache'` | Content pages |
| Periodic | ISR | `revalidate: 60` | Dynamic but cacheable |
| Real-time | Dynamic | `cache: 'no-store'` | Live data |

---

## Route Conventions (4 Files — Fixed)

| File | Purpose | Required |
|------|---------|----------|
| `page.tsx` | Route UI | Yes |
| `layout.tsx` | Shared layout | Yes (root) |
| `loading.tsx` | Loading state (Suspense) | Recommended |
| `error.tsx` | Error boundary | Recommended |

---

## Core Web Vitals Targets (Fixed)

| Metric | Target |
|--------|--------|
| LCP | < 2,500 ms |
| INP | < 200 ms |
| CLS | < 0.1 |

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `architecture_decision` | `{"component_type": "server|client", "reason": "..."}` | `INFO` |
| `data_fetching_audit` | `{"strategy": "static|isr|dynamic", "volatility": "..."}` | `INFO` |
| `build_verification` | `{"status": "pass|fail", "cwv_metrics_met": true}` | `INFO` |

All executions MUST emit the `build_verification` span before reporting completion.

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_CATEGORY` | Yes | Rule category not one of 8 |
| `ERR_INVALID_VOLATILITY` | Yes | Data volatility not recognized |

**Zero internal retries.** Deterministic; same context = same pattern.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `'use client'` everywhere | Server Component by default |
| Fetch data in Client Components | Fetch in Server Components |
| Barrel imports (`index.js`) | Direct imports |
| Nested awaits (waterfall) | `Promise.all()` (parallel) |
| Skip loading/error states | Use loading.tsx + error.tsx |
| Ignore IDE warnings/errors | Call `problem-checker` to auto-fix |


## 📑 Content Map

| Category | Files | Focus | When to Read |
|----------|-------|-------|--------------|
| `rules/async-*.md` | 5 | Waterfalls, parallel fetch | Data fetching |
| `rules/bundle-*.md` | 5 | Tree-shaking, lazy loading | Bundle size |
| `rules/server-*.md` | 7 | RSC, caching, actions | Server Components |
| `rules/client-*.md` | 4 | Events, SWR, localStorage | Client Components |
| `rules/rendering-*.md` | 9 | Hydration, transitions | Rendering issues |
| `rules/rerender-*.md` | 12 | Memo, state, effects | Re-render prevention |
| `rules/js-*.md` | 12 | Micro-patterns | JS performance |
| `rules/advanced-*.md` | 3 | Event refs, init-once, useLatest | Advanced patterns |
| `rules/_*.md, schema.json` | 3 | Section catalog, template, schema | Rule authoring |
| [engineering-spec.md](rules/engineering-spec.md) | 1 | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY the category relevant to current task.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `react-architect` | Skill | React patterns |
| `tailwind-kit` | Skill | Styling |
| `perf-optimizer` | Skill | Performance profiling |

---

⚡ PikaKit v3.9.206
