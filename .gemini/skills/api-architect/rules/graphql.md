---
name: graphql
description: GraphQL schema design, resolver patterns, N+1 prevention, security
title: "GraphQL Principles"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: graphql
---

# GraphQL Principles

> Flexible queries for complex, interconnected data.

---

## When to Use

```
✅ Good fit:
├── Complex, interconnected data
├── Multiple frontend platforms
├── Clients need flexible queries
├── Evolving data requirements
└── Reducing over-fetching matters

❌ Poor fit:
├── Simple CRUD operations
├── File upload heavy
├── HTTP caching important
└── Team unfamiliar with GraphQL
```

## Schema Design

```graphql
# Think in graphs, not endpoints
type User {
  id: ID!
  name: String!
  email: String!
  posts(first: Int = 10, after: String): PostConnection!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}

# Relay-style pagination (recommended)
type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PostEdge {
  node: Post!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

## Resolver Pattern

```typescript
const resolvers = {
  Query: {
    user: (_: unknown, { id }: { id: string }, ctx: Context) =>
      ctx.dataSources.users.getById(id),

    users: (_: unknown, args: PaginationArgs, ctx: Context) =>
      ctx.dataSources.users.getConnection(args),
  },

  // Field resolver — handles N+1 via DataLoader
  User: {
    posts: (parent: User, args: PaginationArgs, ctx: Context) =>
      ctx.dataSources.posts.getByAuthor(parent.id, args),
  },
};
```

## N+1 Prevention — DataLoader

```typescript
import DataLoader from 'dataloader';

// Batch function: receives array of IDs, returns array of results
const userLoader = new DataLoader<string, User>(async (ids) => {
  const users = await db.user.findMany({ where: { id: { in: [...ids] } } });
  const map = new Map(users.map(u => [u.id, u]));
  return ids.map(id => map.get(id)!);
});

// In resolver — automatically batched
const resolvers = {
  Post: {
    author: (post: Post) => userLoader.load(post.authorId),
  },
};
```

## Security

| Threat | Mitigation |
|--------|-----------|
| Query depth attack | Set max depth (e.g., 7) |
| Query complexity | Calculate cost per field, set max |
| Batching abuse | Limit batch size |
| Introspection leak | Disable in production |
| Field-level auth | Check permissions per resolver |

```typescript
// Query depth + complexity limits
const server = new ApolloServer({
  validationRules: [
    depthLimit(7),
    costAnalysis({ maximumCost: 1000 }),
  ],
  introspection: process.env.NODE_ENV !== 'production',
});
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Expose database schema directly | Design schema for clients |
| One mega-query resolver | Keep resolvers small + composable |
| Skip DataLoader | Always use DataLoader for relations |
| Allow unlimited query depth | Set max depth (7) + cost limits |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [api-style.md](api-style.md) | REST vs GraphQL vs tRPC decision |
| [security-testing.md](security-testing.md) | GraphQL security testing |
| [SKILL.md](../SKILL.md) | Full decision framework |

---

⚡ PikaKit v3.9.206
