---
title: Chrome DevTools — Engineering Specification
impact: MEDIUM
tags: chrome-devtools
---

# Chrome DevTools — Engineering Specification

> Production-grade specification for Puppeteer CLI browser automation at FAANG scale.

---

## 1. Overview

Chrome DevTools provides a suite of Puppeteer-based CLI scripts for browser automation: navigation, screenshot capture, form interaction, JavaScript execution, ARIA tree inspection, console monitoring, network tracking, and Core Web Vitals measurement. Unlike `agent-browser` (which uses @ref handles for AI-optimized workflows), Chrome DevTools operates as direct CLI tools invoked from terminal.

The skill has side effects: it launches browser processes, captures screenshots to disk, persists session state in `.browser-session.json`, and executes arbitrary JavaScript in page context.

---

## 2. Problem Statement

Browser automation tooling at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| No session persistence | Each browser script launches a new browser instance | 3–5 second overhead per operation; auth state lost |
| Unstructured output | Raw console text output from browser scripts | Unparseable by agents; manual extraction required |
| Screenshot size explosion | Full-page screenshots at high DPI produce 10–20MB files | Exceeds context limits; storage waste |
| No performance baseline | Core Web Vitals measured ad-hoc with no structured format | No regression tracking; no CI/CD integration |

Chrome DevTools eliminates these with session-persistent scripts, JSON-structured output, auto-compressed screenshots, and standardized Core Web Vitals measurement.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Session persistence | Browser instance survives across ≤ 50 sequential script invocations |
| G2 | JSON-structured output | Every script outputs parseable JSON to stdout |
| G3 | Screenshot size control | All screenshots ≤ 5 MB; auto-compress if exceeded |
| G4 | Core Web Vitals capture | FCP, LCP, CLS, TTFB measured and returned as JSON object |
| G5 | CLI-first interface | Every operation invocable via `node <script>.js --<args>` |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | AI-optimized @ref handle system | Owned by `agent-browser` skill |
| NG2 | E2E test suite management | Owned by `e2e-automation` skill (Playwright) |
| NG3 | Performance analysis and recommendations | Owned by `perf-optimizer` skill |
| NG4 | Cross-browser testing | Chrome/Chromium only; no Firefox/Safari |
| NG5 | Browser extension development | Out of scope; see chrome-extension template |
| NG6 | Cloud browser provisioning | Infrastructure concern; not a script concern |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Puppeteer script execution | 10 CLI scripts in `scripts/` | Browser installation (caller ensures Chrome/Chromium available) |
| Session management | `.browser-session.json` lifecycle | Session storage beyond local filesystem |
| Screenshot capture | Capture + auto-compress + file write | Image analysis or comparison |
| JavaScript execution | Run arbitrary JS in page context | JS code generation |
| Core Web Vitals | FCP, LCP, CLS, TTFB measurement | Performance thresholds or recommendations |
| Console/network monitoring | Capture and JSON output | Log analysis |

**Side-effect boundary:** Chrome DevTools launches browser processes, writes files (screenshots, session), executes JavaScript in page context, and makes network requests (via navigated pages). All side effects are confined to the script invocation scope except session persistence.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema (per script)

```
Script: string           # One of the 10 scripts (navigate, screenshot, click, fill, evaluate, etc.)
Arguments: {
  url: string | null      # Target URL (navigate, screenshot, performance)
  selector: string | null # CSS selector (click, fill)
  value: string | null    # Input value (fill)
  script: string | null   # JavaScript code (evaluate)
  output: string | null   # Output file path (screenshot)
  headless: boolean       # Default: true
  timeout: number         # Default: 30000 ms
  close: boolean          # Default: false; true = terminate browser
  wait_until: string      # "load" | "domcontentloaded" | "networkidle0" | "networkidle2"
  full_page: boolean      # Screenshot: capture full page
  max_size: number        # Screenshot: max MB before compression (default: 5)
}
contract_version: string # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  result: any             # Script-specific output (page title, evaluation result, vitals, etc.)
  screenshot_path: string | null  # Absolute path to saved screenshot
  session_id: string      # Browser session identifier
  timing: {
    started: string       # ISO-8601
    completed: string     # ISO-8601
    duration_ms: number
  }
  metadata: {
    contract_version: string    # "2.0.0"
    backward_compatibility: string  # "breaking"
  }
}
Error: {
  code: string            # From Error Taxonomy (Section 11)
  message: string
  script: string
  recoverable: boolean
}
```

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

#### Deterministic Guarantees

