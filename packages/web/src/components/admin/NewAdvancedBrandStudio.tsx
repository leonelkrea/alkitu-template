'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  FileText,
  Palette,
  Settings2,
  Image,
  Type,
  Hash,
  Upload,
  Smartphone, 
  Tablet,
  Monitor,
  Copy,
  Link,
  Unlink
} from 'lucide-react';
import { Brand } from '@/components/atomic-design/atoms/brands/Brand';
import { useBrandConfig } from './BrandContext';
import { cn } from '@/lib/utils';
import BezierCurveEditor from './BezierCurveEditor';
import { IconInput } from '@/components/shared/icon-input';
import { ColorSelectorPopover } from '@/components/ui/color-selector-popover';
import { useCompanyTheme } from '@/components/providers/DynamicThemeProvider';
import { 
  ResponsiveConfig, 
  BrandLayoutConfig, 
  Breakpoint, 
  BreakpointInfo,
  SpacingValue,
  defaultResponsiveConfig,
  ANIMATION_CATEGORIES,
  AnimationCategory
} from './BrandStudio.types';

const breakpoints: BreakpointInfo[] = [
  { key: 'sm', label: 'Mobile', width: '640px', icon: <Smartphone className="w-4 h-4" /> },
  { key: 'md', label: 'Tablet', width: '768px', icon: <Tablet className="w-4 h-4" /> },
  { key: 'lg', label: 'Desktop', width: '1024px', icon: <Monitor className="w-4 h-4" /> },
];

