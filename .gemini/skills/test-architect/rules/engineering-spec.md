---
title: Test Architect � Engineering Specification
impact: MEDIUM
tags: test-architect
---

# Test Architect � Engineering Specification

> Production-grade specification for testing patterns and principles at FAANG scale.

---

## 1. Overview

Test Architect provides structured guidance for testing: strategy selection (3 models: Pyramid, Trophy, Honeycomb), AAA pattern (Arrange/Act/Assert), FIRST principles (5: Fast/Isolated/Repeatable/Self-checking/Timely), mock types (4: Stub/Spy/Mock/Fake), mock decision guidance (what to mock vs not), test naming conventions (3 patterns), and anti-patterns (4). The skill operates as an **Expert (decision tree)** � it produces testing strategy recommendations, mock selections, and naming guidance. It does not write test files, execute tests, or measure coverage.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Testing at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Wrong test distribution | 40% of projects have inverted pyramid (too many E2E) | Slow CI, flaky tests |
| No test structure | 50% of tests skip AAA pattern | Unreadable tests |
| Over-mocking | 35% of tests mock code under test | False positives |
| Poor naming | 45% of test names describe implementation, not behavior | Unclear failures |

Test Architect eliminates these with deterministic strategy selection (3 models by architecture), mandatory AAA structure, mock type routing (4 types by use case), and naming conventions (3 patterns).

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Strategy selection | 3 models: Pyramid (70/20/10), Trophy (integration-heavy), Honeycomb (contract-centric) |
| G2 | Test structure | AAA pattern: Arrange ? Act ? Assert |
| G3 | Quality principles | FIRST: Fast (<100ms), Isolated, Repeatable, Self-checking, Timely |
| G4 | Mock routing | 4 types: Stub, Spy, Mock, Fake |
| G5 | Mock decisions | Clear mock vs don't-mock guidance |
| G6 | Naming | 3 conventions: should, when, given-when-then |
| G7 | Coverage target | >80% line coverage |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | E2E browser testing | Owned by `e2e-automation` skill |
| NG2 | TDD workflow | Owned by `test-driven-dev` skill |
| NG3 | Test execution | Runtime concern |
| NG4 | Coverage tooling | Framework-specific |
| NG5 | Code quality | Owned by `code-craft` skill |
| NG6 | Test file creation | Implementation concern |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Strategy selection | 3 models by architecture type | Test runner configuration |
| AAA pattern | Arrange/Act/Assert structure | Test framework syntax |
| Mock routing | 4 types by use case | Mock library APIs |
| FIRST principles | 5 quality criteria | Performance profiling |
| Naming conventions | 3 patterns | Linting enforcement |

**Side-effect boundary:** Test Architect produces testing strategy recommendations, mock selections, and naming guidance. It does not write tests, execute code, or measure coverage.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "strategy" | "structure" | "mock" | "naming" |
                              # "coverage" | "anti-pattern" | "full-guide"
