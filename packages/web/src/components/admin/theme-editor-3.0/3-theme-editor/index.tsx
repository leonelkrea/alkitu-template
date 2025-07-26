'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { Palette, Type, Building, Square, Grid, Zap, Scroll } from 'lucide-react';
import { ColorsEditor } from './colors';
import { TypographyEditor } from './typography';
import { BrandEditor } from './brand';
import { BordersEditor } from './borders';
import { SpacingEditor } from './spacing';
import { ShadowsEditor } from './shadows';
import { ScrollEditor } from './scroll';

export function ThemeEditor() {
  const { state, setEditorSection, updateTheme } = useThemeEditor();


  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'brand', label: 'Brand', icon: Building },
    { id: 'borders', label: 'Borders', icon: Square },
    { id: 'spacing', label: 'Spacing', icon: Grid },
    { id: 'shadows', label: 'Shadows', icon: Zap },
    { id: 'scroll', label: 'Scroll', icon: Scroll }
  ];

  const handleColorsChange = (colors: any) => {
    updateTheme({ ...state.currentTheme, colors });
  };

  const handleTypographyChange = (typography: any) => {
    updateTheme({ ...state.currentTheme, typography });
  };

  const handleBrandChange = (brand: any) => {
    updateTheme({ ...state.currentTheme, brand });
  };

  const handleBordersChange = (borders: any) => {
    updateTheme({ ...state.currentTheme, borders });
  };

  const handleSpacingChange = (spacing: any) => {
    updateTheme({ ...state.currentTheme, spacing });
  };

  const handleShadowsChange = (shadows: any) => {
    updateTheme({ ...state.currentTheme, shadows });
  };

  const handleScrollChange = (scroll: any) => {
    updateTheme({ ...state.currentTheme, scroll });
  };

  return (
    <div className="h-full bg-card">
      <div className="p-4">
        <Tabs 
          value={state.editor.activeSection} 
          onValueChange={(value) => setEditorSection(value as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 gap-1 h-auto p-1">
            {sections.map(({ id, label, icon: Icon }) => (
              <TabsTrigger 
                key={id} 
                value={id}
                className="flex flex-col gap-1 h-12 text-xs"
              >
                <Icon className="h-3 w-3" />
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map(({ id, label }) => (
            <TabsContent key={id} value={id} className="mt-4">
              <div className="h-24 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  {label} editor content will be here
                </span>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}