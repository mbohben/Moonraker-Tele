---
name: domain-marketing
description: Marketing copy prompt patterns — headlines (AIDA/PAS/4U), product descriptions, email sequences, ad copy, social media
title: "Marketing Prompt Patterns"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: domain, marketing
---

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
