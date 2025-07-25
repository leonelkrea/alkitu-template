/**
 * Theme Builder - Color Defaults
 * Default color configurations and palettes
 * Extracted from ThemeEditor.tsx as part of Clean Architecture refactor
 */

import type { ColorSection } from '../../shared/types';

// ============================================================================
// COLOR SECTIONS CONFIGURATION
// ============================================================================

/**
 * Default color sections matching TweakCN structure
 * This is the foundation for all theme color management
 */
export const DEFAULT_COLOR_SECTIONS: ColorSection[] = [
  {
    title: 'Primary Colors',
    expanded: true,
    colors: [
      {
        name: 'primary',
        displayName: 'Primary',
        value: '#f59e0b',
        description: 'Main brand color',
      },
      {
        name: 'primary-foreground',
        displayName: 'Primary Foreground',
        value: '#000000',
        description: 'Text on primary background',
        defaultLinkTarget: 'primary',
      },
    ],
  },
  {
    title: 'Secondary Colors',
    colors: [
      {
        name: 'secondary',
        displayName: 'Secondary',
        value: '#f3f4f6',
        description: 'Secondary brand color',
      },
      {
        name: 'secondary-foreground',
        displayName: 'Secondary Foreground',
        value: '#374151',
        description: 'Text on secondary background',
        defaultLinkTarget: 'secondary',
      },
    ],
  },
  {
    title: 'Accent Colors',
    colors: [
      {
        name: 'accent',
        displayName: 'Accent',
        value: '#e0f2fe',
        description: 'Accent color for highlights',
      },
      {
        name: 'accent-foreground',
        displayName: 'Accent Foreground',
        value: '#0c4a6e',
        description: 'Text on accent background',
        defaultLinkTarget: 'accent',
      },
    ],
  },
  {
    title: 'Base Colors',
    colors: [
      {
        name: 'background',
        displayName: 'Background',
        value: '#ffffff',
        description: 'Main background color',
      },
      {
        name: 'foreground',
        displayName: 'Foreground',
        value: '#374151',
        description: 'Primary text color',
      },
    ],
  },
  {
    title: 'Card Colors',
    colors: [
      {
        name: 'card',
        displayName: 'Card Background',
        value: '#ffffff',
        description: 'Card background color',
      },
      {
        name: 'card-foreground',
        displayName: 'Card Foreground',
        value: '#374151',
        description: 'Text on card background',
        defaultLinkTarget: 'card',
      },
    ],
  },
  {
    title: 'Popover Colors',
    colors: [
      {
        name: 'popover',
        displayName: 'Popover Background',
        value: '#ffffff',
        description: 'Popover background color',
      },
      {
        name: 'popover-foreground',
        displayName: 'Popover Foreground',
        value: '#374151',
        description: 'Text on popover background',
        defaultLinkTarget: 'popover',
      },
    ],
  },
  {
    title: 'Muted Colors',
    colors: [
      {
        name: 'muted',
        displayName: 'Muted',
        value: '#f9fafb',
        description: 'Muted background',
      },
      {
        name: 'muted-foreground',
        displayName: 'Muted Foreground',
        value: '#6b7280',
        description: 'Muted text color',
        defaultLinkTarget: 'muted',
      },
    ],
  },
  {
    title: 'Status Colors',
    colors: [
      {
        name: 'success',
        displayName: 'Success',
        value: '#10b981',
        description: 'Success color',
      },
      {
        name: 'success-foreground',
        displayName: 'Success Foreground',
        value: '#ffffff',
        description: 'Text on success background',
        defaultLinkTarget: 'success',
      },
      {
        name: 'warning',
        displayName: 'Warning',
        value: '#f59e0b',
        description: 'Warning color',
      },
      {
        name: 'warning-foreground',
        displayName: 'Warning Foreground',
        value: '#1f2937',
        description: 'Text on warning background',
        defaultLinkTarget: 'warning',
      },
      {
        name: 'info',
        displayName: 'Info',
        value: '#3b82f6',
        description: 'Info color',
      },
      {
        name: 'info-foreground',
        displayName: 'Info Foreground',
        value: '#ffffff',
        description: 'Text on info background',
        defaultLinkTarget: 'info',
      },
      {
        name: 'destructive',
        displayName: 'Destructive',
        value: '#ef4444',
        description: 'Error color',
      },
      {
        name: 'destructive-foreground',
        displayName: 'Destructive Foreground',
        value: '#ffffff',
        description: 'Text on error background',
        defaultLinkTarget: 'destructive',
      },
    ],
  },
  {
    title: 'Border & Input Colors',
    colors: [
      {
        name: 'border',
        displayName: 'Border',
        value: '#e5e7eb',
        description: 'Default border color',
        defaultLinkTarget: 'primary',
      },
      {
        name: 'input',
        displayName: 'Input',
        value: '#e5e7eb',
        description: 'Input border color',
        defaultLinkTarget: 'muted',
      },
      {
        name: 'ring',
        displayName: 'Ring',
        value: '#3b82f6',
        description: 'Focus ring color',
        defaultLinkTarget: 'primary',
      },
    ],
  },
  {
    title: 'Chart Colors',
    colors: [
      {
        name: 'chart-1',
        displayName: 'Chart 1',
        value: '#3b82f6',
        description: 'Chart color 1',
      },
      {
        name: 'chart-2',
        displayName: 'Chart 2',
        value: '#8b5cf6',
        description: 'Chart color 2',
      },
      {
        name: 'chart-3',
        displayName: 'Chart 3',
        value: '#f59e0b',
        description: 'Chart color 3',
      },
      {
        name: 'chart-4',
        displayName: 'Chart 4',
        value: '#10b981',
        description: 'Chart color 4',
      },
      {
        name: 'chart-5',
        displayName: 'Chart 5',
        value: '#ef4444',
        description: 'Chart color 5',
      },
    ],
  },
  {
    title: 'Sidebar Colors',
    colors: [
      {
        name: 'sidebar',
        displayName: 'Sidebar Background',
        value: '#f9fafb',
        description: 'Sidebar background color',
      },
      {
        name: 'sidebar-foreground',
        displayName: 'Sidebar Foreground',
        value: '#374151',
        description: 'Sidebar text color',
        defaultLinkTarget: 'sidebar',
      },
      {
        name: 'sidebar-primary',
        displayName: 'Sidebar Primary',
        value: '#f59e0b',
        description: 'Sidebar primary color',
      },
      {
        name: 'sidebar-primary-foreground',
        displayName: 'Sidebar Primary Foreground',
        value: '#000000',
        description: 'Sidebar primary text color',
        defaultLinkTarget: 'sidebar-primary',
      },
      {
        name: 'sidebar-accent',
        displayName: 'Sidebar Accent',
        value: '#e0f2fe',
        description: 'Sidebar accent color',
      },
      {
        name: 'sidebar-accent-foreground',
        displayName: 'Sidebar Accent Foreground',
        value: '#0c4a6e',
        description: 'Sidebar accent text color',
        defaultLinkTarget: 'sidebar-accent',
      },
      {
        name: 'sidebar-border',
        displayName: 'Sidebar Border',
        value: '#e5e7eb',
        description: 'Sidebar border color',
        defaultLinkTarget: 'border',
      },
      {
        name: 'sidebar-ring',
        displayName: 'Sidebar Ring',
        value: '#3b82f6',
        description: 'Sidebar focus ring color',
        defaultLinkTarget: 'ring',
      },
    ],
  },
];

