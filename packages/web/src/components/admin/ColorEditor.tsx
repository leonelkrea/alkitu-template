import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Monitor, Tablet, Smartphone, Tv, Save, Download, RotateCcw, Palette, Link, Unlink } from "lucide-react";

// Color Design Systems
const COLOR_SYSTEMS = [
  { key: 'shadcn', name: 'ShadCN/UI', icon: Palette, description: 'Base system with TailwindCSS V4' },
  { key: 'material', name: 'Material Design 3', icon: Palette, description: 'Google Material Design palette' },
] as const;

// Material Design 3 Color Tokens (based on the screenshot)
const MATERIAL_COLORS = {
  primary: {
    name: 'Primary',
    description: 'Main brand color',
    scale: {
      0: '#000000', 10: '#00201a', 20: '#003a2f', 30: '#005544', 40: '#007059', 50: '#008c6e', 60: '#00a884', 70: '#4ac699', 80: '#6ee3af', 90: '#92ffc5', 95: '#bfffda', 99: '#f7fffc', 100: '#ffffff'
    }
  },
  secondary: {
    name: 'Secondary',
    description: 'Supporting color',
    scale: {
      0: '#000000', 10: '#0e1f1c', 20: '#243530', 30: '#3a4b46', 40: '#51625d', 50: '#697a75', 60: '#82938e', 70: '#9daea8', 80: '#b8c9c3', 90: '#d4e5df', 95: '#e2f3ed', 99: '#f7fffc', 100: '#ffffff'
    }
  },
  tertiary: {
    name: 'Tertiary',
    description: 'Accent color',
    scale: {
      0: '#000000', 10: '#2d1600', 20: '#482800', 30: '#643b00', 40: '#824f00', 50: '#a16400', 60: '#c07a00', 70: '#e19200', 80: '#ffab47', 90: '#ffd9a6', 95: '#ffecce', 99: '#fffaf6', 100: '#ffffff'
    }
  },
  error: {
    name: 'Error',
    description: 'Error and danger states',
    scale: {
      0: '#000000', 10: '#410002', 20: '#690005', 30: '#93000a', 40: '#ba1a1a', 50: '#de3730', 60: '#ff5449', 70: '#ff897d', 80: '#ffb4ab', 90: '#ffdad6', 95: '#ffedea', 99: '#fffbff', 100: '#ffffff'
    }
  },
  neutral: {
    name: 'Neutral',
    description: 'Background colors',
    scale: {
      0: '#000000', 10: '#181d1a', 20: '#2d322f', 30: '#444845', 40: '#5c5f5c', 50: '#747874', 60: '#8e918d', 70: '#a8aca7', 80: '#c4c7c2', 90: '#e0e3de', 95: '#eef1ec', 99: '#fafdf8', 100: '#ffffff'
    }
  },
  neutralVariant: {
    name: 'Neutral Variant',
    description: 'Surface variations',
    scale: {
      0: '#000000', 10: '#161d1a', 20: '#2b3230', 30: '#414946', 40: '#59605d', 50: '#717975', 60: '#8b928e', 70: '#a5aca8', 80: '#c1c7c3', 90: '#dde4df', 95: '#ebf2ed', 99: '#f7fef9', 100: '#ffffff'
    }
  }
} as const;

