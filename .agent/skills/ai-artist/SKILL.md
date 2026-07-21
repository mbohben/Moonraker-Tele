---
name: ai-artist
description: >-
  Prompt engineering for AI image generation: Midjourney, DALL-E, Stable Diffusion, Flux.
  Use when writing image prompts, configuring generation parameters, or optimizing AI art output.
  NOT for UI design decisions (use design-system) or media file processing (use media-processing).
metadata:
  author: pikakit
  version: "3.9.206"
  category: prompt-engineering
  triggers: ["prompt", "AI prompt", "image generation", "Midjourney", "DALL-E", "Stable Diffusion", "Flux"]
  coordinates_with: ["studio", "media-processing", "context-engineering"]
  success_metrics: ["100% deterministic prompt reproduction"]
---

# AI Artist — Prompt Engineering

> Deterministic prompt construction for LLMs and image generation models. Same inputs = same output.

---

## Prerequisites

**Required:** None — AI Artist is a knowledge-based skill with no external dependencies.

**Optional:**
- Target model API access (Claude, GPT, Gemini, Midjourney, DALL-E, SD, Flux)
- `studio` skill (for design system prompts)
- `media-processing` skill (for post-processing generated images)

---

## When to Use

| Situation | Reference |
|-----------|-----------|
| Structuring LLM prompts | This file — LLM Prompt Pattern |
| Generating image prompts | `rules/image-prompts.md` |
| Marketing/copywriting prompts | `rules/domain-marketing.md` |
| Code generation prompts | `rules/domain-code.md` |
| Model-specific parameters | `rules/model-syntax.md` |
| Architecture review, contracts, security | `rules/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Prompt template construction | API submission to models |
| Domain-specific prompt patterns | Response quality evaluation |
| Model parameter syntax | Content safety filtering |
| Success criteria extraction | Token counting (→ context-engineering) |
| Prompt versioning structure | Design systems (→ studio) |

**Pure function:** This skill produces text output. Zero network calls, zero file mutations, zero side effects.

---

## Execution Model — 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate domain, template, parameters | Validated input or error |
| **Compose** | Apply template, inject parameters, format for model | Structured prompt string |
| **Emit** | Return prompt with metadata and success criteria | Complete output |

All phases execute synchronously. No async pipeline, no queue.

---

## LLM Prompt Pattern

```markdown
[Role] You are a [expertise] specializing in [domain].
[Context] [Background, constraints, audience]
[Task] [Specific action to perform]
[Format] [Output structure: markdown, JSON, etc.]
[Constraints] [Word limit, tone, technical level]
[Examples]
Good: [Example of desired output]
Bad: [Example to avoid]
```

---

## Image Prompt Pattern

```
[Subject] + [Style] + [Composition] + [Quality] + [Model Parameters]
```

**Parameter ordering is fixed:** subject → style → composition → quality → model_params.

**Example:**
```
Portrait of cyberpunk hacker, neon purple lighting, cinematic close-up,
volumetric fog, 8k render, artstation quality --ar 16:9 --style raw
```

| Element | Purpose | Example |
|---------|---------|---------|
| Subject | What to generate | "portrait of cyberpunk hacker" |
| Style | Visual aesthetic | "neon lighting, cinematic" |
| Composition | Framing | "close-up, shallow depth of field" |
| Quality | Render markers | "8k, artstation quality" |
| Parameters | Model-specific | `--ar 16:9 --style raw` |

---

## Supported Models

| Model | Domain | Parameter Reference |
|-------|--------|---------------------|
| Claude, GPT, Gemini | Text, Code, Marketing | Core LLM pattern (above) |
| Midjourney | Image | `rules/model-syntax.md` — `--ar`, `--style`, `--chaos` |
| DALL-E | Image | `rules/model-syntax.md` — size, quality, style |
| Stable Diffusion | Image | `rules/model-syntax.md` — steps, cfg, sampler |
| Flux | Image | `rules/model-syntax.md` — guidance, steps |

Unknown model → generic format (no model-specific parameters injected).

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_DOMAIN` | No | Domain not one of: text, image, code, marketing |
| `ERR_INVALID_TEMPLATE` | No | Template not one of: role-task, subject-style, chain-of-thought, few-shot |
| `ERR_MISSING_PARAM` | Yes | Required parameter is null or empty |
| `ERR_UNKNOWN_MODEL` | Yes | Model not recognized; falls back to generic format |
| `ERR_TEMPLATE_NOT_FOUND` | No | Reference file missing from skill directory |
| `ERR_PARAM_CONFLICT` | Yes | Contradictory parameters (e.g., format=json + template=subject-style) |
| `ERR_PARAM_TOO_LONG` | Yes | Parameter exceeds maximum character limit |

**Zero internal retries.** Deterministic output makes retries meaningless for same input.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| "Make it better" | "Increase contrast by 20%" |
| "Professional but casual" | Choose one tone, specify explicitly |
| Skip context/constraints | Set role, audience, constraints upfront |
| Over-prompt with 10+ directives | Focus on 3–5 core requirements |
| Assume model compatibility | Check `rules/model-syntax.md` for target model |

---

## Troubleshooting

| Problem | Cause | Resolution |
|---------|-------|------------|
| Vague output | Missing constraints | Add specific criteria: "under 150 words", "technical audience" |
| Wrong visual style | Style description too generic | Use style references: "in the style of [artist/work]" |
| Busy image composition | Too many subjects | Reduce to one primary subject, simplify background |
| Inconsistent results | No seed parameter | Add `--seed` for Midjourney/SD; not controllable for LLMs |
| Syntax errors in model params | Wrong model format | Check `rules/model-syntax.md` for correct syntax |
| Token limit exceeded | Prompt too long | Estimate: ~4 chars/token for English; trim constraints |

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [image-prompts.md](rules/image-prompts.md) | Image generation techniques, styles, composition | Visual AI prompts |
| [domain-marketing.md](rules/domain-marketing.md) | Marketing copy, AIDA/PAS formulas | Copywriting prompts |
| [domain-code.md](rules/domain-code.md) | Code generation patterns | Programming prompts |
| [model-syntax.md](rules/model-syntax.md) | Model-specific parameters | Midjourney, SD, DALL-E, Flux |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review, integration |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `studio` | Skill | Design system generation, color palettes |
| `media-processing` | Skill | Post-processing generated images |
| `context-engineering` | Skill | Token management, context window planning |

---

⚡ PikaKit v3.9.206
