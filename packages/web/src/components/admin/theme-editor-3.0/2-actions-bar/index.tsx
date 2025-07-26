'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Tablet, Smartphone, Tv, Undo, Redo, Save, Code, Import } from 'lucide-react';
import { useThemeEditor } from '../context/ThemeEditorContext';

export function ActionsBar() {
  const { state, setViewport } = useThemeEditor();

  const viewportIcons = {
    tv: Tv,
    desktop: Monitor,
    tablet: Tablet,
    smartphone: Smartphone
  };

  return (
    <div className="h-full border-b bg-card">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium">Actions Bar</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Controls and viewport settings
        </p>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Viewport Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Viewport Size
          </label>
          <div className="flex gap-1">
            {Object.entries(viewportIcons).map(([viewport, Icon]) => (
              <Button
                key={viewport}
                variant={state.viewport.current === viewport ? 'default' : 'outline'}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setViewport(viewport as any)}
              >
                <Icon className="h-3 w-3" />
              </Button>
            ))}
          </div>
        </div>

        {/* History Controls */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            History
          </label>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">
              <Undo className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">
              <Redo className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Actions
          </label>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">
              <Import className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">
              <Code className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">
              <Save className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Badge variant="destructive" className="w-full justify-center">
          🔴 Actions Bar Block
        </Badge>
      </div>
    </div>
  );
}