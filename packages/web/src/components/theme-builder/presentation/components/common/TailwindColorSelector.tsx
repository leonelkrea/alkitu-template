/**
 * Tailwind CSS Color Selector Component
 * Provides access to all Tailwind CSS color palette with variants
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Palette, Copy, Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Tailwind CSS Color Palette
 */
const TAILWIND_COLORS = {
  // Grayscale
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617'
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  },
  zinc: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b'
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a'
  },
  stone: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09'
  },
  
  // Colors
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407'
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006'
  },
  lime: {
    50: '#f7fee7',
    100: '#ecfccb',
    200: '#d9f99d',
    300: '#bef264',
    400: '#a3e635',
    500: '#84cc16',
    600: '#65a30d',
    700: '#4d7c0f',
    800: '#3f6212',
    900: '#365314',
    950: '#1a2e05'
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22'
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e'
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344'
  },
  sky: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49'
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b'
  },
  violet: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065'
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764'
  },
  fuchsia: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    950: '#4a044e'
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
    950: '#500724'
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
    950: '#4c0519'
  }
};

/**
 * Color category configuration
 */
const COLOR_CATEGORIES = [
  { id: 'grayscale', name: 'Grayscale', colors: ['slate', 'gray', 'zinc', 'neutral', 'stone'] },
  { id: 'red', name: 'Red Tones', colors: ['red', 'rose', 'pink'] },
  { id: 'orange', name: 'Orange Tones', colors: ['orange', 'amber', 'yellow'] },
  { id: 'green', name: 'Green Tones', colors: ['lime', 'green', 'emerald', 'teal'] },
  { id: 'blue', name: 'Blue Tones', colors: ['cyan', 'sky', 'blue', 'indigo'] },
  { id: 'purple', name: 'Purple Tones', colors: ['violet', 'purple', 'fuchsia'] }
];

/**
 * Popular color combinations
 */
const POPULAR_COMBINATIONS = [
  { name: 'Modern Blue', primary: 'blue-600', secondary: 'slate-100' },
  { name: 'Warm Orange', primary: 'orange-500', secondary: 'orange-50' },
  { name: 'Fresh Green', primary: 'emerald-500', secondary: 'emerald-50' },
  { name: 'Classic Gray', primary: 'gray-800', secondary: 'gray-100' },
  { name: 'Bold Purple', primary: 'purple-600', secondary: 'purple-50' },
  { name: 'Elegant Rose', primary: 'rose-500', secondary: 'rose-50' }
];

/**
 * Props interface
 */
export interface TailwindColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  showFavorites?: boolean;
}

/**
 * Get color value from Tailwind color name
 */
function getTailwindColor(colorName: string): string {
  const [color, shade] = colorName.split('-');
  const colorObj = TAILWIND_COLORS[color as keyof typeof TAILWIND_COLORS];
  if (!colorObj) return '#000000';
  return colorObj[shade as keyof typeof colorObj] || '#000000';
}

/**
 * Tailwind Color Selector Component
 */
