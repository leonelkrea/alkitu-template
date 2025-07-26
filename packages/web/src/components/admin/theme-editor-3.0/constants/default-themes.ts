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

// Default Theme
export const DEFAULT_THEME: ThemeData = {
  id: 'default',
  name: 'Default',
  description: 'Clean and modern default theme',
  version: '1.0.0',
  author: 'Theme Editor 3.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  colors: {
    background: createColorToken('background', 'oklch(1 0 0)', 1, 0, 0),
    foreground: createColorToken('foreground', 'oklch(0.2686 0 0)', 0.2686, 0, 0),
    border: createColorToken('border', 'oklch(0.9276 0.0058 264.5313)', 0.9276, 0.0058, 264.5313),
    input: createColorToken('input', 'oklch(0.9276 0.0058 264.5313)', 0.9276, 0.0058, 264.5313),
    ring: createColorToken('ring', 'oklch(0.7686 0.1647 70.0804)', 0.7686, 0.1647, 70.0804),
    primary: createColorToken('primary', 'oklch(0.7686 0.1647 70.0804)', 0.7686, 0.1647, 70.0804),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0 0 0)', 0, 0, 0),
    secondary: createColorToken('secondary', 'oklch(0.967 0.0029 264.5419)', 0.967, 0.0029, 264.5419),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.4461 0.0263 256.8018)', 0.4461, 0.0263, 256.8018),
    muted: createColorToken('muted', 'oklch(0.9846 0.0017 247.8389)', 0.9846, 0.0017, 247.8389),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.551 0.0234 264.3637)', 0.551, 0.0234, 264.3637),
    accent: createColorToken('accent', 'oklch(0.9869 0.0214 95.2774)', 0.9869, 0.0214, 95.2774),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.4732 0.1247 46.2007)', 0.4732, 0.1247, 46.2007),
    destructive: createColorToken('destructive', 'oklch(0.6368 0.2078 25.3313)', 0.6368, 0.2078, 25.3313),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(1 0 0)', 1, 0, 0),
    card: createColorToken('card', 'oklch(1 0 0)', 1, 0, 0),
    cardForeground: createColorToken('card-foreground', 'oklch(0.2686 0 0)', 0.2686, 0, 0),
    popover: createColorToken('popover', 'oklch(1 0 0)', 1, 0, 0),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.2686 0 0)', 0.2686, 0, 0)
  },
  typography: {
    fontFamilies: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Source Serif 4', 'serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    lineHeights: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    },
    fontWeights: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    }
  },
  brand: {
    name: 'Default Brand',
    primaryColor: createColorToken('brand-primary', 'oklch(0.7686 0.1647 70.0804)', 0.7686, 0.1647, 70.0804),
    secondaryColor: createColorToken('brand-secondary', 'oklch(0.967 0.0029 264.5419)', 0.967, 0.0029, 264.5419)
  },
  spacing: {
    scale: {
      '0': '0px',
      'px': '1px',
      '0.5': '0.125rem',
      '1': '0.25rem',
      '1.5': '0.375rem',
      '2': '0.5rem',
      '2.5': '0.625rem',
      '3': '0.75rem',
      '3.5': '0.875rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
      '11': '2.75rem',
      '12': '3rem',
      '14': '3.5rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '28': '7rem',
      '32': '8rem',
      '36': '9rem',
      '40': '10rem',
      '44': '11rem',
      '48': '12rem',
      '52': '13rem',
      '56': '14rem',
      '60': '15rem',
      '64': '16rem',
      '72': '18rem',
      '80': '20rem',
      '96': '24rem'
    },
    containers: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },
  borders: {
    radius: {
      none: '0px',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    },
    width: {
      DEFAULT: '1px',
      '0': '0px',
      '2': '2px',
      '4': '4px',
      '8': '8px'
    }
  },
  shadows: {
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      none: '0 0 #0000'
    },
    dropShadows: {
      sm: '0 1px 1px rgb(0 0 0 / 0.05)',
      DEFAULT: '0 1px 2px rgb(0 0 0 / 0.1), 0 1px 1px rgb(0 0 0 / 0.06)',
      md: '0 4px 3px rgb(0 0 0 / 0.07), 0 2px 2px rgb(0 0 0 / 0.06)',
      lg: '0 10px 8px rgb(0 0 0 / 0.04), 0 4px 3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 13px rgb(0 0 0 / 0.03), 0 8px 5px rgb(0 0 0 / 0.08)',
      '2xl': '0 25px 25px rgb(0 0 0 / 0.15)',
      none: '0 0 #0000'
    }
  },
  scroll: {
    scrollbarWidth: '8px',
    scrollbarColor: 'oklch(0.7686 0.1647 70.0804)',
    scrollbarBg: 'oklch(0.9276 0.0058 264.5313)',
    scrollBehavior: 'smooth'
  },
  tags: ['default', 'clean', 'modern'],
  isPublic: true,
  isFavorite: false
};

// Amber Minimal Theme
export const AMBER_MINIMAL_THEME: ThemeData = {
  ...DEFAULT_THEME,
  id: 'amber-minimal',
  name: 'Amber Minimal',
  description: 'Warm amber tones with minimal design',
  colors: {
    ...DEFAULT_THEME.colors,
    primary: createColorToken('primary', 'oklch(0.6835 0.1468 55.4)', 0.6835, 0.1468, 55.4),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0.15 0.02 45)', 0.15, 0.02, 45),
    accent: createColorToken('accent', 'oklch(0.9456 0.0587 69.23)', 0.9456, 0.0587, 69.23),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.4732 0.1247 46.2007)', 0.4732, 0.1247, 46.2007)
  },
  brand: {
    name: 'Amber Brand',
    primaryColor: createColorToken('brand-primary', 'oklch(0.6835 0.1468 55.4)', 0.6835, 0.1468, 55.4),
    secondaryColor: createColorToken('brand-secondary', 'oklch(0.9456 0.0587 69.23)', 0.9456, 0.0587, 69.23)
  },
  tags: ['amber', 'warm', 'minimal']
};

