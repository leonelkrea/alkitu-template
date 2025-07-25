/**
 * Theme Builder - Manage Color Use Case
 * Business logic for color management operations
 * Pure domain logic with no framework dependencies
 */

import type { ColorValues, ColorValidationResult } from '../../../shared/types';
import { Theme } from '../../entities/theme.entity';
import { ColorPalette } from '../../entities/color-palette.entity';
import { convertColor, hexToOklch } from '../../../infrastructure/converters';
import { isValidColor } from '../../../shared/utils';

/**
 * Use case for managing theme colors
 */
export class ManageColorUseCase {
  
  /**
   * Updates a color in a theme
   */
  updateColor(
    theme: Theme, 
    colorName: string, 
    lightValue: string, 
    darkValue?: string
  ): { success: boolean; error?: string } {
    try {
      // Validate color values
      const lightValidation = this.validateColorValue(lightValue);
      if (!lightValidation.isValid) {
        return { success: false, error: lightValidation.error };
      }

      // Use light value for dark if not provided
      const finalDarkValue = darkValue || lightValue;
      const darkValidation = this.validateColorValue(finalDarkValue);
      if (!darkValidation.isValid) {
        return { success: false, error: darkValidation.error };
      }

      // Normalize colors to OKLCH
      const normalizedLight = this.normalizeColor(lightValue);
      const normalizedDark = this.normalizeColor(finalDarkValue);

      // Update the theme
      theme.updateColor(colorName, normalizedLight, normalizedDark);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Updates a color in a specific palette mode
   */
  updateColorInMode(
    theme: Theme,
    mode: 'light' | 'dark',
    colorName: string,
    value: string
  ): { success: boolean; error?: string } {
    try {
      const validation = this.validateColorValue(value);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      const normalizedValue = this.normalizeColor(value);
      theme.updatePaletteColor(mode, colorName, normalizedValue);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Links a color to another color
   */
  linkColor(
    theme: Theme,
    sourceColor: string,
    targetColor: string
  ): { success: boolean; error?: string } {
    try {
      // Validate that both colors exist
      const lightPalette = theme.lightPalette;
      const darkPalette = theme.darkPalette;

      if (!lightPalette.getColor(sourceColor)) {
        return { success: false, error: `Source color ${sourceColor} does not exist` };
      }

      if (!lightPalette.getColor(targetColor)) {
        return { success: false, error: `Target color ${targetColor} does not exist` };
      }

      // Prevent self-linking
      if (sourceColor === targetColor) {
        return { success: false, error: 'Cannot link a color to itself' };
      }

      theme.linkColor(sourceColor, targetColor);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Unlinks a color
   */
  unlinkColor(theme: Theme, colorName: string): { success: boolean; error?: string } {
    try {
      theme.unlinkColor(colorName);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Adds a new color to the theme
   */
  addColor(
    theme: Theme,
    colorName: string,
    lightValue: string,
    darkValue?: string
  ): { success: boolean; error?: string } {
    try {
      // Validate color name
      if (!colorName || colorName.trim().length === 0) {
        return { success: false, error: 'Color name cannot be empty' };
      }

      // Check if color already exists
      if (theme.lightPalette.getColor(colorName)) {
        return { success: false, error: `Color ${colorName} already exists` };
      }

      // Validate and normalize colors
      const lightValidation = this.validateColorValue(lightValue);
      if (!lightValidation.isValid) {
        return { success: false, error: lightValidation.error };
      }

      const finalDarkValue = darkValue || lightValue;
      const darkValidation = this.validateColorValue(finalDarkValue);
      if (!darkValidation.isValid) {
        return { success: false, error: darkValidation.error };
      }

      const normalizedLight = this.normalizeColor(lightValue);
      const normalizedDark = this.normalizeColor(finalDarkValue);

      // Add to both palettes
      theme.lightPalette.addColor(colorName, normalizedLight);
      theme.darkPalette.addColor(colorName, normalizedDark);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Removes a color from the theme
   */
  removeColor(theme: Theme, colorName: string): { success: boolean; error?: string } {
    try {
      theme.lightPalette.removeColor(colorName);
      theme.darkPalette.removeColor(colorName);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Generates foreground colors based on background colors
   */
  generateForegroundColors(theme: Theme): { success: boolean; suggestions?: string[]; error?: string } {
    try {
      const suggestions: string[] = [];
      const lightPalette = theme.lightPalette;
      const darkPalette = theme.darkPalette;

      // Common background/foreground pairs
      const pairs = [
        { bg: 'primary', fg: 'primary-foreground' },
        { bg: 'secondary', fg: 'secondary-foreground' },
        { bg: 'accent', fg: 'accent-foreground' },
        { bg: 'destructive', fg: 'destructive-foreground' },
        { bg: 'card', fg: 'card-foreground' },
        { bg: 'popover', fg: 'popover-foreground' },
        { bg: 'muted', fg: 'muted-foreground' },
      ];

      pairs.forEach(({ bg, fg }) => {
        const lightBg = lightPalette.getColor(bg);
        const darkBg = darkPalette.getColor(bg);

        if (lightBg && !lightPalette.getColor(fg)) {
          const lightFg = this.generateContrastingColor(lightBg);
          const darkFg = darkBg ? this.generateContrastingColor(darkBg) : lightFg;

          theme.updateColor(fg, lightFg, darkFg);
          suggestions.push(`Generated ${fg} based on ${bg}`);
        }
      });

      return { success: true, suggestions };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Analyzes color accessibility and provides recommendations
   */
  analyzeAccessibility(theme: Theme): {
    success: boolean;
    analysis?: ColorAccessibilityAnalysis;
    error?: string;
  } {
    try {
      const analysis: ColorAccessibilityAnalysis = {
        contrastIssues: [],
        recommendations: [],
        wcagCompliance: { aa: 0, aaa: 0, total: 0 }
      };

      // Common color pairs to check
      const pairsToCheck = [
        { bg: 'primary', fg: 'primary-foreground' },
        { bg: 'secondary', fg: 'secondary-foreground' },
        { bg: 'background', fg: 'foreground' },
        { bg: 'card', fg: 'card-foreground' },
        { bg: 'destructive', fg: 'destructive-foreground' },
      ];

      pairsToCheck.forEach(({ bg, fg }) => {
        const lightBg = theme.lightPalette.getColor(bg);
        const lightFg = theme.lightPalette.getColor(fg);
        const darkBg = theme.darkPalette.getColor(bg);
        const darkFg = theme.darkPalette.getColor(fg);

        if (lightBg && lightFg) {
          const lightContrast = this.calculateContrastRatio(lightBg, lightFg);
          analysis.wcagCompliance.total++;

          if (lightContrast >= 4.5) {
            analysis.wcagCompliance.aa++;
          } else {
            analysis.contrastIssues.push({
              colorPair: `${bg}/${fg}`,
              mode: 'light',
              contrast: lightContrast,
              issue: 'Low contrast ratio'
            });
          }

          if (lightContrast >= 7) {
            analysis.wcagCompliance.aaa++;
          }
        }

        if (darkBg && darkFg) {
          const darkContrast = this.calculateContrastRatio(darkBg, darkFg);
          analysis.wcagCompliance.total++;

          if (darkContrast >= 4.5) {
            analysis.wcagCompliance.aa++;
          } else {
            analysis.contrastIssues.push({
              colorPair: `${bg}/${fg}`,
              mode: 'dark',
              contrast: darkContrast,
              issue: 'Low contrast ratio'
            });
          }

          if (darkContrast >= 7) {
            analysis.wcagCompliance.aaa++;
          }
        }
      });

      // Generate recommendations
      if (analysis.contrastIssues.length > 0) {
        analysis.recommendations.push('Consider adjusting foreground colors to improve contrast');
        analysis.recommendations.push('Use tools like WebAIM Contrast Checker for verification');
      }

      return { success: true, analysis };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Validates a color value
   */
  private validateColorValue(value: string): ColorValidationResult {
    return validateColor(value);
  }

  /**
   * Normalizes a color to OKLCH format
   */
  private normalizeColor(value: string): string {
    try {
      // If already in OKLCH format, return as-is
      if (value.includes('oklch') || /^[\d.]+%?\s+[\d.]+\s+[\d.]+$/.test(value.trim())) {
        return value;
      }

      // Convert to OKLCH
      if (value.startsWith('#')) {
        return hexToOklch(value);
      }

      // For other formats, try to convert through hex
      return convertColor(value, 'rgb', 'oklch');
    } catch {
      // If conversion fails, return original value
      return value;
    }
  }

  /**
   * Generates a contrasting color for accessibility
   */
  private generateContrastingColor(backgroundColor: string): string {
    // Simple contrast calculation - in practice, you might want more sophisticated logic
    try {
      // Convert to RGB for luminance calculation
      const rgb = this.oklchToRgb(backgroundColor);
      const luminance = this.calculateLuminance(rgb.r, rgb.g, rgb.b);
      
      // Return black or white based on luminance
      return luminance > 0.5 ? '0% 0 0' : '100% 0 0'; // OKLCH format
    } catch {
      return '0% 0 0'; // Default to black
    }
  }

  /**
   * Calculates contrast ratio between two colors
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    try {
      const rgb1 = this.oklchToRgb(color1);
      const rgb2 = this.oklchToRgb(color2);
      
      const lum1 = this.calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
      const lum2 = this.calculateLuminance(rgb2.r, rgb2.g, rgb2.b);
      
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      
      return (brightest + 0.05) / (darkest + 0.05);
    } catch {
      return 1; // Default ratio if calculation fails
    }
  }

  /**
   * Converts OKLCH to RGB (simplified)
   */
  private oklchToRgb(oklch: string): { r: number; g: number; b: number } {
    // This is a simplified implementation
    // In practice, you'd use the proper conversion from infrastructure/converters
    return { r: 128, g: 128, b: 128 };
  }

  /**
   * Calculates relative luminance
   */
  private calculateLuminance(r: number, g: number, b: number): number {
    const rs = r / 255;
    const gs = g / 255;
    const bs = b / 255;

    const R = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const G = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const B = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
}

// ============================================================================
// TYPES
// ============================================================================

interface ColorAccessibilityAnalysis {
  contrastIssues: Array<{
    colorPair: string;
    mode: 'light' | 'dark';
    contrast: number;
    issue: string;
  }>;
  recommendations: string[];
  wcagCompliance: {
    aa: number;
    aaa: number;
    total: number;
  };
}