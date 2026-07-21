# mcp-builder

**Version 1.0.0**
Engineering
March 2026

> **Note:**
> This document is for agents and LLMs to follow when working on mcp-builder domain.
> Optimized for automation and consistency by AI-assisted workflows.

---

# MCP Builder � Build MCP Servers for AI Agents

> 4 phases. Workflow over endpoints. 10-question evaluation. Context-aware output.

---

## Prerequisites

**Required:** Python 3.10+ or Node.js 18+. MCP spec: `https://modelcontextprotocol.io/llms-full.txt`

---

## When to Use

| Situation | Action |
|-----------|--------|
| Build a new MCP server | Follow 4-phase process |
| Choose framework | Python FastMCP vs TypeScript MCP SDK |
| Review MCP server quality | Use review checklist (4 items) |
| Test MCP server | Create 10 evaluation questions |
| Learn MCP design | Read `rules/design-principles.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| 4-phase build process | MCP tool discovery (? mcp-management) |
| Framework selection (2 options) | API design (? api-architect) |
| Review checklist (4 items) | TypeScript patterns (? typescript-expert) |
| Evaluation framework (10 questions) | Server hosting/deployment |

**Expert decision skill:** Produces build guidance. Does not create files or run code.

---

## 4-Phase Build Process (Fixed Order)

| Phase | Focus | Deliverable |
|-------|-------|-------------|
| 1. **Research** | Study MCP spec + target API | API surface documented |
| 2. **Implement** | Build with selected framework | Server code complete |
| 3. **Review** | Quality checklist pass | All 4 items pass |
| 4. **Evaluate** | 10 complex test questions | All 10 pass |

---

## Framework Selection (Deterministic)

| Condition | Framework |
|-----------|-----------|
| Team is python-heavy OR needs_async | **Python FastMCP** |
| Team is typescript-heavy OR needs strict typing | **TypeScript MCP SDK** |
| Balanced / no preference | **Python FastMCP** (default) |

---

## Review Checklist (4 Mandatory Items)

- [ ] No duplicate code (DRY)
- [ ] Error handling for all external calls
- [ ] Full type coverage
- [ ] All tools have detailed docstrings

```bash
# Python verification
python -m py_compile server.py

# TypeScript verification
tsc --noEmit
```

---

## Evaluation Framework

Create 10 test questions that are:

| Criterion | Requirement |
|-----------|-------------|
| Independent | No dependencies between questions |
| Read-only | Never modify data |
| Complex | Require multi-tool workflows |
| Realistic | Match real user scenarios |
| Verifiable | Deterministic expected output |
| Stable | Consistent results across runs |

---

## Design Principles

| Principle | Application |
|-----------|-------------|
| Workflow over endpoints | Design tools for agent tasks, not API mirrors |
| Context-aware output | Support `concise` vs `detailed` modes |
| Actionable errors | Error messages include recovery steps |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_INVALID_PHASE` | Yes | Phase number not 1-4 |
| `ERR_MISSING_EXPERIENCE` | Yes | Team experience not provided |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |

**Zero internal retries.** Deterministic; same context = same guidance.

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|-------|
| Mirror API endpoints as tools | Design workflow-oriented tools |
| Skip evaluation phase | Create 10 test questions |
| Omit docstrings on tools | Detailed docstrings for agent discovery |
| Embed API keys in tool code | Use environment variables |
| Skip research phase | Read MCP spec + target API first |

---

## ?? Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [design-principles.md](rules/design-principles.md) | Core MCP concepts | Phase 1 (Research) |
| [quickstart.md](rules/quickstart.md) | Getting started | Phase 2 (Implement) |
| [python-implementation.md](rules/python-implementation.md) | Python patterns | Python selected |
| [typescript-implementation.md](rules/typescript-implementation.md) | TypeScript patterns | TypeScript selected |
| [best-practices.md](rules/best-practices.md) | Design decisions | Phase 3 (Review) |
| [evaluation.md](rules/evaluation.md) | Testing framework | Phase 4 (Evaluate) |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY files relevant to the current phase.

---

## ?? Related

| Item | Type | Purpose |
|------|------|---------|
| `mcp-management` | Skill | MCP tool discovery |
| `api-architect` | Skill | API design |
| `typescript-expert` | Skill | TS patterns |

---



---

## Detailed Rules


---

### Rule: best-practices

