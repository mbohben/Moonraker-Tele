// @ts-nocheck
/**
 * Design System Generator - Studio Scripts
 * ==========================================
 * JavaScript port of design_system.py
 * Aggregates search results and applies reasoning to generate design systems
 * 
 * Due to file size (~1300 LOC), this file is organized into clear sections:
 * 1. Configuration & Setup
 * 2. DesignSystemGenerator Class
 * 3. Output Formatters (ASCII & Markdown)
 * 4. Main Entry Point
 * 5. Persistence Functions
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { search, DATA_DIR } from './core.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============ CONFIGURATION ============
const REASONING_FILE = 'ui-reasoning.csv';

const SEARCH_CONFIG = {
    product: { max_results: 1 },
    style: { max_results: 3 },
    color: { max_results: 2 },
    landing: { max_results: 2 },
    typography: { max_results: 2 }
};

// ============ DESIGN SYSTEM GENERATOR ============

/**
 * Generates design system recommendations from aggregated searches
 */
export class DesignSystemGenerator {
    constructor() {
        this.reasoningData = null;
    }

    /**
     * Load reasoning rules from CSV
     */
    async _loadReasoning() {
        if (this.reasoningData) return this.reasoningData;

        const filepath = join(DATA_DIR, REASONING_FILE);
        if (!existsSync(filepath)) {
            this.reasoningData = [];
            return [];
        }

        try {
            const content = await readFile(filepath, 'utf-8');
            const lines = content.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());

            this.reasoningData = lines.slice(1)
                .filter(line => line.trim())
                .map(line => {
                    const values = line.split(',');
                    const row = {};
                    headers.forEach((header, i) => {
                        row[header] = values[i] || '';
                    });
                    return row;
                });

            return this.reasoningData;
        } catch (error) {
            console.error('Error loading reasoning data:', error.message);
            this.reasoningData = [];
            return [];
        }
    }

    /**
     * Execute searches across multiple domains
     */
    async _multiDomainSearch(query, stylePriority = null) {
        const results = {};

        for (const [domain, config] of Object.entries(SEARCH_CONFIG)) {
            if (domain === 'style' && stylePriority && stylePriority.length > 0) {
                // For style, also search with priority keywords
                const priorityQuery = stylePriority.slice(0, 2).join(' ');
                const combinedQuery = `${query} ${priorityQuery}`;
                results[domain] = await search(combinedQuery, domain, config.max_results);
            } else {
                results[domain] = await search(query, domain, config.max_results);
            }
        }

        return results;
    }

    /**
     * Find matching reasoning rule for a category
     */
    async _findReasoningRule(category) {
        const reasoningData = await this._loadReasoning();
        const categoryLower = category.toLowerCase();

        // Try exact match first
        for (const rule of reasoningData) {
            if (rule['UI_Category']?.toLowerCase() === categoryLower) {
                return rule;
            }
        }

        // Try partial match
        for (const rule of reasoningData) {
            const uiCat = rule['UI_Category']?.toLowerCase() || '';
            if (uiCat.includes(categoryLower) || categoryLower.includes(uiCat)) {
                return rule;
            }
        }

        // Try keyword match
        for (const rule of reasoningData) {
            const uiCat = rule['UI_Category']?.toLowerCase() || '';
            const keywords = uiCat.replace(/\//g, ' ').replace(/-/g, ' ').split(/\s+/);
            if (keywords.some(kw => categoryLower.includes(kw))) {
                return rule;
            }
        }

        return {};
    }

    /**
     * Apply reasoning rules to search results
     */
    async _applyReasoning(category, searchResults) {
        const rule = await this._findReasoningRule(category);

        if (!rule || Object.keys(rule).length === 0) {
            return {
                pattern: 'Hero + Features + CTA',
                style_priority: ['Minimalism', 'Flat Design'],
                color_mood: 'Professional',
                typography_mood: 'Clean',
                key_effects: 'Subtle hover transitions',
                anti_patterns: '',
                decision_rules: {},
                severity: 'MEDIUM'
            };
        }

        // Parse decision rules JSON
        let decisionRules = {};
        try {
            const rulesStr = rule['Decision_Rules'] || '{}';
            decisionRules = JSON.parse(rulesStr);
        } catch (error) {
            // Keep empty object if parsing fails
        }

        const stylePriority = (rule['Style_Priority'] || '')
            .split('+')
            .map(s => s.trim())
            .filter(s => s);

        return {
            pattern: rule['Recommended_Pattern'] || '',
            style_priority: stylePriority,
            color_mood: rule['Color_Mood'] || '',
            typography_mood: rule['Typography_Mood'] || '',
            key_effects: rule['Key_Effects'] || '',
            anti_patterns: rule['Anti_Patterns'] || '',
            decision_rules: decisionRules,
            severity: rule['Severity'] || 'MEDIUM'
        };
    }

    /**
     * Select best matching result based on priority keywords
     */
    _selectBestMatch(results, priorityKeywords) {
        if (!results || results.length === 0) {
            return {};
        }

        if (!priorityKeywords || priorityKeywords.length === 0) {
            return results[0];
        }

        // First: try exact style name match
        for (const priority of priorityKeywords) {
            const priorityLower = priority.toLowerCase().trim();
            for (const result of results) {
                const styleName = (result['Style Category'] || '').toLowerCase();
                if (priorityLower.includes(styleName) || styleName.includes(priorityLower)) {
                    return result;
                }
            }
        }

        // Second: score by keyword match in all fields
        const scored = [];
        for (const result of results) {
            const resultStr = JSON.stringify(result).toLowerCase();
            let score = 0;

            for (const kw of priorityKeywords) {
                const kwLower = kw.toLowerCase().trim();
                // Higher score for style name match
                if ((result['Style Category'] || '').toLowerCase().includes(kwLower)) {
                    score += 10;
                }
                // Lower score for keyword field match
                else if ((result['Keywords'] || '').toLowerCase().includes(kwLower)) {
                    score += 3;
                }
                // Even lower for other field matches
                else if (resultStr.includes(kwLower)) {
                    score += 1;
                }
            }

            scored.push([score, result]);
        }

        scored.sort((a, b) => b[0] - a[0]);
        return scored.length > 0 && scored[0][0] > 0 ? scored[0][1] : results[0];
    }

    /**
     * Extract results list from search result dict
     */
    _extractResults(searchResult) {
        return searchResult?.results || [];
    }

    /**
     * Generate complete design system recommendation
     */
    async generate(query, projectName = null) {
        // Step 1: First search product to get category
        const productResult = await search(query, 'product', 1);
        const productResults = productResult.results || [];
        let category = 'General';
        if (productResults.length > 0) {
            category = productResults[0]['Product Type'] || 'General';
        }

        // Step 2: Get reasoning rules for this category
        const reasoning = await this._applyReasoning(category, {});
        const stylePriority = reasoning.style_priority || [];

        // Step 3: Multi-domain search with style priority hints
        const searchResults = await this._multiDomainSearch(query, stylePriority);
        searchResults.product = productResult; // Reuse product search

        // Step 4: Select best matches from each domain using priority
        const styleResults = this._extractResults(searchResults.style || {});
        const colorResults = this._extractResults(searchResults.color || {});
        const typographyResults = this._extractResults(searchResults.typography || {});
        const landingResults = this._extractResults(searchResults.landing || {});

        const bestStyle = this._selectBestMatch(styleResults, reasoning.style_priority || []);
        const bestColor = colorResults[0] || {};
        const bestTypography = typographyResults[0] || {};
        const bestLanding = landingResults[0] || {};

        // Step 5: Build final recommendation
        const styleEffects = bestStyle['Effects & Animation'] || '';
        const reasoningEffects = reasoning.key_effects || '';
        const combinedEffects = styleEffects || reasoningEffects;

        return {
            project_name: projectName || query.toUpperCase(),
            category,
            pattern: {
                name: bestLanding['Pattern Name'] || reasoning.pattern || 'Hero + Features + CTA',
                sections: bestLanding['Section Order'] || 'Hero > Features > CTA',
                cta_placement: bestLanding['Primary CTA Placement'] || 'Above fold',
                color_strategy: bestLanding['Color Strategy'] || '',
                conversion: bestLanding['Conversion Optimization'] || ''
            },
            style: {
                name: bestStyle['Style Category'] || 'Minimalism',
                type: bestStyle['Type'] || 'General',
                effects: styleEffects,
                keywords: bestStyle['Keywords'] || '',
                best_for: bestStyle['Best For'] || '',
                performance: bestStyle['Performance'] || '',
                accessibility: bestStyle['Accessibility'] || ''
            },
            colors: {
                primary: bestColor['Primary (Hex)'] || '#2563EB',
                secondary: bestColor['Secondary (Hex)'] || '#3B82F6',
                cta: bestColor['CTA (Hex)'] || '#F97316',
                background: bestColor['Background (Hex)'] || '#F8FAFC',
                text: bestColor['Text (Hex)'] || '#1E293B',
                notes: bestColor['Notes'] || ''
            },
            typography: {
                heading: bestTypography['Heading Font'] || 'Inter',
                body: bestTypography['Body Font'] || 'Inter',
                mood: bestTypography['Mood/Style Keywords'] || reasoning.typography_mood || '',
                best_for: bestTypography['Best For'] || '',
                google_fonts_url: bestTypography['Google Fonts URL'] || '',
                css_import: bestTypography['CSS Import'] || ''
            },
            key_effects: combinedEffects,
            anti_patterns: reasoning.anti_patterns || '',
            decision_rules: reasoning.decision_rules || {},
            severity: reasoning.severity || 'MEDIUM'
        };
    }
}

