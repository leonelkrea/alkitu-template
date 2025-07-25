/**
 * Theme Builder - Theme Validation Hook
 * Custom hook for theme validation operations
 * Part of Clean Architecture presentation layer
 */

import { useState, useCallback, useMemo } from 'react';
import type { ThemeData } from '../../shared/types/theme.types';
import { themeValidator, type ValidationResult } from '../../infrastructure/validators/theme.validator';
import { colorValidator } from '../../infrastructure/validators/color.validator';

/**
 * Theme validation hook return type
 */
export interface UseThemeValidationReturn {
  // Validation state
  validationResult: ValidationResult | null;
  isValidating: boolean;
  lastValidated: Date | null;
  
  // Validation actions
  validateTheme: (theme: ThemeData) => Promise<ValidationResult>;
  validateColors: (colors: Record<string, string>) => Promise<string[]>;
  validateSingleColor: (color: string) => boolean;
  clearValidation: () => void;
  
  // Computed properties
  isValid: boolean;
  errors: string[];
  warnings: string[];
  errorCount: number;
  warningCount: number;
  
  // Validation utilities
  hasValidationRun: boolean;
  getErrorsForField: (field: string) => string[];
  getWarningsForField: (field: string) => string[];
}

/**
 * Custom hook for theme validation
 */
export function useThemeValidation(): UseThemeValidationReturn {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidated, setLastValidated] = useState<Date | null>(null);

  /**
   * Validates a complete theme
   */
  const validateTheme = useCallback(async (theme: ThemeData): Promise<ValidationResult> => {
    setIsValidating(true);
    
    try {
      const result = themeValidator.validateTheme(theme);
      setValidationResult(result);
      setLastValidated(new Date());
      return result;
    } finally {
      setIsValidating(false);
    }
  }, []);

  /**
   * Validates theme colors
   */
  const validateColors = useCallback(async (colors: Record<string, string>): Promise<string[]> => {
    return themeValidator.validateThemeColors(colors);
  }, []);

  /**
   * Validates a single color value
   */
  const validateSingleColor = useCallback((color: string): boolean => {
    const result = colorValidator.validateColor(color);
    return result.isValid;
  }, []);

  /**
   * Clears validation results
   */
  const clearValidation = useCallback((): void => {
    setValidationResult(null);
    setLastValidated(null);
  }, []);

  /**
   * Gets errors for a specific field
   */
  const getErrorsForField = useCallback((field: string): string[] => {
    if (!validationResult) return [];
    
    return validationResult.errors
      .filter(error => error.field === field)
      .map(error => error.message);
  }, [validationResult]);

  /**
   * Gets warnings for a specific field
   */
  const getWarningsForField = useCallback((field: string): string[] => {
    if (!validationResult) return [];
    
    return validationResult.warnings
      .filter(warning => warning.field === field)
      .map(warning => warning.message);
  }, [validationResult]);

  // Computed properties
  const isValid = useMemo(() => {
    return validationResult ? validationResult.isValid : true;
  }, [validationResult]);

  const errors = useMemo(() => {
    return validationResult ? validationResult.errors.map(e => e.message) : [];
  }, [validationResult]);

  const warnings = useMemo(() => {
    return validationResult ? validationResult.warnings.map(w => w.message) : [];
  }, [validationResult]);

  const errorCount = useMemo(() => {
    return validationResult ? validationResult.errors.length : 0;
  }, [validationResult]);

  const warningCount = useMemo(() => {
    return validationResult ? validationResult.warnings.length : 0;
  }, [validationResult]);

  const hasValidationRun = useMemo(() => {
    return validationResult !== null;
  }, [validationResult]);

  return {
    // State
    validationResult,
    isValidating,
    lastValidated,
    
    // Actions
    validateTheme,
    validateColors,
    validateSingleColor,
    clearValidation,
    
    // Computed properties
    isValid,
    errors,
    warnings,
    errorCount,
    warningCount,
    
    // Utilities
    hasValidationRun,
    getErrorsForField,
    getWarningsForField
  };
}