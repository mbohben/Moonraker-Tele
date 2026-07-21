---
name: mcp-evaluation
description: 10-question evaluation framework for MCP servers — complex, read-only, verifiable test questions
title: "MCP Evaluation Guide"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: evaluation
---

# MCP Evaluation Guide

> Create 10 complex questions to test your MCP server with real AI agents.

---

## Purpose

Evaluations test whether LLMs can effectively use your MCP server to answer realistic, complex questions.

---

## Question Requirements

Each question MUST be:

| Requirement | Description |
|-------------|-------------|
| **Independent** | Not dependent on other questions |
| **Read-only** | Only non-destructive operations |
| **Complex** | Requires multiple tool calls |
| **Realistic** | Based on real use cases |
| **Verifiable** | Single, clear answer |
| **Stable** | Answer won't change over time |

---

## Question Creation Process

1. **Tool Inspection** - List available tools and capabilities
2. **Content Exploration** - Use READ-ONLY operations to explore data
3. **Question Generation** - Create 10 complex, realistic questions
4. **Answer Verification** - Solve each question yourself

---

## Example Question

```xml
<qa_pair>
  <question>
    Find discussions about AI model launches with animal codenames.
    One model needed a specific safety designation (ASL-X).
    What number X was determined for the spotted wild cat model?
  </question>
  <answer>3</answer>
</qa_pair>
```

This requires:
- Searching discussions about AI models
- Filtering for animal-themed codenames
- Identifying safety designation format
- Finding specific model (cheetah/leopard)
- Extracting the ASL number

---

## Output Format

```xml
<evaluation>
  <qa_pair>
    <question>Your complex question here</question>
    <answer>Single verifiable answer</answer>
  </qa_pair>
  <!-- 9 more qa_pairs -->
</evaluation>
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Simple one-tool questions | Multi-step exploration |
| Write operations | Read-only operations |
| Time-sensitive answers | Stable, verifiable answers |
| Vague answers | Specific, comparable answers |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Phase 4 overview |
| [best-practices.md](best-practices.md) | Design patterns to test |
| [engineering-spec.md](engineering-spec.md) | Evaluation contracts |

---

⚡ PikaKit v3.9.206
