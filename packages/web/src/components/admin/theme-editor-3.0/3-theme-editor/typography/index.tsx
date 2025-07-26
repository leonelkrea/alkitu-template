'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ThemeTypography } from '../../types/theme.types';

interface TypographyEditorProps {
  typography: ThemeTypography;
  onTypographyChange: (typography: ThemeTypography) => void;
  className?: string;
}

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' }
];

const SERIF_FONTS = [
  { value: 'Source Serif 4', label: 'Source Serif 4' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' }
];

const MONO_FONTS = [
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'Fira Code', label: 'Fira Code' },
  { value: 'Monaco', label: 'Monaco' },
  { value: 'Consolas', label: 'Consolas' },
  { value: 'Source Code Pro', label: 'Source Code Pro' }
];

export function TypographyEditor({ 
  typography, 
  onTypographyChange, 
  className = ""
}: TypographyEditorProps) {
  
  const handleFontFamilyChange = (type: 'sans' | 'serif' | 'mono', fontName: string) => {
    const updatedTypography = {
      ...typography,
      fontFamilies: {
        ...typography.fontFamilies,
        [type]: [fontName, type === 'sans' ? 'sans-serif' : type === 'serif' ? 'serif' : 'monospace']
      }
    };
    onTypographyChange(updatedTypography);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Font Families */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Font Families</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sans Serif */}
          <div className="space-y-2">
            <Label className="text-xs">Sans Serif</Label>
            <Select 
              value={typography.fontFamilies.sans[0]} 
              onValueChange={(value) => handleFontFamilyChange('sans', value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div 
              className="text-sm p-2 border rounded"
              style={{ fontFamily: typography.fontFamilies.sans[0] }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>

          {/* Serif */}
          <div className="space-y-2">
            <Label className="text-xs">Serif</Label>
            <Select 
              value={typography.fontFamilies.serif[0]} 
              onValueChange={(value) => handleFontFamilyChange('serif', value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERIF_FONTS.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div 
              className="text-sm p-2 border rounded"
              style={{ fontFamily: typography.fontFamilies.serif[0] }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>

          {/* Monospace */}
          <div className="space-y-2">
            <Label className="text-xs">Monospace</Label>
            <Select 
              value={typography.fontFamilies.mono[0]} 
              onValueChange={(value) => handleFontFamilyChange('mono', value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONO_FONTS.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div 
              className="text-sm p-2 border rounded"
              style={{ fontFamily: typography.fontFamilies.mono[0] }}
            >
              const greeting = "Hello World";
            </div>
          </div>
        </div>
      </Card>

      {/* Font Sizes Preview */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Font Sizes</h3>
        <div className="space-y-3">
          {Object.entries(typography.fontSizes).map(([key, size]) => (
            <div key={key} className="flex items-center gap-4">
              <div className="w-12 text-xs text-muted-foreground">{key}</div>
              <div className="w-16 text-xs font-mono text-muted-foreground">{size}</div>
              <div 
                style={{ 
                  fontSize: size,
                  fontFamily: typography.fontFamilies.sans[0]
                }}
              >
                Sample Text ({key})
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Font Weights Preview */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Font Weights</h3>
        <div className="space-y-3">
          {Object.entries(typography.fontWeights).map(([key, weight]) => (
            <div key={key} className="flex items-center gap-4">
              <div className="w-16 text-xs text-muted-foreground">{key}</div>
              <div className="w-12 text-xs font-mono text-muted-foreground">{weight}</div>
              <div 
                style={{ 
                  fontWeight: weight,
                  fontFamily: typography.fontFamilies.sans[0]
                }}
              >
                Sample Text ({key} - {weight})
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}