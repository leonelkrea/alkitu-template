/**
 * Theme Builder - Schema Validator
 * JSON Schema validation for theme data structures
 * Part of Clean Architecture infrastructure layer
 */

import type { ThemeData } from '../../shared/types/theme.types';

/**
 * Schema validation result
 */
export interface SchemaValidationResult {
  isValid: boolean;
  errors: SchemaError[];
  warnings: SchemaWarning[];
  data?: any;
}

export interface SchemaError {
  path: string;
  message: string;
  value?: any;
  expected?: string;
}

export interface SchemaWarning {
  path: string;
  message: string;
  suggestion?: string;
}

/**
 * Theme schema definitions
 */
export const THEME_SCHEMA = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: 'Theme name'
    },
    version: {
      type: 'string',
      pattern: '^\\d+\\.\\d+\\.\\d+$',
      description: 'Semantic version'
    },
    description: {
      type: 'string',
      description: 'Theme description'
    },
    author: {
      type: 'string',
      description: 'Theme author'
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
      description: 'Theme tags'
    },
    lightModeConfig: {
      type: 'object',
      description: 'Light mode color configuration'
    },
    darkModeConfig: {
      type: 'object',
      description: 'Dark mode color configuration'
    },
    typography: {
      type: 'object',
      properties: {
        fontFamily: { type: 'object' },
        fontSize: { type: 'object' },
        fontWeight: { type: 'object' },
        lineHeight: { type: 'object' },
        letterSpacing: { type: 'object' }
      },
      description: 'Typography configuration'
    },
    brandConfig: {
      type: 'object',
      properties: {
        logo: {
          type: 'object',
          properties: {
            light: { type: 'string' },
            dark: { type: 'string' }
          }
        },
        favicon: { type: 'string' },
        companyName: { type: 'string' }
      },
      description: 'Brand configuration'
    }
  },
  anyOf: [
    { required: ['lightModeConfig'] },
    { required: ['darkModeConfig'] }
  ]
} as const;

/**
 * Color configuration schema
 */
export const COLOR_CONFIG_SCHEMA = {
  type: 'object',
  patternProperties: {
    '^[a-z-]+$': {
      type: 'string',
      description: 'Color value in any valid format'
    }
  },
  additionalProperties: false
} as const;

/**
 * Schema validator with comprehensive validation logic
 */
export class SchemaValidator {

  /**
   * Validates data against theme schema
   */
  validateThemeSchema(data: any): SchemaValidationResult {
    const result: SchemaValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      data
    };

    // Validate against theme schema
    this.validateObjectSchema(data, THEME_SCHEMA, '', result);

    // Additional theme-specific validations
    this.validateThemeSpecific(data, result);

