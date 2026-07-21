---
name: mcp-quickstart
description: Setup guides for Python FastMCP and TypeScript MCP SDK servers with minimal templates
title: "MCP Builder Quick Start"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: quickstart
---

# MCP Builder Quick Start

> Setup guides for Python and TypeScript MCP servers.

---

## Python Setup (FastMCP)

**Installation:**
```bash
pip install fastmcp pydantic
```

**Minimal Server:**
```python
from mcp import FastMCP
from pydantic import BaseModel, Field

mcp = FastMCP("my-server")

@mcp.tool()
async def my_tool(param: str) -> str:
    """Tool description."""
    return result

# Run server
if __name__ == "__main__":
    mcp.run()
```

---

## TypeScript Setup (MCP SDK)

**Installation:**
```bash
npm install @modelcontextprotocol/sdk zod
```

**Minimal Server:**
```typescript
import { Server } from "@modelcontextprotocol/sdk/server"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio"
import { z } from "zod"

const server = new Server({
  name: "my-server",
  version: "1.0.0",
})

// Add tool
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "my_tool",
      description: "Tool description",
      inputSchema: z.object({ param: z.string() })
    }
  ]
}))

// Connect transport
const transport = new StdioServerTransport()
await server.connect(transport)
```

---

## Running Your Server

```bash
# Python
python server.py

# TypeScript
npx ts-node server.ts

# With Claude Desktop (add to config)
{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": ["path/to/server.py"]
    }
  }
}
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | 4-phase build process |
| [python-implementation.md](python-implementation.md) | Full Python server template |
| [typescript-implementation.md](typescript-implementation.md) | Full TypeScript server template |
| [design-principles.md](design-principles.md) | MCP concepts |

---

⚡ PikaKit v3.9.206
