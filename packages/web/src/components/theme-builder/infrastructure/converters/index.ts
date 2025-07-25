/**
 * Theme Builder - Infrastructure Converters Index
 * Central export point for all conversion utilities
 */

// ============================================================================
// COLOR CONVERSIONS
// ============================================================================
export {
  // Types
  type RGBColor,
  type HSLColor,
  type OKLCHColor,
  
  // Hex conversions
  hexToRgb,
  rgbToHex,
  
  // RGB conversions
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  
  // String conversions
  hexToOklch,
  oklchToHex,
  hslToOklch,
  oklchToHsl,
  rgbStringToOklch,
  oklchToRgbString,
  
  // Universal converter
  convertColor,
} from './color-converter';

// ============================================================================
// CSS CONVERSIONS
// ============================================================================
export {
  // CSS variable generation
  colorsToCSSVariables,
  generateThemeCSSVariables,
  
  // CSS file generation
  generateCSSThemeFile,
  generateCSSWithUtilities,
  
  // Typography CSS
  typographyToCSSVariables,
  generateTypographyUtilities,
  
  // Responsive CSS
  generateResponsiveCSS,
  
  // CSS rules
  generateCSSRules,
  generateScopedThemeCSS,
  
  // CSS parsing
  extractCSSVariables,
  parseCSSTheme,
  
  // CSS formatting
  minifyCSS,
  formatCSS,
} from './css-converter';

// ============================================================================
// THEME CONVERSIONS
// ============================================================================
export {
  // Format detection
  detectThemeFormat,
  
  // Import conversions
  parseJSONTheme,
  parseCSSThemeToData,
  normalizeColorValues,
  normalizeColorValue,
  
  // Export conversions
  prepareThemeForExport,
  
  // Compatibility conversions
  themeToTailwindConfig,
  themeToMaterial3Tokens,
  
  // Validation & migration
  validateImportedTheme,
  migrateThemeData,
} from './theme-converter';