---
name: design-extraction
description: Screenshot analysis process — 4-step extract-document-implement-verify workflow
title: "Design Extraction from Screenshots"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: design, extraction
---

# Design Extraction from Screenshots

> Never jump straight to code. Analyze first.

---

## Extraction Process

```
Screenshot → Analyze → Document → Implement → Verify
```

### Step 1: Analyze Screenshot

Extract these elements:

| Category | What to Extract |
|----------|-----------------|
| **Colors** | All hex codes (primary, accent, neutral, background) |
| **Typography** | Font families, sizes, weights, line-heights |
| **Spacing** | Margin/padding patterns, spacing scale |
| **Layout** | Grid structure, flexbox patterns, positioning |
| **Components** | Button styles, card styles, form elements |
| **Visual** | Shadows, borders, gradients, textures |

---

### Step 2: Document Findings

Create `design-guidelines.md`:

```markdown
# Extracted Design System

## Colors
- Primary: #2D3748
- Accent: #ED8936
- Background: #F7FAFC
- Text: #1A202C

## Typography
### Headings
- Font: Playfair Display
- Sizes: 48px (h1), 32px (h2), 24px (h3)
- Weight: 700
- Line-height: 1.2

### Body
- Font: Source Sans Pro
- Size: 16px
- Weight: 400
- Line-height: 1.6

## Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## Layout
- Max width: 1200px
- Grid: 12 columns
- Gutter: 24px

## Components
### Buttons
- Padding: 12px 24px
- Border-radius: 8px
- Font-weight: 600
```

---

### Step 3: Implement with Precision

```css
/* Match EXACT specifications */
:root {
  --color-primary: #2D3748;
  --color-accent: #ED8936;
  --color-background: #F7FAFC;
  
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Source Sans Pro', sans-serif;
  
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}

.heading {
  font-family: var(--font-heading);
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-primary);
}
```

---

### Step 4: Verify Quality

Compare implementation to original:

| Check | Criteria |
|-------|----------|
| **Colors** | Exact hex match |
| **Typography** | Font, size, weight, line-height |
| **Spacing** | Margins, padding consistent |
| **Layout** | Grid alignment, proportions |
| **Components** | Visual identical |
| **Responsiveness** | Same breakpoint behavior |

---

## Common Extraction Mistakes

| ❌ Mistake | ✅ Fix |
|-----------|-------|
| Guessing colors | Use eyedropper tool |
| Assuming fonts | Identify with WhatFont |
| Ignoring spacing | Measure precisely |
| Skipping small details | Note every shadow, border |
| One-off extraction | Create reusable system |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [color-systems.md](color-systems.md) | Extracted color systematization |
| [typography.md](typography.md) | Identify extracted font pairings |
| [../SKILL.md](../SKILL.md) | Workflow 1: From Screenshots |

---

⚡ PikaKit v3.9.206
