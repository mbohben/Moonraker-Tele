---
title: E2E Automation — Engineering Specification
impact: MEDIUM
tags: e2e-automation
---

# E2E Automation — Engineering Specification

> Production-grade specification for web application E2E testing with Playwright at FAANG scale.

---

## 1. Overview

E2E Automation provides Playwright-based end-to-end testing for web applications: test execution via runner script, screenshot capture, accessibility audits, visual regression detection, and ARIA snapshot testing. The skill operates as a session-based **Automation (scripted)** skill — it launches browser instances, navigates pages, captures screenshots, and produces test reports. Side effects include browser process creation, file I/O (screenshots, traces), and network requests to test targets.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

---

## 2. Problem Statement

E2E testing at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Flaky tests | 25% of E2E suites have > 10% flake rate | False failures block CI/CD pipelines |
| Implementation-coupled tests | 40% of E2E tests test DOM structure, not behavior | Tests break on every refactor |
| Missing critical paths | 30% of production incidents involve untested user flows | Bugs in core functionality |
| No accessibility verification | 55% of web apps have zero automated a11y checks | WCAG non-compliance |

E2E Automation eliminates these with behavior-driven tests, stable selectors (`data-testid`), auto-wait (no hardcoded waits), and integrated a11y auditing.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Zero flaky tests | Flake rate < 1% with auto-wait + 2 retries on CI |
| G2 | Behavior-driven tests | Tests assert user-visible behavior, not DOM structure |
| G3 | Stable selectors | `data-testid` attributes; no CSS/XPath selectors |
| G4 | Accessibility coverage | a11y audit on every test run with `--a11y` flag |
| G5 | Test isolation | Each test starts with clean state; no shared data |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Unit/integration test patterns | Owned by `test-architect` skill |
| NG2 | Performance benchmarking | Owned by `perf-optimizer` skill |
| NG3 | CI/CD pipeline configuration | Owned by `cicd-pipeline` skill |
| NG4 | Browser automation for scraping | Owned by `agent-browser` skill |
| NG5 | API-only testing | Owned by `test-architect` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Playwright test execution (runner script) | Script invocation and output | Playwright installation |
| Screenshot capture (on-failure + on-demand) | Capture commands | Image comparison tooling |
| Accessibility auditing (`--a11y` flag) | Audit execution | WCAG remediation |
| ARIA snapshot testing | Pattern reference | Snapshot library |
| Test organization (e2e/integration/component/fixtures) | Directory structure | Test content creation |
| Playwright config recommendations | Config guidance | Framework config files |

**Side-effect boundary:** E2E Automation launches browser processes, makes network requests to test targets, creates screenshot/trace files, and produces stdout reports.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "run-tests" | "screenshot" | "a11y-audit" |
                              # "config-guide" | "test-structure" | "selector-guide"
