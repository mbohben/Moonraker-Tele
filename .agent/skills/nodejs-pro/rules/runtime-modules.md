---
name: runtime-modules
description: Node.js runtime selection, ESM vs CJS, native TypeScript, node prefix, and module interop
title: "Runtime & Module System"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: runtime, modules
---

# Runtime & Module System

> Use ESM for new projects. Use `node:` prefix. Run TypeScript natively on Node.js 22+.

---

## Runtime Selection

| Runtime | Best For | TypeScript | Package Manager |
|---------|----------|-----------|----------------|
| **Node.js** | General purpose, largest ecosystem | Via `--experimental-strip-types` (22+) or tsx | npm/pnpm/yarn |
| **Bun** | Performance, scripts, built-in bundler | Native | bun |
| **Deno** | Security-first, built-in TypeScript | Native | deno/npm |

**Default recommendation:** Node.js 22+ (LTS) unless specific Bun/Deno features needed.

---

## Module System Decision

| Factor | ESM (`import/export`) | CJS (`require/module.exports`) |
|--------|----------------------|-------------------------------|
| **Standard** | Modern (ECMAScript) | Legacy (Node.js original) |
| **Tree-shaking** | ✅ Yes | ❌ No |
| **Top-level await** | ✅ Yes | ❌ No |
| **New projects** | ✅ Use this | ❌ Avoid |
| **Existing codebases** | Migrate gradually | Keep if migration cost high |

### ESM Setup

```json
// package.json
{
  "type": "module"
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## Native TypeScript (Node.js 22+)

```bash
# Run .ts directly — no build step
node --experimental-strip-types src/app.ts

# With type-checking (slower, for CI)
npx tsx src/app.ts
```

**When to use native TS:**
- Scripts and CLIs
- Simple APIs
- Development

**When to use a build step:**
- Production (compiled JS is faster to start)
- Complex projects with path aliases
- When you need decorators (NestJS)

---

## `node:` Prefix (Always Use)

```typescript
// ❌ Ambiguous — is this npm package or built-in?
import { readFile } from 'fs/promises'
import { join } from 'path'

// ✅ Clear — this is a Node.js built-in
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Worker } from 'node:worker_threads'
import { createServer } from 'node:http'
```

**Why?** Prevents name conflicts with npm packages. Makes imports instantly recognizable.

---

## Interop Gotchas

### Importing CJS from ESM

```typescript
// ✅ Default imports usually work
import express from 'express' // CJS library

// ⚠️ Named imports may fail
import { Router } from 'express' // May error in some setups

// ✅ Safe alternative
import express from 'express'
const { Router } = express
```

### `__dirname` / `__filename` in ESM

```typescript
// ❌ Not available in ESM
console.log(__dirname) // ReferenceError

// ✅ ESM equivalent
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Or use import.meta directly (Node.js 21+)
const configPath = new URL('./config.json', import.meta.url)
```

### `require()` in ESM

```typescript
// ❌ Not available in ESM
const pkg = require('./package.json')

// ✅ Use createRequire or import assertion
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

// ✅ Or import with assertion (Node.js 22+)
import pkg from './package.json' with { type: 'json' }
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Start new projects with CJS | Use ESM (`"type": "module"`) |
| Import built-ins without `node:` | Always `import from 'node:fs'` |
| Mix ESM and CJS in same package | Pick one, migrate fully |
| Use `__dirname` in ESM | Use `import.meta.url` |
| Skip tsconfig `"strict": true` | Always enable strict mode |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [framework-selection.md](framework-selection.md) | Framework TypeScript support |
| [async-patterns.md](async-patterns.md) | node: built-in async APIs |
| [testing-strategy.md](testing-strategy.md) | node:test built-in runner |

---

⚡ PikaKit v3.9.206
