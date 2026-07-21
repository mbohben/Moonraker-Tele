// @ts-nocheck
/**
 * CSS Validator - Studio Design System
 * =====================================
 * Validates generated CSS syntax using css-tree parser
 * Non-blocking validation with optional strict mode
 */

import * as cssTree from 'css-tree';

/**
 * Validate CSS syntax
 * @param {string} css - CSS string to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.strict - If true, throw error on invalid CSS
 * @returns {{ valid: boolean, errors: Array<{message: string, line: number, column: number}> }}
 */
export function validateCss(css, options = {}) {
    const { strict = false } = options;
    const errors = [];

    if (!css || typeof css !== 'string') {
        return { valid: true, errors: [] }; // Empty/null CSS is valid
    }

    try {
        // Parse CSS - cssTree.parse throws on syntax errors
        cssTree.parse(css, {
            onParseError: (error) => {
                errors.push({
                    message: error.message,
                    line: error.line || 0,
                    column: error.column || 0
                });
            }
        });
    } catch (parseError) {
        errors.push({
            message: parseError.message,
            line: parseError.line || 0,
            column: parseError.column || 0
        });
    }

    const valid = errors.length === 0;

    if (strict && !valid) {
        throw new Error(`CSS validation failed:\n${errors.map(e => `  Line ${e.line}: ${e.message}`).join('\n')}`);
    }

    return { valid, errors };
}

/**
 * Validate CSS and return formatted result for logging
 * @param {string} css - CSS string to validate
 * @param {string} context - Context description for error messages
 * @returns {string|null} Error message or null if valid
 */
export function validateCssWithContext(css, context = 'CSS') {
    const result = validateCss(css);
    
    if (!result.valid) {
        const errorLines = result.errors.map(e => 
            `  Line ${e.line}, Col ${e.column}: ${e.message}`
        ).join('\n');
        return `⚠️ ${context} validation warnings:\n${errorLines}`;
    }
    
    return null;
}

/**
 * Extract CSS blocks from markdown and validate each
 * @param {string} markdown - Markdown content with CSS code blocks
 * @returns {{ valid: boolean, warnings: string[] }}
 */
export function validateMarkdownCss(markdown) {
    const cssBlockRegex = /```css\n([\s\S]*?)```/g;
    const warnings = [];
    let match;

    while ((match = cssBlockRegex.exec(markdown)) !== null) {
        const cssContent = match[1].trim();
        const validation = validateCss(cssContent);
        
        if (!validation.valid) {
            validation.errors.forEach(err => {
                warnings.push(`CSS block error (line ${err.line}): ${err.message}`);
            });
        }
    }

    return { valid: warnings.length === 0, warnings };
}
