/**
 * Theme Builder - Import/Export Hook
 * Custom hook for theme import and export operations
 * Part of Clean Architecture presentation layer
 */

import { useState, useCallback, useMemo } from 'react';
import type { ThemeData } from '../../shared/types/theme.types';
import { ImportExportThemeUseCase } from '../../domain/use-cases/theme/import-export-theme.use-case';
import { fileValidator, type FileValidationResult } from '../../infrastructure/validators/file.validator';
import { schemaValidator } from '../../infrastructure/validators/schema.validator';

/**
 * Import/Export operation status
 */
export type ImportExportStatus = 'idle' | 'validating' | 'processing' | 'success' | 'error';

/**
 * Import result interface
 */
export interface ImportResult {
  success: boolean;
  theme?: ThemeData;
  errors: string[];
  warnings: string[];
  fileValidation?: FileValidationResult;
}

/**
 * Export result interface
 */
export interface ExportResult {
  success: boolean;
  data?: string;
  filename?: string;
  error?: string;
}

/**
 * Import/Export hook return type
 */
export interface UseThemeImportExportReturn {
  // State
  status: ImportExportStatus;
  lastImported: ThemeData | null;
  lastExported: { format: 'json' | 'css'; filename: string; timestamp: Date } | null;
  
  // Import operations
  importFromFile: (file: File) => Promise<ImportResult>;
  importFromJson: (jsonContent: string) => Promise<ImportResult>;
  importFromCss: (cssContent: string) => Promise<ImportResult>;
  
  // Export operations
  exportAsJson: (theme: ThemeData, filename?: string) => Promise<ExportResult>;
  exportAsCss: (theme: ThemeData, filename?: string) => Promise<ExportResult>;
  exportAsDownload: (theme: ThemeData, format: 'json' | 'css', filename?: string) => Promise<void>;
  
  // Validation
  validateImportFile: (file: File) => Promise<FileValidationResult>;
  validateThemeData: (data: any) => Promise<{ isValid: boolean; errors: string[]; warnings: string[] }>;
  
  // Utilities
  generateFilename: (theme: ThemeData, format: 'json' | 'css') => string;
  clearHistory: () => void;
  
  // State queries
  isImporting: boolean;
  isExporting: boolean;
  hasImported: boolean;
  hasExported: boolean;
}

/**
 * Custom hook for theme import/export operations
 */
