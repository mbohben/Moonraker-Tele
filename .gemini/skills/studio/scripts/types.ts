/**
 * Studio Design System - Type Definitions
 * ===================================================
 * Proper TypeScript interfaces replacing JSDoc typedefs
 */

// ============ Core Types ============

export interface CSVConfig {
    file: string;
    search_cols: string[];
    output_cols: string[];
}

export interface SearchResult {
    domain: string;
    query: string;
    file: string;
    count: number;
    results: Record<string, string>[];
    cached?: boolean;
    error?: string;
}

export interface StackSearchResult {
    domain: string;
    query: string;
    file: string;
    count: number;
    results: Record<string, string>[];
    stack: string;
    error?: string;
}

export interface SearchOptions {
    useCache?: boolean;
}

// ============ Design System Types ============

export interface ColorPalette {
    primary?: string;
    secondary?: string;
    cta?: string;
    background?: string;
    text?: string;
    border?: string;
}

export interface Typography {
    'Font Family'?: string;
    'Body Size'?: string;
    'Heading Sizes'?: string;
}

export interface DesignSystem {
    project_name: string;
    style?: Record<string, string>;
    colors?: ColorPalette;
    typography?: Typography;
    pattern?: Record<string, string>;
    key_effects?: string;
    anti_patterns?: string;
}

export interface PageOverrides {
    layout?: { type: string; recommendation: string };
    spacing?: { approach: string };
    typography?: Record<string, string>;
    colors?: Record<string, string>;
    components?: Record<string, unknown>;
}

// ============ Cache Types ============

export interface CacheEntry<T = unknown> {
    value: T;
    expiresAt: number;
    createdAt: number;
}

export interface CacheStats {
    hits: number;
    misses: number;
    hitRate: string;
    cacheSize: number;
}

export interface LRUCacheConfig {
    maxSize: number;
    ttlMs: number;
}

// ============ Config Types ============

export interface CustomPattern {
    keywords: string[];
    type: string;
}

export interface StudioConfig {
    $schema?: string;
    customPatterns?: CustomPattern[];
}

// ============ CSS Validation Types ============

export interface CSSValidationError {
    message: string;
    line: number;
    column: number;
}

export interface CSSValidationResult {
    valid: boolean;
    errors: CSSValidationError[];
}

export interface CSSValidationOptions {
    strict?: boolean;
}

export interface MarkdownCSSValidation {
    valid: boolean;
    warnings: string[];
}

// ============ Page Type Detection ============

export interface PagePattern {
    keywords: string[];
    type: string;
}

export type PageType =
    | 'Dashboard / Data View'
    | 'Checkout / Payment'
    | 'Settings / Profile'
    | 'Landing / Marketing'
    | 'Authentication'
    | 'Pricing / Plans'
    | 'Blog / Article'
    | 'Product Detail'
    | 'Search Results'
    | 'Empty State'
    | 'General'
    | string;
