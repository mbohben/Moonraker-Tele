# agent-browser

**Version 1.0.0**
Engineering
March 2026

> **Note:**
> This document is for agents and LLMs to follow when working on agent-browser domain.
> Optimized for automation and consistency by AI-assisted workflows.

---

# Agent Browser

> AI-optimized browser automation. @ref handles compress interactive elements to ~280 chars vs 8KB+ full DOM.

---

## Prerequisites

**Required:**
- Node.js 18+
- Playwright (`npm install playwright && npx playwright install chromium`)

**Optional:**
- Browserbase account (cloud browsers for CI/CD)

---

## When to Use

| Use agent-browser | Use chrome-devtools Instead |
|-------------------|-----------------------------|
| Long autonomous browser sessions | One-off screenshots |
| Context-constrained LLM workflows | Custom Puppeteer scripts |
| Video recording of user flows | WebSocket or network debugging |
| Cloud browsers in CI/CD pipelines | Auth token injection |
| Multi-step form interaction | Raw DOM inspection |

---

## Quick Start

```bash
# 1. Navigate
agent-browser open https://example.com

# 2. Snapshot — get @ref handles
agent-browser snapshot -i
# Output: @e1=button[Login] @e2=input[email] @e3=input[password]

# 3. Interact — use @refs directly
agent-browser fill @e2 "user@example.com"
agent-browser fill @e3 "password123"
agent-browser click @e1

# 4. Verify — re-snapshot to confirm state change
agent-browser snapshot -i
```

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Browser session lifecycle | Browser binary installation |
| @ref element handles | Full DOM serialization |
| Click, fill, screenshot, record | JavaScript injection |
| Structured error codes | Visual regression testing (→ e2e-automation) |
| Session isolation | Network interception |

---

## Execution Model — 4-Phase Lifecycle

| Phase | Commands | State Effect |
|-------|----------|-------------|
| **Navigate** | `open <url>` | Creates session, loads page |
| **Snapshot** | `snapshot -i` | Generates @refs (read-only) |
| **Interact** | `click @ref`, `fill @ref "text"` | Mutates page state, invalidates @refs |
| **Verify** | `snapshot -i`, `screenshot [path]` | Captures new state |

**State:** `NO_SESSION → [open] → SESSION_ACTIVE → [close/timeout] → SESSION_CLOSED`

---

## @ref System

@refs replace CSS selectors and XPath with compact, stable element handles:

```bash
# Snapshot output
@e1 = button[Login]
@e2 = input[type=email]
@e3 = input[type=password]
@e4 = a[Sign up]

# Use directly
agent-browser click @e1
agent-browser fill @e2 "email@example.com"
```

| Property | Constraint |
|----------|-----------|
| Output size | ≤ 500 chars for ≤ 50 elements |
| Validity | Until next snapshot, navigation, or session close |
| Stale access | Returns `ERR_REF_STALE` (never silent) |
| ID format | Sequential: `@e1`, `@e2`, ...; resets per snapshot |

---

## Commands

| Command | Description | Idempotent |
|---------|-------------|------------|
| `open <url>` | Navigate to URL, create session | Yes |
| `snapshot -i` | Get interactive elements as @refs | Yes |
| `click @ref` | Click element | No |
| `fill @ref "text"` | Clear field, type text | No |
| `screenshot [path]` | Capture viewport to file | Yes |
| `record start` | Begin video recording | No |
| `record stop` | Finalize video file | No |
| `close` | Terminate session, release resources | Yes |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_SESSION_CLOSED` | No | Command sent to closed/expired session |
| `ERR_BROWSER_CRASH` | No | Browser process terminated |
| `ERR_NO_BROWSER` | No | Playwright or browser binary missing |
| `ERR_TIMEOUT` | Yes | Page did not load within `timeout_ms` |
| `ERR_INVALID_URL` | No | Malformed URL or blocked protocol (`file://`, `javascript:`) |
| `ERR_REF_NOT_FOUND` | Yes | @ref does not map to current DOM element |
| `ERR_REF_STALE` | Yes | @ref from previous snapshot |
| `ERR_NOT_INTERACTABLE` | Yes | Element hidden, disabled, or obscured |
| `ERR_INVALID_COMMAND` | No | Malformed command or arguments |
| `ERR_RECORDING_ACTIVE` | No | `record start` while recording |
| `ERR_NO_RECORDING` | No | `record stop` without active recording |
| `ERR_SCREENSHOT_WRITE` | Yes | Disk write failure |

