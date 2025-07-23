# THEME-SYSTEM-005: Storybook Theme Integration

## 📋 **Resumen**
Integrar el sistema de temas dinámico con Storybook para permitir visualización y testing de componentes con diferentes temas de empresa en tiempo real.

## 🎯 **Objetivos**
- [ ] Theme switcher en Storybook toolbar
- [ ] Previews en tiempo real con temas de empresa
- [ ] Integration con company theme selector
- [ ] Live theme editing y preview
- [ ] Theme debugging tools

## 🔧 **Implementación Detallada**

### **1. Enhanced Storybook Configuration**

```typescript
// .storybook/main.ts - ACTUALIZADO
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-backgrounds',
    '@storybook/addon-viewport',
    // NEW: Theme addon
    {
      name: '@storybook/addon-toolbars',
      options: {
        title: 'Theme Selector',
      },
    },
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  features: {
    buildStoriesJson: true, // Enable for theme API integration
  },
  staticDirs: ['../public'],
  async webpackFinal(config) {
    // Add theme resolution
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@/components': path.resolve(__dirname, '../src/components'),
        '@/hooks': path.resolve(__dirname, '../src/hooks'),
        '@/utils': path.resolve(__dirname, '../src/utils'),
      },
    };
    return config;
  },
};

export default config;
```

### **2. Enhanced Preview with Theme Support**

```typescript
// .storybook/preview.tsx - ENHANCED
import type { Preview } from '@storybook/react';
import React from 'react';
import { DynamicThemeProvider } from '../src/components/providers/DynamicThemeProvider';
import { ThemeDebuggingWrapper } from './theme-debugging-wrapper';
import '../src/app/[lang]/globals.css';
import '../src/styles/storybook-globals.css';

// Mock company themes for Storybook
const MOCK_COMPANY_THEMES = {
  'default': {
    id: 'default',
    name: 'Default Theme',
    companyId: 'default',
    lightModeConfig: {
      primary: 'oklch(0.5634 0.1517 146.7438)', // Emerald
      secondary: 'oklch(0.9683 0.0069 247.8956)', // Neutral
      background: 'oklch(1 0 0)', // White
      foreground: 'oklch(0.1363 0.0364 259.2010)', // Dark blue
      border: 'oklch(0.9288 0.0126 255.5078)', // Light gray
      ring: 'oklch(0.5634 0.1517 146.7438)', // Emerald
      radius: '0.5rem',
    },
  },
  'tech-startup': {
    id: 'tech-startup',
    name: 'Tech Startup',
    companyId: 'tech-startup',
    lightModeConfig: {
      primary: 'oklch(0.6017 0.1847 26.9286)', // Orange
      secondary: 'oklch(0.9683 0.0069 247.8956)',
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.1363 0.0364 259.2010)',
      border: 'oklch(0.9288 0.0126 255.5078)',
      ring: 'oklch(0.6017 0.1847 26.9286)',
      radius: '0.75rem',
    },
  },
  'financial-corp': {
    id: 'financial-corp',
    name: 'Financial Corp',
    companyId: 'financial-corp',
    lightModeConfig: {
      primary: 'oklch(0.4726 0.1517 258.3386)', // Blue
      secondary: 'oklch(0.9683 0.0069 247.8956)',
      background: 'oklch(0.99 0.005 247.8956)', // Slightly tinted
      foreground: 'oklch(0.1363 0.0364 259.2010)',
      border: 'oklch(0.9288 0.0126 255.5078)',
      ring: 'oklch(0.4726 0.1517 258.3386)',
      radius: '0.25rem', // More conservative
    },
  },
  'creative-agency': {
    id: 'creative-agency',
    name: 'Creative Agency',
    companyId: 'creative-agency',
    lightModeConfig: {
      primary: 'oklch(0.7049 0.1867 47.6044)', // Pink
      secondary: 'oklch(0.7681 0.2044 130.8498)', // Yellow-green
      background: 'oklch(0.995 0.01 47.6044)', // Warm white
      foreground: 'oklch(0.1363 0.0364 259.2010)',
      border: 'oklch(0.9288 0.0126 255.5078)',
      ring: 'oklch(0.7049 0.1867 47.6044)',
      radius: '1rem', // More playful
    },
  },
  'healthcare': {
    id: 'healthcare',
    name: 'Healthcare',
    companyId: 'healthcare',
    lightModeConfig: {
      primary: 'oklch(0.5634 0.1517 146.7438)', // Medical green
      secondary: 'oklch(0.6735 0.1851 146.7724)', // Lighter green
      background: 'oklch(0.99 0.003 180)', // Cool white
      foreground: 'oklch(0.2 0.02 180)', // Cool dark
      border: 'oklch(0.92 0.02 180)',
      ring: 'oklch(0.5634 0.1517 146.7438)',
      radius: '0.375rem',
    },
  },
};

// Enhanced theme decorator with debugging
const withDynamicTheme = (StoryFn: any, context: any) => {
  const selectedTheme = context.globals.companyTheme || 'default';
  const showThemeDebugger = context.globals.showThemeDebugger;
  const themeOverride = context.globals.themeOverride;

  // Get theme configuration
  const themeConfig = MOCK_COMPANY_THEMES[selectedTheme] || MOCK_COMPANY_THEMES.default;

  // Apply global theme overrides if provided
  const finalThemeConfig = themeOverride ? {
    ...themeConfig,
    lightModeConfig: {
      ...themeConfig.lightModeConfig,
      ...themeOverride,
    },
  } : themeConfig;

  return (
    <DynamicThemeProvider themeData={finalThemeConfig}>
      {showThemeDebugger ? (
        <ThemeDebuggingWrapper>
          <StoryFn />
        </ThemeDebuggingWrapper>
      ) : (
        <StoryFn />
      )}
    </DynamicThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withDynamicTheme],
  
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // Disable default backgrounds, use theme system
    },
    layout: 'centered',
    docs: {
      toc: true,
      source: {
        state: 'open',
      },
    },
  },

  // Enhanced global types for theme controls
  globalTypes: {
    companyTheme: {
      description: 'Company Theme Selector',
      defaultValue: 'default',
      toolbar: {
        title: 'Company Theme',
        icon: 'paintbrush',
        items: [
          { 
            value: 'default', 
            title: 'Default',
            left: '🎨',
          },
          { 
            value: 'tech-startup', 
            title: 'Tech Startup',
            left: '🚀',
          },
          { 
            value: 'financial-corp', 
            title: 'Financial Corp',
            left: '🏦',
          },
          { 
            value: 'creative-agency', 
            title: 'Creative Agency',
            left: '🎭',
          },
          { 
            value: 'healthcare', 
            title: 'Healthcare',
            left: '🏥',
          },
        ],
        dynamicTitle: true,
      },
    },
    
    showThemeDebugger: {
      description: 'Show Theme Debugger',
      defaultValue: false,
      toolbar: {
        title: 'Theme Debug',
        icon: 'cog',
        items: [
          { value: false, title: 'Hide Debugger' },
          { value: true, title: 'Show Debugger' },
        ],
      },
    },

    themeMode: {
      description: 'Theme Mode',
      defaultValue: 'light',
      toolbar: {
        title: 'Mode',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', left: '☀️' },
          { value: 'dark', title: 'Dark', left: '🌙' },
          { value: 'system', title: 'System', left: '💻' },
        ],
      },
    },
  },
};

export default preview;
```

