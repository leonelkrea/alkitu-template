'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Eye, 
  Smartphone, 
  Grid3x3, 
  Copy, 
  Monitor,
  Tablet,
  Settings,
  Zap,
  Maximize2
} from 'lucide-react';
import { Brand } from '@/components/atomic-design/atoms/brands/Brand';
import { useBrandConfig } from './BrandContext';
import { cn } from '@/lib/utils';
import type { BrandVariant, BrandSize, MonochromeMode } from '@/components/atomic-design/atoms/brands/Brand.types';
import { ColorPicker } from '@/components/ui/simple-color-picker';

type ViewMode = 'single' | 'responsive' | 'adaptive' | 'grid';

interface BrandStudioConfig {
  variant: BrandVariant;
  size: BrandSize;
  showTagline: boolean;
  clickable: boolean;
  monochromeMode: MonochromeMode;
}

interface AdaptiveConfig {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  containerOverflow: boolean;
}

interface QuickPreset {
  name: string;
  description: string;
  config: BrandStudioConfig;
  icon: React.ReactNode;
}

const quickPresets: QuickPreset[] = [
  {
    name: 'Header Logo',
    description: 'Compact horizontal layout for navigation',
    config: {
      variant: 'horizontal',
      size: 'sm',
      showTagline: false,
      clickable: true,
      monochromeMode: 'none'
    },
    icon: <Monitor className="w-4 h-4" />
  },
  {
    name: 'Hero Brand',
    description: 'Large vertical layout for landing pages',
    config: {
      variant: 'vertical',
      size: 'xl',
      showTagline: true,
      clickable: false,
      monochromeMode: 'none'
    },
    icon: <Zap className="w-4 h-4" />
  },
  {
    name: 'Sidebar Icon',
    description: 'Icon-only for collapsed sidebars',
    config: {
      variant: 'icon-only',
      size: 'md',
      showTagline: false,
      clickable: true,
      monochromeMode: 'none'
    },
    icon: <Grid3x3 className="w-4 h-4" />
  },
  {
    name: 'Mobile Header',
    description: 'Compact layout optimized for mobile',
    config: {
      variant: 'compact',
      size: 'sm',
      showTagline: false,
      clickable: true,
      monochromeMode: 'none'
    },
    icon: <Smartphone className="w-4 h-4" />
  }
];

// Simple color linking controls for BrandStudio  
interface ColorLinkingControlsProps {
  colorName: string;
  isLinked: boolean;
  linkedTo?: string;
  onLinkTo: (targetColor: string) => void;
  onUnlink: () => void;
  availableColors: string[];
  defaultLinkTarget?: string;
}

function ColorLinkingControls({
  colorName,
  isLinked,
  linkedTo,
  onLinkTo,
  onUnlink,
  availableColors,
  defaultLinkTarget,
}: ColorLinkingControlsProps) {
  const [showLinkMenu, setShowLinkMenu] = useState(false);

  const handleLinkToColor = (targetColor: string) => {
    onLinkTo(targetColor);
    setShowLinkMenu(false);
  };

  if (isLinked && linkedTo) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
          🔗 Linked to {linkedTo}
        </span>
        <button
          onClick={onUnlink}
          className="text-xs text-orange-600 hover:text-orange-800 underline"
        >
          🎨 Customize
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowLinkMenu(!showLinkMenu)}
        className="text-xs text-blue-600 hover:text-blue-800 underline"
      >
        🔗 Link to color
      </button>
      
      {showLinkMenu && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 min-w-[200px]">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Link {colorName} to:
            </div>
            <div className="max-h-40 overflow-y-auto">
              {defaultLinkTarget && (
                <button
                  onClick={() => handleLinkToColor(defaultLinkTarget)}
                  className="block w-full text-left px-2 py-1 text-xs hover:bg-blue-100 dark:hover:bg-blue-800 rounded bg-blue-50 dark:bg-blue-900/20 font-medium text-blue-700 dark:text-blue-300 mb-1"
                >
                  {defaultLinkTarget} (recommended)
                </button>
              )}
              {availableColors
                .filter(color => color !== colorName && color !== defaultLinkTarget) // Don't allow self-linking or duplicate default
                .map(color => (
                  <button
                    key={color}
                    onClick={() => handleLinkToColor(color)}
                    className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {color}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const BrandStudio: React.FC = () => {
  const { config: brandConfig, updateConfig } = useBrandConfig();
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  
  // Basic theme colors available for linking
  const availableColors = [
    'primary', 'primary-foreground', 'secondary', 'secondary-foreground',
    'accent', 'accent-foreground', 'background', 'foreground',
    'muted', 'muted-foreground', 'card', 'card-foreground',
    'popover', 'popover-foreground', 'destructive', 'destructive-foreground',
    'border', 'input', 'ring', 'chart-1', 'chart-2', 'chart-3',
    'sidebar', 'sidebar-foreground', 'sidebar-primary'
  ];
  const [studioConfig, setStudioConfig] = useState<BrandStudioConfig>({
    variant: 'horizontal',
    size: 'md',
    showTagline: true,
    clickable: false,
    monochromeMode: 'none'
  });
  const [adaptiveConfig, setAdaptiveConfig] = useState<AdaptiveConfig>({
    minWidth: 200,
    maxWidth: 800,
    minHeight: 40,
    maxHeight: 200,
    containerOverflow: false
  });

  const updateStudioConfig = (updates: Partial<BrandStudioConfig>) => {
    setStudioConfig(prev => ({ ...prev, ...updates }));
  };

  // Color linking functions
  const linkColorTo = (colorType: keyof typeof brandConfig, targetColor: string) => {
    const updates: any = {};
    
    // Get current color value from CSS variables (simplified approach)
    const root = document.documentElement;
    const colorValue = getComputedStyle(root).getPropertyValue(`--${targetColor}`).trim();
    
    switch (colorType) {
      case 'primaryTextColor':
        updates.primaryTextColor = colorValue;
        updates.primaryTextColorLinked = true;
        updates.primaryTextColorLinkedTo = targetColor;
        break;
      case 'secondaryTextColor':
        updates.secondaryTextColor = colorValue;
        updates.secondaryTextColorLinked = true;
        updates.secondaryTextColorLinkedTo = targetColor;
        break;
      case 'iconBackgroundColor':
        updates.iconBackgroundColor = colorValue;
        updates.iconBackgroundColorLinked = true;
        updates.iconBackgroundColorLinkedTo = targetColor;
        break;
      case 'iconColor':
        updates.iconColor = colorValue;
        updates.iconColorLinked = true;
        updates.iconColorLinkedTo = targetColor;
        break;
    }
    
    updateConfig(updates);
  };

  const unlinkColor = (colorType: keyof typeof brandConfig) => {
    const updates: any = {};
    
    switch (colorType) {
      case 'primaryTextColor':
        updates.primaryTextColor = '#000000';
        updates.primaryTextColorLinked = false;
        updates.primaryTextColorLinkedTo = undefined;
        break;
      case 'secondaryTextColor':
        updates.secondaryTextColor = '#666666';
        updates.secondaryTextColorLinked = false;
        updates.secondaryTextColorLinkedTo = undefined;
        break;
      case 'iconBackgroundColor':
        updates.iconBackgroundColor = '#3b82f6';
        updates.iconBackgroundColorLinked = false;
        updates.iconBackgroundColorLinkedTo = undefined;
        break;
      case 'iconColor':
        updates.iconColor = '#ffffff';
        updates.iconColorLinked = false;
        updates.iconColorLinkedTo = undefined;
        break;
    }
    
    updateConfig(updates);
  };

  const applyPreset = (preset: QuickPreset) => {
    setStudioConfig(preset.config);
  };

  const generateJSXCode = () => {
    const props = [
      `variant="${studioConfig.variant}"`,
      `size="${studioConfig.size}"`,
      studioConfig.showTagline && 'showTagline',
      studioConfig.clickable && 'clickable',
      studioConfig.monochromeMode !== 'none' && `monochromeMode="${studioConfig.monochromeMode}"`,
      'brandName={brandConfig?.primaryText || "Alkitu"}',
      studioConfig.showTagline && 'tagline={brandConfig?.secondaryText || "Design System"}',
      'primaryTextColor={brandConfig?.primaryTextColor}',
      'secondaryTextColor={brandConfig?.secondaryTextColor}',
      'customSvg={brandConfig?.customSvg}',
      'iconBackgroundColor={brandConfig?.iconBackgroundColor}',
      'iconColor={brandConfig?.iconColor}'
    ].filter(Boolean);

    return `<Brand\n  ${props.join('\n  ')}\n/>`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateJSXCode());
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Brand Studio
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Interactive playground for testing brand configurations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'single' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('single')}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'responsive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('responsive')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'adaptive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('adaptive')}
              title="Adaptive sizing with min/max controls"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="gap-1"
            >
              <Copy className="w-4 h-4" />
              Copy JSX
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="space-y-6">
            
            {/* Quick Presets */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Quick Presets</Label>
              <div className="grid grid-cols-1 gap-2">
                {quickPresets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => applyPreset(preset)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="mt-0.5">{preset.icon}</div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {preset.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Property Controls */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Properties</Label>
              
              {/* Variant */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Variant</Label>
                <Select 
                  value={studioConfig.variant} 
                  onValueChange={(value: BrandVariant) => updateStudioConfig({ variant: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                    <SelectItem value="vertical">Vertical</SelectItem>
                    <SelectItem value="stacked">Stacked</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="icon-only">Icon Only</SelectItem>
                    <SelectItem value="text-only">Text Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Size</Label>
                <Select 
                  value={studioConfig.size} 
                  onValueChange={(value: BrandSize) => updateStudioConfig({ size: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">Extra Small</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Monochrome Mode */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Monochrome Mode</Label>
                <Select 
                  value={studioConfig.monochromeMode} 
                  onValueChange={(value: MonochromeMode) => updateStudioConfig({ monochromeMode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Boolean Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Show Tagline</Label>
                  <Switch
                    checked={studioConfig.showTagline}
                    onCheckedChange={(checked) => updateStudioConfig({ showTagline: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Clickable</Label>
                  <Switch
                    checked={studioConfig.clickable}
                    onCheckedChange={(checked) => updateStudioConfig({ clickable: checked })}
                  />
                </div>

              </div>
            </div>

            <Separator />

            {/* Colors Section */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Colors</Label>
              
              {/* System Colors Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="mb-2">
                  <Label className="text-xs font-medium">🔗 System Colors</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Brand colors inherit from your global theme colors by default. Each color can be individually linked to any theme color or customized with a specific value using the 🔗 Link to color and 🎨 Customize controls below.
                </p>
              </div>

              {/* Icon Background Color */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Icon Background</Label>
                  <ColorLinkingControls
                    colorName="brand-icon-background"
                    isLinked={brandConfig?.iconBackgroundColorLinked || false}
                    linkedTo={brandConfig?.iconBackgroundColorLinkedTo}
                    onLinkTo={(targetColor) => linkColorTo('iconBackgroundColor', targetColor)}
                    onUnlink={() => unlinkColor('iconBackgroundColor')}
                    availableColors={availableColors}
                    defaultLinkTarget="primary"
                  />
                </div>
                {!brandConfig?.iconBackgroundColorLinked && (
                  <ColorPicker
                    name="iconBackgroundColor"
                    label=""
                    color={brandConfig?.iconBackgroundColor || '#3b82f6'}
                    onChange={(color) => updateConfig({ iconBackgroundColor: color })}
                  />
                )}
                <p className="text-xs text-muted-foreground">Background color for the icon</p>
              </div>

              {/* Icon Color */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Icon Color</Label>
                  <ColorLinkingControls
                    colorName="brand-icon-color"
                    isLinked={brandConfig?.iconColorLinked || false}
                    linkedTo={brandConfig?.iconColorLinkedTo}
                    onLinkTo={(targetColor) => linkColorTo('iconColor', targetColor)}
                    onUnlink={() => unlinkColor('iconColor')}
                    availableColors={availableColors}
                    defaultLinkTarget="primary-foreground"
                  />
                </div>
                {!brandConfig?.iconColorLinked && (
                  <ColorPicker
                    name="iconColor"
                    label=""
                    color={brandConfig?.iconColor || '#ffffff'}
                    onChange={(color) => updateConfig({ iconColor: color })}
                  />
                )}
                <p className="text-xs text-muted-foreground">Color for the icon itself</p>
              </div>

              {/* Primary Text Color */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Primary Text Color</Label>
                  <ColorLinkingControls
                    colorName="brand-primary-text"
                    isLinked={brandConfig?.primaryTextColorLinked || false}
                    linkedTo={brandConfig?.primaryTextColorLinkedTo}
                    onLinkTo={(targetColor) => linkColorTo('primaryTextColor', targetColor)}
                    onUnlink={() => unlinkColor('primaryTextColor')}
                    availableColors={availableColors}
                    defaultLinkTarget="foreground"
                  />
                </div>
                {!brandConfig?.primaryTextColorLinked && (
                  <ColorPicker
                    name="primaryTextColor"
                    label=""
                    color={brandConfig?.primaryTextColor || '#000000'}
                    onChange={(color) => updateConfig({ primaryTextColor: color })}
                  />
                )}
                <p className="text-xs text-muted-foreground">Color for the main brand text</p>
              </div>

              {/* Secondary Text Color */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Secondary Text Color</Label>
                  <ColorLinkingControls
                    colorName="brand-secondary-text"
                    isLinked={brandConfig?.secondaryTextColorLinked || false}
                    linkedTo={brandConfig?.secondaryTextColorLinkedTo}
                    onLinkTo={(targetColor) => linkColorTo('secondaryTextColor', targetColor)}
                    onUnlink={() => unlinkColor('secondaryTextColor')}
                    availableColors={availableColors}
                    defaultLinkTarget="muted-foreground"
                  />
                </div>
                {!brandConfig?.secondaryTextColorLinked && (
                  <ColorPicker
                    name="secondaryTextColor"
                    label=""
                    color={brandConfig?.secondaryTextColor || '#666666'}
                    onChange={(color) => updateConfig({ secondaryTextColor: color })}
                  />
                )}
                <p className="text-xs text-muted-foreground">Color for the secondary brand text (tagline)</p>
              </div>
            </div>

            {/* Adaptive Controls - Only show when adaptive mode is selected */}
            {viewMode === 'adaptive' && (
              <>
                <Separator />
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Adaptive Sizing</Label>
                  
                  {/* Width Controls */}
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">Width Range (px)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Min</Label>
                        <Input
                          type="number"
                          value={adaptiveConfig.minWidth}
                          onChange={(e) => setAdaptiveConfig(prev => ({ 
                            ...prev, 
                            minWidth: Math.max(50, parseInt(e.target.value) || 50)
                          }))}
                          min="50"
                          max="2000"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Max</Label>
                        <Input
                          type="number"
                          value={adaptiveConfig.maxWidth}
                          onChange={(e) => setAdaptiveConfig(prev => ({ 
                            ...prev, 
                            maxWidth: Math.max(prev.minWidth + 50, parseInt(e.target.value) || prev.minWidth + 50)
                          }))}
                          min={adaptiveConfig.minWidth + 50}
                          max="2000"
                          className="h-8"
                        />
                      </div>
                    </div>
                    <Slider
                      value={[adaptiveConfig.minWidth, adaptiveConfig.maxWidth]}
                      onValueChange={([min, max]) => setAdaptiveConfig(prev => ({ 
                        ...prev, 
                        minWidth: min, 
                        maxWidth: max 
                      }))}
                      min={50}
                      max={1200}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Height Controls */}
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">Height Range (px)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Min</Label>
                        <Input
                          type="number"
                          value={adaptiveConfig.minHeight}
                          onChange={(e) => setAdaptiveConfig(prev => ({ 
                            ...prev, 
                            minHeight: Math.max(20, parseInt(e.target.value) || 20)
                          }))}
                          min="20"
                          max="500"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Max</Label>
                        <Input
                          type="number"
                          value={adaptiveConfig.maxHeight}
                          onChange={(e) => setAdaptiveConfig(prev => ({ 
                            ...prev, 
                            maxHeight: Math.max(prev.minHeight + 20, parseInt(e.target.value) || prev.minHeight + 20)
                          }))}
                          min={adaptiveConfig.minHeight + 20}
                          max="500"
                          className="h-8"
                        />
                      </div>
                    </div>
                    <Slider
                      value={[adaptiveConfig.minHeight, adaptiveConfig.maxHeight]}
                      onValueChange={([min, max]) => setAdaptiveConfig(prev => ({ 
                        ...prev, 
                        minHeight: min, 
                        maxHeight: max 
                      }))}
                      min={20}
                      max={300}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Container Overflow Control */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs text-muted-foreground">Allow Container Overflow</Label>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Allow brand to exceed container bounds
                      </p>
                    </div>
                    <Switch
                      checked={adaptiveConfig.containerOverflow}
                      onCheckedChange={(checked) => setAdaptiveConfig(prev => ({ 
                        ...prev, 
                        containerOverflow: checked 
                      }))}
                    />
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Configuration Summary */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Current Configuration</Label>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary">{studioConfig.variant}</Badge>
                <Badge variant="secondary">{studioConfig.size}</Badge>
                {studioConfig.showTagline && <Badge variant="outline">tagline</Badge>}
                {studioConfig.clickable && <Badge variant="outline">clickable</Badge>}
                {studioConfig.monochromeMode !== 'none' && (
                  <Badge variant="outline">{studioConfig.monochromeMode}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="xl:col-span-2">
            {viewMode === 'single' && (
              <div className="bg-muted/30 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                <Brand
                  {...studioConfig}
                  brandName={brandConfig?.primaryText || "Alkitu"}
                  tagline={brandConfig?.secondaryText || "Design System"}
                  primaryTextColor={brandConfig?.primaryTextColor}
                  secondaryTextColor={brandConfig?.secondaryTextColor}
                  customSvg={brandConfig?.customSvg}
                  iconBackgroundColor={brandConfig?.iconBackgroundColor}
                  iconColor={brandConfig?.iconColor}
                  onClick={studioConfig.clickable ? () => {} : undefined}
                />
              </div>
            )}

            {viewMode === 'responsive' && (
              <div className="space-y-4">
                {[
                  { name: 'Mobile', width: '375px', icon: <Smartphone className="w-4 h-4" /> },
                  { name: 'Tablet', width: '768px', icon: <Tablet className="w-4 h-4" /> },
                  { name: 'Desktop', width: '1024px', icon: <Monitor className="w-4 h-4" /> }
                ].map((viewport) => (
                  <div key={viewport.name} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {viewport.icon}
                      <span className="font-medium text-sm">{viewport.name}</span>
                      <Badge variant="outline" className="text-xs">{viewport.width}</Badge>
                    </div>
                    <div 
                      className="bg-muted/30 rounded-lg p-6 flex items-center justify-center mx-auto"
                      style={{ width: viewport.width, maxWidth: '100%' }}
                    >
                      <Brand
                        {...studioConfig}
                        brandName={brandConfig?.primaryText || "Alkitu"}
                        tagline={brandConfig?.secondaryText || "Design System"}
                        primaryTextColor={brandConfig?.primaryTextColor}
                        secondaryTextColor={brandConfig?.secondaryTextColor}
                        customSvg={brandConfig?.customSvg}
                        iconBackgroundColor={brandConfig?.iconBackgroundColor}
                        iconColor={brandConfig?.iconColor}
                        onClick={studioConfig.clickable ? () => {} : undefined}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'adaptive' && (
              <div className="space-y-6">
                {/* Adaptive Configuration Summary */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Maximize2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Adaptive Sizing Mode</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Brand component adapts fluidly between {adaptiveConfig.minWidth}px - {adaptiveConfig.maxWidth}px width 
                        and {adaptiveConfig.minHeight}px - {adaptiveConfig.maxHeight}px height.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          Width: {adaptiveConfig.minWidth}px - {adaptiveConfig.maxWidth}px
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Height: {adaptiveConfig.minHeight}px - {adaptiveConfig.maxHeight}px
                        </Badge>
                        {adaptiveConfig.containerOverflow && (
                          <Badge variant="outline" className="text-xs">Overflow Allowed</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Adaptive Preview */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Maximize2 className="w-4 h-4" />
                    <span className="font-medium text-sm">Adaptive Container</span>
                    <Badge variant="outline" className="text-xs">Resize to test</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Resizable Container */}
                    <div className="bg-muted/30 rounded-lg p-6 resize overflow-auto border-2 border-dashed border-primary/30"
                         style={{ 
                           minWidth: `${adaptiveConfig.minWidth}px`,
                           maxWidth: `${adaptiveConfig.maxWidth}px`,
                           minHeight: `${adaptiveConfig.minHeight}px`,
                           maxHeight: `${adaptiveConfig.maxHeight}px`,
                           width: `${Math.min(adaptiveConfig.maxWidth, Math.max(adaptiveConfig.minWidth, 400))}px`,
                           height: `${Math.min(adaptiveConfig.maxHeight, Math.max(adaptiveConfig.minHeight, 100))}px`
                         }}>
                      <div className={cn(
                        "w-full h-full flex items-center justify-center",
                        adaptiveConfig.containerOverflow ? "" : "overflow-hidden"
                      )}>
                        <Brand
                          {...studioConfig}
                          brandName={brandConfig?.primaryText || "Alkitu"}
                          tagline={brandConfig?.secondaryText || "Design System"}
                          primaryTextColor={brandConfig?.primaryTextColor}
                          secondaryTextColor={brandConfig?.secondaryTextColor}
                          customSvg={brandConfig?.customSvg}
                          iconBackgroundColor={brandConfig?.iconBackgroundColor}
                          iconColor={brandConfig?.iconColor}
                          onClick={studioConfig.clickable ? () => {} : undefined}
                        />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        💡 Drag the bottom-right corner of the container above to test adaptive behavior
                      </p>
                    </div>
                  </div>
                </div>

                {/* Different Container Sizes Demo */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Container Size Demonstrations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: 'Small', width: adaptiveConfig.minWidth + 50, height: adaptiveConfig.minHeight + 20 },
                      { name: 'Medium', width: Math.floor((adaptiveConfig.minWidth + adaptiveConfig.maxWidth) / 2), height: Math.floor((adaptiveConfig.minHeight + adaptiveConfig.maxHeight) / 2) },
                      { name: 'Large', width: adaptiveConfig.maxWidth - 50, height: adaptiveConfig.maxHeight - 20 }
                    ].map((demo) => (
                      <div key={demo.name} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium">{demo.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {demo.width}×{demo.height}
                          </Badge>
                        </div>
                        <div 
                          className="bg-muted/30 rounded p-3 flex items-center justify-center border border-dashed"
                          style={{ 
                            width: `${demo.width}px`, 
                            height: `${demo.height}px`,
                            maxWidth: '100%'
                          }}
                        >
                          <Brand
                            {...studioConfig}
                            brandName={brandConfig?.primaryText || "Alkitu"}
                            tagline={brandConfig?.secondaryText || "Design System"}
                            primaryTextColor={brandConfig?.primaryTextColor}
                            secondaryTextColor={brandConfig?.secondaryTextColor}
                            customSvg={brandConfig?.customSvg}
                            iconBackgroundColor={brandConfig?.iconBackgroundColor}
                            iconColor={brandConfig?.iconColor}
                            onClick={studioConfig.clickable ? () => {} : undefined}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {(['horizontal', 'vertical', 'stacked', 'compact', 'icon-only', 'text-only'] as BrandVariant[]).map((variant) => (
                  <div key={variant} className="space-y-2">
                    <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center min-h-[120px]">
                      <Brand
                        {...studioConfig}
                        variant={variant}
                        brandName={brandConfig?.primaryText || "Alkitu"}
                        tagline={brandConfig?.secondaryText || "Design System"}
                        primaryTextColor={brandConfig?.primaryTextColor}
                        secondaryTextColor={brandConfig?.secondaryTextColor}
                        customSvg={brandConfig?.customSvg}
                        iconBackgroundColor={brandConfig?.iconBackgroundColor}
                        iconColor={brandConfig?.iconColor}
                        onClick={studioConfig.clickable ? () => {} : undefined}
                      />
                    </div>
                    <div className="text-center">
                      <Badge 
                        variant={variant === studioConfig.variant ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {variant}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandStudio;