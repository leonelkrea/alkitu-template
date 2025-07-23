# THEME-SYSTEM-004: Component Library Migration

## 📋 **Resumen**
Migrar la biblioteca de componentes atomicos de clases CSS hardcodeadas a un sistema dinámico basado en CSS variables, manteniendo compatibilidad hacia atrás.

## 🎯 **Objetivos**
- [ ] Migrar Button, Avatar, Icon, Badge, Input a sistema dinámico
- [ ] Crear utilities para theme consumption en componentes
- [ ] Mantener backward compatibility durante la transición
- [ ] Actualizar Storybook stories para mostrar temas dinámicos

## 🔧 **Implementación Detallada**

### **1. Theme-Aware Component Architecture**

```typescript
// /packages/web/src/components/atoms/Button.tsx - MIGRADO
import React from 'react';
import { cn } from '../../utils/cn';
import { useThemeVariables } from '../../hooks/useThemeVariables';
import Icon, { IconProps } from './Icon';
import Spinner from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: IconProps['name'];
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
  // New theme props
  themeOverride?: Record<string, string>;
  useSystemColors?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  onClick,
  themeOverride,
  useSystemColors = true,
  ...props
}, ref) => {
  // Get theme variables
  const themeVars = useThemeVariables();

  // NUEVO: Clases dinámicas basadas en CSS variables
  const variantClasses = {
    'primary': [
      'bg-primary text-primary-foreground',
      'border-primary',
      'hover:bg-primary/90',
      'focus:ring-primary/20',
      'disabled:bg-primary/50'
    ].join(' '),
    
    'secondary': [
      'bg-secondary text-secondary-foreground',
      'border-secondary',
      'hover:bg-secondary/90',
      'focus:ring-secondary/20'
    ].join(' '),
    
    'outline': [
      'bg-transparent text-foreground',
      'border-border',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:ring-ring/20'
    ].join(' '),
    
    'ghost': [
      'bg-transparent text-foreground border-transparent',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:ring-ring/20'
    ].join(' '),
    
    'destructive': [
      'bg-destructive text-destructive-foreground',
      'border-destructive',
      'hover:bg-destructive/90',
      'focus:ring-destructive/20'
    ].join(' ')
  }[variant];

  const sizeClasses = {
    'sm': 'h-8 px-3 text-xs rounded-sm',
    'md': 'h-10 px-4 text-sm rounded-md',
    'lg': 'h-12 px-6 text-base rounded-lg'
  }[size];

  const iconSize = {
    'sm': 'sm' as const,
    'md': 'sm' as const,
    'lg': 'md' as const
  }[size];

  const isDisabled = disabled || loading;

  const classes = cn([
    // Base classes
    'inline-flex items-center justify-center',
    'border font-medium transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
    
    // Dynamic theme classes
    variantClasses,
    sizeClasses,
    
    // Conditional classes
    fullWidth && 'w-full',
    
    // User-provided classes
    className
  ]);

  // Apply theme overrides if provided
  const inlineStyles = React.useMemo(() => {
    if (!themeOverride) return undefined;
    
    const styles: React.CSSProperties = {};
    Object.entries(themeOverride).forEach(([property, value]) => {
      // Convert CSS custom property names
      const cssProp = property.startsWith('--') ? property : `--${property}`;
      styles[cssProp as any] = value;
    });
    
    return styles;
  }, [themeOverride]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Spinner size="sm" className="mr-2 -ml-1" />
          {children}
        </>
      );
    }

    if (icon) {
      const iconElement = <Icon name={icon} size={iconSize} className="shrink-0" />;
      
      return iconPosition === 'left' ? (
        <>
          <span className="mr-2 -ml-1">{iconElement}</span>
          {children}
        </>
      ) : (
        <>
          {children}
          <span className="ml-2 -mr-1">{iconElement}</span>
        </>
      );
    }

    return children;
  };

  return (
    <button
      ref={ref}
      className={classes}
      disabled={isDisabled}
      onClick={handleClick}
      style={inlineStyles}
      {...props}
    >
      {renderContent()}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
```

### **2. Theme Variables Hook**

