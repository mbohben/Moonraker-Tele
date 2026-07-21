# studio

**Version 1.0.0**
Engineering
March 2026

> **Note:**
> This document is for agents and LLMs to follow when working on studio domain.
> Optimized for automation and consistency by AI-assisted workflows.

---

# Studio — Design Intelligence

> 50+ styles. 97 palettes. 57 font pairings. Anti-AI-Slop by default.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Need color palette | Search colors by industry/mood |
| Need typography | Search font pairings |
| Full design system | Use `--design-system` flag |
| Avoid generic AI look | Follow Anti-AI-Slop rules |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Searchable design database (6 categories) | CSS implementation (→ frontend agents) |
| Anti-AI-Slop avoidance rules | Design theory (→ design-system) |
| Design system config generation | Image assets (→ ai-artist) |
| Priority-ranked recommendations | Component coding |

**Expert decision skill:** Produces design recommendations. Does not write CSS or code.

---

## Database Contents (6 Categories)

| Category | Count | Data File |
|----------|-------|-----------|
| Styles | 50+ | `data/styles.csv` |
| Colors | 97 | `data/colors.csv` |
| Typography | 57 | `data/typography.csv` |
| UX Guidelines | 99 | `data/ux-guidelines.csv` |
| Charts | 25 | `data/charts.csv` |
| Icons | — | `data/icons.csv` |
| Landing Pages | — | `data/landing.csv` |
| Products | — | `data/products.csv` |
| Prompts | — | `data/prompts.csv` |
| React Performance | — | `data/react-performance.csv` |
| UI Reasoning | — | `data/ui-reasoning.csv` |
| Web Interface | — | `data/web-interface.csv` |
| Stacks | 12 | `data/stacks/*.csv` (React, Next.js, Vue, Nuxt, Svelte, Flutter, SwiftUI, etc.) |

---

## CLI Commands

```bash
# Generate design system
node .agent/skills/studio/scripts/search.ts "<query>" --design-system [-p "Project Name"]

# Search by category
node .agent/skills/studio/scripts/search.ts "fintech dark" --category colors
node .agent/skills/studio/scripts/search.ts "minimal professional" --category styles
node .agent/skills/studio/scripts/search.ts "modern tech" --category typography
```

---

## Anti-AI-Slop Rules (Fixed)

### Fonts to AVOID

| ❌ Don't Use | ✅ Use Instead |
|-------------|---------------|
| Inter | Playfair Display, Cormorant |
| Roboto | Syne, Outfit |
| Arial | Source Sans Pro, Work Sans |
| System fonts | Fraunces, IBM Plex |

### Colors to AVOID

| ❌ Don't Use | ✅ Use Instead |
|-------------|---------------|
| #FF0000 (pure red) | #DC2626, #EF4444 |
| #00FF00 (pure green) | #10B981, #059669 |
| #0000FF (pure blue) | #3B82F6, #2563EB |
| #800080 (pure purple) | #8B5CF6, #7C3AED |

### Patterns to AVOID

| ❌ Don't | ✅ Do |
|---------|-------|
| Generic `box-shadow: 0 2px 4px rgba(0,0,0,0.1)` | Dramatic: `0 25px 50px -12px rgba(0,0,0,0.25)` |
| Solid #FFFFFF / #000000 backgrounds | Gradients, noise textures, glass effects |
| Scattered micro-interactions on every hover | One orchestrated page-load animation |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_EMPTY_QUERY` | Yes | Search query is empty |
| `ERR_UNKNOWN_CATEGORY` | Yes | Category not one of 5 |
| `ERR_DATABASE_LOAD` | Yes | CSV file not readable |

**Zero internal retries.** Same query = same ranked results.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Style not found | Check exact name in `data/styles.csv` |
| Color palette clash | Use adjacent colors from same palette row |
| Font loading slow | Use Google Fonts subset or local fonts |
| Animation too heavy | Reduce duration, simplify easing |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [data/](data/) | 24 CSV databases | Database contents |
| [scripts/](scripts/) | Search CLI + core logic | Running commands |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/studio` | Workflow | User-facing command |
| `frontend-specialist` | Agent | Uses this for UI work |
| `design-system` | Skill | Companion design skill |

