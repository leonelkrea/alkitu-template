/**
 * Theme Builder - Typography Entity
 * Represents typography configuration for a theme
 * Pure domain logic with no framework dependencies
 */

import type { Breakpoint } from '../../shared/types';

/**
 * Font size scale
 */
export type FontSizeScale = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

/**
 * Font weight scale
 */
export type FontWeightScale = 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

/**
 * Line height scale
 */
export type LineHeightScale = 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';

/**
 * Typography entity - Manages font and text styling
 */
export class TypographyEntity {
  private fontFamily: string;
  private monoFontFamily: string;
  private fontSize: Map<FontSizeScale, string>;
  private fontWeight: Map<FontWeightScale, number>;
  private lineHeight: Map<FontSizeScale, string>;
  private letterSpacing: Map<string, string>;
  private responsive: Map<Breakpoint, Partial<TypographyConfig>>;

  constructor(config?: Partial<TypographyConfig>) {
    // Initialize with defaults
    this.fontFamily = config?.fontFamily || 'system-ui, -apple-system, sans-serif';
    this.monoFontFamily = config?.monoFontFamily || 'ui-monospace, monospace';
    
    // Initialize font sizes
    this.fontSize = new Map([
      ['xs', config?.fontSize?.xs || '0.75rem'],
      ['sm', config?.fontSize?.sm || '0.875rem'],
      ['base', config?.fontSize?.base || '1rem'],
      ['lg', config?.fontSize?.lg || '1.125rem'],
      ['xl', config?.fontSize?.xl || '1.25rem'],
      ['2xl', config?.fontSize?.['2xl'] || '1.5rem'],
      ['3xl', config?.fontSize?.['3xl'] || '1.875rem'],
      ['4xl', config?.fontSize?.['4xl'] || '2.25rem'],
      ['5xl', config?.fontSize?.['5xl'] || '3rem'],
    ]);

    // Initialize font weights
    this.fontWeight = new Map([
      ['thin', config?.fontWeight?.thin || 100],
      ['light', config?.fontWeight?.light || 300],
      ['normal', config?.fontWeight?.normal || 400],
      ['medium', config?.fontWeight?.medium || 500],
      ['semibold', config?.fontWeight?.semibold || 600],
      ['bold', config?.fontWeight?.bold || 700],
      ['extrabold', config?.fontWeight?.extrabold || 800],
      ['black', config?.fontWeight?.black || 900],
    ]);

    // Initialize line heights
    this.lineHeight = new Map([
      ['xs', config?.lineHeight?.xs || '1rem'],
      ['sm', config?.lineHeight?.sm || '1.25rem'],
      ['base', config?.lineHeight?.base || '1.5rem'],
      ['lg', config?.lineHeight?.lg || '1.75rem'],
      ['xl', config?.lineHeight?.xl || '1.75rem'],
      ['2xl', config?.lineHeight?.['2xl'] || '2rem'],
      ['3xl', config?.lineHeight?.['3xl'] || '2.25rem'],
      ['4xl', config?.lineHeight?.['4xl'] || '2.5rem'],
      ['5xl', config?.lineHeight?.['5xl'] || '1'],
    ]);

    // Initialize letter spacing
    this.letterSpacing = new Map([
      ['tighter', config?.letterSpacing?.tighter || '-0.05em'],
      ['tight', config?.letterSpacing?.tight || '-0.025em'],
      ['normal', config?.letterSpacing?.normal || '0em'],
      ['wide', config?.letterSpacing?.wide || '0.025em'],
      ['wider', config?.letterSpacing?.wider || '0.05em'],
      ['widest', config?.letterSpacing?.widest || '0.1em'],
    ]);

    // Initialize responsive configurations
    this.responsive = new Map(
      Object.entries(config?.responsive || {}) as [Breakpoint, Partial<TypographyConfig>][]
    );
  }

  // ============================================================================
  // GETTERS
  // ============================================================================

  getFontFamily(): string {
    return this.fontFamily;
  }

  getMonoFontFamily(): string {
    return this.monoFontFamily;
  }

  getFontSize(scale: FontSizeScale): string {
    return this.fontSize.get(scale) || '1rem';
  }

  getFontWeight(scale: FontWeightScale): number {
    return this.fontWeight.get(scale) || 400;
  }

  getLineHeight(scale: FontSizeScale): string {
    return this.lineHeight.get(scale) || '1.5rem';
  }

  getLetterSpacing(scale: string): string {
    return this.letterSpacing.get(scale) || '0em';
  }

  getResponsiveConfig(breakpoint: Breakpoint): Partial<TypographyConfig> | undefined {
    return this.responsive.get(breakpoint);
  }

  // ============================================================================
  // BUSINESS METHODS
  // ============================================================================

  /**
   * Updates the primary font family
   */
  setFontFamily(fontFamily: string): void {
    if (!fontFamily || fontFamily.trim().length === 0) {
      throw new Error('Font family cannot be empty');
    }
    this.fontFamily = fontFamily.trim();
  }

