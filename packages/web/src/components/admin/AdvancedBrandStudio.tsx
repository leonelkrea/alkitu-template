'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Eye, 
  EyeOff,
  Smartphone, 
  Tablet,
  Monitor,
  Copy, 
  RotateCcw,
  Settings2,
  ChevronRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Maximize2,
  Play
} from 'lucide-react';
import { Brand } from '@/components/atomic-design/atoms/brands/Brand';
import { useBrandConfig } from './BrandContext';
import { cn } from '@/lib/utils';
import BezierCurveEditor from './BezierCurveEditor';
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
  { key: 'lg', label: 'Desktop', width: '1024px', icon: <Monitor className="w-4 h-4" /> }
];

// Spacing Box Control Component
const SpacingBoxControl: React.FC<{
  label: string;
  value: SpacingValue;
  onChange: (value: SpacingValue) => void;
  min?: number;
  max?: number;
  step?: number;
}> = ({ label, value, onChange, min = 0, max = 32, step = 4 }) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="grid grid-cols-4 gap-1">
        <div className="text-center">
          <Input
            type="number"
            value={value.top}
            onChange={(e) => onChange({ ...value, top: parseInt(e.target.value) || 0 })}
            className="h-8 text-xs text-center"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-xs text-muted-foreground">T</span>
        </div>
        <div className="text-center">
          <Input
            type="number"
            value={value.right}
            onChange={(e) => onChange({ ...value, right: parseInt(e.target.value) || 0 })}
            className="h-8 text-xs text-center"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-xs text-muted-foreground">R</span>
        </div>
        <div className="text-center">
          <Input
            type="number"
            value={value.bottom}
            onChange={(e) => onChange({ ...value, bottom: parseInt(e.target.value) || 0 })}
            className="h-8 text-xs text-center"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-xs text-muted-foreground">B</span>
        </div>
        <div className="text-center">
          <Input
            type="number"
            value={value.left}
            onChange={(e) => onChange({ ...value, left: parseInt(e.target.value) || 0 })}
            className="h-8 text-xs text-center"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-xs text-muted-foreground">L</span>
        </div>
      </div>
    </div>
  );
};