**Zero internal retries.** All retry decisions belong to the caller.

---

## Timeout Defaults

| Parameter | Default | Max |
|-----------|---------|-----|
| Page load | 30,000 ms | 120,000 ms |
| Element wait | 5,000 ms | 30,000 ms |
| Session idle | 300,000 ms | 1,800,000 ms |
| Screenshot | 10,000 ms | 30,000 ms |

---

## Troubleshooting

| Problem | Cause | Resolution |
|---------|-------|------------|
| `ERR_REF_STALE` | @refs used after DOM mutation | Run `snapshot -i` again before interacting |
| `ERR_NOT_INTERACTABLE` | Element hidden or disabled | Wait for page load, check element visibility |
| `ERR_TIMEOUT` | Slow network or heavy page | Increase `timeout_ms`, check connectivity |
| Recording not saved | `record stop` not called | Call `record stop` before `close` |
| `ERR_NO_BROWSER` | Missing Playwright install | Run `npx playwright install chromium` |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------| 
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec: contracts, security, scalability, observability, failure model | Architecture review, integration design, production deployment |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `e2e-automation` | Skill | Playwright E2E testing patterns |
| `chrome-devtools` | Skill | DevTools, screenshots, Puppeteer |
| `test-architect` | Skill | Test strategy and patterns |

---



---

## Detailed Rules


---

### Rule: engineering-spec

---
title: Agent Browser — Engineering Specification
impact: MEDIUM
tags: agent-browser
---

# Agent Browser — Engineering Specification

> Production-grade specification for AI-optimized browser automation at FAANG scale.

---

## 1. Overview

Agent Browser provides AI agents with browser automation through context-efficient element references (@refs). Instead of passing full DOM trees (8KB+ per snapshot), the @ref system compresses interactive elements into ~280 character handles, reducing LLM context consumption by 93%.

The skill wraps Playwright to expose a 4-phase execution lifecycle: Navigate → Snapshot → Interact → Verify. Every operation maps to one of these phases.

---

## 2. Problem Statement

AI agents consuming browser state face three quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Context overflow | Full DOM = 8,000–50,000 chars per page | Exceeds LLM context windows within 2–3 pages |
| Selector instability | CSS/XPath selectors break on 40–60% of page updates | Test flakiness, false failures |
| Session state loss | No persistence across agent turns | Repeated navigation, wasted execution time |

Agent Browser eliminates these by providing stable, compact element handles that survive page re-renders and persist within a browser session.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Minimize context consumption | Snapshot output ≤ 500 characters for pages with ≤ 50 interactive elements |
| G2 | Stable element references | @refs survive DOM mutations that preserve element identity |
| G3 | Deterministic command execution | Same command + same page state = same result |
| G4 | Session persistence | Browser state persists until explicit close or timeout |
| G5 | Failure transparency | Every failure returns a categorized error code, never silent |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Full DOM extraction | Contradicts G1; use chrome-devtools for raw DOM |
| NG2 | JavaScript injection | Security boundary; not permitted in multi-tenant mode |
| NG3 | Network interception | Out of scope; use Playwright directly for HAR capture |
| NG4 | Visual regression testing | Owned by e2e-automation skill |
| NG5 | Browser binary management | Delegated to Playwright installer (`npx playwright install`) |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Browser lifecycle | Session create, navigate, close | Browser binary install |
| Element interaction | Click, fill, select, hover | Custom JS execution |
| State capture | @ref snapshots, screenshots | Full DOM serialization |
| Recording | Video start/stop | Video encoding, hosting |
| Error reporting | Categorized error codes | Error recovery decisions |

