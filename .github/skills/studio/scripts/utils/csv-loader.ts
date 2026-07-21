/**
 * CSV Loader Utility - Studio Scripts
 * ====================================
 * CSV parsing with UTF-8 encoding support
 */

import { readFile } from 'fs/promises';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data directory path (relative to scripts/)
export const DATA_DIR = join(__dirname, '..', '..', 'data');

export type CSVRow = Record<string, string>;

/**
 * Load CSV file and return array of objects
 */
export async function loadCSV(filepath: string): Promise<CSVRow[]> {
    try {
        const fullPath = join(DATA_DIR, filepath);
        const content = await readFile(fullPath, 'utf-8');

        const records: CSVRow[] = parse(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            encoding: 'utf-8'
        });

        return records;
    } catch (error: unknown) {
        console.error(`Error loading CSV: ${filepath}`, error instanceof Error ? error.message : String(error));
        return [];
    }
}

/**
 * Load CSV and check if file exists
 */
export async function loadCSVSafe(filepath: string): Promise<{ exists: boolean; data: CSVRow[] }> {
    try {
        const data = await loadCSV(filepath);
        return { exists: true, data };
    } catch {
        return { exists: false, data: [] };
    }
}
