/**
 * Theme Builder - Theme Utilities
 * Pure functions for theme manipulation and processing
 * Extracted from ThemeEditor.tsx as part of Clean Architecture refactor
 */

import type { 
  ThemeData, 
  ColorValues, 
  ThemeMode, 
  ValidationResult,
  ThemeExportData 
} from '../types';

// ============================================================================
// THEME VALIDATION
// ============================================================================

/**
 * Validates theme color configuration
 * @param colors - Color configuration object
 * @returns Array of missing or invalid color names
 */
export function validateThemeColors(colors: ColorValues | undefined): string[] {
  if (!colors) return ['No color configuration provided'];

  const requiredColors = [
    'primary', 'primary-foreground',
    'secondary', 'secondary-foreground',
    'background', 'foreground',
    'card', 'card-foreground',
    'popover', 'popover-foreground',
    'muted', 'muted-foreground',
    'accent', 'accent-foreground',
    'destructive', 'destructive-foreground',
    'border', 'input', 'ring'
  ];

  const missingColors: string[] = [];
  const invalidColors: string[] = [];

  for (const colorName of requiredColors) {
    if (!colors[colorName]) {
      missingColors.push(colorName);
    } else if (typeof colors[colorName] !== 'string' || !colors[colorName].trim()) {
      invalidColors.push(colorName);
    }
  }

  return [...missingColors, ...invalidColors];
}

/**
 * Validates complete theme data structure
 */
