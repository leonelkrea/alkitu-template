/**
 * Theme Builder - Public API Exports
 * Clean Architecture implementation for theme management
 * 
 * Main exports for integration with applications
 */

// =============================================================================
// MAIN COMPONENTS - Ready-to-use theme builder interface
// =============================================================================

// Primary theme builder component
export { ThemeBuilder } from './ThemeBuilder';

// =============================================================================
// CONTEXTS - State management
// =============================================================================

// Main theme builder context and hooks
export { 
  ThemeBuilderProvider,
  useThemeBuilder,
  useThemeBuilderUI,
  type ThemeBuilderState
} from './presentation/contexts/ThemeBuilderContext';

// Brand configuration context
export {
  BrandProvider,
  useBrandConfig
} from './presentation/contexts/BrandContext';

// =============================================================================
// PANEL COMPONENTS - Layout components
// =============================================================================

// Main panel components
export { ActionBar } from './presentation/components/panels/ActionBar';
export { ControlPanel } from './presentation/components/panels/ControlPanel';
export { PreviewPanel } from './presentation/components/panels/PreviewPanel';
export { CodePanel } from './presentation/components/panels/CodePanel';

// =============================================================================
// EDITOR COMPONENTS - Specialized editors
// =============================================================================

// Theme configuration editors
export { ColorEditor } from './presentation/components/editors/ColorEditor';
export { BrandEditor } from './presentation/components/editors/BrandEditor';
export { TypographyEditor } from './presentation/components/editors/TypographyEditor';

// =============================================================================
// COMMON COMPONENTS - Reusable UI components
// =============================================================================

export { ColorInput } from './presentation/components/common/ColorInput';
export { ExpandableSection } from './presentation/components/common/ExpandableSection';
export { ValidationMessage } from './presentation/components/common/ValidationMessage';

// New enhanced components
export { EnhancedColorPicker } from './presentation/components/common/EnhancedColorPicker';
export { TailwindColorSelector } from './presentation/components/common/TailwindColorSelector';
export { ThemeSelector } from './presentation/components/common/ThemeSelector';
export { ThemeImportExport } from './presentation/components/common/ThemeImportExport';

// =============================================================================
// HOOKS - Specialized functionality
// =============================================================================

export { useThemeValidation } from './presentation/hooks/useThemeValidation';
export { useColorLinking } from './presentation/hooks/useColorLinking';
export { useThemeImportExport } from './presentation/hooks/useThemeImportExport';

// =============================================================================
// DOMAIN ENTITIES - Business logic (portable)
// =============================================================================

// Core domain entities
export { Theme } from './domain/entities/theme.entity';
export { ColorPalette } from './domain/entities/color-palette.entity';
export { TypographyEntity as Typography } from './domain/entities/typography.entity';
export { BrandEntity as Brand } from './domain/entities/brand.entity';

// =============================================================================
// USE CASES - Business operations (portable)
// =============================================================================

// Color management
export { ManageColorUseCase } from './domain/use-cases/color/manage-color.use-case';
export { ValidateColorUseCase } from './domain/use-cases/color/validate-color.use-case';

// Theme operations
export { ImportExportThemeUseCase } from './domain/use-cases/theme/import-export-theme.use-case';
export { SyncThemeUseCase } from './domain/use-cases/theme/sync-theme.use-case';
export { ManageThemeUseCase } from './domain/use-cases/theme/manage-theme.use-case';

// Brand operations
export { ManageBrandUseCase } from './domain/use-cases/brand/manage-brand.use-case';
export { ProcessSvgUseCase } from './domain/use-cases/brand/process-svg.use-case';

// =============================================================================
// INFRASTRUCTURE - External concerns
// =============================================================================

// Storage adapters
export { LocalStorageAdapter } from './infrastructure/storage/local-storage.adapter';
export { SessionStorageAdapter } from './infrastructure/storage/session-storage.adapter';
export { ThemeStorageAdapter } from './infrastructure/storage/theme-storage.adapter';
export { StorageFactory } from './infrastructure/storage/storage.factory';

// Validators
export { ThemeValidator } from './infrastructure/validators/theme.validator';
export { ColorValidator } from './infrastructure/validators/color.validator';
export { FileValidator } from './infrastructure/validators/file.validator';

// Converters
export { ColorConverter } from './infrastructure/converters/color-converter';
export { CssConverter } from './infrastructure/converters/css-converter';
export { ThemeConverter } from './infrastructure/converters/theme-converter';

// =============================================================================
// SHARED UTILITIES - Pure functions (100% portable)
// =============================================================================

// Utility functions (excluding conflicting BREAKPOINTS and createMediaQuery)
export { 
  // Color utilities
  isValidColor,
  isValidHex,
  isValidRgb,
  isValidHsl,
  isValidOklch,
  normalizeHex,
  ensureAlpha,
  hexToRgba,
  rgbToHex,
  hexToOklch,
  getRelativeLuminance,
  getContrastRatio,
  checkColorContrast,
  
  // Theme utilities
  validateThemeColors,
  validateThemeData,
  compareColorConfigs,
  areThemesEqual,
  mergeWithDefaults,
  cloneTheme,
  prepareThemeForExport,
  extractColorNames,
  getColorForMode,
  setColorForMode,
  removeColorFromTheme,
  analyzeThemeCompleteness,
  suggestForegroundColors,
  generateThemeName,
  sanitizeThemeName,
  estimateThemeSize,
  
  // File utilities
  isValidThemeFile,
  isValidSVGFile,
  readFileAsText,
  processSVGFile,
  parseThemeFile,
  createDownloadableFile,
  generateJSONThemeFile,
  generateCSSThemeFile,
  getFileExtension,
  formatFileSize,
  generateSafeFilename,
  isSafeFilename,
  
  // General utilities
  getCurrentBreakpoint,
  matchesMediaQuery,
  debounce,
  throttle,
  deepClone,
  deepEqual,
  omit,
  pick,
  capitalize,
  camelToKebab,
  kebabToCamel,
  truncate,
  unique,
  groupBy,
  chunk
} from './shared/utils';

// Type definitions
export type * from './shared/types/theme.types';
export type * from './shared/types/color.types';
export type * from './shared/types/common.types';

// =============================================================================
// CONSTANTS - Configuration and defaults
// =============================================================================

// Color constants
export { 
  DEFAULT_COLOR_SECTIONS,
  COLOR_SECTIONS,
  REQUIRED_COLORS,
  OPTIONAL_COLORS,
  ALL_COLOR_NAMES,
  DEFAULT_BRAND_COLORS,
  DEFAULT_BRAND_CONFIG,
  COLOR_PRESETS,
  CONTRAST_STANDARDS,
  HIGH_CONTRAST_PAIRS
} from './infrastructure/constants/color-defaults';

// Responsive constants from infrastructure (takes precedence)
export { 
  BREAKPOINTS,
  createMediaQuery
} from './infrastructure/constants';

// =============================================================================
// VERSION AND METADATA
// =============================================================================

export const THEME_BUILDER_VERSION = '1.0.0';
export const THEME_BUILDER_ARCHITECTURE = 'Clean Architecture';
export const THEME_BUILDER_PATTERNS = ['SOLID', 'DDD', 'Screaming Architecture'] as const;