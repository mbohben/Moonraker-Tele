---
name: e2e-automation
description: >-
  End-to-end testing with Playwright, browser automation, and visual regression testing.
  Use when writing Playwright tests, browser automation scripts, or visual testing.
  NOT for test architecture decisions (use test-architect) or unit tests.
metadata:
  author: pikakit
  version: "3.9.206"
  category: testing
  triggers: ["E2E test", "Playwright", "browser test", "visual testing", "automation"]
  coordinates_with: ["test-architect", "cicd-pipeline"]
  success_metrics: ["100% stable tests (0 flake)", "100% coverage on critical paths"]
---

# E2E Automation — Playwright Testing

> Behavior-driven E2E tests. `data-testid` selectors. Auto-wait, never sleep. Zero flake tolerance.

---

## Prerequisites

**Required:** Playwright installed with Chromium browser.

```bash
npm install playwright && npx playwright install chromium
```

---

## When to Use

| Situation | Action |
|-----------|--------|
| Critical user flows | E2E with Playwright runner |
| Visual regression | Screenshot comparison (`--screenshot`) |
| Accessibility audit | A11y check (`--a11y`) |
| Component/unit testing | Use `test-architect` instead |
| API testing only | Use `test-architect` instead |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Screenshot capture (on-failure + on-demand) | Performance benchmarking (→ perf-optimizer) |
| Accessibility audit (axe-core via `--a11y`) | CI/CD pipeline config (→ cicd-pipeline) |
| ARIA snapshot testing reference | Browser scraping (→ agent-browser) |
| Test organization structure | Test content authoring |

**Automation skill:** Launches browser, navigates pages, captures screenshots. Session-based with side effects.

---

## Quick Reference

```bash
# Run Playwright tests
npx playwright test

# With screenshot
npx playwright test --screenshot=on

# Accessibility check
npx playwright test --project=a11y
```

---

## Playwright Config (Fixed Recommendations)

| Setting | Value | Rationale |
|---------|-------|-----------|
| Retries (CI) | 2 | Flake mitigation |
| Retries (local) | 0 | Development speed |
| Trace | on-first-retry | Disk space control |
| Screenshots | on-failure | Failure diagnosis |
| Video | retain-on-failure | Complex failure analysis |

---

## E2E Best Practices

| Rule | Enforcement |
|------|------------|
| Use `data-testid` selectors | CSS/XPath selectors forbidden |
| Auto-wait for elements | No `sleep()` or `setTimeout()` |
| Clean state per test | Fresh browser context each test |
| Test user behavior | Assert visible outcomes, not DOM structure |
| Isolate test data | No shared data between tests |

---

## Test Organization

```
tests/
├── e2e/           # Full user flows
├── integration/   # API, data
├── component/     # UI units
└── fixtures/      # Shared test data
```

---

## Session Lifecycle

```
IDLE → LAUNCHING          [run-tests invoked]
LAUNCHING → NAVIGATING    [browser started]
NAVIGATING → EXECUTING    [target loaded]
EXECUTING → CAPTURING     [screenshot/trace needed]
CAPTURING → REPORTING     [artifacts saved]
REPORTING → COMPLETED     [results output]  // terminal
LAUNCHING → ERROR         [browser launch failed]  // terminal
NAVIGATING → ERROR        [target unreachable]  // terminal
```

**Invariant:** Browser process ALWAYS terminated in Report phase. No orphaned processes.

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_PLAYWRIGHT_MISSING` | Yes | Playwright not installed |
| `ERR_BROWSER_LAUNCH` | Yes | Browser failed to start |
| `ERR_TARGET_UNREACHABLE` | Yes | Target URL not reachable |
| `ERR_TIMEOUT` | Yes | Test exceeded timeout |
| `ERR_SELECTOR_NOT_FOUND` | Yes | Element not found on page |
| `ERR_ASSERTION_FAILED` | No | Test assertion did not pass |
| `ERR_A11Y_VIOLATION` | Yes | WCAG violation detected |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Test implementation details | Test user-visible behavior |
| Hardcode waits (`sleep`) | Use Playwright auto-wait |
| Skip test cleanup | Isolate with fresh context |
| Ignore flaky tests | Fix root cause; track flake rate |
| Use CSS/XPath selectors | Use `data-testid` attributes |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [aria-snapshot.md](rules/aria-snapshot.md) | ARIA snapshot testing pattern | ARIA-based tests |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |


---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/validate` | Workflow | Run all tests |
| `test-architect` | Skill | Unit/integration patterns |
| `cicd-pipeline` | Skill | CI integration |

---

⚡ PikaKit v3.9.206
