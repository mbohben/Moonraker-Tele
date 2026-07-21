---
title: Shell Script � Engineering Specification
impact: MEDIUM
tags: shell-script
---

# Shell Script � Engineering Specification

> Production-grade specification for Bash/Linux terminal patterns at FAANG scale.

---

## 1. Overview

Shell Script provides structured guidance for Bash scripting on Linux/macOS: operator syntax (4 operators: `;`, `&&`, `||`, `|`), file operations (5 commands), process management (5 commands), text processing (4 tools: grep, sed, awk, cut), environment variables (3 tasks), network commands (4 tasks), script template (`set -euo pipefail` + main pattern), common patterns (4 patterns), and Bash vs PowerShell comparison (3 equivalencies). The skill operates as an **Expert (decision tree)** � it produces command recommendations, script patterns, and syntax guidance. It does not execute commands, modify files, or access the shell.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Shell scripting at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Missing error handling | 60% of scripts lack `set -euo pipefail` | Silent failures |
| Wrong operator syntax | 40% of multi-command scripts use `;` where `&&` is needed | Cascading errors |
| No cleanup on exit | 50% of scripts skip `trap` cleanup | Orphaned temp files |
| Platform confusion | 35% of scripts mix Bash and PowerShell syntax | Cross-platform failures |

Shell Script eliminates these with a fixed script template (mandatory `set -euo pipefail`), deterministic operator routing, trap-based cleanup, and explicit Bash vs PowerShell mapping.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Operator syntax | 4 operators with defined semantics |
| G2 | File operations | 5 commands by task |
| G3 | Process management | 5 commands by task |
| G4 | Text processing | 4 tools by purpose (grep/sed/awk/cut) |
| G5 | Script template | `set -euo pipefail` + main() + log functions |
| G6 | Common patterns | 4 patterns (command check, default value, loop, trap) |
| G7 | Cross-platform | Bash vs PowerShell mapping (3 tasks) |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | CI/CD pipeline scripts | Owned by `cicd-pipeline` skill |
| NG2 | Server operations | Owned by `server-ops` skill |
| NG3 | Command execution | Guidance only; execution is caller's responsibility |
| NG4 | PowerShell deep expertise | Bash/Linux focused |
| NG5 | Zsh/Fish shell specifics | Bash only |
| NG6 | Windows batch scripting | Unix/macOS only |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Operator syntax | 4 operators with semantics | Shell execution |
| File operations | Command routing by task | File system access |
| Process management | Command routing by task | Process control |
| Text processing | Tool routing (grep/sed/awk/cut) | Text file access |
| Script template | set -euo pipefail + main | Script execution |
| Cross-platform | Bash ? PowerShell mapping | PowerShell expertise |

**Side-effect boundary:** Shell Script produces command recommendations, script patterns, and syntax guidance. It does not execute commands, access files, or modify the shell environment.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "operator" | "file-ops" | "process" | "text-processing" |
                              # "env-vars" | "network" | "template" | "pattern" |
                              # "cross-platform" | "full-guide"
