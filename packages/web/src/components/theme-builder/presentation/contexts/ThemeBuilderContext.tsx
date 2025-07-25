/**
 * Theme Builder - Main Context
 * Central state management for the theme builder application
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ThemeData, ColorConfig } from '../../shared/types/theme.types';
import type { TypographyConfig } from '../../shared/types/common.types';
import { Theme } from '../../domain/entities/theme.entity';
import { ManageThemeUseCase } from '../../domain/use-cases/theme/manage-theme.use-case';
import { ImportExportThemeUseCase } from '../../domain/use-cases/theme/import-export-theme.use-case';
import { ManageColorUseCase } from '../../domain/use-cases/color/manage-color.use-case';
import { themeValidator } from '../../infrastructure/validators/theme.validator';
import { storageFactory } from '../../infrastructure/storage/storage.factory';

/**
 * Theme builder state interface
 */
export interface ThemeBuilderState {
  // Core theme data
  theme: Theme | null;
  currentTheme: ThemeData | null;
  
  // Active configurations
  lightColors: Record<string, string>;
  darkColors: Record<string, string>;
  typography: TypographyConfig | null;
  
  // UI state
  activeTab: 'colors' | 'typography' | 'brand' | 'shadow' | 'border' | 'spacing';
  isDarkMode: boolean;
  previewMode: boolean;
  showCodePanel: boolean;
  
  // Color linking state
  colorLinks: Record<string, { linkedTo?: string; isLinked: boolean }>;
  
  // Original state for change tracking
  originalLightColors: Record<string, string>;
  originalDarkColors: Record<string, string>;
  
  // Loading and status
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: string[];
}

/**
 * Theme builder actions interface
 */
export interface ThemeBuilderActions {
  // Theme management
  createNewTheme: (name: string) => Promise<void>;
  loadTheme: (themeId: string) => Promise<void>;
  saveTheme: () => Promise<void>;
  resetTheme: () => void;
  
  // Color management
  updateLightColor: (colorName: string, value: string) => void;
  updateDarkColor: (colorName: string, value: string) => void;
  linkColor: (colorName: string, linkedTo: string) => void;
  unlinkColor: (colorName: string) => void;
  resetColors: () => void;
  
  // Typography management
  updateTypography: (config: Partial<TypographyConfig>) => void;
  resetTypography: () => void;
  
  // UI state management
  setActiveTab: (tab: ThemeBuilderState['activeTab']) => void;
  toggleThemeMode: () => void;
  setPreviewMode: (enabled: boolean) => void;
  setShowCodePanel: (show: boolean) => void;
  
  // Import/Export
  importTheme: (file: File) => Promise<void>;
  exportThemeAsJson: () => Promise<string>;
  exportThemeAsCss: () => Promise<string>;
  
  // Validation
  validateCurrentTheme: () => Promise<boolean>;
  getValidationErrors: () => string[];
  
  // Utility functions
  hasChanges: () => boolean;
  getCurrentColors: () => Record<string, string>;
  getAllColorNames: () => string[];
  isColorLinked: (colorName: string) => boolean;
}

/**
 * Combined context type
 */
export type ThemeBuilderContextType = ThemeBuilderState & ThemeBuilderActions;

/**
 * Theme Builder Context
 */
const ThemeBuilderContext = createContext<ThemeBuilderContextType | null>(null);

/**
 * Initial state
 */
const initialState: ThemeBuilderState = {
  theme: null,
  currentTheme: null,
  lightColors: {},
  darkColors: {},
  typography: null,
  activeTab: 'colors',
  isDarkMode: false,
  previewMode: false,
  showCodePanel: false,
  colorLinks: {},
  originalLightColors: {},
  originalDarkColors: {},
  isLoading: false,
  isSaving: false,
  hasUnsavedChanges: false,
  validationErrors: []
};

/**
 * Theme Builder Provider Component
 */
