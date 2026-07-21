---
name: knowledge-graph
description: >-
  Semantic code analysis with AST parsing: go-to-definition, find-usages, and impact analysis.
  Use when finding code references, analyzing dependencies, or visualizing architecture.
  NOT for simple text search or code implementation.
metadata:
  author: pikakit
  version: "3.9.206"
  category: architecture
  triggers: "find usages, code graph, semantic search, impact analysis, dependency mapping"
  coordinates_with: "code-review, system-design"
---

# Knowledge Graph — Semantic Code Analysis

> AST > grep. Precision > recall. 3-category impact. Scope-aware resolution.

---

## Prerequisites

**Recommended:** LSP server or Tree-sitter for the target language.

---

## When to Use

| Need | Approach |
|------|----------|
| Find all usages of a symbol | Semantic search (AST-based) |
| Go-to-definition | Symbol lookup (scope-aware) |
| Refactoring impact | Cross-file impact analysis |
| Architecture diagram | Graph visualization |
| Quick text pattern match | Use grep/ripgrep instead |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Analysis strategy (4 capabilities) | Code review (→ code-review) |
| Language support matrix (4 full + 2 partial) | Architecture design (→ system-design) |
| Tool selection (4 tools) | LSP/Tree-sitter installation |
| Impact enumeration (3 categories) | Automated refactoring |

**Expert decision skill:** Produces analysis strategies. Does not execute analysis.

---

## Capabilities (4)

| Feature | Description |
|---------|-------------|
| **Symbol Lookup** | Find definition with scope-aware resolution |
| **Find Usages** | All call sites across project (includes re-exports for TS/JS) |
| **Impact Analysis** | What breaks if I change X? (direct + indirect + tests) |
| **Cross-file Refs** | Track imports, re-exports, and aliases |

---

## Language Support

| Language | Tier |
|----------|------|
| TypeScript | ✅ Full |
| JavaScript | ✅ Full |
| Python | ✅ Full |
| Ruby | ✅ Full |
| Java | 🚧 Partial |
| Kotlin | 🚧 Partial |

---

## Integration Tool Selection (Deterministic)

| Need | Tool |
|------|------|
| IDE integration | LSP |
| Raw AST parsing | Tree-sitter |
| Context dumps for agents | Repomix |
| AI agent integration | MCP |

---

## Impact Analysis Framework (3 Categories)

| Category | Scope |
|----------|-------|
| **Direct callers** | Functions that call the changed symbol |
| **Indirect refs** | Re-exports, barrel files, aliases |
| **Test coverage** | Test files referencing the symbol |

All 3 categories always enumerated. Never partial impact analysis.

---

## Common Queries

```
"Where is authenticate used?"
→ Strategy: semantic find-usages, include re-exports, include tests

"Definition of User class"
→ Strategy: scope-aware symbol lookup, LSP preferred

"What breaks if I change validateEmail signature?"
→ Strategy: 3-category impact (direct: call sites, indirect: re-exports, tests: test files)
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNSUPPORTED_LANGUAGE` | No | Language not in matrix |
| `ERR_MISSING_SYMBOL` | Yes | Symbol name not provided |
| `ERR_MISSING_FILE_PATH` | Yes | File path not provided |
| `WARN_PARTIAL_SUPPORT` | Yes | Language has partial support |

**Zero internal retries.** Deterministic; same context = same strategy.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use grep for symbol analysis | Use AST-based semantic search |
| Skip re-export tracking (TS/JS) | Always include barrel exports |
| Partial impact analysis | Enumerate all 3 categories |
| Assume partial language = full | Check `WARN_PARTIAL_SUPPORT` |
| Ignore test references | Include test coverage in impact |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `code-review` | Skill | Code quality analysis |
| `system-design` | Skill | Architecture patterns |

---

⚡ PikaKit v3.9.206