**Side-effect boundary:** Agent Browser modifies browser state (navigation, form fills, clicks). It does not modify the file system, network configuration, or any state outside the browser process.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Command: string         # One of: open, snapshot, click, fill, screenshot, record, close
Target: string | null   # URL for open, @ref for click/fill, path for screenshot
Value: string | null     # Text for fill, "start"|"stop" for record
Options: {
  timeout_ms: number    # Default: 30000. Max: 120000.
  interactive: boolean  # Default: true. When true, snapshot returns only interactive elements.
  wait_for: string      # "load" | "domcontentloaded" | "networkidle". Default: "load".
}
contract_version: string  # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  refs: Array<{id: string, tag: string, label: string}> | null  # For snapshot
  screenshot_path: string | null                                  # For screenshot
  recording_path: string | null                                   # For record stop
  url: string                                                    # Current URL after command
  title: string                                                  # Current page title
  metadata: {
    contract_version: string    # "2.0.0"
    backward_compatibility: string  # "breaking"
  }
}
Error: ErrorSchema | null
```

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

#### Error Schema

```
Code: string        # From Error Taxonomy (Section 11)
Message: string     # Human-readable, single line
Phase: string       # navigate | snapshot | interact | verify
Recoverable: boolean
```

#### Deterministic Guarantees

- `snapshot` on an unchanged page returns identical @refs in identical order.
- `click @ref` on a visible, enabled element triggers exactly one click event.
- `fill @ref "text"` clears the field, then types the text, in that order.
- `screenshot` captures the viewport at call time; no queuing, no batching.

#### What Agents May Assume

- @refs from the most recent `snapshot` are valid until the next navigation or DOM mutation.
- Commands execute sequentially in call order.
- A "success" status means the command completed; it does not assert business-logic correctness.

#### What Agents Must NOT Assume

- @refs from a previous `snapshot` remain valid after `click` (click may trigger navigation or DOM update).
- The browser process survives indefinitely; sessions time out after `session_timeout_ms`.
- Commands issued to a closed session will succeed; they return `ERR_SESSION_CLOSED`.
- Screenshot paths are permanent; they are written to a temp directory subject to OS cleanup.

#### Side-Effect Boundaries

| Command | Side Effects |
|---------|-------------|
| `open` | Navigates browser, may trigger network requests, sets cookies |
| `click` | Fires click event, may trigger navigation, may mutate DOM |
| `fill` | Clears field, types text, fires input/change events |
| `screenshot` | Writes file to disk at specified or temp path |
| `record start` | Begins writing video buffer to temp directory |
| `record stop` | Finalizes video file, releases buffer |
| `snapshot` | Read-only; no side effects |
| `close` | Terminates browser process, releases all resources |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. open <url>           # Required first command
2. snapshot -i           # Get @refs
3. [interact commands]   # click, fill using @refs
4. snapshot -i           # Verify state change
5. close                 # Release resources (or auto-close on timeout)
```

Workflows invoke commands sequentially. Parallel command invocation on the same session is undefined behavior (see Section 16).

#### Execution Guarantees

- Commands within a session execute in FIFO order.
- Each command completes (success or error) before the next begins.
- No command is silently dropped or reordered.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Recoverable (element not found, timeout) | Return error to caller | Caller decides: retry, re-snapshot, or abort |
| Non-recoverable (browser crash, session closed) | Return error to caller | Caller must create new session |
| Infrastructure (no browser binary) | Return error to caller | Caller must install prerequisites |

Failures do not propagate across sessions. A crashed session does not affect other sessions.

#### Retry Boundaries

- Agent Browser does not retry internally. All retry decisions belong to the caller.
- Callers should re-snapshot after any failed interaction before retrying with @refs.
- Maximum recommended caller-side retries: 3 per command, with snapshot refresh between retries.

#### Isolation Model

- Each `open` command creates an isolated browser context (separate cookies, storage, cache).
- Sessions do not share state. Two concurrent sessions on the same URL operate independently.
- Browser contexts are destroyed on `close` or session timeout.

#### Idempotency Expectations

| Command | Idempotent | Notes |
|---------|-----------|-------|
| `open` | Yes | Re-navigates to same URL; page state resets |
| `snapshot` | Yes | Returns current state; no mutation |
| `click` | No | Each call fires a new click event |
| `fill` | No | Clears and re-types; prior text is lost |
| `screenshot` | Yes | Captures current viewport state |
| `record start` | No | Second call returns `ERR_RECORDING_ACTIVE` |
| `record stop` | No | Second call returns `ERR_NO_RECORDING` |
| `close` | Yes | Second call returns `ERR_SESSION_CLOSED` |

---

## 7. Execution Model

### 4-Phase Lifecycle

