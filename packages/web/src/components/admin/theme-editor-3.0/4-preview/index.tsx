'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { PreviewSection } from '../types';
import { VIEWPORT_CONFIGS } from '../types/viewport.types';
import { Palette, Type, Building, Atom, Layers, Layout, Battery, Wifi, Signal } from 'lucide-react';
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
  
  // Calculate responsive container dimensions with proper scaling for visibility
  const getPreviewDimensions = () => {
    if (currentViewport === 'desktop') {
      return {
        width: '100%',
        height: '100%',
        containerClass: '',
        mockupClass: '',
        showMockup: false
      };
    }
    
    // Make viewports easily visible with minimum scale of 0.7
    let scale = 1;
    let showMockup = false;
    let mockupClass = '';
    
    if (currentViewport === 'smartphone') {
      scale = 0.9; // Reduce scale to fit better and allow more scroll area
      showMockup = true;
      mockupClass = 'phone-mockup';
    } else if (currentViewport === 'tablet') {
      scale = 0.7; // Reduce scale to fit better
      showMockup = true;
      mockupClass = 'tablet-mockup';
    } else if (currentViewport === 'tv') {
      // Calculate optimal scale for TV to fit in available space
      // Estimate available space: viewport - sidebar(~240px) - padding(~32px) = ~calc(100vw - 280px)
      // For height: viewport - header(~60px) - indicator(~40px) - padding(~32px) = ~calc(100vh - 140px)
      
      const tvWidth = 1920;
      const tvHeight = 1080;
      
      // Conservative estimates of available space
      const availableWidth = Math.min(window.innerWidth - 300, 1400); // Max reasonable width
      const availableHeight = Math.min(window.innerHeight - 200, 800); // Max reasonable height
      
      // Calculate scale to fit both dimensions, prioritizing width usage
      const scaleByWidth = availableWidth / tvWidth;
      const scaleByHeight = availableHeight / tvHeight;
      
      // Use the smaller scale to ensure it fits, but minimum 0.3 for visibility
      scale = Math.max(Math.min(scaleByWidth, scaleByHeight), 0.3);
      
      showMockup = false;
      mockupClass = 'tv-mockup';
    }
    
    return {
      width: `${viewportConfig.width}px`,
      height: `${viewportConfig.height}px`,
      scale,
      containerClass: mockupClass,
      showMockup,
      mockupClass
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
          <span className="text-xs text-muted-foreground">
            {currentViewport === 'desktop' ? 'Native View' : `${Math.round(dimensions.scale * 100)}% Scale`}
            {currentViewport === 'tv' && (
              <span className="ml-2 text-xs text-muted-foreground">
                (Fit: {Math.round((viewportConfig.width * dimensions.scale))}×{Math.round((viewportConfig.height * dimensions.scale))})
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Preview container - always same structure */}
      <div className="flex-1 min-h-0 p-4 pt-2">
        <div className="h-full flex flex-col">
          {/* Navigation tabs only for smartphone/tablet */}
          {(currentViewport === 'smartphone' || currentViewport === 'tablet') && (
            <Tabs 
              value={state.preview.activeSection} 
              onValueChange={(value) => setPreviewSection(value as PreviewSection)}
              className="w-full h-full flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-3 gap-1 h-auto p-1 flex-shrink-0 mb-6">
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

              {/* Content area for smartphone/tablet */}
              <div className="flex-1 min-h-0">
                <div className={`h-full flex ${currentViewport === 'smartphone' ? 'items-start pt-4' : 'items-start pt-4'} justify-center`}>
                  <div 
                    className={`bg-background border-4 border-border overflow-hidden ${currentViewport === 'smartphone' ? 'rounded-3xl' : 'rounded-2xl'}`}
                    style={{
                      width: `${viewportConfig.width}px`,
                      height: `${viewportConfig.height}px`,
                      transform: `scale(${dimensions.scale})`,
                      transformOrigin: 'top center'
                    }}
                  >
                    {currentViewport === 'smartphone' ? <SmartphoneContent /> : <TabletContent />}
                  </div>
                </div>
              </div>
            </Tabs>
          )}

          {/* Desktop/TV View with internal navigation */}
          {(currentViewport === 'desktop' || currentViewport === 'tv') && (
            <div className={`h-full ${currentViewport === 'tv' ? 'flex items-center justify-center overflow-hidden' : ''}`}>
              <div 
                className={`${currentViewport === 'tv' ? 'flex-shrink-0' : 'h-full mx-auto'} bg-background border rounded-lg overflow-hidden shadow-lg`}
                style={{
                  width: currentViewport === 'tv' ? '1920px' : dimensions.width,
                  height: currentViewport === 'tv' ? '1080px' : dimensions.height,
                  transform: currentViewport === 'tv' ? `scale(${dimensions.scale})` : 'none',
                  transformOrigin: 'center'
                }}
              >
                <TVDesktopContent />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // TV/Desktop Content with internal navigation and TV scaling
  function TVDesktopContent() {
    const activeSection = state.preview.activeSection;
    const isTV = currentViewport === 'tv';
    
    return (
      <Tabs 
        value={state.preview.activeSection} 
        onValueChange={(value) => setPreviewSection(value as PreviewSection)}
        className="w-full h-full flex flex-col"
      >
        {/* Internal navigation tabs - smaller for TV */}
        <TabsList className={`grid w-full grid-cols-3 gap-1 h-auto p-1 flex-shrink-0 ${isTV ? 'mx-1 mt-1' : 'mx-2 mt-2'}`}>
          {sections.map(({ id, label, icon: Icon }) => (
            <TabsTrigger 
              key={id} 
              value={id}
              className={`flex flex-col gap-1 ${isTV ? 'h-8 text-[10px]' : 'h-12 text-xs'}`}
            >
              <Icon className={`${isTV ? 'h-2 w-2' : 'h-3 w-3'}`} />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content with TV scaling */}
        <TabsContent value="colors" className="mt-2 flex-1 min-h-0 overflow-hidden">
          <div className={`h-full overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background ${isTV ? 'px-1' : 'px-2'}`}>
            <div className={isTV ? 'text-sm' : ''}>
              <ContrastChecker />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="mt-2 flex-1 min-h-0 overflow-hidden">
          <div className={`h-full overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background ${isTV ? 'px-1' : 'px-2'}`}>
            <div className={isTV ? 'text-sm' : ''}>
              <TypographyPreview />
            </div>
          </div>
        </TabsContent>

        {sections.slice(2).map(({ id, label }) => (
          <TabsContent key={id} value={id} className="mt-2 flex-1 min-h-0 overflow-hidden">
            <div className={`h-full overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background ${isTV ? 'px-1' : 'px-2'}`}>
              <Card className={isTV ? 'p-2' : 'p-4'}>
                <div className={`bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center ${isTV ? 'h-16' : 'h-24'}`}>
                  <span className={`text-muted-foreground text-center ${isTV ? 'text-xs' : 'text-xs'}`}>
                    {label} showcase will be here
                  </span>
                </div>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  }

  // Tablet-specific content component with status bar
  function TabletContent() {
    const activeSection = state.preview.activeSection;
    
    // Get current time for status bar
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
    
    return (
      <div className="w-full h-full flex flex-col">
        {/* Status Bar Header */}
        <div className="flex-shrink-0 px-4 py-1 bg-background border-b border-border/50">
          <div className="flex items-center justify-between text-xs">
            {/* Left side - Time */}
            <div className="text-muted-foreground font-bold">
              {currentTime}
            </div>
            
            {/* Right side - Icons */}
            <div className="flex items-center gap-1">
              <Signal className="h-3 w-3 text-muted-foreground fill-current" />
              <Wifi className="h-3 w-3 text-muted-foreground" />
              <Battery className="h-3 w-3 text-muted-foreground fill-current" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 px-2 pb-1 overflow-hidden">
          {activeSection === 'colors' && (
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
              <div className="p-2 pb-[400px]">
                <ContrastChecker />
              </div>
            </div>
          )}
          
          {activeSection === 'typography' && (
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
              <div className="p-2 pb-[400px]">
                <TypographyPreview />
              </div>
            </div>
          )}
          
          {!['colors', 'typography'].includes(activeSection) && (
            <div className="h-full flex items-center justify-center overflow-y-auto">
              <Card className="p-4 w-full mx-2">
                <div className="h-32 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground text-center">
                    {sections.find(s => s.id === activeSection)?.label} showcase will be here
                  </span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Smartphone-specific content component with status bar
  function SmartphoneContent() {
    const activeSection = state.preview.activeSection;
    
    // Get current time for status bar
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
    
    return (
      <div className="w-full h-full flex flex-col">
        {/* Status Bar Header */}
        <div className="flex-shrink-0 px-4 py-1 bg-background border-b border-border/50">
          <div className="flex items-center justify-between text-xs">
            {/* Left side - Time */}
            <div className="text-muted-foreground font-bold">
              {currentTime}
            </div>
            
            {/* Right side - Icons */}
            <div className="flex items-center gap-1">
              <Signal className="h-3 w-3 text-muted-foreground fill-current" />
              <Wifi className="h-3 w-3 text-muted-foreground" />
              <Battery className="h-3 w-3 text-muted-foreground fill-current" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 px-1 pb-1 overflow-hidden">
          {activeSection === 'colors' && (
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
              <div className="p-1 pb-52">
                <ContrastChecker />
              </div>
            </div>
          )}
          
          {activeSection === 'typography' && (
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
              <div className="p-1 pb-52">
                <TypographyPreview />
              </div>
            </div>
          )}
          
          {!['colors', 'typography'].includes(activeSection) && (
            <div className="h-full flex items-center justify-center overflow-y-auto">
              <Card className="p-2 w-full mx-1">
                <div className="h-32 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground text-center">
                    {sections.find(s => s.id === activeSection)?.label} showcase will be here
                  </span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }
}