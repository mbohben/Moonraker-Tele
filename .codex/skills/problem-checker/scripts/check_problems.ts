#!/usr/bin/env node
// @ts-nocheck
/**
 * Problem Checker — Automated IDE Error Detection & Auto-Fix
 * Version: 2.0.0
 *
 * Runs TypeScript check, parses errors, applies auto-fixes (4 patterns),
 * then re-checks in a loop (max 3 cycles).
 *
 * Usage:
 *   node check_problems.js [directory]
 *   node check_problems.js --fix [directory]
 *   node check_problems.js --fix --json [directory]
 *   node check_problems.js --help
 *
 * Exit codes:
 *   0 - No errors (CLEAN)
 *   1 - Errors remain (BLOCKED)
 *   2 - Script error
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const VERSION = '2.0.0'
const MAX_CYCLES = 3

// --- CLI ---
const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Problem Checker v${VERSION}

Usage:
  node check_problems.js [directory]             Check for TypeScript errors
  node check_problems.js --fix [directory]       Check + auto-fix (max ${MAX_CYCLES} cycles)
  node check_problems.js --fix --json [dir]      Auto-fix with JSON output
  node check_problems.js --help                  Show this help

Options:
  --fix           Enable auto-fix (4 patterns)
  --json          Output results as JSON (for agent consumption)
  --help, -h      Show this help

Auto-Fix Patterns (4):
  1. Missing import    — "Cannot find name 'X'"     → Add import statement
  2. JSX namespace     — "Cannot find namespace"    → Import ReactNode
  3. Unused variable   — "'x' declared but unused"  → Prefix with _
  4. CSS @import order — "@import must precede"      → Move @import to top

Exit Codes:
  0  CLEAN    — No errors
  1  BLOCKED  — Errors remain after fix attempts
  2  ERROR    — Script error
`)
    process.exit(0)
}

const shouldFix = args.includes('--fix')
const jsonOutput = args.includes('--json')
const directory = path.resolve(args.find(a => !a.startsWith('--')) || process.cwd())

// ANSI colors (disabled in JSON mode)
const c = jsonOutput ? { reset: '', red: '', green: '', yellow: '', blue: '', cyan: '', gray: '' } : {
    reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m',
    yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m', gray: '\x1b[90m',
}

function log(msg) { if (!jsonOutput) console.log(msg) }

// --- TypeScript Check ---
async function runTypeCheck() {
    const tsconfigPath = path.join(directory, 'tsconfig.json')
    if (!fs.existsSync(tsconfigPath)) {
        return { errors: [], warnings: [], skipped: true }
    }

    try {
        await execFileAsync('npx', ['tsc', '--noEmit'], {
            cwd: directory,
            timeout: 60_000,
            shell: true,
        })
        return { errors: [], warnings: [], skipped: false }
    } catch (error) {
        const output = error.stdout || error.stderr || error.message || ''
        return { ...parseTypeScriptOutput(output), skipped: false }
    }
}

function parseTypeScriptOutput(output) {
    const errors = []
    const warnings = []
    const lines = output.split('\n')
    // Match: file.tsx(10,5): error TS2304: Cannot find name 'X'
    const pattern = /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s+(.+)$/

    for (const line of lines) {
        const match = line.match(pattern)
        if (!match) continue

        const [, file, lineNum, col, severity, code, message] = match
        const problem = {
            file: path.resolve(directory, file),
            line: parseInt(lineNum),
            column: parseInt(col),
            severity: severity === 'error' ? 'error' : 'warning',
            code,
            message: message.trim(),
        }

        if (severity === 'error') errors.push(problem)
        else warnings.push(problem)
    }

    return { errors, warnings }
}

// --- Auto-Fix Engine (4 patterns from SKILL.md) ---
function autoFix(problems) {
    const fixed = []
    const unfixed = []

    // Group problems by file for efficient processing
    const byFile = new Map()
    for (const p of problems) {
        const list = byFile.get(p.file) || []
        list.push(p)
        byFile.set(p.file, list)
    }

    for (const [file, fileProblems] of byFile) {
        if (!fs.existsSync(file)) {
            unfixed.push(...fileProblems)
            continue
        }

        let content = fs.readFileSync(file, 'utf8')
        let modified = false

        for (const problem of fileProblems) {
            const result = tryFix(content, problem, file)
            if (result) {
                content = result.content
                modified = true
                fixed.push({ ...problem, fix: result.description })
            } else {
                unfixed.push(problem)
            }
        }

        if (modified) {
            fs.writeFileSync(file, content, 'utf8')
        }
    }

    return { fixed, unfixed }
}

function tryFix(content, problem, filePath) {
    const { message } = problem
    const ext = path.extname(filePath)

    // Pattern 1: Missing import — "Cannot find name 'X'"
    if (message.match(/Cannot find name '(\w+)'/)) {
        const name = message.match(/Cannot find name '(\w+)'/)[1]
        // Common React imports
        const reactImports = ['useState', 'useEffect', 'useRef', 'useCallback', 'useMemo', 'useContext', 'useReducer', 'createContext', 'forwardRef', 'memo', 'lazy', 'Suspense', 'Fragment']
        if (reactImports.includes(name)) {
            const importRegex = /import\s*{([^}]+)}\s*from\s*['"]react['"]/
            const match = content.match(importRegex)
            if (match && !match[1].includes(name)) {
                const newContent = content.replace(importRegex, (m, imports) => `import { ${imports.trim()}, ${name} } from 'react'`)
                return { content: newContent, description: `Added '${name}' to React import` }
            } else if (!match) {
                return { content: `import { ${name} } from 'react';\n${content}`, description: `Added React import for '${name}'` }
            }
        }
        // Common Next.js imports
        const nextImports = { useRouter: 'next/navigation', usePathname: 'next/navigation', useSearchParams: 'next/navigation', Image: 'next/image', Link: 'next/link' }
        if (nextImports[name] && !content.includes(`import.*${name}`)) {
            return { content: `import { ${name} } from '${nextImports[name]}';\n${content}`, description: `Added import for '${name}' from '${nextImports[name]}'` }
        }
    }

    // Pattern 2: JSX namespace — "Cannot find namespace 'JSX'"
    if (message.includes("Cannot find namespace 'JSX'")) {
        if (!content.includes('ReactNode') && !content.includes('import React')) {
            const importRegex = /import\s*{([^}]+)}\s*from\s*['"]react['"]/
            const match = content.match(importRegex)
            if (match && !match[1].includes('ReactNode')) {
                let newContent = content.replace(importRegex, (m, imports) => `import { ${imports.trim()}, ReactNode } from 'react'`)
                newContent = newContent.replace(/JSX\.Element/g, 'ReactNode')
                return { content: newContent, description: "Added ReactNode import, replaced JSX.Element" }
            } else if (!match) {
                let newContent = `import { ReactNode } from 'react';\n${content}`
                newContent = newContent.replace(/JSX\.Element/g, 'ReactNode')
                return { content: newContent, description: "Added ReactNode import, replaced JSX.Element" }
            }
        }
    }

    // Pattern 3: Unused variable — "'x' is declared but never used"
    if (message.includes("is declared but") && message.includes("never used")) {
        const varMatch = message.match(/'([^']+)'/)
        if (varMatch) {
            const varName = varMatch[1]
            if (!varName.startsWith('_')) {
                // Prefix with underscore (preserves all references)
                const regex = new RegExp(`\\b(const|let|var|function)\\s+${escapeRegex(varName)}\\b`)
                if (content.match(regex)) {
                    const newContent = content.replace(regex, `$1 _${varName}`)
                    return { content: newContent, description: `Prefixed unused '${varName}' → '_${varName}'` }
                }
            }
        }
    }

    // Pattern 4: CSS @import order — "@import must precede all other rules"
    if (message.includes('@import') && message.includes('precede') && (ext === '.css' || ext === '.scss')) {
        const lines = content.split('\n')
        const importLines = []
        const otherLines = []

        for (const line of lines) {
            if (line.trim().startsWith('@import ')) {
                importLines.push(line)
            } else {
                otherLines.push(line)
            }
        }

        if (importLines.length > 0) {
            const newContent = [...importLines, '', ...otherLines].join('\n')
            return { content: newContent, description: `Moved ${importLines.length} @import(s) to top of file` }
        }
    }

    return null
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// --- Print Helpers ---
function printProblems(problems, type) {
    const icon = type === 'error' ? '❌' : '⚠️'
    const color = type === 'error' ? c.red : c.yellow

    for (const p of problems) {
        const relativePath = path.relative(directory, p.file)
        log(`${color}${icon} ${relativePath}:${p.line}:${p.column}${c.reset}`)
        log(`   ${c.gray}${p.code}: ${p.message}${c.reset}`)
    }
}

// --- Main: Max 3 Cycle Loop ---
async function main() {
    log(`${c.cyan}╔════════════════════════════════════════╗${c.reset}`)
    log(`${c.cyan}║${c.reset}  🔍 Problem Checker v${VERSION}              ${c.cyan}║${c.reset}`)
    log(`${c.cyan}╚════════════════════════════════════════╝${c.reset}`)
    log(`${c.gray}Directory: ${directory}${c.reset}\n`)

    const result = {
        version: VERSION,
        directory,
        cycles: 0,
        status: 'CLEAN',
        totalFixed: 0,
        errors: [],
        warnings: [],
        fixes: [],
        unfixed: [],
    }

    // Initial check
    const initial = await runTypeCheck()

    if (initial.skipped) {
        log(`${c.yellow}⚠️  No tsconfig.json found. Skipping TypeScript check.${c.reset}`)
        result.status = 'SKIPPED'
        outputResult(result)
        process.exit(0)
    }

    if (initial.errors.length === 0 && initial.warnings.length === 0) {
        log(`${c.green}✅ No TypeScript errors found!${c.reset}`)
        result.status = 'CLEAN'
        outputResult(result)
        process.exit(0)
    }

    log(`${c.red}Found ${initial.errors.length} error(s), ${initial.warnings.length} warning(s)${c.reset}\n`)
    printProblems(initial.errors, 'error')
    if (initial.warnings.length > 0) printProblems(initial.warnings, 'warning')

    if (!shouldFix) {
        result.status = 'BLOCKED'
        result.errors = initial.errors
        result.warnings = initial.warnings
        outputResult(result)
        process.exit(1)
    }

    // Fix-Verify Loop (max 3 cycles)
    let currentErrors = initial.errors
    let currentWarnings = initial.warnings

    for (let cycle = 1; cycle <= MAX_CYCLES; cycle++) {
        result.cycles = cycle
        log(`\n${c.blue}── Cycle ${cycle}/${MAX_CYCLES}: Applying auto-fixes ──${c.reset}\n`)

        const allProblems = [...currentErrors, ...currentWarnings]
        const { fixed, unfixed } = autoFix(allProblems)

        if (fixed.length > 0) {
            log(`${c.green}✅ Fixed ${fixed.length} issue(s):${c.reset}`)
            for (const f of fixed) {
                const rel = path.relative(directory, f.file)
                log(`   ${c.green}✓${c.reset} ${rel}:${f.line} — ${f.fix}`)
            }
            result.fixes.push(...fixed)
            result.totalFixed += fixed.length
        }

        if (fixed.length === 0) {
            log(`${c.yellow}No auto-fixable issues found. Escalating.${c.reset}`)
            result.unfixed = unfixed
            break
        }

        // Re-check
        log(`\n${c.blue}Re-checking after cycle ${cycle}...${c.reset}\n`)
        const recheck = await runTypeCheck()

        if (recheck.errors.length === 0 && recheck.warnings.length === 0) {
            log(`${c.green}✅ All errors resolved after ${cycle} cycle(s)!${c.reset}`)
            result.status = 'CLEAN'
            result.errors = []
            result.warnings = []
            outputResult(result)
            process.exit(0)
        }

        // Check for regressions (new errors introduced by fix)
        const newErrors = recheck.errors.filter(e =>
            !currentErrors.some(ce => ce.file === e.file && ce.line === e.line && ce.code === e.code)
        )
        if (newErrors.length > 0) {
            log(`${c.red}⚠️  Fix regression detected: ${newErrors.length} new error(s) introduced${c.reset}`)
            printProblems(newErrors, 'error')
        }

        currentErrors = recheck.errors
        currentWarnings = recheck.warnings

        if (cycle < MAX_CYCLES) {
            log(`${c.yellow}${currentErrors.length} error(s) remain. Retrying...${c.reset}`)
        }
    }

    // Exhausted all cycles
    log(`\n${c.red}❌ ${currentErrors.length} error(s) remain after ${result.cycles} cycle(s). BLOCKED.${c.reset}`)
    printProblems(currentErrors, 'error')

    result.status = 'BLOCKED'
    result.errors = currentErrors
    result.warnings = currentWarnings
    outputResult(result)
    process.exit(1)
}

function outputResult(result) {
    if (jsonOutput) {
        console.log(JSON.stringify(result, null, 2))
    }
}

// --- Run ---
main().catch(err => {
    if (jsonOutput) {
        console.log(JSON.stringify({ error: err.message, status: 'ERROR' }))
    } else {
        console.error(`${c.red}Script error: ${err.message}${c.reset}`)
    }
    process.exit(2)
})
