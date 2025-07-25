/**
 * Theme Builder v2 - Test Page
 * Testing the new modular theme builder architecture
 * Temporary page for comparing functionality before replacing monolith
 */

'use client';

import React, { useCallback } from 'react';
import { ThemeBuilder } from '@/components/theme-builder';
import { useCompanyTheme } from '@/components/providers/DynamicThemeProvider';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import type { ThemeData } from '@/components/theme-builder/shared/types/theme.types';

/**
 * New Theme Builder Page
 * Uses the modular Clean Architecture implementation
 */
export default function ThemesV2Page() {
  const { theme: currentTheme, setTheme, resetTheme } = useCompanyTheme();
  const updateThemeMutation = trpc.company.updateTheme.useMutation();
  
  /**
   * Handle theme changes from the theme builder
   */
  const handleThemeChange = useCallback((newTheme: ThemeData) => {
    try {
      // Apply theme immediately for live preview
      setTheme(newTheme);
    } catch (error) {
      console.error('Error applying theme:', error);
      toast.error('Failed to apply theme changes');
    }
  }, [setTheme]);

  /**
   * Handle theme save
   */
  const handleSaveTheme = useCallback(async (theme: ThemeData, name?: string) => {
    try {
      // Update theme with server
      await updateThemeMutation.mutateAsync({
        colors: theme.lightColors || {},
        darkColors: theme.darkColors || {},
        typography: theme.typography || {},
        name: name || 'Custom Theme',
      });
      
      // Apply theme locally
      setTheme(theme);
      
      toast.success('Theme saved successfully!');
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Failed to save theme');
      throw error; // Re-throw so ThemeBuilder can handle the error state
    }
  }, [updateThemeMutation, setTheme]);

  /**
   * Convert current theme to ThemeData format
   */
  const initialTheme: ThemeData = React.useMemo(() => {
    // Use the same color structure as the original ThemeEditor
    const defaultColors = {
      // Primary Colors
      'primary': '#f59e0b',
      'primary-foreground': '#000000',
      
      // Secondary Colors
      'secondary': '#f3f4f6',
      'secondary-foreground': '#374151',
      
      // Accent Colors
      'accent': '#e0f2fe',
      'accent-foreground': '#0c4a6e',
      
      // Base Colors
      'background': '#ffffff',
      'foreground': '#374151',
      
      // Card Colors
      'card': '#ffffff',
      'card-foreground': '#374151',
      
      // Popover Colors
      'popover': '#ffffff',
      'popover-foreground': '#374151',
      
      // Muted Colors
      'muted': '#f9fafb',
      'muted-foreground': '#6b7280',
      
      // Status Colors
      'success': '#10b981',
      'success-foreground': '#ffffff',
      'warning': '#f59e0b',
      'warning-foreground': '#1f2937',
      'info': '#3b82f6',
      'info-foreground': '#ffffff',
      'destructive': '#ef4444',
      'destructive-foreground': '#ffffff',
      
      // Border & Input Colors
      'border': '#e5e7eb',
      'input': '#e5e7eb',
      'ring': '#3b82f6',
      
      // Chart Colors
      'chart-1': '#3b82f6',
      'chart-2': '#8b5cf6',
      'chart-3': '#f59e0b',
      'chart-4': '#10b981',
      'chart-5': '#ef4444',
      
      // Sidebar Colors
      'sidebar': '#f9fafb',
      'sidebar-foreground': '#374151',
      'sidebar-primary': '#f59e0b',
      'sidebar-primary-foreground': '#000000',
      'sidebar-accent': '#e0f2fe',
      'sidebar-accent-foreground': '#0c4a6e',
      'sidebar-border': '#e5e7eb',
      'sidebar-ring': '#3b82f6',
    };
    
    if (!currentTheme) {
      return {
        id: 'default-theme',
        name: 'Default Theme',
        lightColors: defaultColors,
        darkColors: defaultColors,
        typography: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    // Combine default colors with current theme colors
    const lightColors: Record<string, string> = { ...defaultColors };
    const darkColors: Record<string, string> = { ...defaultColors };
    
    // Override with actual theme colors if they exist
    if (currentTheme.lightModeConfig) {
      Object.entries(currentTheme.lightModeConfig).forEach(([key, value]) => {
        lightColors[key] = value as string;
      });
    }
    
    if (currentTheme.darkModeConfig) {
      Object.entries(currentTheme.darkModeConfig).forEach(([key, value]) => {
        darkColors[key] = value as string;
      });
    } else if (currentTheme.lightModeConfig) {
      // If no dark colors, use light colors as fallback
      Object.entries(currentTheme.lightModeConfig).forEach(([key, value]) => {
        darkColors[key] = value as string;
      });
    }
    
    return {
      id: 'current-theme',
      name: 'Current Theme',
      lightColors,
      darkColors,
      typography: currentTheme.typography || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [currentTheme]);

  return (
    <div className="h-screen bg-background">
      {/* Theme Builder */}
      <ThemeBuilder
        initialTheme={initialTheme}
        onThemeChange={handleThemeChange}
        onSaveTheme={handleSaveTheme}
        enabledFeatures={{
          colors: true,
          typography: true,
          brand: true,
          shadows: true,
          borders: true,
          spacing: true,
          codePanel: true,
          preview: true,
        }}
      />
      
      {/* Development Info */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg text-xs font-mono">
          Theme Builder v2.0 - Clean Architecture
        </div>
      </div>
    </div>
  );
}