export function validateThemeData(theme: any): ValidationResult {
  const errors: string[] = [];

  // Check basic structure
  if (!theme || typeof theme !== 'object') {
    return { isValid: false, errors: ['Theme must be an object'] };
  }

  // Check required fields
  if (!theme.name || typeof theme.name !== 'string') {
    errors.push('Theme name is required and must be a string');
  }

  if (!theme.lightModeConfig || typeof theme.lightModeConfig !== 'object') {
    errors.push('Light mode configuration is required');
  } else {
    const lightErrors = validateThemeColors(theme.lightModeConfig);
    if (lightErrors.length > 0) {
      errors.push(`Light mode errors: ${lightErrors.join(', ')}`);
    }
  }

  if (!theme.darkModeConfig || typeof theme.darkModeConfig !== 'object') {
    errors.push('Dark mode configuration is required');
  } else {
    const darkErrors = validateThemeColors(theme.darkModeConfig);
    if (darkErrors.length > 0) {
      errors.push(`Dark mode errors: ${darkErrors.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================================================
// THEME COMPARISON
// ============================================================================

/**
 * Compares two color configurations and returns differences
 */
export function compareColorConfigs(config1: ColorValues, config2: ColorValues): {
  added: string[];
  removed: string[];
  changed: string[];
  unchanged: string[];
} {
  const keys1 = new Set(Object.keys(config1));
  const keys2 = new Set(Object.keys(config2));
  const allKeys = new Set([...keys1, ...keys2]);

  const added: string[] = [];
  const removed: string[] = [];
  const changed: string[] = [];
  const unchanged: string[] = [];

  for (const key of allKeys) {
    if (!keys1.has(key)) {
      added.push(key);
    } else if (!keys2.has(key)) {
      removed.push(key);
    } else if (config1[key] !== config2[key]) {
      changed.push(key);
    } else {
      unchanged.push(key);
    }
  }

  return { added, removed, changed, unchanged };
}

/**
 * Checks if two themes are identical
 */
export function areThemesEqual(theme1: ThemeData, theme2: ThemeData): boolean {
  if (theme1.name !== theme2.name) return false;

  const lightComparison = compareColorConfigs(theme1.lightModeConfig, theme2.lightModeConfig);
  const darkComparison = compareColorConfigs(theme1.darkModeConfig, theme2.darkModeConfig);

  return lightComparison.added.length === 0 && 
         lightComparison.removed.length === 0 && 
         lightComparison.changed.length === 0 &&
         darkComparison.added.length === 0 && 
         darkComparison.removed.length === 0 && 
         darkComparison.changed.length === 0;
}

// ============================================================================
// THEME TRANSFORMATION
// ============================================================================

/**
 * Merges theme configurations with defaults
 */
export function mergeWithDefaults(theme: Partial<ThemeData>, defaults: ThemeData): ThemeData {
  return {
    name: theme.name || defaults.name,
    lightModeConfig: { ...defaults.lightModeConfig, ...theme.lightModeConfig },
    darkModeConfig: { ...defaults.darkModeConfig, ...theme.darkModeConfig },
    id: theme.id || defaults.id,
    companyId: theme.companyId || defaults.companyId,
    createdById: theme.createdById || defaults.createdById,
    isDefault: theme.isDefault ?? defaults.isDefault,
  };
}

/**
 * Creates a deep copy of theme data
 */
export function cloneTheme(theme: ThemeData): ThemeData {
  return {
    name: theme.name,
    lightModeConfig: { ...theme.lightModeConfig },
    darkModeConfig: { ...theme.darkModeConfig },
    id: theme.id,
    companyId: theme.companyId,
    createdById: theme.createdById,
    isDefault: theme.isDefault,
  };
}

/**
 * Converts theme data to export format
 */
export function prepareThemeForExport(theme: ThemeData): ThemeExportData {
  return {
    name: theme.name,
    lightModeConfig: { ...theme.lightModeConfig },
    darkModeConfig: { ...theme.darkModeConfig },
  };
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Extracts all unique color names from theme
 */
export function extractColorNames(theme: ThemeData): string[] {
  const lightKeys = Object.keys(theme.lightModeConfig);
  const darkKeys = Object.keys(theme.darkModeConfig);
  return Array.from(new Set([...lightKeys, ...darkKeys])).sort();
}

/**
 * Gets color value for specific mode
 */
export function getColorForMode(theme: ThemeData, colorName: string, mode: ThemeMode): string | undefined {
  const config = mode === 'dark' ? theme.darkModeConfig : theme.lightModeConfig;
  return config[colorName];
}

/**
 * Sets color value for specific mode
 */
export function setColorForMode(
  theme: ThemeData, 
  colorName: string, 
  value: string, 
  mode: ThemeMode
): ThemeData {
  const newTheme = cloneTheme(theme);
  
  if (mode === 'dark') {
    newTheme.darkModeConfig[colorName] = value;
  } else {
    newTheme.lightModeConfig[colorName] = value;
  }
  
  return newTheme;
}

/**
 * Removes color from theme
 */
export function removeColorFromTheme(theme: ThemeData, colorName: string): ThemeData {
  const newTheme = cloneTheme(theme);
  
  delete newTheme.lightModeConfig[colorName];
  delete newTheme.darkModeConfig[colorName];
  
  return newTheme;
}

// ============================================================================
// THEME ANALYSIS
// ============================================================================

/**
 * Analyzes theme completeness
 */
export function analyzeThemeCompleteness(theme: ThemeData): {
  completeness: number;
  missingColors: string[];
  extraColors: string[];
  suggestions: string[];
} {
  const requiredColors = [
    'primary', 'primary-foreground',
    'secondary', 'secondary-foreground',
    'background', 'foreground',
    'card', 'card-foreground',
    'popover', 'popover-foreground',
    'muted', 'muted-foreground',
    'accent', 'accent-foreground',
    'destructive', 'destructive-foreground',
    'border', 'input', 'ring'
  ];

  const allColors = extractColorNames(theme);
  const presentRequired = requiredColors.filter(color => allColors.includes(color));
  const completeness = (presentRequired.length / requiredColors.length) * 100;

  const missingColors = requiredColors.filter(color => !allColors.includes(color));
  const extraColors = allColors.filter(color => !requiredColors.includes(color));

  const suggestions: string[] = [];
  
  if (missingColors.length > 0) {
    suggestions.push(`Add missing colors: ${missingColors.join(', ')}`);
  }
  
  if (extraColors.length > 5) {
    suggestions.push('Consider removing unused colors to simplify the theme');
  }

  if (completeness < 100) {
    suggestions.push('Complete all required colors for full compatibility');
  }

  return {
    completeness: Math.round(completeness),
    missingColors,
    extraColors,
    suggestions
  };
}

/**
 * Suggests foreground colors based on background colors
 */
export function suggestForegroundColors(theme: ThemeData): Record<string, string> {
  const suggestions: Record<string, string> = {};
  
  // Common background/foreground pairs
  const pairs = [
    ['primary', 'primary-foreground'],
    ['secondary', 'secondary-foreground'],
    ['card', 'card-foreground'],
    ['popover', 'popover-foreground'],
    ['muted', 'muted-foreground'],
    ['accent', 'accent-foreground'],
    ['destructive', 'destructive-foreground'],
  ];

  for (const [bg, fg] of pairs) {
    const lightBg = theme.lightModeConfig[bg];
    const darkBg = theme.darkModeConfig[bg];
    
    if (lightBg && !theme.lightModeConfig[fg]) {
      // Simple heuristic: if background is dark, use light foreground
      suggestions[`${fg}-light`] = isLightColor(lightBg) ? '#000000' : '#ffffff';
    }
    
    if (darkBg && !theme.darkModeConfig[fg]) {
      suggestions[`${fg}-dark`] = isLightColor(darkBg) ? '#000000' : '#ffffff';
    }
  }

  return suggestions;
}

/**
 * Simple heuristic to determine if a color is light
 */
function isLightColor(color: string): boolean {
  // This is a simplified check - in production, use proper luminance calculation
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  }
  
  return false; // Default to dark for non-hex colors
}

// ============================================================================
// THEME UTILITIES
// ============================================================================

/**
 * Generates a unique theme name
 */
export function generateThemeName(baseName: string, existingNames: string[]): string {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }

  let counter = 1;
  let newName = `${baseName} (${counter})`;
  
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName} (${counter})`;
  }
  
  return newName;
}

/**
 * Sanitizes theme name for file system
 */
export function sanitizeThemeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Calculates theme file size estimate
 */
export function estimateThemeSize(theme: ThemeData): {
  jsonSize: number;
  cssSize: number;
  colorCount: number;
} {
  const colorCount = extractColorNames(theme).length;
  const jsonString = JSON.stringify(prepareThemeForExport(theme));
  const jsonSize = new Blob([jsonString]).size;
  
  // Estimate CSS size (rough calculation)
  const cssSize = colorCount * 50; // ~50 bytes per CSS variable
  
  return {
    jsonSize,
    cssSize,
    colorCount
  };
}