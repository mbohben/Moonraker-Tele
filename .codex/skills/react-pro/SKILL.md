---
name: react-pro
description: >-
  React component architecture, hooks, state management, and performance patterns.
  Use when creating components, fixing hooks, managing state, or working with .tsx/.jsx files.
  NOT for Next.js routing (use nextjs-pro) or CSS styling (use design-system/tailwind-kit).
metadata:
  author: pikakit
  version: "3.9.206"
  category: frontend-specialist
  triggers: ["React", "component", "hooks", "state management", "Redux", "Zustand", "TypeScript", "TanStack Query", "MUI", "frontend"]
  coordinates_with: ["nextjs-pro", "typescript-expert", "design-system", "tailwind-kit", "problem-checker", "knowledge-compiler"]
  success_metrics: ["Component Render Efficiency", "Accessibility Score", "Core Web Vitals"]
---

# React Architect — Component & State Architecture

> 4 component types. 4 state levels. Composition over inheritance. Profile before memoizing.

---

## 5 Must-Ask Questions (Before Architecture Decision)

| # | Question | Options |
|---|----------|---------|
| 1 | Target Framework? | React SPA / Next.js App Router / Vite / Vue |
| 2 | Styling Approach? | Tailwind / CSS Modules / Styled Components / MUI |
| 3 | State Complexity? | Local only / Shared subtree / Server state / Global |
| 4 | Render Strategy? | CSR / SSR / SSG / Streaming |
| 5 | Accessibility Needs? | Standard WCAG / Enhanced (screen reader, focus mgmt) |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Component design | Check component type classification |
| State management | Use complexity → solution routing |
| Hook reuse | Check extraction criteria |
| Performance issues | Use signal → action mapping |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Component classification (4 types) | Next.js patterns (→ nextjs-pro) |
| State management routing (4 levels) | TypeScript patterns (→ typescript-expert) |
| Hook extraction criteria | UI design (→ design-system) |
| Performance signal→action | Code implementation |

**Expert decision skill:** Produces architecture decisions. Does not write code.

---

## Component Types (4 — Deterministic)

| Type | Use For | State Model |
|------|---------|-------------|
| **Server** | Data fetching, static content | None |
| **Client** | Interactivity, browser APIs | useState, effects |
| **Presentational** | UI display | Props only |
| **Container** | Logic/orchestration | Heavy state |

**Design Rules:**
- One responsibility per component (≤ 150 lines)
- Props down, events up
- Composition over inheritance

---

## State Management Routing (Deterministic)

| Complexity | Solution |
|------------|----------|
| Simple (single component) | `useState`, `useReducer` |
| Shared local (subtree) | `Context` |
| Server state (API data) | React Query, SWR |
| Complex global (app-wide) | Zustand, Redux Toolkit |

## State Placement (4 Scopes)

| Scope | Where |
|-------|-------|
| Single component | `useState` |
| Parent-child | Lift state up |
| Subtree | Context |
| App-wide | Global store |

---

## Hook Patterns

### When to Extract Custom Hook

| Pattern | Extract When |
|---------|-------------|
| `useLocalStorage` | Same storage logic in 2+ components |
| `useDebounce` | Multiple debounced values |
| `useFetch` | Repeated fetch patterns |
| `useForm` | Complex form state reused |

### Hook Rules (Non-Negotiable)

- Hooks at top level only (no conditionals)
- Same order every render
- Custom hooks prefix with `use`
- Clean up effects on unmount

---

## Performance Signals (4 — Fixed)

| Signal | Action |
|--------|--------|
| Slow renders | Profile first (DevTools) |
| Large lists (> 100 items) | Virtualize |
| Expensive calculation | `useMemo` |
| Unstable callbacks causing re-renders | `useCallback` |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_COMPLEXITY` | Yes | State complexity not one of 4 |
| `ERR_UNKNOWN_SCOPE` | Yes | State scope not one of 4 |

**Zero internal retries.** Same context = same recommendation.

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `architecture_started` | `{"framework": "...", "component_count": 0}` | `INFO` |
| `component_type_classified` | `{"type": "Server", "reason": "..."}` | `INFO` |
| `state_management_selected` | `{"solution": "zustand", "complexity": "global"}` | `INFO` |
| `performance_signal_detected` | `{"signal": "slow_renders", "action": "profile"}` | `WARN` |
| `architecture_completed` | `{"components_designed": 5, "hooks_extracted": 2}` | `INFO` |

All architecture outputs MUST emit `architecture_started` and `architecture_completed` events.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use global state for local concerns | Start with useState, escalate as needed |
| Prop drill > 3 levels | Use Context or state library |
| Memoize everything | Profile first, memoize measured bottlenecks |
| Mix data fetching with UI | Separate server/container from presentational |
| Create God components (> 300 lines) | Split into focused components (≤ 150 lines) |

---

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | React 19 Patterns | HIGH | `react19-` |
| 2 | Composition | HIGH | `composition-` |
| 3 | State Management | HIGH | `state-` |
| 4 | Error Handling | HIGH | `error-` |
| 5 | Component Patterns | HIGH | `component-` |
| 6 | Data Fetching | HIGH | `data-` |
| 7 | Performance | HIGH | `performance-` |
| 8 | Custom Hooks | MEDIUM | `hooks-` |
| 9 | Testing | MEDIUM | `testing-` |
| 10 | File Organization | MEDIUM | `file-` |
| 11 | MUI Styling | MEDIUM | `mui-` |
| 12 | Engineering Spec | MEDIUM | `engineering-` |

## Quick Reference

### Architecture & Patterns (HIGH)

- `react19-hooks` - useActionState & useOptimistic
- `composition-compound` - Compound components with context
- `state-management` - Zustand (global) & React Query (server)
- `error-boundary` - Error boundary with fallback UI
- `component-patterns` - Component type classification
- `data-fetching` - TanStack Query patterns

### Optimization (HIGH-MEDIUM)

- `performance-optimization` - Waterfalls, bundle, re-renders, virtualization
- `hooks-custom` - useDebounce, useLocalStorage, extraction criteria
- `testing-patterns` - React Testing Library + userEvent

### Structure (MEDIUM)

- `file-organization` - Project file structure
- `mui-styling` - MUI v7 styling patterns
- `engineering-spec` - Full architecture specification

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/react19-hooks.md
rules/state-management.md
```

Each rule file contains:
- Brief explanation of why it matters
- Code examples with correct patterns
- Anti-patterns to avoid

**Selective reading:** Read ONLY the category relevant to current task.

## Full Compiled Document

For the complete guide with all rules expanded: AGENTS.md\n
## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `nextjs-pro` | Skill | Next.js patterns |
| `typescript-expert` | Skill | TypeScript |
| `design-system` | Skill | UI design |

---

⚡ PikaKit v3.9.206
