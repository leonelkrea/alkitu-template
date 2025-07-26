'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { DEFAULT_THEMES, THEMES_BY_ID } from '../constants/default-themes';
import { ThemeDropdown } from './ThemeDropdown';
import { ThemeNavigation } from './ThemeNavigation';
import { ThemeData } from '../types/theme.types';

export function ThemeSelector() {
  const { state, setTheme } = useThemeEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeData>(DEFAULT_THEMES[0]);
  const [savedThemes] = useState<ThemeData[]>([]); // Future: load from localStorage/API

  // Initialize with default theme if none selected
  useEffect(() => {
    if (!state.currentTheme) {
      setTheme(DEFAULT_THEMES[0]);
      setCurrentTheme(DEFAULT_THEMES[0]);
    } else {
      setCurrentTheme(state.currentTheme);
    }
  }, [state.currentTheme, setTheme]);

  // Theme navigation handlers
  const handleThemeSelect = (theme: ThemeData) => {
    setCurrentTheme(theme);
    setTheme(theme);
  };

  const handlePreviousTheme = () => {
    const currentIndex = DEFAULT_THEMES.findIndex(t => t.id === currentTheme.id);
    const previousIndex = currentIndex <= 0 ? DEFAULT_THEMES.length - 1 : currentIndex - 1;
    const previousTheme = DEFAULT_THEMES[previousIndex];
    handleThemeSelect(previousTheme);
  };

  const handleNextTheme = () => {
    const currentIndex = DEFAULT_THEMES.findIndex(t => t.id === currentTheme.id);
    const nextIndex = currentIndex >= DEFAULT_THEMES.length - 1 ? 0 : currentIndex + 1;
    const nextTheme = DEFAULT_THEMES[nextIndex];
    handleThemeSelect(nextTheme);
  };

  const handleRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_THEMES.length);
    const randomTheme = DEFAULT_THEMES[randomIndex];
    handleThemeSelect(randomTheme);
  };

  return (
    <div className="h-[75px] border-b border-border bg-card flex items-center justify-between px-4">
      {/* Theme Dropdown */}
      <div className="flex-1 max-w-xs">
        <ThemeDropdown
          themes={DEFAULT_THEMES}
          selectedTheme={currentTheme}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onThemeSelect={handleThemeSelect}
          isOpen={isDropdownOpen}
          onOpenChange={setIsDropdownOpen}
          savedThemes={savedThemes}
        />
      </div>

      {/* Navigation Controls */}
      <div className="ml-2">
        <ThemeNavigation
          onPrevious={handlePreviousTheme}
          onNext={handleNextTheme}
          onRandom={handleRandomTheme}
        />
      </div>
    </div>
  );
}