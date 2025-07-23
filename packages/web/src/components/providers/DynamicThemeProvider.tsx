import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';

export interface Theme {
  id: string;
  companyId: string;
  name: string;
  lightModeConfig: Record<string, string>;
  darkModeConfig?: Record<string, string>;
  isActive: boolean;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeRule {
  id: string;
  themeId: string;
  selector: string;
  properties: Record<string, string>;
  specificity: 'GLOBAL' | 'COMPONENT' | 'CONTEXTUAL' | 'INSTANCE';
}

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme | null;
  loading: boolean;
  error: string | null;
  tokens: Record<string, string>;
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  updateTheme: (themeData: Partial<Theme>) => Promise<void>;
  applyThemeRule: (rule: ThemeRule) => void;
  applyTheme: (themeId: string, companyId?: string) => Promise<void>;
  refreshTheme: () => Promise<void>;
  setCurrentTheme: (theme: Theme) => void;
  updateThemeColors: (colors: Record<string, string>, mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface DynamicThemeProviderProps {
  companyId?: string;
  themeId?: string;
  themeData?: Theme;
  fallbackTheme?: 'light' | 'dark';
  defaultMode?: ThemeMode;
  children: React.ReactNode;
}

// Helper functions
function computeContrastColor(color: string): string {
  if (!color || color === 'transparent') return 'oklch(0 0 0)';
  
  if (color.includes('oklch')) {
    const match = color.match(/oklch\(\s*([0-9.]+)/);
    if (match) {
      const lightness = parseFloat(match[1]);
      return lightness > 0.5 ? 'oklch(0 0 0)' : 'oklch(1 0 0)';
    }
  }

  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? 'oklch(0 0 0)' : 'oklch(1 0 0)';
  }

  return 'oklch(1 0 0)';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}

function generateCSSFromRule(rule: ThemeRule): string {
  const selector = rule.selector || ':root';
  const properties = Object.entries(rule.properties || {})
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `
    /* Theme Rule: ${rule.id} (${rule.specificity}) */
    ${selector} {
      ${properties}
    }
  `;
}

function generateTokensFromTheme(theme: Theme, isDarkMode: boolean): Record<string, string> {
  const tokens: Record<string, string> = {};

  // Use appropriate config based on mode
  const config = isDarkMode ? theme.darkModeConfig : theme.lightModeConfig;
  
  if (config) {
    Object.entries(config).forEach(([key, value]) => {
      tokens[key] = value;
    });
  } else if (theme.lightModeConfig) {
    // Fallback to light mode if dark mode not available
    Object.entries(theme.lightModeConfig).forEach(([key, value]) => {
      tokens[key] = value;
    });
  }

  // Compute contrast colors if not explicitly defined
  if (!tokens['primary-foreground']) {
    tokens['primary-foreground'] = computeContrastColor(tokens['primary'] || '#000000');
  }
  if (!tokens['secondary-foreground']) {
    tokens['secondary-foreground'] = computeContrastColor(tokens['secondary'] || '#666666');
  }
  if (!tokens['destructive-foreground']) {
    tokens['destructive-foreground'] = computeContrastColor(tokens['destructive'] || '#dc2626');
  }

  return tokens;
}

function generateFallbackTokens(fallback: 'light' | 'dark'): Record<string, string> {
  const isLight = fallback === 'light';
  
  return {
    // Primary Colors
    primary: isLight ? 'oklch(0.5634 0.1517 146.7438)' : 'oklch(0.6735 0.1851 146.7724)',
    'primary-foreground': isLight ? 'oklch(1 0 0)' : 'oklch(0.1 0 0)',
    
    // Secondary Colors  
    secondary: isLight ? 'oklch(0.9683 0.0069 247.8956)' : 'oklch(0.2 0.01 247.8956)',
    'secondary-foreground': isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.9 0.01 259.2010)',
    
    // Accent Colors
    accent: isLight ? 'oklch(0.96 0.01 247.8956)' : 'oklch(0.15 0.01 247.8956)',
    'accent-foreground': isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.95 0.01 259.2010)',
    
    // Base Colors
    background: isLight ? 'oklch(1 0 0)' : 'oklch(0.09 0 0)',
    foreground: isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.95 0.01 259.2010)',
    
