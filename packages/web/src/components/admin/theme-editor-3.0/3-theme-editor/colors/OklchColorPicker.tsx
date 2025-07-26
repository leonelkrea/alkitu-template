'use client';

import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ColorToken, OklchColor } from '../../types/theme.types';

interface OklchColorPickerProps {
  colorToken: ColorToken;
  onColorChange: (token: ColorToken) => void;
  className?: string;
}

export function OklchColorPicker({ 
  colorToken, 
  onColorChange, 
  className = ""
}: OklchColorPickerProps) {
  const [oklch, setOklch] = useState<OklchColor>(colorToken.oklch);
  const [cssValue, setCssValue] = useState(colorToken.value);

  // Convert OKLCH to CSS string
  const oklchToCss = (color: OklchColor): string => {
    return `oklch(${color.l.toFixed(4)} ${color.c.toFixed(4)} ${color.h.toFixed(1)})`;
  };

  // Update color when OKLCH values change
  useEffect(() => {
    const newCssValue = oklchToCss(oklch);
    setCssValue(newCssValue);
    
    const updatedToken: ColorToken = {
      ...colorToken,
      value: newCssValue,
      oklch: oklch
    };
    
    onColorChange(updatedToken);
  }, [oklch]);

  const handleSliderChange = (component: keyof OklchColor, value: number[]) => {
    setOklch(prev => ({
      ...prev,
      [component]: value[0]
    }));
  };

  const handleInputChange = (component: keyof OklchColor, value: string) => {
    const numValue = parseFloat(value) || 0;
    setOklch(prev => ({
      ...prev,
      [component]: numValue
    }));
  };

  return (
    <Card className={`p-4 space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h4 className="text-sm font-medium">{colorToken.name}</h4>
          {colorToken.description && (
            <p className="text-xs text-muted-foreground">{colorToken.description}</p>
          )}
        </div>
        <div 
          className="w-12 h-12 rounded border shadow-sm"
          style={{ backgroundColor: cssValue }}
          title={cssValue}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Lightness */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Lightness (L)</Label>
            <Input
              type="number"
              value={oklch.l.toFixed(4)}
              onChange={(e) => handleInputChange('l', e.target.value)}
              className="w-20 h-6 text-xs"
              min="0"
              max="1"
              step="0.0001"
            />
          </div>
          <Slider
            value={[oklch.l]}
            onValueChange={(value) => handleSliderChange('l', value)}
            min={0}
            max={1}
            step={0.001}
            className="w-full"
          />
        </div>

        {/* Chroma */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Chroma (C)</Label>
            <Input
              type="number"
              value={oklch.c.toFixed(4)}
              onChange={(e) => handleInputChange('c', e.target.value)}
              className="w-20 h-6 text-xs"
              min="0"
              max="0.4"
              step="0.0001"
            />
          </div>
          <Slider
            value={[oklch.c]}
            onValueChange={(value) => handleSliderChange('c', value)}
            min={0}
            max={0.4}
            step={0.001}
            className="w-full"
          />
        </div>

        {/* Hue */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Hue (H)</Label>
            <Input
              type="number"
              value={oklch.h.toFixed(1)}
              onChange={(e) => handleInputChange('h', e.target.value)}
              className="w-20 h-6 text-xs"
              min="0"
              max="360"
              step="0.1"
            />
          </div>
          <Slider
            value={[oklch.h]}
            onValueChange={(value) => handleSliderChange('h', value)}
            min={0}
            max={360}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>

      {/* CSS Output */}
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">CSS Value</Label>
        <Input
          value={cssValue}
          readOnly
          className="font-mono text-xs"
          title="CSS OKLCH value"
        />
      </div>
    </Card>
  );
}