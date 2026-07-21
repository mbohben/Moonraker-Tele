---
name: copywriting
description: >-
  Conversion copywriting: AIDA, PAS, BAB, 4Ps formulas for headlines, emails, and landing pages.
  Use when writing marketing copy, headlines, email sequences, or conversion-focused content.
  NOT for technical documentation (use doc-templates) or SEO content (use seo-optimizer).
metadata:
  author: pikakit
  version: "3.9.206"
  category: content
  triggers: ["copywriting", "headlines", "landing page", "email", "marketing"]
  coordinates_with: ["seo-optimizer", "studio", "ai-artist"]
  success_metrics: ["4/4 headline Us score", "0 copy validation failures"]
---

# Copywriting — Conversion Formulas

> 6 proven formulas. Benefit-first. Specific claims. One CTA per piece.

---

## 5 Must-Ask Questions (Socratic Gate)

| # | Question | Options |
|---|----------|---------|
| 1 | Target Audience? | Demographics / Pain points / Role |
| 2 | Core Product Value? | Primary benefit / USP |
| 3 | Content Type? | Landing / Email / Ad / Headline |
| 4 | Primary CTA? | Buy / Sign Up / Read More |
| 5 | Brand Tone? | Professional / Casual / Urgent |

---

## Prerequisites

**Required:** None — Copywriting is a knowledge-based skill with no external dependencies.

---

## When to Use

| Content Type | Formula | Steps |
|-------------|---------|-------|
| Landing pages, ads | **AIDA** | Attention → Interest → Desire → Action |
| Email, sales pages | **PAS** | Problem → Agitate → Solution |
| Testimonials, case studies | **BAB** | Before → After → Bridge |
| Long-form sales | **4Ps** | Promise → Picture → Proof → Push |
| Headlines | **4Us** | Urgent + Unique + Useful + Ultra-specific |
| Product descriptions | **FAB** | Feature → Advantage → Benefit |

**Selection is deterministic:** same content type = same formula, every time.

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Formula selection per content type | SEO keyword research (→ seo-optimizer) |
| Headline validation (4Us) | Visual design (→ studio) |
| Copy validation (5 rules) | A/B test infrastructure |
| Anti-pattern detection | Image generation for ads (→ ai-artist) |

**Pure decision skill:** Produces formula frameworks and validation. Zero side effects.

---

## Copy Formulas

### AIDA (Landing Pages, Ads)

| Step | Purpose | Guidance |
|------|---------|----------|
| **A**ttention | Grab interest | Bold headline with specific number |
| **I**nterest | Build curiosity | Key benefit statement |
| **D**esire | Create want | Social proof, testimonials |
| **A**ction | Drive CTA | Single, clear next step |

### PAS (Email, Sales Pages)

| Step | Purpose | Guidance |
|------|---------|----------|
| **P**roblem | Name the pain | "Tired of slow builds?" |
| **A**gitate | Intensify pain | "Every second wasted costs $X" |
| **S**olution | Present fix | "Introducing [Product]" |

### BAB (Case Studies)

| Step | Purpose |
|------|---------|
| **B**efore | Current painful state |
| **A**fter | Desired outcome with specifics |
| **B**ridge | Your solution connects them |

### FAB (Product Descriptions)

| Step | Focus |
|------|-------|
| **F**eature | What it is |
| **A**dvantage | Why it matters |
| **B**enefit | How it helps the user |

---

## Headline Validation (4Us)

| Dimension | Question | Pass/Fail |
|-----------|----------|-----------|
| **U**rgent | Why act now? | Binary |
| **U**nique | What's different? | Binary |
| **U**seful | What's the benefit? | Binary |
| **U**ltra-specific | What exactly? | Binary |

```
❌ "Our Product is Great"           → 0/4 Us
✅ "Cut Build Time by 73% in 48 Hours" → 4/4 Us
```

---

## Copy Validation Rules (5 Rules)

| # | Rule | Check |
|---|------|-------|
| 1 | Benefit-first | Benefits precede features |
| 2 | Single CTA | One call-to-action per piece |
| 3 | Specific claims | Numbers, percentages, or concrete outcomes |
| 4 | No jargon | Conversational tone over corporate language |
| 5 | Read-aloud test | No awkward phrasing when spoken |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_CONTENT_TYPE` | Yes | Content type not provided |
| `ERR_UNKNOWN_CONTENT_TYPE` | No | Content type not in supported list |
| `ERR_MISSING_DRAFT` | Yes | Draft required for validation |
| `ERR_EMPTY_DRAFT` | Yes | Draft is empty |

**Zero internal retries.** Deterministic; same inputs = same output.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Features first | Benefits first |
| Multiple CTAs | One clear action |
| Vague claims ("faster") | Specific numbers ("73% faster") |
| Corporate jargon | Conversational tone |

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `formula_selected` | `{"formula": "PAS", "content_type": "email"}` | `INFO` |
| `validation_passed` | `{"content_type": "headline", "score": "4/4"}` | `INFO` |
| `violations_found` | `{"rule": "benefit-first", "severity": "error"}` | `WARN` |

All copywriting outputs MUST emit `formula_selected`, `validation_passed`, or `violations_found` events when applicable.

---

## 📁 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `seo-optimizer` | Skill | SEO-friendly copy structure |
| `studio` | Skill | Design + copy integration |
| `ai-artist` | Skill | Image generation for ads |

---

⚡ PikaKit v3.9.206