// ============ OUTPUT FORMATTERS ============
const BOX_WIDTH = 90;

/**
 * Wrap long text into multiple lines
 */
function wrapText(text, prefix, width) {
    if (!text) return [];

    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = prefix;

    for (const word of words) {
        if (currentLine.length + word.length + 1 <= width - 2) {
            currentLine += (currentLine !== prefix ? ' ' : '') + word;
        } else {
            if (currentLine !== prefix) {
                lines.push(currentLine);
            }
            currentLine = prefix + word;
        }
    }

    if (currentLine !== prefix) {
        lines.push(currentLine);
    }

    return lines;
}

/**
 * Format design system as ASCII box with emojis (MCP-style)
 */
export function formatAsciiBox(designSystem) {
    const project = designSystem.project_name || 'PROJECT';
    const pattern = designSystem.pattern || {};
    const style = designSystem.style || {};
    const colors = designSystem.colors || {};
    const typography = designSystem.typography || {};
    const effects = designSystem.key_effects || '';
    const antiPatterns = designSystem.anti_patterns || '';

    // Build sections from pattern
    const sections = (pattern.sections || '')
        .split('>')
        .map(s => s.trim())
        .filter(s => s);

    // Build output lines
    const lines = [];
    const w = BOX_WIDTH - 1;

    lines.push('+' + '-'.repeat(w) + '+');
    lines.push(`|  🎯 TARGET: ${project} - RECOMMENDED DESIGN SYSTEM`.padEnd(BOX_WIDTH) + '|');
    lines.push('+' + '-'.repeat(w) + '+');
    lines.push('|' + ' '.repeat(BOX_WIDTH) + '|');

    // Pattern section
    lines.push(`|  📐 PATTERN: ${pattern.name || ''}`.padEnd(BOX_WIDTH) + '|');
    if (pattern.conversion) {
        lines.push(`|     🎯 Conversion: ${pattern.conversion}`.padEnd(BOX_WIDTH) + '|');
    }
    if (pattern.cta_placement) {
        lines.push(`|     📍 CTA: ${pattern.cta_placement}`.padEnd(BOX_WIDTH) + '|');
    }
    lines.push('|     📋 Sections:'.padEnd(BOX_WIDTH) + '|');
    sections.forEach((section, i) => {
        lines.push(`|       ${i + 1}. ${section}`.padEnd(BOX_WIDTH) + '|');
    });
    lines.push('|' + ' '.repeat(BOX_WIDTH) + '|');

    // Style section
    lines.push(`|  🎨 STYLE: ${style.name || ''}`.padEnd(BOX_WIDTH) + '|');
    if (style.keywords) {
        wrapText(`🏷️  Keywords: ${style.keywords}`, '|     ', BOX_WIDTH).forEach(line => {
            lines.push(line.padEnd(BOX_WIDTH) + '|');
        });
    }
    if (style.best_for) {
        wrapText(`✨ Best For: ${style.best_for}`, '|     ', BOX_WIDTH).forEach(line => {
            lines.push(line.padEnd(BOX_WIDTH) + '|');
        });
    }
    if (style.performance || style.accessibility) {
        const perfA11y = `⚡ Performance: ${style.performance} | ♿ Accessibility: ${style.accessibility}`;
        lines.push(`|     ${perfA11y}`.padEnd(BOX_WIDTH) + '|');
    }
    lines.push('|' + ' '.repeat(BOX_WIDTH) + '|');

    // Colors section
    lines.push('|  🎨 COLORS:'.padEnd(BOX_WIDTH) + '|');
    lines.push(`|     Primary:    ${colors.primary || ''}`.padEnd(BOX_WIDTH) + '|');
    lines.push(`|     Secondary:  ${colors.secondary || ''}`.padEnd(BOX_WIDTH) + '|');
    lines.push(`|     CTA:        ${colors.cta || ''}`.padEnd(BOX_WIDTH) + '|');
    lines.push(`|     Background: ${colors.background || ''}`.padEnd(BOX_WIDTH) + '|');
    lines.push(`|     Text:       ${colors.text || ''}`.padEnd(BOX_WIDTH) + '|');
    if (colors.notes) {
        wrapText(`📝 Notes: ${colors.notes}`, '|     ', BOX_WIDTH).forEach(line => {
            lines.push(line.padEnd(BOX_WIDTH) + '|');
        });
    }
    lines.push('|' + ' '.repeat(BOX_WIDTH) + '|');

    // Typography section
    lines.push(`|  🔤 TYPOGRAPHY: ${typography.heading || ''} / ${typography.body || ''}`.padEnd(BOX_WIDTH) + '|');
    if (typography.mood) {
        wrapText(`💭 Mood: ${typography.mood}`, '|     ', BOX_WIDTH).forEach(line => {
            lines.push(line.padEnd(BOX_WIDTH) + '|');
        });
    }
    if (typography.best_for) {
        wrapText(`✨ Best For: ${typography.best_for}`, '|     ', BOX_WIDTH).forEach(line => {
            lines.push(line.padEnd(BOX_WIDTH) + '|');
        });
    }
    if (typography.google_fonts_url) {
        lines.push(`|     🔗 Google Fonts: ${typography.google_fonts_url}`.padEnd(BOX_WIDTH) + '|');
    }
    if (typography.css_import) {
        const cssImport = typography.css_import.slice(0, 70) + (typography.css_import.length > 70 ? '...' : '');
        lines.push(`|     📎 CSS Import: ${cssImport}`.padEnd(BOX_WIDTH) + '|');
    }
    lines.push('|' + ' '.repeat(BOX_WIDTH) + '|');

    // Key Effects section
    if (effects) {
        lines.push('|  ✨ KEY EFFECTS:'.padEnd(BOX_WIDTH) + '|');
        wrapText(effects, '|     ', BOX_WIDTH).forEach(line => {
            lines.push(line.padEnd(BOX_WIDTH) + '|');
        });
        lines.push('|' + ' '.repeat(BOX_WIDTH) + '|');
    }

    // Anti-patterns section
    if (antiPatterns) {
        lines.push('|  ⛔ AVOID (Anti-patterns):'.padEnd(BOX_WIDTH) + '|');
        wrapText(antiPatterns, '|     ', BOX_WIDTH).forEach(line => {
            lines.push(line.padEnd(BOX_WIDTH) + '|');
        });
        lines.push('|' + ' '.repeat(BOX_WIDTH) + '|');
    }

    // Pre-Delivery Checklist section
    lines.push('|  ✅ PRE-DELIVERY CHECKLIST:'.padEnd(BOX_WIDTH) + '|');
    const checklistItems = [
        '[ ] No emojis as icons (use SVG: Heroicons/Lucide)',
        '[ ] cursor-pointer on all clickable elements',
        '[ ] Hover states with smooth transitions (150-300ms)',
        '[ ] Light mode: text contrast 4.5:1 minimum',
        '[ ] Focus states visible for keyboard nav',
        '[ ] prefers-reduced-motion respected',
        '[ ] Responsive: 375px, 768px, 1024px, 1440px'
    ];
    checklistItems.forEach(item => {
        lines.push(`|     ${item}`.padEnd(BOX_WIDTH) + '|');
    });
    lines.push('|' + ' '.repeat(BOX_WIDTH) + '|');

    lines.push('+' + '-'.repeat(w) + '+');

    return lines.join('\n');
}

