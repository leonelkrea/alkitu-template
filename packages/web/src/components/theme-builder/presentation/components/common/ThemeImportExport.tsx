/**
 * Theme Import/Export Component
 * Enhanced functionality for saving, loading, and sharing themes
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Download,
  Upload,
  Save,
  Copy,
  Check,
  FileJson,
  FileCode,
  Link2,
  QrCode,
  Clock,
  AlertCircle,
  FileText,
  Image,
  Share2,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ThemeData } from '../../../shared/types/theme.types';

/**
 * Export format types
 */
export type ExportFormat = 'json' | 'css' | 'scss' | 'tailwind' | 'figma' | 'sketch';

/**
 * Import source types
 */
export type ImportSource = 'file' | 'url' | 'json' | 'figma' | 'sketch';

/**
 * Props interface
 */
export interface ThemeImportExportProps {
  // Current theme
  currentTheme?: ThemeData;
  onThemeChange: (theme: ThemeData) => void;
  
  // Save functionality
  onSaveTheme?: (theme: ThemeData, name: string, options?: SaveOptions) => Promise<void>;
  
  // Configuration
  className?: string;
  
  // Features
  enabledExports?: ExportFormat[];
  enabledImports?: ImportSource[];
  showPreview?: boolean;
  allowSharing?: boolean;
}

/**
 * Save options interface
 */
export interface SaveOptions {
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  category?: string;
}

/**
 * Default export formats
 */
const EXPORT_FORMATS: { id: ExportFormat; name: string; description: string; icon: React.ComponentType; extension: string }[] = [
  {
    id: 'json',
    name: 'JSON',
    description: 'Complete theme data with all configurations',
    icon: FileJson,
    extension: 'json'
  },
  {
    id: 'css',
    name: 'CSS Variables',
    description: 'CSS custom properties for web projects',
    icon: FileCode,
    extension: 'css'
  },
  {
    id: 'scss',
    name: 'SCSS Variables',
    description: 'Sass variables for stylesheets',
    icon: FileCode,
    extension: 'scss'
  },
  {
    id: 'tailwind',
    name: 'Tailwind Config',
    description: 'Tailwind CSS configuration file',
    icon: FileText,
    extension: 'js'
  },
  {
    id: 'figma',
    name: 'Figma Tokens',
    description: 'Design tokens for Figma plugins',
    icon: Image,
    extension: 'json'
  },
  {
    id: 'sketch',
    name: 'Sketch Palette',
    description: 'Color palette for Sketch app',
    icon: Image,
    extension: 'sketchpalette'
  }
];

/**
 * Generate CSS variables from theme
 */
function generateCSS(theme: ThemeData): string {
  const lightColors = theme.lightColors || {};
  const darkColors = theme.darkColors || {};
  
  let css = ':root {\n';
  Object.entries(lightColors).forEach(([key, value]) => {
    css += `  --${key}: ${value};\n`;
  });
  css += '}\n\n';
  
  if (Object.keys(darkColors).length > 0) {
    css += '[data-theme="dark"] {\n';
    Object.entries(darkColors).forEach(([key, value]) => {
      css += `  --${key}: ${value};\n`;
    });
    css += '}\n';
  }
  
  return css;
}

/**
 * Generate SCSS variables from theme
 */
function generateSCSS(theme: ThemeData): string {
  const lightColors = theme.lightColors || {};
  
  let scss = '// Light theme colors\n';
  Object.entries(lightColors).forEach(([key, value]) => {
    const varName = key.replace(/-/g, '_');
    scss += `$${varName}: ${value};\n`;
  });
  
  if (theme.darkColors && Object.keys(theme.darkColors).length > 0) {
    scss += '\n// Dark theme colors\n';
    Object.entries(theme.darkColors).forEach(([key, value]) => {
      const varName = key.replace(/-/g, '_') + '_dark';
      scss += `$${varName}: ${value};\n`;
    });
  }
  
  return scss;
}

/**
 * Generate Tailwind config from theme
 */
