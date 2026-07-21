---
name: aria-snapshot
description: YAML accessibility tree format with ref handles for element interaction
title: "ARIA Snapshot Format"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: aria, snapshot
---

# ARIA Snapshot Format

> YAML accessibility tree with refs for interaction.

---

## Format

```yaml
- banner:
  - link "Hacker News" [ref=e1]
    /url: https://news.ycombinator.com
  - navigation:
    - link "new" [ref=e2]
    - link "past" [ref=e3]
- main:
  - list:
    - listitem:
      - link "Show HN: My project" [ref=e8]
      - text: "128 points by user 3 hours ago"
- contentinfo:
  - link "Guidelines" [ref=e20]
```

---

## Notation

| Notation | Meaning |
|----------|---------|
| `[ref=eN]` | Stable ID for interaction |
| `[checked]` | Checkbox/radio selected |
| `[disabled]` | Element inactive |
| `[expanded]` | Accordion/dropdown open |
| `/url:` | Link destination |
| `/placeholder:` | Input placeholder |
| `[level=N]` | Heading level |

---

## Roles

| Role | Element |
|------|---------|
| `banner` | Header |
| `navigation` | Nav menu |
| `main` | Main content |
| `contentinfo` | Footer |
| `link` | Anchor |
| `button` | Button |
| `textbox` | Input |
| `checkbox` | Checkbox |
| `listitem` | List item |
| `heading` | H1-H6 |

---

## Interact by Ref

```bash
# Click
node select-ref.ts --ref e1 --action click

# Fill
node select-ref.ts --ref e5 --action fill --value "text"

# Get text
node select-ref.ts --ref e8 --action text

# Screenshot
node select-ref.ts --ref e1 --action screenshot --output ./element.png
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [scripts-guide.md](scripts-guide.md) | All script options and examples |
| [engineering-spec.md](engineering-spec.md) | Full contracts and architecture |
| [SKILL.md](../SKILL.md) | Quick reference and error taxonomy |

---

⚡ PikaKit v3.9.206