| Phase | Commands | State Transition |
|-------|----------|------------------|
| **Navigate** | `open <url>` | NO_SESSION → SESSION_ACTIVE |
| **Snapshot** | `snapshot -i` | SESSION_ACTIVE → SESSION_ACTIVE (refs populated) |
| **Interact** | `click`, `fill` | SESSION_ACTIVE → SESSION_ACTIVE (refs invalidated) |
| **Verify** | `snapshot`, `screenshot` | SESSION_ACTIVE → SESSION_ACTIVE (refs refreshed) |

**State Diagram:**

```
NO_SESSION → [open] → SESSION_ACTIVE → [close/timeout] → SESSION_CLOSED
                            ↑ ↓
                      [snapshot/interact/verify cycle]
```

Commands issued in `NO_SESSION` or `SESSION_CLOSED` state return `ERR_SESSION_CLOSED`.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| No implicit waits beyond configured timeout | `wait_for` parameter controls page load strategy; no hidden sleep |
| No automatic retries | Failure returns immediately; caller controls retry |
| No background polling | Snapshot captures point-in-time state; no observers |
| No ambient state | Each command operates on explicit inputs only |
| Ordered execution | Commands execute in call order; no reordering |

---

## 9. State & Idempotency Model

### Session State Machine

```
States: NO_SESSION, SESSION_ACTIVE, SESSION_CLOSED
Transitions:
  NO_SESSION     + open      → SESSION_ACTIVE
  SESSION_ACTIVE + close     → SESSION_CLOSED
  SESSION_ACTIVE + timeout   → SESSION_CLOSED
  SESSION_ACTIVE + crash     → SESSION_CLOSED
  SESSION_CLOSED + any       → ERR_SESSION_CLOSED
```

### @ref Lifecycle

1. @refs are generated by `snapshot` and associated with DOM elements at snapshot time.
2. @refs are valid until the next `snapshot`, navigation event, or session close.
3. Using an expired @ref returns `ERR_REF_STALE` (never silently fails).
4. @ref IDs are sequential within a snapshot (`@e1`, `@e2`, ...) and reset on each new snapshot.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Element not found | Return `ERR_REF_NOT_FOUND` | Re-snapshot, obtain new @refs |
| Element not interactable | Return `ERR_NOT_INTERACTABLE` | Wait, re-snapshot, retry |
| Navigation timeout | Return `ERR_TIMEOUT` | Check URL, increase timeout, retry |
| Browser crash | Return `ERR_BROWSER_CRASH` | Create new session |
| Session expired | Return `ERR_SESSION_CLOSED` | Create new session |
| Invalid command | Return `ERR_INVALID_COMMAND` | Fix command syntax |
| Recording conflict | Return `ERR_RECORDING_ACTIVE` or `ERR_NO_RECORDING` | Check recording state |

**Invariant:** Every failure returns a structured error. No command fails silently.

**Auto-Recovery Protocol (Self-Healing):**
Agents MUST implement deterministic self-healing when encountering `ERR_REF_STALE` or `ERR_REF_NOT_FOUND`:
1. **Never** fail immediately or prompt the user for help on stale refs.
2. **Auto-Recover**: The agent must automatically trigger `snapshot -i` to force the `session_manager` to evaluate the new DOM layout and retrieve fresh `@refs`.
3. Retry the intended action with the newly mapped `@ref`.

---

## 11. Error Taxonomy

| Code | Category | Phase | Recoverable | Description |
|------|----------|-------|-------------|-------------|
| `ERR_SESSION_CLOSED` | Session | Any | No | Session does not exist or was closed |
| `ERR_BROWSER_CRASH` | Infrastructure | Any | No | Browser process terminated unexpectedly |
| `ERR_NO_BROWSER` | Infrastructure | Navigate | No | Playwright or browser binary not installed |
| `ERR_TIMEOUT` | Network | Navigate | Yes | Page did not reach `wait_for` state within `timeout_ms` |
| `ERR_INVALID_URL` | Validation | Navigate | No | URL is malformed or uses disallowed protocol |
| `ERR_REF_NOT_FOUND` | Interaction | Interact | Yes | @ref does not map to a current DOM element |
| `ERR_REF_STALE` | Interaction | Interact | Yes | @ref was from a previous snapshot and is expired |
| `ERR_NOT_INTERACTABLE` | Interaction | Interact | Yes | Element exists but is hidden, disabled, or obscured |
| `ERR_INVALID_COMMAND` | Validation | Any | No | Command name or arguments are malformed |
| `ERR_RECORDING_ACTIVE` | State | Any | No | `record start` called while recording is in progress |
| `ERR_NO_RECORDING` | State | Any | No | `record stop` called with no active recording |
| `ERR_SCREENSHOT_WRITE` | IO | Verify | Yes | Failed to write screenshot to disk (permissions, disk space) |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Min | Max | Unit |
|-----------|---------|-----|-----|------|
| `page_load_timeout` | 30,000 | 1,000 | 120,000 | ms |
| `element_wait_timeout` | 5,000 | 500 | 30,000 | ms |
| `session_timeout` | 300,000 | 30,000 | 1,800,000 | ms |
| `screenshot_timeout` | 10,000 | 1,000 | 30,000 | ms |