export function useThemeImportExport(): UseThemeImportExportReturn {
  const [status, setStatus] = useState<ImportExportStatus>('idle');
  const [lastImported, setLastImported] = useState<ThemeData | null>(null);
  const [lastExported, setLastExported] = useState<{
    format: 'json' | 'css';
    filename: string;
    timestamp: Date;
  } | null>(null);

  // Use case instance
  const importExportUseCase = useMemo(() => new ImportExportThemeUseCase(), []);

  /**
   * Imports theme from file
   */
  const importFromFile = useCallback(async (file: File): Promise<ImportResult> => {
    setStatus('validating');
    
    try {
      // Validate file first
      const fileValidation = await fileValidator.validateFile(file);
      
      if (!fileValidation.isValid) {
        setStatus('error');
        return {
          success: false,
          errors: fileValidation.errors,
          warnings: fileValidation.warnings,
          fileValidation
        };
      }

      setStatus('processing');
      
      // Import based on file type
      let theme: ThemeData | null = null;
      
      if (fileValidation.fileType === 'json') {
        const content = await file.text();
        const importResult = await importFromJson(content);
        theme = importResult.theme || null;
      } else if (fileValidation.fileType === 'css') {
        const content = await file.text();
        const importResult = await importFromCss(content);
        theme = importResult.theme || null;
      }

      if (theme) {
        setLastImported(theme);
        setStatus('success');
        return {
          success: true,
          theme,
          errors: [],
          warnings: fileValidation.warnings,
          fileValidation
        };
      } else {
        setStatus('error');
        return {
          success: false,
          errors: ['Failed to parse theme data from file'],
          warnings: fileValidation.warnings,
          fileValidation
        };
      }
    } catch (error) {
      setStatus('error');
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown import error'],
        warnings: []
      };
    }
  }, []);

  /**
   * Imports theme from JSON string
   */
  const importFromJson = useCallback(async (jsonContent: string): Promise<ImportResult> => {
    setStatus('processing');
    
    try {
      const theme = await importExportUseCase.importFromJson(jsonContent);
      
      if (theme) {
        // Validate the imported theme
        const validation = schemaValidator.validateThemeSchema(theme);
        
        setLastImported(theme);
        setStatus('success');
        
        return {
          success: true,
          theme,
          errors: validation.errors.map(e => e.message),
          warnings: validation.warnings.map(w => w.message)
        };
      } else {
        setStatus('error');
        return {
          success: false,
          errors: ['Failed to parse JSON theme data'],
          warnings: []
        };
      }
    } catch (error) {
      setStatus('error');
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'JSON import error'],
        warnings: []
      };
    }
  }, [importExportUseCase]);

  /**
   * Imports theme from CSS string
   */
  const importFromCss = useCallback(async (cssContent: string): Promise<ImportResult> => {
    setStatus('processing');
    
    try {
      const theme = await importExportUseCase.importFromCss(cssContent);
      
      if (theme) {
        setLastImported(theme);
        setStatus('success');
        
        return {
          success: true,
          theme,
          errors: [],
          warnings: ['CSS import may not capture all theme metadata']
        };
      } else {
        setStatus('error');
        return {
          success: false,
          errors: ['Failed to parse CSS theme data'],
          warnings: []
        };
      }
    } catch (error) {
      setStatus('error');
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'CSS import error'],
        warnings: []
      };
    }
  }, [importExportUseCase]);

  /**
   * Exports theme as JSON
   */
  const exportAsJson = useCallback(async (
    theme: ThemeData,
    filename?: string
  ): Promise<ExportResult> => {
    setStatus('processing');
    
    try {
      const jsonContent = await importExportUseCase.exportAsJson(theme);
      const exportFilename = filename || generateFilename(theme, 'json');
      
      setLastExported({
        format: 'json',
        filename: exportFilename,
        timestamp: new Date()
      });
      setStatus('success');
      
      return {
        success: true,
        data: jsonContent,
        filename: exportFilename
      };
    } catch (error) {
      setStatus('error');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'JSON export error'
      };
    }
  }, [importExportUseCase]);

  /**
   * Exports theme as CSS
   */
  const exportAsCss = useCallback(async (
    theme: ThemeData,
    filename?: string
  ): Promise<ExportResult> => {
    setStatus('processing');
    
    try {
      const cssContent = await importExportUseCase.exportAsCss(theme);
      const exportFilename = filename || generateFilename(theme, 'css');
      
      setLastExported({
        format: 'css',
        filename: exportFilename,
        timestamp: new Date()
      });
      setStatus('success');
      
      return {
        success: true,
        data: cssContent,
        filename: exportFilename
      };
    } catch (error) {
      setStatus('error');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'CSS export error'
      };
    }
  }, [importExportUseCase]);

  /**
   * Exports theme and triggers download
   */
  const exportAsDownload = useCallback(async (
    theme: ThemeData,
    format: 'json' | 'css',
    filename?: string
  ): Promise<void> => {
    try {
      let result: ExportResult;
      
      if (format === 'json') {
        result = await exportAsJson(theme, filename);
      } else {
        result = await exportAsCss(theme, filename);
      }

      if (result.success && result.data && result.filename) {
        // Create and trigger download
        const blob = new Blob([result.data], {
          type: format === 'json' ? 'application/json' : 'text/css'
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        throw new Error(result.error || 'Export failed');
      }
    } catch (error) {
      setStatus('error');
      throw error;
    }
  }, [exportAsJson, exportAsCss]);

  /**
   * Validates import file
   */
  const validateImportFile = useCallback(async (file: File): Promise<FileValidationResult> => {
    return await fileValidator.validateFile(file);
  }, []);

  /**
   * Validates theme data
   */
  const validateThemeData = useCallback(async (data: any): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> => {
    const validation = schemaValidator.validateThemeSchema(data);
    
    return {
      isValid: validation.isValid,
      errors: validation.errors.map(e => e.message),
      warnings: validation.warnings.map(w => w.message)
    };
  }, []);

  /**
   * Generates filename for export
   */
  const generateFilename = useCallback((theme: ThemeData, format: 'json' | 'css'): string => {
    const name = theme.name || 'theme';
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const extension = format === 'json' ? 'json' : 'css';
    
    return `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp}.${extension}`;
  }, []);

  /**
   * Clears import/export history
   */
  const clearHistory = useCallback((): void => {
    setLastImported(null);
    setLastExported(null);
    setStatus('idle');
  }, []);

  // Computed properties
  const isImporting = useMemo(() => {
    return status === 'validating' || (status === 'processing' && !lastExported);
  }, [status, lastExported]);

  const isExporting = useMemo(() => {
    return status === 'processing' && !!lastExported;
  }, [status, lastExported]);

  const hasImported = useMemo(() => {
    return lastImported !== null;
  }, [lastImported]);

  const hasExported = useMemo(() => {
    return lastExported !== null;
  }, [lastExported]);

  return {
    // State
    status,
    lastImported,
    lastExported,
    
    // Import operations
    importFromFile,
    importFromJson,
    importFromCss,
    
    // Export operations
    exportAsJson,
    exportAsCss,
    exportAsDownload,
    
    // Validation
    validateImportFile,
    validateThemeData,
    
    // Utilities
    generateFilename,
    clearHistory,
    
    // State queries
    isImporting,
    isExporting,
    hasImported,
    hasExported
  };
}