'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { Palette, Type, Building, Square, Spacing, Shadow, Scroll } from 'lucide-react';

export function ThemeEditor() {
  const { state, setEditorSection } = useThemeEditor();

  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'brand', label: 'Brand', icon: Building },
    { id: 'borders', label: 'Borders', icon: Square },
    { id: 'spacing', label: 'Spacing', icon: Spacing },
    { id: 'shadows', label: 'Shadows', icon: Shadow },
    { id: 'scroll', label: 'Scroll', icon: Scroll }
  ];

  return (
    <div className="h-full bg-card">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium">Theme Editor</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Customize theme properties
        </p>
      </div>
      
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
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-2">{label} Editor</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Configure {label.toLowerCase()} settings for your theme
                </p>
                <div className="h-32 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    {label} controls will be here
                  </span>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-4">
          <Badge variant="default" className="w-full justify-center">
            🔵 Theme Editor Block
          </Badge>
        </div>
      </div>
    </div>
  );
}