---



---

## Detailed Rules


---

### Rule: engineering-spec

---
name: studio-engineering-spec
description: Full 21-section engineering spec — BM25 search, 6 CSV categories, design system generation, Anti-AI-Slop rules
---

# Studio — Engineering Specification

> Production-grade specification for AI-powered design intelligence at FAANG scale.

---

## 1. Overview

Studio provides a searchable design database and design system generation: 50+ design styles, 97 curated color palettes, 57 font pairings, 99 UX guidelines, 25 chart types, and 9 technology stacks. It includes Anti-AI-Slop rules to prevent generic AI-generated aesthetics (font replacements, color replacements, shadow/background/animation guidelines). The skill operates as an **Expert (decision tree)** — it produces design recommendations, color palettes, font pairings, and design system configurations via CLI search. It does not create CSS files, implement designs, or render UI.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

---

## 2. Problem Statement

Design system creation at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Generic AI aesthetics | 80% of AI-generated UIs use Inter + pure colors | "AI slop" appearance |
| No design consistency | 55% of projects lack design system | Inconsistent UI |
| Wrong font pairing | 45% of projects use default system fonts | Unprofessional look |
| Pure RGB colors | 40% of projects use #FF0000, #00FF00, #0000FF | Cheap appearance |

Studio eliminates these with Anti-AI-Slop rules (font/color/shadow avoidance), 97 curated palettes, 57 tested font pairings, and searchable design database.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Design styles | 50+ styles searchable by query |
| G2 | Color palettes | 97 curated palettes with hex codes |
| G3 | Font pairings | 57 heading + body pairings |
| G4 | UX guidelines | 99 best practices |
| G5 | Chart types | 25 data visualization types |
| G6 | Tech stacks | 9 implementation stacks |
| G7 | Anti-AI-Slop | 4 font replacements, 4 color replacements, 3 pattern rules |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | CSS implementation | Owned by frontend agents |
| NG2 | Component coding | Owned by `frontend-design` skill |
| NG3 | Image asset creation | Owned by `ai-artist` skill |
| NG4 | Design system theory | Owned by `design-system` skill |
| NG5 | UI rendering | Platform concern |
| NG6 | Brand identity creation | Creative agency concern |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Style database | 50+ styles with attributes | Style implementation |
| Color database | 97 palettes with hex codes | CSS variable generation |
| Font database | 57 pairings (heading + body) | Font loading |
| Anti-AI-Slop rules | Font/color/shadow/bg/animation avoidance lists | Rule enforcement in code |
| Design system generation | JSON/Markdown config output | Component implementation |

