---
name: perf-optimizer
description: >-
  Performance profiling: Core Web Vitals, bundle analysis, runtime profiling, and optimization.
  Use when diagnosing slow pages, reducing bundle size, or running Lighthouse audits.
  NOT for SEO (use seo-optimizer) or server scaling (use server-ops).
metadata:
  author: pikakit
  version: "3.9.206"
  category: code-quality
  triggers: ["performance", "optimize", "speed", "slow", "memory", "cpu", "Lighthouse", "bundle size", "Core Web Vitals", "LCP", "INP", "CLS", "latency"]
  coordinates_with: ["code-craft", "e2e-automation", "chrome-devtools", "problem-checker", "knowledge-compiler"]
  success_metrics: ["Baseline Measured", "Improvement Validated", "No Regressions"]
---

# Performance Profiler — Core Web Vitals & Profiling

> Measure first. Profile second. Fix third. Validate last.

---

## 5 Must-Ask Questions (Before Any Optimization)

| # | Question | Options |
|---|----------|---------|
| 1 | Baseline Metrics? | Yes (record data), No (block until measured) |
| 2 | Target Goal? | Specific threshold (e.g., LCP < 2.5s) |
| 3 | Identified Bottleneck? | What is the proven root cause? |
| 4 | Impact vs Effort? | High impact / Low impact? |
| 5 | Environment? | Prod, Staging, Local Lab? |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Slow page load | Run Lighthouse audit |
| Large bundle size | Use bundle analyzer |
| Runtime lag / jank | DevTools Performance tab |
| Memory growth | DevTools Memory tab |
| N+1 queries, caching | Read `backend-patterns.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Core Web Vitals targets | Measurement execution |
| Tool selection (symptom → tool) | Tool installation |
| Bundle analysis guidance | Bundle build |
| Quick win prioritization | Code modification |

**Expert decision skill:** Produces profiling methodology. Does not run tools.

---

## Core Web Vitals (Fixed Targets)

| Metric | Good | Poor | Measures |
|--------|------|------|----------|
| **LCP** | < 2.5s | > 4.0s | Loading speed |
| **INP** | < 200ms | > 500ms | Interactivity |
| **CLS** | < 0.1 | > 0.25 | Visual stability |

| Stage | Tool |
|-------|------|
| Development | Local Lighthouse |
| CI/CD | Lighthouse CI |
| Production | RUM (Real User Monitoring) |

---

## 4-Step Profiling Workflow (Fixed)

```
1. BASELINE  → Measure current state
2. IDENTIFY  → Find the bottleneck
3. FIX       → Make targeted change
4. VALIDATE  → Confirm improvement
```

---

## Tool Selection (Deterministic)

| Symptom | Tool |
|---------|------|
| Page load speed | Lighthouse |
| Bundle size | Bundle analyzer |
| Runtime performance | DevTools Performance |
| Memory issues | DevTools Memory |
| Network latency | DevTools Network |

---

## Bundle Analysis (4 Issues → 4 Actions)

| Issue | Indicator | Action |
|-------|-----------|--------|
| Large dependency | Top of bundle | Import specific modules |
| Duplicate deps | Multiple chunks | Dedupe, update versions |
| Unused code | Low coverage | Tree shake |
| Missing code split | Single large chunk | Split by route |

---

## Runtime Profiling Patterns

| Pattern | Meaning |
|---------|---------|
| Long tasks (> 50ms) | UI blocking |
| Many small tasks | Batching opportunity |
| Layout/paint | Rendering bottleneck |
| Growing heap | Possible memory leak |
| Detached DOM | Not cleaned up |

---

## Quick Win Priorities (Ranked)

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | Enable compression (gzip/brotli) | High |
| 2 | Lazy load images | High |
| 3 | Code split routes | High |
| 4 | Cache static assets | Medium |
| 5 | Use modern image formats (WebP/AVIF) | Medium |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_SYMPTOM` | Yes | Symptom not in known set |
| `ERR_UNKNOWN_FRAMEWORK` | Yes | Framework not recognized |
| `ERR_MISSING_BASELINE` | No | Optimization requested without baseline data |

**Zero internal retries.** Same symptom = same recommendation.

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `baseline_measured` | `{"lcp": "...", "inp": "...", "cls": "...", "bundle": "..."}` | `INFO` |
| `bottleneck_identified` | `{"target": "...", "impact_estimate": "..."}` | `INFO` |
| `improvement_validated` | `{"lcp_before": "...", "lcp_after": "..."}` | `INFO` |

All executions MUST emit the `improvement_validated` span before reporting completion.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Guess at bottlenecks | Profile first, then fix |
| Micro-adjust non-critical paths | Fix the biggest issue |
| Skip baseline measurement | Always measure before/after |
| Ignore real user data | Use RUM in production |
| Ignore IDE warnings/errors | Call `problem-checker` to auto-fix |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [backend-patterns.md](rules/backend-patterns.md) | N+1, caching, DB tuning | Backend performance |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/optimize` | Workflow | Performance workflow |
| `e2e-automation` | Skill | Performance testing |

---

⚡ PikaKit v3.9.206
