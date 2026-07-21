---
name: agent-browser
description: >-
  AI-optimized browser automation with context-efficient @ref element handles.
  Use when automating browser interactions for AI agents with minimal context consumption.
  NOT for manual E2E testing (use e2e-automation) or screenshots (use chrome-devtools).
metadata:
  author: pikakit
  version: "3.9.206"
  category: automation
  triggers: ["browser automation", "web testing", "scraping", "UI verification", "headless"]
  coordinates_with: ["e2e-automation", "chrome-devtools", "observability"]
  success_metrics: ["Reduces LLM context consumption by 90%", "Zero dependency on full DOM serialization"]
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

⚡ PikaKit v3.9.206
