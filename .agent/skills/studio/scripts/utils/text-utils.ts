/**
 * Text Utilities - Studio Scripts
 * ================================
 * Tokenization helpers for BM25 search
 */

import type { CSVRow } from './csv-loader.ts';

/**
 * Tokenize text for BM25 search
 */
export function tokenize(text: string): string[] {
    if (!text) return [];

    const cleaned = String(text)
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ');

    return cleaned
        .split(/\s+/)
        .filter(word => word.length > 2);
}

/**
 * Join multiple column values into single searchable document
 */
export function buildDocument(row: CSVRow, columns: string[]): string {
    return columns
        .map(col => row[col] || '')
        .join(' ');
}

/**
 * Extract subset of columns from row object
 */
export function extractColumns(row: CSVRow, columns: string[]): Record<string, string> {
    const result: Record<string, string> = {};
    for (const col of columns) {
        if (col in row) {
            result[col] = row[col];
        }
    }
    return result;
}
