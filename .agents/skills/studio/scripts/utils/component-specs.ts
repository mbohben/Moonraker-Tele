// @ts-nocheck
/**
 * Component Spec Generators - Studio Design System
 * =================================================
 * Generators for production-ready component CSS specifications
 * Used by formatMasterMd() to create complete design system files
 */

/**
 * Generate button component specifications
 * @param {Object} colors - Color palette from design system
 * @returns {string} Button CSS specifications
 */
export function generateButtonSpecs(colors) {
    const primaryColor = colors?.cta || '#F97316';
    const secondaryColor = colors?.primary || '#2563EB';

    return `### Buttons

\`\`\`css
/* Primary Button */
.btn-primary {
  background: ${primaryColor};
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: ${secondaryColor};
  border: 2px solid ${secondaryColor};
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
\`\`\`
`;
}

/**
 * Generate card component specifications
 * @param {Object} colors - Color palette from design system
 * @returns {string} Card CSS specifications
 */
export function generateCardSpecs(colors) {
    const bgColor = colors?.background || '#FFFFFF';

    return `### Cards

\`\`\`css
.card {
  background: ${bgColor};
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
\`\`\`
`;
}

/**
 * Generate input component specifications
 * @param {Object} colors - Color palette from design system
 * @returns {string} Input CSS specifications
 */
export function generateInputSpecs(colors) {
    const primaryColor = colors?.primary || '#2563EB';

    return `### Inputs

\`\`\`css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: ${primaryColor};
  outline: none;
  box-shadow: 0 0 0 3px ${primaryColor}20;
}
\`\`\`
`;
}

/**
 * Generate modal component specifications
 * @returns {string} Modal CSS specifications
 */
export function generateModalSpecs() {
    return `### Modals

\`\`\`css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
\`\`\`
`;
}

/**
 * Generate all component specifications
 * @param {Object} colors - Color palette from design system
 * @returns {string} Complete component specs section
 */
export function generateComponentSpecs(colors) {
    const sections = [];

    sections.push('---');
    sections.push('');
    sections.push('## Component Specs');
    sections.push('');
    sections.push(generateButtonSpecs(colors));
    sections.push('');
    sections.push(generateCardSpecs(colors));
    sections.push('');
    sections.push(generateInputSpecs(colors));
    sections.push('');
    sections.push(generateModalSpecs());

    return sections.join('\n');
}