### **3. Theme Debugging Wrapper**

```typescript
// .storybook/theme-debugging-wrapper.tsx
import React, { useState } from 'react';
import { useCompanyTheme } from '../src/components/providers/DynamicThemeProvider';

interface ThemeDebuggingWrapperProps {
  children: React.ReactNode;
}

export const ThemeDebuggingWrapper: React.FC<ThemeDebuggingWrapperProps> = ({
  children,
}) => {
  const { theme, tokens, updateTheme } = useCompanyTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleTokenEdit = (tokenName: string, newValue: string) => {
    updateTheme({
      lightModeConfig: {
        ...theme?.lightModeConfig,
        [tokenName]: newValue,
      },
    });
    setEditingToken(null);
  };

  const copyThemeToClipboard = () => {
    const themeJSON = JSON.stringify(theme, null, 2);
    navigator.clipboard.writeText(themeJSON);
  };

  return (
    <div className="relative">
      {/* Main content */}
      <div className="theme-debug-content">
        {children}
      </div>

      {/* Debug panel toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 px-3 py-2 bg-gray-900 text-white text-xs rounded-md hover:bg-gray-800 transition-colors"
        style={{ fontSize: '11px' }}
      >
        {isOpen ? 'Close' : 'Debug'} Theme
      </button>

      {/* Debug panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-auto">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm">Theme Debugger</h3>
              <button
                onClick={copyThemeToClipboard}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Copy JSON
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Current: {theme?.name || 'Unknown'}
            </p>
          </div>

          <div className="p-4">
            <h4 className="font-medium text-xs text-gray-700 mb-2">CSS Variables</h4>
            <div className="space-y-2">
              {Object.entries(tokens).map(([tokenName, tokenValue]) => (
                <div key={tokenName} className="flex items-center gap-2">
                  <div className="text-xs font-mono text-gray-600 min-w-0 flex-1">
                    --{tokenName}
                  </div>
                  
                  {editingToken === tokenName ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded"
                        autoFocus
                      />
                      <button
                        onClick={() => handleTokenEdit(tokenName, tempValue)}
                        className="px-1 py-0.5 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingToken(null)}
                        className="px-1 py-0.5 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      {/* Color preview for color tokens */}
                      {tokenValue.includes('oklch') || tokenValue.includes('#') ? (
                        <div
                          className="w-4 h-4 rounded border border-gray-300 shrink-0"
                          style={{ backgroundColor: tokenValue }}
                        />
                      ) : null}
                      
                      <div className="text-xs font-mono text-gray-800 min-w-0 truncate">
                        {tokenValue}
                      </div>
                      
                      <button
                        onClick={() => {
                          setEditingToken(tokenName);
                          setTempValue(tokenValue);
                        }}
                        className="px-1 py-0.5 text-xs text-blue-600 hover:bg-blue-50 rounded"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick theme presets */}
          <div className="p-4 border-t border-gray-100">
            <h4 className="font-medium text-xs text-gray-700 mb-2">Quick Presets</h4>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => updateTheme({
                  lightModeConfig: {
                    ...theme?.lightModeConfig,
                    primary: 'oklch(0.6017 0.1847 26.9286)', // Orange
                  },
                })}
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: 'oklch(0.6017 0.1847 26.9286)' }}
                title="Orange Theme"
              />
              <button
                onClick={() => updateTheme({
                  lightModeConfig: {
                    ...theme?.lightModeConfig,
                    primary: 'oklch(0.4726 0.1517 258.3386)', // Blue
                  },
                })}
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: 'oklch(0.4726 0.1517 258.3386)' }}
                title="Blue Theme"
              />
              <button
                onClick={() => updateTheme({
                  lightModeConfig: {
                    ...theme?.lightModeConfig,
                    primary: 'oklch(0.5634 0.1517 146.7438)', // Green
                  },
                })}
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: 'oklch(0.5634 0.1517 146.7438)' }}
                title="Green Theme"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### **4. Enhanced Component Stories**

```typescript
// Example: Enhanced Button stories with theme testing
// /packages/web/src/components/atoms/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A versatile button component that automatically adapts to company themes.
The button respects CSS variables from the active theme and can be overridden per instance.

