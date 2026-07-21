# Ai Artist

**Version 3.9.121**
Engineering
April 2026

> **Note:**
> This document is for agents and LLMs to follow when working on ai-artist tasks.
> Optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

This document compiles 5 rules across 4 categories for the Ai Artist skill. Prompt engineering for AI image generation: Midjourney, DALL-E, Stable Diffusion, Flux.

---

## Table of Contents

1. [Domain](#1-domain) — **LOW**
   - 1.1 [Domain Code](#11-domain-code)
   - 1.2 [Domain Marketing](#12-domain-marketing)
2. [Engineering](#2-engineering) — **MEDIUM**
   - 2.1 [Engineering Spec](#21-engineering-spec)
3. [Image](#3-image) — **LOW**
   - 3.1 [Image Prompts](#31-image-prompts)
4. [Model](#4-model) — **LOW**
   - 4.1 [Model Syntax](#41-model-syntax)

---

## 1. Domain

**Impact: LOW**

Domain patterns and best practices.


# Code Generation Prompt Patterns

> Templates for generating code with AI.

---

## Function Generation

```markdown
[Role] You are a senior [language] developer.
[Context] Project uses [framework], follows [style guide].
[Task] Write a function that [specific behavior].
[Format] TypeScript with JSDoc, include error handling.

[Constraints]
- Pure function (no side effects)
- Handle edge cases: null, empty, invalid input
- Include type definitions
- Add unit test examples

[Example signature]
function processPayment(amount: number, currency: string): PaymentResult
```

---

## Code Review

```markdown
[Role] You are a code reviewer with security focus.
[Context] PR for [feature], affects [components].
[Task] Review this code for issues.
[Format] Categorized feedback: Critical, Important, Suggestion.

[Check for]
- Security vulnerabilities (OWASP Top 10)
- Performance issues (N+1, memory leaks)
- Code style violations
- Missing error handling
- Test coverage gaps
```

---

## Refactoring

```markdown
[Role] You are a software architect.
[Context] Legacy code in [language], needs modernization.
[Task] Refactor this code to [goal: reduce complexity, improve performance].
[Format] Show before/after with explanation.

[Constraints]
- Maintain backward compatibility
- Improve readability
- Add types if missing
- Keep same public API
```

---

## Debugging

```markdown
[Role] You are a debugging expert.
[Context] Error: [error message], Environment: [prod/dev], Stack: [tech stack]
[Task] Analyze this error and suggest fixes.
[Format] 
1. Root cause analysis
2. Immediate fix
3. Long-term solution
4. Prevention strategy

[Provide]
- Error logs
- Relevant code
- Steps to reproduce
```

---

## API Design

```markdown
[Role] You are an API architect.
[Context] Building [REST/GraphQL] API for [domain].
[Task] Design endpoints for [feature].
[Format] OpenAPI spec with examples.

[Include]
- Request/response schemas
- Error codes and messages
- Rate limiting considerations
- Authentication requirements
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [domain-marketing.md](domain-marketing.md) | Marketing copy prompt patterns |
| [model-syntax.md](model-syntax.md) | Model-specific parameters |
| [../SKILL.md](../SKILL.md) | LLM prompt pattern and anti-patterns |

---

⚡ PikaKit v3.9.206


# Marketing Prompt Patterns

> Templates for generating marketing copy with AI.

---

## Headlines

```markdown
[Role] You are a conversion-focused copywriter.
[Context] Product: [product], Audience: [target], Goal: [objective]
[Task] Write 5 headline variations using proven formulas.
[Format] Each headline with formula name in parentheses.

[Formulas]
- AIDA: Attention, Interest, Desire, Action
- PAS: Problem, Agitate, Solution
- 4U: Useful, Urgent, Unique, Ultra-specific
```

---

## Product Descriptions

```markdown
[Role] You are a persuasive product copywriter.
[Context] Product: [name], Price: [range], Audience: [demographic]
[Task] Write a [length] product description.
[Format] Structure: Hook, 3 benefits with emotional triggers, CTA.

[Example]
Good: "Silence the chaos. ProSound X500 delivers studio-grade quiet so you focus on what matters."
Bad: "These headphones have good noise cancellation features."
```

---

## Email Sequences

```markdown
[Role] You are an email marketing specialist.
[Context] Product: [name], Sequence: [welcome/nurture/sales]
[Task] Write a [N]-email sequence for [goal].
[Format] For each email: Subject line, Preview text, Body (150 words max), CTA.

[Constraints]
- Subject lines under 50 characters
- One clear CTA per email
- Progressive disclosure of value
```

---

## Ad Copy

```markdown
[Role] You are a performance marketing copywriter.
[Context] Platform: [FB/Google/LinkedIn], Objective: [awareness/conversion]
[Task] Write [N] ad variations for A/B testing.
[Format] Headline (30 chars), Description (90 chars), CTA.

[Guidelines]
- Lead with benefit, not feature
- Include social proof if available
- Use power words: free, new, proven, guaranteed
```

---

## Social Media

```markdown
[Role] You are a social media content creator.
[Context] Brand: [tone], Platform: [platform], Goal: [engagement/traffic]
[Task] Write [N] post variations for [topic].
[Format] Post text, Hashtags (5 max), Best posting time.

[Platform-specific]
- Twitter: Under 280 chars, conversational
- LinkedIn: Professional, 1300 chars max
- Instagram: Story-driven, emoji-friendly
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [domain-code.md](domain-code.md) | Code generation prompt patterns |
| [image-prompts.md](image-prompts.md) | Visual prompts for marketing assets |
| [../SKILL.md](../SKILL.md) | LLM prompt pattern and anti-patterns |

---

⚡ PikaKit v3.9.206

---

## 2. Engineering

**Impact: MEDIUM**

Full engineering specification covering contracts, security, and scalability.


# AI Artist — Engineering Specification

> Production-grade specification for AI prompt engineering across text and image generation models at FAANG scale.

---

## 1. Overview

AI Artist provides structured prompt engineering patterns for AI text generation (Claude, GPT, Gemini) and image generation (Midjourney, DALL-E, Stable Diffusion, Flux). The skill codifies prompt construction into deterministic, composable templates that produce consistent outputs across models and domains.

The skill operates as a knowledge base, not a runtime executor. It does not call external APIs directly. It produces structured prompt artifacts that agents or users submit to target models.

---

## 2. Problem Statement

AI prompt engineering at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Prompt inconsistency | Same intent produces divergent outputs across sessions | 40–60% iteration waste on prompt refinement |
| Domain knowledge fragmentation | Prompt patterns scattered across teams/docs | Duplicated effort, no institutional learning |
| Model-specific syntax errors | Wrong parameters for target model | Failed generations, wasted API credits |
| No quality feedback loop | No structured way to track prompt effectiveness | Cannot measure improvement over time |

AI Artist eliminates these by providing versioned, domain-specific prompt templates with model-aware parameter injection.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Deterministic prompt construction | Same inputs + same template = identical prompt output |
| G2 | Model-portable patterns | Core prompt structure works across Claude, GPT, Gemini without modification |
| G3 | Domain-specific specialization | Separate reference files for code, marketing, image domains (≤ 4 reference files per domain) |
| G4 | Minimal iteration cycles | Target ≤ 3 refinement iterations to reach desired output quality |
| G5 | Measurable prompt quality | Every prompt includes explicit success criteria the output can be validated against |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Direct API calls to LLM/image providers | This skill produces prompts, not API requests; execution is the caller's responsibility |
| NG2 | Prompt response evaluation | Output quality assessment is subjective and model-dependent; owned by the caller |
| NG3 | Fine-tuning or model training | Out of scope; requires specialized ML infrastructure |
| NG4 | Image post-processing | Owned by `media-processing` skill |
| NG5 | Design system generation | Owned by `studio` skill |
| NG6 | Token counting or context window management | Model-specific; handled by `context-engineering` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Prompt template construction | Pattern composition, parameter injection | API submission, response parsing |
| Domain knowledge | Code, marketing, image prompt patterns | Business-specific terminology |
| Model syntax | Midjourney, DALL-E, SD, Flux parameters | Model version compatibility tracking |
| Quality criteria | Defining success criteria in prompts | Evaluating whether output meets criteria |
| Prompt versioning | Template structure and naming | Storage backend, version control system |

**Side-effect boundary:** AI Artist produces text artifacts (prompts). It does not make network requests, modify files outside the prompt output, or interact with any external service.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Domain: string              # One of: "text" | "image" | "code" | "marketing"
Model: string | null        # Target model: "claude" | "gpt" | "gemini" | "midjourney" | "dalle" | "sd" | "flux" | null
Template: string            # Template type: "role-task" | "subject-style" | "chain-of-thought" | "few-shot"
Parameters: {
  role: string | null       # For text: "You are a [role]"
  context: string | null    # Background, constraints, audience
  task: string              # The specific action to perform
  format: string | null     # Desired output format: "markdown" | "json" | "csv" | "plaintext"
  examples: Array<{input: string, output: string}> | null  # Few-shot examples
  constraints: Array<string> | null  # "Under 150 words", "p95 <200ms", etc.
  # Image-specific:
  subject: string | null    # What to generate
  style: string | null      # Visual aesthetic
  composition: string | null # Framing and layout
  quality: string | null    # Render quality markers
  model_params: object | null # Model-specific: --ar, --style, --seed, etc.
}
contract_version: string    # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  prompt: string            # The constructed prompt, ready for submission
  model: string             # Target model the prompt is formatted for
  domain: string            # Domain used
  template: string          # Template applied
  token_estimate: number    # Estimated token count (approximate, ±10%)
  success_criteria: Array<string>  # Measurable criteria extracted from constraints
  metadata: {
    version: string         # Prompt template version
    parameters_used: object # Echo of input parameters for reproducibility
    contract_version: string    # "2.0.0"
    backward_compatibility: string  # "breaking"
  }
}
Error: ErrorSchema | null
```

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

#### Error Schema

```
Code: string        # From Error Taxonomy (Section 11)
Message: string     # Human-readable, single line
Domain: string      # text | image | code | marketing
Recoverable: boolean
```

#### Deterministic Guarantees

- Same `Domain` + `Template` + `Parameters` = identical `prompt` output, character-for-character.
- Template selection is deterministic: no randomization, no A/B selection.
- Model parameter injection follows fixed ordering rules (subject → style → composition → quality → model_params).
- Token estimates use a fixed heuristic (4 chars per token for English text); no external API calls.

#### What Agents May Assume

- Output `prompt` is syntactically valid for the specified `model`.
- Model-specific parameters (e.g., `--ar 16:9` for Midjourney) are injected in the correct position and format.
- `success_criteria` contains all measurable constraints from the input, extracted verbatim.
- The skill is stateless; no prior invocation affects current output.

#### What Agents Must NOT Assume

- The generated prompt will produce the desired output from the target model (model behavior is non-deterministic).
- Token estimates are exact; they are heuristic-based with ±10% variance.
- Prompt templates are compatible across model versions (model syntax may change across versions).
- The skill validates prompt content for safety, bias, or policy compliance.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Prompt construction | None; pure function producing text output |
| Template lookup | Read-only access to `rules/` directory |
| Parameter injection | None; string interpolation only |
| Token estimation | None; arithmetic calculation only |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Select domain (text | image | code | marketing)
2. Choose template (role-task | subject-style | chain-of-thought | few-shot)
3. Provide parameters (role, task, constraints, examples, etc.)
4. Receive constructed prompt
5. Submit prompt to target model (caller's responsibility)
6. Evaluate output against success_criteria (caller's responsibility)
7. If unsatisfactory: refine parameters, re-invoke (max 3 iterations recommended)
```

#### Execution Guarantees

- Prompt construction is synchronous and completes in a single invocation.
- No background processes, no deferred execution, no callbacks.
- Output is complete and self-contained; no partial prompts are returned.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid domain/template | Return error to caller | Fix input parameters |
| Missing required parameter | Return error to caller | Supply missing parameter |
| Unknown model | Return error to caller | Use supported model or null for generic |
| Template file missing | Return error to caller | Verify skill installation |

Failures are isolated to the current invocation. No state carries between invocations.

#### Retry Boundaries

- AI Artist does not retry internally. Given deterministic output, retrying the same input produces the same output.
- Callers should modify parameters between retries to produce different prompt variations.
- Recommended maximum iterations: 3 per generation task.

#### Isolation Model

- Each invocation is stateless and independent.
- No shared state between invocations, sessions, or agents.
- Template files are read-only resources.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Prompt construction | Yes | Same inputs = same output, always |
| Template lookup | Yes | Read-only, no mutation |
| Token estimation | Yes | Deterministic arithmetic |

---

## 7. Execution Model

### 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate domain, template, parameters | Validated input or error |
| **Compose** | Apply template, inject parameters, format for model | Structured prompt string |
| **Emit** | Return prompt with metadata and success criteria | Complete output schema |

**All phases execute synchronously in a single invocation.** There is no async pipeline, no queue, no deferred processing.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| No randomization | Template selection, parameter ordering, and output formatting are fixed |
| No external calls | Prompt construction uses only local template files and input parameters |
| No ambient state | Each invocation operates solely on explicit inputs |
| Fixed parameter ordering | Image prompts: subject → style → composition → quality → model_params |
| Reproducible output | Input parameters are echoed in output metadata for full reproducibility |

---

## 9. State & Idempotency Model

### State Machine

```
States: IDLE (single state — skill is stateless)
Transitions: None — each invocation is independent
```

AI Artist maintains zero persistent state. Every invocation starts from a clean state and produces output solely from inputs + template files. This makes the skill fully idempotent: invoking it N times with identical inputs produces N identical outputs.

### Template Versioning

- Templates are versioned via `metadata.version` in the SKILL.md frontmatter.
- Template changes that alter output format require a version bump.
- Callers can pin to a specific version by referencing a specific template revision.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown domain | Return `ERR_INVALID_DOMAIN` | Use one of: text, image, code, marketing |
| Unknown template | Return `ERR_INVALID_TEMPLATE` | Use one of: role-task, subject-style, chain-of-thought, few-shot |
| Missing required parameter | Return `ERR_MISSING_PARAM` with field name | Supply the missing parameter |
| Unknown model | Return `ERR_UNKNOWN_MODEL` | Use supported model or null for generic format |
| Template file not found | Return `ERR_TEMPLATE_NOT_FOUND` | Verify skill installation integrity |
| Conflicting parameters | Return `ERR_PARAM_CONFLICT` with conflicting fields | Resolve the conflict |
| Parameter exceeds length limit | Return `ERR_PARAM_TOO_LONG` with field and limit | Shorten the parameter value |

**Invariant:** Every failure returns a structured error. No invocation fails silently or returns a partial prompt.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_DOMAIN` | Validation | No | Domain is not one of: text, image, code, marketing |
| `ERR_INVALID_TEMPLATE` | Validation | No | Template is not one of the supported types |
| `ERR_MISSING_PARAM` | Validation | Yes | Required parameter is null or empty |
| `ERR_UNKNOWN_MODEL` | Validation | Yes | Model identifier not recognized; generic format used as fallback |
| `ERR_TEMPLATE_NOT_FOUND` | Infrastructure | No | Reference template file missing from skill directory |
| `ERR_PARAM_CONFLICT` | Validation | Yes | Two parameters contradict each other (e.g., format=json + template=subject-style) |
| `ERR_PARAM_TOO_LONG` | Validation | Yes | Parameter exceeds maximum character limit |

---

## 12. Timeout & Retry Policy

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Execution timeout | N/A | Prompt construction is synchronous string manipulation; completes in < 50ms |
| Internal retries | Zero | Deterministic output makes retries meaningless for same input |
| Caller retry limit | 3 iterations recommended | Each retry should modify parameters to vary output |
| Template file read timeout | 1,000 ms | Filesystem read; fail immediately if file is inaccessible |

**Retry policy:** Zero internal retries. Since output is deterministic, retrying the same input produces the same result. Callers should modify parameters between invocations.

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "ai-artist",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "domain": "string",
  "model": "string|null",
  "template": "string",
  "status": "success|error",
  "error_code": "string|null",
  "prompt_length_chars": "number",
  "token_estimate": "number",
  "duration_ms": "number",
  "parameters_hash": "string"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Prompt constructed | INFO | All fields |
| Construction failed | ERROR | All fields + error_code |
| Template file read | DEBUG | template path, read duration |
| Unknown model fallback | WARN | requested model, fallback used |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `prompt.construction.duration` | Histogram | ms |
| `prompt.construction.error_rate` | Counter | per error_code |
| `prompt.output.char_count` | Histogram | characters |
| `prompt.output.token_estimate` | Histogram | tokens |
| `prompt.domain.usage` | Counter | per domain |
| `prompt.model.usage` | Counter | per model |

---

## 14. Security & Trust Model

### Content Safety

- AI Artist does not filter or validate prompt content for safety, bias, or policy compliance.
- Content moderation is the caller's responsibility before submitting generated prompts to target models.
- This boundary is explicit: the skill is a prompt construction tool, not a content governance tool.

### Credential Handling

- AI Artist does not store, process, or transmit API keys, tokens, or credentials.
- Model-specific authentication is the caller's responsibility.

### Template Integrity

- Template files in `rules/` are read-only resources.
- Template modifications require a version bump in SKILL.md frontmatter.
- No runtime template injection; templates are static files, not user-supplied code.

### Input Sanitization

- User-supplied parameters are interpolated as literal strings into templates.
- No template evaluation engine (no eval, no code execution from parameters).
- Parameters containing template syntax markers are escaped before interpolation.

### Multi-Tenant Boundaries

- Each invocation is stateless; no data persists between invocations.
- No invocation can access parameters or outputs from another invocation.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound string manipulation | Scales linearly with CPU; no bottleneck |
| Concurrency | Stateless invocations | Unlimited parallel invocations; no shared state |
| Template storage | 4 reference files (~8 KB total) | Static files; no growth concern |
| Memory per invocation | < 1 MB (prompt + metadata) | No accumulation; GC after return |
| Network | Zero network calls | No external dependency |

### Capacity Planning

| Metric | Per Invocation | Per Node |
|--------|---------------|----------|
| CPU | < 5 ms computation | 200,000+ invocations/second (single core) |
| Memory | < 1 MB | Bound only by concurrent invocations |
| Disk I/O | Single template file read (~2 KB) | Cached by OS after first read |
| Network | Zero | Zero |

---

## 16. Concurrency Model

| Scope | Model | Behavior |
|-------|-------|----------|
| Within invocation | Sequential | Parse → Compose → Emit, no internal parallelism |
| Across invocations | Fully parallel | No shared state, no locks, no coordination needed |
| Template access | Read-only shared | Multiple concurrent reads are safe; no write contention |

**No undefined behavior:** Since the skill is stateless with read-only resource access, any level of concurrency is safe by design.

---

## 17. Resource Lifecycle Management

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Prompt string | Compose phase | Caller (after consumption) | Invocation scope |
| Template file handle | Parse phase | Emit phase (auto-close) | < 10 ms |
| Input parameters | Caller | Invocation completion | Invocation scope |
| Output metadata | Emit phase | Caller (after consumption) | Invocation scope |

**Leak prevention:** All resources are scoped to a single invocation. No persistent handles, connections, or buffers.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Full prompt construction | < 5 ms | < 20 ms | 50 ms |
| Template file read | < 1 ms | < 5 ms | 1,000 ms |
| Token estimation | < 1 ms | < 1 ms | 5 ms |
| Output prompt size (text) | ≤ 500 chars | ≤ 2,000 chars | 10,000 chars |
| Output prompt size (image) | ≤ 200 chars | ≤ 500 chars | 2,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Model syntax changes | Medium | Prompts use outdated parameters | Version model syntax in `rules/model-syntax.md`; update on model releases |
| Prompt injection via parameters | Medium | Malicious content in generated prompts | Caller responsibility; AI Artist does literal interpolation, not evaluation |
| Template file corruption | Low | Construction failures | `ERR_TEMPLATE_NOT_FOUND`; re-install skill from source |
| Over-reliance on token estimates | High | Prompts exceed model context window | Estimates are ±10%; callers must validate against actual model limits |
| Domain pattern staleness | Medium | Patterns become less effective over time | Periodic review cycle; version bumps signal updates |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point SKILL.md under 200 lines; details in rules/ |
| Prerequisites documented | ✅ | No external dependencies required |
| When to Use section | ✅ | Domain-based decision matrix |
| Quick Reference with patterns | ✅ | LLM and image prompt patterns with examples |
| Core content matches skill type | ✅ | Expert type: domain knowledge tables, prompt patterns |
| Troubleshooting section | ✅ | Problem/solution table |
| Related section | ✅ | Cross-links to studio, media-processing |
| Content Map for multi-file | ✅ | Links to 4 reference files + engineering-spec.md |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | All 4 domains (text, image, code, marketing) specified | ✅ |
| **Functionality** | All 4 templates (role-task, subject-style, chain-of-thought, few-shot) specified | ✅ |
| **Functionality** | 7 model targets specified with fallback behavior | ✅ |
| **Contracts** | Input/output/error schemas defined | ✅ |
| **Contracts** | Agent assumptions and non-assumptions documented | ✅ |
| **Contracts** | Workflow invocation pattern specified | ✅ |
| **Failure** | Error taxonomy with 7 categorized error codes | ✅ |
| **Failure** | No silent failures; every error returns structured response | ✅ |
| **Failure** | Retry policy: zero internal retries, caller-owned | ✅ |
| **Determinism** | Same inputs = same output guaranteed | ✅ |
| **Determinism** | No randomization, no external calls, no ambient state | ✅ |
| **Security** | No credential handling; no content filtering (explicit boundary) | ✅ |
| **Security** | Input sanitization: literal interpolation, no eval | ✅ |
| **Observability** | Structured log schema with 4 log points | ✅ |
| **Observability** | 6 metrics defined with types and units | ✅ |
| **Performance** | P50/P99 targets for all operations | ✅ |
| **Scalability** | Stateless; unlimited parallel invocations | ✅ |
| **Concurrency** | No shared state; read-only template access | ✅ |
| **Resources** | All resources scoped to invocation lifetime | ✅ |
| **Idempotency** | Fully idempotent — all operations are pure functions | ✅ |
| **Compliance** | All skill-design-guide.md sections present | ✅ |

---



---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [image-prompts.md](image-prompts.md) | Image generation techniques |
| [domain-marketing.md](domain-marketing.md) | Marketing copy patterns |
| [domain-code.md](domain-code.md) | Code generation patterns |
| [model-syntax.md](model-syntax.md) | Model-specific parameters |
| [../SKILL.md](../SKILL.md) | Quick reference and anti-patterns |

---

⚡ PikaKit v3.9.206

---

## 3. Image

**Impact: LOW**

Image patterns and best practices.


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

---

## 4. Model

**Impact: LOW**

Model patterns and best practices.


# Model-Specific Syntax

> Parameters and syntax for different AI image models.

---

## Midjourney

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `--ar` | Aspect ratio | `--ar 16:9` |
| `--style` | Style preset | `--style raw` |
| `--v` | Version | `--v 6.1` |
| `--chaos` | Variation (0-100) | `--chaos 50` |
| `--weird` | Unusual outputs (0-3000) | `--weird 250` |
| `--tile` | Seamless pattern | `--tile` |
| `--no` | Negative prompt | `--no text, watermark` |

**Example:**
```
cyberpunk city at night, neon signs, rain reflections
--ar 16:9 --style raw --v 6.1
```

---

## DALL-E 3

- Natural language prompts (no special parameters)
- Supports HD quality option
- Good at photorealism and text rendering

**Example:**
```
A professional product photo of wireless earbuds on a marble surface,
soft studio lighting, high definition, clean white background
```

---

## Stable Diffusion

| Syntax | Purpose | Example |
|--------|---------|---------|
| `(word:1.3)` | Increase weight | `(neon:1.3)` |
| `(word:0.7)` | Decrease weight | `(blur:0.5)` |
| `[word]` | De-prioritize | `[watermark]` |
| Negative: | What to avoid | `Negative: blurry` |

**CFG Scale:** 7-12 (balance between prompt adherence and creativity)
**Steps:** 20-50 (quality vs speed tradeoff)

**Example:**
```
(cyberpunk:1.3) portrait, neon lights, (detailed face:1.2), 
cinematic, 8k, professional

Negative: blurry, low quality, bad anatomy, watermark
```

---

## Flux

- Natural language prompts
- Strong prompt adherence
- Supports style mixing

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `--guidance` | Prompt strength | `--guidance 7.5` |

**Example:**
```
Photorealistic portrait of a scientist in a lab, 
dramatic lighting, shallow depth of field --guidance 7.5
```

---

## Imagen / Veo

- Pure natural language
- Describe in detail what you want
- Aspect ratio specified naturally

**Example:**
```
16:9 cinematic shot of a futuristic city at sunset,
flying cars, holographic advertisements, warm orange and 
purple sky, volumetric lighting, movie quality
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [image-prompts.md](image-prompts.md) | Image prompt techniques and recipes |
| [domain-code.md](domain-code.md) | Code generation prompt patterns |
| [../SKILL.md](../SKILL.md) | Supported models quick reference |

---

⚡ PikaKit v3.9.206

---

⚡ PikaKit v3.9.206
