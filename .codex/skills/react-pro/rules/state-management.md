---
title: "Zustand & React Query State Management"
impact: HIGH
impactDescription: "Proper state management prevents prop drilling and ensures data consistency"
tags: zustand, react-query, tanstack, state, global
---

# State Management Patterns

> Zustand for global client state, React Query for server state.

---

## Zustand (Global State)

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
        })
        const { user, token } = await res.json()
        set({ user, token })
      },
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
)

// Usage — auto re-renders on change
function NavBar() {
  const { user, logout } = useAuthStore()
  if (!user) return <LoginButton />
  return <button onClick={logout}>{user.name}</button>
}
```

## React Query (Server State)

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 min cache
  })

  const queryClient = useQueryClient()
  const createUser = useMutation({
    mutationFn: (data: UserCreate) =>
      fetch('/api/users', { method: 'POST', body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {users.map((u: User) => <UserCard key={u.id} user={u} />)}
      <button onClick={() => createUser.mutate({ name: 'New User' })}>
        {createUser.isPending ? 'Creating...' : 'Add User'}
      </button>
    </div>
  )
}
```

---

⚡ PikaKit v3.9.206
