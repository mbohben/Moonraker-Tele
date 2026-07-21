---
name: migrations
description: Safe migration strategy — zero-downtime patterns, Prisma + Drizzle commands, rollback plans
---

# Migration Principles

> Safe migration strategy for zero-downtime schema changes.

---

## Safe Migration Patterns

```
For zero-downtime changes:
│
├── Adding column
│   └── Add as nullable → backfill → add NOT NULL constraint
│
├── Removing column
│   └── Stop reading → deploy → stop writing → deploy → DROP column
│
├── Renaming column
│   └── Add new column → copy data → deploy app → drop old column
│
├── Adding index
│   └── CREATE INDEX CONCURRENTLY (non-blocking)
│
└── Changing column type
    └── Add new column → copy → switch → drop old
```

> **Rule:** Never make breaking changes in one step. Always use multi-phase migrations.

---

## Migration Classification

| Type | Risk | Strategy |
|------|------|----------|
| **Additive** | Low | Add nullable column, add table, add index | 
| **Destructive** | High | Drop column, change type, drop table |
| **Data migration** | Medium | Backfill, transform, merge |

---

## ORM Migration Commands

### Prisma

```bash
# Generate migration (review SQL before applying)
npx prisma migrate dev --name add_user_avatar

# Apply to production (no generation, just apply)
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

### Drizzle

```bash
# Generate migration SQL
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Push schema directly (development only)
npx drizzle-kit push

# View DB in browser
npx drizzle-kit studio
```

---

## Multi-Phase Migration Example

### Adding NOT NULL Column (Safe)

```sql
-- Phase 1: Add nullable column
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- Phase 2: Backfill data
UPDATE users SET avatar_url = 'https://default-avatar.png' WHERE avatar_url IS NULL;

-- Phase 3: Add NOT NULL (after backfill complete)
ALTER TABLE users ALTER COLUMN avatar_url SET NOT NULL;
ALTER TABLE users ALTER COLUMN avatar_url SET DEFAULT 'https://default-avatar.png';
```

### Renaming Column (Safe)

```sql
-- Phase 1: Add new column
ALTER TABLE users ADD COLUMN display_name TEXT;

-- Phase 2: Copy data
UPDATE users SET display_name = full_name;

-- Phase 3: Deploy app reading from display_name
-- Phase 4: Drop old column
ALTER TABLE users DROP COLUMN full_name;
```

---

## Rollback Strategy

| Migration Type | Rollback Method |
|---------------|-----------------|
| Add column | `ALTER TABLE DROP COLUMN` |
| Add index | `DROP INDEX` |
| Add table | `DROP TABLE` |
| Drop column | **Cannot undo** — data lost |
| Change type | Restore from backup |

> **Rule:** Always have a rollback plan. Test rollback in staging before production.

---

## Serverless Database Features

### Neon (Serverless PostgreSQL)

| Feature | Benefit | Migration Impact |
|---------|---------|-----------------|
| Database branching | Test migrations on branch | Safe preview |
| Scale to zero | Cost savings | Cold start on reconnect |
| Point-in-time restore | Recovery | Rollback to any point |

### Turso (Edge SQLite)

| Feature | Benefit | Migration Impact |
|---------|---------|-----------------|
| Edge replication | Low latency globally | Schema changes replicate |
| Embedded replicas | Local reads | Eventual consistency |
| SQLite compatible | Simple migrations | No ALTER TABLE limitations |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Run destructive migration in one step | Use multi-phase migration |
| Skip testing migration on data copy | Test on staging with production-size data |
| Lock tables during migration | Use `CONCURRENTLY` for indexes |
| Run `migrate reset` in production | Only use `migrate deploy` in production |
| Skip rollback plan | Document rollback before applying |

---



---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [schema-design.md](schema-design.md) | Schema before migration |
| [indexing.md](indexing.md) | Index migrations |
| [database-selection.md](database-selection.md) | Serverless DB features |
| [SKILL.md](SKILL.md) | Decision checklist |

---

⚡ PikaKit v3.9.206