/**
 * Format design system as markdown
 */
export function formatMarkdown(designSystem) {
    const project = designSystem.project_name || 'PROJECT';
    const pattern = designSystem.pattern || {};
    const style = designSystem.style || {};
    const colors = designSystem.colors || {};
    const typography = designSystem.typography || {};
    const effects = designSystem.key_effects || '';
    const antiPatterns = designSystem.anti_patterns || '';

    const lines = [];
    lines.push(`## Design System: ${project}`);
    lines.push('');

    // Pattern section
    lines.push('### Pattern');
    lines.push(`- **Name:** ${pattern.name || ''}`);
    if (pattern.conversion) {
        lines.push(`- **Conversion Focus:** ${pattern.conversion}`);
    }
    if (pattern.cta_placement) {
        lines.push(`- **CTA Placement:** ${pattern.cta_placement}`);
    }
    if (pattern.color_strategy) {
        lines.push(`- **Color Strategy:** ${pattern.color_strategy}`);
    }
    lines.push(`- **Sections:** ${pattern.sections || ''}`);
    lines.push('');

    // Style section
    lines.push('### Style');
    lines.push(`- **Name:** ${style.name || ''}`);
    if (style.keywords) {
        lines.push(`- **Keywords:** ${style.keywords}`);
    }
    if (style.best_for) {
        lines.push(`- **Best For:** ${style.best_for}`);
    }
    if (style.performance || style.accessibility) {
        lines.push(`- **Performance:** ${style.performance} | **Accessibility:** ${style.accessibility}`);
    }
    lines.push('');

    // Colors section
    lines.push('### Colors');
    lines.push('| Role | Hex |');
    lines.push('|------|-----|');
    lines.push(`| Primary | ${colors.primary || ''} |`);
    lines.push(`| Secondary | ${colors.secondary || ''} |`);
    lines.push(`| CTA | ${colors.cta || ''} |`);
    lines.push(`| Background | ${colors.background || ''} |`);
    lines.push(`| Text | ${colors.text || ''} |`);
    if (colors.notes) {
        lines.push('');
        lines.push(`*Notes: ${colors.notes}*`);
    }
    lines.push('');

    // Typography section
    lines.push('### Typography');
    lines.push(`- **Heading:** ${typography.heading || ''}`);
    lines.push(`- **Body:** ${typography.body || ''}`);
    if (typography.mood) {
        lines.push(`- **Mood:** ${typography.mood}`);
    }
    if (typography.best_for) {
        lines.push(`- **Best For:** ${typography.best_for}`);
    }
    if (typography.google_fonts_url) {
        lines.push(`- **Google Fonts:** ${typography.google_fonts_url}`);
    }
    if (typography.css_import) {
        lines.push('- **CSS Import:**');
        lines.push('```css');
        lines.push(typography.css_import);
        lines.push('```');
    }
    lines.push('');

    // Key Effects section
    if (effects) {
        lines.push('### Key Effects');
        lines.push(effects);
        lines.push('');
    }

    // Anti-patterns section
    if (antiPatterns) {
        lines.push('### Avoid (Anti-patterns)');
        const antiList = antiPatterns.split('+').map(a => a.trim()).filter(a => a);
        antiList.forEach(anti => {
            lines.push(`- ${anti}`);
        });
        lines.push('');
    }

    // Pre-Delivery Checklist section
    lines.push('### Pre-Delivery Checklist');
    lines.push('- [ ] No emojis as icons (use SVG: Heroicons/Lucide)');
    lines.push('- [ ] cursor-pointer on all clickable elements');
    lines.push('- [ ] Hover states with smooth transitions (150-300ms)');
    lines.push('- [ ] Light mode: text contrast 4.5:1 minimum');
    lines.push('- [ ] Focus states visible for keyboard nav');
    lines.push('- [ ] prefers-reduced-motion respected');
    lines.push('- [ ] Responsive: 375px, 768px, 1024px, 1440px');
    lines.push('');

    return lines.join('\n');
}

