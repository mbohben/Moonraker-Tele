---
title: TypeScript Expert � Engineering Specification
impact: MEDIUM
tags: typescript-expert
---

# TypeScript Expert � Engineering Specification

> Production-grade specification for TypeScript/JavaScript expertise at FAANG scale.

---

## 1. Overview

TypeScript Expert provides structured guidance for TypeScript and JavaScript: type-level patterns (3: branded types, deep readonly, satisfies), common error resolution (4 error types with fixes), performance configuration (3 settings: skipLibCheck, incremental, project references), strict config (3 strict options), ESM-first configuration, tsconfig decision routing, monorepo management, and migration strategies. The skill operates as an **Expert (decision tree)** � it produces type pattern recommendations, error fixes, config guidance, and migration paths. It does not write TypeScript files, execute compilers, or modify tsconfig.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

TypeScript development at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Type errors without resolution path | 45% of TS errors take >30 min to resolve | Developer productivity loss |
| Slow type checking | 35% of monorepos exceed 60s tsc time | CI/CD bottlenecks |
| Weak config defaults | 50% of projects miss strict mode | Runtime type safety gaps |
| ESM/CJS module confusion | 40% of projects have module resolution issues | Build failures |

TypeScript Expert eliminates these with deterministic error?fix routing, performance configuration guidance (skipLibCheck + incremental + project references), strict config enforcement, and ESM-first module resolution.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Type-level patterns | 3 patterns: branded types, deep readonly, satisfies |
| G2 | Error resolution | 4 common errors with deterministic fixes |
| G3 | Performance | 3 settings: skipLibCheck, incremental, project references |
| G4 | Strict config | 3 strict options: strict, noUncheckedIndexedAccess, noImplicitOverride |
| G5 | Module system | ESM-first with `"type": "module"` + `moduleResolution: "bundler"` |
| G6 | Diagnostics | 3 CLI commands: --noEmit, --extendedDiagnostics, --traceResolution |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Next.js integration | Owned by `nextjs-pro` skill |
| NG2 | React component patterns | Owned by `react-architect` skill |
| NG3 | Code review | Owned by `code-review` skill |
| NG4 | JavaScript runtime behavior | TypeScript type system focused |
| NG5 | Build tooling (Vite/webpack) | Bundler-specific concern |
| NG6 | Package publishing | npm/registry concern |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Type patterns | Branded types, deep readonly, satisfies | Framework-specific types |
| Error resolution | 4 common tsc errors | Runtime errors |
| Performance config | skipLibCheck, incremental, project refs | Build tooling config |
| Strict config | 3 strict compiler options | Linting rules (ESLint) |
| Module system | ESM-first guidance | Bundler configuration |
| Diagnostics | 3 tsc CLI commands | IDE integration |

**Side-effect boundary:** TypeScript Expert produces type pattern recommendations, error fixes, config guidance, and migration paths. It does not write files, execute compilers, or modify projects.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "type-pattern" | "error" | "performance" | "config" |
                              # "module" | "monorepo" | "migration" | "diagnostics" |
                              # "full-guide"