// Resizable Preview Component
const ResizablePreview: React.FC<{
  responsiveConfig: ResponsiveConfig<BrandLayoutConfig>;
  brandConfig: any;
}> = ({ responsiveConfig, brandConfig }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [activeConfig, setActiveConfig] = useState<BrandLayoutConfig>(responsiveConfig.lg);

  useEffect(() => {
    const updateConfig = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.offsetWidth;
      setContainerWidth(width);
      
      // Determine which config to use based on actual container width
      let config: BrandLayoutConfig;
      if (width <= 640) {
        config = responsiveConfig.sm;
      } else if (width <= 768) {
        config = responsiveConfig.md;
      } else {
        config = responsiveConfig.lg;
      }
      
      setActiveConfig(config);
    };

    updateConfig();

    // Use ResizeObserver to detect size changes
    const resizeObserver = new ResizeObserver(updateConfig);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [responsiveConfig]);

  const getActiveBreakpointName = () => {
    if (containerWidth <= 640) return 'Mobile (sm)';
    if (containerWidth <= 768) return 'Tablet (md)';
    return 'Desktop (lg)';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <Maximize2 className="w-4 h-4" />
          Resizable Responsive Preview
        </h4>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {containerWidth}px
          </Badge>
          <Badge variant={activeConfig.visible ? 'default' : 'secondary'} className="text-xs">
            {getActiveBreakpointName()}
          </Badge>
        </div>
      </div>
      
      <div className="border-2 border-dashed border-primary/30 rounded-lg p-6">
        <div 
          ref={containerRef}
          className="relative bg-muted/30 rounded-lg p-6 min-w-[200px] max-w-full mx-auto resize overflow-auto"
          style={{ 
            width: '100%',
            height: '200px',
            minHeight: '120px',
            maxHeight: '500px'
          }}
        >
          {/* Resize handle indicator */}
          <div className="absolute right-0 bottom-0 w-4 h-4 flex items-center justify-center pointer-events-none">
            <div className="w-3 h-3 border-r-2 border-b-2 border-primary/40" />
          </div>
          
          <div className="w-full h-full flex items-center justify-center" style={{ cursor: 'default' }}>
            {activeConfig.visible ? (
              <Brand
                variant={activeConfig.variant}
                size={activeConfig.size}
                showTagline={activeConfig.showTagline}
                clickable={activeConfig.clickable}
                monochromeMode={activeConfig.monochromeMode}
                useSystemColors={activeConfig.useSystemColors}
                brandName={brandConfig?.primaryText || "Alkitu"}
                tagline={brandConfig?.secondaryText || "Design System"}
                primaryTextColor={brandConfig?.primaryTextColor}
                secondaryTextColor={brandConfig?.secondaryTextColor}
                customSvg={brandConfig?.customSvg}
                iconBackgroundColor={brandConfig?.iconBackgroundColor}
                iconColor={brandConfig?.iconColor}
                gap={activeConfig.gap}
                textGap={activeConfig.textGap}
                iconSizeScale={activeConfig.iconSize === 'custom' ? activeConfig.customIconSize : 100}
                animationConfig={{
                  enabled: activeConfig.animationEnabled,
                  duration: activeConfig.animationDuration,
                  timingFunction: activeConfig.animationTimingFunction,
                  animationType: activeConfig.animationType
                }}
                onClick={activeConfig.clickable ? () => {} : undefined}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <EyeOff className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Hidden at {getActiveBreakpointName()}</p>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          💡 Drag the bottom-right corner to resize both width and height • Currently: {getActiveBreakpointName()} configuration
        </p>
      </div>
    </div>
  );
};

const AdvancedBrandStudio: React.FC = () => {
  const { config: brandConfig } = useBrandConfig();
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>('md');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [responsiveConfig, setResponsiveConfig] = useState<ResponsiveConfig<BrandLayoutConfig>>(defaultResponsiveConfig);

  const updateBreakpointConfig = (breakpoint: Breakpoint, updates: Partial<BrandLayoutConfig>) => {
    setResponsiveConfig(prev => ({
      ...prev,
      [breakpoint]: { ...prev[breakpoint], ...updates }
    }));
  };

  const copyToAllBreakpoints = () => {
    const currentConfig = responsiveConfig[activeBreakpoint];
    setResponsiveConfig({
      sm: { ...currentConfig },
      md: { ...currentConfig },
      lg: { ...currentConfig }
    });
  };

  const resetBreakpoint = (breakpoint: Breakpoint) => {
    setResponsiveConfig(prev => ({
      ...prev,
      [breakpoint]: defaultResponsiveConfig[breakpoint]
    }));
  };

  const currentConfig = responsiveConfig[activeBreakpoint];

  const generateResponsiveJSX = () => {
    const hasResponsiveChanges = 
      JSON.stringify(responsiveConfig.sm) !== JSON.stringify(responsiveConfig.md) ||
      JSON.stringify(responsiveConfig.md) !== JSON.stringify(responsiveConfig.lg);

    if (!hasResponsiveChanges) {
      // Single config for all breakpoints
      const config = responsiveConfig.md;
      return `<Brand
  variant="${config.variant}"
  size="${config.size}"
  ${config.showTagline ? 'showTagline' : ''}
  ${config.clickable ? 'clickable' : ''}
  className="${generateClassNames(config)}"
  style={${JSON.stringify(generateStyles(config), null, 2)}}
/>`;
    }

    // Responsive config
    return `<Brand
  className={cn(
    // Base styles
    "${generateClassNames(responsiveConfig.sm)}",
    // Tablet styles
    "md:${generateClassNames(responsiveConfig.md).replace(/ /g, ' md:')}",
    // Desktop styles
    "lg:${generateClassNames(responsiveConfig.lg).replace(/ /g, ' lg:')}"
  )}
  // Responsive props would need custom implementation
  {...getResponsiveProps(screenSize)}
/>`;
  };

  const generateClassNames = (config: BrandLayoutConfig) => {
    const classes = [];
    
    // Alignment
    if (config.alignment === 'center') classes.push('justify-center');
    if (config.alignment === 'right') classes.push('justify-end');
    
    // Vertical alignment
    if (config.verticalAlignment === 'top') classes.push('items-start');
    if (config.verticalAlignment === 'center') classes.push('items-center');
    if (config.verticalAlignment === 'bottom') classes.push('items-end');
    
    // Visibility
    if (!config.visible) classes.push('hidden');
    
    // Overflow
    if (config.overflow === 'hidden') classes.push('overflow-hidden');
    
    return classes.join(' ');
  };

  const generateStyles = (config: BrandLayoutConfig) => {
    const styles: React.CSSProperties = {
      margin: `${config.margin.top}px ${config.margin.right}px ${config.margin.bottom}px ${config.margin.left}px`,
      padding: `${config.padding.top}px ${config.padding.right}px ${config.padding.bottom}px ${config.padding.left}px`
    };

    // Container width styles
    if (config.containerWidth === 'full') {
      styles.width = '100%';
    } else if (config.containerWidth === 'custom') {
      if (config.minWidth) styles.minWidth = `${config.minWidth}px`;
      if (config.maxWidth) styles.maxWidth = `${config.maxWidth}px`;
    }
    // 'fit-content' doesn't need explicit styles

    return styles;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              Advanced Brand Studio
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Configure responsive brand layouts with advanced controls
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showAdvanced ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Advanced' : 'Simple'} Mode
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(generateResponsiveJSX())}
              className="gap-1"
            >
              <Copy className="w-4 h-4" />
              Copy JSX
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Breakpoint Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {breakpoints.map(bp => (
                <Button
                  key={bp.key}
                  variant={activeBreakpoint === bp.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveBreakpoint(bp.key)}
                  className="gap-2"
                >
                  {bp.icon}
                  <span className="hidden sm:inline">{bp.label}</span>
                  <Badge 
                    variant={responsiveConfig[bp.key].visible ? 'default' : 'secondary'}
                    className="ml-1 h-5 w-5 p-0 justify-center"
                  >
                    {responsiveConfig[bp.key].visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Badge>
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={copyToAllBreakpoints}
                title="Copy current breakpoint settings to all breakpoints"
              >
                Copy to All
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => resetBreakpoint(activeBreakpoint)}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="space-y-6">
              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Visible on {activeBreakpoint.toUpperCase()}</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Show/hide brand on this breakpoint
                  </p>
                </div>
                <Switch
                  checked={currentConfig.visible}
                  onCheckedChange={(visible) => updateBreakpointConfig(activeBreakpoint, { visible })}
                />
              </div>

              {currentConfig.visible && (
                <>
                  {/* Basic Controls */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Basic Properties</Label>
                    
                    {/* Variant */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Variant</Label>
                      <Select 
                        value={currentConfig.variant} 
                        onValueChange={(variant: BrandVariant) => updateBreakpointConfig(activeBreakpoint, { variant })}
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
                        value={currentConfig.size} 
                        onValueChange={(size: BrandSize) => updateBreakpointConfig(activeBreakpoint, { size })}
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

                    {/* Boolean Controls */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Show Tagline</Label>
                        <Switch
                          checked={currentConfig.showTagline}
                          onCheckedChange={(showTagline) => updateBreakpointConfig(activeBreakpoint, { showTagline })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Clickable</Label>
                        <Switch
                          checked={currentConfig.clickable}
                          onCheckedChange={(clickable) => updateBreakpointConfig(activeBreakpoint, { clickable })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Advanced Controls */}
                  {showAdvanced && (
                    <>
                      <Separator />
                      
                      {/* Alignment Controls */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Alignment</Label>
                        
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">Horizontal Alignment</Label>
                            <div className="grid grid-cols-3 gap-1">
                              <Button
                                variant={currentConfig.alignment === 'left' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateBreakpointConfig(activeBreakpoint, { alignment: 'left' })}
                              >
                                <AlignLeft className="w-4 h-4" />
                              </Button>
                              <Button
                                variant={currentConfig.alignment === 'center' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateBreakpointConfig(activeBreakpoint, { alignment: 'center' })}
                              >
                                <AlignCenter className="w-4 h-4" />
                              </Button>
                              <Button
                                variant={currentConfig.alignment === 'right' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateBreakpointConfig(activeBreakpoint, { alignment: 'right' })}
                              >
                                <AlignRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">Vertical Alignment</Label>
                            <div className="grid grid-cols-3 gap-1">
                              <Button
                                variant={currentConfig.verticalAlignment === 'top' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateBreakpointConfig(activeBreakpoint, { verticalAlignment: 'top' })}
                              >
                                <AlignVerticalJustifyStart className="w-4 h-4" />
                              </Button>
                              <Button
                                variant={currentConfig.verticalAlignment === 'center' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateBreakpointConfig(activeBreakpoint, { verticalAlignment: 'center' })}
                              >
                                <AlignVerticalJustifyCenter className="w-4 h-4" />
                              </Button>
                              <Button
                                variant={currentConfig.verticalAlignment === 'bottom' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateBreakpointConfig(activeBreakpoint, { verticalAlignment: 'bottom' })}
                              >
                                <AlignVerticalJustifyEnd className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Container Width Controls */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Container Width</Label>
                        
                        <div className="space-y-3">
                          <Select 
                            value={currentConfig.containerWidth} 
                            onValueChange={(containerWidth: 'fit-content' | 'full' | 'custom') => {
                              updateBreakpointConfig(activeBreakpoint, { containerWidth });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fit-content">Fit Content</SelectItem>
                              <SelectItem value="full">Full Width</SelectItem>
                              <SelectItem value="custom">Custom Width</SelectItem>
                            </SelectContent>
                          </Select>

                          {currentConfig.containerWidth === 'custom' && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs text-muted-foreground">Min Width (px)</Label>
                                <Input
                                  type="number"
                                  value={currentConfig.minWidth || ''}
                                  onChange={(e) => updateBreakpointConfig(activeBreakpoint, { 
                                    minWidth: e.target.value ? parseInt(e.target.value) : undefined 
                                  })}
                                  placeholder="auto"
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Max Width (px)</Label>
                                <Input
                                  type="number"
                                  value={currentConfig.maxWidth || ''}
                                  onChange={(e) => updateBreakpointConfig(activeBreakpoint, { 
                                    maxWidth: e.target.value ? parseInt(e.target.value) : undefined 
                                  })}
                                  placeholder="none"
                                  className="h-8"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Icon & Layout Controls */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Icon & Layout</Label>
                        
                        {/* Icon Size Control */}
                        <div className="space-y-3">
                          <Select 
                            value={currentConfig.iconSize} 
                            onValueChange={(iconSize: 'default' | 'custom') => {
                              updateBreakpointConfig(activeBreakpoint, { iconSize });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default Size</SelectItem>
                              <SelectItem value="custom">Custom Size</SelectItem>
                            </SelectContent>
                          </Select>

                          {currentConfig.iconSize === 'custom' && (
                            <div>
                              <Label className="text-xs text-muted-foreground mb-2 block">Icon Scale (%)</Label>
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
                          )}
                        </div>

                        {/* Overflow Control */}
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-xs text-muted-foreground">Overflow</Label>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                              Control content overflow behavior
                            </p>
                          </div>
                          <Select 
                            value={currentConfig.overflow} 
                            onValueChange={(overflow: 'visible' | 'hidden') => {
                              updateBreakpointConfig(activeBreakpoint, { overflow });
                            }}
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="visible">Visible</SelectItem>
                              <SelectItem value="hidden">Hidden</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      {/* Spacing Controls */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Spacing</Label>
                        
                        {/* Gap Controls */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">Icon-Text Gap</Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                value={[currentConfig.gap]}
                                onValueChange={([gap]) => updateBreakpointConfig(activeBreakpoint, { gap })}
                                min={0}
                                max={32}
                                step={2}
                                className="flex-1"
                              />
                              <span className="text-xs font-mono w-8">{currentConfig.gap}</span>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">Text Gap</Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                value={[currentConfig.textGap]}
                                onValueChange={([textGap]) => updateBreakpointConfig(activeBreakpoint, { textGap })}
                                min={0}
                                max={16}
                                step={1}
                                className="flex-1"
                              />
                              <span className="text-xs font-mono w-8">{currentConfig.textGap}</span>
                            </div>
                          </div>
                        </div>

                        {/* Margin & Padding */}
                        <SpacingBoxControl
                          label="Margin"
                          value={currentConfig.margin}
                          onChange={(margin) => updateBreakpointConfig(activeBreakpoint, { margin })}
                        />
                        
                        <SpacingBoxControl
                          label="Padding"
                          value={currentConfig.padding}
                          onChange={(padding) => updateBreakpointConfig(activeBreakpoint, { padding })}
                        />
                      </div>

                      <Separator />

                      {/* Animation Controls */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Animation</Label>
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
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Preview Area */}
            <div className="xl:col-span-2 space-y-6">
              {/* Current Breakpoint Preview */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    {breakpoints.find(bp => bp.key === activeBreakpoint)?.icon}
                    {breakpoints.find(bp => bp.key === activeBreakpoint)?.label} Preview
                  </h4>
                  <Badge variant="outline">{breakpoints.find(bp => bp.key === activeBreakpoint)?.width}</Badge>
                </div>
                
                {currentConfig.visible ? (
                  <div className="bg-muted/30 rounded-lg p-6">
                    <div 
                      className={cn(
                        "flex border-2 border-dashed border-transparent",
                        generateClassNames(currentConfig),
                        // Add visual indicators for container width
                        currentConfig.containerWidth === 'full' && "border-blue-300 bg-blue-50/50",
                        currentConfig.containerWidth === 'custom' && "border-purple-300 bg-purple-50/50"
                      )}
                      style={generateStyles(currentConfig)}
                    >
                    <Brand
                      variant={currentConfig.variant}
                      size={currentConfig.size}
                      showTagline={currentConfig.showTagline}
                      clickable={currentConfig.clickable}
                      monochromeMode={currentConfig.monochromeMode}
                      useSystemColors={currentConfig.useSystemColors}
                      brandName={brandConfig?.primaryText || "Alkitu"}
                      tagline={brandConfig?.secondaryText || "Design System"}
                      primaryTextColor={brandConfig?.primaryTextColor}
                      secondaryTextColor={brandConfig?.secondaryTextColor}
                      customSvg={brandConfig?.customSvg}
                      iconBackgroundColor={brandConfig?.iconBackgroundColor}
                      iconColor={brandConfig?.iconColor}
                      onClick={currentConfig.clickable ? () => {} : undefined}
                      gap={currentConfig.gap}
                      textGap={currentConfig.textGap}
                      iconSizeScale={currentConfig.iconSize === 'custom' ? currentConfig.customIconSize : 100}
                      animationConfig={{
                        enabled: currentConfig.animationEnabled,
                        duration: currentConfig.animationDuration,
                        timingFunction: currentConfig.animationTimingFunction,
                        animationType: currentConfig.animationType
                      }}
                    />
                    </div>
                    
                    {/* Container Width Indicator */}
                    {currentConfig.containerWidth !== 'fit-content' && (
                      <div className="mt-2 text-center">
                        <Badge variant="outline" className="text-xs">
                          {currentConfig.containerWidth === 'full' && "Full Width Container"}
                          {currentConfig.containerWidth === 'custom' && 
                            `Custom: ${currentConfig.minWidth || 'auto'} - ${currentConfig.maxWidth || 'none'}`
                          }
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-lg p-6 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <EyeOff className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Hidden on {activeBreakpoint.toUpperCase()}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* All Breakpoints Comparison */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm">All Breakpoints Comparison</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {breakpoints.map(bp => (
                    <button
                      key={bp.key}
                      onClick={() => setActiveBreakpoint(bp.key)}
                      className={cn(
                        "border rounded-lg p-3 text-left transition-colors",
                        activeBreakpoint === bp.key ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium flex items-center gap-1">
                          {bp.icon}
                          {bp.label}
                        </span>
                        <Badge 
                          variant={responsiveConfig[bp.key].visible ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {responsiveConfig[bp.key].visible ? 'Visible' : 'Hidden'}
                        </Badge>
                      </div>
                      
                      {responsiveConfig[bp.key].visible ? (
                        <div className="bg-muted/30 rounded p-3 min-h-[60px] flex items-center justify-center">
                          <Brand
                            variant={responsiveConfig[bp.key].variant}
                            size={responsiveConfig[bp.key].size}
                            showTagline={responsiveConfig[bp.key].showTagline}
                            clickable={false}
                            brandName={brandConfig?.primaryText || "Alkitu"}
                            tagline={brandConfig?.secondaryText || "Design System"}
                            primaryTextColor={brandConfig?.primaryTextColor}
                            secondaryTextColor={brandConfig?.secondaryTextColor}
                            customSvg={brandConfig?.customSvg}
                            iconBackgroundColor={brandConfig?.iconBackgroundColor}
                            iconColor={brandConfig?.iconColor}
                            gap={responsiveConfig[bp.key].gap}
                            textGap={responsiveConfig[bp.key].textGap}
                            iconSizeScale={responsiveConfig[bp.key].iconSize === 'custom' ? responsiveConfig[bp.key].customIconSize : 100}
                            animationConfig={{
                              enabled: responsiveConfig[bp.key].animationEnabled,
                              duration: responsiveConfig[bp.key].animationDuration,
                              timingFunction: responsiveConfig[bp.key].animationTimingFunction,
                              animationType: responsiveConfig[bp.key].animationType
                            }}
                            className="scale-75"
                          />
                        </div>
                      ) : (
                        <div className="bg-muted/30 rounded p-3 min-h-[60px] flex items-center justify-center">
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      
                      <div className="mt-2 flex gap-1 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs py-0">{responsiveConfig[bp.key].variant}</Badge>
                        <Badge variant="outline" className="text-xs py-0">{responsiveConfig[bp.key].size}</Badge>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Resizable Responsive Preview */}
                <div className="mt-6">
                  <ResizablePreview 
                    responsiveConfig={responsiveConfig} 
                    brandConfig={brandConfig} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedBrandStudio;