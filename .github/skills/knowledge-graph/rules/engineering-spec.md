---
title: Knowledge Graph � Engineering Specification
impact: MEDIUM
tags: knowledge-graph
---

# Knowledge Graph � Engineering Specification

> Production-grade specification for semantic code analysis with AST parsing at FAANG scale.

---

## 1. Overview

Knowledge Graph provides structured decision frameworks for semantic code analysis: symbol lookup (go-to-definition), find-usages across codebase, impact analysis for refactoring, cross-file reference tracking, and architecture graph visualization. The skill operates as an expert knowledge base � it produces analysis strategies, query patterns, and tool selection guidance. It does not execute code analysis, parse ASTs, or invoke LSP servers directly.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Semantic code analysis at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Grep-based search returns false positives | 30% of grep results for symbol names are irrelevant (comments, strings, different scope) | Wasted developer time |
| Missing cross-file references | 25% of refactoring breaks due to untracked imports/re-exports | Runtime failures |
| No impact analysis before changes | 40% of signature changes break downstream callers | Regression bugs |
| Text-based definition lookup | 35% of "go-to" attempts land on wrong definition (same-name symbols in different modules) | Wrong code modified |

Knowledge Graph eliminates these with AST-based semantic analysis, cross-file import tracking, deterministic impact enumeration, and scope-aware symbol resolution.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Semantic over textual | AST-based analysis for all queries; never raw string matching |
| G2 | Cross-file tracking | Follow imports, re-exports, and aliases across all project files |
| G3 | Impact enumeration | Direct callers + indirect (via re-exports) + test files |
| G4 | Language coverage | Full: TS, JS, Python, Ruby. Partial: Java, Kotlin |
| G5 | Tool selection | Need ? integration tool (LSP, Tree-sitter, Repomix, MCP) |
| G6 | Precision over recall | Zero false positives for symbol resolution |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Code review process | Owned by `code-review` skill |
| NG2 | Architecture design decisions | Owned by `system-design` skill |
| NG3 | AST parser implementation | Infrastructure concern |
| NG4 | LSP server installation | Tool configuration |
| NG5 | Quick text pattern matching | Use grep/ripgrep directly |
| NG6 | Runtime code tracing | Different analysis mode (dynamic vs static) |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Symbol lookup strategy (go-to-definition) | Query pattern + tool selection | LSP server execution |
| Find-usages strategy | Cross-file analysis approach | AST parser invocation |
| Impact analysis framework | Direct + indirect + test enumeration | Automated refactoring |
| Cross-file reference tracking | Import/export graph strategy | Dependency resolution runtime |
| Integration tool selection (4 tools) | Decision criteria | Tool installation |
| Language support matrix | Coverage classification | Language server development |

**Side-effect boundary:** Knowledge Graph produces analysis strategies and query patterns. It does not parse code, invoke LSP servers, or modify source files.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "symbol-lookup" | "find-usages" | "impact-analysis" |
                              # "cross-file-refs" | "tool-select" | "architecture-viz"
