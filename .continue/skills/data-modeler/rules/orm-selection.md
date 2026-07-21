---
name: orm-selection
description: ORM comparison — Drizzle vs Prisma vs Kysely with code examples, N+1 prevention
---

# ORM Selection (2025)

> Choose ORM based on deployment, DX needs, and N+1 prevention strategy.

---

## Decision Tree

```
What's the context?
│
├── Edge deployment / Bundle size matters
│   └── Drizzle (smallest, SQL-like, edge-ready)
│
├── Best DX / Schema-first / Rapid prototyping
│   └── Prisma (migrations, studio, relations)
│
├── Maximum SQL control with type safety
│   └── Kysely (query builder, no schema file)
│
├── Raw SQL needed
│   └── node-postgres / better-sqlite3 + manual types
│
└── Python ecosystem
    └── SQLAlchemy 2.0 (async support)
```

---

## Comparison Matrix

| Feature | Drizzle | Prisma | Kysely |
|---------|---------|--------|--------|
| Bundle size | ~7 KB | ~2 MB | ~30 KB |
| Edge-ready | ✅ | ❌ | ✅ |
| Schema definition | TypeScript | `.prisma` file | None (inferred) |
| Migrations | `drizzle-kit` | `prisma migrate` | Manual / custom |
| Relations | Manual joins | `include` API | Manual joins |
| N+1 prevention | Explicit joins | `include` depth limits | Explicit joins |
| Type safety | Full (SQL-like) | Full (generated) | Full (inferred) |
| Studio/GUI | Drizzle Studio | Prisma Studio | None |
| Learning curve | Medium (SQL knowledge) | Low | Medium |

---

## Code Comparison

### Schema Definition

```typescript
// Drizzle — TypeScript schema
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
});
```

```prisma
// Prisma — .prisma schema
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now()) @map("created_at")
}

model Post {
  id       String @id @default(cuid())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId String @map("author_id")
}
```

### Query — Fetch User with Posts

```typescript
// Drizzle — explicit join (no N+1)
const result = await db
  .select()
  .from(users)
  .leftJoin(posts, eq(posts.authorId, users.id))
  .where(eq(users.id, userId));

// Prisma — include (watch for N+1 depth)
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { posts: true },  // ⚠️ Limit depth: never nest > 2 levels
});

// Kysely — SQL builder
const result = await db
  .selectFrom('users')
  .leftJoin('posts', 'posts.author_id', 'users.id')
  .where('users.id', '=', userId)
  .selectAll()
  .execute();
```

---

## N+1 Prevention by ORM

| ORM | N+1 Risk | Prevention |
|-----|---------|------------|
| Drizzle | Low | Explicit `leftJoin` / `innerJoin` |
| Prisma | Medium | `include` with depth limit; avoid nested `include` > 2 |
| Kysely | Low | Explicit join queries |
| Raw SQL | None | You write the JOIN |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use Prisma for edge functions | Use Drizzle (smaller bundle) |
| Nest Prisma `include` 3+ levels | Limit to 2 levels; separate queries |
| Use raw SQL for CRUD | Use ORM for type safety |
| Choose ORM without considering deployment | Match ORM to runtime (edge vs Node) |

---



---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [database-selection.md](database-selection.md) | Choose database first |
| [schema-design.md](schema-design.md) | Schema patterns after ORM selected |
| [optimization.md](optimization.md) | N+1 and query optimization |
| [SKILL.md](SKILL.md) | Decision checklist |

---

⚡ PikaKit v3.9.206
