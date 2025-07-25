/**
 * Theme Builder - Breakpoint Constants
 * Responsive design breakpoints and media queries
 * Extracted from existing components as part of Clean Architecture refactor
 */

import type { Breakpoint } from '../../shared/types';

// ============================================================================
// BREAKPOINT DEFINITIONS
// ============================================================================

/**
 * Standard responsive breakpoints
 */
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  tv: 1920,
} as const;

/**
 * Breakpoint names as array for iteration
 */
export const BREAKPOINT_NAMES: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'tv'];

/**
 * Breakpoint configurations with metadata
 */
export const BREAKPOINT_CONFIG = [
  {
    key: 'mobile' as const,
    name: 'Mobile',
    minWidth: BREAKPOINTS.mobile,
    maxWidth: BREAKPOINTS.tablet - 1,
    icon: '📱',
    color: 'bg-orange-500',
    description: 'Small screens, phones',
    columns: 1,
    gap: 'gap-2',
  },
  {
    key: 'tablet' as const,
    name: 'Tablet',
    minWidth: BREAKPOINTS.tablet,
    maxWidth: BREAKPOINTS.desktop - 1,
    icon: '📟',
    color: 'bg-green-500',
    description: 'Medium screens, tablets',
    columns: 2,
    gap: 'gap-4',
  },
  {
    key: 'desktop' as const,
    name: 'Desktop',
    minWidth: BREAKPOINTS.desktop,
    maxWidth: BREAKPOINTS.tv - 1,
    icon: '🖥️',
    color: 'bg-blue-500',
    description: 'Large screens, laptops',
    columns: 3,
    gap: 'gap-6',
  },
  {
    key: 'tv' as const,
    name: 'TV',
    minWidth: BREAKPOINTS.tv,
    maxWidth: Infinity,
    icon: '📺',
    color: 'bg-purple-500',
    description: 'Extra large screens, TVs',
    columns: 4,
    gap: 'gap-8',
  },
] as const;

// ============================================================================
// MEDIA QUERIES
// ============================================================================

/**
 * Generate media query strings
 */
export const MEDIA_QUERIES = {
  mobile: `(min-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
  tv: `(min-width: ${BREAKPOINTS.tv}px)`,
  
  // Max-width queries
  maxMobile: `(max-width: ${BREAKPOINTS.tablet - 1}px)`,
  maxTablet: `(max-width: ${BREAKPOINTS.desktop - 1}px)`,
  maxDesktop: `(max-width: ${BREAKPOINTS.tv - 1}px)`,
  
  // Range queries
  mobileOnly: `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`,
  tabletOnly: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
  desktopOnly: `(min-width: ${BREAKPOINTS.desktop}px) and (max-width: ${BREAKPOINTS.tv - 1}px)`,
  tvOnly: `(min-width: ${BREAKPOINTS.tv}px)`,
  
  // Utility queries
  touch: '(hover: none) and (pointer: coarse)',
  hover: '(hover: hover) and (pointer: fine)',
  reduced: '(prefers-reduced-motion: reduce)',
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
} as const;

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Default responsive values for common properties
 */
export const RESPONSIVE_DEFAULTS = {
  fontSize: {
    mobile: '14px',
    tablet: '16px',
    desktop: '16px',
    tv: '18px',
  },
  lineHeight: {
    mobile: '1.4',
    tablet: '1.5',
    desktop: '1.5',
    tv: '1.6',
  },
  spacing: {
    mobile: '1rem',
    tablet: '1.5rem',
    desktop: '2rem',
    tv: '2.5rem',
  },
  containerWidth: {
    mobile: '100%',
    tablet: '768px',
    desktop: '1024px',
    tv: '1280px',
  },
  gridColumns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    tv: 4,
  },
} as const;

// ============================================================================
// BREAKPOINT HELPERS
// ============================================================================

/**
 * Get breakpoint configuration by key
 */
export function getBreakpointConfig(breakpoint: Breakpoint) {
  return BREAKPOINT_CONFIG.find(config => config.key === breakpoint);
}

/**
 * Get next larger breakpoint
 */
export function getNextBreakpoint(current: Breakpoint): Breakpoint | null {
  const currentIndex = BREAKPOINT_NAMES.indexOf(current);
  const nextIndex = currentIndex + 1;
  return nextIndex < BREAKPOINT_NAMES.length ? BREAKPOINT_NAMES[nextIndex] : null;
}

/**
 * Get previous smaller breakpoint
 */
export function getPreviousBreakpoint(current: Breakpoint): Breakpoint | null {
  const currentIndex = BREAKPOINT_NAMES.indexOf(current);
  const prevIndex = currentIndex - 1;
  return prevIndex >= 0 ? BREAKPOINT_NAMES[prevIndex] : null;
}

/**
 * Check if breakpoint is valid
 */
export function isValidBreakpoint(breakpoint: string): breakpoint is Breakpoint {
  return BREAKPOINT_NAMES.includes(breakpoint as Breakpoint);
}

/**
 * Get breakpoint from width
 */
export function getBreakpointFromWidth(width: number): Breakpoint {
  if (width >= BREAKPOINTS.tv) return 'tv';
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

// ============================================================================
// CSS-IN-JS HELPERS
// ============================================================================

/**
 * Generate CSS media query for breakpoint
 */
export function createMediaQuery(breakpoint: Breakpoint): string {
  return MEDIA_QUERIES[breakpoint];
}

/**
 * Generate responsive CSS values
 */
export function createResponsiveCSS<T>(
  property: string, 
  values: Partial<Record<Breakpoint, T>>
): Record<string, T> {
  const css: Record<string, T> = {};
  
  BREAKPOINT_NAMES.forEach(breakpoint => {
    if (values[breakpoint] !== undefined) {
      if (breakpoint === 'mobile') {
        css[property] = values[breakpoint] as T;
      } else {
        css[`@media ${MEDIA_QUERIES[breakpoint]}`] = {
          [property]: values[breakpoint]
        } as T;
      }
    }
  });
  
  return css;
}

// ============================================================================
// CONTAINER QUERIES (Future Support)
// ============================================================================

/**
 * Container query breakpoints (for future CSS Container Queries support)
 */
export const CONTAINER_BREAKPOINTS = {
  xs: '20rem',   // 320px
  sm: '24rem',   // 384px  
  md: '28rem',   // 448px
  lg: '32rem',   // 512px
  xl: '36rem',   // 576px
  '2xl': '42rem', // 672px
  '3xl': '48rem', // 768px
  '4xl': '56rem', // 896px
  '5xl': '64rem', // 1024px
  '6xl': '72rem', // 1152px
  '7xl': '80rem', // 1280px
} as const;

/**
 * Container query media strings
 */
export const CONTAINER_QUERIES = Object.entries(CONTAINER_BREAKPOINTS).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: `(min-width: ${value})`,
  }),
  {} as Record<keyof typeof CONTAINER_BREAKPOINTS, string>
);