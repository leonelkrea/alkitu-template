/**
 * Theme Builder - Process SVG Use Case
 * Business logic for SVG processing and optimization
 * Pure domain logic with no framework dependencies
 */

/**
 * Use case for processing SVG assets
 */
export class ProcessSvgUseCase {

  /**
   * Validates and processes an SVG file
   */
  processSvgFile(
    svgContent: string,
    options?: ProcessSvgOptions
  ): ProcessSvgResult {
    try {
      // Validate SVG content
      const validation = this.validateSvgContent(svgContent);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'Invalid SVG content'
        };
      }

      // Parse SVG
      const parsedSvg = this.parseSvgContent(svgContent);
      if (!parsedSvg) {
        return {
          success: false,
          error: 'Failed to parse SVG content'
        };
      }

      // Apply processing options
      let processedSvg = this.applySvgProcessing(parsedSvg, options);

      // Extract metadata
      const metadata = this.extractSvgMetadata(processedSvg);

      return {
        success: true,
        processedSvg: processedSvg.outerHTML,
        innerContent: processedSvg.innerHTML,
        metadata,
        optimizations: this.getAppliedOptimizations(options)
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process SVG'
      };
    }
  }

  /**
   * Optimizes SVG for web use
   */
  optimizeSvg(
    svgContent: string,
    optimization: SvgOptimizationLevel = 'balanced'
  ): OptimizeSvgResult {
    try {
      const validation = this.validateSvgContent(svgContent);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'Invalid SVG content'
        };
      }

      const originalSize = svgContent.length;
      let optimizedSvg = svgContent;
      const optimizations: string[] = [];

      // Apply optimization based on level
      switch (optimization) {
        case 'minimal':
          optimizedSvg = this.applyMinimalOptimization(optimizedSvg);
          optimizations.push('Minimal cleanup');
          break;
          
        case 'balanced':
          optimizedSvg = this.applyBalancedOptimization(optimizedSvg);
          optimizations.push('Balanced optimization', 'Attribute cleanup', 'Whitespace removal');
          break;
          
        case 'aggressive':
          optimizedSvg = this.applyAggressiveOptimization(optimizedSvg);
          optimizations.push('Aggressive optimization', 'Path simplification', 'Unused element removal');
          break;
      }

      const optimizedSize = optimizedSvg.length;
      const compressionRatio = originalSize > 0 ? 
        ((originalSize - optimizedSize) / originalSize) * 100 : 0;

      return {
        success: true,
        optimizedSvg,
        originalSize,
        optimizedSize,
        compressionRatio,
        optimizations,
        metadata: {
          optimizationLevel: optimization,
          optimizedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to optimize SVG'
      };
    }
  }

  /**
   * Converts SVG colors to use CSS custom properties
   */
  themifySvg(
    svgContent: string,
    colorMapping: SvgColorMapping
  ): ThemifySvgResult {
    try {
      const validation = this.validateSvgContent(svgContent);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'Invalid SVG content'
        };
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (!svgElement) {
        return {
          success: false,
          error: 'No SVG element found'
        };
      }

      const colorReplacements: ColorReplacement[] = [];
      
      // Replace colors with CSS custom properties
      Object.entries(colorMapping).forEach(([originalColor, cssVariable]) => {
        const replacements = this.replaceColorInSvg(svgElement, originalColor, cssVariable);
        colorReplacements.push(...replacements);
      });

      return {
        success: true,
        themifiedSvg: svgElement.outerHTML,
        colorReplacements,
        cssVariables: Object.values(colorMapping),
        metadata: {
          originalColorCount: Object.keys(colorMapping).length,
          replacementCount: colorReplacements.length,
          themifiedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to themify SVG'
      };
    }
  }

  /**
   * Extracts colors from SVG content
   */
  extractSvgColors(svgContent: string): ExtractColorsResult {
    try {
      const validation = this.validateSvgContent(svgContent);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'Invalid SVG content'
        };
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (!svgElement) {
        return {
          success: false,
          error: 'No SVG element found'
        };
      }

      const colors = this.findColorsInSvg(svgElement);
      const uniqueColors = [...new Set(colors)];
      const colorAnalysis = this.analyzeExtractedColors(uniqueColors);

      return {
        success: true,
        colors: uniqueColors,
        colorCount: uniqueColors.length,
        analysis: colorAnalysis,
        metadata: {
          extractedAt: new Date().toISOString(),
          totalElements: svgElement.querySelectorAll('*').length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract colors from SVG'
      };
    }
  }

  /**
   * Applies monochrome mode to SVG
   */
  applyMonochromeMode(
    svgContent: string,
    mode: 'light' | 'dark' | 'custom',
    customColor?: string
  ): MonochromeSvgResult {
    try {
      const validation = this.validateSvgContent(svgContent);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'Invalid SVG content'
        };
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (!svgElement) {
        return {
          success: false,
          error: 'No SVG element found'
        };
      }

      const targetColor = this.getMonochromeColor(mode, customColor);
      const modifications = this.applyMonochromeToElements(svgElement, targetColor);

      return {
        success: true,
        monochromeSvg: svgElement.outerHTML,
        mode,
        targetColor,
        modifications,
        metadata: {
          appliedAt: new Date().toISOString(),
          modificationCount: modifications.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to apply monochrome mode'
      };
    }
  }

  /**
   * Generates responsive SVG with multiple sizes
   */
  generateResponsiveSvg(
    svgContent: string,
    sizes: number[]
  ): ResponsiveSvgResult {
    try {
      const validation = this.validateSvgContent(svgContent);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'Invalid SVG content'
        };
      }

      const responsiveVersions: ResponsiveSvgVersion[] = [];

      sizes.forEach(size => {
        const resizedSvg = this.resizeSvg(svgContent, size);
        if (resizedSvg) {
          responsiveVersions.push({
            size,
            svgContent: resizedSvg,
            optimized: this.optimizeSvg(resizedSvg, 'balanced').optimizedSvg || resizedSvg
          });
        }
      });

      return {
        success: true,
        versions: responsiveVersions,
        sizes,
        metadata: {
          generatedAt: new Date().toISOString(),
          versionCount: responsiveVersions.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate responsive SVG'
      };
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Validates SVG content structure
   */
  private validateSvgContent(svgContent: string): { isValid: boolean; error?: string } {
    if (!svgContent || svgContent.trim().length === 0) {
      return { isValid: false, error: 'SVG content is empty' };
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const parseErrors = doc.getElementsByTagName('parsererror');
      
      if (parseErrors.length > 0) {
        return { isValid: false, error: 'SVG contains parse errors' };
      }

      const svgElement = doc.querySelector('svg');
      if (!svgElement) {
        return { isValid: false, error: 'No SVG element found' };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Failed to parse SVG' };
    }
  }

  /**
   * Parses SVG content into DOM element
   */
  private parseSvgContent(svgContent: string): SVGSVGElement | null {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      return doc.querySelector('svg');
    } catch {
      return null;
    }
  }

  /**
   * Applies processing options to SVG
   */
  private applySvgProcessing(
    svgElement: SVGSVGElement,
    options?: ProcessSvgOptions
  ): SVGSVGElement {
    if (!options) return svgElement;

    // Set viewBox if requested
    if (options.setViewBox) {
      svgElement.setAttribute('viewBox', '0 0 48 48');
    }

    // Remove unnecessary attributes
    if (options.removeMetadata) {
      this.removeMetadataFromSvg(svgElement);
    }

    // Optimize paths
    if (options.optimizePaths) {
      this.optimizeSvgPaths(svgElement);
    }

    // Set dimensions
    if (options.width || options.height) {
      if (options.width) svgElement.setAttribute('width', options.width.toString());
      if (options.height) svgElement.setAttribute('height', options.height.toString());
    }

    return svgElement;
  }

  /**
   * Extracts metadata from SVG
   */
  private extractSvgMetadata(svgElement: SVGSVGElement): SvgMetadata {
    const bbox = svgElement.getBBox();
    
    return {
      width: svgElement.getAttribute('width') || 'auto',
      height: svgElement.getAttribute('height') || 'auto',
      viewBox: svgElement.getAttribute('viewBox') || '',
      elementCount: svgElement.querySelectorAll('*').length,
      hasGradients: svgElement.querySelectorAll('linearGradient, radialGradient').length > 0,
      hasClipPaths: svgElement.querySelectorAll('clipPath').length > 0,
      boundingBox: {
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height
      }
    };
  }

  /**
   * Gets applied optimizations based on options
   */
  private getAppliedOptimizations(options?: ProcessSvgOptions): string[] {
    if (!options) return [];

    const optimizations: string[] = [];
    
    if (options.setViewBox) optimizations.push('Set viewBox');
    if (options.removeMetadata) optimizations.push('Removed metadata');
    if (options.optimizePaths) optimizations.push('Optimized paths');
    if (options.width || options.height) optimizations.push('Set dimensions');

    return optimizations;
  }

  /**
   * Applies minimal SVG optimization
   */
  private applyMinimalOptimization(svgContent: string): string {
    // Remove comments and extra whitespace
    return svgContent
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Applies balanced SVG optimization
   */
  private applyBalancedOptimization(svgContent: string): string {
    let optimized = this.applyMinimalOptimization(svgContent);
    
    // Remove unnecessary attributes
    optimized = optimized.replace(/\s(xmlns:[\w-]+="[^"]*")/g, '');
    optimized = optimized.replace(/\s(xml:space="preserve")/g, '');
    
    return optimized;
  }

  /**
   * Applies aggressive SVG optimization
   */
  private applyAggressiveOptimization(svgContent: string): string {
    let optimized = this.applyBalancedOptimization(svgContent);
    
    // More aggressive optimizations would go here
    // This is a simplified implementation
    
    return optimized;
  }

  /**
   * Replaces colors in SVG with CSS custom properties
   */
  private replaceColorInSvg(
    svgElement: SVGSVGElement,
    originalColor: string,
    cssVariable: string
  ): ColorReplacement[] {
    const replacements: ColorReplacement[] = [];
    const elements = svgElement.querySelectorAll('*');

    elements.forEach(element => {
      // Check fill attribute
      if (element.getAttribute('fill') === originalColor) {
        element.setAttribute('fill', `var(${cssVariable})`);
        replacements.push({
          element: element.tagName,
          attribute: 'fill',
          originalColor,
          newValue: `var(${cssVariable})`
        });
      }

      // Check stroke attribute
      if (element.getAttribute('stroke') === originalColor) {
        element.setAttribute('stroke', `var(${cssVariable})`);
        replacements.push({
          element: element.tagName,
          attribute: 'stroke',
          originalColor,
          newValue: `var(${cssVariable})`
        });
      }

      // Check style attribute
      const style = element.getAttribute('style');
      if (style && style.includes(originalColor)) {
        const newStyle = style.replace(
          new RegExp(originalColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          `var(${cssVariable})`
        );
        element.setAttribute('style', newStyle);
        replacements.push({
          element: element.tagName,
          attribute: 'style',
          originalColor,
          newValue: newStyle
        });
      }
    });

    return replacements;
  }

  /**
   * Finds all colors in SVG
   */
  private findColorsInSvg(svgElement: SVGSVGElement): string[] {
    const colors: string[] = [];
    const elements = svgElement.querySelectorAll('*');
    const colorPattern = /#[0-9A-Fa-f]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)/g;

    elements.forEach(element => {
      // Check attributes
      ['fill', 'stroke', 'stop-color'].forEach(attr => {
        const value = element.getAttribute(attr);
        if (value) {
          const matches = value.match(colorPattern);
          if (matches) colors.push(...matches);
        }
      });

      // Check style attribute
      const style = element.getAttribute('style');
      if (style) {
        const matches = style.match(colorPattern);
        if (matches) colors.push(...matches);
      }
    });

    return colors;
  }

  /**
   * Analyzes extracted colors
   */
  private analyzeExtractedColors(colors: string[]): ColorAnalysis {
    const analysis: ColorAnalysis = {
      hexColors: colors.filter(c => c.startsWith('#')).length,
      rgbColors: colors.filter(c => c.startsWith('rgb')).length,
      namedColors: colors.filter(c => !c.startsWith('#') && !c.startsWith('rgb')).length,
      hasTransparency: colors.some(c => c.includes('rgba') || c.includes('hsla')),
      dominantFormat: 'hex' // Simplified
    };

    return analysis;
  }

  /**
   * Gets monochrome color based on mode
   */
  private getMonochromeColor(mode: 'light' | 'dark' | 'custom', customColor?: string): string {
    switch (mode) {
      case 'light':
        return '#ffffff';
      case 'dark':
        return '#000000';
      case 'custom':
        return customColor || '#666666';
      default:
        return '#000000';
    }
  }

  /**
   * Applies monochrome color to SVG elements
   */
  private applyMonochromeToElements(
    svgElement: SVGSVGElement,
    targetColor: string
  ): SvgModification[] {
    const modifications: SvgModification[] = [];
    const elements = svgElement.querySelectorAll('*');

    elements.forEach(element => {
      // Modify fill
      if (element.getAttribute('fill') && element.getAttribute('fill') !== 'none') {
        const originalFill = element.getAttribute('fill');
        element.setAttribute('fill', targetColor);
        modifications.push({
          element: element.tagName,
          attribute: 'fill',
          originalValue: originalFill || '',
          newValue: targetColor
        });
      }

      // Modify stroke
      if (element.getAttribute('stroke') && element.getAttribute('stroke') !== 'none') {
        const originalStroke = element.getAttribute('stroke');
        element.setAttribute('stroke', targetColor);
        modifications.push({
          element: element.tagName,
          attribute: 'stroke',
          originalValue: originalStroke || '',
          newValue: targetColor
        });
      }
    });

    return modifications;
  }

  /**
   * Resizes SVG to specified size
   */
  private resizeSvg(svgContent: string, size: number): string | null {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (!svgElement) return null;

      svgElement.setAttribute('width', size.toString());
      svgElement.setAttribute('height', size.toString());
      
      // Ensure viewBox is set for proper scaling
      if (!svgElement.getAttribute('viewBox')) {
        svgElement.setAttribute('viewBox', `0 0 ${size} ${size}`);
      }

      return svgElement.outerHTML;
    } catch {
      return null;
    }
  }

  /**
   * Removes metadata from SVG
   */
  private removeMetadataFromSvg(svgElement: SVGSVGElement): void {
    // Remove title, desc, and metadata elements
    const metadataElements = svgElement.querySelectorAll('title, desc, metadata');
    metadataElements.forEach(el => el.remove());

    // Remove unnecessary attributes
    const unnecessaryAttrs = ['xml:space', 'xmlns:xlink'];
    unnecessaryAttrs.forEach(attr => {
      svgElement.removeAttribute(attr);
    });
  }

  /**
   * Optimizes SVG paths (simplified implementation)
   */
  private optimizeSvgPaths(svgElement: SVGSVGElement): void {
    // This would contain more sophisticated path optimization
    // For now, just a placeholder
    const paths = svgElement.querySelectorAll('path');
    paths.forEach(path => {
      const d = path.getAttribute('d');
      if (d) {
        // Simplified path optimization: remove unnecessary spaces
        const optimizedD = d.replace(/\s+/g, ' ').trim();
        path.setAttribute('d', optimizedD);
      }
    });
  }
}

// ============================================================================
// TYPES
// ============================================================================

interface ProcessSvgOptions {
  setViewBox?: boolean;
  removeMetadata?: boolean;
  optimizePaths?: boolean;
  width?: number;
  height?: number;
}

interface ProcessSvgResult {
  success: boolean;
  processedSvg?: string;
  innerContent?: string;
  metadata?: SvgMetadata;
  optimizations?: string[];
  error?: string;
}

interface SvgMetadata {
  width: string;
  height: string;
  viewBox: string;
  elementCount: number;
  hasGradients: boolean;
  hasClipPaths: boolean;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

type SvgOptimizationLevel = 'minimal' | 'balanced' | 'aggressive';

interface OptimizeSvgResult {
  success: boolean;
  optimizedSvg?: string;
  originalSize?: number;
  optimizedSize?: number;
  compressionRatio?: number;
  optimizations?: string[];
  error?: string;
  metadata?: {
    optimizationLevel: SvgOptimizationLevel;
    optimizedAt: string;
  };
}

interface SvgColorMapping {
  [originalColor: string]: string; // CSS custom property name
}

interface ThemifySvgResult {
  success: boolean;
  themifiedSvg?: string;
  colorReplacements?: ColorReplacement[];
  cssVariables?: string[];
  error?: string;
  metadata?: {
    originalColorCount: number;
    replacementCount: number;
    themifiedAt: string;
  };
}

interface ColorReplacement {
  element: string;
  attribute: string;
  originalColor: string;
  newValue: string;
}

interface ExtractColorsResult {
  success: boolean;
  colors?: string[];
  colorCount?: number;
  analysis?: ColorAnalysis;
  error?: string;
  metadata?: {
    extractedAt: string;
    totalElements: number;
  };
}

interface ColorAnalysis {
  hexColors: number;
  rgbColors: number;
  namedColors: number;
  hasTransparency: boolean;
  dominantFormat: string;
}

interface MonochromeSvgResult {
  success: boolean;
  monochromeSvg?: string;
  mode?: 'light' | 'dark' | 'custom';
  targetColor?: string;
  modifications?: SvgModification[];
  error?: string;
  metadata?: {
    appliedAt: string;
    modificationCount: number;
  };
}

interface SvgModification {
  element: string;
  attribute: string;
  originalValue: string;
  newValue: string;
}

interface ResponsiveSvgResult {
  success: boolean;
  versions?: ResponsiveSvgVersion[];
  sizes?: number[];
  error?: string;
  metadata?: {
    generatedAt: string;
    versionCount: number;
  };
}

interface ResponsiveSvgVersion {
  size: number;
  svgContent: string;
  optimized: string;
}