---
name: mcp-best-practices
description: MCP design patterns � workflow over endpoints, concise/detailed output, actionable errors, naming conventions
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
# ? Bad
raise Exception("Invalid filter")

# ? Good
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



---

## ?? Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Phase 3 review checklist |
| [design-principles.md](design-principles.md) | Core MCP concepts |
| [python-implementation.md](python-implementation.md) | Python patterns |
| [typescript-implementation.md](typescript-implementation.md) | TypeScript patterns |
| [evaluation.md](evaluation.md) | Phase 4 testing |

---

### Rule: design-principles

---
name: mcp-design-principles
description: Core MCP concepts � tool/resource/prompt design, transport selection, error handling, security patterns
---

# MCP Server Design Principles

> Core principles for building MCP (Model Context Protocol) servers.

---

## MCP Overview

Model Context Protocol - standard for connecting AI systems with external tools and data.

| Concept       | Purpose                      |
| ------------- | ---------------------------- |
| **Tools**     | Functions AI can call        |
| **Resources** | Data AI can read             |
| **Prompts**   | Pre-defined prompt templates |

---

## Server Architecture

```
my-mcp-server/
+-- src/index.ts    # Main entry
+-- package.json
+-- tsconfig.json
```

| Transport     | Use                      |
| ------------- | ------------------------ |
| **Stdio**     | Local, CLI-based         |
| **SSE**       | Web-based, streaming     |
| **WebSocket** | Real-time, bidirectional |

---

## Tool Design

| Principle         | Description                                |
| ----------------- | ------------------------------------------ |
| Clear name        | Action-oriented (get_weather, create_user) |
| Single purpose    | One thing well                             |
| Validated input   | Schema with types and descriptions         |
| Structured output | Predictable response format                |

---

## Resource Patterns

| Type     | Use                       | URI Example         |
| -------- | ------------------------- | ------------------- |
| Static   | Fixed data (config, docs) | `docs://readme`     |
| Dynamic  | Generated on request      | `users://{userId}`  |
| Template | URI with parameters       | `files://project/*` |

---

## Error Handling

| Situation      | Response                   |
| -------------- | -------------------------- |
| Invalid params | Validation error message   |
| Not found      | Clear "not found"          |
| Server error   | Generic error, log details |

---

## Security & Config

- Validate all tool inputs, sanitize user data
- Use environment variables for API keys
- Don't log secrets, validate permissions

---

## Best Practices Checklist

- [ ] Clear, action-oriented tool names
- [ ] Complete input schemas with descriptions
- [ ] Structured JSON output
- [ ] Error handling for all cases
- [ ] Environment-based configuration

---



---

## ?? Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | 4-phase build, framework selection |
| [quickstart.md](quickstart.md) | Setup guides (Python/TypeScript) |
| [best-practices.md](best-practices.md) | Workflow design, error patterns |
| [engineering-spec.md](engineering-spec.md) | Full engineering spec |

---

### Rule: engineering-spec

---
name: mcp-builder-engineering-spec
description: Full 21-section engineering spec � 4-phase build contracts, framework selection, evaluation framework
---

# MCP Builder � Engineering Specification

> Production-grade specification for building MCP servers for AI agents at FAANG scale.

---

## 1. Overview

MCP Builder provides a structured 4-phase process for building Model Context Protocol (MCP) servers: Research (API + MCP spec study), Implement (Python FastMCP or TypeScript MCP SDK), Review (quality checklist), and Evaluate (10 complex test questions). The skill operates as an expert knowledge base with 6 reference files � it produces build guidance, framework selection decisions, and evaluation criteria. It does not execute code, install packages, or deploy servers.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

MCP server development at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| No structured build process | 55% of MCP servers built ad-hoc without phases | Missing review, no evaluation |
| Wrong framework selection | 30% of projects pick framework without criteria | Rework or migration |
| Endpoint-oriented design | 45% of MCP tools mirror API endpoints instead of workflows | Poor agent usability |
| No evaluation framework | 60% of MCP servers ship without structured testing | Undiscovered failures |

