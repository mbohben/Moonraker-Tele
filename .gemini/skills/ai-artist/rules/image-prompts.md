---
name: image-prompts
description: Image generation techniques — subject types, style keywords, composition, quality boosters, negative prompts, weighted tokens, recipes
title: "Image Generation Prompts"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: image, prompts
---

# Image Generation Prompts

> Techniques for Midjourney, DALL-E, Stable Diffusion, Flux.

---

## Prompt Structure (Fixed Order)

```
[Subject] + [Style] + [Composition] + [Quality] + [Parameters]
```

**Order matters.** Subject first, model parameters last. Never rearrange.

---

## Subject Types

| Type | Example | Tips |
|------|---------|------|
| Portrait | "portrait of young woman with silver hair" | Describe features, expression, clothing |
| Product | "floating smartphone mockup" | Clean background, studio lighting |
| Scene | "cozy coffee shop interior" | Set time of day, weather, mood |
| Abstract | "geometric patterns in motion" | Describe shapes, flow, color |
| Architecture | "brutalist concrete building" | Mention materials, era, setting |
| Food | "artisan sourdough bread on wooden board" | Describe texture, steam, props |

### Multi-Subject Rules

| # Subjects | Technique |
|-----------|-----------|
| 1 | Direct description (best quality) |
| 2 | "A and B" or "A with B" |
| 3+ | Simplify — each extra subject reduces quality |

---

## Style Keywords

| Category | Keywords |
|----------|----------|
| **Lighting** | golden hour, neon, rim lighting, volumetric, backlighting, studio, rembrandt |
| **Mood** | cinematic, ethereal, dramatic, moody, serene, intense, peaceful |
| **Art style** | watercolor, oil painting, digital art, 3D render, pencil sketch, pixel art |
| **Era** | cyberpunk, retro 80s, futuristic, vintage, art deco, medieval |
| **Medium** | photograph, illustration, concept art, anime, vector art |

### Style Combinations (Recipes)

| Recipe | Prompt Snippet | Best For |
|--------|---------------|----------|
| **Cinematic Hero** | cinematic, dramatic lighting, shallow depth of field, 8k | Landing pages, headers |
| **Product Clean** | studio lighting, white background, professional product photo | E-commerce, mockups |
| **Editorial Film** | 35mm film grain, natural light, candid, editorial photography | Blog, magazine |
| **Digital Art** | digital painting, vibrant colors, artstation quality, trending | Gaming, creative |
| **Dark Moody** | dark atmospheric, volumetric fog, rim lighting, desaturated | Tech, premium |
| **Watercolor Soft** | watercolor wash, soft edges, pastel palette, handmade texture | Organic, lifestyle |

---

## Composition

| Element | Keywords |
|---------|----------|
| **Angle** | close-up, wide shot, bird's eye, dutch angle, low angle, over-the-shoulder |
| **Focus** | shallow depth of field, bokeh, tilt-shift, macro, sharp focus |
| **Environment** | fog, rain, particles, lens flare, golden dust, smoke |
| **Framing** | rule of thirds, centered, symmetrical, negative space |

### Aspect Ratio Guide

| Ratio | Use Case |
|-------|----------|
| `1:1` | Social media, avatars, icons |
| `4:3` | Product photos, presentations |
| `16:9` | Hero images, headers, cinematic |
| `9:16` | Mobile, stories, vertical content |
| `2:3` | Portrait, Pinterest, posters |

---

## Quality Boosters

```
8k, ultra detailed, professional, artstation quality,
award-winning, masterpiece, highly detailed
```

### Quality Tier

| Level | Keywords | When |
|-------|----------|------|
| **Standard** | detailed, professional | Most use cases |
| **High** | 8k, ultra detailed, artstation quality | Hero images |
| **Maximum** | masterpiece, award-winning, photorealistic, hyperrealistic | Key visuals |

---

## Negative Prompts (Stable Diffusion / Flux)

### Universal Negative

```
blurry, low quality, distorted, bad anatomy, watermark,
signature, text, cropped, out of frame, worst quality
```

### Domain-Specific Negatives

| Domain | Additional Negatives |
|--------|---------------------|
| **Portrait** | deformed face, extra fingers, mutated hands, bad proportions |
| **Product** | background clutter, text overlay, logo, shadow artifacts |
| **Architecture** | distorted perspective, floating elements, impossible geometry |
| **Food** | unappetizing, artificial look, oversaturated |

---

## Weighted Tokens (Stable Diffusion)

```
(keyword:1.3)   → Increase emphasis (1.0-1.5 range)
(keyword:0.7)   → Decrease emphasis (0.5-1.0 range)
[keyword]       → De-prioritize
```

### Weight Guidelines

| Weight | Effect | Use |
|--------|--------|-----|
| `1.0` | Normal | Default |
| `1.1-1.2` | Subtle boost | Ensure element appears |
| `1.3-1.5` | Strong boost | Make element dominant |
| `>1.5` | ⚠️ Artifacts | Avoid — causes distortion |
| `0.5-0.7` | Subtle reduce | Background element |

**Example:**

```
(cyberpunk:1.3), neon city at night, (rain reflections:1.2),
cinematic wide shot, volumetric fog, 8k render

Negative: blurry, low quality, text, watermark
```

---

## Complete Prompt Examples

### Product Photography

```
Floating wireless earbuds on marble surface, soft studio lighting,
clean white background, professional product photo, 8k, sharp focus,
commercial photography --ar 4:3
```

### Cinematic Portrait

```
Portrait of elderly fisherman, weathered face, golden hour
backlighting, shallow depth of field, 35mm film grain,
editorial photography, National Geographic quality --ar 2:3
```

### Tech Hero Image

```
Abstract network visualization, glowing blue nodes connected by
light threads, dark background, volumetric lighting, futuristic,
data visualization art, 8k render --ar 16:9 --style raw
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [model-syntax.md](model-syntax.md) | Model-specific parameters (--ar, --style, etc.) |
| [domain-marketing.md](domain-marketing.md) | Marketing visual prompts |
| [../SKILL.md](../SKILL.md) | Image prompt pattern and anti-patterns |

---

⚡ PikaKit v3.9.206