**Theme Properties Used:**
- \`--primary\` - Primary button background
- \`--primary-foreground\` - Primary button text color  
- \`--secondary\` - Secondary button background
- \`--border\` - Border color for outline variant
- \`--ring\` - Focus ring color
- \`--radius\` - Border radius

Try switching between company themes using the toolbar to see the button adapt automatically.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      description: 'Visual variant of the button',
    },
    themeOverride: {
      control: 'object',
      description: 'Override theme properties for this specific button instance',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Theme showcase stories
export const ThemeShowcase: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">
          Theme-Aware Buttons
        </h3>
        <div className="flex gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">
          Custom Theme Override
        </h3>
        <div className="flex gap-3">
          <Button
            variant="primary"
            themeOverride={{
              primary: 'oklch(0.7 0.15 300)', // Purple
              'primary-foreground': 'oklch(1 0 0)', // White
            }}
          >
            Purple Override
          </Button>
          <Button
            variant="primary"
            themeOverride={{
              primary: 'oklch(0.6 0.2 60)', // Yellow
              'primary-foreground': 'oklch(0.1 0 0)', // Black
              radius: '1.5rem',
            }}
          >
            Yellow + Rounded
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates how buttons automatically adapt to different company themes.
Use the **Company Theme** selector in the toolbar to see the buttons change appearance.

The second row shows theme overrides at the component level, which take precedence over the global theme.
        `,
      },
    },
  },
};