**Retry policy:** Zero internal retries. All retry logic is the caller's responsibility. This is a deliberate design decision to prevent hidden execution loops and maintain deterministic behavior.

---

## 13. Observability & Logging Schema

### OpenTelemetry Integration (MANDATORY)

Agent Browser MUST coordinate with `@[skills/observability]` to emit distributed traces for all operations.
- **Span Naming**: `browser/{command}` (e.g., `browser/open`, `browser/click`).
- **Context Propagation**: The `trace_id` and `session_id` MUST be injected into all log entries and traces.
- **Span Attributes**: All fields in the 'Log Entry Format' must be attached as span attributes.

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "agent-browser",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "session_id": "uuid",
  "command": "string",
  "phase": "navigate|snapshot|interact|verify",
  "target": "string|null",
  "duration_ms": "number",
  "status": "success|error",
  "error_code": "string|null",
  "refs_count": "number|null",
  "url": "string"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Session created | INFO | session_id, url, timestamp |
| Command executed | INFO | All fields |
| Command failed | ERROR | All fields + error_code |
| Session closed | INFO | session_id, reason (explicit, timeout, crash), total_commands |
| @ref stale access | WARN | session_id, ref_id, snapshot_age_ms |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `browser.session.duration` | Histogram | ms |
| `browser.command.duration` | Histogram | ms |
| `browser.command.error_rate` | Counter | per error_code |
| `browser.snapshot.ref_count` | Gauge | count |
| `browser.snapshot.char_count` | Gauge | characters |
| `browser.session.active` | Gauge | count |

---

## 14. Security & Trust Model

### URL Allowlist

| Allowed | Blocked |
|---------|---------|
| `http://` | `file://` |
| `https://` | `javascript:` |
| `localhost` | `data:` (configurable) |

Blocked protocols return `ERR_INVALID_URL`.

### Credential Handling

- Agent Browser does not store credentials. `fill` commands pass values transiently.
- Values passed to `fill` are logged as `[REDACTED]` in all log outputs.
- Screenshots and recordings may contain sensitive data; callers are responsible for access control on output files.

### Browser Context Isolation

- Each session uses an isolated browser context (no shared cookies, localStorage, or cache between sessions).
- Browser contexts run with Playwright's default sandboxing.
- No browser extensions are loaded.

### Multi-Tenant Boundaries

- Sessions are identified by `session_id`. No session can access another session's browser context.
- Session IDs are UUIDs; they are not guessable or sequential.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Concurrent sessions | Bound by available memory (each Chromium context ≈ 50–150 MB) | Enforce max_concurrent_sessions per node |
| Session throughput | Sequential command execution within session | Parallelism across sessions, not within |
| Snapshot size | Proportional to interactive element count | Cap at 200 elements per snapshot; truncate with warning |
| Storage (screenshots/recordings) | Disk I/O bound | Write to configurable output directory; caller manages cleanup |

### Capacity Planning

| Metric | Per Session | Per Node (16 GB RAM) |
|--------|-------------|---------------------|
| Memory | 50–150 MB | ~100 concurrent sessions |
| CPU | 1 core per active session | Bound by core count |
| Disk | ~2 MB/screenshot, ~5 MB/min recording | Caller-managed cleanup |

---

## 16. Concurrency Model

| Scope | Model | Behavior |
|-------|-------|----------|
| Within session | Sequential | Commands execute in FIFO order; concurrent calls are undefined behavior |
| Across sessions | Parallel | Independent sessions run concurrently with no shared state |
| Recording | Exclusive | One active recording per session; second `record start` returns error |

