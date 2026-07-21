// @ts-nocheck
/**
 * CSS Template Generators - Studio Design System
 * ===============================================
 * Utilities for generating CSS variables and token systems
 * Used by formatMasterMd() and formatPageOverrideMd()
 */

/**
 * Generate CSS custom properties for color palette
 * @param {Object} colorData - Color palette data from design system
 * @returns {string} CSS custom properties block
 */
export function generateColorVars(colorData) {
    if (!colorData) return '';

    const lines = [];
    lines.push(':root {');

    if (colorData.primary) {
        lines.push(`  --color-primary: ${colorData.primary};`);
    }
    if (colorData.secondary) {
        lines.push(`  --color-secondary: ${colorData.secondary};`);
    }
    if (colorData.cta) {
        lines.push(`  --color-cta: ${colorData.cta};`);
    }
    if (colorData.background) {
        lines.push(`  --color-bg: ${colorData.background};`);
    }
    if (colorData.text) {
        lines.push(`  --color-text: ${colorData.text};`);
    }
    if (colorData.border) {
        lines.push(`  --color-border: ${colorData.border};`);
    }

    lines.push('}');
    return lines.join('\n');
}

/**
 * Generate 7-level spacing scale (xs to 3xl)
 * Based on 4px base unit (common design system standard)
 * @returns {string} CSS spacing variables
 */
export function generateSpacingScale() {
    const spacings = {
        'xs': '4px',   // 0.25rem
        'sm': '8px',   // 0.5rem
        'md': '16px',  // 1rem
        'lg': '24px',  // 1.5rem
        'xl': '32px',  // 2rem
        '2xl': '48px', // 3rem
        '3xl': '64px'  // 4rem
    };

    const lines = [];
    lines.push(':root {');

    for (const [size, value] of Object.entries(spacings)) {
        lines.push(`  --spacing-${size}: ${value};`);
    }

    lines.push('}');
    lines.push('');
    lines.push('/* Usage Examples:');
    lines.push(' * padding: var(--spacing-md);  // 16px');
    lines.push(' * margin-top: var(--spacing-lg);  // 24px');
    lines.push(' * gap: var(--spacing-sm);  // 8px');
    lines.push(' */');

    return lines.join('\n');
}

/**
 * Generate 4-level shadow depth system
 * Based on Material Design elevation principles
 * @returns {string} CSS shadow variables
 */
export function generateShadowDepths() {
    const shadows = {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',  // Cards, buttons
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',  // Dropdowns
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',  // Modals
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'  // Overlays
    };

    const lines = [];
    lines.push(':root {');

    for (const [depth, value] of Object.entries(shadows)) {
        lines.push(`  --shadow-${depth}: ${value};`);
    }

    lines.push('}');
    lines.push('');
    lines.push('/* Usage Examples:');
    lines.push(' * box-shadow: var(--shadow-sm);  // Subtle card elevation');
    lines.push(' * box-shadow: var(--shadow-md);  // Dropdown menus');
    lines.push(' * box-shadow: var(--shadow-lg);  // Modal dialogs');
    lines.push(' * box-shadow: var(--shadow-xl);  // Full-page overlays');
    lines.push(' */');

    return lines.join('\n');
}

/**
 * Generate border radius scale
 * @returns {string} CSS border radius variables
 */
export function generateBorderRadiusScale() {
    const radii = {
        'none': '0',
        'sm': '0.125rem',  // 2px
        'md': '0.375rem',  // 6px
        'lg': '0.5rem',    // 8px
        'xl': '0.75rem',   // 12px
        'full': '9999px'   // Fully rounded
    };

    const lines = [];
    lines.push(':root {');

    for (const [size, value] of Object.entries(radii)) {
        lines.push(`  --radius-${size}: ${value};`);
    }

    lines.push('}');

    return lines.join('\n');
}

/**
 * Generate complete CSS token system
 * Combines all token generators
 * @param {Object} colorData - Color palette from design system
 * @returns {string} Complete CSS variables block
 */
export function generateTokenSystem(colorData) {
    const sections = [];

    sections.push('/* === Design Tokens === */');
    sections.push('');

    // Colors
    if (colorData && Object.keys(colorData).length > 0) {
        sections.push('/* Colors */');
        sections.push(generateColorVars(colorData));
        sections.push('');
    }

    // Spacing
    sections.push('/* Spacing Scale */');
    sections.push(generateSpacingScale());
    sections.push('');

    // Shadows
    sections.push('/* Shadow Depths */');
    sections.push(generateShadowDepths());
    sections.push('');

    // Border Radius
    sections.push('/* Border Radius */');
    sections.push(generateBorderRadiusScale());

    return sections.join('\n');
}
