// @ts-nocheck
/**
 * Utility Types Library (JavaScript with JSDoc)
 * 
 * A collection of commonly used utility patterns for JavaScript projects.
 * Provides same functionality as TypeScript utility types using JSDoc and runtime helpers.
 */

// =============================================================================
// RESULT TYPE (Error Handling)
// =============================================================================

/**
 * Create a success result
 * @template T
 * @param {T} data
 * @returns {{success: true, data: T}}
 */
export const ok = (data) => ({
    success: true,
    data
});

/**
 * Create an error result
 * @template E
 * @param {E} error
 * @returns {{success: false, error: E}}
 */
export const err = (error) => ({
    success: false,
    error
});

// =============================================================================
// OPTION TYPE (Nullable Handling)  
// =============================================================================

/**
 * Create a Some value
 * @template T
 * @param {T} value
 * @returns {{type: 'some', value: T}}
 */
export const some = (value) => ({ type: 'some', value });

/** @type {{type: 'none'}} */
export const none = { type: 'none' };

/**
 * Check if option is Some
 * @param {Object} option
 * @returns {boolean}
 */
export const isSome = (option) => option.type === 'some';

/**
 * Check if option is None
 * @param {Object} option
 * @returns {boolean}
 */
export const isNone = (option) => option.type === 'none';

// =============================================================================
// BRANDED TYPE HELPERS (Runtime Validation)
// =============================================================================

/**
 * Create a branded value (runtime type tagging)
 * @param {string} brand
 * @returns {function(*): Object}
 */
export const createBrand = (brand) => (value) => {
    return Object.defineProperty(Object(value), '__brand', {
        value: brand,
        enumerable: false,
        writable: false
    });
};

/**
 * Check if value has specific brand
 * @param {*} value
 * @param {string} brand
 * @returns {boolean}
 */
export const hasBrand = (value, brand) => {
    return value && value.__brand === brand;
};

// Branded type constructors
export const UserId = createBrand('UserId');
export const Email = createBrand('Email');
export const UUID = createBrand('UUID');
export const Timestamp = createBrand('Timestamp');
export const PositiveNumber = createBrand('PositiveNumber');

// =============================================================================
// DEEP UTILITIES
// =============================================================================

/**
 * Deep freeze object (DeepReadonly equivalent)
 * @param {Object} obj
 * @returns {Object}
 */
export const deepFreeze = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach(prop => {
        if (obj[prop] !== null && typeof obj[prop] === 'object') {
            deepFreeze(obj[prop]);
        }
    });
    return obj;
};

/**
 * Deep clone object
 * @param {Object} obj
 * @returns {Object}
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(deepClone);
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
    );
};

// =============================================================================
// OBJECT UTILITIES
// =============================================================================

/**
 * Pick properties from object
 * @param {Object} obj
 * @param {string[]} keys
 * @returns {Object}
 */
export const pick = (obj, keys) => {
    return keys.reduce((acc, key) => {
        if (key in obj) acc[key] = obj[key];
        return acc;
    }, {});
};

/**
 * Omit properties from object
 * @param {Object} obj
 * @param {string[]} keys
 * @returns {Object}
 */
export const omit = (obj, keys) => {
    const keysSet = new Set(keys);
    return Object.fromEntries(
        Object.entries(obj).filter(([k]) => !keysSet.has(k))
    );
};

/**
 * Merge objects (second overrides first)
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
export const merge = (a, b) => ({ ...a, ...b });

// =============================================================================
// ARRAY UTILITIES
// =============================================================================

/**
 * Get first element
 * @template T
 * @param {T[]} arr
 * @returns {T|undefined}
 */
export const first = (arr) => arr[0];

/**
 * Get last element
 * @template T
 * @param {T[]} arr
 * @returns {T|undefined}
 */
export const last = (arr) => arr[arr.length - 1];

/**
 * Check if array is non-empty
 * @param {Array} arr
 * @returns {boolean}
 */
export const isNonEmpty = (arr) => arr.length > 0;

/**
 * Create tuple of specific length
 * @param {number} length
 * @param {*} fill
 * @returns {Array}
 */
export const tuple = (length, fill) => Array(length).fill(fill);

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Assert value is never (exhaustive check)
 * @param {never} value
 * @param {string} [message]
 */
export function assertNever(value, message) {
    throw new Error(message ?? `Unexpected value: ${value}`);
}

/**
 * Exhaustive check without throwing
 * @param {never} _value
 */
export function exhaustiveCheck(_value) {
    // This function should never be called
}

// =============================================================================
// JSON UTILITIES
// =============================================================================

/**
 * Safe JSON parse
 * @param {string} str
 * @param {*} [fallback]
 * @returns {*}
 */
export const safeJsonParse = (str, fallback = null) => {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
};

/**
 * Check if value is JSON serializable
 * @param {*} value
 * @returns {boolean}
 */
export const isJsonSerializable = (value) => {
    if (value === null || typeof value === 'string' ||
        typeof value === 'number' || typeof value === 'boolean') {
        return true;
    }
    if (typeof value === 'undefined' || typeof value === 'function' ||
        typeof value === 'symbol') {
        return false;
    }
    if (Array.isArray(value)) {
        return value.every(isJsonSerializable);
    }
    if (typeof value === 'object') {
        return Object.values(value).every(isJsonSerializable);
    }
    return false;
};