export function TailwindColorSelector({
  value,
  onChange,
  label,
  disabled = false,
  className,
  showFavorites = true
}: TailwindColorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  /**
   * Filter colors based on search query
   */
  const filteredColors = useMemo(() => {
    if (!searchQuery) return TAILWIND_COLORS;
    
    const filtered: typeof TAILWIND_COLORS = {};
    Object.entries(TAILWIND_COLORS).forEach(([colorName, shades]) => {
      if (colorName.toLowerCase().includes(searchQuery.toLowerCase())) {
        filtered[colorName as keyof typeof TAILWIND_COLORS] = shades;
      }
    });
    return filtered;
  }, [searchQuery]);

  /**
   * Handle color selection
   */
  const handleColorSelect = useCallback((colorName: string, shade: string) => {
    const hexValue = getTailwindColor(`${colorName}-${shade}`);
    onChange(hexValue);
    setIsOpen(false);
  }, [onChange]);

  /**
   * Copy color to clipboard
   */
  const copyColor = useCallback(async (colorName: string, shade: string) => {
    const hexValue = getTailwindColor(`${colorName}-${shade}`);
    const tailwindName = `${colorName}-${shade}`;
    
    try {
      await navigator.clipboard.writeText(hexValue);
      setCopied(tailwindName);
      toast.success(`Copied ${tailwindName}: ${hexValue}`);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast.error('Failed to copy color');
    }
  }, []);

  /**
   * Toggle favorite color
   */
  const toggleFavorite = useCallback((colorName: string) => {
    setFavorites(prev => 
      prev.includes(colorName) 
        ? prev.filter(f => f !== colorName)
        : [...prev, colorName]
    );
  }, []);

  /**
   * Get current color info
   */
  const currentColorInfo = useMemo(() => {
    // Try to find matching Tailwind color
    for (const [colorName, shades] of Object.entries(TAILWIND_COLORS)) {
      for (const [shade, hexValue] of Object.entries(shades)) {
        if (hexValue.toLowerCase() === value.toLowerCase()) {
          return { name: `${colorName}-${shade}`, hex: hexValue };
        }
      }
    }
    return { name: 'Custom', hex: value };
  }, [value]);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      
      <div className="flex items-center space-x-2">
        {/* Color Preview */}
        <div 
          className="w-10 h-10 rounded-md border-2 border-border shadow-sm cursor-pointer flex-shrink-0"
          style={{ backgroundColor: value }}
          onClick={() => !disabled && setIsOpen(true)}
        />
        
        {/* Color Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">
            {currentColorInfo.name}
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {currentColorInfo.hex}
          </div>
        </div>
        
        {/* Tailwind Selector Button */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              className="px-3"
            >
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          
          <PopoverContent className="w-96 p-0" align="start">
            <div className="p-4">
              {/* Search */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search colors..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Tabs */}
              <Tabs defaultValue="categories" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
                
                {/* Categories Tab */}
                <TabsContent value="categories" className="mt-4">
                  <ScrollArea className="h-80">
                    <div className="space-y-4">
                      {COLOR_CATEGORIES.map((category) => (
                        <div key={category.id} className="space-y-2">
                          <h4 className="text-sm font-medium text-foreground">
                            {category.name}
                          </h4>
                          <div className="space-y-2">
                            {category.colors.map((colorName) => {
                              if (!filteredColors[colorName as keyof typeof filteredColors]) return null;
                              
                              const shades = filteredColors[colorName as keyof typeof filteredColors];
                              const isFavorite = favorites.includes(colorName);
                              
                              return (
                                <div key={colorName} className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground capitalize">
                                      {colorName}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleFavorite(colorName)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Star 
                                        className={cn(
                                          "w-3 h-3",
                                          isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                        )}
                                      />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-11 gap-1">
                                    {Object.entries(shades).map(([shade, hexValue]) => (
                                      <div key={shade} className="relative group">
                                        <button
                                          className="w-6 h-6 rounded border border-border hover:border-primary transition-colors"
                                          style={{ backgroundColor: hexValue }}
                                          onClick={() => handleColorSelect(colorName, shade)}
                                          title={`${colorName}-${shade}: ${hexValue}`}
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => copyColor(colorName, shade)}
                                          className="absolute -top-1 -right-1 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border"
                                        >
                                          {copied === `${colorName}-${shade}` ? (
                                            <Check className="w-2 h-2 text-green-500" />
                                          ) : (
                                            <Copy className="w-2 h-2" />
                                          )}
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                {/* Popular Tab */}
                <TabsContent value="popular" className="mt-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">
                      Popular Combinations
                    </h4>
                    <div className="space-y-2">
                      {POPULAR_COMBINATIONS.map((combo) => {
                        const primaryHex = getTailwindColor(combo.primary);
                        const secondaryHex = getTailwindColor(combo.secondary);
                        
                        return (
                          <div 
                            key={combo.name}
                            className="flex items-center justify-between p-2 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                            onClick={() => onChange(primaryHex)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex">
                                <div 
                                  className="w-6 h-6 rounded-l border border-border"
                                  style={{ backgroundColor: primaryHex }}
                                />
                                <div 
                                  className="w-6 h-6 rounded-r border-t border-r border-b border-border"
                                  style={{ backgroundColor: secondaryHex }}
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{combo.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {combo.primary} + {combo.secondary}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Favorites */}
                    {showFavorites && favorites.length > 0 && (
                      <div className="space-y-2 pt-4 border-t border-border">
                        <h4 className="text-sm font-medium text-foreground">
                          Favorite Colors
                        </h4>
                        <div className="grid grid-cols-6 gap-1">
                          {favorites.map((colorName) => {
                            const shades = TAILWIND_COLORS[colorName as keyof typeof TAILWIND_COLORS];
                            const shade500 = shades['500'] || Object.values(shades)[Math.floor(Object.values(shades).length / 2)];
                            
                            return (
                              <button
                                key={colorName}
                                className="w-8 h-8 rounded border border-border hover:border-primary transition-colors"
                                style={{ backgroundColor: shade500 }}
                                onClick={() => onChange(shade500)}
                                title={colorName}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}