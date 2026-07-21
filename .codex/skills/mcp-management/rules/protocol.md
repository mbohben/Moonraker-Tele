---
name: mcp-protocol
description: JSON-RPC 2.0 protocol reference — message types, 6 MCP methods, error codes, stdio/SSE transports
title: "MCP Protocol Reference"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: protocol
---

# MCP Protocol Reference

> JSON-RPC protocol for AI-tool communication.

---

## Protocol Overview

MCP uses JSON-RPC 2.0 over stdio or HTTP+SSE transports.

---

## Message Types

### Request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "read_file",
    "arguments": { "path": "/file.txt" }
  }
}
```

### Response (Success)

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      { "type": "text", "text": "file contents..." }
    ]
  }
}
```

### Response (Error)

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid params"
  }
}
```

---

## Methods

| Method | Description |
|--------|-------------|
| `tools/list` | List available tools |
| `tools/call` | Execute a tool |
| `prompts/list` | List available prompts |
| `prompts/get` | Get prompt template |
| `resources/list` | List available resources |
| `resources/read` | Read resource content |

---

## Error Codes

| Code | Meaning |
|------|---------|
| `-32700` | Parse error |
| `-32600` | Invalid request |
| `-32601` | Method not found |
| `-32602` | Invalid params |
| `-32603` | Internal error |

---

## Transports

### stdio (Default)

Server reads from stdin, writes to stdout.

```json
// .mcp.json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

### HTTP + SSE

Server exposes HTTP endpoint with Server-Sent Events.

```json
{
  "mcpServers": {
    "remote": {
      "url": "http://localhost:3000/mcp",
      "transport": "sse"
    }
  }
}
```

---

## Tool Definition

```json
{
  "name": "read_file",
  "description": "Read contents of a file",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "File path to read"
      }
    },
    "required": ["path"]
  }
}
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | 3 execution methods, state transitions |
| [cli-usage.md](cli-usage.md) | CLI commands and examples |
| [engineering-spec.md](engineering-spec.md) | Full engineering spec |
| `mcp-builder` | Building MCP servers |

---

⚡ PikaKit v3.9.206
