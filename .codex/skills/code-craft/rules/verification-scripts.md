---
name: verification-scripts
description: Agent-to-script mapping for running validation scripts — output protocol, rules
title: "Verification Scripts Reference"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: verification, scripts
---

# Verification Scripts Reference

> Script mapping by agent role.

---

## Agent → Script Mapping

| Agent                     | Script          | Command                                                                     |
| ------------------------- | --------------- | --------------------------------------------------------------------------- |
| **frontend-specialist**   | UX Audit        | `node .agent/skills/design-system/scripts/ux_audit.ts .`                    |
| **frontend-specialist**   | A11y Check      | `node .agent/skills/design-system/scripts/accessibility_checker.ts .`       |
| **backend-specialist**    | API Validator   | `node .agent/skills/api-architect/scripts/api_validator.ts .`               |
| **mobile-developer**      | Mobile Audit    | `node .agent/skills/mobile-design/scripts/mobile_audit.ts .`               |
| **database-architect**    | Schema Validate | `node .agent/skills/data-modeler/scripts/schema_validator.ts .`            |
| **security-auditor**      | Security Scan   | `node .agent/skills/security-scanner/scripts/security_scan.ts .`           |
| **seo-specialist**        | SEO Check       | `node .agent/skills/seo-optimizer/scripts/seo_checker.ts .`                |
| **seo-specialist**        | GEO Check       | `node .agent/skills/seo-optimizer/scripts/geo_checker.ts .`                |
| **performance-optimizer** | Lighthouse      | `node .agent/skills/perf-optimizer/scripts/lighthouse_audit.ts <url>`      |
| **test-engineer**         | Test Runner     | `node .agent/skills/test-architect/scripts/test_runner.ts .`               |
| **test-engineer**         | Playwright      | `node .agent/skills/e2e-automation/scripts/playwright_runner.ts <url>`     |
| **Any agent**             | Lint Check      | `node .agent/skills/code-review/scripts/lint_runner.ts .`                  |
| **Any agent**             | Problem Check   | `node .agent/skills/problem-checker/scripts/check_problems.ts .`           |

---

## Script Output Handling

### Protocol: READ → SUMMARIZE → ASK

1. **Run** script, capture ALL output
2. **Parse** — identify errors, warnings, passes
3. **Summarize** to user:

```markdown
## Script Results: [script_name.js]

### ❌ Errors Found (X items)
- [File:Line] Error description

### ⚠️ Warnings (Y items)
- [File:Line] Warning description

### ✅ Passed (Z items)
- Check passed

**Should I fix the X errors?**
```

4. **Wait** for user confirmation
5. **Re-run** after fixing to confirm

---

## Rules

| ❌ VIOLATION | ✅ CORRECT |
|-------------|-----------|
| Running script, ignoring output | Read + summarize output |
| Auto-fixing without asking | Ask before fixing |
| Wrong agent running wrong script | Each agent runs own scripts |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [engineering-spec.md](engineering-spec.md) | Full contracts and architecture |
| [SKILL.md](../SKILL.md) | Core principles and function rules |

---

⚡ PikaKit v3.9.206
