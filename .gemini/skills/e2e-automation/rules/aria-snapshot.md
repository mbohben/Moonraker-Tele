---
title: ARIA Snapshot Pattern
impact: MEDIUM
tags: e2e-automation
---

# ARIA Snapshot Pattern

> Element Discovery via Accessibility Tree instead of CSS Selectors.

---

## Why Use ARIA Snapshot?

| CSS Selectors | ARIA Snapshot |
|---------------|---------------|
| Easily breaks when markup changes | Resilient based on semantics |
| Depends on class names | Based on accessibility roles |
| AI has a hard time inferring correct selector | AI can read page structure |

---

## ARIA Snapshot Format

```yaml
- banner:
  - link "Hacker News" [ref=e1]
- main:
  - list:
    - listitem:
      - link "Show HN: Project" [ref=e8]
      - text "123 points"
- footer:
  - link "Guidelines" [ref=e12]
```

**Key features:**
- `[ref=e1]` - ID to interact with
- Semantic roles: `banner`, `main`, `footer`
- Nested structure easy to read

---

## Interact By Ref

```bash
# Get ARIA snapshot first
node aria-snapshot.ts --url https://example.com

# Then interact by ref
node select-ref.ts --ref e5 --action click
node select-ref.ts --ref e10 --action fill --value "text"
node select-ref.ts --ref e3 --action hover
```

---

## Supported Actions

| Action | Description |
|--------|-------------|
| click | Click element |
| fill | Type text into input |
| hover | Hover over element |
| select | Select dropdown option |
| check | Check checkbox |
| press | Press keyboard key |

---

## Sample ARIA Snapshot Script

```javascript
// aria-snapshot.ts
import { chromium } from 'playwright';

async function getAriaSnapshot(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  
  // Get accessibility tree
  const snapshot = await page.accessibility.snapshot();
  
  let refId = 1;
  const formatNode = (node, indent = 0) => {
    const spaces = '  '.repeat(indent);
    let result = '';
    
    if (node.role !== 'none' && node.role !== 'generic') {
      const ref = node.focused || node.name ? ` [ref=e${refId++}]` : '';
      const name = node.name ? ` "${node.name}"` : '';
      result += `${spaces}- ${node.role}${name}${ref}\n`;
    }
    
    if (node.children) {
      for (const child of node.children) {
        result += formatNode(child, indent + 1);
      }
    }
    return result;
  };
  
  console.log(formatNode(snapshot));
  await browser.close();
}

getAriaSnapshot(process.argv[2] || 'https://example.com');
```

---

## Select By Ref Script

```javascript
// select-ref.ts
import { chromium } from 'playwright';

async function selectByRef(url, ref, action, value) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  
  // Build ref selector (simplified)
  const snapshot = await page.accessibility.snapshot();
  const element = findByRef(snapshot, ref);
  
  if (!element) {
    console.error(`Ref ${ref} not found`);
    process.exit(1);
  }
  
  // Get locator by role + name
  const locator = page.getByRole(element.role, { name: element.name });
  
  switch (action) {
    case 'click':
      await locator.click();
      break;
    case 'fill':
      await locator.fill(value);
      break;
    case 'hover':
      await locator.hover();
      break;
    default:
      console.error(`Unknown action: ${action}`);
  }
  
  await browser.close();
}
```

---

## Best Practices

1. **Always get fresh snapshot** before interacting
2. **Use semantic roles** not class-based selectors
3. **Ref IDs are session-specific** - don't hardcode
4. **Prefer getByRole()** over CSS selectors

---

## Integration with Playwright

```typescript
// In your test
test('user can submit form', async ({ page }) => {
  // Prefer role-based selectors
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Over CSS selectors
  // await page.locator('#email').fill('test@example.com');
});
```

---

> **Rule:** ARIA Snapshot + Role Selectors = AI-friendly, resilient tests.

---

⚡ PikaKit v3.9.206
