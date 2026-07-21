---
title: Tailwind v4 Configuration
impact: MEDIUM
tags: tailwind-kit
---

# Tailwind v4 Configuration

## Full Theme Configuration

```css
@theme {
  /* Colors - OKLCH for perceptual uniformity */
  --color-primary: oklch(0.7 0.15 250);
  --color-primary-hover: oklch(0.65 0.18 250);
  --color-secondary: oklch(0.6 0.1 180);
  
  --color-surface: oklch(0.98 0 0);
  --color-surface-dark: oklch(0.15 0 0);
  --color-surface-elevated: oklch(1 0 0);
  
  --color-text: oklch(0.2 0 0);
  --color-text-muted: oklch(0.5 0 0);
  --color-text-inverse: oklch(0.95 0 0);
  
  /* Spacing scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-display: 'Outfit', sans-serif;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

## Extending vs Overriding

| Action | Use When |
|--------|----------|
| **Extend** | Adding new values alongside defaults |
| **Override** | Replacing default scale entirely |
| **Semantic tokens** | Project-specific naming |

## OKLCH Color Format

```
oklch(lightness chroma hue)
     0-1       0-0.4  0-360
```

- **Lightness:** 0 = black, 1 = white
- **Chroma:** 0 = gray, higher = more colorful
- **Hue:** 0 = red, 120 = green, 240 = blue

---

? PikaKit v3.9.206