// ============ MAIN ENTRY POINT ============

/**
 * Main entry point for design system generation
 */
export async function generateDesignSystem(
    query,
    projectName = null,
    outputFormat = 'ascii',
    persist = false,
    page = null,
    outputDir = null
) {
    const generator = new DesignSystemGenerator();
    const designSystem = await generator.generate(query, projectName);

    // Persist to files if requested
    if (persist) {
        await persistDesignSystem(designSystem, page, outputDir, query);
    }

    if (outputFormat === 'markdown') {
        return formatMarkdown(designSystem);
    }
    return formatAsciiBox(designSystem);
}

// ============ ADVANCED PERSISTENCE FUNCTIONS ============
// Full implementation matching Python version (format_master_md + intelligent overrides)


import { generateTokenSystem } from './utils/css-templates.ts';
import { generateComponentSpecs } from './utils/component-specs.ts';
import { formatPageOverrideMd } from './utils/page-override-formatter.ts';

/**
 * Format design system as complete MASTER.md file with hierarchical override logic
 * This is the full Python-equivalent implementation (260 LOC in Python)
 * @param {Object} designSystem - Complete design system object
 * @returns {string} Formatted MASTER.md content
 */
export function formatMasterMd(designSystem) {
    const project = designSystem.project_name || 'PROJECT';
    const pattern = designSystem.pattern || {};
    const style = designSystem.style || {};
    const colors = designSystem.colors || {};
    const typography = designSystem.typography || {};
    const effects = designSystem.key_effects || '';
    const antiPatterns = designSystem.anti_patterns || '';

    const timestamp = new Date().toISOString(); // Full ISO 8601 UTC format

    const lines = [];

    // Logic header - explains Master + Override pattern
    lines.push('# Design System Master File');
    lines.push('');
    lines.push('> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.');
    lines.push('> If that file exists, its rules **override** this Master file.');
    lines.push('> If not, strictly follow the rules below.');
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push(`**Project:** ${project}`);
    lines.push(`**Generated:** ${timestamp}`);
    lines.push(`**Category:** ${designSystem.category || 'General'}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // Global Rules section
    lines.push('## Global Rules');
    lines.push('');

    // Color Palette with CSS variables
    lines.push('### Color Palette');
    lines.push('');
    lines.push('| Role | Hex | CSS Variable |');
    lines.push('|------|-----|--------------|');
    lines.push(`| Primary | \`${colors.primary || '#2563EB'}\` | \`--color-primary\` |`);
    lines.push(`| Secondary | \`${colors.secondary || '#3B82F6'}\` | \`--color-secondary\` |`);
    lines.push(`| CTA/Accent | \`${colors.cta || '#F97316'}\` | \`--color-cta\` |`);
    lines.push(`| Background | \`${colors.background || '#F8FAFC'}\` | \`--color-background\` |`);
    lines.push(`| Text | \`${colors.text || '#1E293B'}\` | \`--color-text\` |`);
    lines.push('');
    if (colors.notes) {
        lines.push(`**Color Notes:** ${colors.notes}`);
        lines.push('');
    }

    // Typography
    lines.push('### Typography');
    lines.push('');
    lines.push(`- **Heading Font:** ${typography.heading || 'Inter'}`);
    lines.push(`- **Body Font:** ${typography.body || 'Inter'}`);
    if (typography.mood) {
        lines.push(`- **Mood:** ${typography.mood}`);
    }
    if (typography.google_fonts_url) {
        lines.push(`- **Google Fonts:** [${typography.heading} + ${typography.body}](${typography.google_fonts_url})`);
    }
    lines.push('');
    if (typography.css_import) {
        lines.push('**CSS Import:**');
        lines.push('```css');
        lines.push(typography.css_import);
        lines.push('```');
        lines.push('');
    }

    // Spacing Variables
    lines.push('### Spacing Variables');
    lines.push('');
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    lines.push('| `--space-xs` | `4px` / `0.25rem` | Tight gaps |');
    lines.push('| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |');
    lines.push('| `--space-md` | `16px` / `1rem` | Standard padding |');
    lines.push('| `--space-lg` | `24px` / `1.5rem` | Section padding |');
    lines.push('| `--space-xl` | `32px` / `2rem` | Large gaps |');
    lines.push('| `--space-2xl` | `48px` / `3rem` | Section margins |');
    lines.push('| `--space-3xl` | `64px` / `4rem` | Hero padding |');
    lines.push('');

    // Shadow Depths
    lines.push('### Shadow Depths');
    lines.push('');
    lines.push('| Level | Value | Usage |');
    lines.push('|-------|-------|-------|');
    lines.push('| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |');
    lines.push('| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |');
    lines.push('| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |');
    lines.push('| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |');
    lines.push('');

    // Component Specs section (using Phase 2 generators)
    lines.push('---');
    lines.push('');
    lines.push('## Component Specs');
    lines.push('');

    // Buttons
    lines.push('### Buttons');
    lines.push('');
    lines.push('```css');
    lines.push('/* Primary Button */');
    lines.push('.btn-primary {');
    lines.push(`  background: ${colors.cta || '#F97316'};`);
    lines.push('  color: white;');
    lines.push('  padding: 12px 24px;');
    lines.push('  border-radius: 8px;');
    lines.push('  font-weight: 600;');
    lines.push('  transition: all 200ms ease;');
    lines.push('  cursor: pointer;');
    lines.push('}');
    lines.push('');
    lines.push('.btn-primary:hover {');
    lines.push('  opacity: 0.9;');
    lines.push('  transform: translateY(-1px);');
    lines.push('}');
    lines.push('');
    lines.push('/* Secondary Button */');
    lines.push('.btn-secondary {');
    lines.push('  background: transparent;');
    lines.push(`  color: ${colors.primary || '#2563EB'};`);
    lines.push(`  border: 2px solid ${colors.primary || '#2563EB'};`);
    lines.push('  padding: 12px 24px;');
    lines.push('  border-radius: 8px;');
    lines.push('  font-weight: 600;');
    lines.push('  transition: all 200ms ease;');
    lines.push('  cursor: pointer;');
    lines.push('}');
    lines.push('```');
    lines.push('');

    // Cards
    lines.push('### Cards');
    lines.push('');
    lines.push('```css');
    lines.push('.card {');
    lines.push(`  background: ${colors.background || '#FFFFFF'};`);
    lines.push('  border-radius: 12px;');
    lines.push('  padding: 24px;');
    lines.push('  box-shadow: var(--shadow-md);');
    lines.push('  transition: all 200ms ease;');
    lines.push('  cursor: pointer;');
    lines.push('}');
    lines.push('');
    lines.push('.card:hover {');
    lines.push('  box-shadow: var(--shadow-lg);');
    lines.push('  transform: translateY(-2px);');
    lines.push('}');
    lines.push('```');
    lines.push('');

    // Inputs
    lines.push('### Inputs');
    lines.push('');
    lines.push('```css');
    lines.push('.input {');
    lines.push('  padding: 12px 16px;');
    lines.push('  border: 1px solid #E2E8F0;');
    lines.push('  border-radius: 8px;');
    lines.push('  font-size: 16px;');
    lines.push('  transition: border-color 200ms ease;');
    lines.push('}');
    lines.push('');
    lines.push('.input:focus {');
    lines.push(`  border-color: ${colors.primary || '#2563EB'};`);
    lines.push('  outline: none;');
    lines.push(`  box-shadow: 0 0 0 3px ${colors.primary || '#2563EB'}20;`);
    lines.push('}');
    lines.push('```');
    lines.push('');

    // Modals
    lines.push('### Modals');
    lines.push('');
    lines.push('```css');
    lines.push('.modal-overlay {');
    lines.push('  background: rgba(0, 0, 0, 0.5);');
    lines.push('  backdrop-filter: blur(4px);');
    lines.push('}');
    lines.push('');
    lines.push('.modal {');
    lines.push('  background: white;');
    lines.push('  border-radius: 16px;');
    lines.push('  padding: 32px;');
    lines.push('  box-shadow: var(--shadow-xl);');
    lines.push('  max-width: 500px;');
    lines.push('  width: 90%;');
    lines.push('}');
    lines.push('```');
    lines.push('');

    // Style section
    lines.push('---');
    lines.push('');
    lines.push('## Style Guidelines');
    lines.push('');
    lines.push(`**Style:** ${style.name || 'Minimalism'}`);
    lines.push('');
    if (style.keywords) {
        lines.push(`**Keywords:** ${style.keywords}`);
        lines.push('');
    }
    if (style.best_for) {
        lines.push(`**Best For:** ${style.best_for}`);
        lines.push('');
    }
    if (effects) {
        lines.push(`**Key Effects:** ${effects}`);
        lines.push('');
    }

    // Layout Pattern
    lines.push('### Page Pattern');
    lines.push('');
    lines.push(`**Pattern Name:** ${pattern.name || ''}`);
    lines.push('');
    if (pattern.conversion) {
        lines.push(`- **Conversion Strategy:** ${pattern.conversion}`);
    }
    if (pattern.cta_placement) {
        lines.push(`- **CTA Placement:** ${pattern.cta_placement}`);
    }
    lines.push(`- **Section Order:** ${pattern.sections || ''}`);
    lines.push('');

    // Anti-Patterns section
    lines.push('---');
    lines.push('');
    lines.push('## Anti-Patterns (Do NOT Use)');
    lines.push('');
    if (antiPatterns) {
        const antiList = antiPatterns.split('+').map(a => a.trim()).filter(a => a);
        antiList.forEach(anti => {
            lines.push(`- ❌ ${anti}`);
        });
    }
    lines.push('');
    lines.push('### Additional Forbidden Patterns');
    lines.push('');
    lines.push('- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)');
    lines.push('- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer');
    lines.push('- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout');
    lines.push('- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio');
    lines.push('- ❌ **Instant state changes** — Always use transitions (150-300ms)');
    lines.push('- ❌ **Invisible focus states** — Focus states must be visible for a11y');
    lines.push('');

    // Pre-Delivery Checklist
    lines.push('---');
    lines.push('');
    lines.push('## Pre-Delivery Checklist');
    lines.push('');
    lines.push('Before delivering any UI code, verify:');
    lines.push('');
    lines.push('- [ ] No emojis used as icons (use SVG instead)');
    lines.push('- [ ] All icons from consistent icon set (Heroicons/Lucide)');
    lines.push('- [ ] `cursor-pointer` on all clickable elements');
    lines.push('- [ ] Hover states with smooth transitions (150-300ms)');
    lines.push('- [ ] Light mode: text contrast 4.5:1 minimum');
    lines.push('- [ ] Focus states visible for keyboard navigation');
    lines.push('- [ ] `prefers-reduced-motion` respected');
    lines.push('- [ ] Responsive: 375px, 768px, 1024px, 1440px');
    lines.push('- [ ] No content hidden behind fixed navbars');
    lines.push('- [ ] No horizontal scroll on mobile');
    lines.push('');

    return lines.join('\n');
}

