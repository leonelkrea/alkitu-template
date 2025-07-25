/**
 * Theme Builder - Shared Utils Index
 * Central export point for all utility functions
 */

// ============================================================================
// COLOR UTILITIES
// ============================================================================
export {
  // Color Validation
  isValidColor,
  isValidHex,
  isValidRgb,
  isValidHsl,
  isValidOklch,
  
  // Color Normalization
  normalizeHex,
  ensureAlpha,
  
  // Color Format Conversions
  hexToRgba,
  rgbToHex,
  hexToOklch,
  
  // Color Accessibility
  getRelativeLuminance,
  getContrastRatio,
  checkColorContrast,
} from './color-utils';

// ============================================================================
// THEME UTILITIES
// ============================================================================
export {
  // Theme Validation
  validateThemeColors,
  validateThemeData,
  
  // Theme Comparison
  compareColorConfigs,
  areThemesEqual,
  
  // Theme Transformation
  mergeWithDefaults,
  cloneTheme,
  prepareThemeForExport,
  
  // Color Utilities
  extractColorNames,
  getColorForMode,
  setColorForMode,
  removeColorFromTheme,
  
  // Theme Analysis
  analyzeThemeCompleteness,
  suggestForegroundColors,
  
  // Theme Utilities
  generateThemeName,
  sanitizeThemeName,
  estimateThemeSize,
} from './theme-utils';

// ============================================================================
// FILE UTILITIES
// ============================================================================
export {
  // File Validation
  isValidThemeFile,
  isValidSVGFile,
  
  // File Processing
  readFileAsText,
  processSVGFile,
  parseThemeFile,
  
  // File Creation
  createDownloadableFile,
  generateJSONThemeFile,
  generateCSSThemeFile,
  
  // Utility Functions
  getFileExtension,
  formatFileSize,
  generateSafeFilename,
  isSafeFilename,
} from './file-utils';

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Standard breakpoints for responsive design
 */
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  tv: 1920,
} as const;

/**
 * Gets current active breakpoint based on window width
 */
export function getCurrentBreakpoint(): 'mobile' | 'tablet' | 'desktop' | 'tv' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS.tv) return 'tv';
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

/**
 * Creates media query string for breakpoint
 */
export function createMediaQuery(breakpoint: keyof typeof BREAKPOINTS): string {
  return `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
}

/**
 * Checks if current viewport matches media query
 */
export function matchesMediaQuery(query: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
}

// ============================================================================
// DEBOUNCE/THROTTLE UTILITIES
// ============================================================================

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttles a function call
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

/**
 * Checks if two objects are deeply equal
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b;
  }
  
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }
  
  if (a.prototype !== b.prototype) return false;
  
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  
  return keys.every(k => deepEqual(a[k], b[k]));
}

/**
 * Omits specified keys from object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

/**
 * Picks specified keys from object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Capitalizes first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Converts kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Truncates string to specified length
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Removes duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Groups array elements by key
 */
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Chunks array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}