**Undefined behavior:** Sending commands to the same session from multiple agents concurrently. The skill does not queue or serialize concurrent calls to the same session. Callers must serialize access.

---

## 17. Resource Lifecycle Management

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Browser context | `open` | `close`, timeout, or crash | `session_timeout` (default: 5 min) |
| @ref bindings | `snapshot` | Next `snapshot`, navigation, or session close | Until next snapshot |
| Screenshot files | `screenshot` | Caller (manual cleanup) | Indefinite until deleted |
| Recording files | `record stop` | Caller (manual cleanup) | Indefinite until deleted |
| Temp buffers | `record start` | `record stop` or session close | Session lifetime |

**Leak prevention:**
- Sessions that exceed `session_timeout` without commands are closed automatically.
- Active recordings are finalized on session close (timeout or explicit).
- Browser processes orphaned by crashes are detected and killed on next session creation.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| `open` (cached page) | < 2,000 ms | < 5,000 ms | `page_load_timeout` |
| `snapshot` (50 elements) | < 200 ms | < 500 ms | `element_wait_timeout` |
| `click` | < 100 ms | < 500 ms | `element_wait_timeout` |
| `fill` (100 chars) | < 200 ms | < 1,000 ms | `element_wait_timeout` |
| `screenshot` (1920x1080) | < 500 ms | < 2,000 ms | `screenshot_timeout` |
| Snapshot output size | ≤ 280 chars | ≤ 500 chars | 2,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Browser memory leak | Medium | Session degradation | `session_timeout` auto-close; max session lifetime |
| Stale @ref usage | High | Command failure | `ERR_REF_STALE` error; callers must re-snapshot |
| Playwright version incompatibility | Low | Skill non-functional | Pin Playwright version in prerequisites |
| Disk full (screenshots/recordings) | Medium | Write failure | `ERR_SCREENSHOT_WRITE`; caller monitors disk |
| Headless mode detection by sites | Medium | Navigation failure | Caller responsibility; out of skill scope |
| Session timeout during long flows | Medium | Work loss | Increase `session_timeout`; checkpoint with screenshots |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point SKILL.md under 200 lines; details in rules/ |
| Prerequisites documented | ✅ | Node.js 18+, Playwright, optional Browserbase |
| When to Use section | ✅ | Decision matrix vs chrome-devtools |
| Quick Reference with commands | ✅ | 4-step workflow with copy-paste commands |
| Core content matches skill type | ✅ | Automation type: commands table, @ref system, execution model |
| Troubleshooting section | ✅ | Problem/solution table |
| Related section | ✅ | Cross-links to e2e-automation, chrome-devtools, test-architect |
| Content Map for multi-file | ✅ | Links to rules/engineering-spec.md |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | All 7 commands (open, snapshot, click, fill, screenshot, record, close) specified | ✅ |
| **Functionality** | @ref lifecycle defined with explicit invalidation rules | ✅ |
| **Contracts** | Input/output/error schemas defined | ✅ |
| **Contracts** | Agent assumptions and non-assumptions documented | ✅ |
| **Contracts** | Workflow invocation pattern specified | ✅ |
| **Failure** | Error taxonomy with 12 categorized error codes | ✅ |
| **Failure** | No silent failures; every error returns structured response | ✅ |
| **Failure** | Retry policy: zero internal retries, caller-owned | ✅ |
| **Timeouts** | 4 timeout parameters with defaults, min, max bounds | ✅ |
| **Security** | URL allowlist with blocked protocols | ✅ |
| **Security** | Credential redaction in logs | ✅ |
| **Security** | Session isolation with UUID identifiers | ✅ |
| **Observability** | Structured log schema with 5 log points | ✅ |
| **Observability** | 6 metrics defined with types and units | ✅ |
| **Performance** | P50/P99 targets for all operations | ✅ |
| **Scalability** | Capacity planning per session and per node | ✅ |
| **Concurrency** | Sequential within session, parallel across sessions | ✅ |
| **Resources** | Lifecycle for 5 resource types with destruction triggers | ✅ |
| **Idempotency** | Per-command idempotency classification | ✅ |
| **Determinism** | 5 deterministic design principles enforced | ✅ |
| **Compliance** | All skill-design-guide.md sections present | ✅ |

---

⚡ PikaKit v3.9.206