Context: {
  architecture: string | null  # "monolith" | "spa" | "microservices"
  test_level: string | null    # "unit" | "integration" | "e2e"
  dependency_type: string | null  # "api" | "database" | "time" | "network" |
                                  # "pure-function" | "in-memory"
  framework: string | null     # "jest" | "vitest" | "mocha" | null
  current_coverage: number | null  # Percentage 0-100
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  strategy: {
    model: string             # "pyramid" | "trophy" | "honeycomb"
    distribution: {
      unit: number            # Percentage
      integration: number
      e2e: number
    }
    rationale: string
  } | null
  structure: {
    pattern: string           # "AAA"
    steps: Array<{
      name: string            # "Arrange" | "Act" | "Assert"
      purpose: string
    }>
    principles: Array<{
      letter: string
      name: string
      constraint: string
    }>
  } | null
  mock: {
    type: string              # "stub" | "spy" | "mock" | "fake"
    rationale: string
    should_mock: boolean
  } | null
  naming: {
    convention: string
    example: string
  } | null
  anti_patterns: Array<{
    bad: string
    good: string
  }> | null
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

- Strategy routing is fixed: monolith ? Pyramid (70/20/10); SPA ? Trophy (integration-heavy); microservices ? Honeycomb (contract-centric).
- Mock routing is fixed: return fixed values ? Stub; track calls ? Spy; set expectations ? Mock; simplified impl ? Fake.
- Mock decision is fixed: External APIs/DB/time/network ? mock; code under test/pure functions/simple deps/in-memory ? don't mock.
- Naming is fixed: 3 patterns (should, when, given-when-then).
- Same architecture = same strategy. Same dependency type = same mock decision.

#### What Agents May Assume

- AAA pattern applies to all unit tests.
- FIRST principles are universal quality criteria.
- Mock types are framework-agnostic concepts.
- Test naming patterns are convention-independent.

#### What Agents Must NOT Assume

- Pyramid model suits all architectures.
- 100% coverage is the goal (target is >80%).
- All external dependencies need mocking.
- E2E tests should be numerous.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Strategy | None; model recommendation |
| Structure | None; pattern guidance |
| Mock | None; type recommendation |
| Naming | None; convention guidance |
| Anti-pattern | None; avoidance guidance |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify architecture type (monolith, SPA, microservices)
2. Invoke strategy for test distribution model
3. Invoke structure for AAA pattern + FIRST principles
4. Invoke mock for dependency handling
5. Apply naming conventions
6. Write and execute tests (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- All decisions are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Unknown architecture | Return error | Specify monolith, spa, or microservices |
| Unknown dependency type | Return error | Specify valid type |
| Invalid request type | Return error | Use supported type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Strategy | Yes | Same architecture = same model |
| Structure | Yes | Fixed AAA + FIRST |
| Mock | Yes | Same dependency = same type |
| Naming | Yes | Fixed 3 conventions |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Parse architecture, test level, dependency type | Classification |
| **Guide** | Generate strategy, structure, mock, or naming recommendation | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Strategy routing | Monolith ? Pyramid (Unit 70%, Int 20%, E2E 10%); SPA ? Trophy (integration-heavy); Microservices ? Honeycomb (contract-centric) |
| AAA pattern | Arrange (setup data) ? Act (execute code) ? Assert (verify outcome) |
| FIRST principles | Fast (<100ms each), Isolated (no external deps), Repeatable (same result always), Self-checking (no manual verification), Timely (written with code) |
| Mock type routing | Return fixed values ? Stub; Track calls ? Spy; Set expectations ? Mock; Simplified implementation ? Fake |
| Mock decision | Mock: external APIs, database (unit), time/random, network; Don't mock: code under test, pure functions, simple dependencies, in-memory stores |
| Naming | "should [behavior]", "when [condition]", "given X, when Y, then Z" |
| Coverage | Target: >80% line coverage; 100% is not the goal |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown architecture | Return `ERR_UNKNOWN_ARCHITECTURE` | Specify monolith, spa, or microservices |
| Unknown dependency type | Return `ERR_UNKNOWN_DEPENDENCY` | Specify valid dependency type |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** Every failure returns a structured error. No partial testing guidance.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_ARCHITECTURE` | Validation | Yes | Architecture not one of 3 |
| `ERR_UNKNOWN_DEPENDENCY` | Validation | Yes | Dependency type not recognized |
| `ERR_UNKNOWN_TEST_LEVEL` | Validation | Yes | Test level not unit, integration, or e2e |

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
  "skill_name": "test-architect",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "architecture": "string|null",
  "test_level": "string|null",
  "strategy_model": "string|null",
  "mock_type": "string|null",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Strategy selected | INFO | architecture, strategy_model, distribution |
| Mock type selected | INFO | dependency_type, mock_type, should_mock |
| Naming recommended | INFO | convention |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `testarchitect.decision.duration` | Histogram | ms |
| `testarchitect.strategy_model.distribution` | Counter | per model |
| `testarchitect.mock_type.distribution` | Counter | per type |
| `testarchitect.request_type.distribution` | Counter | per type |

---

## 14. Security & Trust Model

### Data Handling

- Test Architect processes architecture types, dependency types, and coverage numbers only.
- No credentials, no PII, no source code.
- No network calls, no file access, no test execution.

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
| Strategy selection | < 2 ms | < 5 ms | 20 ms |
| Mock routing | < 2 ms | < 5 ms | 20 ms |
| Full guide | < 10 ms | < 30 ms | 50 ms |
| Output size | = 3,000 chars | = 6,000 chars | 10,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| New testing paradigms | Low | Outdated strategy models | Annual review |
| Framework deprecation (Jest) | Low | Invalid advice | Track framework status |
| AI-generated test sprawl | Medium | Low-value tests | Enforce coverage quality over quantity |
| Shift-left testing trends | Medium | Strategy evolution | Monitor industry practices |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies for guidance |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: strategy selection, mock routing, naming conventions |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to e2e-automation, test-driven-dev, /validate |
| Content Map for multi-file | ? | Links to scripts/ + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 3 strategy models (Pyramid, Trophy, Honeycomb) | ? |
| **Functionality** | AAA pattern (Arrange/Act/Assert) | ? |
| **Functionality** | FIRST principles (5 criteria) | ? |
| **Functionality** | 4 mock types (Stub/Spy/Mock/Fake) | ? |
| **Functionality** | Mock vs don't-mock guidance | ? |
| **Functionality** | 3 naming conventions | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 4 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed strategy routing, fixed mock routing, fixed naming | ? |
| **Security** | No source code, no execution, no files | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
