'use client';

import React, { useState } from 'react';
import { ColorPalette } from './ColorPalette';
import { OklchColorPicker } from './OklchColorPicker';
import { ThemeColors, ColorToken } from '../../types/theme.types';

interface ColorsEditorProps {
  colors: ThemeColors;
  onColorsChange: (colors: ThemeColors) => void;
  className?: string;
}

export function ColorsEditor({ colors, onColorsChange, className = "" }: ColorsEditorProps) {
  const [selectedColorKey, setSelectedColorKey] = useState<string>('primary');
  
  const selectedColorToken = colors[selectedColorKey as keyof ThemeColors];

  const handleColorSelect = (colorKey: string, token: ColorToken) => {
    setSelectedColorKey(colorKey);
  };

  const handleColorChange = (updatedToken: ColorToken) => {
    const updatedColors = {
      ...colors,
      [selectedColorKey]: updatedToken
    };
    onColorsChange(updatedColors);
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${className}`}>
      {/* Color Palette */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Color Palette</h3>
        <ColorPalette
          colors={colors}
          onColorSelect={handleColorSelect}
          selectedColorKey={selectedColorKey}
        />
      </div>

      {/* Color Editor */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Color Editor</h3>
        {selectedColorToken && (
          <OklchColorPicker
            colorToken={selectedColorToken}
            onColorChange={handleColorChange}
          />
        )}
      </div>
    </div>
  );
}