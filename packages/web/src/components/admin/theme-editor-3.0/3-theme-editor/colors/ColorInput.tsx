'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Shuffle } from 'lucide-react';
import { ColorToken, OklchColor } from '../../types/theme.types';
import { oklchToString, parseOklchString } from '../../utils/css-variables';
import { OklchColorPicker } from './OklchColorPicker';

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
  const [inputValue, setInputValue] = useState(color.value);

  // Update input value when color prop changes
  useEffect(() => {
    setInputValue(color.value);
  }, [color.value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Try to parse the input value
    const parsedOklch = parseOklchString(newValue);
    if (parsedOklch) {
      const newColor: ColorToken = {
        ...color,
        value: newValue,
        oklch: parsedOklch
      };
      onChange(newColor);
    }
  };

  const handleInputBlur = () => {
    // If the input value is not a valid OKLCH string, revert to the original value
    const parsedOklch = parseOklchString(inputValue);
    if (!parsedOklch) {
      setInputValue(color.value);
    }
  };

  const handlePickerChange = (newOklch: OklchColor) => {
    const newValue = oklchToString(newOklch);
    const newColor: ColorToken = {
      ...color,
      value: newValue,
      oklch: newOklch
    };
    
    setInputValue(newValue);
    onChange(newColor);
  };

  const handleRandomColor = () => {
    // Generate a random OKLCH color
    const randomOklch: OklchColor = {
      l: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
      c: Math.random() * 0.3, // 0 to 0.3
      h: Math.random() * 360 // 0 to 360
    };
    
    handlePickerChange(randomOklch);
  };

  // Get color for preview swatch
  const getColorPreview = (): string => {
    // For CSS variables like var(--primary), show a fallback color
    if (color.value.startsWith('var(')) {
      return oklchToString(color.oklch);
    }
    return color.value;
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
            <OklchColorPicker
              oklch={color.oklch}
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
        placeholder="oklch(0.5 0.1 180)"
        className="flex-1 font-mono text-xs"
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