```typescript
// /packages/web/src/hooks/useThemeVariables.ts
import { useCompanyTheme } from '../components/providers/DynamicThemeProvider';

export interface ThemeVariables {
  // Semantic colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  
  // Computed values
  radius: string;
  fontSans: string;
  fontMono: string;
}

export const useThemeVariables = (): ThemeVariables => {
  const { tokens } = useCompanyTheme();

  return React.useMemo(() => ({
    primary: tokens['primary'] || 'hsl(210 100% 50%)',
    primaryForeground: tokens['primary-foreground'] || 'hsl(0 0% 100%)',
    secondary: tokens['secondary'] || 'hsl(210 40% 96%)',
    secondaryForeground: tokens['secondary-foreground'] || 'hsl(215.4 16.3% 56.9%)',
    background: tokens['background'] || 'hsl(0 0% 100%)',
    foreground: tokens['foreground'] || 'hsl(224 71.4% 4.1%)',
    muted: tokens['muted'] || 'hsl(210 40% 96%)',
    mutedForeground: tokens['muted-foreground'] || 'hsl(215.4 16.3% 56.9%)',
    accent: tokens['accent'] || 'hsl(210 40% 96%)',
    accentForeground: tokens['accent-foreground'] || 'hsl(224 71.4% 4.1%)',
    destructive: tokens['destructive'] || 'hsl(0 84.2% 60.2%)',
    destructiveForeground: tokens['destructive-foreground'] || 'hsl(0 0% 100%)',
    border: tokens['border'] || 'hsl(214.3 31.8% 91.4%)',
    input: tokens['input'] || 'hsl(214.3 31.8% 91.4%)',
    ring: tokens['ring'] || 'hsl(210 100% 50%)',
    radius: tokens['radius'] || '0.5rem',
    fontSans: tokens['font-sans'] || 'Inter, system-ui, sans-serif',
    fontMono: tokens['font-mono'] || 'ui-monospace, SFMono-Regular, monospace',
  }), [tokens]);
};

// Hook for specific theme properties
export const useThemeProperty = (property: keyof ThemeVariables): string => {
  const themeVars = useThemeVariables();
  return themeVars[property];
};

// Hook for CSS custom property access
export const useCSSVariable = (variable: string): string => {
  const { tokens } = useCompanyTheme();
  return tokens[variable] || `var(--${variable})`;
};
```

### **3. Component Utilities**

```typescript
// /packages/web/src/utils/theme-component-utils.ts

export interface ComponentThemeProps {
  themeOverride?: Record<string, string>;
  variant?: string;
}

export const applyThemeOverride = (
  baseClasses: string,
  themeOverride?: Record<string, string>,
  componentName?: string
): { className: string; style?: React.CSSProperties } => {
  if (!themeOverride) {
    return { className: baseClasses };
  }

  // Generate scoped CSS variables for this component instance
  const scopedVars: React.CSSProperties = {};
  const scopePrefix = componentName ? `${componentName}-` : '';
  
  Object.entries(themeOverride).forEach(([key, value]) => {
    const cssVar = key.startsWith('--') ? key : `--${scopePrefix}${key}`;
    scopedVars[cssVar as any] = value;
  });

  return {
    className: baseClasses,
    style: scopedVars
  };
};

// Utility for conditional theme classes
export const themeVariant = (
  variants: Record<string, string>,
  activeVariant: string,
  fallback: string = ''
): string => {
  return variants[activeVariant] || fallback;
};

// Generate dynamic class names with theme support
export const themeAwareClass = (
  baseClass: string,
  themeModifier?: string
): string => {
  if (!themeModifier) return baseClass;
  return `${baseClass} ${baseClass}--${themeModifier}`;
};
```

### **4. Updated Tailwind Configuration**

```typescript
// /packages/web/tailwind.config.ts - ACTUALIZADO
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // CSS variable-based color system
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      animation: {
        "theme-transition": "theme-transition 200ms ease-in-out",
      },
      keyframes: {
        "theme-transition": {
          "0%": { opacity: "0.8" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [
    // Custom plugin for theme-aware utilities
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.theme-transition': {
          transition: 'background-color 200ms, color 200ms, border-color 200ms',
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;

export default config;
```

### **5. Component Migration Checklist**

```typescript
// Migration checklist for each component
interface ComponentMigrationChecklist {
  // Before migration
  hasStaticClasses: boolean;
  usesHardcodedColors: boolean;
  hasVariantSupport: boolean;
  
  // After migration
  usesCSSVariables: boolean;
  hasThemeOverrideSupport: boolean;
  hasThemeAwareStories: boolean;
  maintainsBackwardCompatibility: boolean;
  hasProperTypeScript: boolean;
  hasTests: boolean;
}

// Components to migrate
const COMPONENT_MIGRATION_LIST = [
  'Button',     // Priority 1 - Most used
  'Input',      // Priority 1 - Form critical
  'Badge',      // Priority 2 - Visual feedback
  'Avatar',     // Priority 2 - User representation  
  'Icon',       // Priority 3 - System-wide
  'Spinner',    // Priority 3 - Loading states
  'Card',       // Priority 2 - Layout
  'Tooltip',    // Priority 3 - Information
  'Checkbox',   // Priority 2 - Forms
  'RadioGroup', // Priority 2 - Forms
] as const;
```

