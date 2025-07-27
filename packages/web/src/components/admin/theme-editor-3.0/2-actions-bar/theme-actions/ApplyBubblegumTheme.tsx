'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { useThemeEditor } from '../../context/ThemeEditorContext';
import { BUBBLEGUM_THEME } from '../../constants/bubblegum-theme';

export function ApplyBubblegumTheme() {
  const { setTheme } = useThemeEditor();

  const handleApplyBubblegumTheme = () => {
    // Apply the complete Bubblegum theme to the editor
    setTheme(BUBBLEGUM_THEME);
  };

  return (
    <Button
      onClick={handleApplyBubblegumTheme}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-cyan-50 hover:from-pink-100 hover:to-cyan-100 border-pink-200 text-pink-700 hover:text-pink-800 dark:from-pink-950/20 dark:to-cyan-950/20 dark:border-pink-800 dark:text-pink-300 dark:hover:text-pink-200"
    >
      <Palette className="h-4 w-4" />
      Apply Bubblegum Theme
    </Button>
  );
}