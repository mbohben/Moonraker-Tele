---
name: database-selection
description: Database selection decision tree — PostgreSQL, Neon, Turso, SQLite with context-based routing
---

# Database Selection (2025)

> Choose database based on context, not default. Never assume PostgreSQL.

---

## Decision Tree

```
What are your requirements?
│
├── Full relational features needed
│   ├── Self-hosted / VPS → PostgreSQL
│   └── Serverless → Neon (branching, scale-to-zero)
│
├── Edge deployment / Ultra-low latency
│   └── Turso (edge SQLite, global replication)
│
├── AI / Vector search
│   └── PostgreSQL + pgvector (HNSW index)
│
├── Simple / Embedded / Local / Prototype
│   └── SQLite (zero config, single file)
│
└── Global distribution + MySQL
    └── PlanetScale (Vitess-backed)
```

---

## Comparison Matrix

| Database | Best For | Hosting | Latency | Cost (Start) | Trade-offs |
|----------|----------|---------|---------|--------------|------------|
| **PostgreSQL** | Full features, complex queries | Self-managed | 5–20 ms | Free (self) | Needs hosting, ops |
| **Neon** | Serverless PG, branching | Managed | 10–30 ms | Free tier | Cold start on scale-to-zero |
| **Turso** | Edge, low latency | Edge | 1–5 ms | Free tier | SQLite limitations (no stored procs) |
| **SQLite** | Simple, embedded, local | None | < 1 ms | Free | Single-writer, no network access |
| **PlanetScale** | MySQL, global scale | Managed | 10–50 ms | Free tier | No foreign keys (app-level) |
| **Supabase** | PG + Auth + Storage | Managed | 10–30 ms | Free tier | Vendor lock-in risk |

---

## Selection by Project Type

| Project Type | Recommended | Why |
|-------------|-------------|-----|
| SaaS web app | Neon or PostgreSQL | Full relational, serverless scaling |
| Mobile app backend | Neon or Supabase | Auth integration, REST/GraphQL |
| Edge-first app | Turso | Global replication, < 5ms reads |
| CLI tool / Desktop | SQLite | Zero config, embedded |
| AI/ML app | PostgreSQL + pgvector | Vector similarity search |
| Prototype / MVP | SQLite or Neon | Fast setup, free |

---

## Connection Patterns

```typescript
// PostgreSQL (node-postgres)
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Neon (serverless driver)
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const users = await sql`SELECT * FROM users WHERE id = ${userId}`;

// Turso (libsql)
import { createClient } from '@libsql/client';
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// SQLite (better-sqlite3)
import Database from 'better-sqlite3';
const db = new Database('app.db');
```

---

## Questions to Ask User

1. What's the deployment environment? (serverless / VPS / edge)
2. How complex are the queries? (simple CRUD / joins / analytics)
3. Is edge/low-latency critical?
4. Vector search needed?
5. Budget constraints?
6. Team's database experience?

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to PostgreSQL for a prototype | Use SQLite for simple apps |
| Use SQLite for multi-user web app | Use PostgreSQL/Neon for concurrent access |
| Ignore cold start on serverless DB | Design for connection pooling |
| Choose DB by popularity | Choose by deployment context + query patterns |

---



---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [orm-selection.md](orm-selection.md) | ORM for chosen database |
| [schema-design.md](schema-design.md) | Schema after DB selected |
| [SKILL.md](SKILL.md) | Decision checklist |

---

⚡ PikaKit v3.9.206
