/**
 * Theme Builder - Action Bar Component
 * Top bar with theme management actions
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Save,
  Download,
  Upload,
  Share2,
  Code2,
  Eye,
  EyeOff,
  RotateCcw,
  Copy,
  FileJson,
  FileCode,
  Palette,
  History,
  Settings,
  ChevronDown,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Local imports
import { useThemeBuilder, useThemeBuilderUI } from '../../contexts/ThemeBuilderContext';
import { useThemeImportExport } from '../../hooks/useThemeImportExport';
import { ImportExportThemeUseCase } from '../../../domain/use-cases/theme/import-export-theme.use-case';
import { ThemeStorageAdapter } from '../../../infrastructure/storage/theme-storage.adapter';
import { CssConverter } from '../../../infrastructure/converters/css-converter';
import type { ThemeData } from '../../../shared/types/theme.types';

/**
 * Action bar props
 */
export interface ActionBarProps {
  className?: string;
  onThemeChange?: (theme: ThemeData) => void;
}

/**
 * Theme name dialog component
 */
interface ThemeNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  currentName?: string;
}

function ThemeNameDialog({ open, onOpenChange, onSave, currentName = '' }: ThemeNameDialogProps) {
  const [name, setName] = useState(currentName);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Theme</DialogTitle>
          <DialogDescription>
            Give your theme a memorable name
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="theme-name">Theme Name</Label>
            <Input
              id="theme-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Theme"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Export format selector
 */
interface ExportFormatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: 'json' | 'css' | 'scss') => void;
}

function ExportFormatDialog({ open, onOpenChange, onExport }: ExportFormatDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Theme</DialogTitle>
          <DialogDescription>
            Choose the format for your theme export
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => {
              onExport('json');
              onOpenChange(false);
            }}
          >
            <FileJson className="mr-2 h-4 w-4" />
            JSON Format
            <span className="ml-auto text-xs text-muted-foreground">Complete theme data</span>
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => {
              onExport('css');
              onOpenChange(false);
            }}
          >
            <FileCode className="mr-2 h-4 w-4" />
            CSS Variables
            <span className="ml-auto text-xs text-muted-foreground">For web projects</span>
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => {
              onExport('scss');
              onOpenChange(false);
            }}
          >
            <FileCode className="mr-2 h-4 w-4" />
            SCSS Variables
            <span className="ml-auto text-xs text-muted-foreground">For Sass projects</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Action bar component
 */
export function ActionBar({ className, onThemeChange }: ActionBarProps) {
  const { 
    theme,
    currentTheme,
    hasUnsavedChanges,
    isSaving,
    saveTheme,
    resetTheme,
    validationErrors
  } = useThemeBuilder();
  
  const {
    showCodePanel,
    setShowCodePanel,
    previewMode,
    setPreviewMode
  } = useThemeBuilderUI();

  const { exportTheme, importTheme } = useThemeImportExport();
  
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  /**
   * Handles theme save
   */
  const handleSave = useCallback(async (name?: string) => {
    if (!currentTheme) return;
    
    try {
      await saveTheme(name);
      toast.success('Theme saved successfully');
    } catch (error) {
      toast.error('Failed to save theme');
      console.error('Save error:', error);
    }
  }, [currentTheme, saveTheme]);

  /**
   * Handles theme export
   */
  const handleExport = useCallback(async (format: 'json' | 'css' | 'scss') => {
    if (!currentTheme) return;
    
    setIsExporting(true);
    try {
      await exportTheme(format);
      toast.success(`Theme exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export theme');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [currentTheme, exportTheme]);

  /**
   * Handles theme import
   */
  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importTheme(file);
      toast.success('Theme imported successfully');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to import theme');
      console.error('Import error:', error);
    }
  }, [importTheme]);

  /**
   * Handles theme reset
   */
  const handleReset = useCallback(() => {
    resetTheme();
    toast.success('Theme reset to defaults');
  }, [resetTheme]);

  /**
   * Handles copy theme to clipboard
   */
  const handleCopyTheme = useCallback(async () => {
    if (!currentTheme) return;
    
    try {
      const themeJson = JSON.stringify(currentTheme, null, 2);
      await navigator.clipboard.writeText(themeJson);
      toast.success('Theme copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy theme');
    }
  }, [currentTheme]);

  /**
   * Gets theme name for display
   */
  const themeName = theme?.name || 'Untitled Theme';

  return (
    <div className={cn('flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
      {/* Left side - Theme info and status */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="h-4 w-4" />
            {themeName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved changes
              </Badge>
            )}
            {validationErrors.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {validationErrors.length} validation {validationErrors.length === 1 ? 'error' : 'errors'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* View toggles */}
        <div className="flex items-center gap-1 mr-2">
          <Button
            variant={previewMode ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="h-8"
          >
            {previewMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Preview</span>
          </Button>
          <Button
            variant={showCodePanel ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setShowCodePanel(!showCodePanel)}
            className="h-8"
          >
            <Code2 className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Code</span>
          </Button>
        </div>

        {/* Save button */}
        <Button
          onClick={() => hasUnsavedChanges ? setShowNameDialog(true) : handleSave()}
          disabled={isSaving || validationErrors.length > 0}
          size="sm"
          className="h-8"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Save</span>
        </Button>

        {/* More actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Settings className="h-4 w-4" />
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Theme Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Import Theme
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export Theme
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleCopyTheme}>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => toast.info('Theme history coming soon')}>
              <History className="mr-2 h-4 w-4" />
              Version History
              <Badge variant="outline" className="ml-auto text-xs">Soon</Badge>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => toast.info('Theme sharing coming soon')}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Theme
              <Badge variant="outline" className="ml-auto text-xs">Soon</Badge>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleReset}
              className="text-destructive focus:text-destructive"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.css"
        onChange={handleImport}
        className="hidden"
      />

      {/* Dialogs */}
      <ThemeNameDialog
        open={showNameDialog}
        onOpenChange={setShowNameDialog}
        onSave={handleSave}
        currentName={themeName}
      />

      <ExportFormatDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExport}
      />
    </div>
  );
}