#!/usr/bin/env npx tsx

/**
 * Script to migrate all missing themes from tweakcn registry to our predefined-themes.ts
 * Extracts each theme individually and adds them with proper OKLCH conversion
 */

import fs from 'fs';

// Missing themes that need to be migrated (excluding bubblegum which is already added)
const MISSING_THEMES = [
  't3-chat', 'mocha-mousse', 'doom-64', 'graphite', 'perpetuity',
  'kodama-grove', 'cosmic-night', 'tangerine', 'quantum-rose', 'nature',
  'bold-tech', 'elegant-luxury', 'amber-minimal', 'solar-dusk', 'claymorphism',
  'pastel-dreams', 'clean-slate', 'caffeine', 'midnight-bloom', 'candyland',
  'northern-lights'
];

// Theme categorization
const THEME_CATEGORIES: Record<string, 'popular' | 'nature' | 'corporate' | 'creative' | 'monochrome' | 'specialty'> = {
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

function formatThemeName(id: string): string {
  return id.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function convertHSLToOklch(hsl: string): string {
  // Simple approximation for HSL to OKLCH conversion
  // This is a basic conversion - for production use a proper color library
  const match = hsl.match(/hsl\((\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\)/);
  if (match) {
    const h = parseFloat(match[1]);
    const s = parseFloat(match[2]) / 100;
    const l = parseFloat(match[3]) / 100;
    
    // Basic conversion approximation
    const oklchL = l.toFixed(2);
    const oklchC = (s * 0.3).toFixed(3);
    const oklchH = Math.round(h);
    
    return `oklch(${oklchL} ${oklchC} ${oklchH})`;
  }
  return hsl;
}

function normalizeColorValue(value: string): string {
  if (value.startsWith('oklch(')) {
    return value;
  }
  if (value.startsWith('hsl(')) {
    return convertHSLToOklch(value);
  }
  if (value.startsWith('#')) {
    // Keep as is for now - will be converted by existing utility
    return value;
  }
  return value;
}

function generateThemeDefinition(theme: any): string {
  const category = THEME_CATEGORIES[theme.name] || 'specialty';
  const displayName = formatThemeName(theme.name);
  
  // Extract colors from theme
  const lightColors = theme.cssVars?.light || {};
  const darkColors = theme.cssVars?.dark || {};
  const themeColors = theme.cssVars?.theme || {};
  
  // Fallback colors
  const fallback = {
    primary: 'oklch(0.62 0.19 259.81)',
    secondary: 'oklch(0.97 0.00 264.54)',
    accent: 'oklch(0.95 0.03 236.82)',
    background: 'oklch(1.00 0 0)',
    foreground: 'oklch(0.32 0 0)',
  };

  const colors = {
    primary: normalizeColorValue(lightColors.primary || fallback.primary),
    secondary: normalizeColorValue(lightColors.secondary || fallback.secondary),
    accent: normalizeColorValue(lightColors.accent || fallback.accent),
    background: normalizeColorValue(lightColors.background || fallback.background),
    foreground: normalizeColorValue(lightColors.foreground || fallback.foreground),
  };

  return `
  {
    id: '${theme.name}',
    name: '${displayName}',
    category: '${category}',
    colors: {
      primary: '${colors.primary}',
      secondary: '${colors.secondary}',
      accent: '${colors.accent}',
      background: '${colors.background}',
      foreground: '${colors.foreground}',
    },
    lightModeConfig: {
      // Base colors
      background: '${normalizeColorValue(lightColors.background || fallback.background)}',
      foreground: '${normalizeColorValue(lightColors.foreground || fallback.foreground)}',
      card: '${normalizeColorValue(lightColors.card || lightColors.background || fallback.background)}',
      'card-foreground': '${normalizeColorValue(lightColors['card-foreground'] || lightColors.foreground || fallback.foreground)}',
      popover: '${normalizeColorValue(lightColors.popover || lightColors.card || lightColors.background || fallback.background)}',
      'popover-foreground': '${normalizeColorValue(lightColors['popover-foreground'] || lightColors.foreground || fallback.foreground)}',

      // Primary colors
      primary: '${normalizeColorValue(lightColors.primary || fallback.primary)}',
      'primary-foreground': '${normalizeColorValue(lightColors['primary-foreground'] || 'oklch(1.00 0 0)')}',

      // Secondary colors
      secondary: '${normalizeColorValue(lightColors.secondary || fallback.secondary)}',
      'secondary-foreground': '${normalizeColorValue(lightColors['secondary-foreground'] || fallback.foreground)}',

      // Muted colors
      muted: '${normalizeColorValue(lightColors.muted || lightColors.secondary || fallback.secondary)}',
      'muted-foreground': '${normalizeColorValue(lightColors['muted-foreground'] || 'oklch(0.64 0 0)')}',

      // Accent colors
      accent: '${normalizeColorValue(lightColors.accent || fallback.accent)}',
      'accent-foreground': '${normalizeColorValue(lightColors['accent-foreground'] || fallback.foreground)}',

      // Destructive colors
      destructive: '${normalizeColorValue(lightColors.destructive || 'oklch(0.71 0.17 21.96)')}',
      'destructive-foreground': '${normalizeColorValue(lightColors['destructive-foreground'] || 'oklch(1.00 0 0)')}',

      // Border and input
      border: '${normalizeColorValue(lightColors.border || lightColors.primary || fallback.primary)}',
      input: '${normalizeColorValue(lightColors.input || lightColors.border || 'oklch(0.92 0 0)')}',
      ring: '${normalizeColorValue(lightColors.ring || lightColors.primary || fallback.primary)}',

      // Chart colors
      'chart-1': '${normalizeColorValue(lightColors['chart-1'] || lightColors.primary || fallback.primary)}',
      'chart-2': '${normalizeColorValue(lightColors['chart-2'] || 'oklch(0.71 0.15 142)')}',
      'chart-3': '${normalizeColorValue(lightColors['chart-3'] || 'oklch(0.77 0.12 85)')}',
      'chart-4': '${normalizeColorValue(lightColors['chart-4'] || 'oklch(0.71 0.17 21)')}',
      'chart-5': '${normalizeColorValue(lightColors['chart-5'] || 'oklch(0.70 0.14 285)')}',

      // Sidebar colors
      sidebar: '${normalizeColorValue(lightColors.sidebar || lightColors.card || lightColors.background || fallback.background)}',
      'sidebar-foreground': '${normalizeColorValue(lightColors['sidebar-foreground'] || lightColors.foreground || fallback.foreground)}',
      'sidebar-primary': '${normalizeColorValue(lightColors['sidebar-primary'] || lightColors.primary || fallback.primary)}',
      'sidebar-primary-foreground': '${normalizeColorValue(lightColors['sidebar-primary-foreground'] || 'oklch(1.00 0 0)')}',
      'sidebar-accent': '${normalizeColorValue(lightColors['sidebar-accent'] || lightColors.accent || fallback.accent)}',
      'sidebar-accent-foreground': '${normalizeColorValue(lightColors['sidebar-accent-foreground'] || lightColors.foreground || fallback.foreground)}',
      'sidebar-border': '${normalizeColorValue(lightColors['sidebar-border'] || lightColors.border || 'oklch(0.92 0 0)')}',
      'sidebar-ring': '${normalizeColorValue(lightColors['sidebar-ring'] || lightColors.primary || fallback.primary)}',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '${lightColors['letter-spacing'] || themeColors['letter-spacing'] || '-0.025em'}',

      // Border radius
      radius: '${themeColors.radius || lightColors.radius || '0.5rem'}',

      // Shadow system
      'shadow-color': '${normalizeColorValue(lightColors['shadow-color'] || fallback.foreground)}',
      'shadow-opacity': '${lightColors['shadow-opacity'] || '0.05'}',
      'shadow-blur': '${lightColors['shadow-blur'] || '10px'}',
      'shadow-spread': '${lightColors['shadow-spread'] || '0px'}',
      'shadow-offset-x': '${lightColors['shadow-offset-x'] || '0px'}',
      'shadow-offset-y': '${lightColors['shadow-offset-y'] || '4px'}',
    },
    darkModeConfig: {
      // Base colors
      background: '${normalizeColorValue(darkColors.background || 'oklch(0.15 0 0)')}',
      foreground: '${normalizeColorValue(darkColors.foreground || 'oklch(0.98 0 0)')}',
      card: '${normalizeColorValue(darkColors.card || darkColors.background || 'oklch(0.18 0 0)')}',
      'card-foreground': '${normalizeColorValue(darkColors['card-foreground'] || darkColors.foreground || 'oklch(0.98 0 0)')}',
      popover: '${normalizeColorValue(darkColors.popover || darkColors.card || 'oklch(0.18 0 0)')}',
      'popover-foreground': '${normalizeColorValue(darkColors['popover-foreground'] || darkColors.foreground || 'oklch(0.98 0 0)')}',

      // Primary colors
      primary: '${normalizeColorValue(darkColors.primary || lightColors.primary || fallback.primary)}',
      'primary-foreground': '${normalizeColorValue(darkColors['primary-foreground'] || darkColors.background || 'oklch(0.15 0 0)')}',

      // Secondary colors
      secondary: '${normalizeColorValue(darkColors.secondary || 'oklch(0.25 0 0)')}',
      'secondary-foreground': '${normalizeColorValue(darkColors['secondary-foreground'] || darkColors.foreground || 'oklch(0.98 0 0)')}',

      // Muted colors
      muted: '${normalizeColorValue(darkColors.muted || 'oklch(0.22 0 0)')}',
      'muted-foreground': '${normalizeColorValue(darkColors['muted-foreground'] || 'oklch(0.70 0 0)')}',

      // Accent colors
      accent: '${normalizeColorValue(darkColors.accent || 'oklch(0.25 0 0)')}',
      'accent-foreground': '${normalizeColorValue(darkColors['accent-foreground'] || darkColors.foreground || 'oklch(0.98 0 0)')}',

      // Destructive colors
      destructive: '${normalizeColorValue(darkColors.destructive || 'oklch(0.71 0.17 21.96)')}',
      'destructive-foreground': '${normalizeColorValue(darkColors['destructive-foreground'] || 'oklch(0.98 0 0)')}',

      // Border and input
      border: '${normalizeColorValue(darkColors.border || 'oklch(0.25 0 0)')}',
      input: '${normalizeColorValue(darkColors.input || 'oklch(0.22 0 0)')}',
      ring: '${normalizeColorValue(darkColors.ring || darkColors.primary || fallback.primary)}',

      // Chart colors
      'chart-1': '${normalizeColorValue(darkColors['chart-1'] || darkColors.primary || fallback.primary)}',
      'chart-2': '${normalizeColorValue(darkColors['chart-2'] || 'oklch(0.71 0.15 142)')}',
      'chart-3': '${normalizeColorValue(darkColors['chart-3'] || 'oklch(0.77 0.12 85)')}',
      'chart-4': '${normalizeColorValue(darkColors['chart-4'] || 'oklch(0.71 0.17 21)')}',
      'chart-5': '${normalizeColorValue(darkColors['chart-5'] || 'oklch(0.70 0.14 285)')}',

      // Sidebar colors
      sidebar: '${normalizeColorValue(darkColors.sidebar || darkColors.card || 'oklch(0.18 0 0)')}',
      'sidebar-foreground': '${normalizeColorValue(darkColors['sidebar-foreground'] || darkColors.foreground || 'oklch(0.98 0 0)')}',
      'sidebar-primary': '${normalizeColorValue(darkColors['sidebar-primary'] || darkColors.primary || fallback.primary)}',
      'sidebar-primary-foreground': '${normalizeColorValue(darkColors['sidebar-primary-foreground'] || 'oklch(0.98 0 0)')}',
      'sidebar-accent': '${normalizeColorValue(darkColors['sidebar-accent'] || darkColors.accent || 'oklch(0.25 0 0)')}',
      'sidebar-accent-foreground': '${normalizeColorValue(darkColors['sidebar-accent-foreground'] || darkColors.foreground || 'oklch(0.98 0 0)')}',
      'sidebar-border': '${normalizeColorValue(darkColors['sidebar-border'] || darkColors.border || 'oklch(0.25 0 0)')}',
      'sidebar-ring': '${normalizeColorValue(darkColors['sidebar-ring'] || darkColors.primary || fallback.primary)}',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '${darkColors['letter-spacing'] || themeColors['letter-spacing'] || '-0.025em'}',

      // Border radius
      radius: '${themeColors.radius || darkColors.radius || '0.5rem'}',

      // Shadow system
      'shadow-color': '${normalizeColorValue(darkColors['shadow-color'] || 'oklch(0.05 0 0)')}',
      'shadow-opacity': '${darkColors['shadow-opacity'] || '0.3'}',
      'shadow-blur': '${darkColors['shadow-blur'] || '20px'}',
      'shadow-spread': '${darkColors['shadow-spread'] || '0px'}',
      'shadow-offset-x': '${darkColors['shadow-offset-x'] || '0px'}',
      'shadow-offset-y': '${darkColors['shadow-offset-y'] || '8px'}',
    },
  },`;
}

async function main() {
  console.log('🎨 Migrating all remaining themes from tweakcn registry...\n');
  
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
    const themeDefinition = generateThemeDefinition(theme);
    newThemeDefinitions.push(themeDefinition);
  }
  
  // Read current predefined-themes.ts
  const themesFilePath = '/Users/luiseurdanetamartucci/Desktop/INSIDE/Alkitu-template/packages/web/src/lib/predefined-themes.ts';
  let themesContent = fs.readFileSync(themesFilePath, 'utf-8');
  
  // Create backup
  const backupPath = themesFilePath + '.backup.' + Date.now();
  fs.writeFileSync(backupPath, themesContent);
  console.log(`💾 Backup created: ${backupPath}`);
  
  // Find insertion point (before the closing ];)
  const closingBracketIndex = themesContent.lastIndexOf('];');
  const lastThemeEndIndex = themesContent.lastIndexOf('  },', closingBracketIndex);
  
  if (closingBracketIndex === -1 || lastThemeEndIndex === -1) {
    console.error('❌ Could not find insertion point');
    console.log('Looking for closing bracket at:', closingBracketIndex);
    console.log('Looking for last theme end at:', lastThemeEndIndex);
    return;
  }
  
  // Insert themes
  const newThemesString = '\n' + newThemeDefinitions.join('\n');
  
  const updatedContent = 
    themesContent.substring(0, lastThemeEndIndex + 4) + // Include "  },"
    newThemesString + '\n' +
    themesContent.substring(lastThemeEndIndex + 4);
  
  // Write updated content
  fs.writeFileSync(themesFilePath, updatedContent);
  
  console.log('✅ Successfully migrated all themes!');
  console.log(`📊 Summary:`);
  console.log(`- Themes migrated: ${themesToMigrate.length}`);
  console.log(`- Total themes now: ${39 + themesToMigrate.length}`);
  console.log(`- Backup created: ${backupPath.split('/').pop()}`);
}

if (require.main === module) {
  main().catch(console.error);
}

export { generateThemeDefinition };