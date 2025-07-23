import { useCallback, useState, useEffect } from 'react';

export interface ThemeEditorContextValue {
  applyTheme: (themeColors: Record<string, string>) => void;
  resetTheme: () => void;
  currentTheme: Record<string, string> | null;
}

export function useDynamicTheme(): ThemeEditorContextValue {
  const [currentTheme, setCurrentTheme] = useState<Record<string, string> | null>(null);
  
  const applyTheme = useCallback((themeColors: Record<string, string>) => {
    // Apply CSS variables directly to document root
    const root = document.documentElement;
    
    Object.entries(themeColors).forEach(([key, value]) => {
      if (value && value.trim()) {
        // Convert OKLCH values to CSS custom properties
        const cssValue = value.includes('oklch') ? value : `oklch(${value})`;
        root.style.setProperty(`--${key}`, cssValue);
        
        // Also set foreground variants for better contrast
        if (key.includes('primary') || key.includes('secondary') || key.includes('accent')) {
          const foregroundKey = `${key}-foreground`;
          // For now, use a simple contrast rule
          const lightness = parseFloat(value.split(' ')[2]?.replace('%', '') || '50');
          const foregroundValue = lightness > 60 ? 'oklch(0 0 0)' : 'oklch(100% 0 0)';
          root.style.setProperty(`--${foregroundKey}`, foregroundValue);
        }
      }
    });
    
    // Update current theme state
    setCurrentTheme(themeColors);
  }, []);

  const resetTheme = useCallback(() => {
    // Reset to default theme by removing custom properties
    const root = document.documentElement;
    const properties = [
      'primary', 'primary-foreground',
      'secondary', 'secondary-foreground', 
      'accent', 'accent-foreground',
      'background', 'foreground',
      'muted', 'muted-foreground',
      'destructive', 'destructive-foreground',
      'border', 'input', 'ring'
    ];
    
    properties.forEach(prop => {
      root.style.removeProperty(`--${prop}`);
    });
    
    setCurrentTheme(null);
  }, []);

  // Initialize current theme from DOM on mount
  useEffect(() => {
    const getCurrentThemeFromDOM = (): Record<string, string> | null => {
      if (typeof window === 'undefined') return null;
      
      const root = document.documentElement;
      const theme: Record<string, string> = {};
      
      const properties = [
        'primary', 'secondary', 'accent', 'background', 
        'foreground', 'muted', 'muted-foreground',
        'destructive', 'border', 'input', 'ring'
      ];
      
      properties.forEach(prop => {
        const value = root.style.getPropertyValue(`--${prop}`);
        if (value) {
          theme[prop] = value.replace('oklch(', '').replace(')', '');
        }
      });
      
      return Object.keys(theme).length > 0 ? theme : null;
    };

    setCurrentTheme(getCurrentThemeFromDOM());
  }, []);

  return {
    applyTheme,
    resetTheme,
    currentTheme,
  };
}