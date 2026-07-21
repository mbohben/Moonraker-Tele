---
name: studio
description: >-
  AI-powered design intelligence with 50+ styles, 97 color palettes, 57 font pairings.
  Use when generating design systems, searching palettes/fonts, or applying anti-AI-slop rules.
  NOT for design theory (use design-system) or CSS code (use tailwind-kit).
metadata:
  author: pikakit
  version: "3.9.206"
  category: design-intelligence
  triggers: ["design system", "UI design", "color palette", "typography", "style guide"]
  coordinates_with: ["design-system", "ai-artist"]
  success_metrics: ["Aesthetic Consistency", "Slop Avoidance Rate", "Typography Contrast Ratio"]
---

# Studio — Design Intelligence

> 50+ styles. 97 palettes. 57 font pairings. Anti-AI-Slop by default.

---

## 5 Must-Ask Questions (Before Recommendations)

| # | Question | Options |
|---|----------|---------|
| 1 | Industry/Domain? | Fintech / SaaS / Healthcare / E-commerce / Creative |
| 2 | Brand Mood? | Dark & Tech / Light & Minimal / Playful / Elegant |
| 3 | Target Audience? | B2B Professional / Gen Z / General Consumer |
| 4 | Current Stack? | React / Tailwind / Generic CSS |
| 5 | Specific Needs? | Full Design System / Just Colors / Just Fonts |

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

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `design_search_started` | `{"query": "fintech dark", "category": "colors"}` | `INFO` |
| `anti_slop_rules_checked` | `{"rule_count": 11, "violations_prevented": 3}` | `INFO` |
| `design_system_generated` | `{"project": "Auth", "palettes_included": 4}` | `INFO` |

All studio outputs MUST emit `design_search_started` and `design_system_generated` (or `analysis_completed`) events.

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

⚡ PikaKit v3.9.206
