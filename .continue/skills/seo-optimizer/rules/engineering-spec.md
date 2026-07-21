---
title: SEO Optimizer � Engineering Specification
impact: MEDIUM
tags: seo-optimizer
---

# SEO Optimizer � Engineering Specification

> Production-grade specification for search engine visibility at FAANG scale.

---

## 1. Overview

SEO Optimizer provides structured decision frameworks for search engine visibility: E-E-A-T framework (4 principles), Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1), technical SEO checklist (7 items), content SEO rules (4 elements with character limits), schema markup routing (5 types), and ranking factor prioritization (5 ranked factors). The skill operates as an **Expert (decision tree)** � it produces SEO recommendations, checklist guidance, and schema markup selections. It does not modify HTML, generate sitemaps, or submit to search engines.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Search engine visibility at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Missing meta tags | 45% of pages lack title/description | Invisible to search |
| No structured data | 60% of sites miss schema markup | No rich snippets |
| Core Web Vitals failure | 35% of pages fail LCP threshold | Ranking penalty |
| No E-E-A-T signals | 50% of content lacks authority signals | Low trust score |

SEO Optimizer eliminates these with deterministic content SEO rules (character limits), 5-type schema routing, Core Web Vitals integration, and E-E-A-T checklist.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | E-E-A-T compliance | 4 principles with defined signals |
| G2 | Core Web Vitals | LCP < 2.5s, INP < 200ms, CLS < 0.1 |
| G3 | Technical SEO | 7-item checklist |
| G4 | Content SEO | 4 elements with character limits |
| G5 | Schema markup | 5 types routed by content type |
| G6 | Ranking factors | 5 prioritized factors |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | AI search visibility (GEO) | Owned by `geo-spatial` skill |
| NG2 | Performance profiling | Owned by `perf-optimizer` skill |
| NG3 | Web fundamentals | Owned by `web-core` skill |
| NG4 | HTML implementation | Guidance only; execution is caller's responsibility |
| NG5 | Search console management | External platform |
| NG6 | Link building | External activity |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| E-E-A-T framework | Principle guidance | Content creation |
| Core Web Vitals targets | Target values | Performance measurement (? perf-optimizer) |
| Technical SEO | Checklist items | Implementation |
| Content SEO | Character limits, rules | Content writing |
| Schema markup | Type routing | JSON-LD generation |
| Ranking factors | Priority ordering | SEO execution |

**Side-effect boundary:** SEO Optimizer produces recommendations, checklists, and schema type selections. It does not modify files, submit sitemaps, or interact with search engines.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "eeat" | "core-web-vitals" | "technical-seo" |
                              # "content-seo" | "schema-routing" | "ranking-factors" |
                              # "full-audit"