### **6. Storybook Stories Updates**

```typescript
// /packages/web/src/components/atoms/Button.stories.tsx - ACTUALIZADO
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import { DynamicThemeProvider } from '../../components/providers/DynamicThemeProvider';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story, context) => {
      const themeId = context.globals.companyTheme;
      return (
        <DynamicThemeProvider themeId={themeId}>
          <Story />
        </DynamicThemeProvider>
      );
    },
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    themeOverride: {
      control: 'object',
      description: 'Override theme properties for this component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Existing stories...
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

// NEW: Theme override examples
export const WithThemeOverride: Story = {
  args: {
    variant: 'primary',
    children: 'Custom Theme Button',
    themeOverride: {
      primary: 'oklch(0.7 0.15 180)', // Custom blue
      'primary-foreground': 'oklch(1 0 0)', // White text
      radius: '1rem', // More rounded
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates runtime theme overrides for specific component instances.',
      },
    },
  },
};

// NEW: Theme comparison
export const ThemeComparison: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Default Theme</Button>
      <Button
        variant="primary"
        themeOverride={{
          primary: 'oklch(0.6 0.2 0)', // Red theme
          'primary-foreground': 'oklch(1 0 0)',
        }}
      >
        Red Theme
      </Button>
      <Button
        variant="primary"
        themeOverride={{
          primary: 'oklch(0.5 0.2 120)', // Green theme
          'primary-foreground': 'oklch(1 0 0)',
        }}
      >
        Green Theme
      </Button>
    </div>
  ),
};
```

### **7. Testing Strategy**

```typescript
// /packages/web/src/components/atoms/__tests__/Button.test.tsx - ACTUALIZADO
import { render, screen } from '@testing-library/react';
import Button from '../Button';
import { DynamicThemeProvider } from '../../providers/DynamicThemeProvider';

// Theme test wrapper
const ThemeWrapper = ({ children, themeOverride = {} }) => (
  <DynamicThemeProvider>
    <div style={themeOverride}>
      {children}
    </div>
  </DynamicThemeProvider>
);

describe('Button Component', () => {
  // Existing tests...

  describe('Theme Integration', () => {
    test('applies theme override correctly', () => {
      render(
        <ThemeWrapper>
          <Button
            themeOverride={{ primary: 'red', 'primary-foreground': 'white' }}
          >
            Test Button
          </Button>
        </ThemeWrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveStyle('--primary: red');
      expect(button).toHaveStyle('--primary-foreground: white');
    });

    test('uses CSS variables for colors', () => {
      render(
        <ThemeWrapper>
          <Button variant="primary">Test Button</Button>
        </ThemeWrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    test('maintains backward compatibility', () => {
      render(
        <ThemeWrapper>
          <Button className="custom-class">Test Button</Button>
        </ThemeWrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });
});
```

## 📊 **Migration Timeline**

### **Week 1: Core Infrastructure**
- [ ] Button component migration
- [ ] Theme utilities implementation
- [ ] Updated Tailwind config

### **Week 2: Form Components**
- [ ] Input component migration
- [ ] Checkbox component migration
- [ ] RadioGroup component migration

### **Week 3: Visual Components**
- [ ] Badge component migration
- [ ] Avatar component migration  
- [ ] Icon component migration

### **Week 4: Complex Components**
- [ ] Card component migration
- [ ] Tooltip component migration
- [ ] Spinner component migration

### **Week 5: Testing & Polish**
- [ ] Comprehensive testing
- [ ] Storybook story updates
- [ ] Documentation updates
- [ ] Performance optimization

## ✅ **Criterios de Aceptación**

- [ ] Todos los componentes atoms migrados a CSS variables
- [ ] Theme override functionality working
- [ ] Storybook stories updated con theme switching
- [ ] Tests unitarios actualizados
- [ ] Backward compatibility mantenida
- [ ] Performance sin degradación
- [ ] TypeScript types correctos
- [ ] Documentación actualizada

---

**Estimación**: 3-4 semanas
**Prioridad**: Alta  
**Dependencias**: THEME-SYSTEM-002 (Dynamic Theme Provider)