    // Card Colors
    card: isLight ? 'oklch(1 0 0)' : 'oklch(0.09 0 0)',
    'card-foreground': isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.95 0.01 259.2010)',
    
    // Popover Colors
    popover: isLight ? 'oklch(1 0 0)' : 'oklch(0.09 0 0)',
    'popover-foreground': isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.95 0.01 259.2010)',
    
    // Muted Colors
    muted: isLight ? 'oklch(0.96 0.01 247.8956)' : 'oklch(0.15 0.01 247.8956)',
    'muted-foreground': isLight ? 'oklch(0.45 0.01 247.8956)' : 'oklch(0.6 0.01 247.8956)',
    
    // Status Colors
    success: isLight ? 'oklch(0.65 0.15 160)' : 'oklch(0.7 0.17 160)',
    'success-foreground': isLight ? 'oklch(1 0 0)' : 'oklch(0.1 0 0)',
    warning: isLight ? 'oklch(0.75 0.15 85)' : 'oklch(0.8 0.17 85)',
    'warning-foreground': isLight ? 'oklch(0.1 0 0)' : 'oklch(0.1 0 0)',
    destructive: isLight ? 'oklch(0.627 0.22 29.2329)' : 'oklch(0.7 0.25 29.2329)',
    'destructive-foreground': 'oklch(1 0 0)',
    
    // Border & Input Colors
    border: isLight ? 'oklch(0.9288 0.0126 255.5078)' : 'oklch(0.2 0.01 255.5078)',
    input: isLight ? 'oklch(0.9288 0.0126 255.5078)' : 'oklch(0.2 0.01 255.5078)',
    ring: 'oklch(0.5634 0.1517 146.7438)',
    
    // Chart Colors
    'chart-1': isLight ? 'oklch(0.55 0.15 250)' : 'oklch(0.65 0.18 250)',
    'chart-2': isLight ? 'oklch(0.6 0.18 280)' : 'oklch(0.7 0.2 280)',
    'chart-3': isLight ? 'oklch(0.75 0.15 85)' : 'oklch(0.8 0.17 85)',
    'chart-4': isLight ? 'oklch(0.65 0.18 340)' : 'oklch(0.75 0.2 340)',
    'chart-5': isLight ? 'oklch(0.7 0.15 120)' : 'oklch(0.8 0.17 120)',
    
    // Sidebar Colors
    sidebar: isLight ? 'oklch(0.98 0.005 247.8956)' : 'oklch(0.12 0.005 247.8956)',
    'sidebar-foreground': isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.95 0.01 259.2010)',
    'sidebar-primary': isLight ? 'oklch(0.5634 0.1517 146.7438)' : 'oklch(0.6735 0.1851 146.7724)',
    'sidebar-primary-foreground': isLight ? 'oklch(1 0 0)' : 'oklch(0.1 0 0)',
    'sidebar-accent': isLight ? 'oklch(0.96 0.01 247.8956)' : 'oklch(0.15 0.01 247.8956)',
    'sidebar-accent-foreground': isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.95 0.01 259.2010)',
    'sidebar-border': isLight ? 'oklch(0.9288 0.0126 255.5078)' : 'oklch(0.2 0.01 255.5078)',
    'sidebar-ring': 'oklch(0.5634 0.1517 146.7438)',
    
    // Typography and Layout
    radius: '0.5rem',
    'font-sans': 'Inter, system-ui, sans-serif', 
    'font-mono': 'ui-monospace, SFMono-Regular, monospace',
  };
}

