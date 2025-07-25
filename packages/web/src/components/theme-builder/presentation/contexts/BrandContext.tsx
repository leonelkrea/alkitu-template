/**
 * Theme Builder - Brand Context
 * State management for brand configuration (logos, colors, text)
 * Part of Clean Architecture presentation layer - moved from admin/BrandContext.tsx
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { BrandConfig } from '../../shared/types/theme.types';
import { BrandEntity } from '../../domain/entities/brand.entity';
import { ManageBrandUseCase } from '../../domain/use-cases/brand/manage-brand.use-case';

/**
 * Brand context state interface
 */
export interface BrandContextState {
  config: BrandConfig;
  brand: BrandEntity | null;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}

/**
 * Brand context actions interface
 */
export interface BrandContextActions {
  updateConfig: (updates: Partial<BrandConfig>) => void;
  relinkToSystem: (colorType: keyof BrandConfig) => void;
  resetBrand: () => void;
  saveBrand: () => Promise<void>;
  loadBrand: (brandData: BrandConfig) => void;
}

/**
 * Combined brand context type
 */
export type BrandContextType = BrandContextState & BrandContextActions;

/**
 * Brand Context
 */
const BrandContext = createContext<BrandContextType | null>(null);

/**
 * Default brand configuration
 */
const defaultBrandConfig: BrandConfig = {
  primaryText: 'Alkitu',
  secondaryText: 'Design System',
  primaryTextColor: '', // Will use system foreground
  secondaryTextColor: '', // Will use system muted-foreground  
  monochromeMode: 'none',
  iconBackgroundColor: '', // Will use system primary
  iconColor: '', // Will use system primary-foreground
  primaryTextColorLinked: true, // Linked to system by default
  secondaryTextColorLinked: true, // Linked to system by default
  iconBackgroundColorLinked: true, // Linked to system by default
  iconColorLinked: true, // Linked to system by default
  primaryTextColorLinkedTo: 'foreground',
  secondaryTextColorLinkedTo: 'muted-foreground',
  iconBackgroundColorLinkedTo: 'primary',
  iconColorLinkedTo: 'primary-foreground',
};

/**
 * Brand Provider Component
 */