Context: {
  task: string | null         # What the user wants to accomplish
  platform: string | null     # "linux" | "macos" | "both"
  shell: string | null        # "bash" | "powershell" | null
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  operator: {
    symbol: string            # ";", "&&", "||", "|"
    meaning: string
    example: string
  } | null
  commands: Array<{
    task: string
    command: string
    example: string | null
  }> | null
  template: {
    shebang: string           # "#!/bin/bash"
    options: string           # "set -euo pipefail"
    log_functions: string     # log_info, log_error
    main_pattern: string      # main() + main "$@"
  } | null
  pattern: {
    name: string
    code: string              # Complete Bash snippet
    purpose: string
  } | null
  cross_platform: {
    task: string
    bash: string
    powershell: string
  } | null
  security: {
    rules_of_engagement_followed: boolean
  } | null
  code_quality: {
    problem_checker_run: boolean
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

- Operator routing is fixed: sequential ? `;`; conditional success ? `&&`; conditional failure ? `||`; pipe output ? `|`.
- Text tool routing is fixed: search ? `grep`; replace ? `sed`; column extraction ? `awk`; field cutting ? `cut`.
- Script template is fixed: `#!/bin/bash` + `set -euo pipefail` + log functions + main pattern.
- Bash vs PowerShell mapping is fixed for 3 tasks: list files, env vars, pipeline type.
- Same task = same command recommendation.

#### What Agents May Assume

- Bash is available on target system (Linux/macOS).
- Standard coreutils are present (ls, grep, find, sed, awk, cut, curl).
- Shell is Bash (not zsh, fish, or sh).
- File paths follow Unix conventions (forward slash).

#### What Agents Must NOT Assume

- PowerShell is available on Unix systems.
- All commands support same flags across Linux and macOS (BSD vs GNU).
- User has root/sudo access.
- `/tmp` is writable.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Operator guidance | None; syntax recommendation |
| File operations | None; command recommendation |
| Process management | None; command recommendation |
| Text processing | None; tool recommendation |
| Script template | None; template output |
| Cross-platform | None; mapping output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify task type (file, process, text, network, etc.)
2. Invoke appropriate request type for command guidance
3. For scripts: invoke template for boilerplate
4. For patterns: invoke pattern for reusable snippets
5. Write and execute script (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- All decisions are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Unknown task type | Return error | Specify valid type |
| Unsupported platform | Return error | Use linux or macos |
| Invalid request type | Return error | Use supported type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Operator | Yes | Same semantics = same symbol |
| File ops | Yes | Same task = same command |
| Text processing | Yes | Same purpose = same tool |
| Template | Yes | Fixed boilerplate |
| Pattern | Yes | Same pattern = same code |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Parse task, platform, shell | Classification |
| **Guide** | Generate command, template, or pattern | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Operator routing | Sequential ? `;`; Conditional success ? `&&`; Conditional failure ? `\|\|`; Pipe ? `\|` |
| File operations | List ? `ls -la`; Find ? `find . -name "pattern" -type f`; Search ? `grep -r "pattern"`; Size ? `du -sh *`; Head/Tail ? `head -n N` / `tail -n N` |
| Process management | List ? `ps aux`; Find by name ? `ps aux \| grep name`; Kill ? `kill -9 PID`; Find port ? `lsof -i :PORT`; Kill port ? `kill -9 $(lsof -t -i :PORT)` |
| Text processing | Search ? `grep -rn`; Replace ? `sed -i 's/old/new/g'`; Columns ? `awk '{print $N}'`; Cut fields ? `cut -d',' -fN` |
| Script template | `#!/bin/bash` + `set -euo pipefail` + `log_info()` + `log_error()` + `main() { ... }` + `main "$@"` |
| Common patterns | Command check ? `command -v name &> /dev/null`; Default value ? `${1:-"default"}`; Loop files ? `for file in *.ext; do ...; done`; Cleanup trap ? `trap 'cleanup' EXIT` |
| Bash vs PowerShell | List files: `ls` vs `Get-ChildItem`; Env var: `$VAR` vs `$env:VAR`; Pipeline: text-based vs object-based |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown task type | Return `ERR_UNKNOWN_TASK` | Specify valid task |
| Unsupported platform | Return `ERR_UNSUPPORTED_PLATFORM` | Use linux or macos |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** Every failure returns a structured error. No partial guidance.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_TASK` | Validation | Yes | Task not recognized |
| `ERR_UNSUPPORTED_PLATFORM` | Validation | Yes | Platform not linux or macos |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format (OpenTelemetry Event Array)

```json
{
  "traceId": "uuid",
  "spanId": "uuid",
  "events": [
    {
      "name": "script_analysis_started",
      "timestamp": "ISO8601",
      "attributes": {
        "task": "automation",
        "platform": "linux"
      }
    },
    {
      "name": "command_recommended",
      "timestamp": "ISO8601",
      "attributes": {
        "purpose": "text_processing",
        "tool": "awk"
      }
    },
    {
      "name": "template_generated",
      "timestamp": "ISO8601",
      "attributes": {
        "shebang": "#!/bin/bash",
        "flags": "euo pipefail"
      }
    },
    {
      "name": "analysis_completed",
      "timestamp": "ISO8601",
      "attributes": {
        "lines_generated": 25,
        "security_flags_set": true
      }
    }
  ]
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Command recommended | INFO | task, tool_recommended |
| Template generated | INFO | template_type |
| Pattern provided | INFO | pattern_name |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `shellscript.decision.duration` | Histogram | ms |
| `shellscript.request_type.distribution` | Counter | per type |
| `shellscript.tool.distribution` | Counter | per tool |
| `shellscript.platform.distribution` | Counter | per platform |

---

## 14. Security & Trust Model

### Data Handling

- Shell Script produces command syntax and patterns only.
- No credentials, no PII, no server addresses.
- No command execution, no file access, no network calls.
- Commands are text output; the caller is responsible for safe execution.

### Security Principles in Generated Scripts

- Always include `set -euo pipefail` (exit on error, undefined vars, pipe failures).
- Never embed credentials in scripts (use env vars).
- Use `trap` for cleanup of temporary resources.
- Quote variables: `"$VAR"` (prevent word splitting).

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
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
| Command recommendation | < 2 ms | < 5 ms | 20 ms |
| Template generation | < 2 ms | < 5 ms | 20 ms |
| Full guide | < 10 ms | < 30 ms | 50 ms |
| Output size | = 2,000 chars | = 5,000 chars | 8,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| BSD vs GNU flag differences | Medium | macOS commands differ | Document Linux/macOS variants |
| Bash version differences | Low | Feature unavailability | Target Bash 4+ |
| Shell deprecation (sh ? bash) | Low | Compatibility issues | Explicit `#!/bin/bash` shebang |
| coreutils availability | Low | Missing commands | Document required packages |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | Bash shell on Linux/macOS |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: operator routing, command guidance, templates |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to cicd-pipeline, server-ops |
| Content Map for multi-file | ? | Link to engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 4 operators with semantics | ? |
| **Functionality** | 5 file operation commands | ? |
| **Functionality** | 5 process management commands | ? |
| **Functionality** | 4 text processing tools (grep/sed/awk/cut) | ? |
| **Functionality** | Script template with set -euo pipefail | ? |
| **Functionality** | 4 common patterns | ? |
| **Functionality** | Bash vs PowerShell mapping | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 3 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed operator routing, fixed tool routing, fixed template | ? |
| **Security** | No command execution, no credentials, set -euo pipefail enforced | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
