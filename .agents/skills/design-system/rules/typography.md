---
name: typography
description: Distinctive font pairings, fluid typography scale, display vs body rules, variable fonts
title: "Typography for Distinctive Design"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: typography
---

# Typography for Distinctive Design

> Break the default. Stop using Inter, Roboto, Arial.

---

## Distinctive Font Pairings

| Pairing | Display | Body | Mood |
|---------|---------|------|------|
| **Editorial** | Playfair Display | Source Sans Pro | Elegant, magazine |
| **Modern Tech** | Syne | IBM Plex Sans | Bold, technical |
| **Refined** | Fraunces | Work Sans | Warm, crafted |
| **Clean Cut** | DM Serif Display | DM Sans | Sharp, professional |
| **Brutalist** | Space Mono | Space Grotesk | Raw, technical |
| **Luxe** | Cormorant Garamond | Inter | Sophisticated |

---

## Typography Scale

```css
:root {
  /* Fluid typography with clamp */
  --text-xs: clamp(12px, 1vw, 14px);
  --text-sm: clamp(14px, 1.2vw, 16px);
  --text-base: clamp(16px, 1.5vw, 18px);
  --text-lg: clamp(18px, 2vw, 20px);
  --text-xl: clamp(24px, 3vw, 30px);
  --text-2xl: clamp(32px, 4vw, 40px);
  --text-3xl: clamp(40px, 5vw, 56px);
  --text-4xl: clamp(48px, 6vw, 72px);
  --text-hero: clamp(56px, 8vw, 120px);
}

/* Line heights */
--leading-tight: 0.95;
--leading-snug: 1.1;
--leading-normal: 1.5;
--leading-relaxed: 1.65;
```

---

## Display vs Body

**Display fonts** (headings): Character, personality, memorable
- Use sparingly: hero, h1, h2
- Large sizes: 32px+
- Tight line-height: 0.95-1.1
- Negative letter-spacing: -0.02em to -0.04em

**Body fonts** (text): Readable, neutral, comfortable
- Use everywhere else
- 16-20px base size
- Relaxed line-height: 1.5-1.65
- Normal letter-spacing

---

## Anti-Pattern: Generic Typography

| ❌ Don't | ✅ Do |
|---------|-------|
| Inter everywhere | Distinctive display + neutral body |
| System fonts | Custom Google Fonts |
| Same size for all headings | Clear hierarchy with scale |
| Default line-height | Tight for display, relaxed for body |
| No letter-spacing | Adjust per context |

---

## Loading Fonts

```html
<!-- Preconnect for performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Load specific weights -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+Pro:wght@400;600&display=swap" rel="stylesheet">
```

---

## Variable Fonts

For advanced control:

```css
@font-face {
  font-family: 'Inter Variable';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
}

.dynamic-weight {
  font-family: 'Inter Variable', sans-serif;
  font-weight: 450; /* Any value 100-900 */
}
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [color-systems.md](color-systems.md) | Color palette to complement typography |
| [spatial-composition.md](spatial-composition.md) | Layout for text-heavy pages |
| [../SKILL.md](../SKILL.md) | Design constraints and anti-slop bans |

---

⚡ PikaKit v3.9.206
