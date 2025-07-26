'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { ViewportSelector } from './viewport-selector';
import { ThemeMode } from './theme-mode';
import { HistoryControls } from './history-controls';
import { ImportExport } from './import-export';
import { SaveControls } from './save-controls';
import { ResetButton } from './reset-button';
import { DEFAULT_THEMES } from '../constants/default-themes';

export function ActionsBar() {
  const { 
    state, 
    setViewport, 
    setThemeMode,
    setTheme,
    setError,
    markSaved
  } = useThemeEditor();

  // Get current theme or default
  const currentTheme = state.currentTheme || DEFAULT_THEMES[0];

  // Mock history state (future: implement real history)
  const historyState = {
    canUndo: false,
    canRedo: false,
    undoCount: 0,
    redoCount: 0
  };

  // Handlers
  const handleUndo = () => {
    // TODO: Implement undo functionality
    console.log('Undo');
  };

  const handleRedo = () => {
    // TODO: Implement redo functionality
    console.log('Redo');
  };

  const handleImport = (theme: any) => {
    setTheme(theme);
  };

  const handleImportError = (error: string) => {
    setError(error);
  };

  const handleSave = (theme: any) => {
    // TODO: Implement save to localStorage/API
    console.log('Saving theme:', theme.name);
    markSaved();
  };

  const handleReset = () => {
    // Reset to default theme
    setTheme(DEFAULT_THEMES[0]);
    markSaved();
  };

  return (
    <div className="h-[75px] border-b border-border bg-card flex items-center justify-between px-4">
      {/* Left side - Viewport Selector */}
      <ViewportSelector
        currentViewport={state.viewport.current}
        onViewportChange={setViewport}
        showIndicator={false}
      />

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Theme Mode Toggle */}
        <ThemeMode
          mode={state.themeMode}
          onModeChange={setThemeMode}
        />

        {/* History Controls */}
        <HistoryControls
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyState.canUndo}
          canRedo={historyState.canRedo}
          undoCount={historyState.undoCount}
          redoCount={historyState.redoCount}
        />

        {/* Reset Button */}
        <ResetButton
          onReset={handleReset}
          hasChanges={state.editor.hasUnsavedChanges}
        />

        {/* Actions */}
        <div className="flex gap-1">
          <ImportExport
            theme={currentTheme}
            onImport={handleImport}
            onImportError={handleImportError}
          />
          <SaveControls
            theme={currentTheme}
            onSave={handleSave}
            hasUnsavedChanges={state.editor.hasUnsavedChanges}
          />
        </div>
      </div>
    </div>
  );
}