'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Sun, Moon, RotateCcw, RefreshCw, Share, Heart, Code, ChevronLeft, ChevronRight, MoreHorizontal, Search, Shuffle, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useCompanyTheme } from '@/components/providers/DynamicThemeProvider';

// Enhanced theme selector with popover dropdown like the reference
function ThemeSelectorSection() {
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

// Right section actions bar (80% width)
function ActionsSection() {
  const { isDarkMode, toggleThemeMode } = useCompanyTheme();

  return (
    <div className="h-14 border-b bg-background flex items-center justify-end px-6 w-full">
      {/* Action buttons */}
      <div className="flex items-center gap-1">
        {/* Menu dots */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Share className="h-4 w-4 mr-2" />
              Share Theme
            </DropdownMenuItem>
            <DropdownMenuItem>
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem>
              Export as CSS
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Theme Documentation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Vertical separator */}
        <div className="h-6 w-px bg-border mx-2"></div>
        
        {/* Dark/Light mode toggle - Using toggle style like in the image */}
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-muted-foreground" />
          <div 
            className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${
              isDarkMode 
                ? 'bg-orange-500' 
                : 'bg-gray-300'
            }`}
            onClick={toggleThemeMode}
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          <Moon className="h-4 w-4 text-muted-foreground" />
        </div>
        
        {/* Vertical separator */}
        <div className="h-6 w-px bg-border mx-2"></div>
        
        {/* Undo/Redo group */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Undo">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Redo">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Vertical separator */}
        <div className="h-6 w-px bg-border mx-2"></div>
        
        {/* Action buttons group */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="px-3 h-8" title="Reset">
            <RotateCcw className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="px-3 h-8" title="Import">
            <Settings className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="px-3 h-8" title="Share">
            <Share className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="px-3 h-8" title="Save">
            <Heart className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="px-3 h-8" title="View Code">
            <Code className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Code</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main ThemeEditor30 component
export function ThemeEditor30() {
  return (
    <div className="h-full flex flex-col">
      {/* Topbar with 30%-70% distribution */}
      <div className="h-14 flex">
        {/* Left section - 30% width - Theme selector */}
        <div className="w-3/10 min-w-0" style={{ width: '30%' }}>
          <ThemeSelectorSection />
        </div>
        
        {/* Right section - 70% width - Actions */}
        <div className="w-7/10 min-w-0" style={{ width: '70%' }}>
          <ActionsSection />
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Theme Editor 3.0</h2>
            <p className="text-muted-foreground max-w-md">
              Nueva distribución 20%-80% implementada. El selector de temas está en el 20% izquierdo 
              y las acciones en el 80% derecho como solicitaste.
            </p>
            <Badge variant="secondary">Topbar Mejorado ✨</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}