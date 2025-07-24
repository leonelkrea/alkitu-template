'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ColorGroup {
  id: string;
  name: string;
  icon: React.ReactNode;
  colors: Array<{
    name: string;
    value: string;
    description?: string;
  }>;
}

interface CompactColorPaletteProps {
  title?: string;
  description?: string;
  colorGroups: ColorGroup[];
  className?: string;
}

const ColorPreview = ({ 
  name, 
  value, 
  description, 
  size = 'default' 
}: { 
  name: string; 
  value: string; 
  description?: string;
  size?: 'sm' | 'default' | 'lg';
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${text} to clipboard`);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    default: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <div className="group relative flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      {/* Color Circle */}
      <div 
        className={cn(
          "rounded-full border-2 border-border flex-shrink-0 cursor-pointer relative overflow-hidden",
          sizeClasses[size]
        )}
        style={{ backgroundColor: value }}
        onClick={() => copyToClipboard(value)}
      >
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Copy className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Color Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm capitalize">
            {name.replace('-', ' ')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <code 
            className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded cursor-pointer hover:bg-muted/80"
            onClick={() => copyToClipboard(value)}
          >
            {value}
          </code>
        </div>

        {showDetails && description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

const ColorGroupGrid = ({ colors }: { colors: ColorGroup['colors'] }) => {
  return (
    <div className="grid gap-1">
      {colors.map((color) => (
        <ColorPreview
          key={color.name}
          name={color.name}
          value={color.value}
          description={color.description}
          size="default"
        />
      ))}
    </div>
  );
};

const CompactOverview = ({ colorGroups }: { colorGroups: ColorGroup[] }) => {
  const primaryColors = colorGroups.find(g => g.id === 'primary')?.colors || [];
  const secondaryColors = colorGroups.find(g => g.id === 'secondary')?.colors || [];
  const accentColors = colorGroups.find(g => g.id === 'accent')?.colors || [];

  return (
    <div className="space-y-4">
      {/* Main Colors Grid */}
      <div className="grid grid-cols-2 gap-4">
        {primaryColors.slice(0, 2).map((color) => (
          <div key={color.name} className="space-y-2">
            <div 
              className="h-16 rounded-lg border-2 border-border"
              style={{ backgroundColor: color.value }}
            />
            <div className="text-center">
              <p className="font-medium text-sm capitalize">{color.name.replace('-', ' ')}</p>
              <code className="text-xs text-muted-foreground">{color.value}</code>
            </div>
          </div>
        ))}
      </div>

      {/* Supporting Colors Chips */}
      <div className="space-y-3">
        {secondaryColors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Secondary</h4>
            <div className="flex flex-wrap gap-2">
              {secondaryColors.map((color) => (
                <Badge 
                  key={color.name}
                  variant="secondary"
                  className="gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs">{color.name.replace('-', ' ')}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {accentColors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Accent</h4>
            <div className="flex flex-wrap gap-2">
              {accentColors.map((color) => (
                <Badge 
                  key={color.name}
                  variant="outline"
                  className="gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs">{color.name.replace('-', ' ')}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export function CompactColorPalette({ 
  title = "Color Palette",
  description = "Theme colors with semantic meanings",
  colorGroups,
  className 
}: CompactColorPaletteProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-6 mb-4">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            {colorGroups.slice(0, 5).map((group) => (
              <TabsTrigger key={group.id} value={group.id} className="text-xs">
                <span className="hidden sm:inline">{group.name}</span>
                <span className="sm:hidden">{group.icon}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <CompactOverview colorGroups={colorGroups} />
          </TabsContent>

          {colorGroups.map((group) => (
            <TabsContent key={group.id} value={group.id} className="mt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {group.icon}
                  <h3 className="font-medium">{group.name}</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {group.colors.length} colors
                  </Badge>
                </div>
                <ColorGroupGrid colors={group.colors} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Hook para generar grupos de colores desde un tema
export function useColorGroups(theme: any) {
  const colorGroups: ColorGroup[] = [
    {
      id: 'primary',
      name: 'Primary',
      icon: <div className="w-3 h-3 rounded-full bg-primary" />,
      colors: [
        { 
          name: 'primary', 
          value: theme.lightModeConfig.primary,
          description: 'Main brand color for buttons, links, and key interactions'
        },
        { 
          name: 'primary-foreground', 
          value: theme.lightModeConfig['primary-foreground'],
          description: 'Text color that appears on primary backgrounds'
        }
      ]
    },
    {
      id: 'secondary',
      name: 'Secondary',
      icon: <div className="w-3 h-3 rounded-full bg-secondary" />,
      colors: [
        { 
          name: 'secondary', 
          value: theme.lightModeConfig.secondary,
          description: 'Secondary actions and complementary elements'
        },
        { 
          name: 'secondary-foreground', 
          value: theme.lightModeConfig['secondary-foreground'],
          description: 'Text color for secondary elements'
        }
      ]
    },
    {
      id: 'accent',
      name: 'Accent',
      icon: <div className="w-3 h-3 rounded-full bg-accent" />,
      colors: [
        { 
          name: 'accent', 
          value: theme.lightModeConfig.accent,
          description: 'Subtle highlights and emphasis'
        },
        { 
          name: 'accent-foreground', 
          value: theme.lightModeConfig['accent-foreground'],
          description: 'Text on accent backgrounds'
        }
      ]
    },
    {
      id: 'base',
      name: 'Base',
      icon: <div className="w-3 h-3 rounded-full bg-background border" />,
      colors: [
        { 
          name: 'background', 
          value: theme.lightModeConfig.background,
          description: 'Main application background'
        },
        { 
          name: 'foreground', 
          value: theme.lightModeConfig.foreground,
          description: 'Primary text color'
        },
        { 
          name: 'muted', 
          value: theme.lightModeConfig.muted,
          description: 'Subtle background for disabled elements'
        },
        { 
          name: 'muted-foreground', 
          value: theme.lightModeConfig['muted-foreground'],
          description: 'Muted text for descriptions and labels'
        }
      ]
    },
    {
      id: 'interactive',
      name: 'Interactive',
      icon: <div className="w-3 h-3 rounded-full bg-destructive" />,
      colors: [
        { 
          name: 'destructive', 
          value: theme.lightModeConfig.destructive,
          description: 'Error states and dangerous actions'
        },
        { 
          name: 'destructive-foreground', 
          value: theme.lightModeConfig['destructive-foreground'],
          description: 'Text on destructive backgrounds'
        },
        { 
          name: 'border', 
          value: theme.lightModeConfig.border,
          description: 'Default border color'
        },
        { 
          name: 'ring', 
          value: theme.lightModeConfig.ring,
          description: 'Focus ring color'
        }
      ]
    }
  ];

  return colorGroups;
}