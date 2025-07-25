/**
 * Theme Selector Component
 * Dropdown selector for choosing and managing themes
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { 
  ChevronDown,
  Palette,
  Plus,
  Search,
  Star,
  Copy,
  Trash2,
  Download,
  Upload,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ThemeData } from '../../../shared/types/theme.types';

/**
 * Theme preset interface
 */
export interface ThemePreset {
  id: string;
  name: string;
  description?: string;
  preview: {
    primary: string;
    secondary: string;
    background: string;
  };
  data: ThemeData;
  category: 'built-in' | 'user' | 'imported';
  isFavorite?: boolean;
  lastUsed?: Date;
}

/**
 * Theme selector props
 */
export interface ThemeSelectorProps {
  // Current theme
  currentTheme?: ThemeData;
  onThemeChange: (theme: ThemeData) => void;
  
  // Available themes
  themes?: ThemePreset[];
  onLoadThemes?: () => Promise<ThemePreset[]>;
  onSaveTheme?: (theme: ThemeData, name: string) => Promise<void>;
  onDeleteTheme?: (themeId: string) => Promise<void>;
  
  // Configuration
  label?: string;
  disabled?: boolean;
  className?: string;
  
  // Features
  showCreateNew?: boolean;
  showImportExport?: boolean;
  showFavorites?: boolean;
  allowDelete?: boolean;
}

/**
 * Built-in theme presets
 */
const BUILT_IN_THEMES: ThemePreset[] = [
  {
    id: 'default-light',
    name: 'Default Light',
    description: 'Clean and modern light theme',
    category: 'built-in',
    preview: {
      primary: '#3b82f6',
      secondary: '#f1f5f9',
      background: '#ffffff'
    },
    data: {
      name: 'Default Light',
      lightColors: {
        primary: '#3b82f6',
        'primary-foreground': '#ffffff',
        secondary: '#f1f5f9',
        'secondary-foreground': '#334155',
        background: '#ffffff',
        foreground: '#0f172a',
        card: '#ffffff',
        'card-foreground': '#0f172a',
        popover: '#ffffff',
        'popover-foreground': '#0f172a',
        muted: '#f1f5f9',
        'muted-foreground': '#64748b',
        accent: '#f1f5f9',
        'accent-foreground': '#0f172a',
        destructive: '#ef4444',
        'destructive-foreground': '#fefefe',
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#3b82f6',
      }
    }
  },
  {
    id: 'default-dark',
    name: 'Default Dark',
    description: 'Sleek dark theme for low-light environments',
    category: 'built-in',
    preview: {
      primary: '#3b82f6',
      secondary: '#1e293b',
      background: '#0f172a'
    },
    data: {
      name: 'Default Dark',
      darkColors: {
        primary: '#3b82f6',
        'primary-foreground': '#ffffff',
        secondary: '#1e293b',
        'secondary-foreground': '#f1f5f9',
        background: '#0f172a',
        foreground: '#f8fafc',
        card: '#1e293b',
        'card-foreground': '#f8fafc',
        popover: '#1e293b',
        'popover-foreground': '#f8fafc',
        muted: '#1e293b',
        'muted-foreground': '#94a3b8',
        accent: '#1e293b',
        'accent-foreground': '#f8fafc',
        destructive: '#ef4444',
        'destructive-foreground': '#fefefe',
        border: '#334155',
        input: '#334155',
        ring: '#3b82f6',
      }
    }
  },
  {
    id: 'emerald-theme',
    name: 'Emerald Green',
    description: 'Fresh and vibrant green theme',
    category: 'built-in',
    preview: {
      primary: '#10b981',
      secondary: '#ecfdf5',
      background: '#ffffff'
    },
    data: {
      name: 'Emerald Green',
      lightColors: {
        primary: '#10b981',
        'primary-foreground': '#ffffff',
        secondary: '#ecfdf5',
        'secondary-foreground': '#064e3b',
        background: '#ffffff',
        foreground: '#0f172a',
        card: '#ffffff',
        'card-foreground': '#0f172a',
        popover: '#ffffff',
        'popover-foreground': '#0f172a',
        muted: '#f0fdf4',
        'muted-foreground': '#6b7280',
        accent: '#ecfdf5',
        'accent-foreground': '#064e3b',
        destructive: '#ef4444',
        'destructive-foreground': '#fefefe',
        border: '#d1d5db',
        input: '#d1d5db',
        ring: '#10b981',
      }
    }
  },
  {
    id: 'rose-theme',
    name: 'Rose Pink',
    description: 'Elegant pink theme with warm tones',
    category: 'built-in',
    preview: {
      primary: '#f43f5e',
      secondary: '#fff1f2',
      background: '#ffffff'
    },
    data: {
      name: 'Rose Pink',
      lightColors: {
        primary: '#f43f5e',
        'primary-foreground': '#ffffff',
        secondary: '#fff1f2',
        'secondary-foreground': '#881337',
        background: '#ffffff',
        foreground: '#0f172a',
        card: '#ffffff',
        'card-foreground': '#0f172a',
        popover: '#ffffff',
        'popover-foreground': '#0f172a',
        muted: '#fef2f2',
        'muted-foreground': '#6b7280',
        accent: '#fff1f2',
        'accent-foreground': '#881337',
        destructive: '#dc2626',
        'destructive-foreground': '#fefefe',
        border: '#d1d5db',
        input: '#d1d5db',
        ring: '#f43f5e',
      }
    }
  }
];

