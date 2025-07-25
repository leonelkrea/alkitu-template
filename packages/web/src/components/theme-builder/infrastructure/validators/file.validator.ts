/**
 * Theme Builder - File Validator
 * Validation for file uploads and imports (SVG, JSON, CSS)
 * Part of Clean Architecture infrastructure layer
 */

/**
 * File validation result
 */
export interface FileValidationResult {
  isValid: boolean;
  fileType?: 'svg' | 'json' | 'css' | 'image' | 'unknown';
  size: number;
  errors: string[];
  warnings: string[];
  metadata?: Record<string, any>;
}

/**
 * SVG validation result
 */
export interface SvgValidationResult extends FileValidationResult {
  dimensions?: { width: number; height: number };
  hasScripts?: boolean;
  hasExternalReferences?: boolean;
  colorCount?: number;
}

/**
 * JSON validation result
 */
export interface JsonValidationResult extends FileValidationResult {
  parsedData?: any;
  schema?: 'theme' | 'config' | 'unknown';
}

/**
 * File validator for theme-related file uploads
 */
export class FileValidator {
  
  // File size limits (in bytes)
  private readonly MAX_SVG_SIZE = 1024 * 1024; // 1MB
  private readonly MAX_JSON_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly MAX_CSS_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  /**
   * Validates any file based on type
   */
  async validateFile(file: File): Promise<FileValidationResult> {
    const result: FileValidationResult = {
      isValid: true,
      size: file.size,
      errors: [],
      warnings: [],
      metadata: {
        name: file.name,
        lastModified: file.lastModified,
        type: file.type
      }
    };

    // Determine file type
    const fileType = this.determineFileType(file);
    result.fileType = fileType;

    // Basic validations
    await this.validateFileBasics(file, result);

    if (!result.isValid) {
      return result;
    }

    // Type-specific validations
    switch (fileType) {
      case 'svg':
        return await this.validateSvgFile(file, result);
      case 'json':
        return await this.validateJsonFile(file, result);
      case 'css':
        return await this.validateCssFile(file, result);
      case 'image':
        return await this.validateImageFile(file, result);
      default:
        result.warnings.push('Unknown file type, basic validation only');
        return result;
    }
  }

