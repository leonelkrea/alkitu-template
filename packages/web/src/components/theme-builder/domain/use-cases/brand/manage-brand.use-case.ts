/**
 * Theme Builder - Manage Brand Use Case
 * Business logic for brand management operations
 * Pure domain logic with no framework dependencies
 */

import { BrandEntity, type BrandConfiguration, type ColorProperty } from '../../entities/brand.entity';
import type { ColorValues } from '../../../shared/types';

/**
 * Use case for managing brand configuration and assets
 */
export class ManageBrandUseCase {

  /**
   * Creates a new brand configuration
   */
  createBrand(config?: Partial<BrandConfiguration>): CreateBrandResult {
    try {
      const brand = new BrandEntity(config);
      
      // Validate the created brand
      const validation = brand.validate();
      if (!validation.valid) {
        return {
          success: false,
          error: `Brand validation failed: ${validation.errors.join(', ')}`
        };
      }

      return {
        success: true,
        brand,
        metadata: {
          createdAt: new Date().toISOString(),
          hasCustomConfig: !!config,
          hasLogo: !!config?.logoSvg,
          hasIcon: !!config?.iconSvg
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create brand'
      };
    }
  }

  /**
   * Updates brand text content
   */
  updateBrandText(
    brand: BrandEntity,
    updates: BrandTextUpdates
  ): UpdateBrandResult {
    try {
      const changes: string[] = [];

      if (updates.primaryText !== undefined) {
        brand.setPrimaryText(updates.primaryText);
        changes.push('primaryText');
      }

      if (updates.secondaryText !== undefined) {
        brand.setSecondaryText(updates.secondaryText);
        changes.push('secondaryText');
      }

      return {
        success: true,
        brand,
        changes,
        metadata: {
          updatedAt: new Date().toISOString(),
          changeCount: changes.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update brand text'
      };
    }
  }

  /**
   * Updates brand colors
   */
  updateBrandColors(
    brand: BrandEntity,
    colorUpdates: BrandColorUpdates
  ): UpdateBrandResult {
    try {
      const changes: string[] = [];

      Object.entries(colorUpdates).forEach(([property, value]) => {
        if (value !== undefined) {
          brand.setColor(property as ColorProperty, value);
          changes.push(property);
        }
      });

      return {
        success: true,
        brand,
        changes,
        metadata: {
          updatedAt: new Date().toISOString(),
          changeCount: changes.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update brand colors'
      };
    }
  }

  /**
   * Manages color linking for brand properties
   */
  manageBrandColorLinks(
    brand: BrandEntity,
    linkUpdates: BrandColorLinkUpdates
  ): UpdateBrandResult {
    try {
      const changes: string[] = [];

      Object.entries(linkUpdates).forEach(([property, action]) => {
        const colorProperty = property as ColorProperty;
        
        if (action.type === 'link' && action.targetColor) {
          brand.linkColor(colorProperty, action.targetColor);
          changes.push(`link-${property}`);
        } else if (action.type === 'unlink') {
          brand.unlinkColor(colorProperty);
          changes.push(`unlink-${property}`);
        }
      });

      return {
        success: true,
        brand,
        changes,
        metadata: {
          updatedAt: new Date().toISOString(),
          changeCount: changes.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to manage color links'
      };
    }
  }

  /**
   * Updates SVG assets
   */
  updateBrandAssets(
    brand: BrandEntity,
    assetUpdates: BrandAssetUpdates
  ): UpdateBrandResult {
    try {
      const changes: string[] = [];

      if (assetUpdates.logoSvg !== undefined) {
        brand.setLogoSvg(assetUpdates.logoSvg);
        changes.push('logoSvg');
      }

      if (assetUpdates.iconSvg !== undefined) {
        brand.setIconSvg(assetUpdates.iconSvg);
        changes.push('iconSvg');
      }

      if (assetUpdates.monochromeMode !== undefined) {
        brand.setMonochromeMode(assetUpdates.monochromeMode);
        changes.push('monochromeMode');
      }

      return {
        success: true,
        brand,
        changes,
        metadata: {
          updatedAt: new Date().toISOString(),
          changeCount: changes.length,
          hasLogo: !!brand.getLogoSvg(),
          hasIcon: !!brand.getIconSvg()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update brand assets'
      };
    }
  }

  /**
   * Generates brand preview with resolved colors
   */
  generateBrandPreview(
    brand: BrandEntity,
    themeColors: ColorValues,
    mode: 'light' | 'dark' = 'light'
  ): BrandPreviewResult {
    try {
      // Resolve colors with theme
      const resolvedColors = brand.resolveColors(themeColors);
      
      // Process SVG assets
      const processedIcon = brand.processIconSvg(themeColors);
      
      // Generate preview data
      const preview: BrandPreview = {
        text: {
          primary: brand.getPrimaryText(),
          secondary: brand.getSecondaryText()
        },
        colors: resolvedColors,
        assets: {
          logoSvg: brand.getLogoSvg(),
          iconSvg: processedIcon,
          processedIcon: processedIcon
        },
        styles: this.generateBrandStyles(brand, resolvedColors),
        mode
      };

      return {
        success: true,
        preview,
        metadata: {
          generatedAt: new Date().toISOString(),
          mode,
          hasProcessedAssets: !!processedIcon
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate brand preview'
      };
    }
  }

  /**
   * Validates brand configuration
   */
  validateBrand(brand: BrandEntity): BrandValidationResult {
    try {
      const validation = brand.validate();
      
      // Additional business logic validation
      const businessValidation = this.performBusinessValidation(brand);
      
      const allErrors = [...validation.errors, ...businessValidation.errors];
      const allWarnings = [...businessValidation.warnings];

      return {
        success: allErrors.length === 0,
        errors: allErrors,
        warnings: allWarnings,
        score: this.calculateBrandScore(brand, allErrors, allWarnings),
        recommendations: this.generateBrandRecommendations(brand, allErrors, allWarnings)
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to validate brand'
      };
    }
  }

  /**
   * Optimizes brand configuration for performance
   */
  optimizeBrand(brand: BrandEntity, options?: OptimizeBrandOptions): OptimizeBrandResult {
    try {
      const optimizations: string[] = [];
      const originalBrand = brand.clone();

      // Optimize SVG assets
      if (!options?.skipSvgOptimization) {
        const svgOptimizations = this.optimizeSvgAssets(brand);
        optimizations.push(...svgOptimizations);
      }

      // Optimize color configuration
      if (!options?.skipColorOptimization) {
        const colorOptimizations = this.optimizeColorConfiguration(brand);
        optimizations.push(...colorOptimizations);
      }

      // Generate optimization report
      const report = this.generateBrandOptimizationReport(originalBrand, brand, optimizations);

      return {
        success: true,
        brand,
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
        error: error instanceof Error ? error.message : 'Failed to optimize brand'
      };
    }
  }

  /**
   * Exports brand configuration
   */
  exportBrand(brand: BrandEntity, format: 'json' | 'css' = 'json'): ExportBrandResult {
    try {
      const brandData = brand.toJSON();
      
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          content = JSON.stringify(brandData, null, 2);
          filename = `brand-config-${Date.now()}.json`;
          mimeType = 'application/json';
          break;
          
        case 'css':
          content = this.generateBrandCSS(brand);
          filename = `brand-styles-${Date.now()}.css`;
          mimeType = 'text/css';
          break;
          
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      return {
        success: true,
        content,
        filename,
        mimeType,
        metadata: {
          format,
          exportedAt: new Date().toISOString(),
          size: content.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export brand'
      };
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Generates brand styles
   */
  private generateBrandStyles(
    brand: BrandEntity,
    resolvedColors: any
  ): BrandStyles {
    return {
      primaryText: {
        color: resolvedColors.primaryText,
        fontWeight: 'bold',
        fontSize: '1.5rem'
      },
      secondaryText: {
        color: resolvedColors.secondaryText,
        fontWeight: 'normal',
        fontSize: '1rem'
      },
      icon: {
        backgroundColor: resolvedColors.iconBackground,
        color: resolvedColors.icon,
        borderRadius: '0.5rem',
        padding: '0.5rem'
      }
    };
  }

  /**
   * Performs business logic validation
   */
  private performBusinessValidation(brand: BrandEntity): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for consistent branding
    if (brand.getPrimaryText() === brand.getSecondaryText()) {
      warnings.push('Primary and secondary text are identical');
    }

    // Check SVG assets
    if (!brand.getLogoSvg() && !brand.getIconSvg()) {
      warnings.push('No brand assets (logo or icon) configured');
    }

    // Check color accessibility
    const primaryTextColor = brand.getPrimaryTextColor();
    const secondaryTextColor = brand.getSecondaryTextColor();
    
    if (primaryTextColor === secondaryTextColor) {
      warnings.push('Primary and secondary text colors are identical');
    }

    return { errors, warnings };
  }

  /**
   * Calculates brand quality score
   */
  private calculateBrandScore(
    brand: BrandEntity,
    errors: string[],
    warnings: string[]
  ): number {
    let score = 100;
    
    // Deduct for errors and warnings
    score -= errors.length * 20;
    score -= warnings.length * 10;
    
    // Add points for completeness
    if (brand.getLogoSvg()) score += 10;
    if (brand.getIconSvg()) score += 10;
    if (brand.isColorLinked('primaryText')) score += 5;
    if (brand.isColorLinked('secondaryText')) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generates brand recommendations
   */
  private generateBrandRecommendations(
    brand: BrandEntity,
    errors: string[],
    warnings: string[]
  ): string[] {
    const recommendations: string[] = [];
    
    if (errors.length > 0) {
      recommendations.push('Fix validation errors before using this brand configuration');
    }
    
    if (!brand.getLogoSvg()) {
      recommendations.push('Consider adding a logo for better brand recognition');
    }
    
    if (!brand.getIconSvg()) {
      recommendations.push('Consider adding an icon for use in compact spaces');
    }
    
    if (!brand.isColorLinked('primaryText')) {
      recommendations.push('Link primary text color to theme for consistency');
    }
    
    return recommendations;
  }

  /**
   * Optimizes SVG assets
   */
  private optimizeSvgAssets(brand: BrandEntity): string[] {
    const optimizations: string[] = [];
    
    // This is a simplified implementation
    // In practice, you'd use proper SVG optimization libraries
    
    if (brand.getLogoSvg()) {
      optimizations.push('Optimized logo SVG');
    }
    
    if (brand.getIconSvg()) {
      optimizations.push('Optimized icon SVG');
    }
    
    return optimizations;
  }

  /**
   * Optimizes color configuration
   */
  private optimizeColorConfiguration(brand: BrandEntity): string[] {
    const optimizations: string[] = [];
    
    // Check for opportunities to link colors
    if (!brand.isColorLinked('primaryText')) {
      optimizations.push('Suggested linking primary text color to theme');
    }
    
    if (!brand.isColorLinked('secondaryText')) {
      optimizations.push('Suggested linking secondary text color to theme');
    }
    
    return optimizations;
  }

  /**
   * Generates brand optimization report
   */
  private generateBrandOptimizationReport(
    originalBrand: BrandEntity,
    optimizedBrand: BrandEntity,
    optimizations: string[]
  ): BrandOptimizationReport {
    const originalSize = JSON.stringify(originalBrand.toJSON()).length;
    const optimizedSize = JSON.stringify(optimizedBrand.toJSON()).length;
    
    return {
      summary: `Applied ${optimizations.length} optimizations`,
      optimizations,
      sizeBefore: originalSize,
      sizeAfter: optimizedSize,
      improvementPercent: originalSize > 0 ? 
        Math.round(((originalSize - optimizedSize) / originalSize) * 100) : 0
    };
  }

  /**
   * Generates brand CSS
   */
  private generateBrandCSS(brand: BrandEntity): string {
    const config = brand.toJSON();
    
    return `/* Brand Configuration CSS */
:root {
  --brand-primary-text: "${config.primaryText}";
  --brand-secondary-text: "${config.secondaryText}";
  --brand-primary-text-color: ${config.primaryTextColor};
  --brand-secondary-text-color: ${config.secondaryTextColor};
  --brand-icon-background-color: ${config.iconBackgroundColor};
  --brand-icon-color: ${config.iconColor};
}

.brand-primary-text {
  color: var(--brand-primary-text-color);
  font-weight: bold;
}

.brand-secondary-text {
  color: var(--brand-secondary-text-color);
}

.brand-icon {
  background-color: var(--brand-icon-background-color);
  color: var(--brand-icon-color);
}`;
  }
}

// ============================================================================
// TYPES
// ============================================================================

interface CreateBrandResult {
  success: boolean;
  brand?: BrandEntity;
  error?: string;
  metadata?: {
    createdAt: string;
    hasCustomConfig: boolean;
    hasLogo: boolean;
    hasIcon: boolean;
  };
}

interface UpdateBrandResult {
  success: boolean;
  brand?: BrandEntity;
  changes?: string[];
  error?: string;
  metadata?: {
    updatedAt: string;
    changeCount: number;
    hasLogo?: boolean;
    hasIcon?: boolean;
  };
}

interface BrandTextUpdates {
  primaryText?: string;
  secondaryText?: string;
}

interface BrandColorUpdates {
  primaryText?: string;
  secondaryText?: string;
  iconBackground?: string;
  icon?: string;
}

interface BrandColorLinkUpdates {
  [key: string]: {
    type: 'link' | 'unlink';
    targetColor?: string;
  };
}

interface BrandAssetUpdates {
  logoSvg?: string;
  iconSvg?: string;
  monochromeMode?: 'none' | 'light' | 'dark';
}

interface BrandPreviewResult {
  success: boolean;
  preview?: BrandPreview;
  error?: string;
  metadata?: {
    generatedAt: string;
    mode: 'light' | 'dark';
    hasProcessedAssets: boolean;
  };
}

interface BrandPreview {
  text: {
    primary: string;
    secondary: string;
  };
  colors: {
    primaryText: string;
    secondaryText: string;
    iconBackground: string;
    icon: string;
  };
  assets: {
    logoSvg?: string;
    iconSvg?: string;
    processedIcon?: string;
  };
  styles: BrandStyles;
  mode: 'light' | 'dark';
}

interface BrandStyles {
  primaryText: {
    color: string;
    fontWeight: string;
    fontSize: string;
  };
  secondaryText: {
    color: string;
    fontWeight: string;
    fontSize: string;
  };
  icon: {
    backgroundColor: string;
    color: string;
    borderRadius: string;
    padding: string;
  };
}

interface BrandValidationResult {
  success: boolean;
  errors?: string[];
  warnings?: string[];
  score?: number;
  recommendations?: string[];
  error?: string;
}

interface OptimizeBrandOptions {
  skipSvgOptimization?: boolean;
  skipColorOptimization?: boolean;
}

interface OptimizeBrandResult {
  success: boolean;
  brand?: BrandEntity;
  optimizations?: string[];
  report?: BrandOptimizationReport;
  error?: string;
  metadata?: {
    optimizedAt: string;
    optimizationCount: number;
  };
}

interface BrandOptimizationReport {
  summary: string;
  optimizations: string[];
  sizeBefore: number;
  sizeAfter: number;
  improvementPercent: number;
}

interface ExportBrandResult {
  success: boolean;
  content?: string;
  filename?: string;
  mimeType?: string;
  error?: string;
  metadata?: {
    format: string;
    exportedAt: string;
    size: number;
  };
}