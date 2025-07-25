/**
 * Theme Builder - Main Component
 * Integrates all theme builder components into a complete interface
 * Part of Clean Architecture presentation layer
 */

'use client';

import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';

// Local imports
import { ThemeBuilderProvider } from './presentation/contexts/ThemeBuilderContext';
import { BrandProvider } from './presentation/contexts/BrandContext';
import { ActionBar } from './presentation/components/panels/ActionBar';
import { ControlPanel } from './presentation/components/panels/ControlPanel';
import { PreviewPanel } from './presentation/components/panels/PreviewPanel';
import { CodePanel } from './presentation/components/panels/CodePanel';
import type { ThemeData } from './shared/types/theme.types';

/**
 * Theme builder props
 */
export interface ThemeBuilderProps {
  className?: string;
  initialTheme?: ThemeData;
  onThemeChange?: (theme: ThemeData) => void;
  onSaveTheme?: (theme: ThemeData, name?: string) => Promise<void>;
  enabledFeatures?: {
    colors?: boolean;
    typography?: boolean;
    brand?: boolean;
    shadows?: boolean;
    borders?: boolean;
    spacing?: boolean;
    codePanel?: boolean;
    preview?: boolean;
  };
}

/**
 * Main theme builder component
 * Integrates all extracted components into a complete theme editing interface
 */
export function ThemeBuilder({
  className,
  initialTheme,
  onThemeChange,
  onSaveTheme,
  enabledFeatures = {
    colors: true,
    typography: true,
    brand: true,
    shadows: true,
    borders: true,
    spacing: true,
    codePanel: true,
    preview: true,
  }
}: ThemeBuilderProps) {
  return (
    <ThemeBuilderProvider
      initialTheme={initialTheme}
      onThemeChange={onThemeChange}
      onSaveTheme={onSaveTheme}
    >
      <BrandProvider>
        <div className={cn('h-screen flex flex-col bg-background', className)}>
          {/* Action Bar */}
          <ActionBar onThemeChange={onThemeChange} />
          
          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {/* Left Panel - Controls */}
              <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
                <ControlPanel />
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              {/* Center Panel - Preview */}
              {enabledFeatures.preview && (
                <>
                  <ResizablePanel defaultSize={45} minSize={30}>
                    <PreviewPanel />
                  </ResizablePanel>
                  
                  {enabledFeatures.codePanel && <ResizableHandle withHandle />}
                </>
              )}
              
              {/* Right Panel - Code (optional) */}
              {enabledFeatures.codePanel && (
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                  <CodePanel />
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
          </div>
        </div>
      </BrandProvider>
    </ThemeBuilderProvider>
  );
}

/**
 * Simplified theme builder for basic use cases
 */
export function SimpleThemeBuilder({
  className,
  initialTheme,
  onThemeChange,
  onSaveTheme
}: Omit<ThemeBuilderProps, 'enabledFeatures'>) {
  return (
    <ThemeBuilder
      className={className}
      initialTheme={initialTheme}
      onThemeChange={onThemeChange}
      onSaveTheme={onSaveTheme}
      enabledFeatures={{
        colors: true,
        typography: true,
        brand: false,
        shadows: false,
        borders: false,
        spacing: false,
        codePanel: false,
        preview: true,
      }}
    />
  );
}

/**
 * Advanced theme builder with all features enabled
 */
export function AdvancedThemeBuilder(props: ThemeBuilderProps) {
  return (
    <ThemeBuilder
      {...props}
      enabledFeatures={{
        colors: true,
        typography: true,
        brand: true,
        shadows: true,
        borders: true,
        spacing: true,
        codePanel: true,
        preview: true,
        ...props.enabledFeatures,
      }}
    />
  );
}