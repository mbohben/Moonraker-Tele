// @ts-nocheck
/**
 * Studio Core - BM25 Search Engine
 * ==================================
 * JavaScript port of core.py
 * BM25 ranking algorithm for UI/UX style guides
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { loadCSV } from './utils/csv-loader.ts';
import { tokenize, buildDocument, extractColumns } from './utils/text-utils.ts';
import { LRUCache, clearSearchCache, getCacheStats } from './utils/search-cache.ts';

// Global search cache
const searchCache = new LRUCache(50, 5 * 60 * 1000); // 50 entries, 5 min TTL

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============ CONFIGURATION ============
export const DATA_DIR = join(__dirname, '..', 'data'); // scripts -> studio -> data
export const MAX_RESULTS = 3;

// CSV Configuration - exact port from Python
export const CSV_CONFIG = {
    style: {
        file: 'styles.csv',
        search_cols: ['Style Category', 'Keywords', 'Best For', 'Type'],
        output_cols: ['Style Category', 'Type', 'Keywords', 'Primary Colors', 'Effects & Animation', 'Best For', 'Performance', 'Accessibility', 'Framework Compatibility', 'Complexity']
    },
    prompt: {
        file: 'prompts.csv',
        search_cols: ['Style Category', 'AI Prompt Keywords (Copy-Paste Ready)', 'CSS/Technical Keywords'],
        output_cols: ['Style Category', 'AI Prompt Keywords (Copy-Paste Ready)', 'CSS/Technical Keywords', 'Implementation Checklist']
    },
    color: {
        file: 'colors.csv',
        search_cols: ['Product Type', 'Keywords', 'Notes'],
        output_cols: ['Product Type', 'Keywords', 'Primary (Hex)', 'Secondary (Hex)', 'CTA (Hex)', 'Background (Hex)', 'Text (Hex)', 'Border (Hex)', 'Notes']
    },
    chart: {
        file: 'charts.csv',
        search_cols: ['Data Type', 'Keywords', 'Best Chart Type', 'Accessibility Notes'],
        output_cols: ['Data Type', 'Keywords', 'Best Chart Type', 'Secondary Options', 'Color Guidance', 'Accessibility Notes', 'Library Recommendation', 'Interactive Level']
    },
    landing: {
        file: 'landing.csv',
        search_cols: ['Pattern Name', 'Keywords', 'Conversion Optimization', 'Section Order'],
        output_cols: ['Pattern Name', 'Keywords', 'Section Order', 'Primary CTA Placement', 'Color Strategy', 'Conversion Optimization']
    },
    product: {
        file: 'products.csv',
        search_cols: ['Product Type', 'Keywords', 'Primary Style Recommendation', 'Key Considerations'],
        output_cols: ['Product Type', 'Keywords', 'Primary Style Recommendation', 'Secondary Styles', 'Landing Page Pattern', 'Dashboard Style (if applicable)', 'Color Palette Focus']
    },
    ux: {
        file: 'ux-guidelines.csv',
        search_cols: ['Category', 'Issue', 'Description', 'Platform'],
        output_cols: ['Category', 'Issue', 'Platform', 'Description', 'Do', "Don't", 'Code Example Good', 'Code Example Bad', 'Severity']
    },
    typography: {
        file: 'typography.csv',
        search_cols: ['Font Pairing Name', 'Category', 'Mood/Style Keywords', 'Best For', 'Heading Font', 'Body Font'],
        output_cols: ['Font Pairing Name', 'Category', 'Heading Font', 'Body Font', 'Mood/Style Keywords', 'Best For', 'Google Fonts URL', 'CSS Import', 'Tailwind Config', 'Notes']
    },
    icons: {
        file: 'icons.csv',
        search_cols: ['Category', 'Icon Name', 'Keywords', 'Best For'],
        output_cols: ['Category', 'Icon Name', 'Keywords', 'Library', 'Import Code', 'Usage', 'Best For', 'Style']
    },
    react: {
        file: 'react-performance.csv',
        search_cols: ['Category', 'Issue', 'Keywords', 'Description'],
        output_cols: ['Category', 'Issue', 'Platform', 'Description', 'Do', "Don't", 'Code Example Good', 'Code Example Bad', 'Severity']
    },
    web: {
        file: 'web-interface.csv',
        search_cols: ['Category', 'Issue', 'Keywords', 'Description'],
        output_cols: ['Category', 'Issue', 'Platform', 'Description', 'Do', "Don't", 'Code Example Good', 'Code Example Bad', 'Severity']
    }
};

export const STACK_CONFIG = {
    'html-tailwind': { file: 'stacks/html-tailwind.csv' },
    'react': { file: 'stacks/react.csv' },
    'nextjs': { file: 'stacks/nextjs.csv' },
    'vue': { file: 'stacks/vue.csv' },
    'nuxtjs': { file: 'stacks/nuxtjs.csv' },
    'nuxt-ui': { file: 'stacks/nuxt-ui.csv' },
    'svelte': { file: 'stacks/svelte.csv' },
    'swiftui': { file: 'stacks/swiftui.csv' },
    'react-native': { file: 'stacks/react-native.csv' },
    'flutter': { file: 'stacks/flutter.csv' },
    'shadcn': { file: 'stacks/shadcn.csv' },
    'jetpack-compose': { file: 'stacks/jetpack-compose.csv' }
};

const STACK_COLS = {
    search_cols: ['Category', 'Guideline', 'Description', 'Do', "Don't"],
    output_cols: ['Category', 'Guideline', 'Description', 'Do', "Don't", 'Code Good', 'Code Bad', 'Severity', 'Docs URL']
};

export const AVAILABLE_STACKS = Object.keys(STACK_CONFIG);

// ============ BM25 IMPLEMENTATION ============

/**
 * BM25 ranking algorithm for text search
 * Port of Python implementation with exact same behavior
 */
export class BM25 {
    constructor(k1 = 1.5, b = 0.75) {
        this.k1 = k1;
        this.b = b;
        this.corpus = [];
        this.docLengths = [];
        this.avgdl = 0;
        this.idf = {};
        this.docFreqs = new Map();
        this.N = 0;
    }

    /**
     * Build BM25 index from documents
     * @param {string[]} documents - Array of document strings
     */
    fit(documents) {
        // Tokenize all documents
        this.corpus = documents.map(doc => tokenize(doc));
        this.N = this.corpus.length;

        if (this.N === 0) return;

        // Calculate document lengths and average
        this.docLengths = this.corpus.map(doc => doc.length);
        this.avgdl = this.docLengths.reduce((sum, len) => sum + len, 0) / this.N;

        // Calculate document frequencies
        this.docFreqs.clear();
        for (const doc of this.corpus) {
            const seen = new Set();
            for (const word of doc) {
                if (!seen.has(word)) {
                    this.docFreqs.set(word, (this.docFreqs.get(word) || 0) + 1);
                    seen.add(word);
                }
            }
        }

        // Calculate IDF scores
        // Python: log((N - freq + 0.5) / (freq + 0.5) + 1)
        this.idf = {};
        for (const [word, freq] of this.docFreqs.entries()) {
            this.idf[word] = Math.log((this.N - freq + 0.5) / (freq + 0.5) + 1);
        }
    }

    /**
     * Score all documents against query
     * @param {string} query - Search query
     * @returns {Array<[number, number]>} Array of [index, score] sorted by score desc
     */
    score(query) {
        const queryTokens = tokenize(query);
        const scores = [];

        for (let idx = 0; idx < this.corpus.length; idx++) {
            const doc = this.corpus[idx];
            const docLen = this.docLengths[idx];

            // Count term frequencies in this document
            const termFreqs = new Map();
            for (const word of doc) {
                termFreqs.set(word, (termFreqs.get(word) || 0) + 1);
            }

            // Calculate BM25 score
            let score = 0;
            for (const token of queryTokens) {
                if (token in this.idf) {
                    const tf = termFreqs.get(token) || 0;
                    const idf = this.idf[token];
                    const numerator = tf * (this.k1 + 1);
                    const denominator = tf + this.k1 * (1 - this.b + this.b * docLen / this.avgdl);
                    score += idf * numerator / denominator;
                }
            }

            scores.push([idx, score]);
        }

        // Sort by score descending
        return scores.sort((a, b) => b[1] - a[1]);
    }
}

// ============ SEARCH FUNCTIONS ============

/**
 * Core search function using BM25
 * @param {string} filepath - Full path to CSV file
 * @param {string[]} searchCols - Columns to search in
 * @param {string[]} outputCols - Columns to return
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results to return
 * @returns {Promise<Object[]>} Search results
 */
async function searchCSV(filepath, searchCols, outputCols, query, maxResults) {
    // filepath is just the filename, loadCSV will add DATA_DIR
    const data = await loadCSV(filepath);
    if (data.length === 0) return [];

    // Build documents from search columns
    const documents = data.map(row => buildDocument(row, searchCols));

    // BM25 search
    const bm25 = new BM25();
    bm25.fit(documents);
    const ranked = bm25.score(query);

    // Get top results with score > 0
    const results = [];
    for (const [idx, score] of ranked.slice(0, maxResults)) {
        if (score > 0) {
            const row = data[idx];
            results.push(extractColumns(row, outputCols));
        }
    }

    return results;
}

