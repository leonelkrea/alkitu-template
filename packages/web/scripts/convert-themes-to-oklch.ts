#!/usr/bin/env npx tsx

/**
 * Script to convert all predefined themes from HEX to OKLCH format
 * Uses exact tweakcn values when available, converts automatically otherwise
 */

import fs from 'fs';
import path from 'path';

// Color conversion utilities (copy from themeUtils.ts)
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
  
  // Format as string with reasonable precision
  const l = (oklch.l).toFixed(2);
  const c = oklch.c.toFixed(3);
  const h = Math.round(oklch.h);
  
  return `oklch(${l} ${c} ${h})`;
}

// Known tweakcn OKLCH values for exact matches
const TWEAKCN_OKLCH_VALUES: Record<string, Record<string, string>> = {
  'modern-minimal': {
    // Already converted - skip this one
  },
  'github-light': {
    'light': {
      background: 'oklch(1.00 0 0)',
      foreground: 'oklch(0.15 0 0)',
      primary: 'oklch(0.45 0.22 264)',
      'primary-foreground': 'oklch(1.00 0 0)',
      secondary: 'oklch(0.97 0 0)',
      'secondary-foreground': 'oklch(0.15 0 0)',
      // Add more as needed
    }
  },
  // Add more known tweakcn themes here
};

function convertColorValue(colorValue: string, themeName: string, colorName: string, mode: 'light' | 'dark'): string {
  // Skip if already in OKLCH format
  if (colorValue.includes('oklch(')) {
    return colorValue;
  }
  
  // Check if we have a known tweakcn value
  const knownValue = TWEAKCN_OKLCH_VALUES[themeName]?.[mode]?.[colorName];
  if (knownValue) {
    console.log(`✅ Using tweakcn value for ${themeName}.${colorName}: ${knownValue}`);
    return knownValue;
  }
  
  // Convert HEX to OKLCH
  if (colorValue.startsWith('#')) {
    const oklchValue = hexToOklch(colorValue);
    console.log(`🔄 Converted ${themeName}.${colorName}: ${colorValue} → ${oklchValue}`);
    return oklchValue;
  }
  
  // Handle RGB values
  if (colorValue.startsWith('rgb(')) {
    const matches = colorValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (matches) {
      const r = parseInt(matches[1]);
      const g = parseInt(matches[2]);
      const b = parseInt(matches[3]);
      const oklch = rgbToOklch(r, g, b);
      const oklchValue = `oklch(${oklch.l.toFixed(2)} ${oklch.c.toFixed(3)} ${Math.round(oklch.h)})`;
      console.log(`🔄 Converted ${themeName}.${colorName}: ${colorValue} → ${oklchValue}`);
      return oklchValue;
    }
  }
  
  // Return as-is if we can't convert
  console.log(`⚠️ Could not convert ${themeName}.${colorName}: ${colorValue}`);
  return colorValue;
}

function convertThemeConfig(config: Record<string, string>, themeName: string, mode: 'light' | 'dark'): Record<string, string> {
  const convertedConfig: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(config)) {
    // Only convert color properties, preserve non-color properties
    const colorProperties = new Set([
      'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
      'primary', 'primary-foreground', 'secondary', 'secondary-foreground',
      'muted', 'muted-foreground', 'accent', 'accent-foreground',
      'destructive', 'destructive-foreground', 'border', 'input', 'ring',
      'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
      'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
      'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
      'shadow-color'
    ]);
    
    if (colorProperties.has(key)) {
      convertedConfig[key] = convertColorValue(value, themeName, key, mode);
    } else {
      // Keep non-color properties as-is
      convertedConfig[key] = value;
    }
  }
  
  return convertedConfig;
}

function convertColorsObject(colors: Record<string, string>, themeName: string): Record<string, string> {
  const convertedColors: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(colors)) {
    convertedColors[key] = convertColorValue(value, themeName, key, 'light');
  }
  
  return convertedColors;
}

