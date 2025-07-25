/**
 * Theme Builder - Presentation Hooks Index
 * Central export point for all custom hooks
 * Part of Clean Architecture presentation layer
 */

// ============================================================================
// THEME VALIDATION HOOKS
// ============================================================================
export {
  useThemeValidation,
  type UseThemeValidationReturn
} from './useThemeValidation';

// ============================================================================
// COLOR LINKING HOOKS
// ============================================================================
export {
  useColorLinking,
  type UseColorLinkingReturn,
  type ColorLink
} from './useColorLinking';

// ============================================================================
// IMPORT/EXPORT HOOKS
// ============================================================================
export {
  useThemeImportExport,
  type UseThemeImportExportReturn,
  type ImportResult,
  type ExportResult,
  type ImportExportStatus
} from './useThemeImportExport';

// ============================================================================
// COMPOSITE HOOKS
// ============================================================================

/**
 * Composite hook that combines multiple theme-related hooks
 * for comprehensive theme management
 */
export function useThemeManagement(availableColors: string[] = []) {
  const validation = useThemeValidation();
  const linking = useColorLinking(availableColors);
  const importExport = useThemeImportExport();

  return {
    validation,
    linking,
    importExport,
    
    // Combined utilities
    isProcessing: validation.isValidating || importExport.isImporting || importExport.isExporting,
    hasErrors: validation.errorCount > 0,
    hasWarnings: validation.warningCount > 0,
    
    // Quick actions
    validateAndExport: async (theme: any, format: 'json' | 'css') => {
      const validationResult = await validation.validateTheme(theme);
      
      if (!validationResult.isValid) {
        throw new Error(`Cannot export invalid theme: ${validation.errors.join(', ')}`);
      }
      
      if (format === 'json') {
        return await importExport.exportAsJson(theme);
      } else {
        return await importExport.exportAsCss(theme);
      }
    },
    
    validateAndImport: async (file: File) => {
      const fileValidation = await importExport.validateImportFile(file);
      
      if (!fileValidation.isValid) {
        throw new Error(`Cannot import invalid file: ${fileValidation.errors.join(', ')}`);
      }
      
      const importResult = await importExport.importFromFile(file);
      
      if (importResult.success && importResult.theme) {
        await validation.validateTheme(importResult.theme);
      }
      
      return importResult;
    }
  };
}

/**
 * Hook for theme editor UI state management
 */
export function useThemeEditorState() {
  const [activeTab, setActiveTab] = React.useState<
    'colors' | 'typography' | 'brand' | 'shadow' | 'border' | 'spacing'
  >('colors');
  const [previewMode, setPreviewMode] = React.useState(false);
  const [showCodePanel, setShowCodePanel] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleThemeMode = React.useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const resetUI = React.useCallback(() => {
    setActiveTab('colors');
    setPreviewMode(false);
    setShowCodePanel(false);
  }, []);

  return {
    // State
    activeTab,
    previewMode,
    showCodePanel,
    isDarkMode,
    
    // Actions
    setActiveTab,
    setPreviewMode,
    setShowCodePanel,
    toggleThemeMode,
    resetUI,
    
    // Computed
    isColorsTab: activeTab === 'colors',
    isTypographyTab: activeTab === 'typography',
    isBrandTab: activeTab === 'brand',
    isShadowTab: activeTab === 'shadow',
    isBorderTab: activeTab === 'border',
    isSpacingTab: activeTab === 'spacing'
  };
}

// Import React for the composite hook
import React from 'react';