/**
 * Auto-detect the most relevant domain from query
 * @param {string} query - Search query
 * @returns {string} Detected domain
 */
export function detectDomain(query) {
    const queryLower = query.toLowerCase();

    const domainKeywords = {
        color: ['color', 'palette', 'hex', '#', 'rgb'],
        chart: ['chart', 'graph', 'visualization', 'trend', 'bar', 'pie', 'scatter', 'heatmap', 'funnel'],
        landing: ['landing', 'page', 'cta', 'conversion', 'hero', 'testimonial', 'pricing', 'section'],
        product: ['saas', 'ecommerce', 'e-commerce', 'fintech', 'healthcare', 'gaming', 'portfolio', 'crypto', 'dashboard'],
        prompt: ['prompt', 'css', 'implementation', 'variable', 'checklist', 'tailwind'],
        style: ['style', 'design', 'ui', 'minimalism', 'glassmorphism', 'neumorphism', 'brutalism', 'dark mode', 'flat', 'aurora'],
        ux: ['ux', 'usability', 'accessibility', 'wcag', 'touch', 'scroll', 'animation', 'keyboard', 'navigation', 'mobile'],
        typography: ['font', 'typography', 'heading', 'serif', 'sans'],
        icons: ['icon', 'icons', 'lucide', 'heroicons', 'symbol', 'glyph', 'pictogram', 'svg icon'],
        react: ['react', 'next.js', 'nextjs', 'suspense', 'memo', 'usecallback', 'useeffect', 'rerender', 'bundle', 'waterfall', 'barrel', 'dynamic import', 'rsc', 'server component'],
        web: ['aria', 'focus', 'outline', 'semantic', 'virtualize', 'autocomplete', 'form', 'input type', 'preconnect']
    };

    // Count keyword matches for each domain
    const scores = {};
    for (const [domain, keywords] of Object.entries(domainKeywords)) {
        scores[domain] = keywords.filter(kw => queryLower.includes(kw)).length;
    }

    // Find domain with highest score
    let bestDomain = 'style';
    let bestScore = 0;
    for (const [domain, score] of Object.entries(scores)) {
        if (score > bestScore) {
            bestScore = score;
            bestDomain = domain;
        }
    }

    return bestScore > 0 ? bestDomain : 'style';
}

/**
 * Main search function with auto-domain detection and caching
 * @param {string} query - Search query
 * @param {string|null} domain - Domain to search (auto-detect if null)
 * @param {number} maxResults - Maximum results
 * @param {Object} options - Additional options
 * @param {boolean} options.useCache - Whether to use cache (default: true)
 * @returns {Promise<Object>} Search results with metadata
 */
export async function search(query, domain = null, maxResults = MAX_RESULTS, options = {}) {
    const { useCache = true } = options;
    
    if (domain === null) {
        domain = detectDomain(query);
    }

    // Check cache first (if enabled)
    const cacheKey = LRUCache.generateKey(query, domain, maxResults);
    if (useCache) {
        const cached = searchCache.get(cacheKey);
        if (cached !== undefined) {
            return cached;
        }
    }

    const config = CSV_CONFIG[domain] || CSV_CONFIG.style;
    // Pass just the filename - loadCSV handles DATA_DIR
    const results = await searchCSV(config.file, config.search_cols, config.output_cols, query, maxResults);

    const result = {
        domain,
        query,
        file: config.file,
        count: results.length,
        results,
        cached: false
    };

    // Store in cache (if enabled)
    if (useCache) {
        searchCache.set(cacheKey, { ...result, cached: true });
    }

    return result;
}

/**
 * Search stack-specific guidelines
 * @param {string} query - Search query
 * @param {string} stack - Stack name
 * @param {number} maxResults - Maximum results
 * @returns {Promise<Object>} Search results with metadata
 */
export async function searchStack(query, stack, maxResults = MAX_RESULTS) {
    if (!STACK_CONFIG[stack]) {
        return { error: `Unknown stack: ${stack}. Available: ${AVAILABLE_STACKS.join(', ')}` };
    }

    // Pass just the filename - loadCSV handles DATA_DIR
    const results = await searchCSV(STACK_CONFIG[stack].file, STACK_COLS.search_cols, STACK_COLS.output_cols, query, maxResults);

    return {
        domain: 'stack',
        stack,
        query,
        file: STACK_CONFIG[stack].file,
        count: results.length,
        results
    };
}
