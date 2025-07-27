'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorToken } from '../../types/theme.types';
import { 
  hexToHsv, 
  hsvToHex, 
  hsvToRgb, 
  hexToRgb,
  isValidHex,
  formatHex,
  oklchToRgb,
  rgbToHsv,
  rgbToOklch,
  type HSVColor,
  type RGBColor
} from '../../utils/color-conversions';

interface HsvColorPickerProps {
  colorToken: ColorToken;
  onChange: (colorToken: ColorToken) => void;
  className?: string;
}

export function HsvColorPicker({ colorToken, onChange, className }: HsvColorPickerProps) {
  // Initialize HSV from current color token's OKLCH value
  const [hsv, setHsv] = useState<HSVColor>(() => {
    const rgb = oklchToRgb(colorToken.oklch);
    return rgbToHsv(rgb);
  });
  
  const [rgb, setRgb] = useState<RGBColor>({ r: 0, g: 0, b: 0 });
  const [hexInput, setHexInput] = useState<string>('#000000');
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [isDraggingSatVal, setIsDraggingSatVal] = useState(false);
  
  const hueBarRef = useRef<HTMLDivElement>(null);
  const satValRef = useRef<HTMLDivElement>(null);

  // Update RGB and hex when HSV changes
  useEffect(() => {
    const newRgb = hsvToRgb(hsv);
    const newHex = hsvToHex(hsv);
    setRgb(newRgb);
    setHexInput(newHex);
  }, [hsv]);

  // Sync with external colorToken changes
  useEffect(() => {
    const rgb = oklchToRgb(colorToken.oklch);
    const newHsv = rgbToHsv(rgb);
    
    // Only update if values are actually different to avoid infinite loops
    if (Math.abs(newHsv.h - hsv.h) > 1 || Math.abs(newHsv.s - hsv.s) > 1 || Math.abs(newHsv.v - hsv.v) > 1) {
      setHsv(newHsv);
    }
  }, [colorToken.oklch.l, colorToken.oklch.c, colorToken.oklch.h]);

  // Notify parent of color changes
  const notifyChange = useCallback((newHsv: HSVColor) => {
    const rgb = hsvToRgb(newHsv);
    const oklch = rgbToOklch(rgb);
    
    const newColorToken: ColorToken = {
      ...colorToken,
      value: `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${oklch.h.toFixed(4)})`,
      oklch
    };
    onChange(newColorToken);
  }, [colorToken, onChange]);

  // Handle hue bar interactions
  const handleHueInteraction = useCallback((clientX: number) => {
    if (!hueBarRef.current) return;
    
    const rect = hueBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newHue = (x / rect.width) * 360;
    
    const newHsv = { ...hsv, h: Math.round(newHue) };
    setHsv(newHsv);
    notifyChange(newHsv);
  }, [hsv, notifyChange]);

  // Handle saturation/value area interactions
  const handleSatValInteraction = useCallback((clientX: number, clientY: number) => {
    if (!satValRef.current) return;
    
    const rect = satValRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    
    const newSat = (x / rect.width) * 100;
    const newVal = 100 - (y / rect.height) * 100;
    
    const newHsv = { 
      ...hsv, 
      s: Math.round(newSat), 
      v: Math.round(newVal) 
    };
    setHsv(newHsv);
    notifyChange(newHsv);
  }, [hsv, notifyChange]);

  // Mouse event handlers for hue bar
  const handleHueMouseDown = (e: React.MouseEvent) => {
    setIsDraggingHue(true);
    handleHueInteraction(e.clientX);
  };

  // Mouse event handlers for saturation/value area
  const handleSatValMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSatVal(true);
    handleSatValInteraction(e.clientX, e.clientY);
  };

  // Global mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHue) {
        handleHueInteraction(e.clientX);
      }
      if (isDraggingSatVal) {
        handleSatValInteraction(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingHue(false);
      setIsDraggingSatVal(false);
    };

    if (isDraggingHue || isDraggingSatVal) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingHue, isDraggingSatVal, handleHueInteraction, handleSatValInteraction]);

  // Handle hex input changes
  const handleHexChange = (value: string) => {
    setHexInput(value);
    
    if (isValidHex(value)) {
      const newHsv = hexToHsv(value);
      if (newHsv) {
        setHsv(newHsv);
        notifyChange(newHsv);
      }
    }
  };

  // Handle RGB input changes
  const handleRgbChange = (component: 'r' | 'g' | 'b', value: string) => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb = { ...rgb, [component]: numValue };
    setRgb(newRgb);
    
    const hex = `#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`;
    const newHsv = hexToHsv(hex);
    if (newHsv) {
      setHsv(newHsv);
      setHexInput(hex.toUpperCase());
      notifyChange(newHsv);
    }
  };

  // Calculate positions for indicators
  const huePosition = (hsv.h / 360) * 100;
  const satPosition = (hsv.s / 100) * 100;
  const valPosition = 100 - (hsv.v / 100) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Saturation/Value Area */}
      <div className="relative">
        <div
          ref={satValRef}
          className="w-full h-32 rounded-lg cursor-crosshair relative overflow-hidden"
          style={{
            background: `
              linear-gradient(to bottom, transparent, #000),
              linear-gradient(to right, #fff, hsl(${hsv.h}, 100%, 50%))
            `
          }}
          onMouseDown={handleSatValMouseDown}
        >
          {/* Saturation/Value Indicator */}
          <div
            className="absolute w-3 h-3 border-2 border-white rounded-full shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${satPosition}%`,
              top: `${valPosition}%`,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)'
            }}
          />
        </div>
      </div>

      {/* Hue Bar */}
      <div className="relative">
        <div
          ref={hueBarRef}
          className="w-full h-4 rounded-full cursor-pointer relative overflow-hidden"
          style={{
            background: 'linear-gradient(to right, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%)'
          }}
          onMouseDown={handleHueMouseDown}
        >
          {/* Hue Indicator */}
          <div
            className="absolute w-3 h-6 bg-white border border-gray-300 rounded-sm shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1"
            style={{
              left: `${huePosition}%`,
              top: '50%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}
          />
        </div>
      </div>

      {/* Color Preview */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-8 rounded border border-border shadow-inner"
          style={{ backgroundColor: hsvToHex(hsv) }}
        />
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground mb-1 block">
            Current Color
          </Label>
          <div className="text-sm font-mono text-foreground">
            {formatHex(hsvToHex(hsv))}
          </div>
        </div>
      </div>

      {/* Hex Input */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          Hex Color
        </Label>
        <Input
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          className="font-mono text-sm text-foreground bg-input border-border"
          placeholder="#000000"
        />
      </div>

      {/* RGB Inputs */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          RGB Values
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-center block">R</Label>
            <Input
              type="number"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => handleRgbChange('r', e.target.value)}
              className="text-center text-sm text-foreground bg-input border-border"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-center block">G</Label>
            <Input
              type="number"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => handleRgbChange('g', e.target.value)}
              className="text-center text-sm text-foreground bg-input border-border"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-center block">B</Label>
            <Input
              type="number"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => handleRgbChange('b', e.target.value)}
              className="text-center text-sm text-foreground bg-input border-border"
            />
          </div>
        </div>
      </div>

      {/* HSV Values (Read-only display) */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          HSV Values
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <Label className="text-xs block">H</Label>
            <div className="text-sm font-mono text-foreground bg-muted/30 px-2 py-1 rounded">
              {hsv.h}°
            </div>
          </div>
          <div className="text-center">
            <Label className="text-xs block">S</Label>
            <div className="text-sm font-mono text-foreground bg-muted/30 px-2 py-1 rounded">
              {hsv.s}%
            </div>
          </div>
          <div className="text-center">
            <Label className="text-xs block">V</Label>
            <div className="text-sm font-mono text-foreground bg-muted/30 px-2 py-1 rounded">
              {hsv.v}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}