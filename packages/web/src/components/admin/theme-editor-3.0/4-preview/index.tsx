'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { Palette, Type, Building, Atom, Layers, Layout } from 'lucide-react';

export function Preview() {
  const { state, setPreviewSection } = useThemeEditor();

  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'brand', label: 'Brand', icon: Building },
    { id: 'atomos', label: 'Átomos', icon: Atom },
    { id: 'moleculas', label: 'Moléculas', icon: Layers },
    { id: 'organismos', label: 'Organismos', icon: Layout }
  ];

  return (
    <div className="h-full bg-card">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium">Preview</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Live preview of theme changes
        </p>
      </div>
      
      <div className="p-4">
        <Tabs 
          value={state.preview.activeSection} 
          onValueChange={(value) => setPreviewSection(value as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 gap-1 h-auto p-1">
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
                <h4 className="text-sm font-medium mb-2">{label} Preview</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Live preview of {label.toLowerCase()} components
                </p>
                
                {/* Sample preview content */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button size="sm">Primary</Button>
                    <Button variant="secondary" size="sm">Secondary</Button>
                    <Button variant="outline" size="sm">Outline</Button>
                  </div>
                  
                  <div className="h-24 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      {label} showcase will be here
                    </span>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-4">
          <Badge variant="outline" className="w-full justify-center border-yellow-500 text-yellow-700">
            🟡 Preview Block
          </Badge>
        </div>
      </div>
    </div>
  );
}