Context: {
  page_type: string | null    # "article" | "product" | "faq" | "organization" | "navigation"
  url: string | null          # Page URL for context
  has_schema: boolean         # Whether page already has structured data
  has_meta: boolean           # Whether page has title/description
  cwv_scores: {
    lcp: number | null        # Seconds
    inp: number | null        # Milliseconds
    cls: number | null        # Score
  } | null
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  eeat: {
    experience: Array<string>
    expertise: Array<string>
    authoritativeness: Array<string>
    trustworthiness: Array<string>
  } | null
  cwv: {
    lcp: { target: string, status: string }
    inp: { target: string, status: string }
    cls: { target: string, status: string }
  } | null
  technical_seo: Array<{
    item: string
    status: string            # "required" | "present" | "missing"
  }> | null
  content_seo: {
    title: { min: number, max: number, rule: string }
    meta_description: { min: number, max: number, rule: string }
    h1: { rule: string }
    alt_text: { rule: string }
  } | null
  schema: {
    type: string              # "Article" | "Organization" | "FAQPage" | "Product" | "BreadcrumbList"
    rationale: string
  } | null
  ranking_factors: Array<{
    priority: number
    factor: string
  }> | null
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

- Content SEO character limits are fixed: title 50-60 chars, meta description 150-160 chars.
- Schema routing is deterministic: page_type ? schema type.
- Core Web Vitals targets are fixed: LCP < 2.5s, INP < 200ms, CLS < 0.1.
- Ranking factors are fixed priority: content ? backlinks ? CWV ? mobile ? technical.
- E-E-A-T signals are fixed per principle.
- Same page type = same schema recommendation.

#### What Agents May Assume

- Core Web Vitals targets follow Google's published thresholds.
- E-E-A-T is the current Google quality framework.
- Schema types follow schema.org vocabulary.
- Ranking factors reflect current Google algorithm priorities.

#### What Agents Must NOT Assume

- SEO guarantees ranking improvement (search is probabilistic).
- All pages need all schema types.
- Core Web Vitals scores are provided (may be null).
- Content SEO rules replace quality content creation.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| E-E-A-T | None; principle guidance |
| Core Web Vitals | None; target comparison |
| Technical SEO | None; checklist output |
| Content SEO | None; character rules |
| Schema routing | None; type recommendation |
| Ranking factors | None; priority list |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify page type and current SEO state
2. Invoke technical-seo for checklist
3. Invoke content-seo for meta tag rules
4. Invoke schema-routing for structured data type
5. Invoke eeat for quality signals
6. Implement recommendations (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- All decisions are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Unknown page type | Return error | Specify valid type |
| Invalid CWV scores | Return error | Provide valid numbers |
| Invalid request type | Return error | Use supported type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| E-E-A-T | Yes | Fixed signals per principle |
| Core Web Vitals | Yes | Fixed targets |
| Technical SEO | Yes | Fixed checklist |
| Content SEO | Yes | Fixed character limits |
| Schema routing | Yes | Same page type = same schema |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Parse page type, current SEO state, CWV scores | Classification |
| **Guide** | Generate checklist, rules, schema, or ranking output | Complete recommendation |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Content SEO limits | Title: 50-60 chars, keyword front-loaded; Meta description: 150-160 chars; H1: one per page; Alt text: descriptive, not keyword-stuffed |
| Schema routing | Article ? blog/news; Organization ? company; FAQPage ? Q&A; Product ? e-commerce; BreadcrumbList ? navigation |
| Core Web Vitals | LCP < 2.5s (good), > 4.0s (poor); INP < 200ms (good), > 500ms (poor); CLS < 0.1 (good), > 0.25 (poor) |
| Ranking priorities | 1: Quality content, 2: Backlinks, 3: Page experience (CWV), 4: Mobile, 5: Technical SEO |
| E-E-A-T signals | Experience: first-hand knowledge; Expertise: credentials; Authoritativeness: backlinks; Trustworthiness: HTTPS + accuracy |
| Technical SEO | 7 required: sitemap, robots.txt, canonical, HTTPS, mobile-friendly, clean URLs, schema markup |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown page type | Return `ERR_UNKNOWN_PAGE_TYPE` | Specify valid type |
| Invalid CWV scores | Return `ERR_INVALID_CWV` | Provide valid numbers |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** Every failure returns a structured error. No partial guidance.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_PAGE_TYPE` | Validation | Yes | Page type not one of 5 |
| `ERR_INVALID_CWV` | Validation | Yes | CWV scores not valid numbers |

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
  "skill_name": "seo-optimizer",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "page_type": "string|null",
  "schema_recommended": "string|null",
  "cwv_status": "string|null",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Schema type selected | INFO | page_type, schema_recommended |
| CWV assessed | INFO | lcp, inp, cls, cwv_status |
| Technical SEO audited | INFO | items_checked, items_missing |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `seooptimizer.decision.duration` | Histogram | ms |
| `seooptimizer.schema_type.distribution` | Counter | per schema type |
| `seooptimizer.cwv_status.distribution` | Counter | pass vs fail |
| `seooptimizer.request_type.distribution` | Counter | per type |

---

## 14. Security & Trust Model

### Data Handling

- SEO Optimizer processes URLs and CWV scores only.
- No credentials, no PII, no user data.
- No network calls, no file access, no external APIs.

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
| Schema routing | < 2 ms | < 5 ms | 20 ms |
| CWV assessment | < 2 ms | < 5 ms | 20 ms |
| Full audit | < 10 ms | < 30 ms | 50 ms |
| Output size | = 2,000 chars | = 5,000 chars | 8,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Google algorithm changes | Medium | Outdated ranking factors | Track Google updates |
| Core Web Vitals thresholds change | Low | Wrong targets | Track web.dev updates |
| Schema.org vocabulary changes | Low | Invalid types | Track schema.org releases |
| E-E-A-T framework evolution | Low | Missing signals | Track Google Quality Rater Guidelines |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies for guidance |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: E-E-A-T, CWV, schema routing, content rules |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to geo-spatial, perf-optimizer |
| Content Map for multi-file | ? | Links to scripts/ + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | E-E-A-T framework (4 principles) | ? |
| **Functionality** | Core Web Vitals (LCP, INP, CLS with targets) | ? |
| **Functionality** | Technical SEO checklist (7 items) | ? |
| **Functionality** | Content SEO (4 elements with character limits) | ? |
| **Functionality** | Schema routing (5 types) | ? |
| **Functionality** | Ranking factors (5 prioritized) | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 3 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed char limits, fixed schema routing, fixed CWV targets | ? |
| **Security** | No PII, no credentials, no network access | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
