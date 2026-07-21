#!/usr/bin/env node
/**
 * @fileoverview Secret Scanner for PikaKit Knowledge System
 * 
 * Scans knowledge files for accidentally committed secrets (API keys, tokens, etc.)
 * Zero dependencies, pure Node.js.
 *
 * Usage:
 *   node secret-scanner.ts <path>           Scan a file or directory
 *   node secret-scanner.ts --all            Scan entire knowledge/ directory
 *
 * Exit codes:
 *   0 = clean, 1 = violations found, 2 = usage error
 *
 * @version 3.9.206
 * @author PikaKit Knowledge Compiler
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Secret Patterns (12 rules) ─────────────────────────────────────────────

const SECRET_PATTERNS = [
  {
    id: "SEC-01",
    type: "anthropic-key",
    // Anthropic MUST come before OpenAI — sk-ant is a subset of sk-*
    pattern: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/,
    description: "Anthropic API key",
  },
  {
    id: "SEC-02",
    type: "openai-key",
    pattern: /\bsk-(?:proj-)?[A-Za-z0-9][A-Za-z0-9_-]{20,}\b/,
    description: "OpenAI API key",
    // Exclude matches already caught by SEC-01
    exclude: /\bsk-ant-/,
  },
  {
    id: "SEC-03",
    type: "github-token",
    pattern:
      /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{80,})\b/,
    description: "GitHub personal access token",
  },
  {
    id: "SEC-04",
    type: "aws-access-key",
    pattern: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/,
    description: "AWS access key ID",
  },
  {
    id: "SEC-05",
    type: "db-uri-credentials",
    pattern:
      /\b(?:postgres|mysql|mongodb|redis|amqp):\/\/[^:\s/@]+:[^@\s]{4,}@\S+/,
    description: "Database connection URI with credentials",
  },
  {
    id: "SEC-06",
    type: "slack-token",
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
    description: "Slack API token",
  },
  {
    id: "SEC-07",
    type: "stripe-live-key",
    pattern: /\bsk_live_[A-Za-z0-9]{24,}\b/,
    description: "Stripe live secret key",
  },
  {
    id: "SEC-08",
    type: "google-api-key",
    pattern: /\bAIza[0-9A-Za-z_-]{35}\b/,
    description: "Google API key",
  },
  {
    id: "SEC-09",
    type: "vault-token",
    pattern: /\b(?:hvs|hvb|s)\.[A-Za-z0-9._-]{20,}\b/,
    description: "HashiCorp Vault token",
  },
  {
    id: "SEC-10",
    type: "jwt",
    pattern: /\beyJ[A-Za-z0-9_=-]+\.[A-Za-z0-9_=-]+\.[A-Za-z0-9_.+/=-]*\b/,
    description: "JSON Web Token",
  },
  {
    id: "SEC-11",
    type: "pem-private-key",
    pattern: /-----BEGIN (?:RSA |OPENSSH |DSA |EC )?PRIVATE KEY-----/,
    description: "PEM private key block",
  },
  {
    id: "SEC-12",
    type: "bearer-token",
    pattern: /\bbearer\s+[A-Za-z0-9._~+/\-]{20,}\b/i,
    description: "Bearer authentication token",
  },
];

// ─── False Positive Filters ────────────────────────────────────────────────

/**
 * Lines matching these patterns are documentation/examples, not real secrets.
 */
const FALSE_POSITIVE_PATTERNS = [
  /\bYOUR[-_]KEY[-_]HERE\b/i,
  /\bEXAMPLE\b/i,
  /\bREDACTED\b/i,
  /\bPLACEHOLDER\b/i,
  /\bxxx+\b/i,
  // Regex pattern definitions (inside backticks or quotes)
  /`[^`]*sk-ant-\[A-Za-z/,
  /`[^`]*sk-\(?:proj-\)/,
  // Markdown code fence with regex
  /^\s*\|.*Pattern.*\|/,
];

/**
 * Check if a match is likely a false positive (documentation/example).
 * @param {string} line - The full line containing the match
 * @param {string} match - The matched secret string
 * @returns {boolean}
 */
