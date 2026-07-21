// @ts-nocheck
/**
 * Page Type Detection - Studio Design System
 * ===========================================
 * Detects page types from context and search results
 * Used by intelligent override generation (Phase 5)
 * 
 * Supports custom patterns via .studiorc.json or studio-config.json
 */

import { loadConfig, mergePatterns } from './config-loader.ts';

/**
 * Default page type patterns (exported for extension/override)
 * NOTE: Order matters - more specific patterns should come first
 */
export const DEFAULT_PATTERNS = [
    {
        keywords: ['dashboard', 'admin', 'analytics', 'data', 'metrics', 'stats', 'monitor', 'overview'],
        type: 'Dashboard / Data View'
    },
    {
        keywords: ['checkout', 'payment', 'cart', 'purchase', 'order', 'billing'],
        type: 'Checkout / Payment'
    },
    {
        // IMPORTANT: Don't include 'account' here due to collision with 'register account' (Authentication)
        keywords: ['settings', 'profile', 'preferences', 'config'],
        type: 'Settings / Profile'
    },
    {
        keywords: ['landing', 'marketing', 'homepage', 'hero', 'home', 'promo'],
        type: 'Landing / Marketing'
    },
    {
        // 'account' keyword handled here (for register/create account flows)
        keywords: ['login', 'signin', 'signup', 'register', 'auth', 'password', 'account'],
        type: 'Authentication'
    },
    {
        // Added 'package' (singular) to match 'package options'
        keywords: ['pricing', 'plans', 'subscription', 'tiers', 'packages', 'package'],
        type: 'Pricing / Plans'
    },
    {
        keywords: ['blog', 'article', 'post', 'news', 'content', 'story'],
        type: 'Blog / Article'
    },
    {
        keywords: ['product', 'item', 'detail', 'pdp', 'shop', 'store'],
        type: 'Product Detail'
    },
    {
        keywords: ['search', 'browse', 'filter', 'catalog', 'list'],
        type: 'Search Results'
    },
    {
        // IMPORTANT: 'results' removed to avoid collision with 'Search Results'
        // 'zero results' should match on 'zero', not 'results'
        keywords: ['empty', '404', 'error', 'not found', 'zero'],
        type: 'Empty State'
    }
];

/**
 * Detect page type from context string and style results
 * Uses DEFAULT_PATTERNS only (for backward compatibility)
 * @param {string} context - Combined page name + query context
 * @param {Array} styleResults - Style search results for fallback inference
 * @returns {string} Detected page type
 */
export function detectPageType(context, styleResults = []) {
    return detectPageTypeWithPatterns(context, styleResults, DEFAULT_PATTERNS);
}

/**
 * Detect page type with custom patterns from config
 * Loads user config and merges custom patterns (higher priority)
 * @param {string} context - Combined page name + query context
 * @param {Array} styleResults - Style search results for fallback inference
 * @param {string} projectDir - Project directory to search for config
 * @returns {Promise<string>} Detected page type
 */
export async function detectPageTypeWithConfig(context, styleResults = [], projectDir = process.cwd()) {
    const config = await loadConfig(null, projectDir);
    const customPatterns = config?.customPatterns || [];
    const patterns = mergePatterns(DEFAULT_PATTERNS, customPatterns);
    
    return detectPageTypeWithPatterns(context, styleResults, patterns);
}

/**
 * Core page type detection logic with configurable patterns
 * @param {string} context - Combined page name + query context
 * @param {Array} styleResults - Style search results for fallback inference
 * @param {Array} patterns - Page patterns to match against
 * @returns {string} Detected page type
 */
function detectPageTypeWithPatterns(context, styleResults, patterns) {
    const contextLower = (context || '').toLowerCase();

    // Check each pattern for keyword matches
    for (const { keywords, type } of patterns) {
        if (keywords.some(kw => contextLower.includes(kw))) {
            return type;
        }
    }

    // Fallback: try to infer from style results
    if (styleResults && styleResults.length > 0) {
        const styleName = (styleResults[0]['Style Category'] || '').toLowerCase();
        const bestFor = (styleResults[0]['Best For'] || '').toLowerCase();

        if (bestFor.includes('dashboard') || bestFor.includes('data')) {
            return 'Dashboard / Data View';
        } else if (bestFor.includes('landing') || bestFor.includes('marketing')) {
            return 'Landing / Marketing';
        }
    }

    // Final fallback
    return 'General';
}

