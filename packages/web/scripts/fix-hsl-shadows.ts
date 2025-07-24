#!/usr/bin/env npx tsx

/**
 * Script to fix HSL shadow colors that weren't converted to OKLCH
 */

import fs from 'fs';

// HSL to OKLCH conversion function
function hslToOklch(hsl: string): string {
  const match = hsl.match(/hsl\((\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\s*(?:\/\s*(\d+(?:\.\d+)?))?\)/);
  if (match) {
    const h = parseFloat(match[1]);
    const s = parseFloat(match[2]) / 100;
    const l = parseFloat(match[3]) / 100;
    const alpha = match[4] ? parseFloat(match[4]) : 1;
    
    // Simple HSL to OKLCH approximation
    const oklchL = l.toFixed(2);
    const oklchC = (s * l * (1 - l) * 2).toFixed(3);
    const oklchH = Math.round(h);
    
    return `oklch(${oklchL} ${oklchC} ${oklchH})`;
  }
  return hsl;
}

function main() {
  console.log('🔧 Fixing HSL shadow colors...\n');
  
  const themesFilePath = '/Users/luiseurdanetamartucci/Desktop/INSIDE/Alkitu-template/packages/web/src/lib/predefined-themes.ts';
  let content = fs.readFileSync(themesFilePath, 'utf-8');
  
  // Create backup
  const backupPath = themesFilePath + '.backup.' + Date.now();
  fs.writeFileSync(backupPath, content);
  console.log(`💾 Backup created: ${backupPath}`);
  
  // Convert all HSL values to OKLCH
  const hslRegex = /hsl\(\d+(?:\.\d+)?\s+\d+(?:\.\d+)?%\s+\d+(?:\.\d+)?%(?:\s*\/\s*\d+(?:\.\d+)?)?\)/g;
  
  let matches = 0;
  content = content.replace(hslRegex, (match) => {
    const converted = hslToOklch(match);
    console.log(`🔄 Converted: ${match} → ${converted}`);
    matches++;
    return converted;
  });
  
  // Write updated content
  fs.writeFileSync(themesFilePath, content);
  
  console.log(`\n✅ Fixed ${matches} HSL values`);
  console.log(`📄 Updated: ${themesFilePath}`);
}

if (require.main === module) {
  main();
}