// Amethyst Haze Theme
export const AMETHYST_HAZE_THEME: ThemeData = {
  ...DEFAULT_THEME,
  id: 'amethyst-haze',
  name: 'Amethyst Haze',
  description: 'Elegant purple hues with mystical vibes',
  colors: {
    ...DEFAULT_THEME.colors,
    primary: createColorToken('primary', 'oklch(0.6416 0.1778 303.5)', 0.6416, 0.1778, 303.5),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0.98 0.004 303)', 0.98, 0.004, 303),
    accent: createColorToken('accent', 'oklch(0.9213 0.0574 314.1)', 0.9213, 0.0574, 314.1),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.4 0.15 303)', 0.4, 0.15, 303)
  },
  brand: {
    name: 'Amethyst Brand',
    primaryColor: createColorToken('brand-primary', 'oklch(0.6416 0.1778 303.5)', 0.6416, 0.1778, 303.5),
    secondaryColor: createColorToken('brand-secondary', 'oklch(0.9213 0.0574 314.1)', 0.9213, 0.0574, 314.1)
  },
  tags: ['purple', 'elegant', 'mystical']
};

// Bold Tech Theme
export const BOLD_TECH_THEME: ThemeData = {
  ...DEFAULT_THEME,
  id: 'bold-tech',
  name: 'Bold Tech',
  description: 'Strong blue theme for tech applications',
  colors: {
    ...DEFAULT_THEME.colors,
    primary: createColorToken('primary', 'oklch(0.5725 0.1686 259.8)', 0.5725, 0.1686, 259.8),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0.98 0.003 260)', 0.98, 0.003, 260),
    accent: createColorToken('accent', 'oklch(0.8888 0.0569 267.2)', 0.8888, 0.0569, 267.2),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.35 0.13 260)', 0.35, 0.13, 260)
  },
  brand: {
    name: 'Bold Tech Brand',
    primaryColor: createColorToken('brand-primary', 'oklch(0.5725 0.1686 259.8)', 0.5725, 0.1686, 259.8),
    secondaryColor: createColorToken('brand-secondary', 'oklch(0.8888 0.0569 267.2)', 0.8888, 0.0569, 267.2)
  },
  tags: ['blue', 'tech', 'bold']
};

// Bubblegum Theme
export const BUBBLEGUM_THEME: ThemeData = {
  ...DEFAULT_THEME,
  id: 'bubblegum',
  name: 'Bubblegum',
  description: 'Playful pink theme with fun vibes',
  colors: {
    ...DEFAULT_THEME.colors,
    primary: createColorToken('primary', 'oklch(0.6436 0.1897 342.5)', 0.6436, 0.1897, 342.5),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0.98 0.005 342)', 0.98, 0.005, 342),
    accent: createColorToken('accent', 'oklch(0.9346 0.0525 348.4)', 0.9346, 0.0525, 348.4),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.4 0.15 342)', 0.4, 0.15, 342)
  },
  brand: {
    name: 'Bubblegum Brand',
    primaryColor: createColorToken('brand-primary', 'oklch(0.6436 0.1897 342.5)', 0.6436, 0.1897, 342.5),
    secondaryColor: createColorToken('brand-secondary', 'oklch(0.9346 0.0525 348.4)', 0.9346, 0.0525, 348.4)
  },
  tags: ['pink', 'playful', 'fun']
};

// Caffeine Theme
export const CAFFEINE_THEME: ThemeData = {
  ...DEFAULT_THEME,
  id: 'caffeine',
  name: 'Caffeine',
  description: 'Energetic cyan theme for productivity',
  colors: {
    ...DEFAULT_THEME.colors,
    primary: createColorToken('primary', 'oklch(0.6479 0.1307 194.8)', 0.6479, 0.1307, 194.8),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0.98 0.003 195)', 0.98, 0.003, 195),
    accent: createColorToken('accent', 'oklch(0.8804 0.0452 194.8)', 0.8804, 0.0452, 194.8),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.35 0.1 195)', 0.35, 0.1, 195)
  },
  brand: {
    name: 'Caffeine Brand',
    primaryColor: createColorToken('brand-primary', 'oklch(0.6479 0.1307 194.8)', 0.6479, 0.1307, 194.8),
    secondaryColor: createColorToken('brand-secondary', 'oklch(0.8804 0.0452 194.8)', 0.8804, 0.0452, 194.8)
  },
  tags: ['cyan', 'energetic', 'productivity']
};

// Candyland Theme
export const CANDYLAND_THEME: ThemeData = {
  ...DEFAULT_THEME,
  id: 'candyland',
  name: 'Candyland',
  description: 'Sweet orange theme with candy-like colors',
  colors: {
    ...DEFAULT_THEME.colors,
    primary: createColorToken('primary', 'oklch(0.6784 0.1567 45.2)', 0.6784, 0.1567, 45.2),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0.98 0.003 45)', 0.98, 0.003, 45),
    accent: createColorToken('accent', 'oklch(0.9134 0.0543 60.1)', 0.9134, 0.0543, 60.1),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.4 0.12 45)', 0.4, 0.12, 45)
  },
  brand: {
    name: 'Candyland Brand',
    primaryColor: createColorToken('brand-primary', 'oklch(0.6784 0.1567 45.2)', 0.6784, 0.1567, 45.2),
    secondaryColor: createColorToken('brand-secondary', 'oklch(0.9134 0.0543 60.1)', 0.9134, 0.0543, 60.1)
  },
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