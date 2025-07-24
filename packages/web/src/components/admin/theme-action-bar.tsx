'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Heart,
  Braces,
  RotateCcw,
  Upload,
  Download,
  MoreHorizontal,
  Sun,
  Moon,
  Undo2,
  Redo2,
  Loader2,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useCompanyTheme } from '@/components/providers/DynamicThemeProvider';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface ThemeActionBarProps {
  lightColors: Record<string, string>;
  darkColors: Record<string, string>;
  isDarkMode: boolean;
  onToggleMode: () => void;
  onSave: () => void;
  onReset: () => void;
  onImport: () => void;
  onExport?: (format: 'json' | 'css') => void;
  onShowCode: () => void;
  hasUnsavedChanges: boolean;
  previewMode?: boolean;
  onTogglePreview?: () => void;
}

export function ThemeActionBar({
  lightColors,
  darkColors,
  isDarkMode,
  onToggleMode,
  onSave,
  onReset,
  onImport,
  onExport,
  onShowCode,
  hasUnsavedChanges,
  previewMode = false,
  onTogglePreview,
}: ThemeActionBarProps) {
  const { theme } = useCompanyTheme();
  const [showContrast, setShowContrast] = useState(false);

  return (
    <div className="border-b">
      <div className="flex h-14 w-full items-center justify-end gap-1 px-4">
        {/* More Options Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>More options</TooltipContent>
            </Tooltip>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowContrast(!showContrast)}>
              <Settings className="size-4 mr-2" />
              Contrast Checker
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onExport && (
              <>
                <DropdownMenuItem onClick={() => onExport('json')}>
                  <Download className="size-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('css')}>
                  <Download className="size-4 mr-2" />
                  Export as CSS
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem>View History</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-1 h-8" />

        {/* Theme Mode Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onToggleMode}>
              {isDarkMode ? (
                <Sun className="size-3.5" />
              ) : (
                <Moon className="size-3.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-8" />

        {/* Undo/Redo (placeholder for now) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" disabled>
              <Undo2 className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" disabled>
              <Redo2 className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-8" />

        {/* Reset Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              disabled={!hasUnsavedChanges}
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden text-sm md:block ml-1">Reset</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset to original</TooltipContent>
        </Tooltip>

        {/* Import Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onImport}>
              <Upload className="size-3.5" />
              <span className="hidden text-sm md:block ml-1">Import</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Import theme</TooltipContent>
        </Tooltip>

        {/* Save Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              disabled={!hasUnsavedChanges}
            >
              <Heart className="size-3.5" />
              <span className="hidden text-sm md:block ml-1">Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save theme</TooltipContent>
        </Tooltip>

        {/* Code Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onShowCode}>
              <Braces className="size-3.5" />
              <span className="hidden text-sm md:block ml-1">Code</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>View theme code</TooltipContent>
        </Tooltip>
      </div>

      {/* Contrast Checker Panel */}
      {showContrast && (
        <div className="border-t bg-muted/50 p-4">
          <div className="text-sm font-medium mb-2">Contrast Checker</div>
          <div className="text-xs text-muted-foreground">
            Check color contrast ratios for accessibility compliance. Feature
            coming soon...
          </div>
        </div>
      )}
    </div>
  );
}
