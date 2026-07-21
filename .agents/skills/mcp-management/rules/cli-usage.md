---
name: mcp-cli-usage
description: CLI commands for MCP tool discovery and execution — list-tools, call-tool, Gemini CLI stdin pipe
title: "MCP CLI Usage"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: cli, usage
---

# MCP CLI Usage

> Commands for discovering and executing MCP tools.

---

## Setup

```bash
cd .agent/skills/mcp-management/scripts

# Install dependencies (first time)
npm install
```

---

## Discovery Commands

### List All Tools

```bash
npx tsx cli.ts list-tools
```

Saves complete tool catalog to `assets/tools.json`:

```json
{
  "server": "filesystem",
  "tools": [
    {
      "name": "read_file",
      "description": "Read contents of a file",
      "inputSchema": {
        "type": "object",
        "properties": {
          "path": { "type": "string" }
        },
        "required": ["path"]
      }
    }
  ]
}
```

### List Prompts

```bash
npx tsx cli.ts list-prompts
```

### List Resources

```bash
npx tsx cli.ts list-resources
```

---

## Tool Execution

### Format

```bash
npx tsx cli.ts call-tool <server> <tool> '<json-args>'
```

### Examples

```bash
# Read file
npx tsx cli.ts call-tool filesystem read_file '{"path":"/config.json"}'

# Create memory entities
npx tsx cli.ts call-tool memory create_entities '{
  "entities": [
    {
      "name": "Project",
      "type": "project",
      "observations": ["Uses React", "TypeScript"]
    }
  ]
}'

# Take screenshot (puppeteer)
npx tsx cli.ts call-tool puppeteer screenshot '{"url":"https://example.com"}'
```

---

## Gemini CLI Integration

### Preferred Method

```bash
# Use stdin piping - NEVER use -p flag
echo "Read /config.json. Return JSON only." | gemini -y -m gemini-2.5-flash
```

### Structured Response

```json
{
  "server": "filesystem",
  "tool": "read_file",
  "success": true,
  "result": { "content": "..." },
  "error": null
}
```

---

## Tool Catalog

After running `list-tools`, analyze `assets/tools.json` for intelligent tool selection.

```bash
# View tool names by server
cat assets/tools.json | jq '.[] | {server: .server, tools: .tools[].name}'
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | 3 execution methods, anti-patterns |
| [protocol.md](protocol.md) | JSON-RPC protocol details |
| [engineering-spec.md](engineering-spec.md) | Full engineering spec |
| `mcp-builder` | Building MCP servers |

---

⚡ PikaKit v3.9.206
