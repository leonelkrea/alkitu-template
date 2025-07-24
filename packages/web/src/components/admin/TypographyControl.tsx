'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GoogleFontPicker } from './GoogleFontPicker';
import { Card } from '@/components/ui/card';
import type { TypographyStyle } from '@/types/typography';
import {
  FONT_WEIGHTS,
  TEXT_TRANSFORMS,
  TEXT_DECORATIONS,
  FONT_STYLES,
} from '@/types/typography';

interface TypographyControlProps {
  title: string;
  value: TypographyStyle;
  onChange: (updates: Partial<TypographyStyle>) => void;
  showPreview?: boolean;
}

export function TypographyControl({
  title,
  value,
  onChange,
  showPreview = true,
}: TypographyControlProps) {
  const handleChange = (key: keyof TypographyStyle, newValue: any) => {
    onChange({ [key]: newValue });
  };

  const previewText = {
    base: 'Este es un texto de párrafo de ejemplo para mostrar cómo se ve la tipografía base.',
    accent: 'Este texto tiene énfasis especial para destacar información importante.',
    quote: '"La tipografía es el arte de organizar las letras para hacer el lenguaje visible."',
    h1: 'Encabezado Principal H1',
    h2: 'Encabezado Secundario H2',
    h3: 'Encabezado Terciario H3',
    h4: 'Encabezado Cuaternario H4',
    h5: 'Encabezado Quinario H5',
  };

  const getPreviewText = () => {
    const key = title.toLowerCase().replace(/\s+/g, '');
    return previewText[key as keyof typeof previewText] || previewText.base;
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      {showPreview && (
        <div
          className="p-4 bg-muted/30 rounded-lg mb-6"
          style={{
            fontFamily: value.fontFamily,
            fontSize: `${value.fontSize}px`,
            fontWeight: value.fontWeight,
            fontStyle: value.fontStyle,
            textTransform: value.textTransform as any,
            textDecoration: value.textDecoration,
            lineHeight: value.lineHeight,
            letterSpacing: `${value.letterSpacing}em`,
            wordSpacing: `${value.wordSpacing}em`,
          }}
        >
          {getPreviewText()}
        </div>
      )}

      <div className="space-y-4">
        {/* Font Family */}
        <div className="space-y-2">
          <Label>Familia</Label>
          <GoogleFontPicker
            value={value.fontFamily}
            onChange={(fontFamily) => handleChange('fontFamily', fontFamily)}
          />
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label>Tamaño</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[value.fontSize]}
              onValueChange={([size]) => handleChange('fontSize', size)}
              min={8}
              max={72}
              step={1}
              className="flex-1"
            />
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={value.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value) || 16)}
                className="w-16 text-center"
                min={8}
                max={72}
              />
              <span className="text-xs text-muted-foreground">px</span>
            </div>
          </div>
        </div>

        {/* Font Weight */}
        <div className="space-y-2">
          <Label>Peso</Label>
          <Select
            value={value.fontWeight}
            onValueChange={(weight) => handleChange('fontWeight', weight)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_WEIGHTS.map((weight) => (
                <SelectItem key={weight.value} value={weight.value}>
                  {weight.value} ({weight.label})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text Transform */}
        <div className="space-y-2">
          <Label>Transformación</Label>
          <Select
            value={value.textTransform}
            onValueChange={(transform) => handleChange('textTransform', transform)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEXT_TRANSFORMS.map((transform) => (
                <SelectItem key={transform.value} value={transform.value}>
                  {transform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Style */}
        <div className="space-y-2">
          <Label>Estilo</Label>
          <Select
            value={value.fontStyle}
            onValueChange={(style) => handleChange('fontStyle', style)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_STYLES.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text Decoration */}
        <div className="space-y-2">
          <Label>Decoración</Label>
          <Select
            value={value.textDecoration}
            onValueChange={(decoration) => handleChange('textDecoration', decoration)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEXT_DECORATIONS.map((decoration) => (
                <SelectItem key={decoration.value} value={decoration.value}>
                  {decoration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Line Height */}
        <div className="space-y-2">
          <Label>Altura de línea</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[value.lineHeight]}
              onValueChange={([height]) => handleChange('lineHeight', height)}
              min={0.5}
              max={3}
              step={0.1}
              className="flex-1"
            />
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={value.lineHeight}
                onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value) || 1.5)}
                className="w-16 text-center"
                min={0.5}
                max={3}
                step={0.1}
              />
            </div>
          </div>
        </div>

        {/* Letter Spacing */}
        <div className="space-y-2">
          <Label>Espaciado entre letras</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[value.letterSpacing]}
              onValueChange={([spacing]) => handleChange('letterSpacing', spacing)}
              min={-0.1}
              max={0.5}
              step={0.01}
              className="flex-1"
            />
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={value.letterSpacing}
                onChange={(e) => handleChange('letterSpacing', parseFloat(e.target.value) || 0)}
                className="w-16 text-center"
                min={-0.1}
                max={0.5}
                step={0.01}
              />
              <span className="text-xs text-muted-foreground">em</span>
            </div>
          </div>
        </div>

        {/* Word Spacing */}
        <div className="space-y-2">
          <Label>Espacio entre palabras</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[value.wordSpacing]}
              onValueChange={([spacing]) => handleChange('wordSpacing', spacing)}
              min={-0.2}
              max={1}
              step={0.01}
              className="flex-1"
            />
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={value.wordSpacing}
                onChange={(e) => handleChange('wordSpacing', parseFloat(e.target.value) || 0)}
                className="w-16 text-center"
                min={-0.2}
                max={1}
                step={0.01}
              />
              <span className="text-xs text-muted-foreground">em</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}