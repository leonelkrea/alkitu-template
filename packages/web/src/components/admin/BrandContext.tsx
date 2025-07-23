'use client';

import React from 'react';

// Brand Configuration Types
export interface BrandConfig {
  customSvg?: string;
  primaryText: string;
  secondaryText: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  monochromeMode: 'none' | 'white' | 'black';
  // Icon colors
  iconBackgroundColor: string;
  iconColor: string;
  // Flags to track if colors are linked to system or overridden
  primaryTextColorLinked: boolean;
  secondaryTextColorLinked: boolean;
  iconBackgroundColorLinked: boolean;
  iconColorLinked: boolean;
}

// Brand Context for sharing state between editor and preview
export const BrandContext = React.createContext<{
  config: BrandConfig;
  updateConfig: (updates: Partial<BrandConfig>) => void;
} | null>(null);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = React.useState<BrandConfig>({
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
  });

  const updateConfig = React.useCallback((updates: Partial<BrandConfig>) => {
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
  }, []);

  const contextValue = React.useMemo(() => ({ config, updateConfig }), [config, updateConfig]);
  
  return (
    <BrandContext.Provider value={contextValue}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrandConfig() {
  const context = React.useContext(BrandContext);
  if (!context) {
    throw new Error('useBrandConfig must be used within BrandProvider');
  }
  return context;
}