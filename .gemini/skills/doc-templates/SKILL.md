---
name: doc-templates
description: >-
  Documentation templates: README, API docs, Mermaid diagrams, changelogs, and code comments.
  Use when creating documentation, generating README files, or editing Mermaid diagrams.
  NOT for marketing copy (use copywriting) or code comments style (use code-craft).
metadata:
  author: pikakit
  version: "3.9.206"
  category: documentation
  triggers: ["template", "README", "documentation", "API docs", "changelog", "ADR", "mermaid", "diagram", "flowchart", "preview", "markdown viewer", "view plans", "kanban", "dashboard"]
  coordinates_with: ["project-planner", "code-craft", "system-design"]
  success_metrics: ["100% templates follow required sections", "100% diagrams render correctly"]
---

# Doc Templates — Documentation, Diagrams & Preview

> Fixed templates per document type. Mermaid diagrams. Markdown preview. Plan dashboards.

---

## Prerequisites

**Required:** Node.js 18+ (for diagram editor and preview server scripts).

---

## When to Use

| Document Type | Template | Required Sections |
|--------------|----------|-------------------|
| New project README | README template | 6 sections |
| API endpoint docs | API doc template | Method, path, params, response |
| Architecture decisions | ADR template | Status, Context, Decision, Consequences |
| Release notes | Changelog template | Version, date, changes |
| AI agent context | llms.txt template | Project summary, structure |
| Mermaid diagrams | Diagram editor | 9 types supported |
| Documentation preview | Preview server | Markdown rendering |
| Plan progress | Plan dashboard | Phase tracking |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Template structure (5 document types) | Content writing |
| Section order and requirements | Auto-documentation (→ /chronicle) |
| Comment guidelines (why vs what) | Project structure (→ project-planner) |
| AI-friendly doc format (llms.txt) | Code quality (→ code-craft) |
| Mermaid diagram editing (9 types) | Architecture decisions (→ system-design) |
| Markdown preview server | File system permissions |
| Plan dashboard server | Plan creation (→ project-planner) |

**Hybrid skill:** Templates are pure decision; diagram/preview are automation (HTTP servers).

---

## README Template (6 Required Sections)

```markdown
# Project Name

Brief one-line description.

## Quick Start

[Minimum steps to run]

## Features

- Feature 1
- Feature 2

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |

## Documentation

- [API Reference](./docs/api.md)

## License

MIT
```

---

## API Endpoint Template

```markdown
## GET /users/:id

Get a user by ID.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | User ID |

**Response:** 200: User object, 404: Not found
```

---

## ADR Template

```markdown
# ADR-001: [Title]

## Status
Accepted / Deprecated / Superseded

## Context
Why are we making this decision?

## Decision
What did we decide?

## Consequences
What are the trade-offs?
```

---

## Comment Guidelines

| ✅ Comment | ❌ Don't Comment |
|-----------|--------------------|
| Why (business logic) | What (obvious code) |
| Complex algorithms | Every line |
| API contracts | Implementation details |

---

## Mermaid Diagram Editor (Absorbed from mermaid-editor)

### Diagram Types (9 — Fixed)

| # | Type | Keyword |
|---|------|---------|
| 1 | Flowchart | `flowchart LR` |
| 2 | Sequence | `sequenceDiagram` |
| 3 | Class | `classDiagram` |
| 4 | State | `stateDiagram-v2` |
| 5 | ER | `erDiagram` |
| 6 | Gantt | `gantt` |
| 7 | Pie | `pie` |
| 8 | Mindmap | `mindmap` |
| 9 | Timeline | `timeline` |

### Editor Server

```bash
# Open editor (empty)

# Edit existing file

# Stop server
```

| Option | Default | Description |
|--------|---------|-------------|
| `--file <path>` | — | Open .mmd file |
| `--port <n>` | 3457 | Server port |
| `--open` | false | Auto-open browser |
| `--stop` | — | Stop all servers |

---

## Markdown Preview Server (Absorbed from markdown-novel-viewer)

```bash
# View a file

# Browse a directory

# Stop all servers
```

| Option | Default | Description |
|--------|---------|-------------|
| `--file <path>` | — | Markdown file |
| `--dir <path>` | — | Directory to browse |
| `--port <n>` | 3456 | Server port (3456-3500) |
| `--open` | false | Auto-open browser |
| `--stop` | — | Stop all servers |

**Theme:** Libre Baskerville (headings), Inter (body), JetBrains Mono (code). Light/dark toggle.

---

## Plan Dashboard (Absorbed from plans-kanban)

Visual dashboard for plan directories with progress tracking and phase status indicators.

```bash
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |
| `ERR_PORT_UNAVAILABLE` | Yes | Port in use (editor/preview) |
| `ERR_FILE_NOT_FOUND` | Yes | File not found |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Skip Quick Start in README | Always include Quick Start |
| Undocumented API parameters | Document all params with types |
| ADR without Consequences | Always include trade-offs |
| Comment what code does | Comment why code exists |
| No changelog | Maintain structured changelog |
| Leave servers orphaned | Use --stop to clean up |
| Assume port is free | Check or use --port |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [doc.md](rules/doc.md) | Full templates and examples | Detailed template reference |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |
| [diagram-reference.md](../mermaid-editor/rules/diagram-reference.md) | 9 diagram types syntax | Writing diagrams |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/chronicle` | Workflow | Auto-documentation generation |
| `project-planner` | Skill | Project structure planning |
| `code-craft` | Skill | Code quality and comments |
| `system-design` | Skill | Architecture diagrams |

---

⚡ PikaKit v3.9.206
