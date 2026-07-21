---
name: data-fetching
description: TanStack Query patterns — useSuspenseQuery, mutations, query keys, API service layer
title: "Data Fetching with TanStack Query"
impact: HIGH
impactDescription: "Important architectural or correctness impact"
tags: data, fetching
---

# Data Fetching with TanStack Query

> Use `useSuspenseQuery` - data is guaranteed, no null checks.

---

## Primary Pattern: useSuspenseQuery

```typescript
import { useSuspenseQuery } from '@tanstack/react-query';

// Inside component
const { data } = useSuspenseQuery({
  queryKey: ['posts', { status: 'published' }],
  queryFn: () => postsApi.getPosts({ status: 'published' }),
});

// data is GUARANTEED defined (no null checks needed)
```

---

## Query Key Patterns

```typescript
// Simple key
queryKey: ['posts']

// With parameters
queryKey: ['posts', { status, page }]

// Nested resource
queryKey: ['posts', postId, 'comments']

// User-specific
queryKey: ['user', userId, 'settings']
```

---

## Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const createPost = useMutation({
  mutationFn: (data: CreatePostData) => postsApi.create(data),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    showSnackbar('Post created!', 'success');
  },
  onError: (error) => {
    showSnackbar(error.message, 'error');
  },
});

// Usage
createPost.mutate({ title: 'New Post', content: '...' });
```

---

## API Service Layer

```typescript
// src/features/posts/api/postsApi.ts
import { apiClient } from '@/lib/apiClient';
import type { Post, CreatePostData } from '../types';

export const postsApi = {
  getAll: async (): Promise<Post[]> => {
    const { data } = await apiClient.get('/posts');
    return data;
  },

  getById: async (id: number): Promise<Post> => {
    const { data } = await apiClient.get(`/posts/${id}`);
    return data;
  },

  create: async (payload: CreatePostData): Promise<Post> => {
    const { data } = await apiClient.post('/posts', payload);
    return data;
  },

  update: async (id: number, payload: Partial<Post>): Promise<Post> => {
    const { data } = await apiClient.patch(`/posts/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },
};
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `const { data, isLoading }` + early return | `useSuspenseQuery` + Suspense |
| Inline fetch in component | API service layer |
| `useEffect` + `fetch` | `useSuspenseQuery` |
| Manual loading states | Suspense boundaries |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [component-patterns.md](component-patterns.md) | Component structure using useSuspenseQuery |
| [performance.md](performance.md) | Lazy loading and memoization |
| [file-organization.md](file-organization.md) | Where to place api/ services |
| [../SKILL.md](../SKILL.md) | No early returns rule |

---

⚡ PikaKit v3.9.206