  /**
   * Updates the monospace font family
   */
  setMonoFontFamily(fontFamily: string): void {
    if (!fontFamily || fontFamily.trim().length === 0) {
      throw new Error('Monospace font family cannot be empty');
    }
    this.monoFontFamily = fontFamily.trim();
  }

  /**
   * Updates a font size
   */
  setFontSize(scale: FontSizeScale, size: string): void {
    if (!this.isValidCSSUnit(size)) {
      throw new Error(`Invalid font size: ${size}`);
    }
    this.fontSize.set(scale, size);
  }

  /**
   * Updates a font weight
   */
  setFontWeight(scale: FontWeightScale, weight: number): void {
    if (weight < 100 || weight > 900 || weight % 100 !== 0) {
      throw new Error(`Invalid font weight: ${weight}. Must be between 100-900 in increments of 100`);
    }
    this.fontWeight.set(scale, weight);
  }

  /**
   * Updates a line height
   */
  setLineHeight(scale: FontSizeScale, height: string): void {
    if (!this.isValidLineHeight(height)) {
      throw new Error(`Invalid line height: ${height}`);
    }
    this.lineHeight.set(scale, height);
  }

  /**
   * Updates letter spacing
   */
  setLetterSpacing(scale: string, spacing: string): void {
    if (!this.isValidCSSUnit(spacing)) {
      throw new Error(`Invalid letter spacing: ${spacing}`);
    }
    this.letterSpacing.set(scale, spacing);
  }

  /**
   * Sets responsive configuration for a breakpoint
   */
  setResponsiveConfig(breakpoint: Breakpoint, config: Partial<TypographyConfig>): void {
    this.responsive.set(breakpoint, config);
  }

  /**
   * Generates CSS variables for typography
   */
  toCSSVariables(): Record<string, string> {
    const vars: Record<string, string> = {
      '--font-sans': this.fontFamily,
      '--font-mono': this.monoFontFamily,
    };

    // Font sizes
    this.fontSize.forEach((value, key) => {
      vars[`--font-size-${key}`] = value;
    });

    // Font weights
    this.fontWeight.forEach((value, key) => {
      vars[`--font-weight-${key}`] = value.toString();
    });

    // Line heights
    this.lineHeight.forEach((value, key) => {
      vars[`--line-height-${key}`] = value;
    });

    // Letter spacing
    this.letterSpacing.forEach((value, key) => {
      vars[`--letter-spacing-${key}`] = value;
    });

    return vars;
  }

  /**
   * Exports typography to a plain object
   */
  toJSON(): TypographyConfig {
    return {
      fontFamily: this.fontFamily,
      monoFontFamily: this.monoFontFamily,
      fontSize: Object.fromEntries(this.fontSize),
      fontWeight: Object.fromEntries(this.fontWeight),
      lineHeight: Object.fromEntries(this.lineHeight),
      letterSpacing: Object.fromEntries(this.letterSpacing),
      responsive: Object.fromEntries(this.responsive),
    };
  }

  /**
   * Creates a copy of this typography configuration
   */
  clone(): TypographyEntity {
    return new TypographyEntity(this.toJSON());
  }

  /**
   * Validates the typography configuration
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate font families
    if (!this.fontFamily || this.fontFamily.trim().length === 0) {
      errors.push('Font family is required');
    }

    if (!this.monoFontFamily || this.monoFontFamily.trim().length === 0) {
      errors.push('Monospace font family is required');
    }

    // Validate font sizes
    this.fontSize.forEach((value, key) => {
      if (!this.isValidCSSUnit(value)) {
        errors.push(`Invalid font size for ${key}: ${value}`);
      }
    });

    // Validate line heights
    this.lineHeight.forEach((value, key) => {
      if (!this.isValidLineHeight(value)) {
        errors.push(`Invalid line height for ${key}: ${value}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Validates CSS unit values
   */
  private isValidCSSUnit(value: string): boolean {
    const pattern = /^-?\d*\.?\d+(px|rem|em|vh|vw|%|ch|ex|vmin|vmax)$/;
    return pattern.test(value.trim());
  }

  /**
   * Validates line height values
   */
  private isValidLineHeight(value: string): boolean {
    // Line height can be unitless, a length, or a percentage
    const unitlessPattern = /^\d*\.?\d+$/;
    return unitlessPattern.test(value.trim()) || this.isValidCSSUnit(value);
  }
}

/**
 * Typography configuration interface
 */
export interface TypographyConfig {
  fontFamily: string;
  monoFontFamily: string;
  fontSize: Record<string, string>;
  fontWeight: Record<string, number>;
  lineHeight: Record<string, string>;
  letterSpacing: Record<string, string>;
  responsive: Record<Breakpoint, Partial<TypographyConfig>>;
}