  /**
   * Validates SVG files specifically
   */
  async validateSvgFile(file: File, baseResult?: FileValidationResult): Promise<SvgValidationResult> {
    const result: SvgValidationResult = {
      ...baseResult,
      isValid: baseResult?.isValid ?? true,
      size: file.size,
      errors: baseResult?.errors ?? [],
      warnings: baseResult?.warnings ?? [],
      fileType: 'svg'
    };

    // Size check
    if (file.size > this.MAX_SVG_SIZE) {
      result.errors.push(`SVG file too large: ${this.formatFileSize(file.size)} (max: ${this.formatFileSize(this.MAX_SVG_SIZE)})`);
      result.isValid = false;
    }

    try {
      const content = await file.text();
      
      // Basic SVG structure validation
      if (!content.trim().startsWith('<svg') && !content.includes('<svg')) {
        result.errors.push('Invalid SVG format: missing <svg> tag');
        result.isValid = false;
        return result;
      }

      // Security checks
      await this.validateSvgSecurity(content, result);
      
      // Extract metadata
      await this.extractSvgMetadata(content, result);

    } catch (error) {
      result.errors.push(`Failed to read SVG file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Validates JSON files specifically
   */
  async validateJsonFile(file: File, baseResult?: FileValidationResult): Promise<JsonValidationResult> {
    const result: JsonValidationResult = {
      ...baseResult,
      isValid: baseResult?.isValid ?? true,
      size: file.size,
      errors: baseResult?.errors ?? [],
      warnings: baseResult?.warnings ?? [],
      fileType: 'json'
    };

    // Size check
    if (file.size > this.MAX_JSON_SIZE) {
      result.errors.push(`JSON file too large: ${this.formatFileSize(file.size)} (max: ${this.formatFileSize(this.MAX_JSON_SIZE)})`);
      result.isValid = false;
    }

    try {
      const content = await file.text();
      
      // Parse JSON
      const parsedData = JSON.parse(content);
      result.parsedData = parsedData;
      
      // Determine schema type
      result.schema = this.determineJsonSchema(parsedData);
      
      // Schema-specific validation
      if (result.schema === 'theme') {
        await this.validateThemeJsonSchema(parsedData, result);
      }

    } catch (error) {
      if (error instanceof SyntaxError) {
        result.errors.push('Invalid JSON format: syntax error');
      } else {
        result.errors.push(`Failed to parse JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      result.isValid = false;
    }

    return result;
  }

  /**
   * Validates CSS files specifically
   */
  async validateCssFile(file: File, baseResult?: FileValidationResult): Promise<FileValidationResult> {
    const result: FileValidationResult = {
      ...baseResult,
      isValid: baseResult?.isValid ?? true,
      size: file.size,
      errors: baseResult?.errors ?? [],
      warnings: baseResult?.warnings ?? [],
      fileType: 'css'
    };

    // Size check
    if (file.size > this.MAX_CSS_SIZE) {
      result.errors.push(`CSS file too large: ${this.formatFileSize(file.size)} (max: ${this.formatFileSize(this.MAX_CSS_SIZE)})`);
      result.isValid = false;
    }

    try {
      const content = await file.text();
      
      // Basic CSS validation
      await this.validateCssContent(content, result);

    } catch (error) {
      result.errors.push(`Failed to read CSS file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Validates image files
   */
  async validateImageFile(file: File, baseResult?: FileValidationResult): Promise<FileValidationResult> {
    const result: FileValidationResult = {
      ...baseResult,
      isValid: baseResult?.isValid ?? true,
      size: file.size,
      errors: baseResult?.errors ?? [],
      warnings: baseResult?.warnings ?? [],
      fileType: 'image'
    };

    // Size check
    if (file.size > this.MAX_IMAGE_SIZE) {
      result.errors.push(`Image file too large: ${this.formatFileSize(file.size)} (max: ${this.formatFileSize(this.MAX_IMAGE_SIZE)})`);
      result.isValid = false;
    }

    // Validate image format
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
      result.errors.push(`Unsupported image format: ${file.type}`);
      result.isValid = false;
    }

    return result;
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Determines file type from file object
   */
  private determineFileType(file: File): FileValidationResult['fileType'] {
    const extension = file.name.toLowerCase().split('.').pop();
    const mimeType = file.type.toLowerCase();

    if (extension === 'svg' || mimeType === 'image/svg+xml') {
      return 'svg';
    }
    
    if (extension === 'json' || mimeType === 'application/json') {
      return 'json';
    }
    
    if (extension === 'css' || mimeType === 'text/css') {
      return 'css';
    }
    
    if (mimeType.startsWith('image/')) {
      return 'image';
    }
    
    return 'unknown';
  }

  /**
   * Validates basic file properties
   */
  private async validateFileBasics(file: File, result: FileValidationResult): Promise<void> {
    // Check if file is empty
    if (file.size === 0) {
      result.errors.push('File is empty');
      result.isValid = false;
      return;
    }

    // Check file name
    if (!file.name || file.name.trim() === '') {
      result.errors.push('File name is required');
      result.isValid = false;
    }

    // Check for potentially dangerous file names
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      result.errors.push('Invalid file name: contains path traversal characters');
      result.isValid = false;
    }
  }

  /**
   * Validates SVG content for security issues
   */
  private async validateSvgSecurity(content: string, result: SvgValidationResult): Promise<void> {
    // Check for scripts
    if (content.includes('<script') || content.includes('javascript:') || content.includes('on=')) {
      result.hasScripts = true;
      result.errors.push('SVG contains scripts or event handlers (security risk)');
      result.isValid = false;
    }

    // Check for external references
    if (content.includes('xlink:href=') || content.includes('href=')) {
      result.hasExternalReferences = true;
      result.warnings.push('SVG contains external references');
    }

    // Check for potentially dangerous elements
    const dangerousElements = ['foreignObject', 'use', 'animate', 'set'];
    dangerousElements.forEach(element => {
      if (content.includes(`<${element}`)) {
        result.warnings.push(`SVG contains potentially complex element: ${element}`);
      }
    });
  }

  /**
   * Extracts metadata from SVG content
   */
  private async extractSvgMetadata(content: string, result: SvgValidationResult): Promise<void> {
    try {
      // Extract dimensions
      const svgMatch = content.match(/<svg[^>]*>/);
      if (svgMatch) {
        const svgTag = svgMatch[0];
        const widthMatch = svgTag.match(/width=["']([^"']+)["']/);
        const heightMatch = svgTag.match(/height=["']([^"']+)["']/);
        
        if (widthMatch && heightMatch) {
          result.dimensions = {
            width: parseFloat(widthMatch[1]) || 0,
            height: parseFloat(heightMatch[1]) || 0
          };
        }
      }

      // Count colors (simplified)
      const colorMatches = content.match(/(fill|stroke)=["'][^"']+["']/g) || [];
      result.colorCount = new Set(colorMatches).size;

    } catch (error) {
      result.warnings.push('Failed to extract SVG metadata');
    }
  }

  /**
   * Determines JSON schema type
   */
  private determineJsonSchema(data: any): JsonValidationResult['schema'] {
    if (typeof data !== 'object' || data === null) {
      return 'unknown';
    }

    // Check for theme schema
    if (data.lightModeConfig || data.darkModeConfig || data.name) {
      return 'theme';
    }

    // Check for config schema
    if (data.config || data.settings || data.preferences) {
      return 'config';
    }

    return 'unknown';
  }

  /**
   * Validates theme JSON schema
   */
  private async validateThemeJsonSchema(data: any, result: JsonValidationResult): Promise<void> {
    if (!data.name || typeof data.name !== 'string') {
      result.warnings.push('Theme JSON missing name field');
    }

    if (!data.lightModeConfig && !data.darkModeConfig) {
      result.errors.push('Theme JSON must contain at least lightModeConfig or darkModeConfig');
      result.isValid = false;
    }

    // Validate color configurations
    ['lightModeConfig', 'darkModeConfig'].forEach(configKey => {
      if (data[configKey] && typeof data[configKey] === 'object') {
        const colorCount = Object.keys(data[configKey]).length;
        if (colorCount === 0) {
          result.warnings.push(`${configKey} is empty`);
        } else if (colorCount < 5) {
          result.warnings.push(`${configKey} has very few colors (${colorCount})`);
        }
      }
    });
  }

  /**
   * Validates CSS content
   */
  private async validateCssContent(content: string, result: FileValidationResult): Promise<void> {
    // Check for CSS variables
    const cssVarMatches = content.match(/--[\w-]+\s*:/g) || [];
    if (cssVarMatches.length === 0) {
      result.warnings.push('CSS file contains no CSS variables');
    }

    // Check for theme-related selectors
    const hasRootSelector = content.includes(':root');
    const hasDarkSelector = content.includes('.dark') || content.includes('[data-theme="dark"]');
    
    if (!hasRootSelector && !hasDarkSelector) {
      result.warnings.push('CSS file does not appear to contain theme variables');
    }

    // Basic syntax validation (simplified)
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      result.errors.push('CSS syntax error: mismatched braces');
      result.isValid = false;
    }
  }

  /**
   * Formats file size for display
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

/**
 * Default file validator instance
 */
export const fileValidator = new FileValidator();

/**
 * Convenience function for file validation
 */
export async function validateFile(file: File): Promise<FileValidationResult> {
  return fileValidator.validateFile(file);
}

/**
 * Convenience function for SVG validation
 */
export async function validateSvgFile(file: File): Promise<SvgValidationResult> {
  return fileValidator.validateSvgFile(file);
}

/**
 * Convenience function for JSON validation
 */
export async function validateJsonFile(file: File): Promise<JsonValidationResult> {
  return fileValidator.validateJsonFile(file);
}