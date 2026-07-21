---
name: indexing
description: Index strategy — B-tree, Hash, GIN, GiST, pgvector with SQL examples and composite index rules
---

# Indexing Principles

> When and how to create indexes effectively. Index for known queries, not speculatively.

---

## When to Create Indexes

```
Index these:
├── Columns in WHERE clauses (equality + range)
├── Columns in JOIN conditions (FK columns)
├── Columns in ORDER BY (sorting)
├── Unique constraints (auto-indexed)
└── Frequently filtered columns

Don't over-index:
├── Write-heavy tables (slower inserts/updates)
├── Low-cardinality columns (boolean, status with 3 values)
├── Columns rarely queried
└── Small tables (< 1000 rows — seq scan is fine)
```

---

## Index Type Selection

| Type | Use For | PostgreSQL Syntax |
|------|---------|-------------------|
| **B-tree** | General purpose, equality & range | Default — no keyword needed |
| **Hash** | Equality only (faster than B-tree for `=`) | `USING HASH` |
| **GIN** | JSONB, arrays, full-text search | `USING GIN` |
| **GiST** | Geometric, range types, spatial | `USING GiST` |
| **HNSW** | Vector similarity (pgvector) | `USING hnsw` |

### SQL Examples

```sql
-- B-tree (default) — equality + range
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_orders_created ON orders (created_at DESC);

-- Hash — equality only
CREATE INDEX idx_users_status ON users USING HASH (status);

-- GIN — JSONB fields
CREATE INDEX idx_products_metadata ON products USING GIN (metadata);

-- GIN — full-text search
CREATE INDEX idx_posts_search ON posts USING GIN (to_tsvector('english', title || ' ' || body));

-- GiST — spatial
CREATE INDEX idx_locations_coords ON locations USING GiST (coordinates);

-- HNSW — vector (pgvector)
CREATE INDEX idx_embeddings_vector ON items USING hnsw (embedding vector_cosine_ops);
```

---

## Composite Index Rules

```
Order matters for composite indexes:
├── 1. Equality columns FIRST
├── 2. Range/sort columns LAST
├── 3. Most selective column first (among equals)
└── 4. Match the query's WHERE + ORDER BY pattern
```

### Example

```sql
-- Query: WHERE status = 'active' AND created_at > '2025-01-01' ORDER BY created_at DESC
CREATE INDEX idx_orders_status_created
  ON orders (status, created_at DESC);

-- ✅ status (equality) first, created_at (range + sort) second
-- ❌ Wrong: (created_at, status) — can't use index for status equality
```

---

## Index with Prisma & Drizzle

```prisma
// Prisma — schema.prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  authorId  String   @map("author_id")
  status    String
  createdAt DateTime @default(now()) @map("created_at")

  @@index([authorId])
  @@index([status, createdAt(sort: Desc)])
}
```

```typescript
// Drizzle — schema.ts
import { index } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  authorId: uuid('author_id').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  authorIdx: index('idx_posts_author').on(table.authorId),
  statusCreatedIdx: index('idx_posts_status_created').on(table.status, table.createdAt),
}));
```

---

## Verify Index Usage

```sql
-- Check if query uses index
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE status = 'active' AND created_at > '2025-01-01'
ORDER BY created_at DESC
LIMIT 20;

-- Look for:
-- ✅ "Index Scan" or "Index Only Scan"
-- ❌ "Seq Scan" on large tables = missing index
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Index every column | Index for known query patterns |
| Skip indexes on foreign keys | Always index FK columns |
| Use B-tree for JSONB queries | Use GIN for JSONB |
| Create index blocking production | Use `CREATE INDEX CONCURRENTLY` |
| Ignore index size and maintenance | Monitor with `pg_stat_user_indexes` |

---



---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [optimization.md](optimization.md) | EXPLAIN ANALYZE for query tuning |
| [schema-design.md](schema-design.md) | Schema that indexes support |
| [SKILL.md](SKILL.md) | Index type quick reference |

---

⚡ PikaKit v3.9.206