- Same `Script` + `Arguments` targeting the same page state = same JSON structure output.
- Screenshot file path is deterministic from `--output` argument.
- Session file location is fixed: `.browser-session.json` in working directory.
- Script output format (JSON schema) is fixed per script version.

**Non-deterministic elements:** Page content, network timing, Core Web Vitals values, console output, and screenshot pixel content depend on the target page state at execution time.

#### What Agents May Assume

- Scripts produce JSON to stdout on success.
- Session persists across sequential script calls within the same working directory.
- Screenshots exceeding `max_size` are auto-compressed.
- `--close true` terminates the browser process.

#### What Agents Must NOT Assume

- Page state is reproducible across invocations (pages are live web content).
- Core Web Vitals values are stable (they vary with network and rendering conditions).
- Browser is already running (first script in session must launch it).
- Scripts work without Puppeteer installed.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| navigate.ts | Launches browser (if not running); navigates to URL; modifies session file |
| screenshot.ts | Writes screenshot file to disk; may compress |
| click.ts | Mutates page state (clicks element) |
| fill.ts | Mutates page state (fills form field) |
| evaluate.ts | Executes arbitrary JS in page context; may mutate page |
| aria-snapshot.ts | None (read-only page inspection) |
| select-ref.ts | Mutates page state (interacts with element) |
| console.ts | None (passive monitoring) |
| network.ts | None (passive monitoring) |
| performance.ts | Navigates and measures; reads page |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Launch session: node navigate.ts --url <target>
2. Interact: node fill.ts / click.ts / evaluate.ts (sequential, reuses session)
3. Capture: node screenshot.ts --output <path>
4. Measure: node performance.ts --url <target>
5. Close: node navigate.ts --close true
```

#### Execution Guarantees

- Scripts execute sequentially within a session (no parallel script execution on same session).
- Each script completes (success or timeout) before returning control.
- Session state persists in `.browser-session.json` between script calls.
- `--close true` guarantees browser process termination.

#### Failure Propagation Model

| Failure Type | Propagation | Recovery |
|-------------|-------------|----------|
| Element not found | Return error with selector | Use aria-snapshot.ts to find correct selector |
| Navigation timeout | Return error with URL and timeout | Increase timeout or verify URL |
| Browser crash | Return error; session file preserved | Delete session file; re-launch |
| Puppeteer not installed | Return error immediately | Run npm install |
| Permission denied (screenshot) | Return error with path | Verify write permissions |

#### Retry Boundaries

- Zero internal retries. Scripts execute once and return.
- Callers may retry with same or modified arguments.
- Session survives script failures (browser stays running).

#### Isolation Model

- One session per working directory (session file is directory-scoped).
- Multiple concurrent sessions in different directories are independent.
- No cross-session communication.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| navigate.ts | No | Page state changes on navigation |
| screenshot.ts | No | File overwrite if same output path; page may differ |
| click.ts | No | Mutates page state |
| fill.ts | No | Mutates form state |
| evaluate.ts | Depends | Read-only JS is idempotent; mutation JS is not |
| aria-snapshot.ts | Yes | Read-only page inspection |
| console.ts | Yes | Passive monitoring |
| network.ts | Yes | Passive monitoring |
| performance.ts | No | Navigation + measurement produces varying values |

---

## 7. Execution Model

### 2-Phase Script Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Connect** | Read session file → connect to existing browser OR launch new browser | Browser connection |
| **Execute** | Run script-specific action → return JSON result → update session file | JSON to stdout |

All scripts follow this lifecycle. Session file is updated after every script execution.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed JSON output schema | Each script has a documented output structure |
| Fixed session file location | `.browser-session.json` in working directory |
| Fixed compression threshold | Screenshots auto-compress above `max_size` (default 5 MB) |
| Deterministic argument parsing | yargs-based CLI with typed arguments |
| No hidden state | All state in session file; no in-memory persistence across scripts |

**Acknowledged non-determinism:** Page content, network timing, and rendering are inherently non-deterministic.

---

## 9. State & Idempotency Model

### Session State Machine

```
States: NO_SESSION, ACTIVE, CLOSED
Transitions:
  NO_SESSION → ACTIVE     (any script invoked; browser launched)
  ACTIVE     → ACTIVE     (script invoked; browser reused)
  ACTIVE     → CLOSED     (--close true)
  CLOSED     → ACTIVE     (any script invoked; new browser launched)