// ============================================================================
// REQUIRED COLORS
// ============================================================================

/**
 * Essential colors that every theme must have
 */
export const REQUIRED_COLORS = [
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'background', 'foreground',
  'card', 'card-foreground',
  'popover', 'popover-foreground',
  'muted', 'muted-foreground',
  'accent', 'accent-foreground',
  'destructive', 'destructive-foreground',
  'border', 'input', 'ring'
] as const;

/**
 * Optional colors that enhance theme functionality
 */
export const OPTIONAL_COLORS = [
  'success', 'success-foreground',
  'warning', 'warning-foreground',
  'info', 'info-foreground',
  'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
  'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
  'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring'
] as const;

/**
 * All supported color names
 */
export const ALL_COLOR_NAMES = [...REQUIRED_COLORS, ...OPTIONAL_COLORS] as const;

// ============================================================================
// DEFAULT BRAND COLORS
// ============================================================================

/**
 * Default colors for brand configuration
 */
export const DEFAULT_BRAND_COLORS = {
  primaryText: '#000000',
  secondaryText: '#666666',
  iconBackground: '#3b82f6',
  iconColor: '#ffffff',
} as const;

/**
 * Default brand configuration
 */
export const DEFAULT_BRAND_CONFIG = {
  // Text Configuration
  primaryText: 'Alkitu',
  secondaryText: 'Design System',
  
  // Text Colors
  primaryTextColor: DEFAULT_BRAND_COLORS.primaryText,
  primaryTextColorLinked: true,
  primaryTextColorLinkedTo: 'foreground',
  
  secondaryTextColor: DEFAULT_BRAND_COLORS.secondaryText,
  secondaryTextColorLinked: true,
  secondaryTextColorLinkedTo: 'muted-foreground',
  
  // Icon Configuration
  iconBackgroundColor: DEFAULT_BRAND_COLORS.iconBackground,
  iconBackgroundColorLinked: true,
  iconBackgroundColorLinkedTo: 'primary',
  
  iconColor: DEFAULT_BRAND_COLORS.iconColor,
  iconColorLinked: true,
  iconColorLinkedTo: 'primary-foreground',
  
  // SVG Configuration
  monochromeMode: 'none' as const,
} as const;

