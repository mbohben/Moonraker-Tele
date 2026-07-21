---
name: mcp-python-implementation
description: Python MCP server with FastMCP — tool annotations, error helpers, pagination, quality checklist
title: "Python MCP Server Implementation"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: python, implementation
---

# Python MCP Server Implementation

> Detailed Python MCP server implementation with FastMCP.

---

## Setup

```bash
pip install fastmcp pydantic httpx python-dotenv
```

---

## Project Structure

```
my-mcp-server/
├── server.py           # Main entry
├── requirements.txt    # Dependencies
├── .env.example        # Environment template
└── README.md           # Documentation
```

---

## Basic Server Template

```python
#!/usr/bin/env python3
"""MCP Server: [Name]"""

import os
from mcp import FastMCP
from pydantic import BaseModel, Field
import httpx

# Initialize
mcp = FastMCP("my-service")

# Optional: Load environment
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL", "https://api.example.com")


# === Models ===

class SearchInput(BaseModel):
    query: str = Field(description="Search query text")
    limit: int = Field(default=10, ge=1, le=100)
    format: str = Field(default="concise", pattern="^(concise|detailed)$")


# === Tools ===

@mcp.tool(
    readOnlyHint=True,
    destructiveHint=False,
    idempotentHint=True,
    openWorldHint=True,
)
async def search_items(query: str, limit: int = 10, format: str = "concise") -> str:
    """
    Search for items matching the query.
    
    Args:
        query: Search terms (supports AND/OR operators)
        limit: Maximum results to return (1-100)
        format: Response format - 'concise' or 'detailed'
    
    Returns:
        JSON array of matching items
    
    Examples:
        - search_items("status:active", 10, "concise")
    
    Errors:
        - If no results: Returns empty array
        - If limit exceeded: Suggests reducing limit
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{BASE_URL}/search",
                params={"q": query, "limit": limit},
                headers={"Authorization": f"Bearer {API_KEY}"}
            )
            response.raise_for_status()
            data = response.json()
            
            if format == "concise":
                # Return minimal data
                return json.dumps([
                    {"id": item["id"], "title": item["title"]}
                    for item in data["results"]
                ])
            else:
                # Return full data
                return json.dumps(data["results"])
                
        except httpx.HTTPError as e:
            return json.dumps({
                "error": str(e),
                "suggestion": "Check API key or reduce limit"
            })


@mcp.tool(destructiveHint=True)
async def create_item(title: str, content: str) -> str:
    """
    Create a new item.
    
    Args:
        title: Item title
        content: Item content
    
    Returns:
        JSON with created item ID
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/items",
            json={"title": title, "content": content},
            headers={"Authorization": f"Bearer {API_KEY}"}
        )
        response.raise_for_status()
        return json.dumps(response.json())


# === Resources ===

@mcp.resource("config://settings")
async def get_settings() -> str:
    """Get current configuration."""
    return json.dumps({
        "base_url": BASE_URL,
        "version": "1.0.0"
    })


# === Run ===

if __name__ == "__main__":
    mcp.run()
```

---

## Error Handling Pattern

```python
import json

def format_error(error: Exception, suggestion: str = None) -> str:
    """Format error for AI consumption."""
    result = {
        "success": False,
        "error": str(error),
    }
    if suggestion:
        result["suggestion"] = suggestion
    return json.dumps(result)


def format_success(data: any) -> str:
    """Format success response."""
    return json.dumps({
        "success": True,
        "data": data
    })
```

---

## Pagination Helper

```python
async def paginate_all(client, url, params, max_pages=10):
    """Fetch all pages of a paginated API."""
    all_items = []
    page = 1
    
    while page <= max_pages:
        params["page"] = page
        response = await client.get(url, params=params)
        data = response.json()
        
        all_items.extend(data["items"])
        
        if not data.get("has_next"):
            break
        page += 1
    
    return all_items
```

---

## Testing

```bash
# Verify syntax only
python -m py_compile server.py

# Test with timeout (prevents hanging)
timeout 5s python server.py

# Use MCP Inspector
npx @modelcontextprotocol/inspector python server.py
```

---

## Quality Checklist

- [ ] All tools have complete docstrings
- [ ] Input validation with Pydantic
- [ ] Error handling for all external calls
- [ ] Actionable error messages
- [ ] "concise" vs "detailed" format option
- [ ] Environment variables for secrets

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | 4-phase build, review checklist |
| [quickstart.md](quickstart.md) | Minimal Python setup |
| [typescript-implementation.md](typescript-implementation.md) | TypeScript alternative |
| [best-practices.md](best-practices.md) | Workflow design patterns |
| [evaluation.md](evaluation.md) | Phase 4 testing |

---

⚡ PikaKit v3.9.206
