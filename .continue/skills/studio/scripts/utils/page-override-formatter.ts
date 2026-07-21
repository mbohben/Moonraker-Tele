// @ts-nocheck
/**
 * Page Override Formatter - Studio Design System
 * ================================================
 * Formats page-specific override markdown files
 * Final component of Phase 6 - matches Python version exactly
 */

import { generateIntelligentOverrides } from './intelligent-overrides.ts';

/**
 * Format a page-specific override file with intelligent AI-generated content
 * @param {Object} designSystem - Base design system object
 * @param {string} pageName - Page name (e.g., "dashboard", "checkout")
 * @param {string} pageQuery - Optional query for additional context
 * @returns {Promise<string>} Formatted markdown content for page override file
 */
export async function formatPageOverrideMd(designSystem, pageName, pageQuery = null) {
    const project = designSystem.project_name || 'PROJECT';
    const timestamp = new Date().toISOString(); // Full ISO 8601 UTC format
    const pageTitle = pageName
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Detect page type and generate intelligent overrides
    const pageOverrides = await generateIntelligentOverrides(pageName, pageQuery, designSystem);

    const lines = [];

    lines.push(`# ${pageTitle} Page Overrides`);
    lines.push('');
    lines.push(`> **PROJECT:** ${project}`);
    lines.push(`> **Generated:** ${timestamp}`);
    lines.push(`> **Page Type:** ${pageOverrides.page_type || 'General'}`);
    lines.push('');
    lines.push('> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).');
    lines.push('> Only deviations from the Master are documented here. For all other rules, refer to the Master.');
    lines.push('');
    lines.push('---');
    lines.push('');

    // Page-specific rules with actual content
    lines.push('## Page-Specific Rules');
    lines.push('');

    // Layout Overrides
    lines.push('### Layout Overrides');
    lines.push('');
    const layout = pageOverrides.layout || {};
    if (Object.keys(layout).length > 0) {
        for (const [key, value] of Object.entries(layout)) {
            lines.push(`- **${key}:** ${value}`);
        }
    } else {
        lines.push('- No overrides — use Master layout');
    }
    lines.push('');

    // Spacing Overrides
    lines.push('### Spacing Overrides');
    lines.push('');
    const spacing = pageOverrides.spacing || {};
    if (Object.keys(spacing).length > 0) {
        for (const [key, value] of Object.entries(spacing)) {
            lines.push(`- **${key}:** ${value}`);
        }
    } else {
        lines.push('- No overrides — use Master spacing');
    }
    lines.push('');

    // Typography Overrides
    lines.push('### Typography Overrides');
    lines.push('');
    const typography = pageOverrides.typography || {};
    if (Object.keys(typography).length > 0) {
        for (const [key, value] of Object.entries(typography)) {
            lines.push(`- **${key}:** ${value}`);
        }
    } else {
        lines.push('- No overrides — use Master typography');
    }
    lines.push('');

    // Color Overrides
    lines.push('### Color Overrides');
    lines.push('');
    const colors = pageOverrides.colors || {};
    if (Object.keys(colors).length > 0) {
        for (const [key, value] of Object.entries(colors)) {
            lines.push(`- **${key}:** ${value}`);
        }
    } else {
        lines.push('- No overrides — use Master colors');
    }
    lines.push('');

    // Component Overrides
    lines.push('### Component Overrides');
    lines.push('');
    const components = pageOverrides.components || [];
    if (components.length > 0) {
        for (const comp of components) {
            lines.push(`- ${comp}`);
        }
    } else {
        lines.push('- No overrides — use Master component specs');
    }
    lines.push('');

    // Page-Specific Components
    lines.push('---');
    lines.push('');
    lines.push('## Page-Specific Components');
    lines.push('');
    const uniqueComponents = pageOverrides.unique_components || [];
    if (uniqueComponents.length > 0) {
        for (const comp of uniqueComponents) {
            lines.push(`- ${comp}`);
        }
    } else {
        lines.push('- No unique components for this page');
    }
    lines.push('');

    // Recommendations
    lines.push('---');
    lines.push('');
    lines.push('## Recommendations');
    lines.push('');
    const recommendations = pageOverrides.recommendations || [];
    if (recommendations.length > 0) {
        for (const rec of recommendations) {
            lines.push(`- ${rec}`);
        }
    }
    lines.push('');

    return lines.join('\n');
}