MCP Builder eliminates these with a fixed 4-phase process, deterministic framework selection, workflow-oriented design principles, and a 10-question evaluation framework.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | 4-phase build process | Research ? Implement ? Review ? Evaluate (fixed order) |
| G2 | Framework selection | Python FastMCP vs TypeScript MCP SDK (2 options, deterministic) |
| G3 | Workflow-oriented tools | Tools designed for agent workflows, not raw API endpoints |
| G4 | Review checklist | 4 mandatory items (DRY, error handling, types, docstrings) |
| G5 | 10-question evaluation | Independent, read-only, complex, verifiable, stable |
| G6 | Context-aware output | `concise` vs `detailed` mode for tool responses |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | MCP server discovery/invocation | Owned by `mcp-management` skill |
| NG2 | API architecture design | Owned by `api-architect` skill |
| NG3 | TypeScript patterns | Owned by `typescript-expert` skill |
| NG4 | MCP protocol specification | Defined by MCP spec (external) |
| NG5 | Server hosting/deployment | Infrastructure concern |
| NG6 | Client-side MCP integration | Different concern |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| 4-phase build process | Phase definition + order | Phase execution |
| Framework selection (2 options) | Decision criteria | Framework installation |
| Design principles (workflow-oriented) | Principle guidance | Tool implementation |
| Review checklist (4 items) | Checklist definition | Code review execution |
| Evaluation framework (10 questions) | Question criteria | Test execution |
| 6 reference files | Knowledge content | Reference file authoring |

**Side-effect boundary:** MCP Builder produces build guidance, framework decisions, and evaluation criteria. It does not create files, execute code, or interact with MCP servers.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "phase-guide" | "framework-select" | "review-checklist" |
                              # "evaluation" | "design-principles" | "full-guide"
