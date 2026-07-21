---
name: testing-strategy
description: Node.js testing with Vitest and node:test — unit/integration/E2E patterns, mocking, and CI integration
title: "Test the right things: critical paths, edge cases, error handling. Don't test framework code."
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: testing, strategy
---

# Testing Strategy

> Test the right things: critical paths, edge cases, error handling. **Don't test framework code.**

---

## Test Tool Selection

| Tool | Best For | Speed | Setup |
|------|---------|-------|-------|
| **Vitest** | Vite/React projects, modern DX | Fastest | Zero-config with Vite |
| **node:test** | Zero-dependency, built-in | Fast | No install needed |
| **Jest** | Legacy projects | Slower | Extra config for ESM |

**Default recommendation:** Vitest for app projects. `node:test` for libraries / zero-dep projects.

---

## What to Test (Priorities)

| Priority | Test | Why |
|----------|------|-----|
| 1 | **Critical paths** | Auth, payments, core business logic |
| 2 | **Edge cases** | Empty inputs, boundaries, nulls |
| 3 | **Error handling** | What happens when things fail? |
| 4 | **Integration points** | API endpoints, database queries |
| ❌ | Framework code | Express/Fastify already tested |
| ❌ | Trivial getters/setters | No logic to test |
| ❌ | Third-party libraries | They have their own tests |

---

## Unit Test Examples

### Vitest

```typescript
// user.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService
  let mockRepo: { findById: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockRepo = {
      findById: vi.fn(),
      create: vi.fn(),
    }
    service = new UserService(mockRepo as any)
  })

  it('returns user when found', async () => {
    const user = { id: '1', name: 'Alice', email: 'alice@test.com' }
    mockRepo.findById.mockResolvedValue(user)

    const result = await service.getUser('1')

    expect(result).toEqual(user)
    expect(mockRepo.findById).toHaveBeenCalledWith('1')
  })

  it('throws NotFoundError when user missing', async () => {
    mockRepo.findById.mockResolvedValue(null)

    await expect(service.getUser('999'))
      .rejects.toThrow('User not found')
  })
})
```

### node:test (Zero Dependencies)

```typescript
// user.service.test.ts
import { describe, it, mock, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { UserService } from './user.service.js'

describe('UserService', () => {
  let service: UserService
  let mockRepo: { findById: Function; create: Function }

  beforeEach(() => {
    mockRepo = {
      findById: mock.fn(() => Promise.resolve(null)),
      create: mock.fn(() => Promise.resolve({ id: '1' })),
    }
    service = new UserService(mockRepo as any)
  })

  it('returns user when found', async () => {
    const user = { id: '1', name: 'Alice' }
    mockRepo.findById = mock.fn(() => Promise.resolve(user))
    service = new UserService(mockRepo as any)

    const result = await service.getUser('1')
    assert.deepEqual(result, user)
  })

  it('throws when user not found', async () => {
    await assert.rejects(
      () => service.getUser('999'),
      { message: 'User not found' }
    )
  })
})
```

---

## Integration Test (API Endpoint)

```typescript
// Fastify + Vitest
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../app'

describe('POST /users', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp({ testing: true })
  })

  afterAll(async () => {
    await app.close()
  })

  it('creates user with valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { email: 'test@test.com', name: 'Test User' },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toMatchObject({
      email: 'test@test.com',
      name: 'Test User',
    })
  })

  it('returns 422 for invalid email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { email: 'not-an-email', name: 'Test' },
    })

    expect(response.statusCode).toBe(422)
    expect(response.json().error).toBe('VALIDATION_ERROR')
  })
})
```

---

## Mocking Patterns

```typescript
// Mock external services (Vitest)
vi.mock('./external-api', () => ({
  fetchFromAPI: vi.fn().mockResolvedValue({ data: 'mocked' }),
}))

// Mock environment variables
vi.stubEnv('DATABASE_URL', 'postgres://test:test@localhost/test')

// Mock timers
vi.useFakeTimers()
vi.advanceTimersByTime(5000)
vi.useRealTimers()

// Spy on function calls
const spy = vi.spyOn(logger, 'error')
await performAction()
expect(spy).toHaveBeenCalledWith(expect.objectContaining({ error: true }))
```

---

## Test Structure

```
src/
├── services/
│   ├── user.service.ts
│   └── user.service.test.ts      # Co-located unit tests
├── controllers/
│   ├── user.controller.ts
│   └── user.controller.test.ts
└── __tests__/                     # Integration tests
    ├── api/
    │   └── users.test.ts
    └── setup.ts                   # Test database, fixtures
```

---

## Running Tests

```bash
# Vitest
npx vitest              # Watch mode
npx vitest run           # Single run (CI)
npx vitest run --coverage  # With coverage

# node:test
node --test src/**/*.test.ts       # Run all tests
node --test --watch                # Watch mode (Node.js 22+)
node --test --experimental-test-coverage  # Coverage
```

---

## CI Integration

```yaml
# GitHub Actions
- name: Test
  run: npx vitest run --coverage --reporter=junit
  env:
    DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

- name: Upload Coverage
  uses: codecov/codecov-action@v4
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Test implementation details | Test behavior and outcomes |
| Mock everything | Mock only external boundaries |
| Test framework internals | Test your business logic |
| Skip error path tests | Test both happy and error paths |
| Use `any` for mock types | Type mocks properly |
| Rely on test order | Each test is independent |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [architecture-patterns.md](architecture-patterns.md) | Layer testing strategy |
| [error-handling.md](error-handling.md) | Testing error paths |
| [validation-security.md](validation-security.md) | Testing validation schemas |
| [async-patterns.md](async-patterns.md) | Testing async code |

---

⚡ PikaKit v3.9.206