**Side-effect boundary:** Studio produces design recommendations, palette selections, and font pairings. It does not write CSS, create components, or modify files.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "search" | "design-system" | "anti-slop" | "full-guide"
Context: {
  query: string               # Search query (e.g., "fintech dark", "minimal professional")
  category: string | null     # "colors" | "styles" | "typography" | "ux" | "charts" | null
  project_name: string | null # For design system generation
  industry: string | null     # "fintech" | "healthcare" | "saas" | "ecommerce" | null
  mood: string | null         # "dark" | "light" | "playful" | "elegant" | "minimal" | null
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  results: Array<{
    category: string
    name: string
    attributes: object        # Category-specific fields (hex codes, font names, etc.)
    priority: number          # Relevance ranking 1-10
  }> | null
  design_system: {
    project_name: string
    style: object
    colors: object            # Primary, secondary, accent, neutral hex codes
    typography: object        # Heading font, body font, sizes
    spacing: object           # Scale values
    anti_slop: Array<string>  # Applied avoidance rules
  } | null
  anti_slop: {
    fonts_avoid: Array<{ dont_use: string, use_instead: string }>
    colors_avoid: Array<{ dont_use: string, use_instead: string }>
    shadows: string           # CSS shadow guidance
    backgrounds: string       # Background guidance
    animations: string        # Animation guidance
  } | null
  security: {
    rules_of_engagement_followed: boolean
  } | null
  design_compliance: {
    anti_slop_enforced: boolean
  } | null
  metadata: {
    contract_version: string
    backward_compatibility: string
    database_stats: {
      styles: number
      colors: number
      typography: number
      ux: number
      charts: number
      stacks: number
    }
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

- Search uses priority-based ranking against CSV database.
- Anti-AI-Slop rules are fixed: 4 font avoidances, 4 color avoidances, shadow/bg/animation patterns.
- Design system generation produces consistent output for same query + industry + mood.
- Database contents are static (CSV files, not dynamic).
- Same query + same category = same ranked results.

#### What Agents May Assume

- CSV databases are pre-loaded and available.
- Color palettes use valid hex codes.
- Font pairings reference Google Fonts or standard typefaces.
- Priority ranking is 1-10 (10 = most relevant).

#### What Agents Must NOT Assume

- All styles suit all industries.
- Font pairings include all weights.
- Color palettes pass WCAG contrast automatically.
- Design system output is complete CSS (it's configuration).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Search | None; read-only database query |
| Design system | None; configuration output |
| Anti-slop | None; avoidance rules output |
| Full guide | None; combined output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify design needs (style, colors, typography, industry)
2. Invoke search with query and category filter
3. For full system: invoke design-system with project name
4. Review anti-slop rules for avoidance
5. Implement design (caller's responsibility)
```

#### Execution Guarantees

- Each invocation returns ranked results from CSV database.
- All queries are case-insensitive.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Empty query | Return error | Provide search terms |
| Unknown category | Return error | Use valid category |
| No results found | Return empty array | Broaden query |
| Invalid request type | Return error | Use supported type |

#### Retry Boundaries

- Zero internal retries. Deterministic CSV reads.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Search | Yes | Same query = same results |
| Design system | Yes | Same inputs = same config |
| Anti-slop | Yes | Fixed rules |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Query** | Parse query, match against CSV databases | Ranked matches |
| **Format** | Structure results by category and priority | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Anti-AI-Slop fonts | Avoid Inter → use Playfair Display, Cormorant; Avoid Roboto → use Syne, Outfit; Avoid Arial → use Source Sans Pro, Work Sans; Avoid system fonts → use Fraunces, IBM Plex |
| Anti-AI-Slop colors | Avoid #FF0000 → use #DC2626, #EF4444; Avoid #00FF00 → use #10B981, #059669; Avoid #0000FF → use #3B82F6, #2563EB; Avoid #800080 → use #8B5CF6, #7C3AED |
| Anti-AI-Slop shadows | Avoid generic `0 2px 4px rgba(0,0,0,0.1)` → use dramatic `0 25px 50px -12px rgba(0,0,0,0.25)` |
| Anti-AI-Slop backgrounds | Avoid solid #FFFFFF/#000000 → use subtle gradients, noise textures, glass effects |
| Anti-AI-Slop animations | Avoid scattered micro-interactions → use one orchestrated page-load animation |
| Database coverage | 50+ styles, 97 colors, 57 typography, 99 UX, 25 charts, 9 stacks |
| Priority ranking | 1-10 scale (10 = most relevant to query) |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

CSV databases are read-only. No writes during any operation.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Empty query | Return `ERR_EMPTY_QUERY` | Provide search terms |
| Unknown category | Return `ERR_UNKNOWN_CATEGORY` | Use colors, styles, typography, ux, or charts |
| No results | Return empty results array | Broaden query |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** Every failure returns a structured error. No partial design system output.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_EMPTY_QUERY` | Validation | Yes | Search query is empty |
| `ERR_UNKNOWN_CATEGORY` | Validation | Yes | Category not one of 5 |
| `ERR_DATABASE_LOAD` | Infrastructure | Yes | CSV file not readable |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| CSV database load | 2 seconds | 5 seconds | File I/O for 24 CSV files |
| Search query | 500 ms | 2 seconds | In-memory filtering |
| Design system gen | 1 second | 3 seconds | Multi-category query |
| Internal retries | Zero | Zero | Deterministic CSV reads |

---

## 13. Observability & Logging Schema

### Log Entry Format (OpenTelemetry Event Array)

```json
{
  "traceId": "uuid",
  "spanId": "uuid",
  "events": [
    {
      "name": "design_search_started",
      "timestamp": "ISO8601",
      "attributes": {
        "query": "fintech dark",
        "category": "colors"
      }
    },
    {
      "name": "anti_slop_rules_checked",
      "timestamp": "ISO8601",
      "attributes": {
        "rule_count": 11,
        "violations_prevented": 3
      }
    },
    {
      "name": "design_system_generated",
      "timestamp": "ISO8601",
      "attributes": {
        "project": "Auth",
        "palettes_included": 4
      }
    }
  ]
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Search executed | INFO | query, category, results_count |
| Design system generated | INFO | project_name, style, anti_slop_applied |
| Anti-slop rules returned | INFO | rules_count |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `studio.search.duration` | Histogram | ms |
| `studio.category.distribution` | Counter | per category |
| `studio.results.count` | Histogram | results per search |
| `studio.design_system.count` | Counter | total |
| `studio.anti_slop.usage` | Counter | total |

---

## 14. Security & Trust Model

### Data Handling

- Studio reads CSV databases only (no writes).
- No credentials, no PII, no user data.
- No network calls, no external APIs.
- Color hex codes and font names are non-sensitive.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | I/O-bound CSV reads | In-memory caching after first load |
| Database size | 24 CSV files, < 1 MB total | Static dataset |
| Concurrency | Stateless read-only | Unlimited parallel |
| Memory per invocation | < 5 MB (CSV in memory) | Pre-loaded once |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

CSV databases are read-only. No write contention.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

CSV data may be cached in memory for performance but is never mutated.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Category search | < 50 ms | < 200 ms | 2 s |
| Design system gen | < 200 ms | < 500 ms | 3 s |
| Anti-slop rules | < 5 ms | < 20 ms | 100 ms |
| Full guide | < 300 ms | < 800 ms | 3 s |
| Output size | ≤ 5,000 chars | ≤ 10,000 chars | 15,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CSV data corruption | Low | Wrong recommendations | Validate on load |
| New AI-slop patterns emerge | Medium | Outdated avoidance rules | Quarterly rule review |
| Google Fonts deprecation | Low | Broken font recommendations | Track Google Fonts API |
| Design trends shift | Medium | Outdated styles | Annual database refresh |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | Node.js for scripts/ |
| When to Use section | ✅ | Situation-based routing table |
| Core content matches skill type | ✅ | Expert type: design search, palette generation, anti-slop rules |
| Troubleshooting section | ✅ | Anti-patterns + troubleshooting table |
| Related section | ✅ | Cross-links to frontend-specialist, design-system, /studio |
| Content Map for multi-file | ✅ | Links to data/, scripts/, engineering-spec.md |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 50+ design styles searchable | ✅ |
| **Functionality** | 97 curated color palettes | ✅ |
| **Functionality** | 57 font pairings | ✅ |
| **Functionality** | 99 UX guidelines | ✅ |
| **Functionality** | Anti-AI-Slop (4 fonts + 4 colors + 3 patterns) | ✅ |
| **Functionality** | Design system generation | ✅ |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ✅ |
| **Contracts** | Contract versioning with semver | ✅ |
| **Failure** | Error taxonomy with 4 categorized codes | ✅ |
| **Failure** | Zero internal retries | ✅ |
| **Determinism** | Fixed Anti-AI-Slop rules, static CSV database | ✅ |
| **Security** | No PII, no network, read-only CSV | ✅ |
| **Observability** | Structured log schema with 5 mandatory fields | ✅ |
| **Observability** | 5 metrics defined | ✅ |
| **Performance** | P50/P99 targets for all operations | ✅ |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ✅ |

---



---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Quick start, Anti-AI-Slop rules, CLI commands |
| [../scripts/search.ts](../scripts/search.ts) | CLI entry point |
| [../scripts/core.ts](../scripts/core.ts) | BM25 search engine |
| [../scripts/design_system.ts](../scripts/design_system.ts) | Design system generator |
| `design-system` | Companion design skill |
| `frontend-specialist` | Uses studio for UI work |

---

⚡ PikaKit v3.9.206
