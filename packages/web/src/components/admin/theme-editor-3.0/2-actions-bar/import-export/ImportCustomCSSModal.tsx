'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload } from 'lucide-react';
import { ThemeData } from '../../types/theme.types';
import { SaveThemeDialog } from '../save-controls/SaveThemeDialog';

interface ImportCustomCSSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (theme: ThemeData) => void;
  existingThemes: ThemeData[];
}

export function ImportCustomCSSModal({ 
  open, 
  onOpenChange, 
  onImport, 
  existingThemes 
}: ImportCustomCSSModalProps) {
  const [cssContent, setCssContent] = useState('');
  const [themeName, setThemeName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [parsedTheme, setParsedTheme] = useState<ThemeData | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Parse CSS content to extract color variables
  const parseCSSToTheme = (css: string, name: string): ThemeData | null => {
    try {
      const lines = css.split('\n');
      const lightColors: any = {};
      const darkColors: any = {};
      
      let currentMode: 'light' | 'dark' | null = null;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Detect mode sections
        if (trimmedLine.includes(':root')) {
          currentMode = 'light';
          continue;
        }
        if (trimmedLine.includes('.dark')) {
          currentMode = 'dark';
          continue;
        }
        
        // Parse CSS variables
        if (trimmedLine.startsWith('--') && trimmedLine.includes(':') && currentMode) {
          const [property, value] = trimmedLine.split(':').map(s => s.trim());
          const cleanProperty = property.replace('--', '');
          const cleanValue = value.replace(';', '').trim();
          
          // Map CSS variables to our color tokens
          const colorKey = mapCSSVariableToColorKey(cleanProperty);
          if (colorKey) {
            const colorToken = createColorTokenFromCSS(colorKey, cleanValue);
            if (colorToken) {
              if (currentMode === 'light') {
                lightColors[colorKey] = colorToken;
              } else {
                darkColors[colorKey] = colorToken;
              }
            }
          }
        }
      }
      
      // Validate that we have essential colors
      const requiredColors = ['background', 'foreground', 'primary', 'primaryForeground'];
      const hasRequiredLight = requiredColors.every(color => lightColors[color]);
      const hasRequiredDark = requiredColors.every(color => darkColors[color]);
      
      if (!hasRequiredLight || !hasRequiredDark) {
        throw new Error('CSS must contain at least background, foreground, primary, and primary-foreground variables for both :root and .dark sections');
      }
      
      // Create theme data
      const themeData: ThemeData = {
        id: `imported-${Date.now()}`,
        name,
        description: `Imported from CSS on ${new Date().toLocaleString()}`,
        version: '1.0.0',
        author: 'CSS Import',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lightColors,
        darkColors,
        typography: {
          fontFamilies: {
            sans: 'ui-sans-serif, system-ui, sans-serif',
            serif: 'ui-serif, Georgia, serif',
            mono: 'ui-monospace, SFMono-Regular, monospace'
          },
          trackingNormal: '0em'
        },
        brand: {
          name: `${name} Brand`,
          primaryColor: lightColors.primary || createDefaultColorToken('primary'),
          secondaryColor: lightColors.secondary || createDefaultColorToken('secondary')
        },
        spacing: { spacing: '0.25rem' },
        borders: {
          radius: '0.5rem',
          radiusSm: 'calc(var(--radius) - 4px)',
          radiusMd: 'calc(var(--radius) - 2px)', 
          radiusLg: 'var(--radius)',
          radiusXl: 'calc(var(--radius) + 4px)'
        },
        shadows: {
          shadow2xs: '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
          shadowXs: '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
          shadowSm: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
          shadow: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
          shadowMd: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)',
          shadowLg: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)',
          shadowXl: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)',
          shadow2xl: '0 1px 3px 0px hsl(0 0% 0% / 0.25)'
        },
        scroll: { width: '8px', behavior: 'smooth', smooth: true, hide: false },
        tags: ['imported', 'custom'],
        isPublic: true,
        isFavorite: false
      };
      
      return themeData;
    } catch (error) {
      console.error('CSS parsing error:', error);
      return null;
    }
  };

  // Map CSS variable names to our color token keys
  const mapCSSVariableToColorKey = (cssVar: string): string | null => {
    const mapping: Record<string, string> = {
      'background': 'background',
      'foreground': 'foreground',
      'card': 'card',
      'card-foreground': 'cardForeground',
      'popover': 'popover',
      'popover-foreground': 'popoverForeground',
      'primary': 'primary',
      'primary-foreground': 'primaryForeground',
      'secondary': 'secondary',
      'secondary-foreground': 'secondaryForeground',
      'muted': 'muted',
      'muted-foreground': 'mutedForeground',
      'accent': 'accent',
      'accent-foreground': 'accentForeground',
      'destructive': 'destructive',
      'destructive-foreground': 'destructiveForeground',
      'border': 'border',
      'input': 'input',
      'ring': 'ring',
      'chart-1': 'chart1',
      'chart-2': 'chart2',
      'chart-3': 'chart3',
      'chart-4': 'chart4',
      'chart-5': 'chart5',
      'sidebar': 'sidebar',
      'sidebar-foreground': 'sidebarForeground',
      'sidebar-primary': 'sidebarPrimary',
      'sidebar-primary-foreground': 'sidebarPrimaryForeground',
      'sidebar-accent': 'sidebarAccent',
      'sidebar-accent-foreground': 'sidebarAccentForeground',
      'sidebar-border': 'sidebarBorder',
      'sidebar-ring': 'sidebarRing',
      'scrollbar-track': 'scrollbarTrack',
      'scrollbar-thumb': 'scrollbarThumb'
    };
    
    return mapping[cssVar] || null;
  };

  // Create color token from CSS value
  const createColorTokenFromCSS = (name: string, cssValue: string): any => {
    // Import the createPreciseColorToken function
    const { createPreciseColorToken } = require('../../utils/color-conversions-v2');
    
    try {
      // Try to parse different color formats
      if (cssValue.startsWith('oklch(')) {
        return createPreciseColorToken(name, cssValue);
      } else if (cssValue.startsWith('#')) {
        return createPreciseColorToken(name, cssValue);
      } else if (cssValue.startsWith('rgb(')) {
        return createPreciseColorToken(name, cssValue);
      } else if (cssValue.startsWith('hsl(')) {
        return createPreciseColorToken(name, cssValue);
      } else {
        // Try to parse as hex without #
        if (/^[0-9A-Fa-f]{6}$/.test(cssValue)) {
          return createPreciseColorToken(name, `#${cssValue}`);
        }
      }
      
      // Fallback to a default color if parsing fails
      return createDefaultColorToken(name);
    } catch (error) {
      console.warn(`Failed to parse color ${name}: ${cssValue}`, error);
      return createDefaultColorToken(name);
    }
  };

  // Create default color token
  const createDefaultColorToken = (name: string): any => {
    const { createPreciseColorToken } = require('../../utils/color-conversions-v2');
    return createPreciseColorToken(name, '#808080'); // Default gray
  };

  const handleImportClick = () => {
    if (!cssContent.trim()) {
      setError('Please paste your CSS content');
      return;
    }
    
    if (!themeName.trim()) {
      setError('Please enter a theme name');
      return;
    }
    
    setError(null);
    setIsImporting(true);
    
    try {
      const theme = parseCSSToTheme(cssContent, themeName.trim());
      
      if (!theme) {
        setError('Failed to parse CSS. Please make sure your CSS includes valid color variables for both :root and .dark sections.');
        setIsImporting(false);
        return;
      }
      
      setParsedTheme(theme);
      
      // Check if theme name already exists
      const existingThemeNames = existingThemes.map(t => t.name);
      if (existingThemeNames.includes(themeName.trim())) {
        // Show save dialog for overwrite confirmation
        setShowSaveDialog(true);
      } else {
        // Import directly
        onImport(theme);
        handleClose();
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to import CSS');
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveConfirm = (theme: ThemeData, isNewTheme: boolean) => {
    onImport(theme);
    setShowSaveDialog(false);
    handleClose();
  };

  const handleClose = () => {
    setCssContent('');
    setThemeName('');
    setError(null);
    setParsedTheme(null);
    setShowSaveDialog(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Custom CSS
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 space-y-4 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="theme-name">Theme Name</Label>
              <Input
                id="theme-name"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="Enter theme name (e.g., My Custom Theme)"
                disabled={isImporting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="css-content">CSS Content</Label>
              <p className="text-sm text-muted-foreground">
                Paste your CSS file below to customize the theme colors. Make sure to include variables like --primary, --background, etc.
              </p>
              <Textarea
                id="css-content"
                value={cssContent}
                onChange={(e) => setCssContent(e.target.value)}
                placeholder={`:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.15 0 0);
  --primary: #3e2723;
  /* And more... */
}

.dark {
  --background: oklch(0.09 0 0);
  --foreground: oklch(0.98 0 0);
  --primary: rgb(46, 125, 50);
  /* And more... */
}`}
                className="min-h-[200px] font-mono text-sm"
                disabled={isImporting}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportClick}
              disabled={isImporting || !cssContent.trim() || !themeName.trim()}
            >
              {isImporting ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save confirmation dialog */}
      {showSaveDialog && parsedTheme && (
        <SaveThemeDialog
          open={showSaveDialog}
          onOpenChange={setShowSaveDialog}
          currentTheme={parsedTheme}
          existingThemeNames={existingThemes.map(t => t.name)}
          onSave={handleSaveConfirm}
        />
      )}
    </>
  );
}