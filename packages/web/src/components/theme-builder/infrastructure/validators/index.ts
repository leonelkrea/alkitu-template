/**
 * Theme Builder - Validators Index
 * Central export point for all validation utilities
 * Part of Clean Architecture infrastructure layer
 */

// ============================================================================
// THEME VALIDATION
// ============================================================================
export {
  ThemeValidator,
  themeValidator,
  validateTheme,
  validateThemeColors
} from './theme.validator';

export type {
  ValidationResult,
  ValidationError,
  ValidationWarning
} from './theme.validator';

// ============================================================================
// COLOR VALIDATION
// ============================================================================
export {
  ColorValidator,
  colorValidator,
  validateColor,
  validateContrast
} from './color.validator';

export type {
  ColorValidationResult,
  ContrastValidationResult
} from './color.validator';

// ============================================================================
// FILE VALIDATION
// ============================================================================
export {
  FileValidator,
  fileValidator,
  validateFile,
  validateSvgFile,
  validateJsonFile
} from './file.validator';

export type {
  FileValidationResult,
  SvgValidationResult,
  JsonValidationResult
} from './file.validator';

// ============================================================================
// SCHEMA VALIDATION
// ============================================================================
export {
  SchemaValidator,
  schemaValidator,
  validateThemeSchema,
  validateColorConfigSchema,
  validateImportExportSchema,
  THEME_SCHEMA,
  COLOR_CONFIG_SCHEMA
} from './schema.validator';

export type {
  SchemaValidationResult,
  SchemaError,
  SchemaWarning
} from './schema.validator';

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Comprehensive validation suite for theme data
 */
export class ValidationSuite {
  
  /**
   * Validates a complete theme with all validators
   */
  static async validateCompleteTheme(theme: any): Promise<{
    theme: ValidationResult;
    schema: SchemaValidationResult;
    colors: {
      light?: ColorValidationResult[];
      dark?: ColorValidationResult[];
    };
    overall: {
      isValid: boolean;
      errors: number;
      warnings: number;
    };
  }> {
    const results = {
      theme: themeValidator.validateTheme(theme),
      schema: schemaValidator.validateThemeSchema(theme),
      colors: {} as any,
      overall: {
        isValid: true,
        errors: 0,
        warnings: 0
      }
    };

    // Validate individual colors
    if (theme.lightModeConfig) {
      results.colors.light = Object.entries(theme.lightModeConfig).map(([key, value]) => {
        const validation = colorValidator.validateColor(value as string);
        return { key, ...validation };
      });
    }

    if (theme.darkModeConfig) {
      results.colors.dark = Object.entries(theme.darkModeConfig).map(([key, value]) => {
        const validation = colorValidator.validateColor(value as string);
        return { key, ...validation };
      });
    }

    // Calculate overall results
    results.overall.errors = results.theme.errors.length + results.schema.errors.length;
    results.overall.warnings = results.theme.warnings.length + results.schema.warnings.length;
    results.overall.isValid = results.theme.isValid && results.schema.isValid;

    return results;
  }

