'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useThemeEditor } from '../context/ThemeEditorContext';

export function ThemeSelector() {
  const { state } = useThemeEditor();

  return (
    <div className="h-full border-r border-b bg-card">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium">Theme Selector</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Choose and manage themes
        </p>
      </div>
      
      <div className="p-4 space-y-4">
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <div className="w-3 h-3 rounded-full bg-accent" />
            </div>
            <span className="text-sm font-medium">Default Theme</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Current active theme
          </p>
        </Card>

        <div className="space-y-2">
          <Badge variant="secondary" className="w-full justify-center">
            🟢 Theme Selector Block
          </Badge>
          <p className="text-xs text-muted-foreground text-center">
            Iteración 1: Esqueleto funcional
          </p>
        </div>
      </div>
    </div>
  );
}