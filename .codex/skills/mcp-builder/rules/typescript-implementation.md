---
name: mcp-typescript-implementation
description: TypeScript MCP server with Zod validation — tool annotations, strict mode, build/test workflow
title: "TypeScript MCP Server Implementation"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: typescript, implementation
---

# TypeScript MCP Server Implementation

> Detailed TypeScript MCP server implementation with Zod validation.

---

## Setup

```bash
npm init -y
npm install @modelcontextprotocol/sdk zod dotenv
npm install -D typescript @types/node tsx
```

---

## Project Structure

```
my-mcp-server/
├── src/
│   ├── index.ts        # Main entry
│   ├── tools/          # Tool definitions
│   └── utils/          # Helpers
├── package.json
├── tsconfig.json
└── .env.example
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

---

## Basic Server Template

```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL || "https://api.example.com";

// Initialize server
const server = new Server({
  name: "my-service",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
    resources: {},
  },
});

// === Schemas ===

const SearchInputSchema = z.object({
  query: z.string().describe("Search query text"),
  limit: z.number().int().min(1).max(100).default(10),
  format: z.enum(["concise", "detailed"]).default("concise"),
}).strict();

const CreateItemSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
}).strict();

// === Tools ===

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "search_items",
      description: `
        Search for items matching the query.
        
        Args:
          query: Search terms (supports AND/OR)
          limit: Maximum results (1-100)
          format: 'concise' or 'detailed'
        
        Examples:
          - query="status:active type:project"
        
        Errors:
          - If no results: Returns empty array
      `,
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
          limit: { type: "number", default: 10 },
          format: { type: "string", enum: ["concise", "detailed"] },
        },
        required: ["query"],
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    {
      name: "create_item",
      description: "Create a new item",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
        },
        required: ["title", "content"],
      },
      annotations: {
        destructiveHint: true,
      },
    },
  ],
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case "search_items": {
        const input = SearchInputSchema.parse(args);
        const results = await searchItems(input);
        return { content: [{ type: "text", text: JSON.stringify(results) }] };
      }
      
      case "create_item": {
        const input = CreateItemSchema.parse(args);
        const result = await createItem(input);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
          suggestion: "Check input parameters",
        }),
      }],
      isError: true,
    };
  }
});

// === Implementation ===

async function searchItems(input: z.infer<typeof SearchInputSchema>) {
  const response = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(input.query)}&limit=${input.limit}`,
    { headers: { Authorization: `Bearer ${API_KEY}` } }
  );
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (input.format === "concise") {
    return data.results.map((item: any) => ({
      id: item.id,
      title: item.title,
    }));
  }
  
  return data.results;
}

async function createItem(input: z.infer<typeof CreateItemSchema>) {
  const response = await fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

// === Run ===

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

---

## Build & Test

```bash
# Build
npm run build

# Verify dist/index.js exists
ls dist/index.js

# Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## Quality Checklist

- [ ] Full TypeScript strict mode
- [ ] Zod schemas for all inputs
- [ ] Complete tool descriptions with examples
- [ ] Error handling returns structured JSON
- [ ] "concise" vs "detailed" format option
- [ ] Environment variables for secrets
- [ ] Build succeeds without errors

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | 4-phase build, review checklist |
| [quickstart.md](quickstart.md) | Minimal TypeScript setup |
| [python-implementation.md](python-implementation.md) | Python alternative |
| [best-practices.md](best-practices.md) | Workflow design patterns |
| [evaluation.md](evaluation.md) | Phase 4 testing |
| `typescript-expert` | Advanced TypeScript patterns |

---

⚡ PikaKit v3.9.206