```

### Persistent State

- `.browser-session.json` — browser WebSocket endpoint, PID, launch options
- Session survives script failures (browser stays running)
- Session file is per-working-directory; no cross-directory sharing

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Recovery |
|---------------|----------|----------|
| Element not found | Return `ERR_ELEMENT_NOT_FOUND` | Use aria-snapshot.ts |
| Navigation timeout | Return `ERR_NAVIGATION_TIMEOUT` | Increase timeout |
| Browser disconnected | Return `ERR_BROWSER_DISCONNECTED` | Delete session file; re-launch |
| Browser crash | Return `ERR_BROWSER_CRASHED` | Delete session file; re-launch |
| Puppeteer not installed | Return `ERR_PUPPETEER_MISSING` | Run npm install |
| Script execution error | Return `ERR_SCRIPT_FAILED` with JS error | Fix JavaScript code |
| File write failed | Return `ERR_WRITE_FAILED` | Verify disk space and permissions |
| Invalid selector | Return `ERR_INVALID_SELECTOR` | Fix CSS selector syntax |
| Session file corrupted | Return `ERR_SESSION_CORRUPTED` | Delete .browser-session.json |

**Invariant:** Every failure outputs a JSON error object to stdout. No script exits with unstructured error text.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_ELEMENT_NOT_FOUND` | Interaction | Yes | CSS selector matched no elements |
| `ERR_NAVIGATION_TIMEOUT` | Network | Yes | Page did not reach wait_until state within timeout |
| `ERR_BROWSER_DISCONNECTED` | Session | Yes | Browser process unreachable; session file stale |
| `ERR_BROWSER_CRASHED` | Session | Yes | Browser process terminated unexpectedly |
| `ERR_PUPPETEER_MISSING` | Infrastructure | No | Puppeteer npm package not installed |
| `ERR_SCRIPT_FAILED` | Execution | Yes | JavaScript execution threw an error |
| `ERR_WRITE_FAILED` | IO | Yes | Screenshot or file write failed |
| `ERR_INVALID_SELECTOR` | Validation | No | CSS selector is syntactically invalid |
| `ERR_SESSION_CORRUPTED` | Session | Yes | Session file is invalid JSON |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Max | Unit |
|-----------|---------|-----|------|
| Navigation timeout | 30,000 | 120,000 | ms |
| Element wait timeout | 5,000 | 30,000 | ms |
| Script execution timeout | 30,000 | 60,000 | ms |
| Screenshot capture | 10,000 | 30,000 | ms |
| Session connect | 5,000 | 10,000 | ms |
| Performance measurement | 30,000 | 60,000 | ms |

**Retry policy:** Zero internal retries. All scripts execute once. Callers own retry logic.

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "chrome-devtools",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "script": "string",
  "session_id": "string",
  "status": "success|error",
  "error_code": "string|null",
  "url": "string|null",
  "selector": "string|null",
  "duration_ms": "number",
  "screenshot_size_bytes": "number|null",
  "compressed": "boolean|null"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Script started | INFO | script, session_id, arguments |
| Script completed | INFO | script, duration_ms, status |
| Script failed | ERROR | script, error_code, message |
| Browser launched | INFO | session_id, headless, PID |
| Browser closed | INFO | session_id, reason |
| Screenshot compressed | WARN | original_size, compressed_size, path |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `devtools.script.duration` | Histogram | ms |
| `devtools.script.error_rate` | Counter | per error_code |
| `devtools.script.usage` | Counter | per script |
| `devtools.session.duration` | Histogram | ms |
| `devtools.screenshot.size` | Histogram | bytes |
| `devtools.vitals.fcp` | Histogram | ms |
| `devtools.vitals.lcp` | Histogram | ms |

---

## 14. Security & Trust Model

### JavaScript Execution

- `evaluate.ts` executes arbitrary JavaScript in the target page context.
- No sandboxing beyond Chromium's own security model.
- Callers are responsible for JS code safety; the skill does not validate script content.

### Credential Handling

- Scripts may interact with login forms (fill.ts) but do not store credentials.
- Session state (`.browser-session.json`) contains browser WebSocket endpoint, not credentials.
- Auth cookies persist in the browser profile during the session.

### File System Access

- Screenshots are written to the path specified by `--output`.
- Session file is written to working directory.
- No file access outside these two paths.

### Network Access

- Navigated pages make their own network requests.
- Scripts do not make additional network requests beyond Puppeteer's CDP connection.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Memory per session | 50–150 MB (Chromium process) | One session per working directory |
| Concurrent sessions | Limited by system memory | Each session in separate directory |
| Screenshot storage | 1–5 MB per screenshot | `max_size` compression |
| Session duration | Indefinite until `--close true` | Caller manages session lifecycle |
| Script throughput | Sequential per session | No parallel script execution on same session |

