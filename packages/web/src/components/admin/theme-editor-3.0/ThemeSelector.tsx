'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Shuffle, Check, Heart, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCompanyTheme } from '@/components/providers/DynamicThemeProvider';

// Enhanced theme selector with popover dropdown
export function ThemeSelector() {
  const { isDarkMode, toggleThemeMode } = useCompanyTheme();
  const [selectedTheme, setSelectedTheme] = useState('amber-minimal');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Mock theme data - this would come from your theme system
  const themes = [
    { id: 'default', name: 'Default', colors: ['#000000', '#ffffff', '#f3f4f6', '#374151'] },
    { id: 'amber-minimal', name: 'Amber Minimal', colors: ['#f59e0b', '#451a03', '#fef3c7', '#92400e'] },
    { id: 'amethyst-haze', name: 'Amethyst Haze', colors: ['#8b5cf6', '#3730a3', '#ede9fe', '#6d28d9'] },
    { id: 'bold-tech', name: 'Bold Tech', colors: ['#3b82f6', '#1e40af', '#dbeafe', '#2563eb'] },
    { id: 'bubblegum', name: 'Bubblegum', colors: ['#ec4899', '#be185d', '#fce7f3', '#db2777'] },
    { id: 'caffeine', name: 'Caffeine', colors: ['#06b6d4', '#0e7490', '#cffafe', '#0891b2'] },
    { id: 'candyland', name: 'Candyland', colors: ['#f97316', '#ea580c', '#fed7aa', '#fb923c'] },
  ];

  const currentTheme = themes.find(t => t.id === selectedTheme) || themes[1];

  // Filter themes based on search query
  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateTheme = (direction: 'prev' | 'next') => {
    const currentIndex = themes.findIndex(t => t.id === selectedTheme);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex >= themes.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex <= 0 ? themes.length - 1 : currentIndex - 1;
    }
    
    setSelectedTheme(themes[newIndex].id);
  };

  const randomTheme = () => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setSelectedTheme(themes[randomIndex].id);
  };

  return (
    <div className="h-14 border-r border-b bg-background flex items-center w-full px-3">
      {/* Enhanced theme selector dropdown */}
      <div className="flex items-center flex-1 pr-3">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-8 justify-start bg-transparent border-0 shadow-none focus:ring-0 hover:bg-muted/50"
            >
              {/* Theme color dots preview */}
              <div className="flex gap-1 mr-2">
                {currentTheme.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="truncate">{currentTheme.name}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            {/* Search bar */}
            <div className="flex items-center border-b px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Header with theme count and controls */}
            <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/20">
              <span className="text-sm text-muted-foreground">
                {filteredThemes.length} themes
              </span>
              <div className="flex items-center gap-2">
                {/* Theme mode toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={toggleThemeMode}
                  title="Toggle theme mode"
                >
                  {isDarkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                </Button>
                {/* Random theme */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={randomTheme}
                  title="Random theme"
                >
                  <Shuffle className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Save favorite section */}
            <div className="px-3 py-2 border-b bg-muted/10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span>Save</span>
                <span className="text-xs">a theme to find it here.</span>
              </div>
            </div>

            {/* Built-in Themes header */}
            <div className="px-3 py-2 border-b">
              <span className="text-sm font-medium">Built-in Themes</span>
            </div>

            {/* Theme list */}
            <div className="max-h-64 overflow-y-auto">
              {filteredThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer ${
                    theme.id === selectedTheme ? 'bg-muted' : ''
                  }`}
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    setIsOpen(false);
                  }}
                >
                  {/* Theme color dots */}
                  <div className="flex gap-1">
                    {theme.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  {/* Theme name */}
                  <span className="flex-1 text-sm">{theme.name}</span>
                  
                  {/* Check mark for selected theme */}
                  {theme.id === selectedTheme && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Vertical separator */}
      <div className="h-6 w-px bg-border mx-2"></div>

      {/* Navigation arrows */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-muted flex items-center justify-center"
          onClick={() => navigateTheme('prev')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Vertical separator between arrows */}
        <div className="h-4 w-px bg-border mx-1"></div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-muted flex items-center justify-center"
          onClick={() => navigateTheme('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}