// ShadCN Default Colors (tu estructura actual) - Base system
const SHADCN_COLORS = {
  // Core ShadCN colors (from your existing theme)
  background: { name: 'Background', description: 'Page background', cssVar: '--background', category: 'surface' },
  foreground: { name: 'Foreground', description: 'Primary text color', cssVar: '--foreground', category: 'surface' },
  card: { name: 'Card', description: 'Card background', cssVar: '--card', category: 'surface' },
  cardForeground: { name: 'Card Foreground', description: 'Card text', cssVar: '--card-foreground', category: 'surface' },
  popover: { name: 'Popover', description: 'Popover background', cssVar: '--popover', category: 'surface' },
  popoverForeground: { name: 'Popover Foreground', description: 'Popover text', cssVar: '--popover-foreground', category: 'surface' },
  
  // Brand colors
  primary: { name: 'Primary', description: 'Main brand color', cssVar: '--primary', category: 'brand' },
  primaryForeground: { name: 'Primary Foreground', description: 'Text on primary', cssVar: '--primary-foreground', category: 'brand' },
  secondary: { name: 'Secondary', description: 'Secondary brand color', cssVar: '--secondary', category: 'brand' },
  secondaryForeground: { name: 'Secondary Foreground', description: 'Text on secondary', cssVar: '--secondary-foreground', category: 'brand' },
  
  // Accent and feedback
  accent: { name: 'Accent', description: 'Accent color for highlights', cssVar: '--accent', category: 'feedback' },
  accentForeground: { name: 'Accent Foreground', description: 'Text on accent', cssVar: '--accent-foreground', category: 'feedback' },
  destructive: { name: 'Destructive', description: 'Error and danger actions', cssVar: '--destructive', category: 'feedback' },
  destructiveForeground: { name: 'Destructive Foreground', description: 'Text on destructive', cssVar: '--destructive-foreground', category: 'feedback' },
  
  // Utility colors  
  muted: { name: 'Muted', description: 'Muted backgrounds', cssVar: '--muted', category: 'utility' },
  mutedForeground: { name: 'Muted Foreground', description: 'Muted text', cssVar: '--muted-foreground', category: 'utility' },
  border: { name: 'Border', description: 'Border color', cssVar: '--border', category: 'utility' },
  input: { name: 'Input', description: 'Input border color', cssVar: '--input', category: 'utility' },
  ring: { name: 'Ring', description: 'Focus ring color', cssVar: '--ring', category: 'utility' },
  
  // Chart colors (from your theme)
  chart1: { name: 'Chart 1', description: 'First chart color', cssVar: '--chart-1', category: 'charts' },
  chart2: { name: 'Chart 2', description: 'Second chart color', cssVar: '--chart-2', category: 'charts' },
  chart3: { name: 'Chart 3', description: 'Third chart color', cssVar: '--chart-3', category: 'charts' },
  chart4: { name: 'Chart 4', description: 'Fourth chart color', cssVar: '--chart-4', category: 'charts' },
  chart5: { name: 'Chart 5', description: 'Fifth chart color', cssVar: '--chart-5', category: 'charts' },
  
  // Sidebar colors (from your theme)
  sidebar: { name: 'Sidebar', description: 'Sidebar background', cssVar: '--sidebar', category: 'sidebar' },
  sidebarForeground: { name: 'Sidebar Foreground', description: 'Sidebar text', cssVar: '--sidebar-foreground', category: 'sidebar' },
  sidebarPrimary: { name: 'Sidebar Primary', description: 'Sidebar primary color', cssVar: '--sidebar-primary', category: 'sidebar' },
  sidebarPrimaryForeground: { name: 'Sidebar Primary Foreground', description: 'Text on sidebar primary', cssVar: '--sidebar-primary-foreground', category: 'sidebar' },
  sidebarAccent: { name: 'Sidebar Accent', description: 'Sidebar accent color', cssVar: '--sidebar-accent', category: 'sidebar' },
  sidebarAccentForeground: { name: 'Sidebar Accent Foreground', description: 'Text on sidebar accent', cssVar: '--sidebar-accent-foreground', category: 'sidebar' },
  sidebarBorder: { name: 'Sidebar Border', description: 'Sidebar border color', cssVar: '--sidebar-border', category: 'sidebar' },
  sidebarRing: { name: 'Sidebar Ring', description: 'Sidebar focus ring', cssVar: '--sidebar-ring', category: 'sidebar' },
  
  // Custom semantic colors
  success: { name: 'Success', description: 'Success states', cssVar: '--success', category: 'feedback' },
  successForeground: { name: 'Success Foreground', description: 'Text on success', cssVar: '--success-foreground', category: 'feedback' },
  warning: { name: 'Warning', description: 'Warning states', cssVar: '--warning', category: 'feedback' },
  warningForeground: { name: 'Warning Foreground', description: 'Text on warning', cssVar: '--warning-foreground', category: 'feedback' },
} as const;

type ColorSystemKey = typeof COLOR_SYSTEMS[number]['key'];
type MaterialColorKey = keyof typeof MATERIAL_COLORS;
type ShadcnColorKey = keyof typeof SHADCN_COLORS;

// Color mapping state - links ShadCN colors to Material Design colors
type ColorMapping = {
  [K in ShadcnColorKey]: {
    source: 'shadcn' | 'material' | 'custom';
    materialColor?: MaterialColorKey;
    lightTone?: number;
    darkTone?: number;
    customLight?: string;
    customDark?: string;
    isLinked: boolean;
  }
};

// Default color mappings using your current ShadCN theme (con OKLCH values)
const DEFAULT_COLOR_MAPPING: ColorMapping = {
  // Surface colors (from your existing theme)
  background: { source: 'shadcn', customLight: 'oklch(1 0 0)', customDark: 'oklch(0.145 0 0)', isLinked: false },
  foreground: { source: 'shadcn', customLight: 'oklch(0.145 0 0)', customDark: 'oklch(0.985 0 0)', isLinked: false },
  card: { source: 'shadcn', customLight: 'oklch(1 0 0)', customDark: 'oklch(0.205 0 0)', isLinked: false },
  cardForeground: { source: 'shadcn', customLight: 'oklch(0.145 0 0)', customDark: 'oklch(0.985 0 0)', isLinked: false },
  popover: { source: 'shadcn', customLight: 'oklch(1 0 0)', customDark: 'oklch(0.205 0 0)', isLinked: false },
  popoverForeground: { source: 'shadcn', customLight: 'oklch(0.145 0 0)', customDark: 'oklch(0.985 0 0)', isLinked: false },
  
  // Brand colors
  primary: { source: 'shadcn', customLight: 'oklch(0.205 0 0)', customDark: 'oklch(0.922 0 0)', isLinked: false },
  primaryForeground: { source: 'shadcn', customLight: 'oklch(0.985 0 0)', customDark: 'oklch(0.205 0 0)', isLinked: false },
  secondary: { source: 'shadcn', customLight: 'oklch(0.97 0 0)', customDark: 'oklch(0.269 0 0)', isLinked: false },
  secondaryForeground: { source: 'shadcn', customLight: 'oklch(0.205 0 0)', customDark: 'oklch(0.985 0 0)', isLinked: false },
  
  // Accent and feedback
  accent: { source: 'shadcn', customLight: 'oklch(0.97 0 0)', customDark: 'oklch(0.269 0 0)', isLinked: false },
  accentForeground: { source: 'shadcn', customLight: 'oklch(0.205 0 0)', customDark: 'oklch(0.985 0 0)', isLinked: false },
  destructive: { source: 'shadcn', customLight: 'oklch(0.577 0.245 27.325)', customDark: 'oklch(0.704 0.191 22.216)', isLinked: false },
  destructiveForeground: { source: 'shadcn', customLight: 'oklch(0.985 0 0)', customDark: 'oklch(0.145 0 0)', isLinked: false },
  
  // Utility colors
  muted: { source: 'shadcn', customLight: 'oklch(0.97 0 0)', customDark: 'oklch(0.269 0 0)', isLinked: false },
  mutedForeground: { source: 'shadcn', customLight: 'oklch(0.556 0 0)', customDark: 'oklch(0.708 0 0)', isLinked: false },
  border: { source: 'shadcn', customLight: 'oklch(0.922 0 0)', customDark: 'oklch(1 0 0 / 10%)', isLinked: false },
  input: { source: 'shadcn', customLight: 'oklch(0.922 0 0)', customDark: 'oklch(1 0 0 / 15%)', isLinked: false },
  ring: { source: 'shadcn', customLight: 'oklch(0.708 0 0)', customDark: 'oklch(0.556 0 0)', isLinked: false },
  
  // Chart colors (from your theme)
  chart1: { source: 'shadcn', customLight: 'oklch(0.646 0.222 41.116)', customDark: 'oklch(0.488 0.243 264.376)', isLinked: false },
  chart2: { source: 'shadcn', customLight: 'oklch(0.6 0.118 184.704)', customDark: 'oklch(0.696 0.17 162.48)', isLinked: false },
  chart3: { source: 'shadcn', customLight: 'oklch(0.398 0.07 227.392)', customDark: 'oklch(0.769 0.188 70.08)', isLinked: false },
  chart4: { source: 'shadcn', customLight: 'oklch(0.828 0.189 84.429)', customDark: 'oklch(0.627 0.265 303.9)', isLinked: false },
  chart5: { source: 'shadcn', customLight: 'oklch(0.769 0.188 70.08)', customDark: 'oklch(0.645 0.246 16.439)', isLinked: false },
  
  // Sidebar colors (from your theme)
  sidebar: { source: 'shadcn', customLight: 'oklch(0.985 0 0)', customDark: 'oklch(0.205 0 0)', isLinked: false },
  sidebarForeground: { source: 'shadcn', customLight: 'oklch(0.145 0 0)', customDark: 'oklch(0.985 0 0)', isLinked: false },
  sidebarPrimary: { source: 'shadcn', customLight: 'oklch(0.205 0 0)', customDark: 'oklch(0.488 0.243 264.376)', isLinked: false },
  sidebarPrimaryForeground: { source: 'shadcn', customLight: 'oklch(0.985 0 0)', customDark: 'oklch(0.985 0 0)', isLinked: false },
  sidebarAccent: { source: 'shadcn', customLight: 'oklch(0.97 0 0)', customDark: 'oklch(0.269 0 0)', isLinked: false },
  sidebarAccentForeground: { source: 'shadcn', customLight: 'oklch(0.205 0 0)', customDark: 'oklch(0.985 0 0)', isLinked: false },
  sidebarBorder: { source: 'shadcn', customLight: 'oklch(0.922 0 0)', customDark: 'oklch(1 0 0 / 10%)', isLinked: false },
  sidebarRing: { source: 'shadcn', customLight: 'oklch(0.708 0 0)', customDark: 'oklch(0.556 0 0)', isLinked: false },
  
  // Custom semantic colors (can be linked to Material Design or custom)
  success: { source: 'custom', customLight: '#16a34a', customDark: '#22c55e', isLinked: false },
  successForeground: { source: 'custom', customLight: '#ffffff', customDark: '#000000', isLinked: false },
  warning: { source: 'custom', customLight: '#d97706', customDark: '#f59e0b', isLinked: false },
  warningForeground: { source: 'custom', customLight: '#ffffff', customDark: '#000000', isLinked: false },
};

interface ColorEditorProps {
  onChange?: (mapping: ColorMapping) => void;
  onSave?: (mapping: ColorMapping) => void;
  onColorChange?: (colorName: string, newValue: string) => void;
  selectedShadcnColor?: ShadcnColorKey | null;
  onSelectShadcnColor?: (colorKey: ShadcnColorKey | null) => void;
  currentThemeColors?: Record<string, string>;
  forceActiveSystem?: 'shadcn' | 'material' | 'code';
}

export const ColorEditor = ({ 
  onChange, 
  onSave, 
  onColorChange,
  selectedShadcnColor: externalSelectedColor,
  onSelectShadcnColor,
  currentThemeColors = {},
  forceActiveSystem
}: ColorEditorProps) => {
  const [activeSystem, setActiveSystem] = useState<ColorSystemKey | 'code'>('shadcn');
  const [colorMapping, setColorMapping] = useState<ColorMapping>(DEFAULT_COLOR_MAPPING);
  
  // Use forced system or internal state
  const currentActiveSystem = forceActiveSystem || activeSystem;
  
  // Use external state if provided, otherwise use internal state
  const selectedShadcnColor = externalSelectedColor ?? null;
  const setSelectedShadcnColor = onSelectShadcnColor ?? (() => {});

  // Create dynamic Material Design colors based on current theme
  const getDynamicMaterialColors = useCallback(() => {
    return {
      primary: {
        base: currentThemeColors.primary || MATERIAL_COLORS.primary.scale[40],
        onColor: currentThemeColors.primaryForeground || MATERIAL_COLORS.primary.scale[100],
        container: currentThemeColors.secondary || MATERIAL_COLORS.primary.scale[90],
        onContainer: currentThemeColors.secondaryForeground || MATERIAL_COLORS.primary.scale[10],
      },
      secondary: {
        base: currentThemeColors.accent || MATERIAL_COLORS.secondary.scale[40],
        onColor: currentThemeColors.accentForeground || MATERIAL_COLORS.secondary.scale[100],
        container: currentThemeColors.muted || MATERIAL_COLORS.secondary.scale[90],
        onContainer: currentThemeColors.mutedForeground || MATERIAL_COLORS.secondary.scale[10],
      },
      tertiary: {
        base: currentThemeColors.chart1 || MATERIAL_COLORS.tertiary.scale[40],
        onColor: currentThemeColors.background || MATERIAL_COLORS.tertiary.scale[100],
        container: currentThemeColors.chart2 || MATERIAL_COLORS.tertiary.scale[90],
        onContainer: currentThemeColors.foreground || MATERIAL_COLORS.tertiary.scale[10],
      },
      error: {
        base: currentThemeColors.destructive || MATERIAL_COLORS.error.scale[40],
        onColor: currentThemeColors.destructiveForeground || MATERIAL_COLORS.error.scale[100],
        container: currentThemeColors.chart5 || MATERIAL_COLORS.error.scale[90],
        onContainer: currentThemeColors.foreground || MATERIAL_COLORS.error.scale[10],
      },
      neutral: {
        background: currentThemeColors.background || MATERIAL_COLORS.neutral.scale[99],
        onBackground: currentThemeColors.foreground || MATERIAL_COLORS.neutral.scale[10],
        surface: currentThemeColors.card || MATERIAL_COLORS.neutral.scale[99],
        onSurface: currentThemeColors.cardForeground || MATERIAL_COLORS.neutral.scale[10],
      },
      neutralVariant: {
        surfaceVariant: currentThemeColors.muted || MATERIAL_COLORS.neutralVariant.scale[90],
        onSurfaceVariant: currentThemeColors.mutedForeground || MATERIAL_COLORS.neutralVariant.scale[30],
        outline: currentThemeColors.border || MATERIAL_COLORS.neutralVariant.scale[50],
        outlineVariant: currentThemeColors.input || MATERIAL_COLORS.neutralVariant.scale[80],
      }
    };
  }, [currentThemeColors]);
  
  // Estados para controlar qué colores incluir en el CSS (tu estructura ShadCN actual)
  const [includeColors, setIncludeColors] = useState({
    // Surface colors
    background: true,
    foreground: true,
    card: true,
    cardForeground: true,
    popover: true,
    popoverForeground: true,
    
    // Brand colors
    primary: true,
    primaryForeground: true,
    secondary: true,
    secondaryForeground: true,
    
    // Accent and feedback
    accent: true,
    accentForeground: true,
    destructive: true,
    destructiveForeground: true,
    
    // Utility colors
    muted: true,
    mutedForeground: true,
    border: true,
    input: true,
    ring: true,
    
    // Chart colors
    chart1: true,
    chart2: true,
    chart3: true,
    chart4: true,
    chart5: true,
    
    // Sidebar colors
    sidebar: true,
    sidebarForeground: true,
    sidebarPrimary: true,
    sidebarPrimaryForeground: true,
    sidebarAccent: true,
    sidebarAccentForeground: true,
    sidebarBorder: true,
    sidebarRing: true,
    
    // Custom semantic colors
    success: true,
    successForeground: true,
    warning: true,
    warningForeground: true,
  });

  // Toggle linking for a specific color
  const toggleColorLink = (colorKey: ShadcnColorKey) => {
    setColorMapping(prev => ({
      ...prev,
      [colorKey]: {
        ...prev[colorKey],
        isLinked: !prev[colorKey].isLinked
      }
    }));
  };

  // Update color mapping
  const updateColorMapping = (
    colorKey: ShadcnColorKey, 
    updates: Partial<ColorMapping[ShadcnColorKey]>
  ) => {
    setColorMapping(prev => ({
      ...prev,
      [colorKey]: {
        ...prev[colorKey],
        ...updates
      }
    }));
  };

  // Reset all colors to default mapping
  const resetAllColors = () => {
    setColorMapping(DEFAULT_COLOR_MAPPING);
  };

  // Reset specific color to default
  const resetColor = (colorKey: ShadcnColorKey) => {
    setColorMapping(prev => ({
      ...prev,
      [colorKey]: DEFAULT_COLOR_MAPPING[colorKey]
    }));
  };

  // Link ShadCN color to Material Design color with specific tone
  const linkToMaterialColor = (
    shadcnColor: ShadcnColorKey, 
    materialColor: MaterialColorKey, 
    lightTone: number,
    darkTone: number
  ) => {
    // Update the mapping
    setColorMapping(prev => ({
      ...prev,
      [shadcnColor]: {
        ...prev[shadcnColor],
        source: 'material',
        materialColor,
        lightTone,
        darkTone,
        isLinked: true
      }
    }));

    // Immediately sync with theme system if onColorChange is provided
    if (onColorChange && includeColors[shadcnColor]) {
      const materialColorData = MATERIAL_COLORS[materialColor];
      const hexValue = materialColorData.scale[lightTone as keyof typeof materialColorData.scale];
      onColorChange(shadcnColor, hexValue);
    }
  };

  // Get color value from mapping
  const getColorValue = useCallback((colorKey: ShadcnColorKey, theme: 'light' | 'dark'): string => {
    const mapping = colorMapping[colorKey];
    
    if (mapping.source === 'shadcn' || mapping.source === 'custom') {
      return theme === 'light' ? mapping.customLight || '#000000' : mapping.customDark || '#ffffff';
    }
    
    if (mapping.source === 'material' && mapping.materialColor) {
      const tone = theme === 'light' ? mapping.lightTone : mapping.darkTone;
      return MATERIAL_COLORS[mapping.materialColor].scale[tone as keyof typeof MATERIAL_COLORS[typeof mapping.materialColor]['scale']] || '#000000';
    }
    
    // Fallback
    return theme === 'light' ? '#000000' : '#ffffff';
  }, [colorMapping]);

  // Generate CSS for export
  const generateColorCSS = useCallback(() => {
    let css = '/* Color System - Generated by Alkitu Theme Editor */\\n';
    css += '/* Dynamic color mapping between ShadCN and Material Design 3 */\\n\\n';
    
    // Light theme
    css += ':root {\\n';
    Object.entries(SHADCN_COLORS).forEach(([key, config]) => {
      if (includeColors[key as ShadcnColorKey]) {
        const lightValue = getColorValue(key as ShadcnColorKey, 'light');
        css += `  ${config.cssVar}: ${lightValue}; /* ${config.description} */\\n`;
      }
    });
    css += '}\\n\\n';
    
    // Dark theme
    css += '@media (prefers-color-scheme: dark) {\\n';
    css += '  :root {\\n';
    Object.entries(SHADCN_COLORS).forEach(([key, config]) => {
      if (includeColors[key as ShadcnColorKey]) {
        const darkValue = getColorValue(key as ShadcnColorKey, 'dark');
        css += `    ${config.cssVar}: ${darkValue}; /* ${config.description} */\\n`;
      }
    });
    css += '  }\\n';
    css += '}\\n\\n';
    
    // Usage instructions
    css += '/* USAGE INSTRUCTIONS:\\n';
    css += ' * Use CSS variables for consistent theming:\\n';
    css += ' * - background-color: hsl(var(--primary));\\n';
    css += ' * - color: hsl(var(--primary-foreground));\\n';
    css += ' * - border-color: hsl(var(--border));\\n';
    css += ' * \\n';
    css += ' * For Tailwind classes:\\n';
    css += ' * - bg-primary text-primary-foreground\\n';
    css += ' * - bg-secondary text-secondary-foreground\\n';
    css += ' * - border-border text-foreground\\n';
    css += ' */\\n';
    
    return css.split('\\n').map((line, i) => (
      <div key={i} className={line.startsWith('/*') || line.startsWith('@media') || line.startsWith('}') ? 'text-green-600' : ''}>
        {line}
      </div>
    ));
  }, [colorMapping, includeColors, getColorValue]);

  // Export CSS as file
  const exportColorCSS = () => {
    const cssText = generateColorCSS().map(element => element.props.children).join('\\n');
    const blob = new Blob([cssText], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-system.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Apply CSS variables through theme context instead of direct DOM manipulation
  const applyCSSVariables = useCallback(() => {
    const colorUpdates: Record<string, string> = {};
    
    Object.entries(SHADCN_COLORS).forEach(([key, config]) => {
      if (includeColors[key as ShadcnColorKey]) {
        const lightValue = getColorValue(key as ShadcnColorKey, 'light');
        
        // Extract CSS variable name without the '--' prefix
        const varName = config.cssVar.replace('--', '');
        colorUpdates[varName] = lightValue;
      }
    });
    
    // Use theme context to update colors instead of direct DOM manipulation
    if (Object.keys(colorUpdates).length > 0) {
      // This will be handled by the DynamicThemeProvider
      onChange?.(colorMapping);
    }
  }, [colorMapping, includeColors, getColorValue, onChange]);

  // Notify changes and apply CSS variables
  useEffect(() => {
    applyCSSVariables();
    onChange?.(colorMapping);
  }, [colorMapping, includeColors, applyCSSVariables, onChange]);

  // Render content based on active system
  const renderContent = (system: string) => {
    switch (system) {
      case 'material':
        return renderMaterialDesignContent();
      case 'code':
        return renderCodeContent();
      case 'shadcn':
      default:
        return renderShadCNContent();
    }
  };

  const renderMaterialDesignContent = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Material Design 3 Color System</span>
          {selectedShadcnColor && (
            <Badge variant="outline" className="text-xs">
              Vinculando: {SHADCN_COLORS[selectedShadcnColor].name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color Selection Instructions */}
        {!selectedShadcnColor ? (
          <div className="bg-muted/50 p-4 rounded-lg border-2 border-dashed">
            <p className="text-sm text-muted-foreground text-center">
              Ve al tab &quot;ShadCN + TailwindCSS v4&quot; y haz clic en el botón MD3 de un color para empezar a vincularlo con Material Design 3.
            </p>
          </div>
        ) : (
          <div className="bg-primary/10 p-4 rounded-lg border">
            <p className="text-sm font-medium mb-2">
              Selecciona un color de Material Design 3 para vincular con &quot;{SHADCN_COLORS[selectedShadcnColor].name}&quot;
            </p>
            <p className="text-xs text-muted-foreground">
              Haz clic en cualquier color de la paleta para crear la vinculación.
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-2"
              onClick={() => setSelectedShadcnColor(null)}
            >
              Cancelar vinculación
            </Button>
          </div>
        )}

        {/* Light Theme Color Relationships */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Light Theme</h4>
          
          {/* Primary Colors Row */}
          <div className="grid grid-cols-4 gap-2">
            {(() => {
              const dynamicColors = getDynamicMaterialColors();
              return (
                <>
                  <div className="space-y-1">
                    <div 
                      className={`w-full h-16 rounded flex items-center justify-center text-white text-xs font-medium transition-all cursor-pointer hover:scale-105 ${
                        selectedShadcnColor ? 'ring-2 ring-primary/20 hover:ring-primary/50' : ''
                      }`}
                      style={{ backgroundColor: dynamicColors.primary.base }}
                      onClick={() => {
                        if (selectedShadcnColor) {
                          const hexValue = dynamicColors.primary.base;
                          onColorChange?.(selectedShadcnColor, hexValue);
                          setSelectedShadcnColor(null);
                        }
                      }}
                      title={selectedShadcnColor ? `Vincular con ${SHADCN_COLORS[selectedShadcnColor].name}` : 'Primary color from current theme'}
                    >
                      Primary
                    </div>
                    <div className="text-xs text-center">Theme Primary</div>
                  </div>
                  <div className="space-y-1">
                    <div 
                      className={`w-full h-16 rounded flex items-center justify-center text-xs font-medium transition-all cursor-pointer hover:scale-105 ${
                        selectedShadcnColor ? 'ring-2 ring-primary/20 hover:ring-primary/50' : ''
                      }`}
                      style={{ 
                        backgroundColor: dynamicColors.primary.onColor, 
                        color: dynamicColors.primary.base 
                      }}
                      onClick={() => {
                        if (selectedShadcnColor) {
                          const hexValue = dynamicColors.primary.onColor;
                          onColorChange?.(selectedShadcnColor, hexValue);
                          setSelectedShadcnColor(null);
                        }
                      }}
                      title={selectedShadcnColor ? `Vincular con ${SHADCN_COLORS[selectedShadcnColor].name}` : 'Primary foreground from current theme'}
                    >
                      On Primary
                    </div>
                    <div className="text-xs text-center">Primary Foreground</div>
                  </div>
                  <div className="space-y-1">
                    <div 
                      className={`w-full h-16 rounded flex items-center justify-center text-xs font-medium transition-all cursor-pointer hover:scale-105 ${
                        selectedShadcnColor ? 'ring-2 ring-primary/20 hover:ring-primary/50' : ''
                      }`}
                      style={{ 
                        backgroundColor: dynamicColors.primary.container, 
                        color: dynamicColors.primary.onContainer 
                      }}
                      onClick={() => {
                        if (selectedShadcnColor) {
                          const hexValue = dynamicColors.primary.container;
                          onColorChange?.(selectedShadcnColor, hexValue);
                          setSelectedShadcnColor(null);
                        }
                      }}
                      title={selectedShadcnColor ? `Vincular con ${SHADCN_COLORS[selectedShadcnColor].name}` : 'Secondary from current theme'}
                    >
                      Primary Container
                    </div>
                    <div className="text-xs text-center">Theme Secondary</div>
                  </div>
                  <div className="space-y-1">
                    <div 
                      className={`w-full h-16 rounded flex items-center justify-center text-xs font-medium transition-all cursor-pointer hover:scale-105 ${
                        selectedShadcnColor ? 'ring-2 ring-primary/20 hover:ring-primary/50' : ''
                      }`}
                      style={{ 
                        backgroundColor: dynamicColors.primary.onContainer,
                        color: dynamicColors.primary.container
                      }}
                      onClick={() => {
                        if (selectedShadcnColor) {
                          const hexValue = dynamicColors.primary.onContainer;
                          onColorChange?.(selectedShadcnColor, hexValue);
                          setSelectedShadcnColor(null);
                        }
                      }}
                      title={selectedShadcnColor ? `Vincular con ${SHADCN_COLORS[selectedShadcnColor].name}` : 'Secondary foreground from current theme'}
                    >
                      On Primary Container
                    </div>
                    <div className="text-xs text-center">Secondary Foreground</div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Background and Surface Colors Row */}
          <div className="grid grid-cols-4 gap-2">
            {(() => {
              const dynamicColors = getDynamicMaterialColors();
              return (
                <>
                  <div className="space-y-1">
                    <div 
                      className={`w-full h-16 rounded flex items-center justify-center text-xs font-medium transition-all cursor-pointer hover:scale-105 ${
                        selectedShadcnColor ? 'ring-2 ring-primary/20 hover:ring-primary/50' : ''
                      }`}
                      style={{ 
                        backgroundColor: dynamicColors.neutral.background, 
                        color: dynamicColors.neutral.onBackground 
                      }}
                      onClick={() => {
                        if (selectedShadcnColor) {
                          const hexValue = dynamicColors.neutral.background;
                          onColorChange?.(selectedShadcnColor, hexValue);
                          setSelectedShadcnColor(null);
                        }
                      }}
                      title={selectedShadcnColor ? `Vincular con ${SHADCN_COLORS[selectedShadcnColor].name}` : 'Background from current theme'}
                    >
                      Background
                    </div>
                    <div className="text-xs text-center">Theme Background</div>
                  </div>
                  <div className="space-y-1">
                    <div 
                      className={`w-full h-16 rounded flex items-center justify-center text-xs font-medium transition-all cursor-pointer hover:scale-105 ${
                        selectedShadcnColor ? 'ring-2 ring-primary/20 hover:ring-primary/50' : ''
                      }`}
                      style={{ 
                        backgroundColor: dynamicColors.neutral.onBackground,
                        color: dynamicColors.neutral.background 
                      }}
                      onClick={() => {
                        if (selectedShadcnColor) {
                          const hexValue = dynamicColors.neutral.onBackground;
                          onColorChange?.(selectedShadcnColor, hexValue);
                          setSelectedShadcnColor(null);
                        }
                      }}
                      title={selectedShadcnColor ? `Vincular con ${SHADCN_COLORS[selectedShadcnColor].name}` : 'Foreground from current theme'}
                    >
                      On Background
                    </div>
                    <div className="text-xs text-center">Theme Foreground</div>
                  </div>
                  <div className="space-y-1">
                    <div 
                      className={`w-full h-16 rounded flex items-center justify-center text-xs font-medium transition-all cursor-pointer hover:scale-105 ${
                        selectedShadcnColor ? 'ring-2 ring-primary/20 hover:ring-primary/50' : ''
                      }`}
                      style={{ 
                        backgroundColor: dynamicColors.neutral.surface, 
                        color: dynamicColors.neutral.onSurface 
                      }}
                      onClick={() => {
                        if (selectedShadcnColor) {
                          const hexValue = dynamicColors.neutral.surface;
                          onColorChange?.(selectedShadcnColor, hexValue);
                          setSelectedShadcnColor(null);
                        }
                      }}
                      title={selectedShadcnColor ? `Vincular con ${SHADCN_COLORS[selectedShadcnColor].name}` : 'Card from current theme'}
                    >
                      Surface
                    </div>
                    <div className="text-xs text-center">Theme Card</div>
                  </div>
                  <div className="space-y-1">
                    <div 
                      className={`w-full h-16 rounded flex items-center justify-center text-xs font-medium transition-all cursor-pointer hover:scale-105 ${
                        selectedShadcnColor ? 'ring-2 ring-primary/20 hover:ring-primary/50' : ''
                      }`}
                      style={{ 
                        backgroundColor: dynamicColors.neutral.onSurface,
                        color: dynamicColors.neutral.surface 
                      }}
                      onClick={() => {
                        if (selectedShadcnColor) {
                          const hexValue = dynamicColors.neutral.onSurface;
                          onColorChange?.(selectedShadcnColor, hexValue);
                          setSelectedShadcnColor(null);
                        }
                      }}
                      title={selectedShadcnColor ? `Vincular con ${SHADCN_COLORS[selectedShadcnColor].name}` : 'Card foreground from current theme'}
                    >
                      On Surface
                    </div>
                    <div className="text-xs text-center">Card Foreground</div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCodeContent = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Sistema de Colores CSS - Exportación Completa</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={exportColorCSS}>
              <Download className="w-4 h-4 mr-1" />
              Exportar color-system.css
            </Button>
            <Button size="sm" onClick={() => onSave?.(colorMapping)}>
              <Save className="w-4 h-4 mr-1" />
              Guardar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Switches para controlar qué colores incluir */}
        <div>
          <div className="text-sm font-medium mb-3">Colores a incluir en CSS:</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(SHADCN_COLORS).map(([colorKey, colorConfig]) => (
              <div key={colorKey} className="flex items-center space-x-2">
                <Switch
                  id={colorKey}
                  checked={includeColors[colorKey as ShadcnColorKey]}
                  onCheckedChange={(checked) => 
                    setIncludeColors(prev => ({ ...prev, [colorKey]: checked }))
                  }
                />
                <Label htmlFor={colorKey} className="text-sm flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded border" 
                    style={{ backgroundColor: getColorValue(colorKey as ShadcnColorKey, 'light') }}
                  />
                  {colorConfig.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* CSS Preview Completo */}
        <div className="bg-muted p-4 rounded text-xs font-mono space-y-1 max-h-96 overflow-y-auto">
          {generateColorCSS()}
        </div>
      </CardContent>
    </Card>
  );

  const renderShadCNContent = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>ShadCN/UI Color System</span>
          <Badge variant="secondary">Base System</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          ShadCN content would go here if needed
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 py-4">
      {!forceActiveSystem && (
        <>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Editor de Colores Dinámico</h2>
              <p className="text-muted-foreground">
                Vincula colores entre ShadCN/UI y Material Design 3. Exporta un sistema de colores cohesivo.
              </p>
            </div>
            
            {/* Reset Global */}
            <Button
              variant="outline"
              size="sm"
              onClick={resetAllColors}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Todo
            </Button>
          </div>

          {/* Sistemas de Color como Tabs */}
          <Tabs value={activeSystem} onValueChange={(value) => setActiveSystem(value as ColorSystemKey | 'code')}>
            <TabsList className="grid w-full grid-cols-3">
              {COLOR_SYSTEMS.map((system) => {
                const Icon = system.icon;
                return (
                  <TabsTrigger key={system.key} value={system.key} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {system.name}
                  </TabsTrigger>
                );
              })}
              {/* Tab Code Global */}
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Code
              </TabsTrigger>
            </TabsList>
            
            {/* Tab Contents */}
            <TabsContent value="shadcn" className="space-y-6">
              {renderShadCNContent()}
            </TabsContent>

            <TabsContent value="material" className="space-y-6">
              {renderMaterialDesignContent()}
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              {renderCodeContent()}
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {/* When forced system is specified, show only that content */}
      {forceActiveSystem && renderContent(currentActiveSystem)}
    </div>
  );
};