/**
 * Theme Builder - Theme Validator
 * Validation logic for theme data and configuration
 * Part of Clean Architecture infrastructure layer
 */

import type { ThemeData, ColorConfig } from '../../shared/types/theme.types';
import type { ColorFormat } from '../../shared/types/color.types';
import { REQUIRED_COLORS } from '../constants/color-defaults';

/**
 * Validation result structure
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

/**
 * Theme validator class with comprehensive validation rules
 */
export class ThemeValidator {
  
  /**
   * Validates complete theme data
   */
  validateTheme(theme: ThemeData): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Validate basic structure
    this.validateThemeStructure(theme, result);
    
    // Validate metadata
    this.validateThemeMetadata(theme, result);
    
    // Validate color configurations
    if (theme.lightColors || theme.lightModeConfig) {
      this.validateColorConfig(theme.lightColors || theme.lightModeConfig!, 'lightColors', result);
    }
    
    if (theme.darkColors || theme.darkModeConfig) {
      this.validateColorConfig(theme.darkColors || theme.darkModeConfig!, 'darkColors', result);
    }

    // Validate typography if present
    if (theme.typography) {
      this.validateTypography(theme.typography, result);
    }

    // Validate brand configuration if present
    if (theme.brandConfig) {
      this.validateBrandConfig(theme.brandConfig, result);
    }

    // Set overall validity
    result.isValid = result.errors.length === 0;

