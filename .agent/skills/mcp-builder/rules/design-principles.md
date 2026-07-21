---
name: mcp-design-principles
description: Core MCP concepts — tool/resource/prompt design, transport selection, error handling, security patterns
title: "MCP Server Design Principles"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: design, principles
---

# MCP Server Design Principles

> Core principles for building MCP (Model Context Protocol) servers.

---

## MCP Overview

Model Context Protocol - standard for connecting AI systems with external tools and data.

| Concept       | Purpose                      |
| ------------- | ---------------------------- |
| **Tools**     | Functions AI can call        |
| **Resources** | Data AI can read             |
| **Prompts**   | Pre-defined prompt templates |

---

## Server Architecture

```
my-mcp-server/
├── src/index.ts    # Main entry
├── package.json
└── tsconfig.json
```

| Transport     | Use                      |
| ------------- | ------------------------ |
| **Stdio**     | Local, CLI-based         |
| **SSE**       | Web-based, streaming     |
| **WebSocket** | Real-time, bidirectional |

---

## Tool Design

| Principle         | Description                                |
| ----------------- | ------------------------------------------ |
| Clear name        | Action-oriented (get_weather, create_user) |
| Single purpose    | One thing well                             |
| Validated input   | Schema with types and descriptions         |
| Structured output | Predictable response format                |

---

## Resource Patterns

| Type     | Use                       | URI Example         |
| -------- | ------------------------- | ------------------- |
| Static   | Fixed data (config, docs) | `docs://readme`     |
| Dynamic  | Generated on request      | `users://{userId}`  |
| Template | URI with parameters       | `files://project/*` |

---

## Error Handling

| Situation      | Response                   |
| -------------- | -------------------------- |
| Invalid params | Validation error message   |
| Not found      | Clear "not found"          |
| Server error   | Generic error, log details |

---

## Security & Config

- Validate all tool inputs, sanitize user data
- Use environment variables for API keys
- Don't log secrets, validate permissions

---

## Best Practices Checklist

- [ ] Clear, action-oriented tool names
- [ ] Complete input schemas with descriptions
- [ ] Structured JSON output
- [ ] Error handling for all cases
- [ ] Environment-based configuration

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | 4-phase build, framework selection |
| [quickstart.md](quickstart.md) | Setup guides (Python/TypeScript) |
| [best-practices.md](best-practices.md) | Workflow design, error patterns |
| [engineering-spec.md](engineering-spec.md) | Full engineering spec |

---

⚡ PikaKit v3.9.206
