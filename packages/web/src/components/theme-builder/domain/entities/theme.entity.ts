/**
 * Theme Builder - Theme Entity
 * Core business entity representing a complete theme
 * Pure domain logic with no framework dependencies
 */

import type { ColorValues, TypographyConfig, BrandConfig } from '../../shared/types';
import { ColorPalette } from './color-palette.entity';

/**
 * Theme entity - The core domain model
 * Encapsulates all theme-related business logic
 */
export class Theme {
  private _id: string;
  private _name: string;
  private _lightPalette: ColorPalette;
  private _darkPalette: ColorPalette;
  private _typography?: TypographyConfig;
  private _brandConfig?: BrandConfig;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _version: string;

  constructor(params: {
    id?: string;
    name: string;
    lightColors: ColorValues;
    darkColors: ColorValues;
    typography?: TypographyConfig;
    brandConfig?: BrandConfig;
    version?: string;
  }) {
    this._id = params.id || this.generateId();
    this._name = params.name;
    this._lightPalette = new ColorPalette(params.lightColors, 'light');
    this._darkPalette = new ColorPalette(params.darkColors, 'dark');
    this._typography = params.typography;
    this._brandConfig = params.brandConfig;
    this._version = params.version || '1.0.0';
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  // ============================================================================
  // GETTERS
  // ============================================================================

  get id(): string {
    return this._id;
  }

  /**
   * Gets the theme ID (alternative method name for compatibility)
   */
  getId(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get lightPalette(): ColorPalette {
    return this._lightPalette;
  }

  get darkPalette(): ColorPalette {
    return this._darkPalette;
  }

  get typography(): TypographyConfig | undefined {
    return this._typography;
  }

  get brandConfig(): BrandConfig | undefined {
    return this._brandConfig;
  }

  get version(): string {
    return this._version;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ============================================================================
  // BUSINESS METHODS
  // ============================================================================

  /**
   * Updates the theme name
   */
  setName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Theme name cannot be empty');
    }
    this._name = name.trim();
    this.touch();
  }

  /**
   * Updates a color in both light and dark palettes
   */
  updateColor(colorName: string, lightValue: string, darkValue: string): void {
    this._lightPalette.updateColor(colorName, lightValue);
    this._darkPalette.updateColor(colorName, darkValue);
    this.touch();
  }

  /**
   * Updates a color in a specific palette
   */
  updatePaletteColor(mode: 'light' | 'dark', colorName: string, value: string): void {
    const palette = mode === 'light' ? this._lightPalette : this._darkPalette;
    palette.updateColor(colorName, value);
    this.touch();
  }

  /**
   * Links a color to another color in both palettes
   */
  linkColor(colorName: string, targetColor: string): void {
    this._lightPalette.linkColor(colorName, targetColor);
    this._darkPalette.linkColor(colorName, targetColor);
    this.touch();
  }

  /**
   * Unlinks a color in both palettes
   */
  unlinkColor(colorName: string): void {
    this._lightPalette.unlinkColor(colorName);
    this._darkPalette.unlinkColor(colorName);
    this.touch();
  }

  /**
   * Updates typography configuration
   */
  updateTypography(typography: TypographyConfig): void {
    this._typography = typography;
    this.touch();
  }

  /**
   * Updates brand configuration
   */
  updateBrandConfig(brandConfig: BrandConfig): void {
    this._brandConfig = brandConfig;
    this.touch();
  }

  /**
   * Checks if the theme has unsaved changes
   */
  hasChanges(originalTheme: Theme): boolean {
    return (
      this._name !== originalTheme.name ||
      !this._lightPalette.equals(originalTheme.lightPalette) ||
      !this._darkPalette.equals(originalTheme.darkPalette) ||
      JSON.stringify(this._typography) !== JSON.stringify(originalTheme.typography) ||
      JSON.stringify(this._brandConfig) !== JSON.stringify(originalTheme.brandConfig)
    );
  }

  /**
   * Validates the theme
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate name
    if (!this._name || this._name.trim().length === 0) {
      errors.push('Theme name is required');
    }

    // Validate palettes
    const lightValidation = this._lightPalette.validate();
    if (!lightValidation.valid) {
      errors.push(...lightValidation.errors.map(e => `Light palette: ${e}`));
    }

    const darkValidation = this._darkPalette.validate();
    if (!darkValidation.valid) {
      errors.push(...darkValidation.errors.map(e => `Dark palette: ${e}`));
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Creates a copy of the theme
   */
  clone(): Theme {
    return new Theme({
      id: this.generateId(), // New ID for the clone
      name: `${this._name} (Copy)`,
      lightColors: this._lightPalette.toColorValues(),
      darkColors: this._darkPalette.toColorValues(),
      typography: this._typography ? { ...this._typography } : undefined,
      brandConfig: this._brandConfig ? { ...this._brandConfig } : undefined,
      version: this._version
    });
  }

  /**
   * Exports theme to a plain object
   */
  toJSON(): {
    id: string;
    name: string;
    version: string;
    lightModeConfig: ColorValues;
    darkModeConfig: ColorValues;
    typography?: TypographyConfig;
    brandConfig?: BrandConfig;
    metadata: {
      createdAt: string;
      updatedAt: string;
    };
  } {
    return {
      id: this._id,
      name: this._name,
      version: this._version,
      lightModeConfig: this._lightPalette.toColorValues(),
      darkModeConfig: this._darkPalette.toColorValues(),
      typography: this._typography,
      brandConfig: this._brandConfig,
      metadata: {
        createdAt: this._createdAt.toISOString(),
        updatedAt: this._updatedAt.toISOString()
      }
    };
  }

  /**
   * Creates a theme from a plain object
   */
  static fromJSON(data: any): Theme {
    return new Theme({
      id: data.id,
      name: data.name,
      lightColors: data.lightModeConfig || data.lightColors,
      darkColors: data.darkModeConfig || data.darkColors,
      typography: data.typography,
      brandConfig: data.brandConfig,
      version: data.version
    });
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Updates the last modified timestamp
   */
  private touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * Generates a unique ID for the theme
   */
  private generateId(): string {
    return `theme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}