// Theme testing matrix
export const ThemeTestingMatrix: Story = {
  render: () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;
    
    return (
      <div className="space-y-4">
        {variants.map((variant) => (
          <div key={variant} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground capitalize">
              {variant}
            </h4>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {size.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete testing matrix showing all variants and sizes across different themes.',
      },
    },
  },
};

// Interactive theme playground
export const ThemePlayground: Story = {
  args: {
    variant: 'primary',
    children: 'Playground Button',
  },
  parameters: {
    docs: {
      description: {
        story: `
Interactive playground for testing theme properties. 

**Instructions:**
1. Select a company theme from the toolbar
2. Enable the Theme Debugger to see and edit CSS variables
3. Use the themeOverride control below to test custom properties
4. Try different combinations and see live updates
        `,
      },
    },
  },
};
```

### **5. Theme Documentation Generator**

```typescript
// .storybook/theme-docs-generator.ts
export interface ThemeDocumentation {
  name: string;
  description: string;
  tokens: Record<string, {
    value: string;
    description: string;
    usage: string[];
  }>;
  components: string[];
}

export const generateThemeDocs = (theme: any): ThemeDocumentation => {
  return {
    name: theme.name,
    description: `Company theme for ${theme.companyId}`,
    tokens: Object.entries(theme.lightModeConfig || {}).reduce((acc, [key, value]) => {
      acc[key] = {
        value: value as string,
        description: getTokenDescription(key),
        usage: getTokenUsage(key),
      };
      return acc;
    }, {} as any),
    components: getAffectedComponents(theme),
  };
};

const getTokenDescription = (tokenName: string): string => {
  const descriptions = {
    primary: 'Primary brand color for buttons, links, and key actions',
    secondary: 'Secondary color for less prominent elements',
    background: 'Main background color for pages and containers',
    foreground: 'Primary text color',
    border: 'Default border color for inputs, cards, and separators',
    ring: 'Focus ring color for interactive elements',
    radius: 'Default border radius for components',
    // Add more descriptions...
  };
  return descriptions[tokenName] || `CSS custom property for ${tokenName}`;
};

const getTokenUsage = (tokenName: string): string[] => {
  const usage = {
    primary: ['Button primary variant', 'Link colors', 'Active states'],
    secondary: ['Button secondary variant', 'Subtle backgrounds'],
    background: ['Page background', 'Card backgrounds', 'Modal backgrounds'],
    foreground: ['Body text', 'Headings', 'Icons'],
    border: ['Input borders', 'Card borders', 'Dividers'],
    ring: ['Focus indicators', 'Selection states'],
    radius: ['Button corners', 'Card corners', 'Input corners'],
  };
  return usage[tokenName] || [`Used in ${tokenName}-related styling`];
};

const getAffectedComponents = (theme: any): string[] => {
  // Return list of components that use this theme
  return ['Button', 'Input', 'Card', 'Badge', 'Avatar', 'Icon'];
};
```

### **6. Real-Time Theme API Integration**

```typescript
// .storybook/theme-api-integration.ts
interface ThemeAPIConfig {
  endpoint: string;
  apiKey?: string;
}

export class StorybookThemeAPI {
  private config: ThemeAPIConfig;

  constructor(config: ThemeAPIConfig) {
    this.config = config;
  }

  async fetchCompanyThemes(): Promise<any[]> {
    try {
      const response = await fetch(`${this.config.endpoint}/api/themes/companies`, {
        headers: this.getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch company themes, using mock data:', error);
      return Object.values(MOCK_COMPANY_THEMES);
    }
  }

  async fetchTheme(themeId: string): Promise<any> {
    try {
      const response = await fetch(`${this.config.endpoint}/api/themes/${themeId}`, {
        headers: this.getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.warn(`Failed to fetch theme ${themeId}, using mock data:`, error);
      return MOCK_COMPANY_THEMES[themeId] || MOCK_COMPANY_THEMES.default;
    }
  }

  async updateTheme(themeId: string, updates: any): Promise<any> {
    try {
      const response = await fetch(`${this.config.endpoint}/api/themes/${themeId}`, {
        method: 'PUT',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      return await response.json();
    } catch (error) {
      console.warn('Failed to update theme:', error);
      throw error;
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
    return headers;
  }
}

// Initialize API integration
export const themeAPI = new StorybookThemeAPI({
  endpoint: process.env.STORYBOOK_API_URL || 'http://localhost:3001',
  apiKey: process.env.STORYBOOK_API_KEY,
});
```

## 📊 **Performance Considerations**

### **Theme Caching Strategy**
- Cache theme data in localStorage
- Implement theme version checking
- Use React.memo for theme-dependent components
- Lazy load theme configurations

### **Bundle Optimization**
- Tree-shake unused theme utilities
- Code split theme debugging tools
- Compress theme JSON data
- Use CSS variable fallbacks

## 🧪 **Testing Strategy**

```typescript
// .storybook/__tests__/theme-integration.test.ts
describe('Storybook Theme Integration', () => {
  test('theme switcher updates components correctly', async () => {
    // Test theme switching functionality
  });

  test('theme debugger shows correct token values', () => {
    // Test debugging interface
  });

  test('theme overrides work at component level', () => {
    // Test component-specific theme overrides
  });
});
```

## ✅ **Criterios de Aceptación**

- [ ] Theme switcher funcional en Storybook toolbar
- [ ] Live preview de componentes con diferentes temas
- [ ] Theme debugging tools operativos
- [ ] Component stories actualizados con ejemplos de temas
- [ ] Documentación automática de theme tokens
- [ ] Performance optimizado (< 100ms theme switch)
- [ ] API integration opcional funcional
- [ ] Tests de integración completos

---

**Estimación**: 1-2 semanas
**Prioridad**: Alta
**Dependencias**: THEME-SYSTEM-002, THEME-SYSTEM-004