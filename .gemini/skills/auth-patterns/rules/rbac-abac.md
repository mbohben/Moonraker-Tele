---
name: rbac-abac
description: Role-Based and Attribute-Based access control — Prisma schema, middleware, ABAC policy engine
title: "RBAC & ABAC - Access Control"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: rbac, abac
---

# RBAC & ABAC — Access Control

> Role-Based and Attribute-Based authorization patterns.

---

## Model Selection

```
How complex are your permissions?
├── Simple (admin/user/viewer)
│   └── RBAC (Role-Based)
├── Medium (roles + resource ownership)
│   └── RBAC + ownership checks
├── Complex (context-dependent rules)
│   └── ABAC (Attribute-Based)
└── Enterprise (multi-tenant + compliance)
    └── ABAC or hybrid RBAC+ABAC
```

---

## RBAC (Role-Based Access Control)

### Schema Design

```typescript
// Database models
interface User {
  id: string;
  roles: Role[];         // Many-to-many
}

interface Role {
  id: string;
  name: string;          // "admin", "editor", "viewer"
  permissions: Permission[];  // Many-to-many
}

interface Permission {
  id: string;
  resource: string;      // "posts", "users", "billing"
  action: string;        // "create", "read", "update", "delete"
}
```

### Prisma Schema

```prisma
model User {
  id    String     @id @default(cuid())
  roles UserRole[]
}

model Role {
  id          String           @id @default(cuid())
  name        String           @unique
  permissions RolePermission[]
  users       UserRole[]
}

model Permission {
  id       String           @id @default(cuid())
  resource String
  action   String
  roles    RolePermission[]
  @@unique([resource, action])
}

model UserRole {
  userId String
  roleId String
  user   User @relation(fields: [userId], references: [id])
  role   Role @relation(fields: [roleId], references: [id])
  @@id([userId, roleId])
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])
  @@id([roleId, permissionId])
}
```

### Permission Check (Middleware)

```typescript
function requirePermission(resource: string, action: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const hasPermission = user.roles.some(role =>
      role.permissions.some(p =>
        p.resource === resource && p.action === action
      )
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage
app.delete('/api/posts/:id', requirePermission('posts', 'delete'), deletePost);
```

---

## ABAC (Attribute-Based Access Control)

### When to Use

| Scenario | Example |
|----------|---------|
| Context-dependent | "Editors can only edit posts they authored" |
| Time-based | "Access only during business hours" |
| Location-based | "Only from corporate network" |
| Multi-tenant | "Users can only see their organization's data" |

### Policy Pattern

```typescript
interface PolicyContext {
  subject: { id: string; role: string; orgId: string; };
  resource: { type: string; ownerId: string; orgId: string; };
  action: string;
  environment: { time: Date; ip: string; };
}

function evaluatePolicy(ctx: PolicyContext): boolean {
  const policies: Policy[] = [
    // Owners can do anything to their resources
    {
      effect: 'allow',
      condition: (c) => c.subject.id === c.resource.ownerId,
    },
    // Admins can do anything in their org
    {
      effect: 'allow',
      condition: (c) =>
        c.subject.role === 'admin' &&
        c.subject.orgId === c.resource.orgId,
    },
    // Editors can read/update (not delete) in their org
    {
      effect: 'allow',
      condition: (c) =>
        c.subject.role === 'editor' &&
        c.subject.orgId === c.resource.orgId &&
        ['read', 'update'].includes(c.action),
    },
  ];

  // Default deny — allow only if at least one policy matches
  return policies.some(p => p.effect === 'allow' && p.condition(ctx));
}
```

---

## Libraries & Services

| Solution | Type | Best For |
|----------|------|----------|
| CASL | Library (JS) | Frontend + backend RBAC/ABAC |
| Casbin | Library (multi-lang) | Policy engine |
| Oso | Library | Application-embedded authz |
| Auth0 FGA | Service | Fine-grained authorization |
| Permit.io | Service | Managed RBAC/ABAC |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|------|
| Hardcode roles in if/else | Use permission table |
| Check role name in code | Check permission (resource + action) |
| Forget resource ownership | Always check `ownerId` |
| Skip multi-tenant isolation | Always scope queries by `orgId` |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [jwt-deep.md](jwt-deep.md) | Role/permission claims in JWT |
| [session.md](session.md) | Session-based permission checks |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

⚡ PikaKit v3.9.206
