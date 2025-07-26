'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { useThemeUpdates } from '../hooks/useThemeUpdates';
import { EditorSection } from '../types';
import { Palette, Type, Building, Square, Grid, Zap, Scroll } from 'lucide-react';

export function ThemeEditor() {
  const { state, setEditorSection } = useThemeEditor();
  const themeUpdates = useThemeUpdates();

  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette, updateHandler: themeUpdates.updateColors },
    { id: 'typography', label: 'Typography', icon: Type, updateHandler: themeUpdates.updateTypography },
    { id: 'brand', label: 'Brand', icon: Building, updateHandler: themeUpdates.updateBrand },
    { id: 'borders', label: 'Borders', icon: Square, updateHandler: themeUpdates.updateBorders },
    { id: 'spacing', label: 'Spacing', icon: Grid, updateHandler: themeUpdates.updateSpacing },
    { id: 'shadows', label: 'Shadows', icon: Zap, updateHandler: themeUpdates.updateShadows },
    { id: 'scroll', label: 'Scroll', icon: Scroll, updateHandler: themeUpdates.updateScroll }
  ];

  return (
    <div className="h-full bg-card">
      <div className="p-4">
        <Tabs 
          value={state.editor.activeSection} 
          onValueChange={(value) => setEditorSection(value as EditorSection)}
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