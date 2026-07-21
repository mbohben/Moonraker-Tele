---
name: spatial-composition
description: Layout innovation — asymmetric grids, overlapping elements, diagonal flow, negative space
title: "Break the grid. Create unexpected layouts."
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: spatial, composition
---

# Spatial Composition

> Break the grid. Create unexpected layouts.

---

## Principle: Break Expectations

Don't default to centered, symmetrical layouts. Create visual tension:

- **Asymmetric arrangements**
- **Overlapping elements**
- **Diagonal flow**
- **Generous negative space OR controlled density**

---

## Grid Breaking Techniques

### Asymmetric Grid
```css
.layout {
  display: grid;
  grid-template-columns: 2fr 1fr; /* Unequal columns */
  gap: 48px;
}

/* Or magazine-style */
.layout-magazine {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto auto;
}

.featured {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
}
```

### Overlapping Elements
```css
.card-overlap {
  position: relative;
}

.card-image {
  position: relative;
  z-index: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  margin-top: -60px;
  margin-left: 40px;
  background: white;
  padding: 32px;
}
```

### Diagonal Flow
```css
.diagonal-section {
  clip-path: polygon(0 0, 100% 5%, 100% 100%, 0 95%);
  padding: 120px 0;
}

/* Or with transform */
.diagonal-bg {
  transform: skewY(-3deg);
}

.diagonal-content {
  transform: skewY(3deg); /* Counter-rotate content */
}
```

---

## Negative Space

### Generous Whitespace
```css
.hero {
  padding: 160px 0;
  min-height: 100vh;
}

.section {
  padding: 120px 0;
}

.content {
  max-width: 720px; /* Narrow reading width */
  margin: 0 auto;
}
```

### Controlled Density
```css
.dense-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px; /* Tight gap */
}

.dense-card {
  padding: 16px;
  aspect-ratio: 1;
}
```

---

## Position Breaking

### Off-center Hero
```css
.hero {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 80px;
  align-items: center;
}

.hero-content {
  padding-left: 10%; /* Offset from edge */
}

.hero-image {
  margin-right: -80px; /* Bleed off edge */
}
```

### Sticky Sidebar
```css
.layout-sticky {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;
}

.sidebar {
  position: sticky;
  top: 24px;
  height: fit-content;
}
```

---

## Anti-Patterns

| ❌ Generic | ✅ Distinctive |
|-----------|---------------|
| Everything centered | Intentional asymmetry |
| Equal padding everywhere | Varied spacing with purpose |
| Straight edges only | Occasional diagonals, curves |
| No overlap | Strategic layering |
| Predictable grid | Broken expectations |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [motion-design.md](motion-design.md) | Animate layout transitions |
| [typography.md](typography.md) | Typography scale for layout hierarchy |
| [../SKILL.md](../SKILL.md) | Aesthetic directions and constraints |

---

⚡ PikaKit v3.9.206