Context: {
  target_url: string          # URL to test
  test_files: Array<string> | null  # Specific test files to run
  flags: Array<string> | null # "--screenshot" | "--a11y" | "--trace"
  browser: string             # "chromium" | "firefox" | "webkit"
  retries: number             # Number of retries (default: 2 on CI, 0 local)
  headless: boolean           # Run headless (default: true)
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "passed" | "failed" | "error"
Data: {
  results: {
    total: number
    passed: number
    failed: number
    skipped: number
    flaky: number             # Tests that passed on retry
    duration_ms: number
  } | null
  screenshots: Array<{
    path: string              # File path to screenshot
    test_name: string
    type: string              # "failure" | "manual"
  }> | null
  a11y: {
    violations: Array<{
      rule: string            # WCAG rule ID
      impact: string          # "critical" | "serious" | "moderate" | "minor"
      element: string         # CSS selector of violating element
      fix: string
    }>
    passes: number
    violations_count: number
  } | null
  traces: Array<{
    path: string              # File path to trace
    test_name: string
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

- Same test files + same target state = same test results (excluding network timing).
- Playwright config recommendations are fixed (retries: 2, trace: on-first-retry, screenshots: on-failure, video: retain-on-failure).
- Selector guidance is fixed: `data-testid` preferred, CSS/XPath forbidden.
- Test organization structure is fixed: `e2e/`, `integration/`, `component/`, `fixtures/`.
- Config guide and selector guide are stateless expert operations.

#### What Agents May Assume

- Runner script creates browser instance and tears it down after execution.
- Screenshots are saved to disk on failure or when `--screenshot` is passed.
- Accessibility audit uses axe-core rules when `--a11y` is passed.
- Test results include pass/fail counts and duration.

#### What Agents Must NOT Assume

- Playwright is installed (caller must install first).
- Target URL is accessible (network errors are reported).
- Tests are deterministic if target state changes between runs.
- Screenshots persist beyond the current session.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Run tests | Browser process, network requests, stdout output |
| Screenshot | Browser process, file write (PNG) |
| A11y audit | Browser process, network requests, stdout output |
| Config guide | None; guidance output |
| Test structure | None; directory recommendation |
| Selector guide | None; guidance output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Install Playwright: npm install playwright && npx playwright install chromium
2. Write E2E tests using data-testid selectors (caller's responsibility)
3. Invoke run-tests with target URL and test files
4. Review results; fix failures (caller's responsibility)
5. Invoke a11y-audit for accessibility check
6. Fix a11y violations (caller's responsibility)
7. Integrate into CI (caller's responsibility, see cicd-pipeline)
```

#### State Transitions

```
IDLE → LAUNCHING          [run-tests invoked]
LAUNCHING → NAVIGATING    [browser process started]
NAVIGATING → EXECUTING    [target URL loaded]
EXECUTING → CAPTURING     [test completed, screenshot/trace needed]
CAPTURING → REPORTING     [artifacts saved to disk]
REPORTING → COMPLETED     [results written to stdout]  // terminal state
EXECUTING → FAILED        [test assertion failed]
FAILED → CAPTURING        [failure screenshot captured]
LAUNCHING → ERROR         [browser launch failed]  // terminal state
NAVIGATING → ERROR        [target unreachable]  // terminal state
```

#### Execution Guarantees

- Browser process is always terminated after test run (success or failure).
- Screenshots are captured before browser teardown.
- Traces are only saved on first retry (to limit disk usage).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Browser launch failed | Return `ERR_BROWSER_LAUNCH` | Install Playwright |
| Target unreachable | Return `ERR_TARGET_UNREACHABLE` | Check URL/network |
| Test assertion failed | Return failed results | Fix test or application |
| A11y violation found | Return a11y violations | Fix accessibility |
| Timeout exceeded | Return `ERR_TIMEOUT` | Increase timeout or fix test |

#### Retry Boundaries

- Test-level retries: 2 on CI, 0 locally (configurable).
- No script-level retries (agent re-invokes if needed).
- Retried tests that pass are marked as "flaky" in results.

#### Isolation Model

- Each test run creates a fresh browser context.
- No shared state between test runs.
- Each test within a run should use isolated data.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Run tests | No | Results depend on target application state |
| Screenshot | No | Content depends on page state at capture time |
| A11y audit | No | Results depend on current page DOM |
| Config guide | Yes | Fixed recommendations |
| Test structure | Yes | Fixed directory layout |
| Selector guide | Yes | Fixed guidance |

---

## 7. Execution Model

### 4-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Launch** | Start browser process, create context | Browser instance |
| **Navigate** | Load target URL, wait for network idle | Page ready state |
| **Execute** | Run test assertions, capture artifacts | Test results + artifacts |
| **Report** | Aggregate results, teardown browser | Structured output |

Phases are sequential per test run. Browser lifecycle is managed by the runner script.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed Playwright config | retries: 2, trace: on-first-retry, screenshots: on-failure, video: retain-on-failure |
| Fixed selector strategy | `data-testid` only; CSS/XPath forbidden |
| Fixed test organization | 4 directories: e2e/, integration/, component/, fixtures/ |
| Auto-wait over hardcoded waits | Playwright auto-wait is default; no `sleep()` or `setTimeout()` |
| Behavior-driven assertions | Assert user-visible outcomes, not DOM structure |
| Clean state per test | Fresh browser context; no cross-test contamination |

---

## 9. State & Idempotency Model

Session-based. Not idempotent. Browser state exists for the duration of a test run.

| State | Persistent | Scope |
|-------|-----------|-------|
| Browser process | No | Single test run |
| Page DOM | No | Single navigation |
| Screenshots/traces | Yes | Until cleanup |
| Test results | No | Single run output |

Browser state is created at launch and destroyed at report phase. No cross-session state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Playwright not installed | Return `ERR_PLAYWRIGHT_MISSING` | Run install command |
| Browser launch failure | Return `ERR_BROWSER_LAUNCH` | Check environment |
| Target URL unreachable | Return `ERR_TARGET_UNREACHABLE` | Fix URL or network |
| Test timeout | Return `ERR_TIMEOUT` | Increase timeout or fix test |
| Test assertion failure | Return failed results with screenshots | Fix application code |
| A11y violation | Return violations list | Fix accessibility issues |

**Invariant:** Browser process is always terminated, even on failure. No orphaned processes.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_PLAYWRIGHT_MISSING` | Infrastructure | Yes | Playwright not installed |
| `ERR_BROWSER_LAUNCH` | Infrastructure | Yes | Browser process failed to start |
| `ERR_TARGET_UNREACHABLE` | Network | Yes | Target URL not reachable |
| `ERR_TIMEOUT` | Execution | Yes | Test exceeded timeout |
| `ERR_SELECTOR_NOT_FOUND` | Test | Yes | Element selector not found on page |
| `ERR_ASSERTION_FAILED` | Test | No | Test assertion did not pass |
| `ERR_A11Y_VIOLATION` | Accessibility | Yes | WCAG violation detected |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Test timeout | 30,000 ms | 120,000 ms | Single test execution |
| Navigation timeout | 10,000 ms | 30,000 ms | Page load |
| Action timeout | 5,000 ms | 15,000 ms | Click, type, etc. |
| Test retries (CI) | 2 | 3 | Flake mitigation |
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "target_url": "string",
  "browser": "string",
  "tests_total": "number",
  "tests_passed": "number",
  "tests_failed": "number",
  "tests_flaky": "number",
  "a11y_violations": "number|null",
  "screenshots_count": "number",
  "duration_ms": "number",
  "status": "passed|failed|error",
  "error_code": "string|null"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Test run started | INFO | target_url, browser, tests_total |
| Test run completed | INFO | All fields |
| Test failed | WARN | test name, assertion, screenshot path |
| Flaky test detected | WARN | test name, retry count |
| A11y violation found | WARN | rule, impact, element |
| Browser launch failed | ERROR | error_code, message |
| Target unreachable | ERROR | target_url, error_code |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `e2e.run.duration` | Histogram | ms |
| `e2e.tests.pass_rate` | Gauge | 0.0–1.0 |
| `e2e.tests.flake_rate` | Gauge | 0.0–1.0 |
| `e2e.a11y.violations` | Counter | per rule |
| `e2e.screenshots.count` | Counter | per run |
| `e2e.browser.launch_failures` | Counter | per run |

---

## 14. Security & Trust Model

### Test Target Access

- E2E Automation connects only to caller-specified URLs.
- No credential storage; auth tokens are passed per-test.
- Browser context is isolated; no cross-origin leakage.

### Artifact Safety

- Screenshots and traces may contain sensitive page content.
- Artifacts are written to local disk only; no remote upload.
- Cleanup of artifacts is caller's responsibility.

### Process Isolation

- Browser runs in sandboxed mode (Chromium sandbox).
- No access to host filesystem beyond artifact output directory.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | 1 browser per runner instance | Parallel runners via CI sharding |
| Concurrency | Single-threaded runner script | Multiple runner processes |
| Memory per run | ~200 MB (Chromium) | Fixed per browser instance |
| Disk per run | ~10 MB (screenshots + traces) | Cleanup after CI |
| Network | Dependent on target latency | Timeout configuration |

---

## 16. Concurrency Model

Single browser instance per runner invocation. No shared state between concurrent runners.

For parallel execution: use CI sharding to distribute test files across multiple runner processes. Each shard operates independently.

| Dimension | Boundary |
|-----------|----------|
| Browser instances per runner | 1 |
| Concurrent runners | Limited by CI resources |
| Shared state between runners | None |
| Lock requirements | None |

---

## 17. Resource Lifecycle Management

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Browser process | Launch phase | Report phase (always) | Test run duration |
| Browser context | Launch phase | After each test | Single test |
| Page instance | Navigate phase | After each test | Single test |
| Screenshots | Execute phase | Caller cleanup | Until deletion |
| Traces | Execute phase (first retry) | Caller cleanup | Until deletion |

**Critical invariant:** Browser process MUST be destroyed in Report phase, including on error paths. No orphaned browser processes.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Browser launch | < 2,000 ms | < 5,000 ms | 10,000 ms |
| Page navigation | < 3,000 ms | < 10,000 ms | 30,000 ms |
| Single test execution | < 5,000 ms | < 20,000 ms | 120,000 ms |
| Screenshot capture | < 500 ms | < 2,000 ms | 5,000 ms |
| Full suite (10 tests) | < 30,000 ms | < 90,000 ms | 300,000 ms |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Flaky tests from network timing | High | False CI failures | Auto-wait + 2 retries; flaky counter in results |
| Orphaned browser processes | Medium | Memory leak on CI | Browser always terminated in Report phase |
| Large screenshot/trace files | Medium | Disk space on CI | Traces only on first retry; cleanup policy |
| Target app down during tests | Medium | All tests fail | `ERR_TARGET_UNREACHABLE` with clear message |
| Playwright version mismatch | Low | Tests won't run | Version pinned in package.json |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | Playwright installation command |
| When to Use section | ✅ | Situation-based routing table |
| Core content matches skill type | ✅ | Automation type: session-based, browser side effects |
| Troubleshooting section | ✅ | Anti-patterns table |
| Related section | ✅ | Cross-links to test-architect, cicd-pipeline, /validate |
| Content Map for multi-file | ✅ | Links to aria-snapshot.md, scripts, engineering-spec.md |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | Playwright test runner script | ✅ |
| **Functionality** | Screenshot capture (on-failure + on-demand) | ✅ |
| **Functionality** | Accessibility audit (axe-core via --a11y) | ✅ |
| **Functionality** | ARIA snapshot testing reference | ✅ |
| **Functionality** | Testing pyramid structure (e2e/integration/component/fixtures) | ✅ |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ✅ |
| **Contracts** | Contract versioning with semver | ✅ |
| **Contracts** | Session state transitions with arrow notation | ✅ |
| **Failure** | Error taxonomy with 7 categorized codes | ✅ |
| **Failure** | Browser process always terminated (no orphans) | ✅ |
| **Failure** | Retry policy with defaults and maximums | ✅ |
| **State** | Session-based; browser state per run | ✅ |
| **State** | Resource lifecycle with creation/destruction | ✅ |
| **Security** | Sandboxed browser; no credential storage | ✅ |
| **Observability** | Structured log schema with 5 mandatory fields + 7 log points | ✅ |
| **Observability** | 6 metrics defined | ✅ |
| **Performance** | P50/P99/hard limits for all operations | ✅ |
| **Scalability** | CI sharding for parallel execution | ✅ |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ✅ |

---

⚡ PikaKit v3.9.206
