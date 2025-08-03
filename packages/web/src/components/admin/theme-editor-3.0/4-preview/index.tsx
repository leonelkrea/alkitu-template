'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { PreviewSection } from '../types';
import { VIEWPORT_CONFIGS } from '../types/viewport.types';
import { Palette, Type, Building, Atom, Layers, Layout } from 'lucide-react';
import { ContrastChecker } from './colors/ContrastChecker';
import { TypographyPreview } from './typography/TypographyPreview';

export function Preview() {
  const { state, setPreviewSection } = useThemeEditor();

  // Early return if theme is not loaded
  if (!state?.preview) {
    return (
      <div className="h-full bg-card flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Loading preview...</div>
        </div>
      </div>
    );
  }

  // Get current viewport configuration
  const currentViewport = state.viewport.current;
  const viewportConfig = VIEWPORT_CONFIGS[currentViewport];
  
  // Calculate responsive container dimensions
  // Desktop is the reference (100%), other viewports scale accordingly
  const getPreviewDimensions = () => {
    const desktopWidth = VIEWPORT_CONFIGS.desktop.width;
    const desktopHeight = VIEWPORT_CONFIGS.desktop.height;
    
    if (currentViewport === 'desktop') {
      return {
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        scale: 1
      };
    }
    
    const scaleX = viewportConfig.width / desktopWidth;
    const scaleY = viewportConfig.height / desktopHeight;
    
    return {
      width: `${viewportConfig.width}px`,
      height: `${viewportConfig.height}px`,
      maxWidth: `${viewportConfig.width}px`,
      scale: Math.min(scaleX, scaleY, 1)
    };
  };

  const dimensions = getPreviewDimensions();

  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'brand', label: 'Brand', icon: Building },
    { id: 'atomos', label: 'Átomos', icon: Atom },
    { id: 'moleculas', label: 'Moléculas', icon: Layers },
    { id: 'organismos', label: 'Organismos', icon: Layout }
  ];

  return (
    <div className="h-full bg-card flex flex-col">
      {/* Viewport indicator */}
      <div className="flex-shrink-0 px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {viewportConfig.name}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {viewportConfig.width} × {viewportConfig.height}
            </span>
          </div>
          {currentViewport !== 'desktop' && (
            <span className="text-xs text-muted-foreground">
              Scale: {Math.round(dimensions.scale * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Preview container with responsive dimensions */}
      <div className="flex-1 min-h-0 p-4 pt-2">
        <div 
          className="h-full mx-auto bg-background border rounded-lg overflow-hidden"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            maxWidth: dimensions.maxWidth,
            transform: currentViewport !== 'desktop' ? `scale(${dimensions.scale})` : 'none',
            transformOrigin: 'top center'
          }}
        >
          <Tabs 
            value={state.preview.activeSection} 
            onValueChange={(value) => setPreviewSection(value as PreviewSection)}
            className="w-full h-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-3 gap-1 h-auto p-1 flex-shrink-0 mx-2 mt-2">
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

            <TabsContent value="colors" className="mt-4 flex-1 min-h-0 overflow-hidden">
              <div className="h-full overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
                <ContrastChecker />
              </div>
            </TabsContent>

            <TabsContent value="typography" className="mt-4 flex-1 min-h-0 overflow-hidden">
              <div className="h-full overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
                <TypographyPreview />
              </div>
            </TabsContent>

            {sections.slice(2).map(({ id, label }) => (
              <TabsContent key={id} value={id} className="mt-4 flex-1 min-h-0 overflow-hidden">
                <div className="h-full overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
                  <Card className="p-4">
                    <div className="h-24 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        {label} showcase will be here
                      </span>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}