async function main() {
  const themesFilePath = path.join(__dirname, '../src/lib/predefined-themes.ts');
  
  console.log('🎨 Converting all predefined themes to OKLCH format...\n');
  
  // Read the current themes file
  let themesContent = fs.readFileSync(themesFilePath, 'utf-8');
  
  // Parse and extract theme definitions
  const themeRegex = /{\s*id:\s*'([^']+)',[\s\S]*?},(?=\s*{|\s*];)/g;
  let match;
  const themes: Array<{ id: string; content: string; startIndex: number; endIndex: number }> = [];
  
  while ((match = themeRegex.exec(themesContent)) !== null) {
    themes.push({
      id: match[1],
      content: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length
    });
  }
  
  console.log(`Found ${themes.length} themes to convert:\n`);
  
  // Process each theme
  let updatedContent = themesContent;
  let offset = 0;
  
  for (const theme of themes) {
    if (theme.id === 'modern-minimal') {
      console.log(`⏭️ Skipping ${theme.id} (already converted)\n`);
      continue;
    }
    
    console.log(`🔄 Converting theme: ${theme.id}`);
    
    // Convert HEX values to OKLCH in the theme definition
    let convertedThemeContent = theme.content;
    
    // Convert colors object
    convertedThemeContent = convertedThemeContent.replace(
      /(colors:\s*{[^}]*primary:\s*)'([^']+)'/g,
      (match, prefix, colorValue) => {
        const converted = convertColorValue(colorValue, theme.id, 'primary', 'light');
        return `${prefix}'${converted}'`;
      }
    );
    
    convertedThemeContent = convertedThemeContent.replace(
      /(colors:\s*{[^}]*secondary:\s*)'([^']+)'/g,
      (match, prefix, colorValue) => {
        const converted = convertColorValue(colorValue, theme.id, 'secondary', 'light');
        return `${prefix}'${converted}'`;
      }
    );
    
    convertedThemeContent = convertedThemeContent.replace(
      /(colors:\s*{[^}]*accent:\s*)'([^']+)'/g,
      (match, prefix, colorValue) => {
        const converted = convertColorValue(colorValue, theme.id, 'accent', 'light');
        return `${prefix}'${converted}'`;
      }
    );
    
    convertedThemeContent = convertedThemeContent.replace(
      /(colors:\s*{[^}]*background:\s*)'([^']+)'/g,
      (match, prefix, colorValue) => {
        const converted = convertColorValue(colorValue, theme.id, 'background', 'light');
        return `${prefix}'${converted}'`;
      }
    );
    
    convertedThemeContent = convertedThemeContent.replace(
      /(colors:\s*{[^}]*foreground:\s*)'([^']+)'/g,
      (match, prefix, colorValue) => {
        const converted = convertColorValue(colorValue, theme.id, 'foreground', 'light');
        return `${prefix}'${converted}'`;
      }
    );
    
    // Convert all HEX values in lightModeConfig and darkModeConfig
    convertedThemeContent = convertedThemeContent.replace(
      /#[a-fA-F0-9]{6}/g,
      (hexValue) => {
        return convertColorValue(hexValue, theme.id, 'unknown', 'light');
      }
    );
    
    // Replace in the main content
    const adjustedStart = theme.startIndex + offset;
    const adjustedEnd = theme.endIndex + offset;
    
    updatedContent = updatedContent.substring(0, adjustedStart) + 
                    convertedThemeContent + 
                    updatedContent.substring(adjustedEnd);
    
    offset += convertedThemeContent.length - theme.content.length;
    
    console.log(`✅ Converted theme: ${theme.id}\n`);
  }
  
  // Create backup
  const backupPath = themesFilePath + '.backup.' + Date.now();
  fs.writeFileSync(backupPath, themesContent);
  console.log(`💾 Backup created: ${backupPath}`);
  
  // Write updated content
  fs.writeFileSync(themesFilePath, updatedContent);
  console.log(`✅ Updated themes file: ${themesFilePath}`);
  
  console.log('\n🎉 All themes converted to OKLCH format!');
  console.log('\n📋 Summary:');
  console.log(`- Total themes processed: ${themes.length}`);
  console.log(`- Backup created: ${path.basename(backupPath)}`);
  console.log('- All HEX values converted to OKLCH format');
  console.log('- Color properties preserved non-color properties untouched');
}

if (require.main === module) {
  main().catch(console.error);
}

export { hexToOklch, convertColorValue };