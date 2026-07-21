---
name: backend-patterns
description: Backend performance patterns — N+1 detection, Redis caching, connection pooling, pagination, query optimization
---

# Backend Performance Patterns

> Database and caching optimization patterns for backend performance. **Profile first, optimize second.**

---

## N+1 Query Detection & Fix

### Detection Signs

| Symptom | Indicator |
|---------|-----------|
| Slow list endpoints | Check query count with logging |
| ORM lazy loading | `findMany` / `find` inside loops |
| GraphQL resolvers | Nested field without DataLoader |
| Response time scales with data | 10 items = OK, 1000 items = slow |

### The Problem

```typescript
// ❌ N+1: 1 query for users + N queries for posts
const users = await db.user.findMany()
for (const user of users) {
  const posts = await db.post.findMany({ where: { userId: user.id } })
  user.posts = posts
}
// 101 queries for 100 users!
```

### Fix Patterns

```typescript
// ✅ Fix 1: Eager Loading (Prisma)
const users = await prisma.user.findMany({
  include: { posts: true }
})
// 2 queries total (1 for users + 1 for posts with IN clause)

// ✅ Fix 1: Eager Loading (Drizzle)
const users = await db.query.users.findMany({
  with: { posts: true }
})
```

```typescript
// ✅ Fix 2: Batch Query (manual)
const users = await db.user.findMany()
const userIds = users.map(u => u.id)
const posts = await db.post.findMany({
  where: { userId: { in: userIds } }
})

// Group posts by userId
const postsByUser = new Map<string, Post[]>()
for (const post of posts) {
  const list = postsByUser.get(post.userId) || []
  list.push(post)
  postsByUser.set(post.userId, list)
}
```

```typescript
// ✅ Fix 3: DataLoader (for GraphQL)
import DataLoader from 'dataloader'

const postLoader = new DataLoader(async (userIds: readonly string[]) => {
  const posts = await db.post.findMany({
    where: { userId: { in: [...userIds] } }
  })
  return userIds.map(id => posts.filter(p => p.userId === id))
})

// In resolver — auto-batched and cached per request
const userPosts = await postLoader.load(userId)
```

---

## Redis Caching Patterns

### Cache-Aside Pattern (Most Common)

```typescript
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

async function getUser(userId: string) {
  // 1. Check cache
  const cached = await redis.get(`user:${userId}`)
  if (cached) return JSON.parse(cached)

  // 2. Cache miss → fetch from DB
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return null

  // 3. Set cache with TTL
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user))

  return user
}
```

### TTL Guidelines

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Static config | 24h | Rarely changes |
| User profile | 1h | Occasional updates |
| Product listings | 15-30min | Moderate changes |
| Session data | 15-30min | Security |
| Real-time data | 30s-5min | Freshness critical |
| Computed aggregates | 5-15min | Expensive to compute |
| Search results | 5min | Changes frequently |

### Cache Invalidation

```typescript
// Write-through: update DB + invalidate cache
async function updateUser(userId: string, data: UserUpdate) {
  const user = await db.user.update({ where: { id: userId }, data })

  // Invalidate all related cache keys
  await redis.del(`user:${userId}`)
  await redis.del(`user:${userId}:profile`)
  await redis.del(`user:${userId}:permissions`)

  return user
}

// Pattern: invalidate on write, not on read
// If cache miss rate is high → increase TTL
// If stale data is a problem → decrease TTL
```

### Cache Key Naming Convention

```
{entity}:{id}              → user:123
{entity}:{id}:{field}      → user:123:profile
{entity}:list:{params}     → user:list:page=1&limit=20
{entity}:count:{filter}    → user:count:active=true
{prefix}:{entity}:{id}     → v2:user:123  (versioned)
```

---

## Connection Pooling

### Why It Matters

```
Without pooling:
  Request → Open connection → Query → Close connection
  100 concurrent requests → 100 connections opened/closed
  → Connection overhead dominates response time

With pooling:
  Request → Borrow connection → Query → Return to pool
  100 concurrent requests → 10-20 pooled connections reused
  → Near-zero connection overhead
```

### Configuration

```typescript
// Prisma — connection pool is automatic
// Tune via connection string
const DATABASE_URL = 'postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=10'

// Drizzle + node-postgres
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                // Max connections in pool
  idleTimeoutMillis: 30000,  // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Fail if can't connect in 5s
})

const db = drizzle(pool)
```

### Pool Sizing

| Environment | Pool Size | Rationale |
|-------------|-----------|-----------|
| Development | 5 | Low concurrency |
| Staging | 10 | Moderate load |
| Production | 20-50 | `connections = (CPU cores * 2) + disk spindles` |
| Serverless | 1-5 | Short-lived, use connection proxy (PgBouncer) |

---

## Pagination Patterns

### Offset Pagination (Simple, for small datasets)

```typescript
// ❌ Offset gets slower as page number grows
const users = await db.user.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
})
// Page 1000: DB must scan and skip 999 * pageSize rows
```

### Cursor Pagination (Efficient, for large datasets)

```typescript
// ✅ Cursor is consistently fast regardless of page depth
const users = await db.user.findMany({
  take: pageSize,
  ...(cursor && {
    skip: 1, // Skip the cursor item itself
    cursor: { id: cursor },
  }),
  orderBy: { createdAt: 'desc' },
})

const nextCursor = users.length === pageSize ? users[users.length - 1].id : null

return { items: users, nextCursor }
```

### When to Use Each

| Pattern | Use When |
|---------|----------|
| **Offset** | Admin tables, small datasets (< 10K rows), need page numbers |
| **Cursor** | Infinite scroll, large datasets, real-time feeds, API endpoints |

---

## Database Query Optimization

### Indexing Strategy

| Query Pattern | Index Type | Example |
|---------------|------------|---------|
| Equality (`WHERE x = ?`) | B-tree | `CREATE INDEX idx_email ON users(email)` |
| Range (`WHERE x > ?`) | B-tree | `CREATE INDEX idx_created ON orders(created_at)` |
| Multi-column | Composite | `CREATE INDEX idx_user_status ON orders(user_id, status)` |
| Full-text search | Full-text / GIN | `CREATE INDEX idx_search ON posts USING GIN(to_tsvector(content))` |
| JSON fields | GIN | `CREATE INDEX idx_meta ON users USING GIN(metadata)` |

### Query Analysis

```sql
-- Always check slow queries
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Look for:
-- ✅ Index Scan (fast)
-- ❌ Seq Scan on large table (needs index)
-- ❌ Nested Loop with high row counts (possible N+1)
```

### Query Logging (Development)

```typescript
// Prisma: enable query logging
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
  ],
})

prisma.$on('query', (e) => {
  if (e.duration > 100) { // Log queries > 100ms
    console.warn(`Slow query (${e.duration}ms): ${e.query}`)
  }
})

// Drizzle: use logger
const db = drizzle(pool, { logger: true })
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `SELECT *` in production | Select only needed columns |
| Query inside loops | Batch or eager load |
| Cache without TTL | Always set expiry |
| Infinite cache size | Set maxmemory + eviction policy |
| Skip connection pooling | Always pool in production |
| Offset paginate large datasets | Use cursor pagination |
| Ignore slow query logs | Monitor and index |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [scripts/lighthouse_audit.ts](scripts/lighthouse_audit.ts) | Frontend performance audit |
| [SKILL.md](SKILL.md) | Core Web Vitals targets |
| [rules/engineering-spec.md](rules/engineering-spec.md) | Full architecture spec |

---

⚡ PikaKit v3.9.206
