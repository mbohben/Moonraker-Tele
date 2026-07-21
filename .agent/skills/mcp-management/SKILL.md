---
name: mcp-management
description: >-
  Discover, analyze, and execute tools from configured MCP servers with progressive disclosure.
  Use when listing available MCP tools, executing MCP commands, or managing MCP connections.
  NOT for building new MCP servers (use mcp-builder).
metadata:
  author: pikakit
  version: "3.9.206"
  category: agent-tooling
  triggers: ["MCP tools", "server discovery", "tool execution", "multi-server"]
  coordinates_with: ["mcp-builder"]
  success_metrics: ["100% tool discovery", "<1000ms execution latency"]
---

# MCP Management — Tool Discovery, Routing & Execution

> Progressive disclosure. 3 execution methods. Structured JSON. Never `-p` flag.

---

## Prerequisites

**Required:** MCP servers in `.mcp.json`, Node.js 18+.
**Optional:** Gemini CLI (primary execution method).

---

## When to Use

| Situation | Action |
|-----------|--------|
| Discover available tools | `npx tsx cli.ts list-tools` |
| Execute specific tool | Use 3-method priority |
| Multi-server orchestration | Route by server name |
| Keep context clean | Progressive disclosure |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Tool discovery (list-tools/prompts/resources) | MCP server development (→ mcp-builder) |
| 3 execution methods + fallback | Server hosting |
| Multi-server routing from .mcp.json | Tool implementation |
| Structured JSON response format | Server-side authorization |

**Automation skill:** Spawns processes, makes JSON-RPC calls, writes catalog. Non-idempotent.

---

## Execution Methods (Priority Order)

| Priority | Method | Command |
|----------|--------|---------|
| 1 (Primary) | Gemini CLI | `echo "instruction" \| gemini -y` |
| 2 (Secondary) | Direct CLI | `npx tsx cli.ts call-tool <server> <tool> '<json>'` |
| 3 (Fallback) | Subagent | Delegate to mcp-manager |

**⚠️ Gemini CLI:** Always stdin pipe. Never `-p` flag (skips MCP init).

---

## State Transitions

```
IDLE → DISCOVERING           [discover invoked]
DISCOVERING → CATALOG_SAVED  [tools.json written]  // terminal
IDLE → EXECUTING             [execute invoked]
EXECUTING → RESULT_RECEIVED  [server responded]  // terminal
EXECUTING → METHOD_FALLBACK  [method unavailable]
METHOD_FALLBACK → RESULT_RECEIVED  [fallback succeeded]  // terminal
METHOD_FALLBACK → ALL_METHODS_FAILED  [all 3 failed]  // terminal
EXECUTING → SERVER_FAILED   [server error/timeout]  // terminal
```

---

## Configuration

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

---

## Discovery Commands

```bash
npx tsx cli.ts list-tools      # All tools → assets/tools.json
npx tsx cli.ts list-prompts    # Available prompts
npx tsx cli.ts list-resources  # Available resources
```

---

## Response Format (Enforced)

```json
{
  "server": "server-name",
  "tool": "tool-name",
  "success": true,
  "result": "<data>",
  "error": null
}
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_CONFIG_MISSING` | Yes | .mcp.json not found |
| `ERR_SERVER_NOT_FOUND` | Yes | Server name not in config |
| `ERR_TOOL_NOT_FOUND` | Yes | Tool not on server |
| `ERR_ALL_METHODS_FAILED` | No | All 3 methods failed |
| `ERR_SERVER_TIMEOUT` | Yes | Server did not respond |
| `ERR_RESPONSE_PARSE` | Yes | Cannot parse response |
| `ERR_GEMINI_CLI_MISSING` | Yes | Auto-fallback to Direct CLI |

**Method fallback:** max 3 attempts (one per method, ordered priority).

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use `gemini -p "..."` | Use `echo "..." \| gemini -y` |
| Load all tools upfront | Progressive disclosure |
| Assume tool catalog is fresh | Re-run list-tools to refresh |
| Ignore structured format | Enforce JSON response |
| Assume server is running | Check before execute |


## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [protocol.md](rules/protocol.md) | JSON-RPC protocol details | Protocol questions |
| [cli-usage.md](rules/cli-usage.md) | CLI commands and examples | CLI usage |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `mcp-builder` | Skill | Build MCP servers |

---

⚡ PikaKit v3.9.206
