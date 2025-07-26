// Theme Editor 3.0 - Core Theme Types
export interface OklchColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.37+)
  h: number; // Hue (0-360)
  a?: number; // Alpha (0-1)
}

export interface ColorToken {
  name: string;
  value: string; // OKLCH string or CSS variable
  oklch: OklchColor;
  description?: string;
}

export interface ThemeColors {
  // Base colors
  background: ColorToken;
  foreground: ColorToken;
  border: ColorToken;
  input: ColorToken;
  ring: ColorToken;
  
  // Semantic colors
  primary: ColorToken;
  primaryForeground: ColorToken;
  secondary: ColorToken;
  secondaryForeground: ColorToken;
  muted: ColorToken;
  mutedForeground: ColorToken;
  accent: ColorToken;
  accentForeground: ColorToken;
  destructive: ColorToken;
  destructiveForeground: ColorToken;
  
  // UI colors
  card: ColorToken;
  cardForeground: ColorToken;
  popover: ColorToken;
  popoverForeground: ColorToken;
}

export interface ThemeTypography {
  fontFamilies: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSizes: Record<string, string>;
  lineHeights: Record<string, string>;
  letterSpacing: Record<string, string>;
  fontWeights: Record<string, number>;
}

export interface ThemeBrand {
  logo?: string;
  name: string;
  primaryColor: ColorToken;
  secondaryColor: ColorToken;
  brandColors?: ColorToken[];
}

export interface ThemeSpacing {
  scale: Record<string, string>;
  containers: Record<string, string>;
}

export interface ThemeBorders {
  radius: Record<string, string>;
  width: Record<string, string>;
}

export interface ThemeShadows {
  shadows: Record<string, string>;
  dropShadows: Record<string, string>;
}

export interface ThemeScroll {
  scrollbarWidth: string;
  scrollbarColor: string;
  scrollbarBg: string;
  scrollBehavior: 'auto' | 'smooth';
}

export interface ThemeData {
  id: string;
  name: string;
  description?: string;
  version: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  
  // Theme properties
  colors: ThemeColors;
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

export type ThemeMode = 'light' | 'dark';

export interface ThemeExportFormat {
  format: 'css' | 'json' | 'tailwind' | 'scss' | 'figma';
  content: string;
  filename: string;
}