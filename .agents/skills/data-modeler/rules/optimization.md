---
name: optimization
description: Query optimization — N+1 detection, EXPLAIN ANALYZE, pagination, caching strategies
---

# Query Optimization

> N+1 problem, EXPLAIN ANALYZE, optimization priorities with real examples.

---

## N+1 Problem

```
What is N+1?
├── 1 query to get parent records (e.g., 20 users)
├── N queries to get related records (20 × posts query)
└── Result: 21 queries instead of 1–2. Very slow!
```

### Detection & Fix

```typescript
// ❌ N+1 — Prisma (fetching posts separately)
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
  });
}
// Result: 1 + N queries

// ✅ Fixed — Prisma (include)
const users = await prisma.user.findMany({
  include: { posts: true },
});
// Result: 2 queries (1 users + 1 posts with IN clause)

// ✅ Fixed — Drizzle (explicit join)
const result = await db
  .select()
  .from(users)
  .leftJoin(posts, eq(posts.authorId, users.id));
// Result: 1 query with JOIN
```

---

## EXPLAIN ANALYZE

```sql
-- Always EXPLAIN ANALYZE before optimizing
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.*, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.author_id = u.id
WHERE u.status = 'active'
GROUP BY u.id
ORDER BY post_count DESC
LIMIT 20;
```

### Reading the Output

| Look For | Meaning | Action |
|----------|---------|--------|
| `Seq Scan` on large table | Full table scan | Add index |
| `Nested Loop` with high rows | N+1 at SQL level | Rewrite as JOIN |
| `Sort` with high cost | Sorting unsorted data | Add index with ORDER |
| `Hash Join` | Large dataset join | Usually OK; check memory |
| `actual rows` >> `rows` | Bad row estimate | Run `ANALYZE` on table |

---

## Optimization Priorities

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | **Add missing indexes** | 10–100x faster |
| 2 | **Fix N+1 queries** | N → 2 queries |
| 3 | **Select only needed columns** | Less I/O |
| 4 | **Use proper JOINs** | Avoid subqueries |
| 5 | **Paginate at DB level** | Don't fetch all rows |
| 6 | **Cache hot queries** | Offload DB |

---

## Pagination Patterns

```typescript
// ❌ Offset pagination (slow on large datasets)
const page2 = await db.select().from(posts)
  .orderBy(desc(posts.createdAt))
  .offset(20)  // DB still scans first 20 rows
  .limit(20);

// ✅ Cursor pagination (fast, consistent)
const page2 = await db.select().from(posts)
  .where(lt(posts.createdAt, lastCursor))
  .orderBy(desc(posts.createdAt))
  .limit(20);
```

| Method | Performance | Use When |
|--------|------------|----------|
| Offset | O(offset + limit) | Small datasets, admin panels |
| Cursor | O(limit) | Large datasets, infinite scroll, APIs |

---

## Common Slow Patterns

```sql
-- ❌ SELECT * (fetches all columns)
SELECT * FROM users WHERE id = 1;

-- ✅ Select only needed
SELECT id, name, email FROM users WHERE id = 1;

-- ❌ LIKE with leading wildcard (no index)
SELECT * FROM users WHERE name LIKE '%john%';

-- ✅ Full-text search with GIN index
SELECT * FROM users WHERE to_tsvector('english', name) @@ to_tsquery('john');

-- ❌ COUNT(*) on large tables
SELECT COUNT(*) FROM orders;

-- ✅ Approximate count
SELECT reltuples AS estimate FROM pg_class WHERE relname = 'orders';
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Optimize without EXPLAIN | Always EXPLAIN ANALYZE first |
| Use SELECT * in production | Select only needed columns |
| Use offset pagination for large data | Use cursor pagination |
| Use LIKE '%term%' for search | Use full-text search with GIN |
| Ignore N+1 queries | Use JOIN or include/loader |

---



---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [indexing.md](indexing.md) | Create indexes for slow queries |
| [orm-selection.md](orm-selection.md) | ORM-level N+1 prevention |
| [SKILL.md](SKILL.md) | Decision checklist |

---

⚡ PikaKit v3.9.206
