// Theme Editor 3.0 - Core Theme Types V2
// Enhanced types for precise color handling

export interface OklchColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.5+) - Increased range for vivid colors
  h: number; // Hue (0-360)
}

export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HSVColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface ColorToken {
  name: string;
  hex: string;           // NEW: Display principal (#RRGGBB)
  oklch: OklchColor;     // Fuente de verdad numérica
  oklchString: string;   // NEW: Para mostrar en UI "oklch(0.62 0.19 259.81)"
  rgb: RGBColor;         // NEW: Para inputs RGB
  hsv: HSVColor;         // NEW: Para color picker
  description?: string;
  
  // Color linking system
  linkedTo?: string;     // Name of the parent color this is linked to
  linkedColors?: string[]; // Names of colors that are linked to this color
  
  // Legacy compatibility
  value: string;         // DEPRECATED: Use oklchString instead
}

export interface ThemeColors {
  // Base colors
  background: ColorToken;
  foreground: ColorToken;
  
  // UI container colors
  card: ColorToken;
  cardForeground: ColorToken;
  popover: ColorToken;
  popoverForeground: ColorToken;
  
  // Primary colors
  primary: ColorToken;
  primaryForeground: ColorToken;
  
  // Secondary colors  
  secondary: ColorToken;
  secondaryForeground: ColorToken;
  
  // Accent colors
  accent: ColorToken;
  accentForeground: ColorToken;
  
  // Muted colors
  muted: ColorToken;
  mutedForeground: ColorToken;
  
  // Destructive colors
  destructive: ColorToken;
  destructiveForeground: ColorToken;
  
  // Border & Input colors
  border: ColorToken;
  input: ColorToken;
  ring: ColorToken;
  
  // Chart colors
  chart1: ColorToken;
  chart2: ColorToken;
  chart3: ColorToken;
  chart4: ColorToken;
  chart5: ColorToken;
  
  // Sidebar colors
  sidebar: ColorToken;
  sidebarForeground: ColorToken;
  sidebarPrimary: ColorToken;
  sidebarPrimaryForeground: ColorToken;
  sidebarAccent: ColorToken;
  sidebarAccentForeground: ColorToken;
  sidebarBorder: ColorToken;
  sidebarRing: ColorToken;
  
  // Scrollbar colors
  scrollbarTrack: ColorToken;
  scrollbarThumb: ColorToken;
}

export interface ThemeTypography {
  fontFamilies: {
    sans: string;
    serif: string;
    mono: string;
  };
  trackingNormal: string;
}

export interface ThemeBrand {
  logo?: string;
  name: string;
  primaryColor: ColorToken;
  secondaryColor: ColorToken;
  brandColors?: ColorToken[];
}

export interface ThemeSpacing {
  spacing: string; // Base spacing value (0.25rem)
}

export interface ThemeBorders {
  radius: string; // Base radius value
  radiusSm: string; // calc(var(--radius) - 4px)
  radiusMd: string; // calc(var(--radius) - 2px)
  radiusLg: string; // var(--radius)
  radiusXl: string; // calc(var(--radius) + 4px)
}

export interface ThemeShadows {
  shadow2xs: string;
  shadowXs: string;
  shadowSm: string;
  shadow: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  shadow2xl: string;
}

export interface ThemeScroll {
  width: string;
  behavior: 'auto' | 'smooth' | 'instant';
  smooth: boolean;
  hide: boolean;
}

export interface ThemeData {
  id: string;
  name: string;
  description?: string;
  version: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  
  // Dual-mode theme properties
  lightColors: ThemeColors;   // Light mode color configuration
  darkColors: ThemeColors;    // Dark mode color configuration
  
  // Shared properties (mode-independent)
  typography: ThemeTypography;
  brand: ThemeBrand;
  spacing: ThemeSpacing;
  borders: ThemeBorders;
  shadows: ThemeShadows;
  scroll: ThemeScroll;
  
  // Metadata
  tags?: string[];
  isPublic: boolean;
  isFavorite: boolean;
}

// Helper to get current colors based on mode
export interface ThemeWithCurrentColors extends Omit<ThemeData, 'lightColors' | 'darkColors'> {
  colors: ThemeColors; // Current active colors based on mode
  lightColors: ThemeColors;
  darkColors: ThemeColors;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeExportFormat {
  format: 'css' | 'json' | 'tailwind' | 'scss' | 'figma';
  content: string;
  filename: string;
}