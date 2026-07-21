---
name: seo-optimizer
description: >-
  SEO fundamentals: E-E-A-T, Core Web Vitals, and Google algorithm optimization.
  Use when optimizing pages for search engines, improving meta tags, or auditing SEO.
  NOT for performance profiling (use perf-optimizer) or marketing copy (use copywriting).
metadata:
  author: pikakit
  version: "3.9.206"
  category: seo-specialist
  triggers: ["SEO", "meta tags", "sitemap", "search ranking", "OpenGraph"]
  coordinates_with: ["perf-optimizer", "copywriting", "nextjs-pro", "problem-checker", "knowledge-compiler"]
  success_metrics: ["Lighthouse SEO Score", "Core Web Vitals Pass Rate", "Schema Markup Validity"]
---

# SEO Optimizer — Search Engine Visibility

> E-E-A-T for trust. CWV for speed. Schema for rich snippets. Content rules for ranking.

---

## 5 Must-Ask Questions (Before SEO Optimization)

| # | Question | Options |
|---|----------|---------|
| 1 | Target? | Traditional SEO / GEO (AI citations) / Both |
| 2 | Current State? | Lighthouse score / Search Console data / No baseline |
| 3 | Priority? | Technical SEO fixes / Content optimization / Schema markup |
| 4 | Audience? | B2B / B2C / Developer / General consumer |
| 5 | Platform? | Next.js / Vite / Static HTML / WordPress |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| New website | Technical SEO checklist (7 items) |
| Content pages | E-E-A-T + Content SEO rules |
| Performance issues | Core Web Vitals targets |
| AI search visibility | Use `geo-spatial` skill instead |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| E-E-A-T framework (4 principles) | AI search (→ geo-spatial) |
| Content SEO (char limits) | Performance profiling (→ perf-optimizer) |
| Schema routing (5 types) | Web fundamentals (→ web-core) |
| Technical SEO checklist | HTML implementation |

**Expert decision skill:** Produces SEO recommendations. Does not modify pages.

---

## E-E-A-T Framework (4 Principles — Fixed)

| Principle | Signals |
|-----------|---------|
| **Experience** | First-hand knowledge, real examples |
| **Expertise** | Credentials, depth of knowledge |
| **Authoritativeness** | Backlinks, industry recognition |
| **Trustworthiness** | HTTPS, transparency, accuracy |

---

## Core Web Vitals (Fixed Targets)

| Metric | Good | Poor | Measures |
|--------|------|------|----------|
| **LCP** | < 2.5s | > 4.0s | Loading speed |
| **INP** | < 200ms | > 500ms | Interactivity |
| **CLS** | < 0.1 | > 0.25 | Visual stability |

---

## Content SEO (Fixed Rules)

| Element | Constraint |
|---------|-----------|
| Title tag | 50-60 chars, keyword front-loaded |
| Meta description | 150-160 chars, compelling CTA |
| H1 | One per page, contains main keyword |
| Alt text | Descriptive, not keyword-stuffed |

---

## Technical SEO Checklist (7 Items)

- [ ] XML sitemap submitted
- [ ] robots.txt configured
- [ ] Canonical tags on all pages
- [ ] HTTPS enabled
- [ ] Mobile-friendly (responsive)
- [ ] Clean URLs (no query params)
- [ ] Schema markup present

---

## Schema Routing (5 Types — Deterministic)

| Page Type | Schema Type |
|-----------|------------|
| Blog posts, news | `Article` |
| Company info | `Organization` |
| Q&A content | `FAQPage` |
| E-commerce | `Product` |
| Navigation | `BreadcrumbList` |

---

## Ranking Factors (Prioritized)

| Priority | Factor |
|----------|--------|
| 1 | Quality, relevant content |
| 2 | Backlinks from authority sites |
| 3 | Page experience (Core Web Vitals) |
| 4 | Mobile-first indexing |
| 5 | Technical SEO fundamentals |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_PAGE_TYPE` | Yes | Page type not one of 5 |
| `ERR_INVALID_CWV` | Yes | CWV scores not valid numbers |

**Zero internal retries.** Same page type = same recommendation.

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `audit_started` | `{"scope": "full_audit", "url": "..."}` | `INFO` |
| `cwv_measured` | `{"lcp_ms": 1800, "inp_ms": 120, "cls": 0.05}` | `INFO` |
| `schema_added` | `{"type": "Article", "page": "/blog/post-1"}` | `INFO` |
| `audit_completed` | `{"lighthouse_seo": 98, "fixes_applied": 12}` | `INFO` |

All SEO outputs MUST emit `audit_started` and `audit_completed` events.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Keyword stuff title/alt text | Use natural language with keyword |
| Skip meta descriptions | Write compelling 150-160 char descriptions |
| Ignore Core Web Vitals | Meet LCP/INP/CLS targets |
| Use generic schema | Route schema by page type |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `geo-spatial` | Skill | AI search (GEO) |
| `perf-optimizer` | Skill | Core Web Vitals |

---

⚡ PikaKit v3.9.206