    result.isValid = result.errors.length === 0;
    return result;
  }

  /**
   * Validates color configuration schema
   */
  validateColorConfigSchema(data: any): SchemaValidationResult {
    const result: SchemaValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      data
    };

    this.validateObjectSchema(data, COLOR_CONFIG_SCHEMA, '', result);

    result.isValid = result.errors.length === 0;
    return result;
  }

  /**
   * Validates import/export schema
   */
  validateImportExportSchema(data: any): SchemaValidationResult {
    const result: SchemaValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      data
    };

    // Check for different import formats
    if (this.isThemeFormat(data)) {
      return this.validateThemeSchema(data);
    } else if (this.isCssVarsFormat(data)) {
      this.validateCssVarsFormat(data, result);
    } else if (this.isTailwindFormat(data)) {
      this.validateTailwindFormat(data, result);
    } else {
      result.errors.push({
        path: 'root',
        message: 'Unknown import format',
        value: typeof data,
        expected: 'theme, css-vars, or tailwind format'
      });
    }

    result.isValid = result.errors.length === 0;
    return result;
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Generic object schema validation
   */
  private validateObjectSchema(
    data: any, 
    schema: any, 
    path: string, 
    result: SchemaValidationResult
  ): void {
    if (schema.type === 'object') {
      if (typeof data !== 'object' || data === null) {
        result.errors.push({
          path,
          message: `Expected object, got ${typeof data}`,
          value: data,
          expected: 'object'
        });
        return;
      }

      // Check required properties
      if (schema.required) {
        schema.required.forEach((prop: string) => {
          if (!(prop in data)) {
            result.errors.push({
              path: path ? `${path}.${prop}` : prop,
              message: `Missing required property: ${prop}`,
              expected: schema.properties?.[prop]?.type || 'any'
            });
          }
        });
      }

      // Validate properties
      if (schema.properties) {
        Object.entries(schema.properties).forEach(([prop, propSchema]: [string, any]) => {
          if (prop in data) {
            const propPath = path ? `${path}.${prop}` : prop;
            this.validatePropertySchema(data[prop], propSchema, propPath, result);
          }
        });
      }

      // Check pattern properties
      if (schema.patternProperties) {
        Object.entries(schema.patternProperties).forEach(([pattern, propSchema]: [string, any]) => {
          const regex = new RegExp(pattern);
          Object.keys(data).forEach(key => {
            if (regex.test(key)) {
              const propPath = path ? `${path}.${key}` : key;
              this.validatePropertySchema(data[key], propSchema, propPath, result);
            }
          });
        });
      }

      // Check anyOf conditions
      if (schema.anyOf) {
        const anyOfResults = schema.anyOf.map((subSchema: any) => {
          const tempResult: SchemaValidationResult = {
            isValid: true,
            errors: [],
            warnings: []
          };
          this.validateObjectSchema(data, subSchema, path, tempResult);
          return tempResult.errors.length === 0;
        });

        if (!anyOfResults.some(Boolean)) {
          result.errors.push({
            path,
            message: 'Data does not match any of the required schemas',
            value: data
          });
        }
      }
    }
  }

  /**
   * Validates individual property schema
   */
  private validatePropertySchema(
    value: any, 
    schema: any, 
    path: string, 
    result: SchemaValidationResult
  ): void {
    // Type validation
    if (schema.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== schema.type) {
        result.errors.push({
          path,
          message: `Expected ${schema.type}, got ${actualType}`,
          value,
          expected: schema.type
        });
        return;
      }
    }

    // String validations
    if (schema.type === 'string' && typeof value === 'string') {
      if (schema.minLength && value.length < schema.minLength) {
        result.errors.push({
          path,
          message: `String too short: ${value.length} < ${schema.minLength}`,
          value,
          expected: `minimum ${schema.minLength} characters`
        });
      }

      if (schema.maxLength && value.length > schema.maxLength) {
        result.errors.push({
          path,
          message: `String too long: ${value.length} > ${schema.maxLength}`,
          value,
          expected: `maximum ${schema.maxLength} characters`
        });
      }

      if (schema.pattern) {
        const regex = new RegExp(schema.pattern);
        if (!regex.test(value)) {
          result.errors.push({
            path,
            message: `String does not match pattern: ${schema.pattern}`,
            value,
            expected: `pattern: ${schema.pattern}`
          });
        }
      }
    }

    // Array validations
    if (schema.type === 'array' && Array.isArray(value)) {
      if (schema.items) {
        value.forEach((item, index) => {
          this.validatePropertySchema(item, schema.items, `${path}[${index}]`, result);
        });
      }

      if (schema.minItems && value.length < schema.minItems) {
        result.errors.push({
          path,
          message: `Array too short: ${value.length} < ${schema.minItems}`,
          value: value.length,
          expected: `minimum ${schema.minItems} items`
        });
      }

      if (schema.maxItems && value.length > schema.maxItems) {
        result.errors.push({
          path,
          message: `Array too long: ${value.length} > ${schema.maxItems}`,
          value: value.length,
          expected: `maximum ${schema.maxItems} items`
        });
      }
    }

    // Object validations
    if (schema.type === 'object' && typeof value === 'object' && value !== null) {
      this.validateObjectSchema(value, schema, path, result);
    }
  }

  /**
   * Theme-specific validations
   */
  private validateThemeSpecific(data: any, result: SchemaValidationResult): void {
    // Check that at least one color config exists
    if (!data.lightModeConfig && !data.darkModeConfig) {
      result.errors.push({
        path: 'colorConfigs',
        message: 'Theme must have at least lightModeConfig or darkModeConfig',
        expected: 'object'
      });
    }

    // Validate version format if present
    if (data.version && typeof data.version === 'string') {
      if (!/^\d+\.\d+\.\d+/.test(data.version)) {
        result.warnings.push({
          path: 'version',
          message: 'Version should follow semantic versioning (e.g., 1.0.0)',
          suggestion: 'Use format: MAJOR.MINOR.PATCH'
        });
      }
    }

    // Check for common theme properties
    const commonColors = ['background', 'foreground', 'primary', 'secondary'];
    ['lightModeConfig', 'darkModeConfig'].forEach(configKey => {
      if (data[configKey] && typeof data[configKey] === 'object') {
        const missingColors = commonColors.filter(color => !data[configKey][color]);
        if (missingColors.length > 0) {
          result.warnings.push({
            path: configKey,
            message: `Missing common colors: ${missingColors.join(', ')}`,
            suggestion: 'Consider adding these commonly used colors'
          });
        }
      }
    });
  }

  /**
   * Checks if data is in theme format
   */
  private isThemeFormat(data: any): boolean {
    return typeof data === 'object' && 
           data !== null && 
           (data.lightModeConfig || data.darkModeConfig || data.name);
  }

  /**
   * Checks if data is in CSS variables format
   */
  private isCssVarsFormat(data: any): boolean {
    return typeof data === 'object' && 
           data !== null && 
           Object.keys(data).some(key => key.startsWith('--'));
  }

  /**
   * Checks if data is in Tailwind format
   */
  private isTailwindFormat(data: any): boolean {
    return typeof data === 'object' && 
           data !== null && 
           (data.colors || data.theme);
  }

  /**
   * Validates CSS variables format
   */
  private validateCssVarsFormat(data: any, result: SchemaValidationResult): void {
    if (typeof data !== 'object' || data === null) {
      result.errors.push({
        path: 'root',
        message: 'CSS variables format must be an object',
        value: data,
        expected: 'object'
      });
      return;
    }

    Object.entries(data).forEach(([key, value]) => {
      if (!key.startsWith('--')) {
        result.warnings.push({
          path: key,
          message: 'CSS variable should start with --',
          suggestion: `Consider renaming to --${key}`
        });
      }

      if (typeof value !== 'string') {
        result.errors.push({
          path: key,
          message: 'CSS variable value must be a string',
          value,
          expected: 'string'
        });
      }
    });
  }

  /**
   * Validates Tailwind format
   */
  private validateTailwindFormat(data: any, result: SchemaValidationResult): void {
    if (typeof data !== 'object' || data === null) {
      result.errors.push({
        path: 'root',
        message: 'Tailwind format must be an object',
        value: data,
        expected: 'object'
      });
      return;
    }

    if (data.colors && typeof data.colors === 'object') {
      Object.entries(data.colors).forEach(([colorName, colorValue]) => {
        if (typeof colorValue !== 'string' && typeof colorValue !== 'object') {
          result.warnings.push({
            path: `colors.${colorName}`,
            message: 'Tailwind color should be string or object',
            suggestion: 'Use string for single color or object for color shades'
          });
        }
      });
    }
  }
}

/**
 * Default schema validator instance
 */
export const schemaValidator = new SchemaValidator();

/**
 * Convenience function for theme schema validation
 */
export function validateThemeSchema(data: any): SchemaValidationResult {
  return schemaValidator.validateThemeSchema(data);
}

/**
 * Convenience function for color config schema validation
 */
export function validateColorConfigSchema(data: any): SchemaValidationResult {
  return schemaValidator.validateColorConfigSchema(data);
}

/**
 * Convenience function for import/export schema validation
 */
export function validateImportExportSchema(data: any): SchemaValidationResult {
  return schemaValidator.validateImportExportSchema(data);
}