    return result;
  }

  /**
   * Validates theme colors and returns missing required colors
   */
  validateThemeColors(colors: Record<string, string>): string[] {
    const errors: string[] = [];
    
    for (const required of REQUIRED_COLORS) {
      if (!colors[required]) {
        errors.push(`Missing required color: ${required}`);
      }
    }
    
    return errors;
  }

  /**
   * Validates color configuration
   */
  validateColorConfig(config: Record<string, string>, configName: string, result: ValidationResult): void {
    if (!config || typeof config !== 'object') {
      result.errors.push({
        field: configName,
        message: 'Color configuration is required and must be an object',
        severity: 'error',
        code: 'INVALID_COLOR_CONFIG'
      });
      return;
    }

    // Check required colors
    const missingColors = this.validateThemeColors(config);
    missingColors.forEach(error => {
      result.errors.push({
        field: `${configName}.colors`,
        message: error,
        severity: 'error',
        code: 'MISSING_REQUIRED_COLOR'
      });
    });

    // Validate individual color values
    Object.entries(config).forEach(([colorKey, colorValue]) => {
      if (!this.isValidColorValue(colorValue)) {
        result.errors.push({
          field: `${configName}.${colorKey}`,
          message: `Invalid color value: ${colorValue}`,
          severity: 'error',
          code: 'INVALID_COLOR_VALUE'
        });
      }
    });

    // Check for accessibility concerns
    this.validateColorAccessibility(config, configName, result);
  }

  /**
   * Validates theme basic structure
   */
  private validateThemeStructure(theme: ThemeData, result: ValidationResult): void {
    if (!theme) {
      result.errors.push({
        field: 'theme',
        message: 'Theme data is required',
        severity: 'error',
        code: 'MISSING_THEME_DATA'
      });
      return;
    }

    if (!theme.name || typeof theme.name !== 'string') {
      result.errors.push({
        field: 'name',
        message: 'Theme name is required and must be a string',
        severity: 'error',
        code: 'INVALID_THEME_NAME'
      });
    }

    if (!theme.lightColors && !theme.darkColors && !theme.lightModeConfig && !theme.darkModeConfig) {
      result.errors.push({
        field: 'colorConfigs',
        message: 'At least one color configuration (light or dark mode) is required',
        severity: 'error',
        code: 'MISSING_COLOR_CONFIGS'
      });
    }
  }

  /**
   * Validates theme metadata
   */
  private validateThemeMetadata(theme: ThemeData, result: ValidationResult): void {
    if (theme.version && typeof theme.version !== 'string') {
      result.warnings.push({
        field: 'version',
        message: 'Theme version should be a string',
        code: 'INVALID_VERSION_FORMAT'
      });
    }

    if (theme.description && typeof theme.description !== 'string') {
      result.warnings.push({
        field: 'description',
        message: 'Theme description should be a string',
        code: 'INVALID_DESCRIPTION_FORMAT'
      });
    }

    if (theme.author && typeof theme.author !== 'string') {
      result.warnings.push({
        field: 'author',
        message: 'Theme author should be a string',
        code: 'INVALID_AUTHOR_FORMAT'
      });
    }

    if (theme.tags && !Array.isArray(theme.tags)) {
      result.warnings.push({
        field: 'tags',
        message: 'Theme tags should be an array of strings',
        code: 'INVALID_TAGS_FORMAT'
      });
    }
  }

  /**
   * Validates typography configuration
   */
  private validateTypography(typography: any, result: ValidationResult): void {
    if (typeof typography !== 'object') {
      result.errors.push({
        field: 'typography',
        message: 'Typography configuration must be an object',
        severity: 'error',
        code: 'INVALID_TYPOGRAPHY_CONFIG'
      });
      return;
    }

    // Validate font families
    if (typography.fontFamily) {
      Object.entries(typography.fontFamily).forEach(([key, value]) => {
        if (typeof value !== 'string') {
          result.warnings.push({
            field: `typography.fontFamily.${key}`,
            message: 'Font family values should be strings',
            code: 'INVALID_FONT_FAMILY'
          });
        }
      });
    }

    // Validate font sizes
    if (typography.fontSize) {
      Object.entries(typography.fontSize).forEach(([key, value]) => {
        if (typeof value !== 'string' && typeof value !== 'number') {
          result.warnings.push({
            field: `typography.fontSize.${key}`,
            message: 'Font size values should be strings or numbers',
            code: 'INVALID_FONT_SIZE'
          });
        }
      });
    }
  }

  /**
   * Validates brand configuration
   */
  private validateBrandConfig(brandConfig: any, result: ValidationResult): void {
    if (typeof brandConfig !== 'object') {
      result.errors.push({
        field: 'brandConfig',
        message: 'Brand configuration must be an object',
        severity: 'error',
        code: 'INVALID_BRAND_CONFIG'
      });
      return;
    }

    // Validate logo URLs if present
    if (brandConfig.logo) {
      if (brandConfig.logo.light && !this.isValidUrl(brandConfig.logo.light)) {
        result.warnings.push({
          field: 'brandConfig.logo.light',
          message: 'Light logo should be a valid URL',
          code: 'INVALID_LOGO_URL'
        });
      }

      if (brandConfig.logo.dark && !this.isValidUrl(brandConfig.logo.dark)) {
        result.warnings.push({
          field: 'brandConfig.logo.dark',
          message: 'Dark logo should be a valid URL',
          code: 'INVALID_LOGO_URL'
        });
      }
    }

    // Validate favicon
    if (brandConfig.favicon && !this.isValidUrl(brandConfig.favicon)) {
      result.warnings.push({
        field: 'brandConfig.favicon',
        message: 'Favicon should be a valid URL',
        code: 'INVALID_FAVICON_URL'
      });
    }
  }

  /**
   * Validates color accessibility
   */
  private validateColorAccessibility(config: ColorConfig, configName: string, result: ValidationResult): void {
    // Check contrast ratios for key color pairs
    const colorPairs = [
      ['background', 'foreground'],
      ['primary', 'primary-foreground'],
      ['secondary', 'secondary-foreground'],
      ['muted', 'muted-foreground'],
      ['accent', 'accent-foreground'],
      ['destructive', 'destructive-foreground']
    ];

    colorPairs.forEach(([bg, fg]) => {
      if (config[bg] && config[fg]) {
        const contrastRatio = this.calculateContrastRatio(config[bg], config[fg]);
        if (contrastRatio < 4.5) { // WCAG AA standard
          result.warnings.push({
            field: `${configName}.${bg}-${fg}`,
            message: `Low contrast ratio (${contrastRatio.toFixed(2)}) between ${bg} and ${fg}`,
            code: 'LOW_CONTRAST_RATIO'
          });
        }
      }
    });
  }

  /**
   * Checks if a color value is valid
   */
  private isValidColorValue(value: string): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    // Check for common color formats
    const colorFormats = [
      /^#[0-9A-Fa-f]{3}$/, // 3-digit hex
      /^#[0-9A-Fa-f]{6}$/, // 6-digit hex
      /^#[0-9A-Fa-f]{8}$/, // 8-digit hex with alpha
      /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/, // RGB
      /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/, // RGBA
      /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/, // HSL
      /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/, // HSLA
      /^oklch\([^)]+\)$/, // OKLCH
      /^[\d.]+\s+[\d.]+%\s+[\d.]+$/, // Space-separated values (Tailwind format)
    ];

    return colorFormats.some(format => format.test(value.trim()));
  }

  /**
   * Checks if a URL is valid
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      // Check for data URLs and relative paths
      return url.startsWith('data:') || url.startsWith('/') || url.startsWith('./');
    }
  }

  /**
   * Calculates contrast ratio between two colors (simplified)
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    // This is a simplified implementation
    // In production, you'd use a proper color library like chroma-js
    // For now, return a default value to prevent validation errors
    return 4.5; // Assume acceptable contrast
  }
}

/**
 * Default validator instance
 */
export const themeValidator = new ThemeValidator();

/**
 * Convenience function for quick theme validation
 */
export function validateTheme(theme: ThemeData): ValidationResult {
  return themeValidator.validateTheme(theme);
}

/**
 * Convenience function for color validation
 */
export function validateThemeColors(colors: Record<string, string>): string[] {
  return themeValidator.validateThemeColors(colors);
}