/**
 * Theme Builder - Validate Color Use Case
 * Business logic for color validation operations
 * Pure domain logic with no framework dependencies
 */

import type { ColorValidationResult, ColorFormat } from '../../../shared/types';
import { Theme } from '../../entities/theme.entity';
import { REQUIRED_COLORS, CONTRAST_STANDARDS } from '../../../infrastructure/constants';

/**
 * Use case for validating colors and color schemes
 */
export class ValidateColorUseCase {

  /**
   * Validates a single color value
   */
  validateColor(color: string): ColorValidationResult {
    if (!color || color.trim().length === 0) {
      return {
        isValid: false,
        error: 'Color value cannot be empty'
      };
    }

    const trimmedColor = color.trim();

    // Check for different color formats
    const format = this.detectColorFormat(trimmedColor);
    
    if (!format) {
      return {
        isValid: false,
        error: 'Unrecognized color format'
      };
    }

    // Validate specific format
    const formatValidation = this.validateColorFormat(trimmedColor, format);
    
    return {
      isValid: formatValidation.isValid,
      format: formatValidation.isValid ? format : undefined,
      normalizedValue: formatValidation.normalizedValue,
      error: formatValidation.error
    };
  }

  /**
   * Validates a complete theme
   */
  validateTheme(theme: Theme): ThemeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate theme name
    if (!theme.name || theme.name.trim().length === 0) {
      errors.push('Theme name is required');
    }

    // Validate palettes
    const lightValidation = theme.lightPalette.validate();
    const darkValidation = theme.darkPalette.validate();

    if (!lightValidation.valid) {
      errors.push(...lightValidation.errors.map(e => `Light mode: ${e}`));
    }

    if (!darkValidation.valid) {
      errors.push(...darkValidation.errors.map(e => `Dark mode: ${e}`));
    }

    // Check for required colors
    const missingColors = this.findMissingRequiredColors(theme);
    if (missingColors.length > 0) {
      errors.push(`Missing required colors: ${missingColors.join(', ')}`);
    }

    // Check for accessibility issues
    const accessibilityIssues = this.validateAccessibility(theme);
    warnings.push(...accessibilityIssues);

