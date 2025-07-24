#!/usr/bin/env npx tsx

/**
 * Script to verify that all themes are in OKLCH format
 */

import { PREDEFINED_THEMES } from '../src/lib/predefined-themes';

function isOklchFormat(colorValue: string): boolean {
  return colorValue.includes('oklch(') || 
         /^oklch\([\d.]+%?\s+[\d.]+\s+[\d.]+\)$/.test(colorValue.trim()) ||
         /^[\d.]+%?\s+[\d.]+\s+[\d.]+$/.test(colorValue.trim());
}

function verifyThemes() {
  console.log('🔍 Verifying theme color formats...\n');
  
  let totalThemes = 0;
  let oklchThemes = 0;
  let issues: string[] = [];
  
  for (const theme of PREDEFINED_THEMES) {
    totalThemes++;
    
    let hasIssues = false;
    
    // Check colors object
    for (const [colorName, colorValue] of Object.entries(theme.colors)) {
      if (!isOklchFormat(colorValue)) {
        issues.push(`❌ ${theme.name}.colors.${colorName}: "${colorValue}" is not OKLCH format`);
        hasIssues = true;
      }
    }
    
    // Check lightModeConfig
    for (const [colorName, colorValue] of Object.entries(theme.lightModeConfig)) {
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
      
      if (colorProperties.has(colorName) && !isOklchFormat(colorValue)) {
        issues.push(`❌ ${theme.name}.lightModeConfig.${colorName}: "${colorValue}" is not OKLCH format`);
        hasIssues = true;
      }
    }
    
    // Check darkModeConfig
    for (const [colorName, colorValue] of Object.entries(theme.darkModeConfig)) {
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
      
      if (colorProperties.has(colorName) && !isOklchFormat(colorValue)) {
        issues.push(`❌ ${theme.name}.darkModeConfig.${colorName}: "${colorValue}" is not OKLCH format`);
        hasIssues = true;
      }
    }
    
    if (!hasIssues) {
      oklchThemes++;
      console.log(`✅ ${theme.name} - All colors in OKLCH format`);
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`- Total themes: ${totalThemes}`);
  console.log(`- OKLCH compliant: ${oklchThemes}`);
  console.log(`- Issues found: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log('\n🚨 Issues found:');
    issues.forEach(issue => console.log(issue));
  } else {
    console.log('\n🎉 All themes are successfully converted to OKLCH format!');
  }
  
  return issues.length === 0;
}

if (require.main === module) {
  const success = verifyThemes();
  process.exit(success ? 0 : 1);
}

export { verifyThemes };