/**
 * Theme Selector Component
 */
export function ThemeSelector({
  currentTheme,
  onThemeChange,
  themes = [],
  onLoadThemes,
  onSaveTheme,
  onDeleteTheme,
  label,
  disabled = false,
  className,
  showCreateNew = true,
  showImportExport = true,
  showFavorites = true,
  allowDelete = true
}: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [loading, setLoading] = useState(false);

  // Combine built-in themes with user themes
  const allThemes = useMemo(() => {
    return [...BUILT_IN_THEMES, ...themes];
  }, [themes]);

  // Filter themes based on search
  const filteredThemes = useMemo(() => {
    if (!searchQuery) return allThemes;
    return allThemes.filter(theme => 
      theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allThemes, searchQuery]);

  // Group themes by category
  const themesByCategory = useMemo(() => {
    const grouped: Record<string, ThemePreset[]> = {};
    filteredThemes.forEach(theme => {
      if (!grouped[theme.category]) {
        grouped[theme.category] = [];
      }
      grouped[theme.category].push(theme);
    });
    return grouped;
  }, [filteredThemes]);

  /**
   * Handle theme selection
   */
  const handleThemeSelect = useCallback((theme: ThemePreset) => {
    onThemeChange(theme.data);
    setIsOpen(false);
    toast.success(`Applied theme: ${theme.name}`);
  }, [onThemeChange]);

  /**
   * Create new theme
   */
  const handleCreateTheme = useCallback(async () => {
    if (!currentTheme || !newThemeName.trim() || !onSaveTheme) return;
    
    setLoading(true);
    try {
      await onSaveTheme(currentTheme, newThemeName.trim());
      setNewThemeName('');
      setShowCreateDialog(false);
      toast.success('Theme saved successfully');
      
      // Reload themes if available
      if (onLoadThemes) {
        await onLoadThemes();
      }
    } catch (error) {
      toast.error('Failed to save theme');
    } finally {
      setLoading(false);
    }
  }, [currentTheme, newThemeName, onSaveTheme, onLoadThemes]);

  /**
   * Toggle theme favorite
   */
  const toggleFavorite = useCallback((themeId: string) => {
    setFavorites(prev => 
      prev.includes(themeId) 
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    );
  }, []);

  /**
   * Delete theme
   */
  const handleDeleteTheme = useCallback(async (themeId: string) => {
    if (!onDeleteTheme) return;
    
    try {
      await onDeleteTheme(themeId);
      toast.success('Theme deleted');
      
      // Reload themes if available
      if (onLoadThemes) {
        await onLoadThemes();
      }
    } catch (error) {
      toast.error('Failed to delete theme');
    }
  }, [onDeleteTheme, onLoadThemes]);

  /**
   * Get current theme name
   */
  const currentThemeName = useMemo(() => {
    if (!currentTheme) return 'No theme selected';
    
    // Try to find matching theme
    const matchingTheme = allThemes.find(theme => theme.data.name === currentTheme.name);
    return matchingTheme?.name || currentTheme.name || 'Custom Theme';
  }, [currentTheme, allThemes]);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className="w-full justify-between"
          >
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span className="truncate">{currentThemeName}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-80" align="start">
          {/* Search */}
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search themes..."
                className="pl-8 h-8"
              />
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Actions */}
          <div className="p-2 space-y-1">
            {showCreateNew && onSaveTheme && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateDialog(true)}
                className="w-full justify-start"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Theme
              </Button>
            )}
            
            {showImportExport && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {/* TODO: Import functionality */}}
                  className="w-full justify-start"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Theme
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {/* TODO: Export functionality */}}
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Current
                </Button>
              </>
            )}
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Themes */}
          <ScrollArea className="h-60">
            <div className="p-1">
              {Object.entries(themesByCategory).map(([category, categoryThemes]) => (
                <div key={category} className="mb-4">
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                    {category === 'built-in' ? 'Built-in Themes' : 
                     category === 'user' ? 'My Themes' : 'Imported Themes'}
                  </DropdownMenuLabel>
                  
                  {categoryThemes.map((theme) => {
                    const isFavorite = favorites.includes(theme.id);
                    
                    return (
                      <DropdownMenuItem
                        key={theme.id}
                        className="p-0"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <div className="w-full p-2 flex items-center justify-between group">
                          <div 
                            className="flex items-center space-x-3 flex-1 cursor-pointer"
                            onClick={() => handleThemeSelect(theme)}
                          >
                            {/* Theme Preview */}
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full border border-border"
                                style={{ backgroundColor: theme.preview.primary }}
                              />
                              <div 
                                className="w-4 h-4 rounded-full border border-border -ml-1"
                                style={{ backgroundColor: theme.preview.secondary }}
                              />
                              <div 
                                className="w-4 h-4 rounded-full border border-border -ml-1"
                                style={{ backgroundColor: theme.preview.background }}
                              />
                            </div>
                            
                            {/* Theme Info */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {theme.name}
                              </div>
                              {theme.description && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {theme.description}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {showFavorites && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(theme.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Star 
                                  className={cn(
                                    "w-3 h-3",
                                    isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                  )}
                                />
                              </Button>
                            )}
                            
                            {allowDelete && theme.category === 'user' && onDeleteTheme && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTheme(theme.id)}
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              ))}
              
              {filteredThemes.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No themes found
                </div>
              )}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Create Theme Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Theme</DialogTitle>
            <DialogDescription>
              Save your current theme configuration with a custom name.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-name">Theme Name</Label>
              <Input
                id="theme-name"
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                placeholder="Enter theme name..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleCreateTheme();
                  }
                }}
              />
            </div>
            
            {/* Current Theme Preview */}
            {currentTheme && (
              <div className="space-y-2">
                <Label>Current Theme Preview</Label>
                <div className="p-3 rounded-lg border border-border bg-muted/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-6 h-6 rounded border border-border"
                      style={{ backgroundColor: currentTheme.lightColors?.primary || '#3b82f6' }}
                    />
                    <div 
                      className="w-6 h-6 rounded border border-border"
                      style={{ backgroundColor: currentTheme.lightColors?.secondary || '#f1f5f9' }}
                    />
                    <div 
                      className="w-6 h-6 rounded border border-border"
                      style={{ backgroundColor: currentTheme.lightColors?.background || '#ffffff' }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Object.keys(currentTheme.lightColors || {}).length} colors configured
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTheme}
              disabled={!newThemeName.trim() || loading}
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Theme
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}