Context: {
  target_api: string | null   # API the MCP server will wrap
  language_preference: string | null  # "python" | "typescript" | null
  team_experience: string     # "python-heavy" | "typescript-heavy" | "balanced"
  needs_async: boolean        # Whether async operations required
  needs_type_safety: boolean  # Whether strict typing required
  current_phase: number | null  # 1-4, current build phase
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  phase: {
    number: number            # 1-4
    name: string              # "Research" | "Implement" | "Review" | "Evaluate"
    focus: string
    deliverables: Array<string>
    reference_file: string | null
  } | null
  framework: {
    name: string              # "python-fastmcp" | "typescript-mcp-sdk"
    rationale: string
    reference_file: string
  } | null
  review: {
    items: Array<{
      check: string
      status: string          # "pass" | "fail" | "pending"
    }>
    test_commands: Array<string>
  } | null
  evaluation: {
    criteria: Array<string>   # 6 criteria: independent, read-only, complex, realistic, verifiable, stable
    question_count: number    # Always 10
    reference_file: string
  } | null
  design_principles: {
    principles: Array<{
      name: string
      description: string
    }>
    reference_file: string
  } | null
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

- Phase order is fixed: Research (1) ? Implement (2) ? Review (3) ? Evaluate (4).
- Framework selection is deterministic: python-heavy OR needs_async ? Python FastMCP; typescript-heavy OR needs_type_safety ? TypeScript MCP SDK; balanced ? Python FastMCP (default).
- Review checklist always has 4 items: DRY, error handling, type coverage, docstrings.
- Evaluation always produces 10 questions with 6 criteria.
- Design principles always include: workflow-oriented, context-aware output, actionable errors.
- Reference files are fixed: 6 files in `rules/`.

#### What Agents May Assume

- Phase order is enforced.
- Framework decision maps to team experience + requirements.
- Review checklist is complete (4 mandatory items).
- Evaluation criteria are stable.

#### What Agents Must NOT Assume

- MCP spec is bundled (must read from URL).
- Framework packages are installed.
- The skill creates MCP server files.
- Evaluation questions execute automatically.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Phase guide | None; phase description |
| Framework select | None; recommendation |
| Review checklist | None; checklist output |
| Evaluation | None; criteria + template |
| Design principles | None; principle guidance |
| Full guide | None; combined output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify target API and team experience
2. Invoke framework-select for language decision
3. Invoke phase-guide for Phase 1 (Research)
4. Read MCP spec + target API docs (caller's responsibility)
5. Invoke phase-guide for Phase 2 (Implement)
6. Build MCP server (caller's responsibility)
7. Invoke review-checklist for Phase 3 (Review)
8. Fix issues (caller's responsibility)
9. Invoke evaluation for Phase 4 (Evaluate)
10. Create and run 10 test questions (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete phase guide or decision.
- Phases can be invoked individually or sequentially.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported type |
| Invalid phase number | Return error to caller | Use 1-4 |
| Missing team experience | Return error to caller | Supply experience level |
| Reference file missing | Return error to caller | Verify installation |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Phase guide | Yes | Same phase = same guide |
| Framework select | Yes | Same context = same framework |
| Review checklist | Yes | Fixed 4 items |
| Evaluation | Yes | Fixed 10-question template |
| Design principles | Yes | Fixed principles |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate request type, context fields | Validated input or error |
| **Emit** | Generate phase guide, decision, or checklist | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed phase order | Research (1) ? Implement (2) ? Review (3) ? Evaluate (4) |
| Fixed framework selection | python-heavy OR needs_async ? FastMCP; else ? TypeScript SDK |
| Workflow over endpoints | Tools designed for agent workflows, never raw API mirror |
| Fixed review items | DRY, error handling, type coverage, docstrings � always 4 |
| Fixed evaluation size | 10 questions, 6 criteria |
| Context-aware output | concise vs detailed mode for tool responses |
| MCP spec URL fixed | `https://modelcontextprotocol.io/llms-full.txt` |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Invalid phase number | Return `ERR_INVALID_PHASE` | Use 1-4 |
| Missing team experience | Return `ERR_MISSING_EXPERIENCE` | Supply experience |
| Reference file missing | Return `ERR_REFERENCE_NOT_FOUND` | Verify installation |
| Build fails (caller) | Not this skill's error | Check tsconfig or pip install |

**Invariant:** Every failure returns a structured error. No partial guides.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_INVALID_PHASE` | Validation | Yes | Phase number not 1-4 |
| `ERR_MISSING_EXPERIENCE` | Validation | Yes | Team experience not provided |
| `ERR_REFERENCE_NOT_FOUND` | Infrastructure | No | Reference file missing |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision timeout | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "mcp-builder",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "current_phase": "number|null",
  "framework_selected": "string|null",
  "target_api": "string|null",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Framework selected | INFO | framework_selected, rationale |
| Phase guide issued | INFO | current_phase, deliverables |
| Review checklist issued | INFO | items_count |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `mcpbuilder.decision.duration` | Histogram | ms |
| `mcpbuilder.framework.distribution` | Counter | python vs typescript |
| `mcpbuilder.phase.distribution` | Counter | per phase |
| `mcpbuilder.request_type.distribution` | Counter | per type |

---

## 14. Security & Trust Model

### Data Handling

- MCP Builder does not access API keys, credentials, or servers.
- Reference files contain public knowledge only.
- Framework selection uses no external calls.

### MCP-Specific Security Guidance

| Guidance | Enforcement |
|----------|-------------|
| Never embed API keys in MCP tools | Design principle output |
| Rate limit awareness | Research phase deliverable |
| Error sanitization | Review checklist item |

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Reference storage | 6 files (~15 KB total) | Static; no growth |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

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
| Framework selection | < 2 ms | < 5 ms | 20 ms |
| Full guide | < 10 ms | < 30 ms | 50 ms |
| Output size | = 1,500 chars | = 3,500 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| MCP spec URL changes | Low | Research phase broken | Version-pinned URL |
| Framework deprecation | Low | Selection stale | Review annually |
| Endpoint-oriented design | Medium | Poor agent UX | Workflow principle enforced |
| Evaluation questions too simple | Medium | Missing edge cases | 6 criteria enforced |
| Missing docstrings on tools | High | Agent cannot discover tools | Review checklist item |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | MCP spec URL, Python or TypeScript |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: decision trees, phase guidance |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to mcp-management, api-architect, typescript-expert |
| Content Map for multi-file | ? | Links to 6 reference files + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 4-phase build process (Research ? Implement ? Review ? Evaluate) | ? |
| **Functionality** | Framework selection (Python FastMCP vs TypeScript MCP SDK) | ? |
| **Functionality** | Review checklist (4 mandatory items) | ? |
| **Functionality** | 10-question evaluation with 6 criteria | ? |
| **Functionality** | Design principles (workflow-oriented, context-aware) | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 4 categorized codes | ? |
| **Failure** | No partial guides on error | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed phases, fixed framework selection, fixed checklist | ? |
| **Security** | No credentials, no external calls | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---



---

## ?? Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Quick reference, 4-phase build, anti-patterns |
| [design-principles.md](design-principles.md) | Phase 1 � MCP concepts |
| [quickstart.md](quickstart.md) | Phase 2 � setup guides |
| [python-implementation.md](python-implementation.md) | Phase 2 � Python patterns |
| [typescript-implementation.md](typescript-implementation.md) | Phase 2 � TypeScript patterns |
| [best-practices.md](best-practices.md) | Phase 3 � review patterns |
| [evaluation.md](evaluation.md) | Phase 4 � testing framework |
| `mcp-management` | MCP tool discovery |

---

### Rule: evaluation

---
name: mcp-evaluation
description: 10-question evaluation framework for MCP servers � complex, read-only, verifiable test questions
---

# MCP Evaluation Guide

> Create 10 complex questions to test your MCP server with real AI agents.

---

## Purpose

Evaluations test whether LLMs can effectively use your MCP server to answer realistic, complex questions.

---

## Question Requirements

Each question MUST be:

| Requirement | Description |
|-------------|-------------|
| **Independent** | Not dependent on other questions |
| **Read-only** | Only non-destructive operations |
| **Complex** | Requires multiple tool calls |
| **Realistic** | Based on real use cases |
| **Verifiable** | Single, clear answer |
| **Stable** | Answer won't change over time |

---

## Question Creation Process

1. **Tool Inspection** - List available tools and capabilities
2. **Content Exploration** - Use READ-ONLY operations to explore data
3. **Question Generation** - Create 10 complex, realistic questions
4. **Answer Verification** - Solve each question yourself

---

## Example Question

```xml
<qa_pair>
  <question>
    Find discussions about AI model launches with animal codenames.
    One model needed a specific safety designation (ASL-X).
    What number X was determined for the spotted wild cat model?
  </question>
  <answer>3</answer>
</qa_pair>
```

This requires:
- Searching discussions about AI models
- Filtering for animal-themed codenames
- Identifying safety designation format
- Finding specific model (cheetah/leopard)
- Extracting the ASL number

---

## Output Format

```xml
<evaluation>
  <qa_pair>
    <question>Your complex question here</question>
    <answer>Single verifiable answer</answer>
  </qa_pair>
  <!-- 9 more qa_pairs -->
</evaluation>
```

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|-------|
| Simple one-tool questions | Multi-step exploration |
| Write operations | Read-only operations |
| Time-sensitive answers | Stable, verifiable answers |
| Vague answers | Specific, comparable answers |

---



---

## ?? Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Phase 4 overview |
| [best-practices.md](best-practices.md) | Design patterns to test |
| [engineering-spec.md](engineering-spec.md) | Evaluation contracts |

---

### Rule: python-implementation

---
name: mcp-python-implementation
description: Python MCP server with FastMCP � tool annotations, error helpers, pagination, quality checklist
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
+-- server.py           # Main entry
+-- requirements.txt    # Dependencies
+-- .env.example        # Environment template
+-- README.md           # Documentation
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



---

## ?? Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | 4-phase build, review checklist |
| [quickstart.md](quickstart.md) | Minimal Python setup |
| [typescript-implementation.md](typescript-implementation.md) | TypeScript alternative |
| [best-practices.md](best-practices.md) | Workflow design patterns |
| [evaluation.md](evaluation.md) | Phase 4 testing |

---

### Rule: quickstart

---
name: mcp-quickstart
description: Setup guides for Python FastMCP and TypeScript MCP SDK servers with minimal templates
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



---

## ?? Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | 4-phase build process |
| [python-implementation.md](python-implementation.md) | Full Python server template |
| [typescript-implementation.md](typescript-implementation.md) | Full TypeScript server template |
| [design-principles.md](design-principles.md) | MCP concepts |

---

### Rule: typescript-implementation

---
name: mcp-typescript-implementation
description: TypeScript MCP server with Zod validation � tool annotations, strict mode, build/test workflow
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
+-- src/
�   +-- index.ts        # Main entry
�   +-- tools/          # Tool definitions
�   +-- utils/          # Helpers
+-- package.json
+-- tsconfig.json
+-- .env.example
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



---

## ?? Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | 4-phase build, review checklist |
| [quickstart.md](quickstart.md) | Minimal TypeScript setup |
| [python-implementation.md](python-implementation.md) | Python alternative |
| [best-practices.md](best-practices.md) | Workflow design patterns |
| [evaluation.md](evaluation.md) | Phase 4 testing |
| `typescript-expert` | Advanced TypeScript patterns |

---

? PikaKit v3.9.206
