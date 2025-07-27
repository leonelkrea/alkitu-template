'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Shuffle } from 'lucide-react';
import { ColorToken, OklchColor } from '../../types/theme.types';
import { oklchToString, parseOklchString } from '../../utils/css-variables';
import { OklchColorPicker } from './OklchColorPicker';
import { HsvColorPicker } from './HsvColorPicker';
import { oklchToHex, isValidHex, hexToOklch } from '../../utils/color-conversions';

interface ColorInputProps {
  color: ColorToken;
  onChange: (color: ColorToken) => void;
  className?: string;
}

export function ColorInput({
  color,
  onChange,
  className = ""
}: ColorInputProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [inputValue, setInputValue] = useState(() => oklchToHex(color.oklch));

  // Update input value when color prop changes (show hex instead of oklch)
  useEffect(() => {
    setInputValue(oklchToHex(color.oklch));
  }, [color.oklch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // Don't call onChange on every keystroke to avoid infinite loops
    // Wait for blur or enter key for validation
  };

  const handleInputBlur = () => {
    // Try to parse as hex input on blur
    if (isValidHex(inputValue)) {
      const parsedOklch = hexToOklch(inputValue);
      if (parsedOklch) {
        const newColor: ColorToken = {
          ...color,
          value: `oklch(${parsedOklch.l.toFixed(4)} ${parsedOklch.c.toFixed(4)} ${parsedOklch.h.toFixed(4)})`,
          oklch: parsedOklch
        };
        onChange(newColor);
      }
    } else {
      // Revert to current color's hex value if invalid
      setInputValue(oklchToHex(color.oklch));
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  const handlePickerChange = (newColorToken: ColorToken) => {
    setInputValue(oklchToHex(newColorToken.oklch));
    onChange(newColorToken);
  };

  const handleRandomColor = () => {
    // Generate a random OKLCH color
    const randomOklch: OklchColor = {
      l: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
      c: Math.random() * 0.3, // 0 to 0.3
      h: Math.random() * 360 // 0 to 360
    };
    
    const randomColorToken: ColorToken = {
      ...color,
      value: oklchToString(randomOklch),
      oklch: randomOklch
    };
    
    handlePickerChange(randomColorToken);
  };

  // Get color for preview swatch (always show as hex)
  const getColorPreview = (): string => {
    return oklchToHex(color.oklch);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Color Swatch Button */}
      <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-8 h-8 p-0 rounded border border-input"
            style={{
              backgroundColor: getColorPreview()
            }}
          >
            <span className="sr-only">Pick color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="text-sm font-medium">Color Picker</div>
            <HsvColorPicker
              colorToken={color}
              onChange={handlePickerChange}
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Color Value Input */}
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        placeholder="#000000"
        className="flex-1 font-mono text-xs text-foreground bg-input border-border"
      />

      {/* Random Color Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleRandomColor}
        className="px-2"
      >
        <Shuffle className="h-3 w-3" />
        <span className="sr-only">Random color</span>
      </Button>
    </div>
  );
}