---

## 16. Concurrency Model

| Scope | Model | Behavior |
|-------|-------|----------|
| Within session | Sequential | One script at a time per browser session |
| Across sessions | Parallel | Different directories = independent sessions |
| Script execution | Blocking | Script returns only after completion or timeout |

**Undefined behavior:** Two scripts targeting the same session concurrently. The session file does not support locking; concurrent access produces unpredictable results.

---

## 17. Resource Lifecycle Management

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Chromium process | First script in session | `--close true` or manual kill | Indefinite |
| Session file | First script | `--close true` (auto-delete) or manual delete | Session lifetime |
| Screenshot files | screenshot.ts | Caller (manual cleanup) | Indefinite |
| Page state | Navigation/interaction scripts | Navigation to new page or browser close | Until next navigation |

**Leak prevention:** Callers must invoke `--close true` to terminate browser processes. Orphaned processes must be killed manually. Session files without running browsers are stale and should be deleted.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Session connect (existing) | < 200 ms | < 500 ms | 10,000 ms |
| Browser launch (new session) | < 3,000 ms | < 8,000 ms | 30,000 ms |
| Navigation | < 2,000 ms | < 10,000 ms | 30,000 ms |
| Screenshot capture | < 500 ms | < 2,000 ms | 10,000 ms |
| Click/fill interaction | < 100 ms | < 500 ms | 5,000 ms |
| JavaScript execution | < 100 ms | < 1,000 ms | 30,000 ms |
| Performance measurement | < 5,000 ms | < 15,000 ms | 60,000 ms |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Orphaned browser processes | Medium | Memory leak on machine | Caller must use `--close true`; document cleanup |
| Session file stale (browser died) | Medium | Connection failures | `ERR_BROWSER_DISCONNECTED`; delete session file |
| Screenshot disk exhaustion | Low | Write failures | `max_size` compression; caller manages cleanup |
| Puppeteer/Chrome version mismatch | Medium | Launch failures | Pin Puppeteer version; document compatible Chrome |
| Arbitrary JS execution risk | Medium | Page state corruption | Caller responsibility; no sandboxing |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | Node.js 18+, Puppeteer, Linux deps |
| When to Use section | ✅ | Comparison with agent-browser |
| Quick Reference | ✅ | Script table, session persistence, examples |
| Troubleshooting section | ✅ | Problem/solution table |
| Related section | ✅ | Cross-links to agent-browser, e2e-automation, perf-optimizer |
| Content Map | ✅ | Links to references and scripts |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 10 CLI scripts covering navigation, capture, interaction, monitoring | ✅ |
| **Functionality** | Session persistence via .browser-session.json | ✅ |
| **Functionality** | Auto-compression for screenshots > 5 MB | ✅ |
| **Contracts** | Input arguments and JSON output schemas defined | ✅ |
| **Contracts** | Per-script side-effect boundaries documented | ✅ |
| **Contracts** | Per-script idempotency classification | ✅ |
| **Failure** | Error taxonomy with 9 categorized error codes | ✅ |
| **Failure** | JSON error output on all failures | ✅ |
| **Failure** | Zero internal retries | ✅ |
| **Determinism** | Fixed JSON output schemas, fixed session file location | ✅ |
| **Determinism** | Non-determinism acknowledged (page content, network timing) | ✅ |
| **Security** | No credential storage; JS execution risk documented | ✅ |
| **Observability** | Structured log schema with 6 log points | ✅ |
| **Observability** | 7 metrics including Core Web Vitals | ✅ |
| **Performance** | P50/P99 targets for all script types | ✅ |
| **Scalability** | One session per directory; memory-bounded | ✅ |
| **Concurrency** | Sequential within session; parallel across directories | ✅ |
| **Resources** | Browser process lifecycle documented; orphan risk mitigated | ✅ |
| **Compliance** | All skill-design-guide.md sections present | ✅ |

---

⚡ ## OpenTelemetry Observability (MANDATORY)

- **Distributed Tracing**: EVERY Chrome DevTools script invocation MUST be traced via OpenTelemetry. W3C Trace Context must be propagated through Puppeteer to the target page.
- **Metrics**: Core Web Vitals (FCP, LCP, CLS, TTFB) MUST be recorded as OTel Histogram metrics attached to the current 	race_id.

---

PikaKit v3.9.206
