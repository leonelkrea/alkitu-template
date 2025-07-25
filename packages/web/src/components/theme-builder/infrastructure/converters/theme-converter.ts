/**
 * Theme Builder - Theme Converter
 * Functions for converting between different theme formats
 * Extracted from theme import/export logic as part of Clean Architecture refactor
 */

import type { 
  ThemeData,
  ColorValues,
  BrandConfig,
  ExportFormat
} from '../../shared/types';
import { parseCSSTheme } from './css-converter';
import { convertColor, hexToOklch, rgbStringToOklch, hslToOklch } from './color-converter';

// ============================================================================
// THEME FORMAT DETECTION
// ============================================================================

/**
 * Detects the format of imported theme content
 */
export function detectThemeFormat(content: string): 'json' | 'css' | 'unknown' {
  // Try to detect JSON
  try {
    JSON.parse(content);
    return 'json';
  } catch {
    // Not JSON
  }
  
  // Check for CSS patterns
  if (content.includes(':root') || content.includes('--') || content.match(/\{[\s\S]*\}/)) {
    return 'css';
  }
  
  return 'unknown';
}

// ============================================================================
// THEME IMPORT CONVERSIONS
// ============================================================================

/**
 * Converts imported JSON theme to ThemeData
 */
export function parseJSONTheme(content: string): ThemeData {
  try {
    const parsed = JSON.parse(content);
    
    // Handle different JSON structures
    if (parsed.lightModeConfig && parsed.darkModeConfig) {
      // Our format
      return {
        name: parsed.name || 'Imported Theme',
        lightModeConfig: normalizeColorValues(parsed.lightModeConfig),
        darkModeConfig: normalizeColorValues(parsed.darkModeConfig),
        brandConfig: parsed.brandConfig,
        typography: parsed.typography,
      };
    }
    
    // Handle shadcn/ui format
    if (parsed.colors) {
      const lightColors = parsed.colors.light || parsed.colors;
      const darkColors = parsed.colors.dark || parsed.colors;
      
      return {
        name: parsed.name || 'Imported Theme',
        lightModeConfig: normalizeColorValues(lightColors),
        darkModeConfig: normalizeColorValues(darkColors),
      };
    }
    
    // Handle simple key-value format
    if (typeof parsed === 'object') {
      return {
        name: 'Imported Theme',
        lightModeConfig: normalizeColorValues(parsed),
        darkModeConfig: normalizeColorValues(parsed),
      };
    }
    
    throw new Error('Unrecognized JSON theme format');
  } catch (error) {
    throw new Error(`Failed to parse JSON theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Converts CSS theme to ThemeData
 */
export function parseCSSThemeToData(content: string): ThemeData {
  const { lightColors, darkColors } = parseCSSTheme(content);
  
  return {
    name: 'Imported CSS Theme',
    lightModeConfig: normalizeColorValues(lightColors),
    darkModeConfig: normalizeColorValues(darkColors),
  };
}

/**
 * Normalizes color values to OKLCH format
 */
export function normalizeColorValues(colors: Record<string, string>): ColorValues {
  const normalized: ColorValues = {};
  
  Object.entries(colors).forEach(([key, value]) => {
    // Skip non-color values
    if (!value || typeof value !== 'string') {
      return;
    }
    
    // Normalize the key (remove -- prefix if present)
    const normalizedKey = key.replace(/^--/, '');
    
    // Convert color to OKLCH if needed
    normalized[normalizedKey] = normalizeColorValue(value);
  });
  
  return normalized;
}

/**
 * Normalizes a single color value to OKLCH format
 */
export function normalizeColorValue(value: string): string {
  // Already in OKLCH format
  if (value.includes('oklch(') || /^[\d.]+%?\s+[\d.]+\s+[\d.]+$/.test(value.trim())) {
    return value;
  }
  
  // Try to convert from other formats
  try {
    if (value.startsWith('#')) {
      return hexToOklch(value);
    } else if (value.startsWith('rgb')) {
      return rgbStringToOklch(value);
    } else if (value.startsWith('hsl')) {
      return hslToOklch(value);
    }
  } catch (error) {
    console.warn(`Failed to convert color value: ${value}`, error);
  }
  
  // Return original if conversion fails
  return value;
}

// ============================================================================
// THEME EXPORT CONVERSIONS
// ============================================================================

/**
 * Prepares theme data for export
 */
export function prepareThemeForExport(
  theme: ThemeData,
  format: ExportFormat
): { content: string; filename: string; mimeType: string } {
  const timestamp = new Date().toISOString().split('T')[0];
  const safeName = theme.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  switch (format) {
    case 'json': {
      const exportData = {
        name: theme.name,
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        generator: 'Alkitu Theme Builder',
        lightModeConfig: theme.lightModeConfig,
        darkModeConfig: theme.darkModeConfig,
        brandConfig: theme.brandConfig,
        typography: theme.typography,
        metadata: {
          colorFormat: 'oklch',
          compatibility: ['tailwindcss', 'shadcn-ui'],
        }
      };
      
      return {
        content: JSON.stringify(exportData, null, 2),
        filename: `${safeName}-theme-${timestamp}.json`,
        mimeType: 'application/json'
      };
    }
    
    case 'css': {
      const { generateCSSThemeFile } = require('./css-converter');
      return {
        content: generateCSSThemeFile(theme),
        filename: `${safeName}-theme-${timestamp}.css`,
        mimeType: 'text/css'
      };
    }
    
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

// ============================================================================
// THEME COMPATIBILITY CONVERSIONS
// ============================================================================

/**
 * Converts theme to Tailwind CSS config format
 */
export function themeToTailwindConfig(theme: ThemeData): string {
  const colors: Record<string, any> = {};
  
  // Process light mode colors
  Object.entries(theme.lightModeConfig).forEach(([key, value]) => {
    const parts = key.split('-');
    if (parts.length === 1) {
      colors[key] = {
        DEFAULT: value,
        foreground: theme.lightModeConfig[`${key}-foreground`] || value
      };
    }
  });
  
  const config = {
    theme: {
      extend: {
        colors,
        // Add dark mode colors as CSS variables
        backgroundColor: ({ theme }: any) => ({
          ...theme('colors'),
        }),
        textColor: ({ theme }: any) => ({
          ...theme('colors'),
        }),
        borderColor: ({ theme }: any) => ({
          ...theme('colors'),
        }),
      }
    }
  };
  
  return `/** @type {import('tailwindcss').Config} */
module.exports = ${JSON.stringify(config, null, 2)}`;
}

/**
 * Converts theme to Material Design 3 tokens
 */
export function themeToMaterial3Tokens(theme: ThemeData): Record<string, any> {
  const tokens: Record<string, any> = {
    schemes: {
      light: {},
      dark: {}
    }
  };
  
  // Map our color names to Material 3 token names
  const colorMapping: Record<string, string> = {
    'primary': 'primary',
    'primary-foreground': 'onPrimary',
    'secondary': 'secondary',
    'secondary-foreground': 'onSecondary',
    'accent': 'tertiary',
    'accent-foreground': 'onTertiary',
    'destructive': 'error',
    'destructive-foreground': 'onError',
    'background': 'background',
    'foreground': 'onBackground',
    'card': 'surface',
    'card-foreground': 'onSurface',
    'muted': 'surfaceVariant',
    'muted-foreground': 'onSurfaceVariant',
  };
  
  // Convert colors
  Object.entries(colorMapping).forEach(([ourName, m3Name]) => {
    if (theme.lightModeConfig[ourName]) {
      tokens.schemes.light[m3Name] = theme.lightModeConfig[ourName];
    }
    if (theme.darkModeConfig[ourName]) {
      tokens.schemes.dark[m3Name] = theme.darkModeConfig[ourName];
    }
  });
  
  return tokens;
}

// ============================================================================
// THEME VALIDATION & MIGRATION
// ============================================================================

/**
 * Validates imported theme data
 */
export function validateImportedTheme(data: any): { 
  valid: boolean; 
  errors: string[]; 
  warnings: string[] 
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check basic structure
  if (!data || typeof data !== 'object') {
    errors.push('Invalid theme data structure');
    return { valid: false, errors, warnings };
  }
  
  // Check for color configurations
  if (!data.lightModeConfig && !data.colors && !data.light) {
    errors.push('No light mode colors found');
  }
  
  // Check for required colors
  const requiredColors = ['primary', 'background', 'foreground'];
  const lightColors = data.lightModeConfig || data.colors?.light || data.light || {};
  
  requiredColors.forEach(color => {
    if (!lightColors[color]) {
      warnings.push(`Missing required color: ${color}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Migrates theme data to current format
 */
export function migrateThemeData(data: any): ThemeData {
  const migrated: ThemeData = {
    name: data.name || 'Migrated Theme',
    lightModeConfig: {},
    darkModeConfig: {},
  };
  
  // Handle different legacy formats
  if (data.colors) {
    // shadcn/ui v1 format
    migrated.lightModeConfig = normalizeColorValues(data.colors.light || data.colors);
    migrated.darkModeConfig = normalizeColorValues(data.colors.dark || data.colors);
  } else if (data.light && data.dark) {
    // Simple light/dark format
    migrated.lightModeConfig = normalizeColorValues(data.light);
    migrated.darkModeConfig = normalizeColorValues(data.dark);
  } else if (data.lightModeConfig && data.darkModeConfig) {
    // Current format
    migrated.lightModeConfig = normalizeColorValues(data.lightModeConfig);
    migrated.darkModeConfig = normalizeColorValues(data.darkModeConfig);
    migrated.brandConfig = data.brandConfig;
    migrated.typography = data.typography;
  } else {
    // Assume single color set for both modes
    const colors = normalizeColorValues(data);
    migrated.lightModeConfig = colors;
    migrated.darkModeConfig = colors;
  }
  
  return migrated;
}

// ============================================================================
// THEME CONVERTER CLASS
// ============================================================================

/**
 * Theme Converter class - provides both static and instance methods
 * for theme conversion and transformation
 */
export class ThemeConverter {
  // Static methods
  static parseJSONTheme = parseJSONTheme;
  static parseCSSThemeToData = parseCSSThemeToData;
  static detectThemeFormat = detectThemeFormat;
  static validateImportedTheme = validateImportedTheme;
  static prepareThemeForExport = prepareThemeForExport;
  static normalizeColorValues = normalizeColorValues;
  static normalizeColorValue = normalizeColorValue;
  static themeToTailwindConfig = themeToTailwindConfig;
  static themeToMaterial3Tokens = themeToMaterial3Tokens;
  static migrateThemeData = migrateThemeData;

  // Instance methods
  parseJSONTheme = parseJSONTheme;
  parseCSSThemeToData = parseCSSThemeToData;
  detectThemeFormat = detectThemeFormat;
  validateImportedTheme = validateImportedTheme;
  prepareThemeForExport = prepareThemeForExport;
  normalizeColorValues = normalizeColorValues;
  normalizeColorValue = normalizeColorValue;
  themeToTailwindConfig = themeToTailwindConfig;
  themeToMaterial3Tokens = themeToMaterial3Tokens;
  migrateThemeData = migrateThemeData;
}