export const NewAdvancedBrandStudio: React.FC = () => {
  const { config: brandConfig, updateConfig: updateBrandConfig } = useBrandConfig();
  const { isDarkMode } = useCompanyTheme();
  const [responsiveConfig, setResponsiveConfig] = useState<ResponsiveConfig<BrandLayoutConfig>>(defaultResponsiveConfig);
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>('md');
  const [customSvg, setCustomSvg] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<string>('zap');
  const [logoSource, setLogoSource] = useState<'default' | 'icon' | 'upload'>('default');
  const [previewSize, setPreviewSize] = useState({ width: 400, height: 300 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const currentConfig = responsiveConfig[activeBreakpoint];

  // Available theme colors for linking
  const availableColors = [
    'primary', 'primary-foreground', 'secondary', 'secondary-foreground',
    'accent', 'accent-foreground', 'background', 'foreground',
    'muted', 'muted-foreground', 'card', 'card-foreground',
    'popover', 'popover-foreground', 'destructive', 'destructive-foreground',
    'border', 'input', 'ring', 'chart-1', 'chart-2', 'chart-3',
    'sidebar', 'sidebar-foreground', 'sidebar-primary'
  ];

  // Color linking functions
  const linkColorTo = (colorType: keyof typeof brandConfig, targetColor: string) => {
    const updates: any = {};
    
    // Get current color value from CSS variables
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
    
    updateBrandConfig(updates);
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
    
    updateBrandConfig(updates);
  };

  // Cascade hierarchy: lg -> md -> sm
  const getCascadeOrder = (breakpoint: Breakpoint): Breakpoint[] => {
    switch (breakpoint) {
      case 'lg': return ['lg', 'md', 'sm'];
      case 'md': return ['md', 'sm'];
      case 'sm': return ['sm'];
      default: return ['lg', 'md', 'sm'];
    }
  };

  const updateBreakpointConfig = (breakpoint: Breakpoint, updates: Partial<BrandLayoutConfig>) => {
    setResponsiveConfig(prev => {
      const newConfig = { ...prev };
      const cascadeOrder = getCascadeOrder(breakpoint);
      
      // Apply updates to current breakpoint and mark as not inherited
      cascadeOrder.forEach((bp, index) => {
        if (index === 0) {
          // Primary breakpoint - apply updates and mark as not inherited
          const inheritanceUpdates: Partial<BrandLayoutConfig> = {};
          Object.keys(updates).forEach(key => {
            if (key !== '_inherited') {
              inheritanceUpdates._inherited = {
                ...newConfig[bp]._inherited,
                [key]: false
              };
            }
          });
          
          newConfig[bp] = { 
            ...newConfig[bp], 
            ...updates,
            ...inheritanceUpdates
          };
        } else {
          // Child breakpoints - inherit if not explicitly overridden
          const childConfig = { ...newConfig[bp] };
          Object.keys(updates).forEach(key => {
            if (key !== '_inherited' && (childConfig._inherited?.[key as keyof typeof childConfig._inherited] !== false)) {
              (childConfig as any)[key] = (newConfig[cascadeOrder[0]] as any)[key];
              childConfig._inherited = {
                ...childConfig._inherited,
                [key]: true
              };
            }
          });
          newConfig[bp] = childConfig;
        }
      });
      
      return newConfig;
    });
  };

  // Get the effective value for a property, considering inheritance
  const getEffectiveValue = (breakpoint: Breakpoint, property: keyof BrandLayoutConfig) => {
    const config = responsiveConfig[breakpoint];
    const isInherited = config._inherited?.[property as keyof typeof config._inherited];
    
    if (isInherited && breakpoint !== 'lg') {
      // Find the parent value
      const hierarchy = ['lg', 'md', 'sm'] as Breakpoint[];
      const currentIndex = hierarchy.indexOf(breakpoint);
      for (let i = currentIndex - 1; i >= 0; i--) {
        const parentConfig = responsiveConfig[hierarchy[i]];
        if (!parentConfig._inherited?.[property as keyof typeof parentConfig._inherited]) {
          return (parentConfig as any)[property];
        }
      }
    }
    
    return (config as any)[property];
  };

  // Check if a property is inherited
  const isPropertyInherited = (breakpoint: Breakpoint, property: keyof BrandLayoutConfig): boolean => {
    const config = responsiveConfig[breakpoint] as any;
    return config._inherited?.[property] === true;
  };

  // Component for showing inheritance indicator
  const InheritanceIndicator: React.FC<{ 
    property: keyof BrandLayoutConfig;
    breakpoint?: Breakpoint;
    className?: string;
  }> = ({ property, breakpoint = activeBreakpoint, className }) => {
    const inherited = isPropertyInherited(breakpoint, property);
    
    if (!inherited || breakpoint === 'lg') return null;
    
    const getParentBreakpoint = (bp: Breakpoint): Breakpoint | null => {
      const hierarchy = ['lg', 'md', 'sm'] as Breakpoint[];
      const currentIndex = hierarchy.indexOf(bp);
      return currentIndex > 0 ? hierarchy[currentIndex - 1] : null;
    };
    
    const parentBp = getParentBreakpoint(breakpoint);
    const parentLabel = breakpoints.find(bp => bp.key === parentBp)?.label;
    
    return (
      <div className={cn("flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400", className)}>
        <Link className="w-3 h-3" />
        <span>Linked to {parentLabel}</span>
      </div>
    );
  };

  // Color Linking Controls Interface and Component
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
                  .filter(color => color !== colorName && color !== defaultLinkTarget)
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

  // Enhanced color picker component
  interface EnhancedColorPickerProps {
    name: string;
    color: string;
    onChange: (value: string) => void;
    label: string;
    description?: string;
  }

  const EnhancedColorPicker: React.FC<EnhancedColorPickerProps> = ({
    name,
    color,
    onChange,
    label,
    description,
  }) => {
    const [inputValue, setInputValue] = useState(color);

    useEffect(() => {
      setInputValue(color);
    }, [color]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
      },
      [onChange],
    );

    const handleColorChange = useCallback(
      (newColor: string) => {
        setInputValue(newColor);
        onChange(newColor);
      },
      [onChange],
    );

    return (
      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <Label htmlFor={`color-${name}`} className="text-xs font-medium">
            {label}
          </Label>
        </div>
        <div className="relative flex items-center gap-1">
          <div
            className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded border"
            style={{ backgroundColor: color }}
          >
            <input
              type="color"
              id={`color-${name}`}
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="bg-input/25 border-border/20 h-8 flex-1 rounded border px-2 text-sm"
            placeholder="Enter color (hex)"
          />
          <ColorSelectorPopover currentColor={color} onChange={onChange} />
        </div>
        {description && (
          <p className="text-muted-foreground text-xs mt-1">{description}</p>
        )}
      </div>
    );
  };

  const handleSvgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result as string;
        // Extract SVG content (remove XML declaration and svg wrapper for inner HTML)
        const match = svgContent.match(/<svg[^>]*>(.*?)<\/svg>/s);
        if (match) {
          const svgInnerContent = match[1];
          setCustomSvg(svgInnerContent);
          updateBrandConfig({ customSvg: svgInnerContent });
          setLogoSource('upload');
        }
      };
      reader.readAsText(file);
    }
  };

  const renderBrandPreview = (config: BrandLayoutConfig) => {
    const getLogoProps = () => {
      switch (logoSource) {
        case 'icon':
          return { logoUrl: undefined, customSvg: undefined };
        case 'upload':
          return { logoUrl: undefined, customSvg: brandConfig?.customSvg || customSvg };
        default:
          return { logoUrl: undefined, customSvg: undefined };
      }
    };

    return (
      <Brand
        variant={config.variant}
        size={config.size}
        brandName={brandConfig?.primaryText || 'Alkitu'}
        showTagline={config.showTagline}
        tagline={brandConfig?.secondaryText || 'Design System'}
        clickable={config.clickable}
        useSystemColors={config.useSystemColors}
        primaryTextColor={brandConfig?.primaryTextColor}
        secondaryTextColor={brandConfig?.secondaryTextColor}
        monochromeMode={config.monochromeMode}
        iconBackgroundColor={brandConfig?.iconBackgroundColor}
        iconColor={brandConfig?.iconColor}
        gap={config.gap}
        textGap={config.textGap}
        iconSizeScale={config.iconSize === 'custom' ? config.customIconSize : 100}
        animationConfig={{
          enabled: config.animationEnabled,
          duration: config.animationDuration,
          timingFunction: config.animationTimingFunction,
          animationType: config.animationType
        }}
        {...getLogoProps()}
        onClick={config.clickable ? () => {} : undefined}
      />
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5" />
          Brand Studio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="xl:col-span-1">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="styles" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Styles
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4">
                <Accordion type="single" defaultValue="icon" collapsible>
                  {/* Icon Accordion */}
                  <AccordionItem value="icon">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Icon
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {/* Logo Source Selection */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Logo Source</Label>
                        <Select
                          value={logoSource}
                          onValueChange={(value: 'default' | 'icon' | 'upload') => setLogoSource(value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default Logo</SelectItem>
                            <SelectItem value="icon">System Icon</SelectItem>
                            <SelectItem value="upload">Custom SVG</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Icon Selector */}
                      {logoSource === 'icon' && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Select Icon</Label>
                          <IconInput
                            value={selectedIcon}
                            onChange={setSelectedIcon}
                            placeholder="Choose an icon"
                          />
                        </div>
                      )}

                      {/* SVG Upload */}
                      {logoSource === 'upload' && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Upload SVG</Label>
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose SVG File
                            </Button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".svg"
                              onChange={handleSvgUpload}
                              className="hidden"
                            />
                            {(brandConfig?.customSvg || customSvg) && (
                              <div className="text-xs text-green-600">✓ SVG uploaded successfully</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Icon Size Scale */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Icon Size Scale (%)</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[currentConfig.customIconSize || 100]}
                            onValueChange={([customIconSize]) => updateBreakpointConfig(activeBreakpoint, { customIconSize })}
                            min={50}
                            max={200}
                            step={10}
                            className="flex-1"
                          />
                          <span className="text-xs font-mono w-12">{currentConfig.customIconSize || 100}%</span>
                        </div>
                      </div>

                      {/* Monochrome Mode */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Monochrome Mode</Label>
                        <Select
                          value={currentConfig.monochromeMode}
                          onValueChange={(monochromeMode) => updateBreakpointConfig(activeBreakpoint, { monochromeMode })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="white">White</SelectItem>
                            <SelectItem value="black">Black</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Primary Text Accordion */}
                  <AccordionItem value="primary-text">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Primary Text
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Brand Name</Label>
                        <Input
                          value={brandConfig?.primaryText || 'Alkitu'}
                          onChange={(e) => {
                            updateBrandConfig({ primaryText: e.target.value });
                          }}
                          placeholder="Enter brand name"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Secondary Text Accordion */}
                  <AccordionItem value="secondary-text">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Secondary Text
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Show Tagline</Label>
                        <Switch
                          checked={currentConfig.showTagline}
                          onCheckedChange={(showTagline) => updateBreakpointConfig(activeBreakpoint, { showTagline })}
                        />
                      </div>

                      {currentConfig.showTagline && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Tagline</Label>
                          <Input
                            value={brandConfig?.secondaryText || 'Design System'}
                            onChange={(e) => {
                              updateBrandConfig({ secondaryText: e.target.value });
                            }}
                            placeholder="Enter tagline"
                          />
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* Styles Tab */}
              <TabsContent value="styles" className="space-y-4">
                <Accordion type="single" collapsible>
                  {/* Colors Accordion */}
                  <AccordionItem value="colors">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Colors
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
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
                          <Label className="text-sm font-medium">Icon Background</Label>
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
                          <EnhancedColorPicker
                            name="iconBackgroundColor"
                            color={brandConfig?.iconBackgroundColor || '#3b82f6'}
                            onChange={(value) => updateBrandConfig({ iconBackgroundColor: value })}
                            label=""
                            description="Background color for the icon"
                          />
                        )}
                      </div>

                      {/* Icon Color */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Icon Color</Label>
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
                          <EnhancedColorPicker
                            name="iconColor"
                            color={brandConfig?.iconColor || '#ffffff'}
                            onChange={(value) => updateBrandConfig({ iconColor: value })}
                            label=""
                            description="Color for the icon itself"
                          />
                        )}
                      </div>

                      {/* Primary Text Color */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Primary Text Color</Label>
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
                          <EnhancedColorPicker
                            name="primaryTextColor"
                            color={brandConfig?.primaryTextColor || '#000000'}
                            onChange={(value) => updateBrandConfig({ primaryTextColor: value })}
                            label=""
                            description="Color for the main brand text"
                          />
                        )}
                      </div>

                      {/* Secondary Text Color */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Secondary Text Color</Label>
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
                          <EnhancedColorPicker
                            name="secondaryTextColor"
                            color={brandConfig?.secondaryTextColor || '#666666'}
                            onChange={(value) => updateBrandConfig({ secondaryTextColor: value })}
                            label=""
                            description="Color for the secondary brand text (tagline)"
                          />
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Spacing Accordion */}
                  <AccordionItem value="spacing">
                    <AccordionTrigger className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-current rounded-sm flex items-center justify-center">
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                      </div>
                      Spacing
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {/* Gap between icon and text */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Icon to Text Gap (px)</Label>
                          <InheritanceIndicator property="gap" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[currentConfig.gap]}
                            onValueChange={([gap]) => updateBreakpointConfig(activeBreakpoint, { gap })}
                            min={0}
                            max={32}
                            step={2}
                            className="flex-1"
                          />
                          <span className="text-xs font-mono w-12">{currentConfig.gap}px</span>
                        </div>
                      </div>

                      {/* Gap between primary and secondary text */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Text Gap (px)</Label>
                          <InheritanceIndicator property="textGap" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[currentConfig.textGap]}
                            onValueChange={([textGap]) => updateBreakpointConfig(activeBreakpoint, { textGap })}
                            min={0}
                            max={16}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-xs font-mono w-12">{currentConfig.textGap}px</span>
                        </div>
                      </div>

                      {/* Margin */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Margin (px)</Label>
                          <InheritanceIndicator property="margin" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Top</Label>
                            <Input
                              type="number"
                              value={currentConfig.margin.top}
                              onChange={(e) => updateBreakpointConfig(activeBreakpoint, {
                                margin: { ...currentConfig.margin, top: parseInt(e.target.value) || 0 }
                              })}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Right</Label>
                            <Input
                              type="number"
                              value={currentConfig.margin.right}
                              onChange={(e) => updateBreakpointConfig(activeBreakpoint, {
                                margin: { ...currentConfig.margin, right: parseInt(e.target.value) || 0 }
                              })}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Bottom</Label>
                            <Input
                              type="number"
                              value={currentConfig.margin.bottom}
                              onChange={(e) => updateBreakpointConfig(activeBreakpoint, {
                                margin: { ...currentConfig.margin, bottom: parseInt(e.target.value) || 0 }
                              })}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Left</Label>
                            <Input
                              type="number"
                              value={currentConfig.margin.left}
                              onChange={(e) => updateBreakpointConfig(activeBreakpoint, {
                                margin: { ...currentConfig.margin, left: parseInt(e.target.value) || 0 }
                              })}
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Padding */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Padding (px)</Label>
                          <InheritanceIndicator property="padding" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Top</Label>
                            <Input
                              type="number"
                              value={currentConfig.padding.top}
                              onChange={(e) => updateBreakpointConfig(activeBreakpoint, {
                                padding: { ...currentConfig.padding, top: parseInt(e.target.value) || 0 }
                              })}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Right</Label>
                            <Input
                              type="number"
                              value={currentConfig.padding.right}
                              onChange={(e) => updateBreakpointConfig(activeBreakpoint, {
                                padding: { ...currentConfig.padding, right: parseInt(e.target.value) || 0 }
                              })}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Bottom</Label>
                            <Input
                              type="number"
                              value={currentConfig.padding.bottom}
                              onChange={(e) => updateBreakpointConfig(activeBreakpoint, {
                                padding: { ...currentConfig.padding, bottom: parseInt(e.target.value) || 0 }
                              })}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Left</Label>
                            <Input
                              type="number"
                              value={currentConfig.padding.left}
                              onChange={(e) => updateBreakpointConfig(activeBreakpoint, {
                                padding: { ...currentConfig.padding, left: parseInt(e.target.value) || 0 }
                              })}
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Layout Accordion */}
                  <AccordionItem value="layout">
                    <AccordionTrigger className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-current rounded-sm grid grid-cols-2 gap-px">
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                      </div>
                      Layout
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {/* Variant */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Variant</Label>
                          <InheritanceIndicator property="variant" />
                        </div>
                        <Select
                          value={getEffectiveValue(activeBreakpoint, 'variant')}
                          onValueChange={(variant) => updateBreakpointConfig(activeBreakpoint, { variant })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="horizontal">Horizontal</SelectItem>
                            <SelectItem value="vertical">Vertical</SelectItem>
                            <SelectItem value="icon-only">Icon Only</SelectItem>
                            <SelectItem value="text-only">Text Only</SelectItem>
                            <SelectItem value="stacked">Stacked</SelectItem>
                            <SelectItem value="compact">Compact</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Size */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Size</Label>
                          <InheritanceIndicator property="size" />
                        </div>
                        <Select
                          value={currentConfig.size}
                          onValueChange={(size) => updateBreakpointConfig(activeBreakpoint, { size })}
                        >
                          <SelectTrigger className="h-8">
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

                      {/* Alignment */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Horizontal Alignment</Label>
                          <InheritanceIndicator property="alignment" />
                        </div>
                        <Select
                          value={currentConfig.alignment}
                          onValueChange={(alignment) => updateBreakpointConfig(activeBreakpoint, { alignment })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Vertical Alignment */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Vertical Alignment</Label>
                          <InheritanceIndicator property="verticalAlignment" />
                        </div>
                        <Select
                          value={currentConfig.verticalAlignment}
                          onValueChange={(verticalAlignment) => updateBreakpointConfig(activeBreakpoint, { verticalAlignment })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="bottom">Bottom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Container Width */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Container Width</Label>
                          <InheritanceIndicator property="containerWidth" />
                        </div>
                        <Select
                          value={currentConfig.containerWidth}
                          onValueChange={(containerWidth) => updateBreakpointConfig(activeBreakpoint, { containerWidth })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fit-content">Fit Content</SelectItem>
                            <SelectItem value="full">Full Width</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Custom Width Controls */}
                      {currentConfig.containerWidth === 'custom' && (
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <Label className="text-xs">Min Width (px)</Label>
                              <InheritanceIndicator property="minWidth" className="text-[10px]" />
                            </div>
                            <Input
                              type="number"
                              value={currentConfig.minWidth || ''}
                              onChange={(e) => updateBreakpointConfig(activeBreakpoint, {
                                minWidth: parseInt(e.target.value) || undefined
                              })}
                              className="h-8"
                              placeholder="Auto"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <Label className="text-xs">Max Width (px)</Label>
                              <InheritanceIndicator property="maxWidth" className="text-[10px]" />
                            </div>
                            <Input
                              type="number"
                              value={currentConfig.maxWidth || ''}
                              onChange={(e) => updateBreakpointConfig(activeBreakpoint, {
                                maxWidth: parseInt(e.target.value) || undefined
                              })}
                              className="h-8"
                              placeholder="Auto"
                            />
                          </div>
                        </div>
                      )}

                      {/* Overflow */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Overflow</Label>
                          <InheritanceIndicator property="overflow" />
                        </div>
                        <Select
                          value={currentConfig.overflow}
                          onValueChange={(overflow) => updateBreakpointConfig(activeBreakpoint, { overflow })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visible">Visible</SelectItem>
                            <SelectItem value="hidden">Hidden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-4">
                <Accordion type="single" collapsible>
                  {/* Animation Accordion */}
                  <AccordionItem value="animation">
                    <AccordionTrigger className="flex items-center gap-2">
                      <div className="w-4 h-4 relative">
                        <div className="absolute inset-0 border border-current rounded-full animate-ping"></div>
                        <div className="w-4 h-4 bg-current rounded-full"></div>
                      </div>
                      Animation
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {/* Enable Animation */}
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Enable Animation</Label>
                        <Switch
                          checked={currentConfig.animationEnabled}
                          onCheckedChange={(animationEnabled) => updateBreakpointConfig(activeBreakpoint, { animationEnabled })}
                        />
                      </div>

                      {currentConfig.animationEnabled && (
                        <>
                          {/* Animation Category Selector */}
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">Animation Category</Label>
                            <Select
                              value={currentConfig.animationCategory}
                              onValueChange={(animationCategory: AnimationCategory) => {
                                updateBreakpointConfig(activeBreakpoint, { 
                                  animationCategory,
                                  animationType: animationCategory === 'none' ? '' : ANIMATION_CATEGORIES[animationCategory][0]?.className || ''
                                });
                              }}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(ANIMATION_CATEGORIES).map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category.split('-').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Animation Type Selector */}
                          {currentConfig.animationCategory !== 'none' && (
                            <div>
                              <Label className="text-xs text-muted-foreground mb-2 block">Animation Type</Label>
                              <Select
                                value={currentConfig.animationType}
                                onValueChange={(animationType) => updateBreakpointConfig(activeBreakpoint, { animationType })}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ANIMATION_CATEGORIES[currentConfig.animationCategory]?.map((animation) => (
                                    <SelectItem key={animation.className} value={animation.className}>
                                      <div className="flex flex-col">
                                        <span className="font-medium">{animation.name}</span>
                                        <span className="text-xs text-muted-foreground">{animation.description}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {/* Duration Control */}
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">Duration (ms)</Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                value={[currentConfig.animationDuration]}
                                onValueChange={([animationDuration]) => updateBreakpointConfig(activeBreakpoint, { animationDuration })}
                                min={100}
                                max={3000}
                                step={100}
                                className="flex-1"
                              />
                              <span className="text-xs font-mono w-12">{currentConfig.animationDuration}ms</span>
                            </div>
                          </div>

                          {/* Bezier Curve Editor */}
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">Timing Function</Label>
                            <BezierCurveEditor
                              value={currentConfig.animationTimingFunction}
                              onChange={(animationTimingFunction) => updateBreakpointConfig(activeBreakpoint, { animationTimingFunction })}
                            />
                          </div>

                          {/* Animation Preview */}
                          {currentConfig.animationType && (
                            <div>
                              <Label className="text-xs text-muted-foreground mb-2 block">Preview Animation</Label>
                              <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center min-h-[80px]">
                                <div 
                                  className={cn(
                                    "w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm",
                                    "animate__animated",
                                    currentConfig.animationType
                                  )}
                                  style={{
                                    animationDuration: `${currentConfig.animationDuration}ms`,
                                    animationTimingFunction: currentConfig.animationTimingFunction,
                                    animationIterationCount: 'infinite'
                                  }}
                                >
                                  A
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Responsive Accordion */}
                  <AccordionItem value="responsive">
                    <AccordionTrigger className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Smartphone className="w-2 h-3" />
                        <Tablet className="w-2.5 h-3" />
                        <Monitor className="w-3 h-3" />
                      </div>
                      Responsive
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {/* Current Breakpoint Info */}
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Current Breakpoint</span>
                          <Badge variant="outline" className="text-xs">
                            {breakpoints.find(bp => bp.key === activeBreakpoint)?.label}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Editing configuration for {breakpoints.find(bp => bp.key === activeBreakpoint)?.width} screens
                        </div>
                      </div>

                      {/* Visibility Control */}
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Visible on this breakpoint</Label>
                        <Switch
                          checked={currentConfig.visible}
                          onCheckedChange={(visible) => updateBreakpointConfig(activeBreakpoint, { visible })}
                        />
                      </div>

                      {/* Breakpoint Quick Switcher */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Quick Breakpoint Switch</Label>
                        <div className="flex gap-2">
                          {breakpoints.map((bp) => (
                            <Button
                              key={bp.key}
                              variant={activeBreakpoint === bp.key ? "default" : "outline"}
                              size="sm"
                              onClick={() => setActiveBreakpoint(bp.key)}
                              className="flex items-center gap-2"
                            >
                              {bp.icon}
                              {bp.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Copy Configuration */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Copy Configuration</Label>
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(sourceBreakpoint: Breakpoint) => {
                              if (sourceBreakpoint !== activeBreakpoint) {
                                updateBreakpointConfig(activeBreakpoint, responsiveConfig[sourceBreakpoint]);
                              }
                            }}
                          >
                            <SelectTrigger className="h-8 flex-1">
                              <SelectValue placeholder="Copy from..." />
                            </SelectTrigger>
                            <SelectContent>
                              {breakpoints
                                .filter(bp => bp.key !== activeBreakpoint)
                                .map((bp) => (
                                <SelectItem key={bp.key} value={bp.key}>
                                  <div className="flex items-center gap-2">
                                    {bp.icon}
                                    {bp.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(JSON.stringify(currentConfig, null, 2));
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Interactions Accordion */}
                  <AccordionItem value="interactions">
                    <AccordionTrigger className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-current rounded cursor-pointer hover:bg-current/10 transition-colors">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                        </div>
                      </div>
                      Interactions
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {/* Clickable */}
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Clickable</Label>
                          <div className="text-xs text-muted-foreground">
                            Makes the brand component interactive
                          </div>
                        </div>
                        <Switch
                          checked={currentConfig.clickable}
                          onCheckedChange={(clickable) => updateBreakpointConfig(activeBreakpoint, { clickable })}
                        />
                      </div>

                      {/* Hover Effects Info */}
                      {currentConfig.clickable && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                          <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Hover Effects Active
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-300">
                            When clickable, the component will show hover effects:
                            <ul className="list-disc list-inside mt-1 space-y-0.5">
                              <li>Opacity change on hover</li>
                              <li>Scale transform on hover/active</li>
                              <li>Smooth transitions</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Icon Size Control */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Icon Size Mode</Label>
                        <Select
                          value={currentConfig.iconSize}
                          onValueChange={(iconSize) => updateBreakpointConfig(activeBreakpoint, { iconSize })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default Size</SelectItem>
                            <SelectItem value="custom">Custom Size</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Custom Icon Size */}
                      {currentConfig.iconSize === 'custom' && (
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            Custom Icon Size ({currentConfig.customIconSize}%)
                          </Label>
                          <Slider
                            value={[currentConfig.customIconSize || 100]}
                            onValueChange={([customIconSize]) => updateBreakpointConfig(activeBreakpoint, { customIconSize })}
                            min={25}
                            max={300}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      )}

                      {/* Overflow Control */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium">Overflow Handling</Label>
                        </div>
                        <Select
                          value={currentConfig.overflow}
                          onValueChange={(overflow) => updateBreakpointConfig(activeBreakpoint, { overflow })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visible">
                              <div className="flex flex-col">
                                <span>Visible</span>
                                <span className="text-xs text-muted-foreground">Content can overflow container</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="hidden">
                              <div className="flex flex-col">
                                <span>Hidden</span>
                                <span className="text-xs text-muted-foreground">Content will be clipped</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="xl:col-span-2 space-y-6">
            {/* Resizable Preview Container */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  {breakpoints.find(bp => bp.key === activeBreakpoint)?.icon}
                  Interactive Preview
                </h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {previewSize.width} × {previewSize.height}px
                  </Badge>
                  <Select
                    value={activeBreakpoint}
                    onValueChange={(breakpoint: Breakpoint) => setActiveBreakpoint(breakpoint)}
                  >
                    <SelectTrigger className="h-8 w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {breakpoints.map((bp) => (
                        <SelectItem key={bp.key} value={bp.key}>
                          {bp.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Resizable Preview Container */}
              <div className="bg-muted/20 rounded-lg p-4 overflow-hidden">
                <div
                  ref={previewRef}
                  className="bg-background border-2 border-dashed border-muted-foreground/30 rounded-lg resize overflow-auto min-w-[200px] min-h-[150px] max-w-full max-h-[600px] flex items-center justify-center p-4"
                  style={{
                    width: `${previewSize.width}px`,
                    height: `${previewSize.height}px`,
                  }}
                  onMouseUp={() => {
                    if (previewRef.current) {
                      const rect = previewRef.current.getBoundingClientRect();
                      setPreviewSize({
                        width: Math.round(rect.width),
                        height: Math.round(rect.height)
                      });
                    }
                  }}
                >
                  {renderBrandPreview(currentConfig)}
                </div>
                
                {/* Size Controls */}
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>Width:</span>
                    <Input
                      type="number"
                      value={previewSize.width}
                      onChange={(e) => setPreviewSize(prev => ({ ...prev, width: parseInt(e.target.value) || 200 }))}
                      className="h-6 w-20 text-xs"
                      min={200}
                      max={800}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Height:</span>
                    <Input
                      type="number"
                      value={previewSize.height}
                      onChange={(e) => setPreviewSize(prev => ({ ...prev, height: parseInt(e.target.value) || 150 }))}
                      className="h-6 w-20 text-xs"
                      min={150}
                      max={600}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewSize({ width: 400, height: 300 })}
                    className="h-6 px-2 text-xs"
                  >
                    Reset
                  </Button>
                  <div className="ml-auto text-xs opacity-70">
                    💡 Drag corner to resize
                  </div>
                </div>
              </div>
            </div>

            {/* All Breakpoints Comparison */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-sm mb-4">All Breakpoints Comparison</h4>
              <div className="space-y-4">
                {breakpoints.map((bp) => (
                  <div key={bp.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {bp.icon}
                        <span className="text-sm font-medium">{bp.label}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{bp.width}</Badge>
                    </div>
                    <div className="bg-muted/20 rounded p-3 flex items-center justify-center">
                      {renderBrandPreview(responsiveConfig[bp.key])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewAdvancedBrandStudio;