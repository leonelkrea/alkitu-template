#!/usr/bin/env npx tsx

/**
 * Script to migrate missing themes from tweakcn registry to our predefined-themes.ts
 * Maintains our existing structure and converts colors to OKLCH format
 */

import fs from 'fs';
import path from 'path';

// Color conversion utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}

function rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
  // Normalize RGB values
  r = r / 255;
  g = g / 255;
  b = b / 255;
  
  // Remove gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  
  // Linear RGB to OKLab
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b_lab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  
  // Convert to LCH
  const c = Math.sqrt(a * a + b_lab * b_lab);
  let h = Math.atan2(b_lab, a) * 180 / Math.PI;
  if (h < 0) h += 360;
  
  return { l: L, c, h };
}

function hexToOklch(hex: string): string {
  const rgb = hexToRgb(hex);
  const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
  
  const l = (oklch.l).toFixed(2);
  const c = oklch.c.toFixed(3);
  const h = Math.round(oklch.h);
  
  return `oklch(${l} ${c} ${h})`;
}

// Theme categorization
const THEME_CATEGORIES: Record<string, 'popular' | 'nature' | 'corporate' | 'creative' | 'monochrome' | 'specialty'> = {
  'bubblegum': 'popular',
  't3-chat': 'popular',
  'mocha-mousse': 'popular',
  'doom-64': 'popular',
  'nature': 'nature',
  'kodama-grove': 'nature',
  'cosmic-night': 'nature',
  'tangerine': 'creative',
  'quantum-rose': 'creative',
  'bold-tech': 'creative',
  'elegant-luxury': 'creative',
  'amber-minimal': 'creative',
  'solar-dusk': 'creative',
  'claymorphism': 'creative',
  'pastel-dreams': 'creative',
  'midnight-bloom': 'creative',
  'candyland': 'creative',
  'northern-lights': 'creative',
  'graphite': 'specialty',
  'perpetuity': 'specialty',
  'clean-slate': 'specialty',
  'caffeine': 'specialty'
};

// Missing themes that need to be migrated
const MISSING_THEMES = [
  'bubblegum', 't3-chat', 'mocha-mousse', 'doom-64', 'graphite', 'perpetuity',
  'kodama-grove', 'cosmic-night', 'tangerine', 'quantum-rose', 'nature',
  'bold-tech', 'elegant-luxury', 'amber-minimal', 'solar-dusk', 'claymorphism',
  'pastel-dreams', 'clean-slate', 'caffeine', 'midnight-bloom', 'candyland',
  'northern-lights'
];

function convertColorValue(value: string): string {
  if (value.startsWith('#')) {
    return hexToOklch(value);
  }
  if (value.includes('oklch(')) {
    return value;
  }
  return value;
}

function formatThemeName(id: string): string {
  return id.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function generateThemeTemplate(theme: any): string {
  const category = THEME_CATEGORIES[theme.name] || 'specialty';
  const displayName = formatThemeName(theme.name);
  
  // Extract colors from theme and convert to OKLCH
  const colors = theme.cssVars || {};
  const lightColors = colors.light || {};
  const darkColors = colors.dark || {};
  
  // Main colors (fallback to reasonable defaults if not found)
  const primary = convertColorValue(lightColors.primary || '#3b82f6');
  const secondary = convertColorValue(lightColors.secondary || '#64748b');
  const accent = convertColorValue(lightColors.accent || '#8b5cf6');
  const background = convertColorValue(lightColors.background || '#ffffff');
  const foreground = convertColorValue(lightColors.foreground || '#020817');
  
  return `  {
    id: '${theme.name}',
    name: '${displayName}',
    category: '${category}',
    colors: {
      primary: '${primary}',
      secondary: '${secondary}',
      accent: '${accent}',
      background: '${background}',
      foreground: '${foreground}',
    },
    lightModeConfig: {
      // Base colors
      background: '${convertColorValue(lightColors.background || '#ffffff')}',
      foreground: '${convertColorValue(lightColors.foreground || '#020817')}',
      card: '${convertColorValue(lightColors.card || '#ffffff')}',
      'card-foreground': '${convertColorValue(lightColors['card-foreground'] || '#020817')}',
      popover: '${convertColorValue(lightColors.popover || '#ffffff')}',
      'popover-foreground': '${convertColorValue(lightColors['popover-foreground'] || '#020817')}',

      // Primary colors
      primary: '${convertColorValue(lightColors.primary || '#3b82f6')}',
      'primary-foreground': '${convertColorValue(lightColors['primary-foreground'] || '#ffffff')}',

      // Secondary colors
      secondary: '${convertColorValue(lightColors.secondary || '#f1f5f9')}',
      'secondary-foreground': '${convertColorValue(lightColors['secondary-foreground'] || '#0f172a')}',

      // Muted colors
      muted: '${convertColorValue(lightColors.muted || '#f1f5f9')}',
      'muted-foreground': '${convertColorValue(lightColors['muted-foreground'] || '#64748b')}',

      // Accent colors
      accent: '${convertColorValue(lightColors.accent || '#f1f5f9')}',
      'accent-foreground': '${convertColorValue(lightColors['accent-foreground'] || '#0f172a')}',

      // Destructive colors
      destructive: '${convertColorValue(lightColors.destructive || '#ef4444')}',
      'destructive-foreground': '${convertColorValue(lightColors['destructive-foreground'] || '#ffffff')}',

      // Border and input
      border: '${convertColorValue(lightColors.border || '#e2e8f0')}',
      input: '${convertColorValue(lightColors.input || '#e2e8f0')}',
      ring: '${convertColorValue(lightColors.ring || '#3b82f6')}',

      // Chart colors
      'chart-1': '${convertColorValue(lightColors['chart-1'] || '#3b82f6')}',
      'chart-2': '${convertColorValue(lightColors['chart-2'] || '#10b981')}',
      'chart-3': '${convertColorValue(lightColors['chart-3'] || '#f59e0b')}',
      'chart-4': '${convertColorValue(lightColors['chart-4'] || '#ef4444')}',
      'chart-5': '${convertColorValue(lightColors['chart-5'] || '#8b5cf6')}',

      // Sidebar colors
      sidebar: '${convertColorValue(lightColors.sidebar || lightColors.card || '#ffffff')}',
      'sidebar-foreground': '${convertColorValue(lightColors['sidebar-foreground'] || lightColors.foreground || '#020817')}',
      'sidebar-primary': '${convertColorValue(lightColors['sidebar-primary'] || lightColors.primary || '#3b82f6')}',
      'sidebar-primary-foreground': '${convertColorValue(lightColors['sidebar-primary-foreground'] || lightColors['primary-foreground'] || '#ffffff')}',
      'sidebar-accent': '${convertColorValue(lightColors['sidebar-accent'] || lightColors.accent || '#f1f5f9')}',
      'sidebar-accent-foreground': '${convertColorValue(lightColors['sidebar-accent-foreground'] || lightColors['accent-foreground'] || '#0f172a')}',
      'sidebar-border': '${convertColorValue(lightColors['sidebar-border'] || lightColors.border || '#e2e8f0')}',
      'sidebar-ring': '${convertColorValue(lightColors['sidebar-ring'] || lightColors.ring || '#3b82f6')}',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '-0.025em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': '${convertColorValue(lightColors['shadow-color'] || '#020817')}',
      'shadow-opacity': '0.05',
      'shadow-blur': '10px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '4px',
    },
    darkModeConfig: {
      // Base colors
      background: '${convertColorValue(darkColors.background || '#020817')}',
      foreground: '${convertColorValue(darkColors.foreground || '#f8fafc')}',
      card: '${convertColorValue(darkColors.card || '#020817')}',
      'card-foreground': '${convertColorValue(darkColors['card-foreground'] || '#f8fafc')}',
      popover: '${convertColorValue(darkColors.popover || '#020817')}',
      'popover-foreground': '${convertColorValue(darkColors['popover-foreground'] || '#f8fafc')}',

      // Primary colors
      primary: '${convertColorValue(darkColors.primary || '#3b82f6')}',
      'primary-foreground': '${convertColorValue(darkColors['primary-foreground'] || '#ffffff')}',

      // Secondary colors
      secondary: '${convertColorValue(darkColors.secondary || '#1e293b')}',
      'secondary-foreground': '${convertColorValue(darkColors['secondary-foreground'] || '#f8fafc')}',

      // Muted colors
      muted: '${convertColorValue(darkColors.muted || '#1e293b')}',
      'muted-foreground': '${convertColorValue(darkColors['muted-foreground'] || '#94a3b8')}',

      // Accent colors
      accent: '${convertColorValue(darkColors.accent || '#1e293b')}',
      'accent-foreground': '${convertColorValue(darkColors['accent-foreground'] || '#f8fafc')}',

      // Destructive colors
      destructive: '${convertColorValue(darkColors.destructive || '#ef4444')}',
      'destructive-foreground': '${convertColorValue(darkColors['destructive-foreground'] || '#ffffff')}',

      // Border and input
      border: '${convertColorValue(darkColors.border || '#1e293b')}',
      input: '${convertColorValue(darkColors.input || '#1e293b')}',
      ring: '${convertColorValue(darkColors.ring || '#3b82f6')}',

      // Chart colors
      'chart-1': '${convertColorValue(darkColors['chart-1'] || '#3b82f6')}',
      'chart-2': '${convertColorValue(darkColors['chart-2'] || '#10b981')}',
      'chart-3': '${convertColorValue(darkColors['chart-3'] || '#f59e0b')}',
      'chart-4': '${convertColorValue(darkColors['chart-4'] || '#ef4444')}',
      'chart-5': '${convertColorValue(darkColors['chart-5'] || '#8b5cf6')}',

      // Sidebar colors
      sidebar: '${convertColorValue(darkColors.sidebar || darkColors.card || '#020817')}',
      'sidebar-foreground': '${convertColorValue(darkColors['sidebar-foreground'] || darkColors.foreground || '#f8fafc')}',
      'sidebar-primary': '${convertColorValue(darkColors['sidebar-primary'] || darkColors.primary || '#3b82f6')}',
      'sidebar-primary-foreground': '${convertColorValue(darkColors['sidebar-primary-foreground'] || darkColors['primary-foreground'] || '#ffffff')}',
      'sidebar-accent': '${convertColorValue(darkColors['sidebar-accent'] || darkColors.accent || '#1e293b')}',
      'sidebar-accent-foreground': '${convertColorValue(darkColors['sidebar-accent-foreground'] || darkColors['accent-foreground'] || '#f8fafc')}',
      'sidebar-border': '${convertColorValue(darkColors['sidebar-border'] || darkColors.border || '#1e293b')}',
      'sidebar-ring': '${convertColorValue(darkColors['sidebar-ring'] || darkColors.ring || '#3b82f6')}',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '-0.025em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': '${convertColorValue(darkColors['shadow-color'] || '#000000')}',
      'shadow-opacity': '0.3',
      'shadow-blur': '20px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '8px',
    },
  }`;
}

async function main() {
  console.log('🎨 Migrating missing themes from tweakcn registry...\n');
  
  // Read tweakcn registry
  const registryPath = '/Users/luiseurdanetamartucci/Desktop/INSIDE/Alkitu-template/packages/tweakcn/public/r/registry.json';
  const registryContent = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  
  // Find missing themes in registry
  const themesToMigrate = registryContent.items.filter((item: any) => 
    item.type === 'registry:style' && MISSING_THEMES.includes(item.name)
  );
  
  console.log(`Found ${themesToMigrate.length} themes to migrate:`);
  themesToMigrate.forEach((theme: any) => console.log(`- ${theme.name}`));
  console.log();
  
  // Generate theme definitions
  const newThemeDefinitions: string[] = [];
  
  for (const theme of themesToMigrate) {
    console.log(`🔄 Processing theme: ${theme.name}`);
    const themeDefinition = generateThemeTemplate(theme);
    newThemeDefinitions.push(themeDefinition);
  }
  
  // Read current predefined-themes.ts
  const themesFilePath = '/Users/luiseurdanetamartucci/Desktop/INSIDE/Alkitu-template/packages/web/src/lib/predefined-themes.ts';
  let themesContent = fs.readFileSync(themesFilePath, 'utf-8');
  
  // Create backup
  const backupPath = themesFilePath + '.backup.' + Date.now();
  fs.writeFileSync(backupPath, themesContent);
  console.log(`💾 Backup created: ${backupPath}`);
  
  // Find the exact line with the closing ];
  const lines = themesContent.split('\n');
  let insertionLineIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === '];' && i >= 2296) { // The array closing should be at line 2297 (index 2296)
      insertionLineIndex = i;
      console.log(`Found closing ]; at line ${i + 1}`);
      break;
    }
  }
  
  if (insertionLineIndex === -1) {
    console.error('❌ Could not find PREDEFINED_THEMES array closing');
    // Debug: show lines around where we expect it
    for (let i = 2290; i < 2300 && i < lines.length; i++) {
      console.log(`Line ${i + 1}: "${lines[i]}"`);
    }
    return;
  }
  
  // Insert the new themes before the closing ];
  const newThemeLines = newThemeDefinitions.map(def => def + ',').join('\n\n').split('\n');
  
  // Add a comma after the last existing theme and insert new themes
  lines[insertionLineIndex - 1] += ',';
  lines.splice(insertionLineIndex, 0, '', ...newThemeLines);
  
  const updatedContent = lines.join('\n');
  
  // Write updated content
  fs.writeFileSync(themesFilePath, updatedContent);
  
  console.log('✅ Successfully migrated themes to predefined-themes.ts');
  console.log(`📊 Summary:`);
  console.log(`- Themes migrated: ${themesToMigrate.length}`);
  console.log(`- All colors converted to OKLCH format`);
  console.log(`- Backup created: ${path.basename(backupPath)}`);
  console.log(`- File updated: ${themesFilePath}`);
}

if (require.main === module) {
  main().catch(console.error);
}

export { generateThemeTemplate, THEME_CATEGORIES };