function generateTailwindConfig(theme: ThemeData): string {
  const lightColors = theme.lightColors || {};
  
  const config = {
    theme: {
      extend: {
        colors: lightColors
      }
    }
  };
  
  return `module.exports = ${JSON.stringify(config, null, 2)}`;
}

/**
 * Enhanced Theme Import/Export Component
 */
export function ThemeImportExport({
  currentTheme,
  onThemeChange,
  onSaveTheme,
  className,
  enabledExports = ['json', 'css', 'scss', 'tailwind'],
  enabledImports = ['file', 'json'],
  showPreview = true,
  allowSharing = true
}: ThemeImportExportProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Save dialog state
  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  const [themeTags, setThemeTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Export dialog state
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [exportPreview, setExportPreview] = useState('');
  
  // Import dialog state
  const [importSource, setImportSource] = useState<ImportSource>('file');
  const [importData, setImportData] = useState('');
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  // Share dialog state
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  /**
   * Handle theme save
   */
  const handleSave = useCallback(async () => {
    if (!currentTheme || !themeName.trim() || !onSaveTheme) return;
    
    setIsSaving(true);
    try {
      const options: SaveOptions = {
        description: themeDescription || undefined,
        tags: themeTags ? themeTags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        isPublic,
      };
      
      await onSaveTheme(currentTheme, themeName.trim(), options);
      
      // Reset form
      setThemeName('');
      setThemeDescription('');
      setThemeTags('');
      setIsPublic(false);
      setShowSaveDialog(false);
      
      toast.success('Theme saved successfully!');
    } catch (error) {
      toast.error('Failed to save theme');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [currentTheme, themeName, themeDescription, themeTags, isPublic, onSaveTheme]);
  
  /**
   * Handle theme export
   */
  const handleExport = useCallback(async () => {
    if (!currentTheme) return;
    
    setIsExporting(true);
    try {
      let content = '';
      let filename = `theme-${currentTheme.name || 'custom'}`;
      
      const format = EXPORT_FORMATS.find(f => f.id === selectedFormat);
      if (!format) return;
      
      switch (selectedFormat) {
        case 'json':
          content = JSON.stringify(currentTheme, null, 2);
          break;
        case 'css':
          content = generateCSS(currentTheme);
          break;
        case 'scss':
          content = generateSCSS(currentTheme);
          break;
        case 'tailwind':
          content = generateTailwindConfig(currentTheme);
          break;
        case 'figma':
          // Figma tokens format
          content = JSON.stringify({
            colors: currentTheme.lightColors || {},
            darkColors: currentTheme.darkColors || {}
          }, null, 2);
          break;
        default:
          content = JSON.stringify(currentTheme, null, 2);
      }
      
      // Create and download file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format.extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setShowExportDialog(false);
      toast.success(`Theme exported as ${format.name}`);
    } catch (error) {
      toast.error('Failed to export theme');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [currentTheme, selectedFormat]);
  
  /**
   * Handle theme import
   */
  const handleImport = useCallback(async () => {
    setIsImporting(true);
    try {
      let themeData: ThemeData;
      
      if (importSource === 'json') {
        themeData = JSON.parse(importData);
      } else if (importSource === 'url') {
        const response = await fetch(importUrl);
        themeData = await response.json();
      } else {
        // File import handled separately
        return;
      }
      
      onThemeChange(themeData);
      setShowImportDialog(false);
      setImportData('');
      setImportUrl('');
      toast.success('Theme imported successfully!');
    } catch (error) {
      toast.error('Failed to import theme');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  }, [importSource, importData, importUrl, onThemeChange]);
  
  /**
   * Handle file import
   */
  const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const themeData: ThemeData = JSON.parse(content);
        onThemeChange(themeData);
        toast.success('Theme imported from file!');
      } catch (error) {
        toast.error('Invalid theme file');
        console.error('File import error:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onThemeChange]);
  
  /**
   * Generate export preview
   */
  const updateExportPreview = useCallback(() => {
    if (!currentTheme) return;
    
    try {
      let preview = '';
      switch (selectedFormat) {
        case 'json':
          preview = JSON.stringify(currentTheme, null, 2);
          break;
        case 'css':
          preview = generateCSS(currentTheme);
          break;
        case 'scss':
          preview = generateSCSS(currentTheme);
          break;
        case 'tailwind':
          preview = generateTailwindConfig(currentTheme);
          break;
        default:
          preview = JSON.stringify(currentTheme, null, 2);
      }
      setExportPreview(preview);
    } catch (error) {
      setExportPreview('Error generating preview');
    }
  }, [currentTheme, selectedFormat]);
  
  React.useEffect(() => {
    if (showExportDialog) {
      updateExportPreview();
    }
  }, [showExportDialog, updateExportPreview]);
  
  /**
   * Copy to clipboard
   */
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  }, []);
  
  const availableFormats = EXPORT_FORMATS.filter(format => enabledExports.includes(format.id));
  
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Save Theme */}
      {onSaveTheme && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveDialog(true)}
          disabled={!currentTheme}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      )}
      
      {/* Export Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={!currentTheme}>
            <Download className="w-4 h-4 mr-2" />
            Export
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Export Format</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableFormats.map((format) => {
            const Icon = format.icon;
            return (
              <DropdownMenuItem
                key={format.id}
                onClick={() => {
                  setSelectedFormat(format.id);
                  setShowExportDialog(true);
                }}
              >
                <Icon className="w-4 h-4 mr-2" />
                <div>
                  <div className="font-medium">{format.name}</div>
                  <div className="text-xs text-muted-foreground">{format.description}</div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Import */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowImportDialog(true)}
      >
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button>
      
      {/* Share */}
      {allowSharing && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowShareDialog(true)}
          disabled={!currentTheme}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      )}
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />
      
      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Theme</DialogTitle>
            <DialogDescription>
              Save your current theme configuration for later use.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-name">Theme Name *</Label>
              <Input
                id="theme-name"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="Enter theme name..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="theme-description">Description</Label>
              <Textarea
                id="theme-description"
                value={themeDescription}
                onChange={(e) => setThemeDescription(e.target.value)}
                placeholder="Optional description..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="theme-tags">Tags</Label>
              <Input
                id="theme-tags"
                value={themeTags}
                onChange={(e) => setThemeTags(e.target.value)}
                placeholder="dark, modern, blue (comma separated)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!themeName.trim() || isSaving}
            >
              {isSaving ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Theme
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Theme</DialogTitle>
            <DialogDescription>
              Export your theme in various formats for different use cases.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Format Selection */}
            <div className="space-y-2">
              <Label>Export Format</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableFormats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <Button
                      key={format.id}
                      variant={selectedFormat === format.id ? "default" : "outline"}
                      className="h-auto p-3 justify-start"
                      onClick={() => setSelectedFormat(format.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">{format.name}</div>
                        <div className="text-xs opacity-70">{format.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Preview */}
            {showPreview && exportPreview && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Preview</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(exportPreview)}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <ScrollArea className="h-40">
                  <pre className="text-xs bg-muted p-3 rounded border overflow-x-auto">
                    {exportPreview}
                  </pre>
                </ScrollArea>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Theme</DialogTitle>
            <DialogDescription>
              Import a theme from various sources.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={importSource} onValueChange={(value) => setImportSource(value as ImportSource)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="file">File</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <Label>Select Theme File</Label>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose JSON File
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-json">Paste Theme JSON</Label>
                <Textarea
                  id="import-json"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste theme JSON data here..."
                  rows={6}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-url">Theme URL</Label>
                <Input
                  id="import-url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://example.com/theme.json"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowImportDialog(false)}
              disabled={isImporting}
            >
              Cancel
            </Button>
            {importSource !== 'file' && (
              <Button
                onClick={handleImport}
                disabled={
                  isImporting ||
                  (importSource === 'json' && !importData.trim()) ||
                  (importSource === 'url' && !importUrl.trim())
                }
              >
                {isImporting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}