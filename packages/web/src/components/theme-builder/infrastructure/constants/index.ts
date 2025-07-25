/**
 * Theme Builder - Constants Index
 * Central export point for all constants and configurations
 */

// ============================================================================
// COLOR CONSTANTS
// ============================================================================
export {
  // Color Sections
  DEFAULT_COLOR_SECTIONS,
  
  // Color Lists
  REQUIRED_COLORS,
  OPTIONAL_COLORS,
  ALL_COLOR_NAMES,
  
  // Brand Defaults
  DEFAULT_BRAND_COLORS,
  DEFAULT_BRAND_CONFIG,
  
  // Color Presets
  COLOR_PRESETS,
  
  // Accessibility
  CONTRAST_STANDARDS,
  HIGH_CONTRAST_PAIRS,
} from './color-defaults';

// ============================================================================
// BREAKPOINT CONSTANTS
// ============================================================================
export {
  // Breakpoint Definitions
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  BREAKPOINT_CONFIG,
  
  // Media Queries
  MEDIA_QUERIES,
  
  // Responsive Defaults
  RESPONSIVE_DEFAULTS,
  
  // Container Queries
  CONTAINER_BREAKPOINTS,
  CONTAINER_QUERIES,
  
  // Helper Functions
  getBreakpointConfig,
  getNextBreakpoint,
  getPreviousBreakpoint,
  isValidBreakpoint,
  getBreakpointFromWidth,
  createMediaQuery,
  createResponsiveCSS,
} from './breakpoints';

// ============================================================================
// COMMON CONSTANTS
// ============================================================================

/**
 * Application-wide configuration
 */
export const APP_CONFIG = {
  // Theme Builder Settings
  maxThemeFileSize: 5 * 1024 * 1024, // 5MB
  maxSVGFileSize: 1024 * 1024, // 1MB
  maxHistoryEntries: 50,
  debounceDelay: 300,
  throttleDelay: 100,
  
  // Color Settings
  defaultColorFormat: 'oklch' as const,
  supportedColorFormats: ['oklch', 'rgb', 'hex', 'hsl'] as const,
  
  // Export Settings
  supportedExportFormats: ['json', 'css'] as const,
  
  // UI Settings
  animationDuration: 200,
  toastDuration: 3000,
  
  // Feature Flags
  features: {
    materialDesignIntegration: true,
    advancedColorPicker: true,
    themeExport: true,
    themeImport: true,
    brandConfiguration: true,
    responsivePreview: true,
    colorLinking: true,
    accessibilityChecker: true,
  },
} as const;

/**
 * File type configurations
 */
export const FILE_TYPES = {
  theme: {
    extensions: ['.json', '.css'],
    mimeTypes: ['application/json', 'text/css'],
    maxSize: APP_CONFIG.maxThemeFileSize,
  },
  svg: {
    extensions: ['.svg'],
    mimeTypes: ['image/svg+xml'],
    maxSize: APP_CONFIG.maxSVGFileSize,
  },
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  // File Errors
  FILE_TOO_LARGE: 'File is too large. Maximum size exceeded.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file.',
  FILE_READ_ERROR: 'Failed to read file. Please try again.',
  
  // Theme Errors
  INVALID_THEME_STRUCTURE: 'Invalid theme structure. Please check the file format.',
  MISSING_REQUIRED_COLORS: 'Theme is missing required colors.',
  INVALID_COLOR_FORMAT: 'Invalid color format detected.',
  
  // Color Errors
  INVALID_COLOR_VALUE: 'Invalid color value. Please enter a valid color.',
  CONTRAST_TOO_LOW: 'Color contrast is too low for accessibility standards.',
  
  // SVG Errors
  INVALID_SVG_CONTENT: 'Invalid SVG content. Please check the file.',
  SVG_PROCESSING_ERROR: 'Failed to process SVG file.',
  
  // Export Errors
  EXPORT_FAILED: 'Failed to export theme. Please try again.',
  IMPORT_FAILED: 'Failed to import theme. Please check the file format.',
  
  // General Errors
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  THEME_SAVED: 'Theme saved successfully!',
  THEME_EXPORTED: 'Theme exported successfully!',
  THEME_IMPORTED: 'Theme imported successfully!',
  THEME_RESET: 'Theme reset to original state!',
  COLOR_COPIED: 'Color copied to clipboard!',
  SVG_UPLOADED: 'SVG uploaded successfully!',
  CHANGES_APPLIED: 'Changes applied successfully!',
} as const;

/**
 * Default theme names
 */
export const DEFAULT_THEME_NAMES = {
  light: 'Light Theme',
  dark: 'Dark Theme',
  custom: 'Custom Theme',
  imported: 'Imported Theme',
  export: 'Exported Theme',
} as const;

/**
 * Animation presets
 */
export const ANIMATIONS = {
  // Durations (in milliseconds)
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },
  
  // Easing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Common animation classes
  classes: {
    fadeIn: 'animate-fade-in',
    fadeOut: 'animate-fade-out',
    slideIn: 'animate-slide-in',
    slideOut: 'animate-slide-out',
    scaleIn: 'animate-scale-in',
    scaleOut: 'animate-scale-out',
  },
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  header: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  loading: 90,
  debug: 100,
} as const;

/**
 * Common CSS classes
 */
export const CSS_CLASSES = {
  // Layout
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-8 lg:py-12',
  
  // Typography
  heading: 'text-2xl font-bold tracking-tight',
  subheading: 'text-lg font-medium',
  body: 'text-base',
  caption: 'text-sm text-muted-foreground',
  
  // Interactive
  button: 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
  input: 'flex h-10 w-full rounded-md border px-3 py-2 text-sm',
  
  // State
  loading: 'animate-pulse',
  disabled: 'opacity-50 cursor-not-allowed',
  error: 'border-destructive text-destructive',
  success: 'border-success text-success',
} as const;