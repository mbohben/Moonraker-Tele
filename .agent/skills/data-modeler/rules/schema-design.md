---
name: schema-design
description: Schema design principles — normalization, primary keys, timestamps, relationships, Prisma + Drizzle examples
---

# Schema Design Principles

> Normalization, primary keys, timestamps, relationships with ORM examples.

---

## Normalization Decision

```
When to normalize (separate tables):
├── Data is repeated across rows
├── Updates would need multiple changes
├── Relationships are clear (1:N, N:M)
└── Query patterns use JOINs

When to denormalize (embed/duplicate):
├── Read performance critical (dashboards)
├── Data rarely changes (audit logs)
├── Always fetched together (user + profile)
└── Simpler queries needed (reporting)
```

---

## Primary Key Selection

| Type | Use When | Example |
|------|----------|---------|
| **UUID v4** | Distributed systems, security | `550e8400-e29b-41d4-a716-446655440000` |
| **ULID** | UUID + sortable by time | `01ARZ3NDEKTSV4RRFFQ69G5FAV` |
| **cuid2** | Short, collision-resistant | `clh3am6x20000` |
| **Auto-increment** | Simple apps, single database | `1, 2, 3...` |

> **Default:** Use `cuid()` (Prisma) or `uuid()` (Drizzle) for new projects.

---

## Timestamp Strategy

```typescript
// Drizzle — every table gets these
import { timestamp } from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
};

// Prisma — every model gets these
// createdAt DateTime  @default(now()) @map("created_at")
// updatedAt DateTime  @updatedAt      @map("updated_at")
```

> **Rule:** Always use `TIMESTAMPTZ` (with timezone), never `TIMESTAMP`.

---

## Relationship Patterns

| Type | When | Implementation |
|------|------|----------------|
| **One-to-One** | Extension data (user → profile) | FK + unique constraint on child |
| **One-to-Many** | Parent-children (user → posts) | FK on child table |
| **Many-to-Many** | Both sides have many (posts ↔ tags) | Junction table |
| **Self-referential** | Tree structures (comments → replies) | FK referencing same table |

### Prisma Example (1:N + N:M)

```prisma
model User {
  id    String @id @default(cuid())
  posts Post[]
}

model Post {
  id       String @id @default(cuid())
  author   User   @relation(fields: [authorId], references: [id])
  authorId String @map("author_id")
  tags     PostTag[]
}

model Tag {
  id    String    @id @default(cuid())
  name  String    @unique
  posts PostTag[]
}

model PostTag {
  postId String @map("post_id")
  tagId  String @map("tag_id")
  post   Post   @relation(fields: [postId], references: [id])
  tag    Tag    @relation(fields: [tagId], references: [id])
  @@id([postId, tagId])
}
```

---

## Foreign Key ON DELETE

| Action | Behavior | Use When |
|--------|----------|----------|
| `CASCADE` | Delete children with parent | Comments when post deleted |
| `SET NULL` | Children become orphans | Author deleted, posts remain |
| `RESTRICT` | Prevent delete if children exist | User has active orders |
| `SET DEFAULT` | Children get default value | Rare; prefer SET NULL |

> **Default:** Use `RESTRICT` for safety. Explicitly choose `CASCADE` only when appropriate.

---

## Soft Delete Pattern

```typescript
// Drizzle
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Query — exclude soft-deleted
const activeUsers = await db
  .select()
  .from(users)
  .where(isNull(users.deletedAt));
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use `TIMESTAMP` without timezone | Use `TIMESTAMPTZ` always |
| Store JSON when relational fits | Normalize into related tables |
| Auto-increment IDs in distributed systems | Use UUID/ULID/cuid |
| Skip `ON DELETE` strategy | Explicitly define for every FK |
| `CASCADE` delete by default | Default to `RESTRICT`; explicitly choose |

---



---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [indexing.md](indexing.md) | Index after schema designed |
| [migrations.md](migrations.md) | Migrate schema changes safely |
| [orm-selection.md](orm-selection.md) | ORM for schema definition |
| [SKILL.md](SKILL.md) | Decision checklist |

---

⚡ PikaKit v3.9.206
