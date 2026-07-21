---
name: color-systems
description: Color commitment strategy — dominant + accent + neutral, 4 aesthetic palettes, dark mode
title: "Dominant colors with sharp accents outperform timid, evenly-distributed palettes."
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: color, systems
---

# Color Systems

> Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

---

## Principle: Commit Fully

Don't distribute color evenly. Choose:
- **1 dominant color** (60-70% of palette)
- **1 sharp accent** (10-20% for emphasis)
- **1-2 neutrals** (supporting roles)

---

## Color System Setup

```css
:root {
  /* Primary - dominant presence */
  --color-primary: #1A202C;
  --color-primary-light: #2D3748;
  --color-primary-dark: #0F1419;
  
  /* Accent - sharp, attention-grabbing */
  --color-accent: #F56565;
  --color-accent-hover: #E53E3E;
  
  /* Neutrals - supporting */
  --color-neutral-50: #FAFAFA;
  --color-neutral-100: #F5F5F5;
  --color-neutral-200: #E5E5E5;
  --color-neutral-300: #D4D4D4;
  --color-neutral-700: #525252;
  --color-neutral-900: #171717;
  
  /* Semantic */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}
```

---

## Aesthetic Palettes

### Dark + Bold Accent
```css
--color-bg: #0F0F0F;
--color-text: #FAFAFA;
--color-accent: #FF6B35;
```

### Light Editorial
```css
--color-bg: #FAFAF9;
--color-text: #1C1917;
--color-accent: #DC2626;
```

### Muted Earth
```css
--color-bg: #F5F1EB;
--color-text: #3D3D3D;
--color-accent: #8B7355;
```

### Neon Cyber
```css
--color-bg: #0D1117;
--color-text: #C9D1D9;
--color-accent: #58A6FF;
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| 5+ equally-weighted colors | 1 dominant + 1 accent |
| Default blue (#0066CC) | Distinctive, contextual colors |
| Random gradient | Intentional gradient direction |
| No dark mode | Full dark mode support |
| Hard-coded colors | CSS variables |

---

## Dark Mode

```css
:root {
  --color-bg: #FAFAFA;
  --color-text: #1A1A1A;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1A1A1A;
    --color-text: #FAFAFA;
  }
}

/* Or manual toggle */
[data-theme="dark"] {
  --color-bg: #1A1A1A;
  --color-text: #FAFAFA;
}
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [typography.md](typography.md) | Font pairings that complement colors |
| [motion-design.md](motion-design.md) | Animate color transitions |
| [../SKILL.md](../SKILL.md) | Max 3 brand colors constraint |

---

⚡ PikaKit v3.9.206
