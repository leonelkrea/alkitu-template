/**
 * Enhanced Color Picker Component
 * Advanced color picker with visual palette, format support, and accessibility
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Palette, 
  Dropper, 
  Copy, 
  Check, 
  RotateCcw,
  Shuffle,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Color format types
 */
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

/**
 * Color picker props
 */
export interface EnhancedColorPickerProps {
  // Basic props
  label?: string;
  value: string;
  onChange: (value: string) => void;
  
  // Configuration
  disabled?: boolean;
  className?: string;
  
  // Color formats
  supportedFormats?: ColorFormat[];
  defaultFormat?: ColorFormat;
  
  // Features
  showPalette?: boolean;
  showHistory?: boolean;
  allowTransparency?: boolean;
  
  // Callbacks
  onFormatChange?: (format: ColorFormat) => void;
}

/**
 * Predefined color palette
 */
const COLOR_PALETTE = [
  // Grays
  '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6', '#ffffff',
  // Reds
  '#7f1d1d', '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2',
  // Oranges
  '#9a3412', '#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5',
  // Yellows
  '#a16207', '#ca8a04', '#eab308', '#facc15', '#fde047', '#fef08a', '#fefce8',
  // Greens
  '#14532d', '#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac', '#dcfce7',
  // Blues
  '#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe',
  // Purples
  '#581c87', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#f3f4f6',
  // Pinks
  '#831843', '#be185d', '#e91e63', '#ec4899', '#f472b6', '#f9a8d4', '#fce7f3',
];

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Enhanced Color Picker Component
 */
export function EnhancedColorPicker({
  label,
  value,
  onChange,
  disabled = false,
  className,
  supportedFormats = ['hex', 'rgb', 'hsl'],
  defaultFormat = 'hex',
  showPalette = true,
  showHistory = true,
  allowTransparency = false,
  onFormatChange
}: EnhancedColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<ColorFormat>(defaultFormat);
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  
  // Parse current color
  const currentColor = useMemo(() => {
    const rgb = hexToRgb(value);
    if (!rgb) return { r: 255, g: 255, b: 255 };
    return rgb;
  }, [value]);

  const currentHsl = useMemo(() => {
    return rgbToHsl(currentColor.r, currentColor.g, currentColor.b);
  }, [currentColor]);

  /**
   * Handle color change from sliders
   */
  const handleSliderChange = useCallback((type: 'h' | 's' | 'l' | 'r' | 'g' | 'b', newValue: number[]) => {
    const val = newValue[0];
    
    if (currentFormat === 'hsl') {
      const newHsl = { ...currentHsl };
      newHsl[type as 'h' | 's' | 'l'] = val;
      const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      onChange(hex);
    } else {
      const newRgb = { ...currentColor };
      newRgb[type as 'r' | 'g' | 'b'] = val;
      const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      onChange(hex);
    }
  }, [currentColor, currentHsl, currentFormat, onChange]);

  /**
   * Handle palette color selection
   */
  const handlePaletteSelect = useCallback((color: string) => {
    onChange(color);
    addToHistory(color);
  }, [onChange]);

  /**
   * Add color to history
   */
  const addToHistory = useCallback((color: string) => {
    setColorHistory(prev => {
      const filtered = prev.filter(c => c !== color);
      return [color, ...filtered].slice(0, 12);
    });
  }, []);

  /**
   * Copy color to clipboard
   */
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success('Color copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy color');
    }
  }, [value]);

  /**
   * Generate random color
   */
  const generateRandomColor = useCallback(() => {
    const randomColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    onChange(randomColor);
    addToHistory(randomColor);
  }, [onChange, addToHistory]);

  /**
   * Format color value for display
   */
  const formatColorValue = useCallback((color: string, format: ColorFormat) => {
    const rgb = hexToRgb(color);
    if (!rgb) return color;

    switch (format) {
      case 'hex':
        return color;
      case 'rgb':
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'hsl':
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
      case 'oklch':
        // Simplified oklch approximation
        return `oklch(${(rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) / 255} 0.5 ${Math.round(rgbToHsl(rgb.r, rgb.g, rgb.b).h)})`;
      default:
        return color;
    }
  }, []);

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
        
        {/* Color Input */}
        <Input
          value={formatColorValue(value, currentFormat)}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="font-mono text-sm"
          placeholder="#000000"
        />
        
        {/* Advanced Picker Button */}
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
          
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Color Picker</h4>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-8 w-8 p-0"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateRandomColor}
                    className="h-8 w-8 p-0"
                  >
                    <Shuffle className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              {/* Format Tabs */}
              <Tabs value={currentFormat} onValueChange={(value) => {
                setCurrentFormat(value as ColorFormat);
                onFormatChange?.(value as ColorFormat);
              }}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="hex">HEX</TabsTrigger>
                  <TabsTrigger value="rgb">RGB</TabsTrigger>
                  <TabsTrigger value="hsl">HSL</TabsTrigger>
                </TabsList>
                
                {/* RGB Sliders */}
                <TabsContent value="rgb" className="space-y-3 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Red</Label>
                      <Badge variant="secondary" className="text-xs">{currentColor.r}</Badge>
                    </div>
                    <Slider
                      value={[currentColor.r]}
                      onValueChange={(value) => handleSliderChange('r', value)}
                      max={255}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Green</Label>
                      <Badge variant="secondary" className="text-xs">{currentColor.g}</Badge>
                    </div>
                    <Slider
                      value={[currentColor.g]}
                      onValueChange={(value) => handleSliderChange('g', value)}
                      max={255}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Blue</Label>
                      <Badge variant="secondary" className="text-xs">{currentColor.b}</Badge>
                    </div>
                    <Slider
                      value={[currentColor.b]}
                      onValueChange={(value) => handleSliderChange('b', value)}
                      max={255}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </TabsContent>
                
                {/* HSL Sliders */}
                <TabsContent value="hsl" className="space-y-3 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Hue</Label>
                      <Badge variant="secondary" className="text-xs">{Math.round(currentHsl.h)}°</Badge>
                    </div>
                    <Slider
                      value={[currentHsl.h]}
                      onValueChange={(value) => handleSliderChange('h', value)}
                      max={360}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Saturation</Label>
                      <Badge variant="secondary" className="text-xs">{Math.round(currentHsl.s)}%</Badge>
                    </div>
                    <Slider
                      value={[currentHsl.s]}
                      onValueChange={(value) => handleSliderChange('s', value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Lightness</Label>
                      <Badge variant="secondary" className="text-xs">{Math.round(currentHsl.l)}%</Badge>
                    </div>
                    <Slider
                      value={[currentHsl.l]}
                      onValueChange={(value) => handleSliderChange('l', value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </TabsContent>
                
                {/* HEX Input */}
                <TabsContent value="hex" className="mt-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Hex Color</Label>
                    <Input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Color Palette */}
              {showPalette && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Palette</Label>
                  <div className="grid grid-cols-7 gap-1">
                    {COLOR_PALETTE.map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
                        style={{ backgroundColor: color }}
                        onClick={() => handlePaletteSelect(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Color History */}
              {showHistory && colorHistory.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Recent Colors</Label>
                  <div className="flex flex-wrap gap-1">
                    {colorHistory.map((color, index) => (
                      <button
                        key={`${color}-${index}`}
                        className="w-6 h-6 rounded border border-border hover:border-primary transition-colors"
                        style={{ backgroundColor: color }}
                        onClick={() => handlePaletteSelect(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}