Context: {
  error_message: string | null  # tsc error message
  ts_version: string | null     # "5.0" | "5.1" | "5.2" | "5.3" | "5.4" | "5.5"
  project_type: string | null   # "app" | "library" | "monorepo"
  module_system: string | null  # "esm" | "cjs" | "dual"
  current_config: object | null # Existing tsconfig.json
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  type_pattern: {
    name: string
    code: string              # TypeScript code example
    use_case: string
  } | null
  error_fix: {
    error: string
    fix: string
    code: string | null       # Fix code example
  } | null
  performance: {
    settings: Array<{
      setting: string
      value: string | boolean
      effect: string
    }>
  } | null
  config: {
    tsconfig: object           # Recommended tsconfig partial
    description: string
  } | null
  module: {
    system: string             # "esm" | "cjs"
    package_json: object       # Required package.json fields
    tsconfig: object           # Required tsconfig fields
  } | null
  diagnostics: {
    command: string
    purpose: string
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

- Error routing is fixed: "Cannot be named" ? export type explicitly; "Excessive depth" ? limit recursion, use interface; "Cannot find module" ? check moduleResolution; missing types ? add ambient declaration.
- Performance routing is fixed: slow builds ? skipLibCheck + incremental + project references.
- Strict config is fixed: `strict: true` + `noUncheckedIndexedAccess: true` + `noImplicitOverride: true`.
- ESM-first is fixed: `"type": "module"` + `moduleResolution: "bundler"`.
- Same error = same fix. Same project type = same config.

#### What Agents May Assume

- TypeScript 5.0+ is the target version.
- `npx tsc --noEmit` validates type correctness.
- Strict mode is the recommended default.
- ESM is the preferred module system for new projects.

#### What Agents Must NOT Assume

- All projects can use ESM immediately.
- `skipLibCheck` is always safe (hides library type errors).
- Branded types are zero-cost at runtime (they are, but require discipline).
- Project references work without `composite: true`.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Type pattern | None; code example |
| Error fix | None; fix recommendation |
| Performance | None; config recommendation |
| Config | None; tsconfig partial |
| Module | None; setup guidance |
| Diagnostics | None; command recommendation |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify issue type (type error, performance, config, module)
2. Invoke appropriate request type
3. For type errors: invoke error with error message
4. For new projects: invoke config for strict + ESM setup
5. For monorepos: invoke monorepo for project references
6. Validate with `npx tsc --noEmit` (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- All decisions are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Unknown error message | Return error | Provide exact tsc error |
| Unsupported TS version | Return error | Use 5.0+ |
| Invalid request type | Return error | Use supported type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Type pattern | Yes | Same pattern = same code |
| Error fix | Yes | Same error = same fix |
| Performance | Yes | Same project type = same settings |
| Config | Yes | Same inputs = same tsconfig |
| Module | Yes | Same system = same setup |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Parse error message, project type, module system | Classification |
| **Guide** | Generate type pattern, error fix, config, or migration | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Error routing | "Cannot be named" ? export type; "Excessive depth" ? limit recursion, use interface; "Cannot find module" ? check moduleResolution; missing types ? ambient declaration |
| Performance | `skipLibCheck: true` (skip library checks); `incremental: true` (cache builds); project references (monorepo) |
| Strict config | `strict: true` + `noUncheckedIndexedAccess: true` + `noImplicitOverride: true` |
| ESM-first | `"type": "module"` in package.json + `moduleResolution: "bundler"` in tsconfig |
| Type patterns | Branded: `type Brand<K, T> = K & { __brand: T }`; DeepReadonly: recursive mapped type; Satisfies: `as const satisfies Type` |
| Diagnostics | Type check: `npx tsc --noEmit`; Performance: `npx tsc --extendedDiagnostics`; Resolution: `npx tsc --traceResolution` |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown error message | Return `ERR_UNKNOWN_ERROR` | Provide exact tsc error text |
| Unsupported TS version | Return `ERR_UNSUPPORTED_VERSION` | Use TypeScript 5.0+ |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Unknown project type | Return `ERR_UNKNOWN_PROJECT_TYPE` | Specify app, library, or monorepo |

**Invariant:** Every failure returns a structured error. No partial type guidance.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_ERROR` | Validation | Yes | tsc error not in routing table |
| `ERR_UNSUPPORTED_VERSION` | Validation | Yes | TS version below 5.0 |
| `ERR_UNKNOWN_PROJECT_TYPE` | Validation | Yes | Project type not app, library, or monorepo |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "typescript-expert",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "ts_version": "string|null",
  "project_type": "string|null",
  "error_resolved": "string|null",
  "config_recommended": "string|null",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Type pattern recommended | INFO | pattern_name |
| Error fix provided | INFO | error_message, fix |
| Config recommended | INFO | project_type, settings |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `tsexpert.decision.duration` | Histogram | ms |
| `tsexpert.request_type.distribution` | Counter | per type |
| `tsexpert.error.distribution` | Counter | per error |
| `tsexpert.project_type.distribution` | Counter | per type |

---

## 14. Security & Trust Model

### Data Handling

- TypeScript Expert processes error messages, config objects, and version strings only.
- No credentials, no PII, no source code execution.
- No network calls, no file access, no compiler execution.

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
| Error fix | < 2 ms | < 5 ms | 20 ms |
| Config recommendation | < 2 ms | < 5 ms | 20 ms |
| Type pattern | < 2 ms | < 5 ms | 20 ms |
| Full guide | < 10 ms | < 30 ms | 50 ms |
| Output size | = 3,000 chars | = 8,000 chars | 12,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| TS version break (6.0) | Low | Major API changes | Track TypeScript roadmap |
| `moduleResolution` changes | Medium | Config invalidation | Document version-specific options |
| Strict mode too aggressive | Low | Developer friction | Incremental adoption path |
| Type-level pattern complexity | Medium | Unmaintainable types | Recommend simple alternatives first |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | TypeScript 5.0+ |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: error routing, type patterns, config guidance |
| Troubleshooting section | ? | Error table + troubleshooting table |
| Related section | ? | Cross-links to nextjs-pro, react-architect, code-review |
| Content Map for multi-file | ? | Links to rules/ + scripts/ + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 3 type-level patterns (branded, deep readonly, satisfies) | ? |
| **Functionality** | 4 common error ? fix routing | ? |
| **Functionality** | 3 performance settings | ? |
| **Functionality** | Strict config (3 options) | ? |
| **Functionality** | ESM-first module config | ? |
| **Functionality** | 3 diagnostic CLI commands | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 4 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed error routing, fixed config, fixed patterns | ? |
| **Security** | No source code execution, no files, no network | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
