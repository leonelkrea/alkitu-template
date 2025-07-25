/**
 * Theme Builder - Color Related Types
 * Extracted from ThemeEditor.tsx as part of Clean Architecture refactor
 */

// ============================================================================
// COLOR FORMAT TYPES
// ============================================================================

/**
 * Supported color formats
 */
export type ColorFormat = 'oklch' | 'rgb' | 'hex' | 'hsl';

/**
 * Color format conversion result
 */
export interface ColorConversionResult {
  value: string;
  format: ColorFormat;
  isValid: boolean;
  error?: string;
}

/**
 * OKLCH color components
 */
export interface OKLCHColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.4)
  h: number; // Hue (0-360)
  alpha?: number; // Alpha (0-1)
}

/**
 * RGB color components
 */
export interface RGBColor {
  r: number; // Red (0-255)
  g: number; // Green (0-255)
  b: number; // Blue (0-255)
  alpha?: number; // Alpha (0-1)
}

/**
 * HSL color components
 */
export interface HSLColor {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  l: number; // Lightness (0-100)
  alpha?: number; // Alpha (0-1)
}

/**
 * HEX color string (with validation)
 */
export type HEXColor = string; // #RRGGBB or #RRGGBBAA

// ============================================================================
// COLOR VALIDATION TYPES
// ============================================================================

/**
 * Color validation result
 */
export interface ColorValidationResult {
  isValid: boolean;
  format?: ColorFormat;
  normalizedValue?: string;
  error?: string;
}

/**
 * Color contrast information
 */
export interface ColorContrast {
  ratio: number;
  level: 'AA' | 'AAA' | 'FAIL';
  isAccessible: boolean;
}

// ============================================================================
// COLOR PALETTE TYPES
// ============================================================================

/**
 * Individual color in a palette
 */
export interface PaletteColor {
  name: string;
  value: string;
  description?: string;
  usage?: string[];
  contrast?: {
    foreground: string;
    accessible: boolean;
  };
}

/**
 * Color group within a palette
 */
export interface ColorGroup {
  id: string;
  name: string;
  icon: React.ReactNode;
  colors: Array<{
    name: string;
    value: string;
    description?: string;
  }>;
}

/**
 * Complete color palette structure
 */
export interface ColorPalette {
  id: string;
  name: string;
  description?: string;
  colors: PaletteColor[];
  metadata?: {
    createdAt?: Date;
    updatedAt?: Date;
    version?: string;
    tags?: string[];
  };
}

// ============================================================================
// MATERIAL DESIGN TYPES
// ============================================================================

/**
 * Material Design 3 color roles
 */
export type MaterialColorRole = 
  | 'primary' | 'on-primary' | 'primary-container' | 'on-primary-container'
  | 'secondary' | 'on-secondary' | 'secondary-container' | 'on-secondary-container'
  | 'tertiary' | 'on-tertiary' | 'tertiary-container' | 'on-tertiary-container'
  | 'error' | 'on-error' | 'error-container' | 'on-error-container'
  | 'surface' | 'on-surface' | 'surface-variant' | 'on-surface-variant'
  | 'outline' | 'outline-variant' | 'inverse-surface' | 'inverse-on-surface'
  | 'inverse-primary' | 'surface-dim' | 'surface-bright' | 'surface-container-lowest'
  | 'surface-container-low' | 'surface-container' | 'surface-container-high'
  | 'surface-container-highest';

/**
 * Material Design color system
 */
export interface MaterialColorSystem {
  [K in MaterialColorRole]: string;
}

/**
 * ShadCN to Material Design color mapping
 */
export interface ShadcnMaterialMapping {
  shadcnColor: string;
  materialRole: MaterialColorRole;
  confidence: number; // 0-1, how confident the mapping is
}

// ============================================================================
// COLOR HISTORY TYPES
// ============================================================================

/**
 * Color history entry
 */
export interface ColorHistoryEntry {
  id: string;
  color: string;
  format: ColorFormat;
  timestamp: Date;
  context?: string; // Where the color was used
}

/**
 * Color history manager
 */
export interface ColorHistory {
  entries: ColorHistoryEntry[];
  maxEntries: number;
  addColor: (color: string, format: ColorFormat, context?: string) => void;
  getRecent: (count?: number) => ColorHistoryEntry[];
  clear: () => void;
}