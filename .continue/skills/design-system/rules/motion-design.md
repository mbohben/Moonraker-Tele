---
name: motion-design
description: Orchestrated entrances — CSS stagger, Framer Motion variants, Anime.js timeline, duration guide
title: "One orchestrated animation > many scattered micro-interactions."
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: motion, design
---

# Motion Design

> One orchestrated animation > many scattered micro-interactions.

---

## Principle: Orchestrated Entrances

Don't scatter animations. Create one impactful page load sequence:

```css
/* Staggered entrance animation */
.hero-title {
  animation: fadeInUp 0.6s ease-out;
}

.hero-subtitle {
  animation: fadeInUp 0.6s ease-out 0.2s;
  animation-fill-mode: backwards;
}

.hero-cta {
  animation: fadeInUp 0.6s ease-out 0.4s;
  animation-fill-mode: backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Animation Timing

| Easing | Use Case |
|--------|----------|
| `ease-out` | Entrances (fast start, slow end) |
| `ease-in` | Exits (slow start, fast end) |
| `ease-in-out` | Continuous motion |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy, playful |

---

## Duration Guidelines

| Element | Duration |
|---------|----------|
| Micro-interactions | 100-200ms |
| Component transitions | 200-400ms |
| Page transitions | 400-600ms |
| Hero animations | 600-1000ms |

---

## React Motion Library

```jsx
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

function Hero() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={fadeUp}>Title</motion.h1>
      <motion.p variants={fadeUp}>Subtitle</motion.p>
      <motion.button variants={fadeUp}>CTA</motion.button>
    </motion.div>
  );
}
```

---

## Anime.js for Complex Animations

```javascript
import anime from 'animejs';

// Timeline for orchestrated sequence
const tl = anime.timeline({
  easing: 'easeOutExpo',
  duration: 750
});

tl
  .add({
    targets: '.hero-title',
    opacity: [0, 1],
    translateY: [50, 0]
  })
  .add({
    targets: '.hero-subtitle',
    opacity: [0, 1],
    translateY: [30, 0]
  }, '-=500') // Overlap by 500ms
  .add({
    targets: '.hero-cta',
    opacity: [0, 1],
    scale: [0.9, 1]
  }, '-=400');
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Animate everything | Selective, purposeful motion |
| Random timing | Consistent timing system |
| Competing animations | Single focal point |
| Slow entrances (>1s) | Quick, impactful (<600ms) |
| Animation without purpose | Motion that guides attention |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [spatial-composition.md](spatial-composition.md) | Layout to animate |
| [color-systems.md](color-systems.md) | Color transitions |
| [../SKILL.md](../SKILL.md) | 1 orchestrated entrance rule |

---

⚡ PikaKit v3.9.206
