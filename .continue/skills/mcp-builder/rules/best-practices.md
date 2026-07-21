---
name: mcp-best-practices
description: MCP design patterns — workflow over endpoints, concise/detailed output, actionable errors, naming conventions
title: "MCP Best Practices"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: best, practices
---

# MCP Best Practices

> Design for workflows, not endpoints. Optimize for agent context.

---

## Core Principles

| Principle | Description |
|-----------|-------------|
| **Workflows > Endpoints** | `schedule_event` vs separate `check` + `create` |
| **Context-Aware** | Offer `concise` vs `detailed` formats |
| **Actionable Errors** | "Try filter='active'" not "Invalid filter" |
| **Natural Grouping** | Consistent prefixes for discoverability |

---

## Tool Design

### Input Schema

```python
# Use descriptive Field descriptions
query: str = Field(description="Search terms (supports AND/OR)")
limit: int = Field(default=10, ge=1, le=100)
format: str = Field(default="concise", pattern="^(concise|detailed)$")
```

### Tool Annotations

```python
@mcp.tool(
    readOnlyHint=True,      # Read-only operation
    destructiveHint=False,  # Non-destructive
    idempotentHint=True,    # Same result on retry
    openWorldHint=True,     # External interaction
)
```

---

## Response Format

### Concise vs Detailed

```python
if format == "concise":
    return json.dumps({
        "id": item.id,
        "title": item.title,
        "status": item.status
    })
else:
    return json.dumps(item.dict())  # Full object
```

### Markdown for Readability

```python
# For complex data, Markdown is more readable
return f"""
## {item.title}

**Status:** {item.status}
**Created:** {item.created_at}

### Description
{item.description}
"""
```

---

## Error Handling

```python
# ❌ Bad
raise Exception("Invalid filter")

# ✅ Good
raise Exception(
    "Invalid filter value. "
    "Valid options: 'active', 'archived', 'all'. "
    "Try: filter='active' to see current items."
)
```

---

## Pagination

```python
async def list_items(page: int = 1, per_page: int = 20) -> str:
    """
    Args:
        page: Page number (1-indexed)
        per_page: Items per page (max 100)

    Returns:
        JSON with items array and pagination metadata
    """
    items = await api.get_items(page=page, per_page=per_page)
    
    return json.dumps({
        "items": items,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total_count,
            "has_more": page * per_page < total_count
        }
    })
```

---

## Naming Conventions

| Pattern | Example |
|---------|---------|
| Resource prefix | `user_get`, `user_create`, `user_list` |
| Action-first | `search_users`, `create_task`, `delete_file` |
| Consistent verbs | `get`, `list`, `create`, `update`, `delete` |

---

## Security

- Never expose credentials in responses
- Validate all inputs
- Rate limit where appropriate
- Log operations for audit

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Phase 3 review checklist |
| [design-principles.md](design-principles.md) | Core MCP concepts |
| [python-implementation.md](python-implementation.md) | Python patterns |
| [typescript-implementation.md](typescript-implementation.md) | TypeScript patterns |
| [evaluation.md](evaluation.md) | Phase 4 testing |

---

⚡ PikaKit v3.9.206