// ============================================================================
// COLOR PALETTE PRESETS
// ============================================================================

/**
 * Popular color palette presets
 */
export const COLOR_PRESETS = {
  blue: {
    primary: '#3b82f6',
    'primary-foreground': '#ffffff',
    secondary: '#f1f5f9',
    'secondary-foreground': '#334155',
  },
  green: {
    primary: '#10b981',
    'primary-foreground': '#ffffff',
    secondary: '#f0fdf4',
    'secondary-foreground': '#166534',
  },
  purple: {
    primary: '#8b5cf6',
    'primary-foreground': '#ffffff',
    secondary: '#faf5ff',
    'secondary-foreground': '#6b21a8',
  },
  orange: {
    primary: '#f59e0b',
    'primary-foreground': '#000000',
    secondary: '#fffbeb',
    'secondary-foreground': '#92400e',
  },
  red: {
    primary: '#ef4444',
    'primary-foreground': '#ffffff',
    secondary: '#fef2f2',
    'secondary-foreground': '#991b1b',
  },
  gray: {
    primary: '#6b7280',
    'primary-foreground': '#ffffff',
    secondary: '#f9fafb',
    'secondary-foreground': '#374151',
  },
} as const;

// ============================================================================
// ACCESSIBILITY STANDARDS
// ============================================================================

/**
 * WCAG contrast ratio standards
 */
export const CONTRAST_STANDARDS = {
  AA: 4.5,
  AA_LARGE: 3,
  AAA: 7,
  AAA_LARGE: 4.5,
} as const;

/**
 * Color combinations that should maintain high contrast
 */
export const HIGH_CONTRAST_PAIRS = [
  ['primary', 'primary-foreground'],
  ['secondary', 'secondary-foreground'],
  ['destructive', 'destructive-foreground'],
  ['success', 'success-foreground'],
  ['warning', 'warning-foreground'],
  ['info', 'info-foreground'],
  ['card', 'card-foreground'],
  ['popover', 'popover-foreground'],
  ['muted', 'muted-foreground'],
  ['accent', 'accent-foreground'],
] as const;

// ============================================================================
// LEGACY EXPORTS
// ============================================================================

/**
 * Legacy export for backward compatibility
 */
export const COLOR_SECTIONS = DEFAULT_COLOR_SECTIONS;