function isFalsePositive(line: string, match: string): boolean {
  // Check line-level false positives
  for (const fp of FALSE_POSITIVE_PATTERNS) {
    if (fp.test(line)) return true;
  }

  // If the match is inside backticks (code/regex definition), skip it
  const backtickIndex = line.indexOf("`");
  if (backtickIndex !== -1) {
    const matchIndex = line.indexOf(match);
    // Count backticks before the match — odd count means inside code span
    const beforeMatch = line.substring(0, matchIndex);
    const backtickCount = (beforeMatch.match(/`/g) || []).length;
    if (backtickCount % 2 === 1) return true;
  }

  return false;
}

// ─── Zero-Width Character Stripping ─────────────────────────────────────────

const ZERO_WIDTH_CHARS = /[\u200B\u200C\u200D\u200E\u200F\uFEFF\u00AD]/g;

/**
 * Strip zero-width characters that could be used to evade detection.
 * @param {string} text
 * @returns {string}
 */
function stripZeroWidth(text: string): string {
  return text.replace(ZERO_WIDTH_CHARS, "");
}

// ─── Core Scanner ───────────────────────────────────────────────────────────

/**
 * Scan text content for secrets.
 * @param {string} content - The text content to scan
 * @param {string} [filename] - Optional filename for reporting
 * @returns {{ found: boolean, violations: Array<{ id: string, type: string, description: string, line: number, snippet: string }> }}
 */
export function scanForSecrets(content: string, filename: string = "<input>") {
  const violations: any[] = [];
  const normalizedContent = stripZeroWidth(content);
  const lines = normalizedContent.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    for (const rule of SECRET_PATTERNS) {
      const match = line.match(rule.pattern);
      if (!match) continue;

      // Check exclusion rule (e.g., SEC-02 excludes sk-ant- matches)
      if (rule.exclude && rule.exclude.test(match[0])) continue;

      // Check false positives
      if (isFalsePositive(line, match[0])) continue;

      violations.push({
        id: rule.id,
        type: rule.type,
        description: rule.description,
        line: lineNum,
        file: filename,
        snippet: redactMatch(line.trim(), match[0]),
      });
    }
  }

  return { found: violations.length > 0, violations };
}

/**
 * Redact the matched secret in the snippet, showing only first 6 and last 4 chars.
 * @param {string} line - The line containing the secret
 * @param {string} match - The matched secret string
 * @returns {string}
 */
function redactMatch(line: string, match: string): string {
  if (match.length <= 12) {
    return line.replace(match, match.substring(0, 4) + "***");
  }
  const redacted =
    match.substring(0, 6) + "***" + match.substring(match.length - 4);
  return line.replace(match, redacted);
}

// ─── File/Directory Scanner ─────────────────────────────────────────────────

/**
 * Scan a single file for secrets.
 * @param {string} filePath
 * @returns {{ found: boolean, violations: Array }}
 */
function scanFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return scanForSecrets(content, filePath);
  } catch (err: any) {
    console.error(`  ⚠ Could not read: ${filePath} (${err.message})`);
    return { found: false, violations: [] };
  }
}

/**
 * Recursively scan a directory for secrets in .md files.
 * @param {string} dirPath
 * @returns {{ filesChecked: number, violations: Array }}
 */
function scanDirectory(dirPath: string) {
  let filesChecked = 0;
  const allViolations: any[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);

      if (stat.isDirectory()) {
        // Skip node_modules, .git, etc.
        if (entry.startsWith(".") || entry === "node_modules") continue;
        walk(full);
      } else if (entry.endsWith(".md")) {
        filesChecked++;
        const result = scanFile(full);
        allViolations.push(...result.violations);
      }
    }
  }

  walk(dirPath);
  return { filesChecked, violations: allViolations };
}

// ─── CLI Entry Point ────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: node secret-scanner.ts <path|--all>");
    console.log("  <path>   Scan a file or directory");
    console.log("  --all    Scan entire .agent/knowledge/ directory");
    process.exit(2);
  }

  let targetPath;

  if (args[0] === "--all") {
    // Find knowledge directory relative to this script
    targetPath = path.resolve(__dirname, "..", "..", "..", "knowledge");
  } else {
    targetPath = path.resolve(args[0]);
  }

  if (!fs.existsSync(targetPath)) {
    console.error(`Error: Path not found: ${targetPath}`);
    process.exit(2);
  }

  const stat = fs.statSync(targetPath);
  let result;

  console.log(`🔒 Secret Scanner — PikaKit Knowledge System`);
  console.log(`   Scanning: ${targetPath}\n`);

  if (stat.isDirectory()) {
    result = scanDirectory(targetPath);
    console.log(
      `   Files checked: ${result.filesChecked}`,
    );
  } else {
    const fileResult = scanFile(targetPath);
    result = { filesChecked: 1, violations: fileResult.violations };
    console.log(`   Files checked: 1`);
  }

  if (result.violations.length === 0) {
    console.log(`   Status: ✅ Clean — no secrets detected\n`);
    process.exit(0);
  } else {
    console.log(
      `   Status: ❌ ${result.violations.length} violation(s) found\n`,
    );
    for (const v of result.violations) {
      console.log(`   ${v.id} [${v.type}] ${v.file}:${v.line}`);
      console.log(`      ${v.description}`);
      console.log(`      → ${v.snippet}\n`);
    }
    process.exit(1);
  }
}

// Run CLI if executed directly
const isMain =
  process.argv[1] &&
  (process.argv[1] === fileURLToPath(import.meta.url) ||
    process.argv[1].endsWith("secret-scanner.ts"));

if (isMain) {
  main();
}
