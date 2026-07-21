---
title: "React Testing Patterns"
impact: MEDIUM
impactDescription: "Proper testing ensures component correctness and prevents regressions"
tags: testing, react-testing-library, userEvent, AAA
---

# React Testing Patterns

> AAA pattern (Arrange-Act-Assert) with React Testing Library and userEvent.

---

## Component Testing

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('creates user on form submit', async () => {
  const user = userEvent.setup()
  render(<CreateUserForm />)

  await user.type(screen.getByRole('textbox', { name: /name/i }), 'John')
  await user.click(screen.getByRole('button', { name: /create/i }))

  expect(await screen.findByText(/user created/i)).toBeInTheDocument()
})

test('shows error on failed submission', async () => {
  server.use(http.post('/api/users', () => HttpResponse.json({}, { status: 500 })))
  const user = userEvent.setup()
  render(<CreateUserForm />)

  await user.type(screen.getByRole('textbox', { name: /name/i }), 'John')
  await user.click(screen.getByRole('button', { name: /create/i }))

  expect(await screen.findByText(/failed/i)).toBeInTheDocument()
})
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `useEffect` for data fetching | React Query / use() / Server Components |
| Index as key in dynamic lists | Stable unique ID |
| Prop drill > 3 levels | Compound components or Zustand |

---

⚡ PikaKit v3.9.206
