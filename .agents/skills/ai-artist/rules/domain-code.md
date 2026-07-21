---
name: domain-code
description: Code generation prompt patterns — function gen, code review, refactoring, debugging, API design
title: "Code Generation Prompt Patterns"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: domain, code
---

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