    // Check for color consistency
    const consistencyIssues = this.validateColorConsistency(theme);
    warnings.push(...consistencyIssues);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: this.calculateThemeScore(theme, errors, warnings)
    };
  }

  /**
   * Validates color accessibility between two colors
   */
  validateColorAccessibility(
    backgroundColor: string,
    foregroundColor: string,
    level: 'AA' | 'AAA' = 'AA'
  ): AccessibilityValidationResult {
    try {
      const contrastRatio = this.calculateContrastRatio(backgroundColor, foregroundColor);
      const requiredRatio = CONTRAST_STANDARDS[level];
      
      return {
        isValid: contrastRatio >= requiredRatio,
        contrastRatio,
        requiredRatio,
        level,
        recommendation: contrastRatio < requiredRatio 
          ? this.generateAccessibilityRecommendation(contrastRatio, requiredRatio)
          : undefined
      };
    } catch (error) {
      return {
        isValid: false,
        contrastRatio: 0,
        requiredRatio: CONTRAST_STANDARDS[level],
        level,
        error: error instanceof Error ? error.message : 'Failed to calculate contrast'
      };
    }
  }

  /**
   * Validates that a color palette has good color harmony
   */
  validateColorHarmony(colors: Record<string, string>): ColorHarmonyResult {
    const analysis: ColorHarmonyResult = {
      isHarmonious: true,
      issues: [],
      suggestions: [],
      harmonyType: 'custom'
    };

    // Check for color temperature consistency
    const temperatures = this.analyzeColorTemperatures(colors);
    if (temperatures.mixed && temperatures.inconsistentRatio > 0.3) {
      analysis.issues.push('Mixed warm and cool colors may create visual tension');
      analysis.suggestions.push('Consider maintaining color temperature consistency');
      analysis.isHarmonious = false;
    }

    // Check for saturation balance
    const saturations = this.analyzeSaturations(colors);
    if (saturations.highVariance) {
      analysis.issues.push('High saturation variance may reduce visual cohesion');
      analysis.suggestions.push('Consider normalizing color saturations');
    }

    // Detect harmony patterns
    analysis.harmonyType = this.detectHarmonyPattern(colors);

    return analysis;
  }

  /**
   * Validates color links in a theme
   */
  validateColorLinks(theme: Theme): ColorLinkValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];

    // Check light palette links
    const lightLinks = theme.lightPalette.getLinks();
    const darkLinks = theme.darkPalette.getLinks();

    // Validate individual links
    lightLinks.forEach(link => {
      if (!theme.lightPalette.getColor(link.target)) {
        issues.push(`Light mode: ${link.source} is linked to non-existent color ${link.target}`);
      }
    });

    darkLinks.forEach(link => {
      if (!theme.darkPalette.getColor(link.target)) {
        issues.push(`Dark mode: ${link.source} is linked to non-existent color ${link.target}`);
      }
    });

    // Check for broken chains
    const brokenChains = this.findBrokenLinkChains(theme);
    issues.push(...brokenChains);

    // Check for inconsistent linking between modes
    const inconsistentLinks = this.findInconsistentLinks(lightLinks, darkLinks);
    warnings.push(...inconsistentLinks);

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      linkCount: {
        light: lightLinks.length,
        dark: darkLinks.length
      }
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Detects the format of a color string
   */
  private detectColorFormat(color: string): ColorFormat | null {
    if (/^#[0-9A-Fa-f]{3,8}$/.test(color)) return 'hex';
    if (/^rgba?\(/.test(color)) return 'rgb';
    if (/^hsla?\(/.test(color)) return 'hsl';
    if (/^oklch\(/.test(color) || /^[\d.]+%?\s+[\d.]+\s+[\d.]+$/.test(color)) return 'oklch';
    return null;
  }

  /**
   * Validates a color in a specific format
   */
  private validateColorFormat(color: string, format: ColorFormat): {
    isValid: boolean;
    normalizedValue?: string;
    error?: string;
  } {
    switch (format) {
      case 'hex':
        return this.validateHexColor(color);
      case 'rgb':
        return this.validateRgbColor(color);
      case 'hsl':
        return this.validateHslColor(color);
      case 'oklch':
        return this.validateOklchColor(color);
      default:
        return { isValid: false, error: 'Unknown color format' };
    }
  }

  /**
   * Validates a hex color
   */
  private validateHexColor(color: string): { isValid: boolean; normalizedValue?: string; error?: string } {
    const hexPattern = /^#[0-9A-Fa-f]{3,8}$/;
    
    if (!hexPattern.test(color)) {
      return { isValid: false, error: 'Invalid hex color format' };
    }

    // Normalize to 6-digit format
    let normalized = color;
    if (color.length === 4) {
      normalized = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }

    return { isValid: true, normalizedValue: normalized.toLowerCase() };
  }

  /**
   * Validates an RGB color
   */
  private validateRgbColor(color: string): { isValid: boolean; normalizedValue?: string; error?: string } {
    const rgbPattern = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([01]?\.?\d*))?\s*\)$/;
    const match = color.match(rgbPattern);

    if (!match) {
      return { isValid: false, error: 'Invalid RGB color format' };
    }

    const [, r, g, b, a] = match;
    const red = parseInt(r);
    const green = parseInt(g);
    const blue = parseInt(b);
    const alpha = a ? parseFloat(a) : 1;

    if (red > 255 || green > 255 || blue > 255) {
      return { isValid: false, error: 'RGB values must be between 0 and 255' };
    }

    if (alpha < 0 || alpha > 1) {
      return { isValid: false, error: 'Alpha value must be between 0 and 1' };
    }

    const normalized = alpha === 1 
      ? `rgb(${red}, ${green}, ${blue})`
      : `rgba(${red}, ${green}, ${blue}, ${alpha})`;

    return { isValid: true, normalizedValue: normalized };
  }

  /**
   * Validates an HSL color
   */
  private validateHslColor(color: string): { isValid: boolean; normalizedValue?: string; error?: string } {
    const hslPattern = /^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([01]?\.?\d*))?\s*\)$/;
    const match = color.match(hslPattern);

    if (!match) {
      return { isValid: false, error: 'Invalid HSL color format' };
    }

    const [, h, s, l, a] = match;
    const hue = parseInt(h);
    const saturation = parseInt(s);
    const lightness = parseInt(l);
    const alpha = a ? parseFloat(a) : 1;

    if (hue > 360) {
      return { isValid: false, error: 'Hue must be between 0 and 360' };
    }

    if (saturation > 100 || lightness > 100) {
      return { isValid: false, error: 'Saturation and lightness must be between 0 and 100' };
    }

    if (alpha < 0 || alpha > 1) {
      return { isValid: false, error: 'Alpha value must be between 0 and 1' };
    }

    const normalized = alpha === 1
      ? `hsl(${hue}, ${saturation}%, ${lightness}%)`
      : `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

    return { isValid: true, normalizedValue: normalized };
  }

  /**
   * Validates an OKLCH color
   */
  private validateOklchColor(color: string): { isValid: boolean; normalizedValue?: string; error?: string } {
    // Handle both function notation and space-separated values
    const functionPattern = /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/;
    const spacePattern = /^([\d.]+%?)\s+([\d.]+)\s+([\d.]+)$/;
    
    let match = color.match(functionPattern) || color.match(spacePattern);
    
    if (!match) {
      return { isValid: false, error: 'Invalid OKLCH color format' };
    }

    const [, l, c, h] = match;
    let lightness = parseFloat(l);
    const chroma = parseFloat(c);
    const hue = parseFloat(h);

    // Handle percentage notation
    if (l.includes('%')) {
      lightness = lightness / 100;
    }

    if (lightness < 0 || lightness > 1) {
      return { isValid: false, error: 'OKLCH lightness must be between 0 and 1 (or 0% and 100%)' };
    }

    if (chroma < 0) {
      return { isValid: false, error: 'OKLCH chroma cannot be negative' };
    }

    if (hue < 0 || hue > 360) {
      return { isValid: false, error: 'OKLCH hue must be between 0 and 360' };
    }

    const normalized = `${(lightness * 100).toFixed(1)}% ${chroma.toFixed(3)} ${Math.round(hue)}`;
    
    return { isValid: true, normalizedValue: normalized };
  }

  /**
   * Finds missing required colors in a theme
   */
  private findMissingRequiredColors(theme: Theme): string[] {
    const missing: string[] = [];
    
    REQUIRED_COLORS.forEach(colorName => {
      if (!theme.lightPalette.getColor(colorName)) {
        missing.push(colorName);
      }
    });

    return missing;
  }

  /**
   * Validates theme accessibility
   */
  private validateAccessibility(theme: Theme): string[] {
    const issues: string[] = [];
    
    // Common color pairs to check
    const pairs = [
      { bg: 'primary', fg: 'primary-foreground' },
      { bg: 'secondary', fg: 'secondary-foreground' },
      { bg: 'background', fg: 'foreground' },
      { bg: 'card', fg: 'card-foreground' },
    ];

    pairs.forEach(({ bg, fg }) => {
      const lightBg = theme.lightPalette.getColor(bg);
      const lightFg = theme.lightPalette.getColor(fg);
      
      if (lightBg && lightFg) {
        const contrast = this.calculateContrastRatio(lightBg, lightFg);
        if (contrast < CONTRAST_STANDARDS.AA) {
          issues.push(`Low contrast between ${bg} and ${fg} in light mode (${contrast.toFixed(2)}:1)`);
        }
      }

      const darkBg = theme.darkPalette.getColor(bg);
      const darkFg = theme.darkPalette.getColor(fg);
      
      if (darkBg && darkFg) {
        const contrast = this.calculateContrastRatio(darkBg, darkFg);
        if (contrast < CONTRAST_STANDARDS.AA) {
          issues.push(`Low contrast between ${bg} and ${fg} in dark mode (${contrast.toFixed(2)}:1)`);
        }
      }
    });

    return issues;
  }

  /**
   * Validates color consistency between light and dark modes
   */
  private validateColorConsistency(theme: Theme): string[] {
    const issues: string[] = [];
    
    // Check that both modes have the same color names
    const lightColors = theme.lightPalette.getColorNames();
    const darkColors = theme.darkPalette.getColorNames();
    
    const lightOnly = lightColors.filter(name => !darkColors.includes(name));
    const darkOnly = darkColors.filter(name => !lightColors.includes(name));
    
    if (lightOnly.length > 0) {
      issues.push(`Colors only in light mode: ${lightOnly.join(', ')}`);
    }
    
    if (darkOnly.length > 0) {
      issues.push(`Colors only in dark mode: ${darkOnly.join(', ')}`);
    }

    return issues;
  }

  /**
   * Calculates a theme quality score
   */
  private calculateThemeScore(theme: Theme, errors: string[], warnings: string[]): number {
    let score = 100;
    
    // Deduct points for errors and warnings
    score -= errors.length * 10;
    score -= warnings.length * 5;
    
    // Bonus points for completeness
    const requiredColorCount = REQUIRED_COLORS.length;
    const presentColors = REQUIRED_COLORS.filter(color => 
      theme.lightPalette.getColor(color) && theme.darkPalette.getColor(color)
    ).length;
    
    const completenessBonus = (presentColors / requiredColorCount) * 10;
    score += completenessBonus;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Simplified contrast ratio calculation
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    // This is a simplified implementation
    // In practice, you'd use proper color conversion and luminance calculation
    return 4.5; // Placeholder
  }

  /**
   * Analyzes color temperatures
   */
  private analyzeColorTemperatures(colors: Record<string, string>): {
    mixed: boolean;
    inconsistentRatio: number;
  } {
    // Simplified implementation
    return { mixed: false, inconsistentRatio: 0 };
  }

  /**
   * Analyzes color saturations
   */
  private analyzeSaturations(colors: Record<string, string>): { highVariance: boolean } {
    // Simplified implementation
    return { highVariance: false };
  }

  /**
   * Detects color harmony patterns
   */
  private detectHarmonyPattern(colors: Record<string, string>): string {
    // Simplified implementation
    return 'monochromatic';
  }

  /**
   * Finds broken link chains
   */
  private findBrokenLinkChains(theme: Theme): string[] {
    // Simplified implementation
    return [];
  }

  /**
   * Finds inconsistent links between light and dark modes
   */
  private findInconsistentLinks(lightLinks: any[], darkLinks: any[]): string[] {
    // Simplified implementation
    return [];
  }

  /**
   * Generates accessibility recommendations
   */
  private generateAccessibilityRecommendation(current: number, required: number): string {
    const improvement = ((required / current - 1) * 100).toFixed(0);
    return `Increase contrast by approximately ${improvement}% to meet accessibility standards`;
  }
}

// ============================================================================
// TYPES
// ============================================================================

interface ThemeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

interface AccessibilityValidationResult {
  isValid: boolean;
  contrastRatio: number;
  requiredRatio: number;
  level: 'AA' | 'AAA';
  recommendation?: string;
  error?: string;
}

interface ColorHarmonyResult {
  isHarmonious: boolean;
  issues: string[];
  suggestions: string[];
  harmonyType: string;
}

interface ColorLinkValidationResult {
  isValid: boolean;
  issues: string[];
  warnings: string[];
  linkCount: {
    light: number;
    dark: number;
  };
}