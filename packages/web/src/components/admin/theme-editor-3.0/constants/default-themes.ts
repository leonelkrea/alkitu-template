// Theme Editor 3.0 - Default Themes with OKLCH colors
import { ThemeData, ColorToken } from '../types/theme.types';

// Helper function to create color tokens
function createColorToken(name: string, value: string, l: number, c: number, h: number, description?: string): ColorToken {
  return {
    name,
    value,
    oklch: { l, c, h },
    description
  };
}

// Light mode colors (from CSS variables provided)
const DEFAULT_LIGHT_COLORS: import('../types/theme.types').ThemeColors = {
  // Base colors
  background: createColorToken('background', 'oklch(1 0 0)', 1, 0, 0),
  foreground: createColorToken('foreground', 'oklch(0.1450 0 0)', 0.1450, 0, 0),
  
  // UI container colors
  card: createColorToken('card', 'oklch(1 0 0)', 1, 0, 0),
  cardForeground: createColorToken('card-foreground', 'oklch(0.1450 0 0)', 0.1450, 0, 0),
  popover: createColorToken('popover', 'oklch(1 0 0)', 1, 0, 0),
  popoverForeground: createColorToken('popover-foreground', 'oklch(0.1450 0 0)', 0.1450, 0, 0),
  
  // Primary colors
  primary: createColorToken('primary', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  primaryForeground: createColorToken('primary-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  
  // Secondary colors
  secondary: createColorToken('secondary', 'oklch(0.9700 0 0)', 0.9700, 0, 0),
  secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  
  // Accent colors
  accent: createColorToken('accent', 'oklch(0.9700 0 0)', 0.9700, 0, 0),
  accentForeground: createColorToken('accent-foreground', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  
  // Muted colors
  muted: createColorToken('muted', 'oklch(0.9700 0 0)', 0.9700, 0, 0),
  mutedForeground: createColorToken('muted-foreground', 'oklch(0.5560 0 0)', 0.5560, 0, 0),
  
  // Destructive colors
  destructive: createColorToken('destructive', 'oklch(0.5770 0.2450 27.3250)', 0.5770, 0.2450, 27.3250),
  destructiveForeground: createColorToken('destructive-foreground', 'oklch(1 0 0)', 1, 0, 0),
  
  // Border & Input colors
  border: createColorToken('border', 'oklch(0.9220 0 0)', 0.9220, 0, 0),
  input: createColorToken('input', 'oklch(0.9220 0 0)', 0.9220, 0, 0),
  ring: createColorToken('ring', 'oklch(0.7080 0 0)', 0.7080, 0, 0),
  
  // Chart colors
  chart1: createColorToken('chart-1', 'oklch(0.8100 0.1000 252)', 0.8100, 0.1000, 252),
  chart2: createColorToken('chart-2', 'oklch(0.6200 0.1900 260)', 0.6200, 0.1900, 260),
  chart3: createColorToken('chart-3', 'oklch(0.5500 0.2200 263)', 0.5500, 0.2200, 263),
  chart4: createColorToken('chart-4', 'oklch(0.4900 0.2200 264)', 0.4900, 0.2200, 264),
  chart5: createColorToken('chart-5', 'oklch(0.4200 0.1800 266)', 0.4200, 0.1800, 266),
  
  // Sidebar colors
  sidebar: createColorToken('sidebar', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.1450 0 0)', 0.1450, 0, 0),
  sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.9700 0 0)', 0.9700, 0, 0),
  sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  sidebarBorder: createColorToken('sidebar-border', 'oklch(0.9220 0 0)', 0.9220, 0, 0),
  sidebarRing: createColorToken('sidebar-ring', 'oklch(0.7080 0 0)', 0.7080, 0, 0)
};

// Dark mode colors (from .dark CSS variables provided)
const DEFAULT_DARK_COLORS: import('../types/theme.types').ThemeColors = {
  // Base colors
  background: createColorToken('background', 'oklch(0.1450 0 0)', 0.1450, 0, 0),
  foreground: createColorToken('foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  
  // UI container colors
  card: createColorToken('card', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  cardForeground: createColorToken('card-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  popover: createColorToken('popover', 'oklch(0.2690 0 0)', 0.2690, 0, 0),
  popoverForeground: createColorToken('popover-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  
  // Primary colors
  primary: createColorToken('primary', 'oklch(0.9220 0 0)', 0.9220, 0, 0),
  primaryForeground: createColorToken('primary-foreground', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  
  // Secondary colors
  secondary: createColorToken('secondary', 'oklch(0.2690 0 0)', 0.2690, 0, 0),
  secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  
  // Accent colors
  accent: createColorToken('accent', 'oklch(0.3710 0 0)', 0.3710, 0, 0),
  accentForeground: createColorToken('accent-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  
  // Muted colors
  muted: createColorToken('muted', 'oklch(0.2690 0 0)', 0.2690, 0, 0),
  mutedForeground: createColorToken('muted-foreground', 'oklch(0.7080 0 0)', 0.7080, 0, 0),
  
  // Destructive colors
  destructive: createColorToken('destructive', 'oklch(0.7040 0.1910 22.2160)', 0.7040, 0.1910, 22.2160),
  destructiveForeground: createColorToken('destructive-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  
  // Border & Input colors
  border: createColorToken('border', 'oklch(0.2750 0 0)', 0.2750, 0, 0),
  input: createColorToken('input', 'oklch(0.3250 0 0)', 0.3250, 0, 0),
  ring: createColorToken('ring', 'oklch(0.5560 0 0)', 0.5560, 0, 0),
  
  // Chart colors (same as light for consistency)
  chart1: createColorToken('chart-1', 'oklch(0.8100 0.1000 252)', 0.8100, 0.1000, 252),
  chart2: createColorToken('chart-2', 'oklch(0.6200 0.1900 260)', 0.6200, 0.1900, 260),
  chart3: createColorToken('chart-3', 'oklch(0.5500 0.2200 263)', 0.5500, 0.2200, 263),
  chart4: createColorToken('chart-4', 'oklch(0.4900 0.2200 264)', 0.4900, 0.2200, 264),
  chart5: createColorToken('chart-5', 'oklch(0.4200 0.1800 266)', 0.4200, 0.1800, 266),
  
  // Sidebar colors
  sidebar: createColorToken('sidebar', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.4880 0.2430 264.3760)', 0.4880, 0.2430, 264.3760),
  sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.2690 0 0)', 0.2690, 0, 0),
  sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  sidebarBorder: createColorToken('sidebar-border', 'oklch(0.2750 0 0)', 0.2750, 0, 0),
  sidebarRing: createColorToken('sidebar-ring', 'oklch(0.4390 0 0)', 0.4390, 0, 0)
};

// Default Theme - Dual configuration structure
export const DEFAULT_THEME: ThemeData = {
  id: 'default',
  name: 'Default',
  description: '',
  version: '1.0.0',
  author: 'Theme Editor 3.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  // Dual color configurations
  lightColors: DEFAULT_LIGHT_COLORS,
  darkColors: DEFAULT_DARK_COLORS,
  typography: {
    fontFamilies: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, \'Noto Sans\', sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\', \'Noto Color Emoji\'',
      serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    },
    trackingNormal: '0em'
  },
  brand: {
    name: 'Default Brand',
    primaryColor: createColorToken('brand-primary', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
    secondaryColor: createColorToken('brand-secondary', 'oklch(0.9700 0 0)', 0.9700, 0, 0)
  },
  spacing: {
    spacing: '0.25rem'
  },
  borders: {
    radius: '0.625rem',
    radiusSm: 'calc(var(--radius) - 4px)',
    radiusMd: 'calc(var(--radius) - 2px)', 
    radiusLg: 'var(--radius)',
    radiusXl: 'calc(var(--radius) + 4px)'
  },
  shadows: {
    shadow2xs: '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
    shadowXs: '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
    shadowSm: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
    shadow: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
    shadowMd: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)',
    shadowLg: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)',
    shadowXl: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)',
    shadow2xl: '0 1px 3px 0px hsl(0 0% 0% / 0.25)'
  },
  scroll: {
    width: '8px',
    behavior: 'smooth',
    smooth: true,
    hide: false
  },
  tags: ['default', 'clean', 'modern'],
  isPublic: true,
  isFavorite: false
};

// Helper function to create themed variants
function createThemedVariants(
  baseColors: typeof DEFAULT_LIGHT_COLORS,
  darkColors: typeof DEFAULT_DARK_COLORS,
  accentColors: Partial<import('../types/theme.types').ThemeColors>
): { lightColors: typeof DEFAULT_LIGHT_COLORS, darkColors: typeof DEFAULT_DARK_COLORS } {
  return {
    lightColors: { ...baseColors, ...accentColors },
    darkColors: { ...darkColors, ...accentColors }
  };
}

// Themed variants using helper function
export const AMBER_MINIMAL_THEME: ThemeData = {
  ...DEFAULT_THEME,
  id: 'amber-minimal',
  name: 'Amber Minimal', 
  description: 'Warm amber theme',
  ...createThemedVariants(DEFAULT_LIGHT_COLORS, DEFAULT_DARK_COLORS, {
    primary: createColorToken('primary', 'oklch(0.6835 0.1468 55.4)', 0.6835, 0.1468, 55.4),
    accent: createColorToken('accent', 'oklch(0.9456 0.0587 69.23)', 0.9456, 0.0587, 69.23)
  }),
  tags: ['amber', 'warm', 'minimal']
};

export const AMETHYST_HAZE_THEME: ThemeData = {
  ...DEFAULT_THEME,
  id: 'amethyst-haze',
  name: 'Amethyst Haze',
  description: 'Purple mystical theme',
  ...createThemedVariants(DEFAULT_LIGHT_COLORS, DEFAULT_DARK_COLORS, {
    primary: createColorToken('primary', 'oklch(0.6416 0.1778 303.5)', 0.6416, 0.1778, 303.5),
    accent: createColorToken('accent', 'oklch(0.9213 0.0574 314.1)', 0.9213, 0.0574, 314.1)
  }),
  tags: ['purple', 'elegant', 'mystical']
};

export const BOLD_TECH_THEME: ThemeData = {
  ...DEFAULT_THEME,
  id: 'bold-tech',
  name: 'Bold Tech',
  description: 'Bold blue tech theme',
  ...createThemedVariants(DEFAULT_LIGHT_COLORS, DEFAULT_DARK_COLORS, {
    primary: createColorToken('primary', 'oklch(0.5725 0.1686 259.8)', 0.5725, 0.1686, 259.8),
    accent: createColorToken('accent', 'oklch(0.8888 0.0569 267.2)', 0.8888, 0.0569, 267.2)
  }),
  tags: ['blue', 'tech', 'bold']
};

export const BUBBLEGUM_THEME: ThemeData = {
  ...DEFAULT_THEME,
  id: 'bubblegum',
  name: 'Bubblegum',
  description: 'Playful pink theme',
  ...createThemedVariants(DEFAULT_LIGHT_COLORS, DEFAULT_DARK_COLORS, {
    primary: createColorToken('primary', 'oklch(0.6436 0.1897 342.5)', 0.6436, 0.1897, 342.5),
    accent: createColorToken('accent', 'oklch(0.9346 0.0525 348.4)', 0.9346, 0.0525, 348.4)
  }),
  tags: ['pink', 'playful', 'fun']
};

export const CAFFEINE_THEME: ThemeData = {
  ...DEFAULT_THEME,
  id: 'caffeine',
  name: 'Caffeine',
  description: 'Energetic cyan theme',
  ...createThemedVariants(DEFAULT_LIGHT_COLORS, DEFAULT_DARK_COLORS, {
    primary: createColorToken('primary', 'oklch(0.6479 0.1307 194.8)', 0.6479, 0.1307, 194.8),
    accent: createColorToken('accent', 'oklch(0.8804 0.0452 194.8)', 0.8804, 0.0452, 194.8)
  }),
  tags: ['cyan', 'energetic', 'productivity']
};

export const CANDYLAND_THEME: ThemeData = {
  ...DEFAULT_THEME,
  id: 'candyland',
  name: 'Candyland', 
  description: 'Sweet orange theme',
  ...createThemedVariants(DEFAULT_LIGHT_COLORS, DEFAULT_DARK_COLORS, {
    primary: createColorToken('primary', 'oklch(0.6784 0.1567 45.2)', 0.6784, 0.1567, 45.2),
    accent: createColorToken('accent', 'oklch(0.9134 0.0543 60.1)', 0.9134, 0.0543, 60.1)
  }),
  tags: ['orange', 'sweet', 'candy']
};

// Export all themes
export const DEFAULT_THEMES: ThemeData[] = [
  DEFAULT_THEME,
  AMBER_MINIMAL_THEME,
  AMETHYST_HAZE_THEME,
  BOLD_TECH_THEME,
  BUBBLEGUM_THEME,
  CAFFEINE_THEME,
  CANDYLAND_THEME
];

// Theme lookup
export const THEMES_BY_ID = DEFAULT_THEMES.reduce((acc, theme) => {
  acc[theme.id] = theme;
  return acc;
}, {} as Record<string, ThemeData>);