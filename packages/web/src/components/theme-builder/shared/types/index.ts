/**
 * Theme Builder - Types Index
 * Central export point for all type definitions
 */

// ============================================================================
// THEME TYPES
// ============================================================================
export type {
  // Core Theme Types
  ColorConfig,
  ColorSection,
  ThemeMode,
  ThemeEditorTab,
  ColorSubTab,
  ExportFormat,
  
  // Color Management
  ColorLinkState,
  ColorLinksState,
  ColorValues,
  
  // Brand Types
  BrandConfig,
  SVGUploadStatus,
  
  // Component Props
  ControlSectionProps,
  EnhancedColorPickerProps,
  ColorLinkingControlsProps,
  BrandEditorProps,
  SVGCropperProps,
  
  // Theme Data
  ThemeData,
  ThemeExportData,
  
  // Utilities
  CropArea,
  FileUploadResult,
} from './theme.types';

// ============================================================================
// COLOR TYPES
// ============================================================================
export type {
  // Color Formats
  ColorFormat,
  ColorConversionResult,
  OKLCHColor,
  RGBColor,
  HSLColor,
  HEXColor,
  
  // Color Validation
  ColorValidationResult,
  ColorContrast,
  
  // Color Palettes
  PaletteColor,
  ColorGroup,
  ColorPalette,
  
  // Material Design
  MaterialColorRole,
  MaterialColorSystem,
  ShadcnMaterialMapping,
  
  // Color History
  ColorHistoryEntry,
  ColorHistory,
} from './color.types';

// ============================================================================
// COMMON TYPES
// ============================================================================
export type {
  // Utilities
  Callback,
  EventHandler,
  ChangeHandler,
  AsyncCallback,
  
  // Component Base
  BaseComponentProps,
  LoadableComponent,
  ErrorableComponent,
  DisableableComponent,
  ComponentState,
  
  // Data Handling
  ApiResponse,
  PaginationInfo,
  SortInfo,
  FilterInfo,
  
  // Validation
  ValidationRule,
  ValidationResult,
  FieldValidation,
  
  // Responsive Design
  Breakpoint,
  ResponsiveValue,
  MediaQuery,
  
  // File Handling
  FileUploadStatus,
  FileInfo,
  FileUploadResult,
  
  // Typography
  TypographyStyle,
  TypographyConfig,
  
  // Configuration
  FeatureFlags,
  PerformanceSettings,
  AccessibilitySettings,
  AppConfig,
  
  // Events
  CustomEventData,
  ThemeBuilderEvent,
  
  // Analytics
  UsageAnalytics,
  PerformanceMetrics,
} from './common.types';

// ============================================================================
// TYPE GUARDS AND UTILITIES
// ============================================================================

/**
 * Type guard to check if a value is a valid color format
 */
export function isValidColorFormat(format: string): format is ColorFormat {
  return ['oklch', 'rgb', 'hex', 'hsl'].includes(format);
}

/**
 * Type guard to check if a value is a valid theme mode
 */
export function isValidThemeMode(mode: string): mode is ThemeMode {
  return ['light', 'dark'].includes(mode);
}

/**
 * Type guard to check if a value is a valid breakpoint
 */
export function isValidBreakpoint(breakpoint: string): breakpoint is Breakpoint {
  return ['mobile', 'tablet', 'desktop', 'tv'].includes(breakpoint);
}

/**
 * Type guard to check if a value is a valid export format
 */
export function isValidExportFormat(format: string): format is ExportFormat {
  return ['json', 'css'].includes(format);
}

// ============================================================================
// ADVANCED UTILITY TYPES
// ============================================================================

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extract function types from an object
 */
export type FunctionProperties<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] : never;
};

/**
 * Extract non-function types from an object
 */
export type NonFunctionProperties<T> = {
  [K in keyof T]: T[K] extends Function ? never : T[K];
};

/**
 * Create a union type from an object's values
 */
export type ValueOf<T> = T[keyof T];

/**
 * Create a type that requires at least one property from T
 */
export type AtLeastOne<T> = {
  [K in keyof T]: Pick<T, K> & Partial<Omit<T, K>>;
}[keyof T];

/**
 * Create a type that allows exactly one property from T
 */
export type ExactlyOne<T> = {
  [K in keyof T]: Pick<T, K> & {
    [P in Exclude<keyof T, K>]?: never;
  };
}[keyof T];