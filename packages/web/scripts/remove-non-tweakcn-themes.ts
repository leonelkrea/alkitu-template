#!/usr/bin/env npx tsx

/**
 * Script to remove themes that are not in the tweakcn registry
 * Keeps only the 36 themes that exist in tweakcn
 */

import fs from 'fs';

// Themes that exist in tweakcn registry and should be KEPT
const TWEAKCN_THEMES = [
  'modern-minimal', 't3-chat', 'twitter', 'mocha-mousse', 'bubblegum', 'doom-64',
  'catppuccin', 'graphite', 'perpetuity', 'kodama-grove', 'cosmic-night', 'tangerine',
  'quantum-rose', 'nature', 'bold-tech', 'elegant-luxury', 'amber-minimal', 'supabase',
  'neo-brutalism', 'solar-dusk', 'claymorphism', 'cyberpunk', 'pastel-dreams', 'clean-slate',
  'caffeine', 'ocean-breeze', 'retro-arcade', 'midnight-bloom', 'candyland', 'northern-lights',
  'vintage-paper', 'sunset-horizon', 'starry-night', 'claude', 'vercel', 'mono'
];

// Themes to REMOVE (not in tweakcn registry)
const THEMES_TO_REMOVE = [
  'violet-bloom', 'forest-green', 'coral-reef', 'midnight-blue', 'corporate-blue',
  'enterprise-gray', 'professional-green', 'rainbow-gradient', 'neon-glow', 'electric-blue',
  'black-white', 'charcoal', 'dracula', 'nord', 'gruvbox', 'tokyo-night',
  'solarized-light', 'github-light', 'linear', 'notion', 'discord', 'spotify',
  'orange-sunset', 'purple-haze'
];

function main() {
  console.log('🗑️  Removing themes not in tweakcn registry...\n');
  
  const themesFilePath = '/Users/luiseurdanetamartucci/Desktop/INSIDE/Alkitu-template/packages/web/src/lib/predefined-themes.ts';
  let content = fs.readFileSync(themesFilePath, 'utf-8');
  
  // Create backup
  const backupPath = themesFilePath + '.backup.' + Date.now();
  fs.writeFileSync(backupPath, content);
  console.log(`💾 Backup created: ${backupPath}`);
  
  console.log(`Themes to keep (${TWEAKCN_THEMES.length}):`, TWEAKCN_THEMES.join(', '));
  console.log(`\nThemes to remove (${THEMES_TO_REMOVE.length}):`, THEMES_TO_REMOVE.join(', '));
  console.log();
  
  let removedCount = 0;
  
  // Remove each theme
  for (const themeId of THEMES_TO_REMOVE) {
    console.log(`🗑️  Removing theme: ${themeId}`);
    
    // Find the theme definition using regex
    const themeRegex = new RegExp(
      `\\s*{\\s*id:\\s*'${themeId}',[\\s\\S]*?\\s*},\\s*(?=\\s*{\\s*id:|\\s*];)`,
      'g'
    );
    
    const match = themeRegex.exec(content);
    if (match) {
      content = content.replace(themeRegex, '');
      removedCount++;
      console.log(`✅ Removed: ${themeId}`);
    } else {
      console.log(`⚠️  Theme not found: ${themeId}`);
    }
    
    // Reset regex lastIndex for next iteration
    themeRegex.lastIndex = 0;
  }
  
  // Clean up any double commas or extra whitespace
  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/,\s*];/g, '\n];');
  
  // Write updated content
  fs.writeFileSync(themesFilePath, content);
  
  console.log(`\n✅ Successfully removed ${removedCount} themes`);
  console.log(`📊 Summary:`);
  console.log(`- Themes removed: ${removedCount}`);
  console.log(`- Themes remaining: ${TWEAKCN_THEMES.length}`);
  console.log(`- Backup created: ${backupPath.split('/').pop()}`);
  console.log(`- Updated file: ${themesFilePath}`);
}

if (require.main === module) {
  main();
}

export { TWEAKCN_THEMES, THEMES_TO_REMOVE };