Context: {
  symbol: string | null       # Symbol name (function, class, variable)
  file_path: string | null    # File containing the symbol
  language: string            # "typescript" | "javascript" | "python" | "ruby" | "java" | "kotlin"
  project_size: string        # "small" (<50 files) | "medium" (50-500) | "large" (500+)
  analysis_depth: string      # "direct" | "transitive" | "full"
  change_type: string | null  # "rename" | "signature" | "delete" | "move"
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  lookup: {
    strategy: string          # "lsp-definition" | "ast-search" | "import-trace"
    tool: string              # Recommended tool
    query_pattern: string     # How to find the symbol
  } | null
  usages: {
    strategy: string          # "semantic-search" | "reference-graph"
    scope: string             # "file" | "project" | "workspace"
    include_tests: boolean
    include_reexports: boolean
  } | null
  impact: {
    direct_callers: string    # Strategy for finding direct callers
    indirect_refs: string     # Strategy for re-export chain
    test_coverage: string     # Strategy for test references
    total_analysis_depth: string
  } | null
  cross_file: {
    import_graph: string      # Strategy for import resolution
    alias_tracking: boolean
    barrel_export_handling: string
  } | null
  tool: {
    name: string              # "lsp" | "tree-sitter" | "repomix" | "mcp"
    use_case: string
    rationale: string
  } | null
  reference_file: string | null
  metadata: {
    contract_version: string
    backward_compatibility: string
  }
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string                  # From Error Taxonomy (Section 11)
Message: string
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Language support classification is fixed: full (TS, JS, Python, Ruby), partial (Java, Kotlin).
- Tool selection is deterministic: IDE integration ? LSP, raw parsing ? Tree-sitter, context dumps ? Repomix, AI agent ? MCP.
- Impact analysis always enumerates 3 categories: direct callers, indirect refs, test coverage.
- Symbol lookup strategy depends on language + tool availability.
- Find-usages always includes re-exports for TS/JS.
- AST-based analysis is always preferred over string matching.

#### What Agents May Assume

- Language classification is accurate for supported languages.
- Tool recommendations match the stated use cases.
- Impact categories (direct, indirect, tests) are exhaustive.
- Find-usages includes test files by default.

#### What Agents Must NOT Assume

- LSP server or Tree-sitter is installed.
- Analysis results are complete for partial-support languages.
- The skill executes code analysis directly.
- Cross-file analysis handles dynamic imports or runtime-computed paths.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Symbol lookup | None; strategy output |
| Find usages | None; strategy output |
| Impact analysis | None; framework output |
| Cross-file refs | None; strategy output |
| Tool select | None; recommendation |
| Architecture viz | None; visualization strategy |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify symbol and file path
2. Determine language from file extension
3. Invoke tool-select for appropriate analysis tool
4. Invoke symbol-lookup, find-usages, or impact-analysis
5. Execute analysis using recommended tool (caller's responsibility)
6. Process results (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete analysis strategy.
- Strategies are language-aware.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported type |
| Unsupported language | Return error to caller | Use supported language |
| Missing symbol | Return error to caller | Supply symbol name |
| Partial language support | Return warning + reduced strategy | Inform caller of limitations |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Symbol lookup | Yes | Same symbol + language = same strategy |
| Find usages | Yes | Same context = same strategy |
| Impact analysis | Yes | Same change_type = same framework |
| Cross-file refs | Yes | Same language = same approach |
| Tool select | Yes | Same need = same tool |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate language, determine support tier, identify analysis type | Classification |
| **Strategize** | Generate analysis strategy with tool selection | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| AST over grep | All symbol analysis uses AST-based strategies, never raw text |
| Fixed language tiers | Full: TS, JS, Python, Ruby. Partial: Java, Kotlin |
| Fixed tool mapping | LSP for IDE, Tree-sitter for AST, Repomix for context, MCP for agents |
| 3-category impact | Direct callers + indirect refs + test coverage � always all 3 |
| Re-export tracking | TS/JS: always track barrel exports and re-exports |
| Precision first | Zero false positives; scope-aware resolution |
| No execution | Strategy only; caller runs tools |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Unsupported language | Return `ERR_UNSUPPORTED_LANGUAGE` | Use supported language |
| Missing symbol name | Return `ERR_MISSING_SYMBOL` | Supply symbol |
| Partial language support | Return `WARN_PARTIAL_SUPPORT` | Accept reduced accuracy |
| Missing file path | Return `ERR_MISSING_FILE_PATH` | Supply file path |

**Invariant:** Every failure returns a structured error. No partial strategies.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNSUPPORTED_LANGUAGE` | Validation | No | Language not in matrix |
| `ERR_MISSING_SYMBOL` | Validation | Yes | Symbol name not provided |
| `ERR_MISSING_FILE_PATH` | Validation | Yes | File path not provided |
| `WARN_PARTIAL_SUPPORT` | Advisory | Yes | Language has partial support |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Strategy generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "knowledge-graph",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "language": "string",
  "symbol": "string|null",
  "analysis_depth": "string",
  "tool_recommended": "string|null",
  "language_support_tier": "string",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Strategy generated | INFO | request_type, language, tool_recommended |
| Partial support used | WARN | language, language_support_tier |
| Impact analysis issued | INFO | symbol, analysis_depth, change_type |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `knowledgegraph.decision.duration` | Histogram | ms |
| `knowledgegraph.language.distribution` | Counter | per language |
| `knowledgegraph.request_type.distribution` | Counter | per type |
| `knowledgegraph.tool.recommended` | Counter | per tool |

---

## 14. Security & Trust Model

### Data Handling

- Symbol names and file paths are treated as project metadata.
- No source code content is processed or stored.
- No credentials, tokens, or PII handled.
- Analysis strategies contain no sensitive data.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound strategy generation | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |
| Project size | Strategies adapt to small/medium/large | project_size input |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Strategy generation | < 3 ms | < 10 ms | 30 ms |
| Full impact framework | < 5 ms | < 15 ms | 50 ms |
| Output size | = 1,000 chars | = 3,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| New language not covered | Medium | No strategy available | Support tier classification |
| LSP server unavailable | Medium | Cannot execute analysis | Fallback to Tree-sitter strategy |
| Barrel export complexity | Medium | Missed indirect refs | Explicit re-export tracking for TS/JS |
| Dynamic imports/eval | Low | Incomplete analysis | Document as known limitation |
| Partial support false confidence | Medium | Incorrect analysis | `WARN_PARTIAL_SUPPORT` returned |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | LSP or Tree-sitter recommended |
| When to Use section | ? | Need-based routing table |
| Core content matches skill type | ? | Expert type: decision trees, strategy output |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to code-review, system-design |
| Content Map for multi-file | ? | Link to engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 4 analysis capabilities (lookup, usages, impact, cross-file) | ? |
| **Functionality** | 4 full-support languages + 2 partial | ? |
| **Functionality** | 4 integration tools with fixed mapping | ? |
| **Functionality** | 3-category impact analysis (direct, indirect, tests) | ? |
| **Functionality** | Precision-first: AST over grep | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 5 categorized codes | ? |
| **Failure** | No partial strategies on error | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed language tiers, fixed tool mapping, fixed impact categories | ? |
| **Security** | No source code, no credentials | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
