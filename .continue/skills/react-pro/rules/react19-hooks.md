---
title: "React 19 Patterns"
impact: HIGH
impactDescription: "React 19 introduces useActionState and useOptimistic for modern form handling"
tags: react19, useActionState, useOptimistic, forms
---

# React 19 Patterns

> Modern React 19 hooks for form submissions and optimistic UI updates.

---

## useActionState (Form Submissions)

```tsx
import { useActionState } from 'react'

async function createUser(prev: State, formData: FormData) {
  const name = formData.get('name') as string
  const res = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) return { error: 'Failed to create user' }
  return { error: null, success: true }
}

type State = { error: string | null; success?: boolean }

function CreateUserForm() {
  const [state, action, isPending] = useActionState(createUser, { error: null })

  return (
    <form action={action}>
      <input name="name" required disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">User created!</p>}
    </form>
  )
}
```

## useOptimistic (Instant UI Updates)

```tsx
import { useOptimistic } from 'react'

function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (current, newTodo: Todo) => [...current, newTodo]
  )

  async function handleAdd(formData: FormData) {
    const title = formData.get('title') as string
    const tempTodo = { id: crypto.randomUUID(), title, completed: false }

    addOptimistic(tempTodo)  // Instant UI update
    await createTodo(title)  // Server call (may fail → reverts automatically)
  }

  return (
    <div>
      <form action={handleAdd}>
        <input name="title" required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

⚡ PikaKit v3.9.206
