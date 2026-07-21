---
name: async-patterns
description: Async/await patterns, Promise utilities, AbortController, streams, worker threads, and event loop protection
title: "Node.js is async-first. The event loop is everything. Block it and your entire server stops."
impact: CRITICAL
impactDescription: "Significant performance or security impact"
tags: async, patterns
---

# Async Patterns

> Node.js is async-first. **The event loop is everything.** Block it and your entire server stops.

---

## When to Use Each

| Pattern | Use When | Example |
|---------|----------|---------|
| `async/await` | Sequential operations | Fetch user → fetch orders |
| `Promise.all` | Parallel, all must succeed | Fetch user AND orders simultaneously |
| `Promise.allSettled` | Parallel, some can fail | Send notifications to multiple channels |
| `Promise.race` | First response wins | Timeout pattern |
| `Promise.any` | First success wins | Try multiple CDNs |

---

## Code Examples

### Sequential (when order matters)

```typescript
// ✅ Each step depends on the previous
async function processOrder(orderId: string) {
  const order = await getOrder(orderId)
  const payment = await chargePayment(order.total)
  const confirmation = await sendConfirmation(order.email, payment.id)
  return confirmation
}
```

### Parallel (independent operations)

```typescript
// ❌ Waterfall — 3 sequential network calls
async function getDashboard(userId: string) {
  const user = await getUser(userId)        // 200ms
  const orders = await getOrders(userId)    // 300ms
  const stats = await getStats(userId)      // 150ms
  return { user, orders, stats }            // Total: 650ms
}

// ✅ Parallel — all at once
async function getDashboard(userId: string) {
  const [user, orders, stats] = await Promise.all([
    getUser(userId),       // 200ms
    getOrders(userId),     // 300ms  } Total: 300ms (longest)
    getStats(userId),      // 150ms
  ])
  return { user, orders, stats }
}
```

### Partial failure tolerance

```typescript
// ✅ Send to all channels, don't fail if one channel is down
async function notifyAll(userId: string, message: string) {
  const results = await Promise.allSettled([
    sendEmail(userId, message),
    sendPush(userId, message),
    sendSMS(userId, message),
  ])

  const failures = results.filter(r => r.status === 'rejected')
  if (failures.length > 0) {
    logger.warn({ failures }, 'Some notifications failed')
  }
}
```

---

## AbortController (Timeouts + Cancellation)

```typescript
// Timeout a fetch request
async function fetchWithTimeout(url: string, timeoutMs = 5000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { signal: controller.signal })
    return await response.json()
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`)
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

// Cancel on user disconnect (Fastify)
app.get('/long-operation', async (request, reply) => {
  const result = await longOperation({ signal: request.raw.signal })
  return result
  // If client disconnects, signal is aborted → operation cancelled
})
```

---

## Streams (Large Data)

```typescript
// ❌ Load entire file into memory
const data = await fs.readFile('huge-file.csv', 'utf-8')
const lines = data.split('\n') // 2GB in memory!

// ✅ Stream line by line
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'

async function processCSV(filePath: string) {
  const stream = createReadStream(filePath)
  const rl = createInterface({ input: stream })

  for await (const line of rl) {
    await processLine(line) // Constant memory usage
  }
}

// ✅ Stream API response (Fastify)
app.get('/export', async (request, reply) => {
  const cursor = db.query.users.findMany().cursor()
  reply.type('application/json')

  for await (const batch of cursor) {
    reply.raw.write(JSON.stringify(batch))
  }
  reply.raw.end()
})
```

---

## Worker Threads (CPU-Bound Work)

```typescript
// ❌ Blocks event loop — entire server freezes
app.get('/hash', async (request) => {
  const hash = computeExpensiveHash(request.body.data) // 2 seconds blocking
  return { hash }
})

// ✅ Offload to worker thread
import { Worker } from 'node:worker_threads'

function runInWorker<T>(workerPath: string, data: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, { workerData: data })
    worker.on('message', resolve)
    worker.on('error', reject)
  })
}

app.get('/hash', async (request) => {
  const hash = await runInWorker('./workers/hash.ts', request.body.data)
  return { hash } // Event loop stays free
})
```

```typescript
// workers/hash.ts
import { parentPort, workerData } from 'node:worker_threads'

const result = computeExpensiveHash(workerData)
parentPort?.postMessage(result)
```

---

## Event Loop Protection

```
I/O-bound (event loop handles well):
├── Database queries      → async/await
├── HTTP requests         → async/await
├── File system           → fs.promises (never Sync!)
└── Network operations    → async/await

CPU-bound (blocks event loop):
├── Crypto (hashing)      → worker threads
├── Image processing      → worker threads or external service
├── JSON parse (>1MB)     → streaming parser
├── Complex calculations  → worker threads
└── Compression           → zlib.promises or worker
```

### Detect Blocking

```typescript
// Detect event loop lag (monitoring)
import { monitorEventLoopDelay } from 'node:perf_hooks'

const histogram = monitorEventLoopDelay({ resolution: 20 })
histogram.enable()

setInterval(() => {
  const p99 = histogram.percentile(99) / 1e6 // Convert to ms
  if (p99 > 100) {
    logger.warn({ p99Ms: p99 }, 'Event loop lag detected')
  }
  histogram.reset()
}, 5000)
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `fs.readFileSync` in production | `fs.promises.readFile` |
| Sequential awaits for independent data | `Promise.all` |
| No timeout on external calls | `AbortController` with timeout |
| Load large files into memory | Stream processing |
| CPU work on main thread | Worker threads |
| Ignore `unhandledRejection` | Handle or crash process |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [error-handling.md](error-handling.md) | Async error catching patterns |
| [architecture-patterns.md](architecture-patterns.md) | Where async code lives in layers |
| [testing-strategy.md](testing-strategy.md) | Testing async code |
| [runtime-modules.md](runtime-modules.md) | node: prefix for built-in modules |

---

⚡ PikaKit v3.9.206