  /**
   * Validates file upload for theme import
   */
  static async validateThemeImport(file: File): Promise<{
    file: FileValidationResult;
    content?: SchemaValidationResult;
    overall: {
      isValid: boolean;
      canImport: boolean;
      errors: string[];
      warnings: string[];
    };
  }> {
    const fileValidation = await fileValidator.validateFile(file);
    const result = {
      file: fileValidation,
      overall: {
        isValid: fileValidation.isValid,
        canImport: false,
        errors: [...fileValidation.errors],
        warnings: [...fileValidation.warnings]
      }
    } as any;

    // If file is valid, try to validate content
    if (fileValidation.isValid && (fileValidation.fileType === 'json' || fileValidation.fileType === 'css')) {
      try {
        const content = await file.text();
        let parsedContent;

        if (fileValidation.fileType === 'json') {
          parsedContent = JSON.parse(content);
        } else {
          // For CSS, create a simple structure
          parsedContent = { type: 'css', content };
        }

        result.content = schemaValidator.validateImportExportSchema(parsedContent);
        result.overall.canImport = result.content.isValid;
        result.overall.errors.push(...result.content.errors.map(e => e.message));
        result.overall.warnings.push(...result.content.warnings.map(w => w.message));
      } catch (error) {
        result.overall.errors.push(`Failed to parse file content: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    result.overall.isValid = result.overall.errors.length === 0;
    return result;
  }

  /**
   * Validates theme for export
   */
  static validateThemeExport(theme: any, format: 'json' | 'css'): {
    isValid: boolean;
    canExport: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  } {
    const themeValidation = themeValidator.validateTheme(theme);
    const schemaValidation = schemaValidator.validateThemeSchema(theme);

    const result = {
      isValid: themeValidation.isValid && schemaValidation.isValid,
      canExport: true,
      errors: [
        ...themeValidation.errors.map(e => e.message),
        ...schemaValidation.errors.map(e => e.message)
      ],
      warnings: [
        ...themeValidation.warnings.map(w => w.message),
        ...schemaValidation.warnings.map(w => w.message)
      ],
      suggestions: [] as string[]
    };

    // Format-specific validation
    if (format === 'css') {
      if (!theme.lightModeConfig && !theme.darkModeConfig) {
        result.errors.push('CSS export requires at least one color configuration');
        result.canExport = false;
      }
    }

    if (format === 'json') {
      if (!theme.name) {
        result.warnings.push('JSON export should include a theme name');
      }
    }

    // Add suggestions
    if (result.warnings.length > 0 && result.canExport) {
      result.suggestions.push('Consider fixing warnings before export for better compatibility');
    }

    if (!theme.version) {
      result.suggestions.push('Add a version number for better theme management');
    }

    result.canExport = result.canExport && result.errors.length === 0;
    return result;
  }
}

/**
 * Quick validation functions for common use cases
 */
export const quickValidate = {
  /**
   * Quick color validation
   */
  color: (value: string) => colorValidator.validateColor(value).isValid,

  /**
   * Quick theme validation
   */
  theme: (theme: any) => themeValidator.validateTheme(theme).isValid,

  /**
   * Quick file validation
   */
  file: async (file: File) => (await fileValidator.validateFile(file)).isValid,

  /**
   * Quick contrast check
   */
  contrast: (fg: string, bg: string) => colorValidator.validateContrast(fg, bg).isAccessible
};

/**
 * Validation error formatter
 */
export class ValidationErrorFormatter {
  
  /**
   * Formats validation errors for display
   */
  static formatErrors(errors: (ValidationError | SchemaError)[]): string[] {
    return errors.map(error => {
      if ('field' in error) {
        return `${error.field}: ${error.message}`;
      } else {
        return `${error.path}: ${error.message}`;
      }
    });
  }

  /**
   * Formats validation warnings for display
   */
  static formatWarnings(warnings: (ValidationWarning | SchemaWarning)[]): string[] {
    return warnings.map(warning => {
      if ('field' in warning) {
        return `${warning.field}: ${warning.message}`;
      } else {
        return `${warning.path}: ${warning.message}`;
      }
    });
  }

  /**
   * Creates user-friendly error summary
   */
  static createErrorSummary(
    errors: (ValidationError | SchemaError)[],
    warnings: (ValidationWarning | SchemaWarning)[]
  ): string {
    const parts: string[] = [];

    if (errors.length > 0) {
      parts.push(`${errors.length} error${errors.length === 1 ? '' : 's'}`);
    }

    if (warnings.length > 0) {
      parts.push(`${warnings.length} warning${warnings.length === 1 ? '' : 's'}`);
    }

    if (parts.length === 0) {
      return 'No issues found';
    }

    return `Validation found: ${parts.join(' and ')}`;
  }
}