export function ThemeBuilderProvider({ 
  children, 
  initialTheme,
  companyId,
  onThemeChange,
  onSaveTheme
}: { 
  children: React.ReactNode;
  initialTheme?: ThemeData;
  companyId?: string;
  onThemeChange?: (theme: ThemeData) => void;
  onSaveTheme?: (theme: ThemeData, name?: string) => Promise<void>;
}) {
  // State
  const [state, setState] = useState<ThemeBuilderState>(initialState);
  
  // Use cases
  const manageThemeUseCase = useMemo(() => new ManageThemeUseCase(), []);
  const importExportUseCase = useMemo(() => new ImportExportThemeUseCase(), []);
  const manageColorUseCase = useMemo(() => new ManageColorUseCase(), []);
  
  // Storage
  const themeStorage = useMemo(() => {
    const baseStorage = storageFactory.createLocalStorage();
    return storageFactory.createThemeStorage(baseStorage);
  }, []);

  /**
   * Updates state immutably
   */
  const updateState = useCallback((updates: Partial<ThemeBuilderState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Initializes the theme builder with initial data
   */
  useEffect(() => {
    if (initialTheme) {
      const theme = Theme.fromJSON(initialTheme);
      updateState({
        theme,
        currentTheme: initialTheme,
        lightColors: initialTheme.lightModeConfig || {},
        darkColors: initialTheme.darkModeConfig || {},
        typography: initialTheme.typography || null,
        originalLightColors: initialTheme.lightModeConfig || {},
        originalDarkColors: initialTheme.darkModeConfig || {}
      });
    }
  }, [initialTheme, updateState]);

  /**
   * Validates the current theme
   */
  const validateCurrentTheme = useCallback(async (): Promise<boolean> => {
    if (!state.currentTheme) return false;
    
    const validation = themeValidator.validateTheme(state.currentTheme);
    const errors = validation.errors.map(e => e.message);
    
    updateState({ validationErrors: errors });
    return validation.isValid;
  }, [state.currentTheme, updateState]);

  /**
   * Checks if there are unsaved changes
   */
  const hasChanges = useCallback((): boolean => {
    const lightChanged = JSON.stringify(state.lightColors) !== JSON.stringify(state.originalLightColors);
    const darkChanged = JSON.stringify(state.darkColors) !== JSON.stringify(state.originalDarkColors);
    return lightChanged || darkChanged;
  }, [state.lightColors, state.darkColors, state.originalLightColors, state.originalDarkColors]);

  /**
   * Gets the current colors based on mode
   */
  const getCurrentColors = useCallback((): Record<string, string> => {
    return state.isDarkMode ? state.darkColors : state.lightColors;
  }, [state.isDarkMode, state.lightColors, state.darkColors]);

  /**
   * Gets all unique color names
   */
  const getAllColorNames = useCallback((): string[] => {
    const allNames = new Set([
      ...Object.keys(state.lightColors),
      ...Object.keys(state.darkColors)
    ]);
    return Array.from(allNames).sort();
  }, [state.lightColors, state.darkColors]);

  /**
   * Checks if a color is linked
   */
  const isColorLinked = useCallback((colorName: string): boolean => {
    return state.colorLinks[colorName]?.isLinked || false;
  }, [state.colorLinks]);

  /**
   * Creates a new theme
   */
  const createNewTheme = useCallback(async (name: string): Promise<void> => {
    updateState({ isLoading: true });
    
    try {
      const newThemeData: ThemeData = {
        name,
        version: '1.0.0',
        lightModeConfig: {},
        darkModeConfig: {},
        createdAt: new Date().toISOString()
      };
      
      const theme = Theme.fromJSON(newThemeData);
      
      updateState({
        theme,
        currentTheme: newThemeData,
        lightColors: {},
        darkColors: {},
        originalLightColors: {},
        originalDarkColors: {},
        colorLinks: {},
        hasUnsavedChanges: false,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to create new theme:', error);
      updateState({ isLoading: false });
      throw error;
    }
  }, [updateState]);

  /**
   * Loads a theme by ID
   */
  const loadTheme = useCallback(async (themeId: string): Promise<void> => {
    updateState({ isLoading: true });
    
    try {
      const themeData = await themeStorage.loadTheme(themeId);
      
      if (!themeData) {
        throw new Error('Theme not found');
      }
      
      const theme = Theme.fromJSON(themeData);
      
      updateState({
        theme,
        currentTheme: themeData,
        lightColors: themeData.lightModeConfig || {},
        darkColors: themeData.darkModeConfig || {},
        typography: themeData.typography || null,
        originalLightColors: themeData.lightModeConfig || {},
        originalDarkColors: themeData.darkModeConfig || {},
        hasUnsavedChanges: false,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load theme:', error);
      updateState({ isLoading: false });
      throw error;
    }
  }, [themeStorage, updateState]);

  /**
   * Saves the current theme
   */
  const saveTheme = useCallback(async (): Promise<void> => {
    if (!state.currentTheme || !state.theme) {
      throw new Error('No theme to save');
    }
    
    updateState({ isSaving: true });
    
    try {
      const updatedThemeData: ThemeData = {
        ...state.currentTheme,
        lightModeConfig: state.lightColors,
        darkModeConfig: state.darkColors,
        typography: state.typography || undefined,
        updatedAt: new Date().toISOString()
      };
      
      await themeStorage.saveTheme(state.theme.getId(), updatedThemeData);
      
      updateState({
        currentTheme: updatedThemeData,
        originalLightColors: { ...state.lightColors },
        originalDarkColors: { ...state.darkColors },
        hasUnsavedChanges: false,
        isSaving: false
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
      updateState({ isSaving: false });
      throw error;
    }
  }, [state, themeStorage, updateState]);

  /**
   * Resets the theme to original state
   */
  const resetTheme = useCallback((): void => {
    updateState({
      lightColors: { ...state.originalLightColors },
      darkColors: { ...state.originalDarkColors },
      hasUnsavedChanges: false
    });
  }, [state.originalLightColors, state.originalDarkColors, updateState]);

  /**
   * Updates a light mode color
   */
  const updateLightColor = useCallback((colorName: string, value: string): void => {
    const newLightColors = { ...state.lightColors, [colorName]: value };
    updateState({ 
      lightColors: newLightColors,
      hasUnsavedChanges: hasChanges()
    });
  }, [state.lightColors, hasChanges, updateState]);

  /**
   * Updates a dark mode color
   */
  const updateDarkColor = useCallback((colorName: string, value: string): void => {
    const newDarkColors = { ...state.darkColors, [colorName]: value };
    updateState({ 
      darkColors: newDarkColors,
      hasUnsavedChanges: hasChanges()
    });
  }, [state.darkColors, hasChanges, updateState]);

  /**
   * Links a color to another color
   */
  const linkColor = useCallback((colorName: string, linkedTo: string): void => {
    const newColorLinks = {
      ...state.colorLinks,
      [colorName]: { linkedTo, isLinked: true }
    };
    updateState({ colorLinks: newColorLinks });
  }, [state.colorLinks, updateState]);

  /**
   * Unlinks a color
   */
  const unlinkColor = useCallback((colorName: string): void => {
    const newColorLinks = { ...state.colorLinks };
    delete newColorLinks[colorName];
    updateState({ colorLinks: newColorLinks });
  }, [state.colorLinks, updateState]);

  /**
   * Resets colors to original state
   */
  const resetColors = useCallback((): void => {
    updateState({
      lightColors: { ...state.originalLightColors },
      darkColors: { ...state.originalDarkColors },
      colorLinks: {},
      hasUnsavedChanges: false
    });
  }, [state.originalLightColors, state.originalDarkColors, updateState]);

  /**
   * Updates typography configuration
   */
  const updateTypography = useCallback((config: Partial<TypographyConfig>): void => {
    const newTypography = { ...state.typography, ...config };
    updateState({ 
      typography: newTypography,
      hasUnsavedChanges: hasChanges()
    });
  }, [state.typography, hasChanges, updateState]);

  /**
   * Resets typography to default
   */
  const resetTypography = useCallback((): void => {
    updateState({ typography: null });
  }, [updateState]);

  /**
   * Sets the active tab
   */
  const setActiveTab = useCallback((tab: ThemeBuilderState['activeTab']): void => {
    updateState({ activeTab: tab });
  }, [updateState]);

  /**
   * Toggles between light and dark mode
   */
  const toggleThemeMode = useCallback((): void => {
    updateState({ isDarkMode: !state.isDarkMode });
  }, [state.isDarkMode, updateState]);

  /**
   * Sets preview mode
   */
  const setPreviewMode = useCallback((enabled: boolean): void => {
    updateState({ previewMode: enabled });
  }, [updateState]);

  /**
   * Sets code panel visibility
   */
  const setShowCodePanel = useCallback((show: boolean): void => {
    updateState({ showCodePanel: show });
  }, [updateState]);

  /**
   * Imports a theme from file
   */
  const importTheme = useCallback(async (file: File): Promise<void> => {
    updateState({ isLoading: true });
    
    try {
      const themeData = await importExportUseCase.importFromFile(file);
      
      if (!themeData) {
        throw new Error('Failed to import theme data');
      }
      
      const theme = Theme.fromJSON(themeData);
      
      updateState({
        theme,
        currentTheme: themeData,
        lightColors: themeData.lightModeConfig || {},
        darkColors: themeData.darkModeConfig || {},
        typography: themeData.typography || null,
        originalLightColors: themeData.lightModeConfig || {},
        originalDarkColors: themeData.darkModeConfig || {},
        hasUnsavedChanges: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to import theme:', error);
      updateState({ isLoading: false });
      throw error;
    }
  }, [importExportUseCase, updateState]);

  /**
   * Exports theme as JSON
   */
  const exportThemeAsJson = useCallback(async (): Promise<string> => {
    if (!state.currentTheme) {
      throw new Error('No theme to export');
    }
    
    const themeData: ThemeData = {
      ...state.currentTheme,
      lightModeConfig: state.lightColors,
      darkModeConfig: state.darkColors,
      typography: state.typography || undefined
    };
    
    return importExportUseCase.exportAsJson(themeData);
  }, [state, importExportUseCase]);

  /**
   * Exports theme as CSS
   */
  const exportThemeAsCss = useCallback(async (): Promise<string> => {
    if (!state.currentTheme) {
      throw new Error('No theme to export');
    }
    
    const themeData: ThemeData = {
      ...state.currentTheme,
      lightModeConfig: state.lightColors,
      darkModeConfig: state.darkColors,
      typography: state.typography || undefined
    };
    
    return importExportUseCase.exportAsCss(themeData);
  }, [state, importExportUseCase]);

  /**
   * Gets current validation errors
   */
  const getValidationErrors = useCallback((): string[] => {
    return state.validationErrors;
  }, [state.validationErrors]);

  // Update hasUnsavedChanges when colors change
  useEffect(() => {
    const hasChangesNow = hasChanges();
    if (hasChangesNow !== state.hasUnsavedChanges) {
      updateState({ hasUnsavedChanges: hasChangesNow });
    }
  }, [hasChanges, state.hasUnsavedChanges, updateState]);

  // Context value
  const contextValue: ThemeBuilderContextType = {
    // State
    ...state,
    
    // Actions
    createNewTheme,
    loadTheme,
    saveTheme,
    resetTheme,
    updateLightColor,
    updateDarkColor,
    linkColor,
    unlinkColor,
    resetColors,
    updateTypography,
    resetTypography,
    setActiveTab,
    toggleThemeMode,
    setPreviewMode,
    setShowCodePanel,
    importTheme,
    exportThemeAsJson,
    exportThemeAsCss,
    validateCurrentTheme,
    getValidationErrors,
    hasChanges,
    getCurrentColors,
    getAllColorNames,
    isColorLinked
  };

  return (
    <ThemeBuilderContext.Provider value={contextValue}>
      {children}
    </ThemeBuilderContext.Provider>
  );
}

/**
 * Hook to use the Theme Builder context
 */
export function useThemeBuilder(): ThemeBuilderContextType {
  const context = useContext(ThemeBuilderContext);
  
  if (!context) {
    throw new Error('useThemeBuilder must be used within a ThemeBuilderProvider');
  }
  
  return context;
}

/**
 * Hook for theme operations only
 */
export function useThemeOperations() {
  const context = useThemeBuilder();
  
  return {
    createNewTheme: context.createNewTheme,
    loadTheme: context.loadTheme,
    saveTheme: context.saveTheme,
    resetTheme: context.resetTheme,
    importTheme: context.importTheme,
    exportThemeAsJson: context.exportThemeAsJson,
    exportThemeAsCss: context.exportThemeAsCss,
    validateCurrentTheme: context.validateCurrentTheme,
  };
}

/**
 * Hook for color operations only
 */
export function useColorOperations() {
  const context = useThemeBuilder();
  
  return {
    lightColors: context.lightColors,
    darkColors: context.darkColors,
    updateLightColor: context.updateLightColor,
    updateDarkColor: context.updateDarkColor,
    linkColor: context.linkColor,
    unlinkColor: context.unlinkColor,
    resetColors: context.resetColors,
    getCurrentColors: context.getCurrentColors,
    getAllColorNames: context.getAllColorNames,
    isColorLinked: context.isColorLinked,
  };
}

/**
 * Hook for UI state only
 */
export function useThemeBuilderUI() {
  const context = useThemeBuilder();
  
  return {
    activeTab: context.activeTab,
    isDarkMode: context.isDarkMode,
    previewMode: context.previewMode,
    showCodePanel: context.showCodePanel,
    setActiveTab: context.setActiveTab,
    toggleThemeMode: context.toggleThemeMode,
    setPreviewMode: context.setPreviewMode,
    setShowCodePanel: context.setShowCodePanel,
  };
}