/**
 * Persist design system to design-system/<project>/ folder
 * Updated to use full formatMasterMd() instead of simplified version
 */
export async function persistDesignSystem(
    designSystem,
    page = null,
    outputDir = null,
    pageQuery = null
) {
    const baseDir = outputDir || process.cwd();

    // Use project name for project-specific folder
    const projectName = designSystem.project_name || 'default';
    const projectSlug = projectName.toLowerCase().replace(/\s+/g, '-');

    const designSystemDir = join(baseDir, 'design-system', projectSlug);
    const pagesDir = join(designSystemDir, 'pages');

    const createdFiles = [];

    // Create directories
    await mkdir(designSystemDir, { recursive: true });
    await mkdir(pagesDir, { recursive: true });

    const masterFile = join(designSystemDir, 'MASTER.md');

    // Generate and write MASTER.md (now using full formatter)
    const masterContent = formatMasterMd(designSystem);
    await writeFile(masterFile, masterContent, 'utf-8');
    createdFiles.push(masterFile);

    // If page is specified, create intelligent page override file
    if (page) {
        const pageFile = join(pagesDir, `${page.toLowerCase().replace(/\s+/g, '-')}.md`);
        const pageContent = await formatPageOverrideMd(designSystem, page, pageQuery);
        await writeFile(pageFile, pageContent, 'utf-8');
        createdFiles.push(pageFile);
    }

    return {
        status: 'success',
        design_system_dir: designSystemDir,
        created_files: createdFiles
    };
}