export const DynamicThemeProvider: React.FC<DynamicThemeProviderProps> = ({
  companyId,
  themeId,
  themeData,
  fallbackTheme = 'light',
  defaultMode = 'system',
  children,
}) => {
  const [theme, setTheme] = useState<Theme | null>(themeData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultMode);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  
  // Use tRPC to fetch theme
  const { data: fetchedTheme, isLoading, error: trpcError } = trpc.theme.getThemeById.useQuery(
    { themeId: themeId || '' },
    { 
      enabled: !!themeId && !themeData,
      retry: false,
    }
  );
  
  // Fetch company themes if no specific theme ID
  const { data: companyThemes, isLoading: isLoadingCompanyThemes } = trpc.theme.getCompanyThemes.useQuery(
    { companyId: companyId || '' },
    { 
      enabled: !!companyId && !themeId && !themeData,
      retry: false,
    }
  );

  // Determine if dark mode should be active
  const isDarkMode = useMemo(() => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    return systemPrefersDark; // system mode
  }, [themeMode, systemPrefersDark]);

  const tokens = useMemo(() => {
    if (!theme) return generateFallbackTokens(isDarkMode ? 'dark' : 'light');
    return generateTokensFromTheme(theme, isDarkMode);
  }, [theme, isDarkMode]);

  // System theme preference detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load theme mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
      setThemeModeState(savedMode);
    }
  }, []);

  // Update theme when tRPC data changes
  useEffect(() => {
    if (fetchedTheme) {
      console.log('🎯 Setting theme from fetchedTheme:', fetchedTheme.name);
      setTheme(fetchedTheme as Theme);
    } else if (companyThemes && companyThemes.length > 0) {
      // Find the default theme first (marked as isDefault)
      const defaultTheme = companyThemes.find(t => t.isDefault);
      
      if (defaultTheme) {
        console.log('🎯 Found DEFAULT theme:', defaultTheme.name, 'isDefault:', defaultTheme.isDefault);
        setTheme(defaultTheme as Theme);
      } else {
        // If no default theme exists, create a basic default theme
        console.log('🎯 No default theme found. Creating default theme...');
        if (companyId && companyId.length === 24) {
          createDefaultThemeMutation.mutate({
            name: 'Default',
            companyId,
            createdById: 'system',
            lightModeConfig: generateFallbackTokens('light'),
            darkModeConfig: generateFallbackTokens('dark'),
            isDefault: true,
          });
        }
      }
    } else {
      console.log('🎯 No themes available yet');
    }
  }, [fetchedTheme, companyThemes]);
  
  // Update loading and error states
  useEffect(() => {
    setLoading(isLoading || isLoadingCompanyThemes);
    if (trpcError) {
      setError(trpcError.message);
      console.warn('Theme fetch failed, using fallback:', trpcError.message);
    }
  }, [isLoading, isLoadingCompanyThemes, trpcError]);

  const utils = trpc.useUtils();
  const updateThemeMutation = trpc.theme.updateTheme.useMutation({
    onSuccess: () => {
      // Invalidate theme queries to refetch
      utils.theme.getThemeById.invalidate();
      utils.theme.getCompanyThemes.invalidate();
    },
  });

  const createDefaultThemeMutation = trpc.theme.createTheme.useMutation({
    onSuccess: (newTheme) => {
      console.log('🎯 Created default theme:', newTheme.name);
      setTheme(newTheme as Theme);
      utils.theme.getCompanyThemes.invalidate();
    },
  });

  const setDefaultThemeMutation = trpc.theme.setDefaultTheme.useMutation({
    onSuccess: () => {
      // Invalidate theme queries to refetch
      utils.theme.getCompanyThemes.invalidate();
    },
  });

  const updateTheme = async (themeData: Partial<Theme>): Promise<void> => {
    if (!theme?.id) {
      console.warn('Cannot update theme: no active theme');
      return;
    }

    const updatedTheme = { ...theme, ...themeData };
    setTheme(updatedTheme);

    try {
      await updateThemeMutation.mutateAsync({
        themeId: theme.id,
        userId: 'default-user', // TODO: Get from auth context
        ...themeData,
      });
    } catch (err) {
      console.error('Failed to persist theme update:', err);
    }
  };

  const applyThemeRule = (rule: ThemeRule): void => {
    const styleId = `theme-rule-${rule.id}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = generateCSSFromRule(rule);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('theme-mode', mode);
  };

  const toggleThemeMode = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const refreshTheme = async (): Promise<void> => {
    // Invalidate and refetch theme queries
    if (themeId) {
      await utils.theme.getThemeById.invalidate({ themeId });
    } else if (companyId) {
      await utils.theme.getCompanyThemes.invalidate({ companyId, activeOnly: true });
    }
  };

  const applyTheme = async (themeId: string, targetCompanyId?: string): Promise<void> => {
    const currentCompanyId = targetCompanyId || companyId;
    
    if (!currentCompanyId) {
      console.warn('Cannot apply theme: no company ID available');
      return;
    }

    try {
      await setDefaultThemeMutation.mutateAsync({
        themeId,
        companyId: currentCompanyId,
        userId: 'default-user', // TODO: Get from auth context
      });
      
      // Refresh to get the updated default theme
      await refreshTheme();
    } catch (err) {
      console.error('Failed to apply theme:', err);
      throw err;
    }
  };

  const setCurrentTheme = (newTheme: Theme) => {
    console.log('🎯 [CONTEXT] Setting current theme:', newTheme.name, 'ID:', newTheme.id);
    setTheme(newTheme);
    
    // Force a re-render by dispatching custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('theme-context-updated', {
        detail: { theme: newTheme }
      }));
    }
  };

  const updateThemeColors = (colors: Record<string, string>, mode: 'light' | 'dark') => {
    if (!theme) return;
    
    // Only apply colors to DOM immediately, don't update theme state to avoid loops
    // The theme state will be updated when saving
    if ((mode === 'light' && !isDarkMode) || (mode === 'dark' && isDarkMode)) {
      const root = document.documentElement;
      Object.entries(colors).forEach(([colorName, colorValue]) => {
        if (colorValue) {
          root.style.setProperty(`--${colorName}`, colorValue);
        }
      });
    }
  };

  // Initial theme data is handled by tRPC queries above

  // Apply theme tokens and manage dark class
  useEffect(() => {
    const styleId = 'dynamic-theme-vars';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const cssVariables = Object.entries(tokens)
      .map(([key, value]) => {
        // Don't double-wrap values that are already formatted
        let formattedValue = value;
        if (!value.includes('oklch') && !value.includes('hsl') && !value.includes('rgb') && !value.startsWith('#')) {
          // Only wrap raw numeric values
          formattedValue = `oklch(${value})`;
        }
        return `  --${key}: ${formattedValue};`;
      })
      .join('\n');

    styleElement.textContent = `
      :root {
        ${cssVariables}
      }
      
      .theme-transition * {
        transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
      }
    `;

    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [tokens]);

  // Manage dark class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const contextValue: ThemeContextValue = {
    theme,
    loading,
    error,
    tokens,
    themeMode,
    isDarkMode,
    setThemeMode,
    toggleThemeMode,
    updateTheme,
    applyThemeRule,
    applyTheme,
    refreshTheme,
    setCurrentTheme,
    updateThemeColors,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useCompanyTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useCompanyTheme must be used within DynamicThemeProvider');
  }
  return context;
};