# THEME-SYSTEM-002: Dynamic Theme Provider Implementation

## 📋 **Resumen**
Crear el proveedor de temas dinámico que conecte la API de temas con los componentes React, permitiendo cambios de tema en tiempo real.

## 🎯 **Objetivos**
- [ ] Implementar `DynamicThemeProvider` component
- [ ] Crear sistema de fetch y cache de temas
- [ ] Integrar con API de temas existente
- [ ] Manejar estados de loading, error y fallbacks

## 🔧 **Implementación Detallada**

### **1. Core Provider Component**

```typescript
// /packages/web/src/components/providers/DynamicThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeRule } from '@alkitu/shared/types/theme';

interface ThemeContextValue {
  theme: Theme | null;
  loading: boolean;
  error: string | null;
  tokens: Record<string, string>;
  updateTheme: (themeData: Partial<Theme>) => Promise<void>;
  applyThemeRule: (rule: ThemeRule) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface DynamicThemeProviderProps {
  companyId?: string;
  themeId?: string;
  fallbackTheme?: 'light' | 'dark';
  children: React.ReactNode;
}

export const DynamicThemeProvider: React.FC<DynamicThemeProviderProps> = ({
  companyId,
  themeId,
  fallbackTheme = 'light',
  children,
}) => {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Record<string, string>>({});

  // Fetch theme from API
  const fetchTheme = async (companyId?: string, themeId?: string) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (themeId) {
        response = await fetch(`/api/themes/${themeId}`);
      } else if (companyId) {
        response = await fetch(`/api/themes/company/${companyId}/active`);
      } else {
        response = await fetch(`/api/themes/default`);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch theme: ${response.statusText}`);
      }

      const themeData = await response.json();
      setTheme(themeData);
      
      // Generate tokens from theme data
      const generatedTokens = generateTokensFromTheme(themeData);
      setTokens(generatedTokens);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Apply fallback theme
      applyFallbackTheme(fallbackTheme);
    } finally {
      setLoading(false);
    }
  };

  // Generate CSS tokens from theme data
  const generateTokensFromTheme = (themeData: Theme): Record<string, string> => {
    const tokens: Record<string, string> = {};

    if (themeData.lightModeConfig) {
      Object.entries(themeData.lightModeConfig).forEach(([key, value]) => {
        tokens[key] = value;
      });
    }

    // Add computed tokens
    tokens['primary-foreground'] = computeContrastColor(tokens['primary']);
    tokens['secondary-foreground'] = computeContrastColor(tokens['secondary']);

    return tokens;
  };

  // Apply fallback theme when API fails
  const applyFallbackTheme = (fallback: 'light' | 'dark') => {
    const fallbackTokens = {
      primary: fallback === 'light' ? '#F2AB27' : '#F2C288',
      secondary: fallback === 'light' ? '#F2921D' : '#F2E0AD',
      background: fallback === 'light' ? '#FFFFFF' : '#0A0A0A',
      foreground: fallback === 'light' ? '#4A4A4A' : '#F1F1F1',
      // ... more fallback tokens
    };
    setTokens(fallbackTokens);
  };

  // Update theme (for real-time editing)
  const updateTheme = async (themeData: Partial<Theme>) => {
    if (!theme) return;

    const updatedTheme = { ...theme, ...themeData };
    setTheme(updatedTheme);

    const updatedTokens = generateTokensFromTheme(updatedTheme);
    setTokens(updatedTokens);

    // Optionally persist to API
    if (theme.id) {
      await fetch(`/api/themes/${theme.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeData),
      });
    }
  };

  // Apply theme rule override
  const applyThemeRule = (rule: ThemeRule) => {
    // Apply CSS rule with proper specificity
    const styleId = `theme-rule-${rule.id}`;
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = generateCSSFromRule(rule);
  };

  // Inject CSS variables into document
  useEffect(() => {
    if (Object.keys(tokens).length === 0) return;

    const styleId = 'dynamic-theme-vars';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const cssVariables = Object.entries(tokens)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join('\n');

    styleElement.textContent = `
      :root {
        ${cssVariables}
      }
      
      .dark {
        /* Dark mode overrides if needed */
      }
    `;

    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [tokens]);

  // Fetch theme on mount or when props change
  useEffect(() => {
    fetchTheme(companyId, themeId);
  }, [companyId, themeId]);

  const contextValue: ThemeContextValue = {
    theme,
    loading,
    error,
    tokens,
    updateTheme,
    applyThemeRule,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for consuming theme
export const useCompanyTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useCompanyTheme must be used within DynamicThemeProvider');
  }
  return context;
};
```

### **2. Utility Functions**

```typescript
// /packages/web/src/utils/theme-utils.ts

export const computeContrastColor = (color: string): string => {
  // Convert to RGB and compute contrast
  const rgb = hexToRgb(color);
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export const generateCSSFromRule = (rule: ThemeRule): string => {
  const selector = rule.selector || ':root';
  const properties = Object.entries(rule.properties || {})
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `
    ${selector} {
      ${properties}
    }
  `;
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};
```

### **3. Integration with Main Providers**

```typescript
// /packages/web/src/components/providers/Providers.tsx
import { DynamicThemeProvider } from './DynamicThemeProvider';

export const Providers = ({ children, companyId }: ProvidersProps) => {
  return (
    <QueryClient client={queryClient}>
      <DynamicThemeProvider companyId={companyId}>
        <ThemeContextProvider>
          {children}
        </ThemeContextProvider>
      </DynamicThemeProvider>
    </QueryClient>
  );
};
```

### **4. Error Boundaries and Loading States**

```typescript
// /packages/web/src/components/providers/ThemeErrorBoundary.tsx
export const ThemeErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { error, loading } = useCompanyTheme();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary">
        </div>
        <span className="ml-2">Loading theme...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load theme</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
```

## 🧪 **Testing Strategy**

### **Unit Tests**
```typescript
// /packages/web/src/components/providers/__tests__/DynamicThemeProvider.test.tsx
describe('DynamicThemeProvider', () => {
  test('fetches theme on mount', async () => {
    // Mock API response
    // Render provider
    // Assert theme is fetched and applied
  });

  test('handles API errors gracefully', async () => {
    // Mock API error
    // Render provider
    // Assert fallback theme is applied
  });

  test('updates theme dynamically', async () => {
    // Render provider with initial theme
    // Update theme
    // Assert CSS variables are updated
  });
});
```

### **Integration Tests**
```typescript
describe('Theme Integration', () => {
  test('components receive theme tokens', () => {
    // Render component tree with provider
    // Assert components use correct theme colors
  });
});
```

## 📊 **Performance Considerations**

### **Caching Strategy**
- Cache themes in localStorage for offline support
- Implement theme version checking for cache invalidation
- Use React.memo for theme-dependent components

### **Lazy Loading**
- Load theme rules on-demand
- Implement code splitting for large theme configurations
- Use Suspense boundaries for theme loading states

## 🔗 **Dependencies**

### **API Endpoints Required**
- `GET /api/themes/company/:companyId/active`
- `GET /api/themes/:id`
- `PUT /api/themes/:id`
- `GET /api/themes/default`

### **TypeScript Types**
```typescript
// Extend shared types
interface Theme {
  id: string;
  companyId: string;
  name: string;
  lightModeConfig: Record<string, string>;
  darkModeConfig: Record<string, string>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## ✅ **Criterios de Aceptación**

- [ ] Provider fetches themes from API correctamente
- [ ] CSS variables se inyectan dinámicamente
- [ ] Manejo de errores y estados de loading
- [ ] Cache y performance optimizados
- [ ] Tests unitarios e integración completos
- [ ] TypeScript types correctos
- [ ] Compatible con SSR/SSG

---

**Estimación**: 5-7 días
**Prioridad**: Alta
**Dependencias**: THEME-SYSTEM-001