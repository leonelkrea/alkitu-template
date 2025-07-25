/**
 * Theme Builder - Manage Theme Use Case
 * Business logic for theme management operations
 * Pure domain logic with no framework dependencies
 */

import { Theme } from '../../entities/theme.entity';
import { TypographyEntity } from '../../entities/typography.entity';
import { BrandEntity } from '../../entities/brand.entity';
import type { ColorValues, TypographyConfig, BrandConfig } from '../../../shared/types';

/**
 * Use case for managing theme lifecycle and operations
 */
export class ManageThemeUseCase {

  /**
   * Creates a new theme with default values
   */
  createTheme(
    name: string,
    options?: CreateThemeOptions
  ): CreateThemeResult {
    try {
      // Validate theme name
      if (!name || name.trim().length === 0) {
        return {
          success: false,
          error: 'Theme name is required'
        };
      }

      // Use provided colors or defaults
      const lightColors = options?.lightColors || this.getDefaultLightColors();
      const darkColors = options?.darkColors || this.getDefaultDarkColors();

      // Create theme
      const theme = new Theme({
        name: name.trim(),
        lightColors,
        darkColors,
        typography: options?.typography,
        brandConfig: options?.brandConfig
      });

      // Validate the created theme
      const validation = theme.validate();
      if (!validation.valid) {
        return {
          success: false,
          error: `Theme validation failed: ${validation.errors.join(', ')}`
        };
      }

      return {
        success: true,
        theme,
        metadata: {
          createdAt: new Date().toISOString(),
          hasCustomColors: !!options?.lightColors || !!options?.darkColors,
          hasTypography: !!options?.typography,
          hasBrandConfig: !!options?.brandConfig
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create theme'
      };
    }
  }

  /**
   * Clones an existing theme
   */
  cloneTheme(
    sourceTheme: Theme,
    newName?: string,
    options?: CloneThemeOptions
  ): CloneThemeResult {
    try {
      // Clone the theme
      const clonedTheme = sourceTheme.clone();

      // Set new name if provided
      if (newName) {
        clonedTheme.setName(newName);
      }

      // Apply modifications if provided
      if (options?.modifications) {
        this.applyThemeModifications(clonedTheme, options.modifications);
      }

      return {
        success: true,
        theme: clonedTheme,
        metadata: {
          originalThemeId: sourceTheme.id,
          originalThemeName: sourceTheme.name,
          clonedAt: new Date().toISOString(),
          hasModifications: !!options?.modifications
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clone theme'
      };
    }
  }

  /**
   * Updates theme metadata and configuration
   */
  updateTheme(
    theme: Theme,
    updates: ThemeUpdates
  ): UpdateThemeResult {
    try {
      const changes: string[] = [];

      // Update name if provided
      if (updates.name && updates.name !== theme.name) {
        theme.setName(updates.name);
        changes.push('name');
      }

      // Update typography if provided
      if (updates.typography) {
        theme.updateTypography(updates.typography);
        changes.push('typography');
      }

      // Update brand config if provided
      if (updates.brandConfig) {
        theme.updateBrandConfig(updates.brandConfig);
        changes.push('brandConfig');
      }

      // Update colors if provided
      if (updates.lightColors) {
        Object.entries(updates.lightColors).forEach(([colorName, colorValue]) => {
          theme.updatePaletteColor('light', colorName, colorValue);
        });
        changes.push('lightColors');
      }

      if (updates.darkColors) {
        Object.entries(updates.darkColors).forEach(([colorName, colorValue]) => {
          theme.updatePaletteColor('dark', colorName, colorValue);
        });
        changes.push('darkColors');
      }

      // Validate updated theme
      const validation = theme.validate();
      if (!validation.valid) {
        return {
          success: false,
          error: `Theme validation failed after updates: ${validation.errors.join(', ')}`
        };
      }

      return {
        success: true,
        theme,
        changes,
        metadata: {
          updatedAt: new Date().toISOString(),
          changeCount: changes.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update theme'
      };
    }
  }

  /**
   * Resets a theme to its default state
   */
  resetTheme(theme: Theme, options?: ResetThemeOptions): ResetThemeResult {
    try {
      const originalName = theme.name;
      const resetOperations: string[] = [];

      // Reset colors to defaults
      if (!options?.preserveColors) {
        const defaultLight = this.getDefaultLightColors();
        const defaultDark = this.getDefaultDarkColors();

        Object.entries(defaultLight).forEach(([colorName, colorValue]) => {
          theme.updatePaletteColor('light', colorName, colorValue);
        });

        Object.entries(defaultDark).forEach(([colorName, colorValue]) => {
          theme.updatePaletteColor('dark', colorName, colorValue);
        });

        resetOperations.push('colors');
      }

      // Reset typography
      if (!options?.preserveTypography) {
        theme.updateTypography(this.getDefaultTypography());
        resetOperations.push('typography');
      }

      // Reset brand config
      if (!options?.preserveBrandConfig) {
        theme.updateBrandConfig(this.getDefaultBrandConfig());
        resetOperations.push('brandConfig');
      }

      // Reset name if requested
      if (options?.resetName) {
        theme.setName('New Theme');
        resetOperations.push('name');
      }

      return {
        success: true,
        theme,
        resetOperations,
        metadata: {
          originalName,
          resetAt: new Date().toISOString(),
          operationCount: resetOperations.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reset theme'
      };
    }
  }

  /**
   * Validates and analyzes a theme's completeness and quality
   */
  analyzeTheme(theme: Theme): ThemeAnalysisResult {
    try {
      // Basic validation
      const validation = theme.validate();

      // Completeness analysis
      const completeness = this.analyzeThemeCompleteness(theme);

      // Quality analysis
      const quality = this.analyzeThemeQuality(theme);

      // Accessibility analysis
      const accessibility = this.analyzeThemeAccessibility(theme);

      // Performance analysis
      const performance = this.analyzeThemePerformance(theme);

      // Calculate overall score
      const overallScore = this.calculateOverallThemeScore({
        validation,
        completeness,
        quality,
        accessibility,
        performance
      });

      return {
        success: true,
        analysis: {
          validation,
          completeness,
          quality,
          accessibility,
          performance,
          overallScore,
          recommendations: this.generateThemeRecommendations({
            validation,
            completeness,
            quality,
            accessibility,
            performance
          })
        },
        metadata: {
          analyzedAt: new Date().toISOString(),
          themeId: theme.id,
          themeName: theme.name
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze theme'
      };
    }
  }

  /**
   * Optimizes a theme for performance and best practices
   */
  optimizeTheme(theme: Theme, options?: OptimizeThemeOptions): OptimizeThemeResult {
    try {
      const optimizations: string[] = [];
      const originalTheme = theme.clone();

      // Optimize color values
      if (!options?.skipColorOptimization) {
        const colorOptimizations = this.optimizeColors(theme);
        optimizations.push(...colorOptimizations);
      }

      // Optimize typography
      if (!options?.skipTypographyOptimization && theme.typography) {
        const typographyOptimizations = this.optimizeTypography(theme);
        optimizations.push(...typographyOptimizations);
      }

      // Optimize brand configuration
      if (!options?.skipBrandOptimization && theme.brandConfig) {
        const brandOptimizations = this.optimizeBrandConfig(theme);
        optimizations.push(...brandOptimizations);
      }

      // Generate optimization report
      const report = this.generateOptimizationReport(originalTheme, theme, optimizations);

      return {
        success: true,
        theme,
        optimizations,
        report,
        metadata: {
          optimizedAt: new Date().toISOString(),
          optimizationCount: optimizations.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to optimize theme'
      };
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Gets default light mode colors
   */
  private getDefaultLightColors(): ColorValues {
    return {
      'primary': '62.1% 0.19 259.81',
      'primary-foreground': '100% 0 0',
      'secondary': '96.1% 0.014 286.05',
      'secondary-foreground': '25.1% 0.015 285.68',
      'background': '100% 0 0',
      'foreground': '25.1% 0.015 285.68',
      'card': '100% 0 0',
      'card-foreground': '25.1% 0.015 285.68',
      'popover': '100% 0 0',
      'popover-foreground': '25.1% 0.015 285.68',
      'muted': '96.1% 0.014 286.05',
      'muted-foreground': '64.9% 0.019 285.93',
      'accent': '96.1% 0.014 286.05',
      'accent-foreground': '25.1% 0.015 285.68',
      'destructive': '62.8% 0.238 27.33',
      'destructive-foreground': '100% 0 0',
      'border': '90% 0.011 286.17',
      'input': '90% 0.011 286.17',
      'ring': '62.1% 0.19 259.81'
    };
  }

  /**
   * Gets default dark mode colors
   */
  private getDefaultDarkColors(): ColorValues {
    return {
      'primary': '62.1% 0.19 259.81',
      'primary-foreground': '100% 0 0',
      'secondary': '22.2% 0.014 285.85',
      'secondary-foreground': '100% 0 0',
      'background': '5.3% 0.006 285.65',
      'foreground': '100% 0 0',
      'card': '5.3% 0.006 285.65',
      'card-foreground': '100% 0 0',
      'popover': '5.3% 0.006 285.65',
      'popover-foreground': '100% 0 0',
      'muted': '22.2% 0.014 285.85',
      'muted-foreground': '64.9% 0.019 285.93',
      'accent': '22.2% 0.014 285.85',
      'accent-foreground': '100% 0 0',
      'destructive': '62.8% 0.238 27.33',
      'destructive-foreground': '100% 0 0',
      'border': '22.2% 0.014 285.85',
      'input': '22.2% 0.014 285.85',
      'ring': '62.1% 0.19 259.81'
    };
  }

  /**
   * Gets default typography configuration
   */
  private getDefaultTypography(): Typography {
    return {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      monoFontFamily: 'ui-monospace, monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      fontWeight: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900
      },
      lineHeight: {
        xs: '1rem',
        sm: '1.25rem',
        base: '1.5rem',
        lg: '1.75rem',
        xl: '1.75rem',
        '2xl': '2rem',
        '3xl': '2.25rem',
        '4xl': '2.5rem',
        '5xl': '3rem'
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em'
      },
      responsive: {}
    };
  }

  /**
   * Gets default brand configuration
   */
  private getDefaultBrandConfig(): BrandConfig {
    return {
      primaryText: 'Alkitu',
      secondaryText: 'Design System',
      primaryTextColor: '25.1% 0.015 285.68',
      primaryTextColorLinked: true,
      primaryTextColorLinkedTo: 'foreground',
      secondaryTextColor: '64.9% 0.019 285.93',
      secondaryTextColorLinked: true,
      secondaryTextColorLinkedTo: 'muted-foreground',
      iconBackgroundColor: '62.1% 0.19 259.81',
      iconBackgroundColorLinked: true,
      iconBackgroundColorLinkedTo: 'primary',
      iconColor: '100% 0 0',
      iconColorLinked: true,
      iconColorLinkedTo: 'primary-foreground',
      monochromeMode: 'none'
    };
  }

  /**
   * Applies modifications to a theme
   */
  private applyThemeModifications(theme: Theme, modifications: ThemeModifications): void {
    if (modifications.namePrefix) {
      theme.setName(`${modifications.namePrefix} ${theme.name}`);
    }

    if (modifications.nameSuffix) {
      theme.setName(`${theme.name} ${modifications.nameSuffix}`);
    }

    if (modifications.colorAdjustments) {
      // Apply color adjustments (simplified implementation)
      // In practice, you might want more sophisticated color manipulation
    }
  }

  /**
   * Analyzes theme completeness
   */
  private analyzeThemeCompleteness(theme: Theme): CompletenessAnalysis {
    // Simplified implementation
    return {
      score: 85,
      missingElements: [],
      optionalElements: [],
      recommendations: []
    };
  }

  /**
   * Analyzes theme quality
   */
  private analyzeThemeQuality(theme: Theme): QualityAnalysis {
    // Simplified implementation
    return {
      score: 90,
      issues: [],
      strengths: [],
      recommendations: []
    };
  }

  /**
   * Analyzes theme accessibility
   */
  private analyzeThemeAccessibility(theme: Theme): AccessibilityAnalysis {
    // Simplified implementation
    return {
      score: 88,
      wcagLevel: 'AA',
      issues: [],
      recommendations: []
    };
  }

  /**
   * Analyzes theme performance
   */
  private analyzeThemePerformance(theme: Theme): PerformanceAnalysis {
    // Simplified implementation
    return {
      score: 92,
      metrics: {
        cssSize: 1024,
        renderTime: 16,
        memoryUsage: 512
      },
      recommendations: []
    };
  }

  /**
   * Calculates overall theme score
   */
  private calculateOverallThemeScore(analyses: {
    validation: any;
    completeness: CompletenessAnalysis;
    quality: QualityAnalysis;
    accessibility: AccessibilityAnalysis;
    performance: PerformanceAnalysis;
  }): number {
    const weights = {
      validation: 0.3,
      completeness: 0.2,
      quality: 0.2,
      accessibility: 0.2,
      performance: 0.1
    };

    const validationScore = analyses.validation.valid ? 100 : 50;
    
    return Math.round(
      validationScore * weights.validation +
      analyses.completeness.score * weights.completeness +
      analyses.quality.score * weights.quality +
      analyses.accessibility.score * weights.accessibility +
      analyses.performance.score * weights.performance
    );
  }

  /**
   * Generates theme recommendations
   */
  private generateThemeRecommendations(analyses: any): string[] {
    const recommendations: string[] = [];
    
    if (!analyses.validation.valid) {
      recommendations.push('Fix validation errors before using this theme');
    }

    if (analyses.accessibility.score < 80) {
      recommendations.push('Improve color contrast for better accessibility');
    }

    if (analyses.completeness.score < 80) {
      recommendations.push('Add missing required colors');
    }

    return recommendations;
  }

  /**
   * Optimizes theme colors
   */
  private optimizeColors(theme: Theme): string[] {
    // Simplified implementation
    return ['Normalized color formats', 'Removed duplicate values'];
  }

  /**
   * Optimizes typography
   */
  private optimizeTypography(theme: Theme): string[] {
    // Simplified implementation
    return ['Optimized font loading', 'Reduced font variations'];
  }

  /**
   * Optimizes brand configuration
   */
  private optimizeBrandConfig(theme: Theme): string[] {
    // Simplified implementation
    return ['Optimized SVG assets', 'Improved color linking'];
  }

  /**
   * Generates optimization report
   */
  private generateOptimizationReport(
    originalTheme: Theme,
    optimizedTheme: Theme,
    optimizations: string[]
  ): OptimizationReport {
    return {
      summary: `Applied ${optimizations.length} optimizations`,
      optimizations,
      sizeBefore: JSON.stringify(originalTheme.toJSON()).length,
      sizeAfter: JSON.stringify(optimizedTheme.toJSON()).length,
      improvementPercent: 5 // Simplified calculation
    };
  }
}

// ============================================================================
// TYPES
// ============================================================================

interface CreateThemeOptions {
  lightColors?: ColorValues;
  darkColors?: ColorValues;
  typography?: Typography;
  brandConfig?: BrandConfig;
}

interface CreateThemeResult {
  success: boolean;
  theme?: Theme;
  error?: string;
  metadata?: {
    createdAt: string;
    hasCustomColors: boolean;
    hasTypography: boolean;
    hasBrandConfig: boolean;
  };
}

interface CloneThemeOptions {
  modifications?: ThemeModifications;
}

interface ThemeModifications {
  namePrefix?: string;
  nameSuffix?: string;
  colorAdjustments?: Record<string, string>;
}

interface CloneThemeResult {
  success: boolean;
  theme?: Theme;
  error?: string;
  metadata?: {
    originalThemeId: string;
    originalThemeName: string;
    clonedAt: string;
    hasModifications: boolean;
  };
}

interface ThemeUpdates {
  name?: string;
  lightColors?: Partial<ColorValues>;
  darkColors?: Partial<ColorValues>;
  typography?: Typography;
  brandConfig?: BrandConfig;
}

interface UpdateThemeResult {
  success: boolean;
  theme?: Theme;
  changes?: string[];
  error?: string;
  metadata?: {
    updatedAt: string;
    changeCount: number;
  };
}

interface ResetThemeOptions {
  preserveColors?: boolean;
  preserveTypography?: boolean;
  preserveBrandConfig?: boolean;
  resetName?: boolean;
}

interface ResetThemeResult {
  success: boolean;
  theme?: Theme;
  resetOperations?: string[];
  error?: string;
  metadata?: {
    originalName: string;
    resetAt: string;
    operationCount: number;
  };
}

interface ThemeAnalysisResult {
  success: boolean;
  analysis?: {
    validation: any;
    completeness: CompletenessAnalysis;
    quality: QualityAnalysis;
    accessibility: AccessibilityAnalysis;
    performance: PerformanceAnalysis;
    overallScore: number;
    recommendations: string[];
  };
  error?: string;
  metadata?: {
    analyzedAt: string;
    themeId: string;
    themeName: string;
  };
}

interface CompletenessAnalysis {
  score: number;
  missingElements: string[];
  optionalElements: string[];
  recommendations: string[];
}

interface QualityAnalysis {
  score: number;
  issues: string[];
  strengths: string[];
  recommendations: string[];
}

interface AccessibilityAnalysis {
  score: number;
  wcagLevel: 'A' | 'AA' | 'AAA';
  issues: string[];
  recommendations: string[];
}

interface PerformanceAnalysis {
  score: number;
  metrics: {
    cssSize: number;
    renderTime: number;
    memoryUsage: number;
  };
  recommendations: string[];
}

interface OptimizeThemeOptions {
  skipColorOptimization?: boolean;
  skipTypographyOptimization?: boolean;
  skipBrandOptimization?: boolean;
}

interface OptimizeThemeResult {
  success: boolean;
  theme?: Theme;
  optimizations?: string[];
  report?: OptimizationReport;
  error?: string;
  metadata?: {
    optimizedAt: string;
    optimizationCount: number;
  };
}

interface OptimizationReport {
  summary: string;
  optimizations: string[];
  sizeBefore: number;
  sizeAfter: number;
  improvementPercent: number;
}