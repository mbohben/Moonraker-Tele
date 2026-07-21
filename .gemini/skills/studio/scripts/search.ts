#!/usr/bin/env node
// @ts-nocheck
/**
 * Studio Search CLI
 *
 * CLI entry point for Studio search and design system generation.
 * BM25-powered search across 24 CSV databases with design system output.
 *
 * @version 3.9.206
 * @contract studio v2.0.0
 * @see references/engineering-spec.md
 */

import { parseArgs } from 'node:util';
import { search, searchStack, CSV_CONFIG, AVAILABLE_STACKS } from './core.ts';
import { generateDesignSystem } from './design_system.ts';

/**
 * Format search results for terminal output
 */
function formatOutput(result) {
    if (result.error) {
        return `Error: ${result.error}`;
    }

    const output = [];
    if (result.stack) {
        output.push('## Studio Stack Guidelines');
        output.push(`**Stack:** ${result.stack} | **Query:** ${result.query}`);
    } else {
        output.push('## Studio Search Results');
        output.push(`**Domain:** ${result.domain} | **Query:** ${result.query}`);
    }
    output.push(`**Source:** ${result.file} | **Found:** ${result.count} results\n`);

    result.results.forEach((row, i) => {
        output.push(`### Result ${i + 1}`);
        for (const [key, value] of Object.entries(row)) {
            let valueStr = String(value);
            if (valueStr.length > 300) {
                valueStr = valueStr.slice(0, 300) + '...';
            }
            output.push(`- **${key}:** ${valueStr}`);
        }
        output.push('');
    });

    return output.join('\n');
}

/**
 * Main CLI function
 */
async function main() {
    const options = {
        domain: {
            type: 'string',
            short: 'd'
        },
        stack: {
            type: 'string',
            short: 's'
        },
        'max-results': {
            type: 'string',
            short: 'n'
        },
        json: {
            type: 'boolean'
        },
        'design-system': {
            type: 'boolean'
            // No short option (parseArgs requires single char only)
        },
        'project-name': {
            type: 'string',
            short: 'p'
        },
        format: {
            type: 'string',
            short: 'f'
        },
        persist: {
            type: 'boolean'
        },
        page: {
            type: 'string'
        },
        'output-dir': {
            type: 'string',
            short: 'o'
        }
    };

    let args;
    try {
        args = parseArgs({
            options,
            allowPositionals: true
        });
    } catch (error) {
        console.error(`Error parsing arguments: ${error.message}`);
        console.error('\nUsage: node search.js "<query>" [options]');
        console.error('  --domain, -d       Search domain (style, color, chart, etc.)');
        console.error('  --stack, -s        Stack-specific search (html-tailwind, react, etc.)');
        console.error('  --max-results, -n  Maximum results (default: 3)');
        console.error('  --json             Output as JSON');
        console.error('  --design-system    Generate complete design system');
        console.error('  --project-name, -p Project name for design system');
        console.error('  --format, -f       Output format (ascii or markdown)');
        console.error('  --persist          Save design system to files');
        console.error('  --page             Page-specific override file');
        console.error('  --output-dir, -o   Output directory');
        process.exit(1);
    }

    const query = args.positionals[0];
    if (!query) {
        console.error('Error: Query is required');
        console.error('\nUsage: node search.js "<query>" [options]');
        process.exit(1);
    }

    const domain = args.values.domain;
    const stack = args.values.stack;
    const maxResults = args.values['max-results'] ? parseInt(args.values['max-results']) : 3;
    const jsonOutput = args.values.json || false;
    const designSystem = args.values['design-system'] || false;
    const projectName = args.values['project-name'] || null;
    const format = args.values.format || 'ascii';
    const persist = args.values.persist || false;
    const page = args.values.page || null;
    const outputDir = args.values['output-dir'] || null;

    // Design system takes priority
    if (designSystem) {
        const result = await generateDesignSystem(
            query,
            projectName,
            format,
            persist,
            page,
            outputDir
        );
        console.log(result);

        // Print persistence confirmation
        if (persist) {
            const projectSlug = (projectName || query).toLowerCase().replace(/\s+/g, '-');
            console.log('\n' + '='.repeat(60));
            console.log(`✅ Design system persisted to design-system/${projectSlug}/`);
            console.log(`   📄 design-system/${projectSlug}/MASTER.md (Global Source of Truth)`);
            if (page) {
                const pageFilename = page.toLowerCase().replace(/\s+/g, '-');
                console.log(`   📄 design-system/${projectSlug}/pages/${pageFilename}.md (Page Overrides)`);
            }
            console.log('');
            console.log(`📖 Usage: When building a page, check design-system/${projectSlug}/pages/[page].md first.`);
            console.log(`   If exists, its rules override MASTER.md. Otherwise, use MASTER.md.`);
            console.log('='.repeat(60));
        }
    }
    // Stack search
    else if (stack) {
        if (!AVAILABLE_STACKS.includes(stack)) {
            console.error(`Error: Unknown stack: ${stack}. Available: ${AVAILABLE_STACKS.join(', ')}`);
            process.exit(1);
        }

        const result = await searchStack(query, stack, maxResults);
        if (jsonOutput) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log(formatOutput(result));
        }
    }
    // Domain search
    else {
        if (domain && !CSV_CONFIG[domain]) {
            console.error(`Error: Unknown domain: ${domain}. Available: ${Object.keys(CSV_CONFIG).join(', ')}`);
            process.exit(1);
        }

        const result = await search(query, domain, maxResults);
        if (jsonOutput) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log(formatOutput(result));
        }
    }
}

// Run CLI
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
