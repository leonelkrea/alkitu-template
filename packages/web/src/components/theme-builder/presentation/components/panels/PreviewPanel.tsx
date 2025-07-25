/**
 * Theme Builder - Preview Panel Component
 * Right panel showing live theme preview
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Tv,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Local imports
import { useThemeBuilder, useThemeBuilderUI } from '../../contexts/ThemeBuilderContext';
import { Brand } from '@/components/atomic-design/atoms';

/**
 * Preview panel props
 */
export interface PreviewPanelProps {
  className?: string;
  showControls?: boolean;
}

/**
 * Device presets for responsive preview
 */
const DEVICE_PRESETS = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, width: '768px' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, width: '375px' },
  { id: 'tv', label: 'TV', icon: Tv, width: '1920px' }
] as const;

/**
 * Preview content component
 */
function PreviewContent() {
  const { lightColors, darkColors } = useThemeBuilder();
  
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="border-b pb-8">
        <div className="flex items-center justify-between mb-6">
          <Brand className="h-10" />
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary">Home</a>
            <a href="#" className="text-sm font-medium hover:text-primary">Features</a>
            <a href="#" className="text-sm font-medium hover:text-primary">Pricing</a>
            <a href="#" className="text-sm font-medium hover:text-primary">Contact</a>
          </nav>
        </div>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Theme</h1>
          <p className="text-xl text-muted-foreground">
            Experience beautiful design with customizable colors and typography
          </p>
        </div>
      </header>

      {/* Color Showcase */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="w-full h-24 bg-primary rounded mb-2" />
            <p className="text-sm font-medium">Primary</p>
            <p className="text-xs text-muted-foreground">Brand color</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-24 bg-secondary rounded mb-2" />
            <p className="text-sm font-medium">Secondary</p>
            <p className="text-xs text-muted-foreground">Supporting color</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-24 bg-accent rounded mb-2" />
            <p className="text-sm font-medium">Accent</p>
            <p className="text-xs text-muted-foreground">Highlight color</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-24 bg-muted rounded mb-2" />
            <p className="text-sm font-medium">Muted</p>
            <p className="text-xs text-muted-foreground">Subtle backgrounds</p>
          </Card>
        </div>
      </section>

      {/* Typography Showcase */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Typography</h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <p className="text-muted-foreground">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Heading 2</h2>
            <p className="text-muted-foreground">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <h3 className="text-2xl font-medium">Heading 3</h3>
            <p className="text-muted-foreground">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p className="text-base">
              Body text: Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </section>

      {/* Components Showcase */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Components</h2>
        <div className="space-y-6">
          {/* Buttons */}
          <div>
            <h3 className="text-lg font-medium mb-3">Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-lg font-medium mb-3">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-lg font-medium mb-3">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <h4 className="font-semibold mb-2">Card Title</h4>
                <p className="text-sm text-muted-foreground">
                  This is a card component with your custom theme applied.
                </p>
              </Card>
              <Card className="p-6 bg-primary text-primary-foreground">
                <h4 className="font-semibold mb-2">Primary Card</h4>
                <p className="text-sm opacity-90">
                  A card with primary background color.
                </p>
              </Card>
              <Card className="p-6 bg-secondary text-secondary-foreground">
                <h4 className="font-semibold mb-2">Secondary Card</h4>
                <p className="text-sm opacity-90">
                  A card with secondary background color.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Preview */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Chart Colors</h2>
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="text-center">
              <div 
                className={`w-16 h-16 rounded-full bg-chart-${num}`}
                style={{ backgroundColor: `hsl(var(--chart-${num}))` }}
              />
              <p className="text-xs mt-2">Chart {num}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Preview panel component
 */
export function PreviewPanel({ className, showControls = true }: PreviewPanelProps) {
  const { isDarkMode, toggleThemeMode, previewMode, setPreviewMode } = useThemeBuilderUI();
  const [device, setDevice] = useState('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [key, setKey] = useState(0);

  /**
   * Handles refresh
   */
  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className={cn('h-full flex flex-col', className)}>
      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            {/* Device selector */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              {DEVICE_PRESETS.map((preset) => {
                const Icon = preset.icon;
                return (
                  <Button
                    key={preset.id}
                    variant={device === preset.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDevice(preset.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>

            {/* Theme toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleThemeMode}
              className="h-8 w-8 p-0"
            >
              {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Grid toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className="h-8 w-8 p-0"
            >
              {showGrid ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>

            {/* Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* Fullscreen toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 p-0"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Preview area */}
      <div className="flex-1 relative bg-background overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-300 mx-auto",
            showGrid && "bg-grid"
          )}
          style={{
            width: DEVICE_PRESETS.find(p => p.id === device)?.width || '100%',
            maxWidth: '100%'
          }}
        >
          <ScrollArea className="h-full">
            <div key={key} className={isDarkMode ? 'dark' : ''}>
              <PreviewContent />
            </div>
          </ScrollArea>
        </div>

        {/* Device frame overlay */}
        {device !== 'desktop' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className={cn(
              "h-full mx-auto border-8 border-gray-800 rounded-3xl",
              device === 'tablet' && "w-[768px]",
              device === 'mobile' && "w-[375px]"
            )} />
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="h-full flex flex-col">
            <div className="flex justify-end p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(false)}
              >
                <Minimize2 className="h-4 w-4 mr-2" />
                Exit Fullscreen
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <PreviewContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}