export function BrandProvider({ 
  children,
  onThemeColorUpdate,
  isDarkMode 
}: { 
  children: React.ReactNode;
  onThemeColorUpdate?: (colors: Record<string, string>, mode: 'light' | 'dark') => void;
  isDarkMode?: boolean;
}) {
  // State
  const [config, setConfig] = useState<BrandConfig>(defaultBrandConfig);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<BrandConfig>(defaultBrandConfig);

  // Use cases  
  const manageBrandUseCase = useMemo(() => new ManageBrandUseCase(), []);

  /**
   * Gets current system color value from CSS variables
   */
  const getSystemColor = useCallback((colorName: string): string => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const colorValue = getComputedStyle(root).getPropertyValue(`--${colorName}`).trim();
      if (colorValue) {
        // Convert HSL to hex if needed, or return as is
        return colorValue.startsWith('hsl') || colorValue.includes(' ') 
          ? `hsl(${colorValue})` 
          : colorValue;
      }
    }
    return '';
  }, []);

  /**
   * Updates linked colors when theme changes
   */
  useEffect(() => {
    if (config.primaryTextColorLinked || config.secondaryTextColorLinked || 
        config.iconBackgroundColorLinked || config.iconColorLinked) {
      
      const updates: Partial<BrandConfig> = {};
      
      if (config.primaryTextColorLinked && config.primaryTextColorLinkedTo) {
        updates.primaryTextColor = getSystemColor(config.primaryTextColorLinkedTo);
      }
      if (config.secondaryTextColorLinked && config.secondaryTextColorLinkedTo) {
        updates.secondaryTextColor = getSystemColor(config.secondaryTextColorLinkedTo);
      }
      if (config.iconBackgroundColorLinked && config.iconBackgroundColorLinkedTo) {
        updates.iconBackgroundColor = getSystemColor(config.iconBackgroundColorLinkedTo);
      }
      if (config.iconColorLinked && config.iconColorLinkedTo) {
        updates.iconColor = getSystemColor(config.iconColorLinkedTo);
      }

      if (Object.keys(updates).length > 0) {
        setConfig(prev => ({ ...prev, ...updates }));
      }
    }
  }, [
    config.primaryTextColorLinked, 
    config.secondaryTextColorLinked,
    config.iconBackgroundColorLinked, 
    config.iconColorLinked,
    config.primaryTextColorLinkedTo,
    config.secondaryTextColorLinkedTo,
    config.iconBackgroundColorLinkedTo,
    config.iconColorLinkedTo,
    getSystemColor
  ]);

  /**
   * Checks if there are unsaved changes
   */
  const checkForChanges = useCallback(() => {
    const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig);
    setHasUnsavedChanges(hasChanges);
  }, [config, originalConfig]);

  /**
   * Updates brand configuration
   */
  const updateConfig = useCallback((updates: Partial<BrandConfig>): void => {
    console.log('BrandProvider updateConfig called with:', updates);
    
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      
      // Break the link when colors are manually changed
      if ('primaryTextColor' in updates && updates.primaryTextColor) {
        newConfig.primaryTextColorLinked = false;
        console.log('Breaking primary text color link - now using custom color');
      }
      if ('secondaryTextColor' in updates && updates.secondaryTextColor) {
        newConfig.secondaryTextColorLinked = false;
        console.log('Breaking secondary text color link - now using custom color');
      }
      if ('iconBackgroundColor' in updates && updates.iconBackgroundColor) {
        newConfig.iconBackgroundColorLinked = false;
        console.log('Breaking icon background color link - now using custom color');
      }
      if ('iconColor' in updates && updates.iconColor) {
        newConfig.iconColorLinked = false;
        console.log('Breaking icon color link - now using custom color');
      }
      
      console.log('BrandProvider new config:', newConfig);
      return newConfig;
    });

    // Apply color changes immediately when unlinking (customizing)
    if (onThemeColorUpdate) {
      const immediateColorUpdates: Record<string, string> = {};
      
      if ('primaryTextColor' in updates && updates.primaryTextColor && updates.primaryTextColorLinked === false) {
        immediateColorUpdates['foreground'] = updates.primaryTextColor;
      }
      if ('secondaryTextColor' in updates && updates.secondaryTextColor && updates.secondaryTextColorLinked === false) {
        immediateColorUpdates['muted-foreground'] = updates.secondaryTextColor;
      }
      if ('iconBackgroundColor' in updates && updates.iconBackgroundColor && updates.iconBackgroundColorLinked === false) {
        immediateColorUpdates['primary'] = updates.iconBackgroundColor;
      }
      if ('iconColor' in updates && updates.iconColor && updates.iconColorLinked === false) {
        immediateColorUpdates['primary-foreground'] = updates.iconColor;
      }

      if (Object.keys(immediateColorUpdates).length > 0) {
        onThemeColorUpdate(immediateColorUpdates, isDarkMode ? 'dark' : 'light');
      }
    }
  }, [onThemeColorUpdate, isDarkMode]);

  /**
   * Re-links a color to system
   */
  const relinkToSystem = useCallback((colorType: keyof BrandConfig): void => {
    const updates: Partial<BrandConfig> = {};
    
    switch (colorType) {
      case 'primaryTextColor':
        updates.primaryTextColor = getSystemColor('foreground');
        updates.primaryTextColorLinked = true;
        updates.primaryTextColorLinkedTo = 'foreground';
        break;
      case 'secondaryTextColor':
        updates.secondaryTextColor = getSystemColor('muted-foreground');
        updates.secondaryTextColorLinked = true;
        updates.secondaryTextColorLinkedTo = 'muted-foreground';
        break;
      case 'iconBackgroundColor':
        updates.iconBackgroundColor = getSystemColor('primary');
        updates.iconBackgroundColorLinked = true;
        updates.iconBackgroundColorLinkedTo = 'primary';
        break;
      case 'iconColor':
        updates.iconColor = getSystemColor('primary-foreground');
        updates.iconColorLinked = true;
        updates.iconColorLinkedTo = 'primary-foreground';
        break;
    }
    
    if (Object.keys(updates).length > 0) {
      setConfig(prev => ({ ...prev, ...updates }));
    }
  }, [getSystemColor]);

  /**
   * Resets brand to original configuration
   */
  const resetBrand = useCallback((): void => {
    setConfig(originalConfig);
    setHasUnsavedChanges(false);
  }, [originalConfig]);

  /**
   * Saves brand configuration
   */
  const saveBrand = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Update brand entity
      if (brand) {
        brand.updateConfiguration(config);
        await manageBrandUseCase.saveBrand(brand);
      } else {
        const newBrand = new BrandEntity(config);
        setBrand(newBrand);
        await manageBrandUseCase.saveBrand(newBrand);
      }
      
      // Update original config for change tracking
      setOriginalConfig({ ...config });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save brand:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [brand, config, manageBrandUseCase]);

  /**
   * Loads brand configuration
   */
  const loadBrand = useCallback((brandData: BrandConfig): void => {
    setConfig(brandData);
    setOriginalConfig({ ...brandData });
    
    const brandEntity = new BrandEntity(brandData);
    setBrand(brandEntity);
    setHasUnsavedChanges(false);
  }, []);

  // Check for changes when config updates
  useEffect(() => {
    checkForChanges();
  }, [checkForChanges]);

  // Initialize brand entity when config changes
  useEffect(() => {
    if (!brand && config !== defaultBrandConfig) {
      const brandEntity = new BrandEntity(config);
      setBrand(brandEntity);
    }
  }, [brand, config]);

  // Context value
  const contextValue: BrandContextType = useMemo(() => ({
    // State
    config,
    brand,
    isLoading,
    hasUnsavedChanges,
    
    // Actions
    updateConfig,
    relinkToSystem,
    resetBrand,
    saveBrand,
    loadBrand
  }), [
    config,
    brand,
    isLoading,
    hasUnsavedChanges,
    updateConfig,
    relinkToSystem,
    resetBrand,
    saveBrand,
    loadBrand
  ]);

  return (
    <BrandContext.Provider value={contextValue}>
      {children}
    </BrandContext.Provider>
  );
}

/**
 * Hook to use the Brand context
 */
export function useBrandConfig(): BrandContextType {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrandConfig must be used within BrandProvider');
  }
  return context;
}

/**
 * Hook for brand operations only
 */
export function useBrandOperations() {
  const context = useBrandConfig();
  
  return {
    saveBrand: context.saveBrand,
    resetBrand: context.resetBrand,
    loadBrand: context.loadBrand,
  };
}

/**
 * Hook for brand configuration only
 */
export function useBrandConfiguration() {
  const context = useBrandConfig();
  
  return {
    config: context.config,
    updateConfig: context.updateConfig,
    relinkToSystem: context.relinkToSystem,
    hasUnsavedChanges: context.hasUnsavedChanges,
  };
}

/**
 * Hook for brand state only
 */
export function useBrandState() {
  const context = useBrandConfig();
  
  return {
    config: context.config,
    brand: context.brand,
    isLoading: context.isLoading,
    hasUnsavedChanges: context.hasUnsavedChanges,
  };
}