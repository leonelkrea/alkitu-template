/**
 * Theme Builder - Control Panel Component
 * Left panel containing all theme editing controls
 * Part of Clean Architecture presentation layer
 */

'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Palette, 
  Type, 
  Image as ImageIcon,
  Eclipse,
  Square,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Local imports
import { ColorEditor } from '../editors/ColorEditor';
import { BrandEditor } from '../editors/BrandEditor';
import { TypographyEditor } from '../editors/TypographyEditor';
import { useThemeBuilderUI } from '../../contexts/ThemeBuilderContext';

/**
 * Control panel props
 */
export interface ControlPanelProps {
  className?: string;
  defaultTab?: string;
}

/**
 * Tab configuration
 */
const EDITOR_TABS = [
  {
    id: 'colors',
    label: 'Colors',
    icon: Palette,
    component: ColorEditor
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: Type,
    component: TypographyEditor
  },
  {
    id: 'brand',
    label: 'Brand',
    icon: ImageIcon,
    component: BrandEditor
  },
  {
    id: 'shadow',
    label: 'Shadows',
    icon: Eclipse,
    component: null // TODO: ShadowEditor
  },
  {
    id: 'border',
    label: 'Borders',
    icon: Square,
    component: null // TODO: BorderEditor
  },
  {
    id: 'spacing',
    label: 'Spacing',
    icon: Sparkles,
    component: null // TODO: SpacingEditor
  }
] as const;

/**
 * Control panel component
 */
export function ControlPanel({ className, defaultTab = 'colors' }: ControlPanelProps) {
  const { activeTab, setActiveTab } = useThemeBuilderUI();

  return (
    <div className={cn('h-full flex flex-col', className)}>
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as any)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 gap-1 p-1">
          {EDITOR_TABS.slice(0, 3).map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 text-xs"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Additional tabs for future features */}
        <TabsList className="grid w-full grid-cols-3 gap-1 p-1 mt-1">
          {EDITOR_TABS.slice(3).map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 text-xs"
                disabled={!tab.component}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <ScrollArea className="flex-1 mt-4">
          <div className="px-4 pb-4">
            {EDITOR_TABS.map((tab) => {
              const Component = tab.component;
              if (!Component) {
                return (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      <div className="text-center">
                        <tab.icon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">{tab.label} editor coming soon</p>
                      </div>
                    </div>
                  </TabsContent>
                );
              }

              return (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <Component />
                </TabsContent>
              );
            })}
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}