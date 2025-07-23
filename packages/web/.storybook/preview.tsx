import type { Preview } from '@storybook/nextjs';
import React from 'react';
import { DynamicThemeProvider } from '../src/components/providers/DynamicThemeProvider';
import '../src/app/[lang]/globals.css';
import '../src/styles/storybook-globals.css';

// Mock company themes for Storybook
const MOCK_COMPANY_THEMES = {
  'default': {
    id: 'default',
    name: 'Default Theme',
    companyId: 'default',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lightModeConfig: {
      primary: 'oklch(0.5634 0.1517 146.7438)', // Emerald
      secondary: 'oklch(0.9683 0.0069 247.8956)', // Neutral
      background: 'oklch(1 0 0)', // White
      foreground: 'oklch(0.1363 0.0364 259.2010)', // Dark blue
      border: 'oklch(0.9288 0.0126 255.5078)', // Light gray
      ring: 'oklch(0.5634 0.1517 146.7438)', // Emerald
      radius: '0.5rem',
      'font-sans': 'Inter, system-ui, sans-serif',
      'font-mono': 'ui-monospace, SFMono-Regular, monospace',
    },
  },
  'tech-startup': {
    id: 'tech-startup',
    name: 'Tech Startup',
    companyId: 'tech-startup',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lightModeConfig: {
      primary: 'oklch(0.6017 0.1847 26.9286)', // Orange
      secondary: 'oklch(0.9683 0.0069 247.8956)',
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.1363 0.0364 259.2010)',
      border: 'oklch(0.9288 0.0126 255.5078)',
      ring: 'oklch(0.6017 0.1847 26.9286)',
      radius: '0.75rem',
      'font-sans': 'Inter, system-ui, sans-serif',
      'font-mono': 'ui-monospace, SFMono-Regular, monospace',
    },
  },
  'financial-corp': {
    id: 'financial-corp',
    name: 'Financial Corp',
    companyId: 'financial-corp',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lightModeConfig: {
      primary: 'oklch(0.4726 0.1517 258.3386)', // Blue
      secondary: 'oklch(0.9683 0.0069 247.8956)',
      background: 'oklch(0.99 0.005 247.8956)', // Slightly tinted
      foreground: 'oklch(0.1363 0.0364 259.2010)',
      border: 'oklch(0.9288 0.0126 255.5078)',
      ring: 'oklch(0.4726 0.1517 258.3386)',
      radius: '0.25rem', // More conservative
      'font-sans': 'Inter, system-ui, sans-serif',
      'font-mono': 'ui-monospace, SFMono-Regular, monospace',
    },
  },
  'creative-agency': {
    id: 'creative-agency',
    name: 'Creative Agency',
    companyId: 'creative-agency',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lightModeConfig: {
      primary: 'oklch(0.7049 0.1867 47.6044)', // Pink
      secondary: 'oklch(0.7681 0.2044 130.8498)', // Yellow-green
      background: 'oklch(0.995 0.01 47.6044)', // Warm white
      foreground: 'oklch(0.1363 0.0364 259.2010)',
      border: 'oklch(0.9288 0.0126 255.5078)',
      ring: 'oklch(0.7049 0.1867 47.6044)',
      radius: '1rem', // More playful
      'font-sans': 'Inter, system-ui, sans-serif',
      'font-mono': 'ui-monospace, SFMono-Regular, monospace',
    },
  },
  'healthcare': {
    id: 'healthcare',
    name: 'Healthcare',
    companyId: 'healthcare',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lightModeConfig: {
      primary: 'oklch(0.5634 0.1517 146.7438)', // Medical green
      secondary: 'oklch(0.6735 0.1851 146.7724)', // Lighter green
      background: 'oklch(0.99 0.003 180)', // Cool white
      foreground: 'oklch(0.2 0.02 180)', // Cool dark
      border: 'oklch(0.92 0.02 180)',
      ring: 'oklch(0.5634 0.1517 146.7438)',
      radius: '0.375rem',
      'font-sans': 'Inter, system-ui, sans-serif',
      'font-mono': 'ui-monospace, SFMono-Regular, monospace',
    },
  },
};

// Enhanced theme decorator with DynamicThemeProvider
const withDynamicTheme = (StoryFn: any, context: any) => {
  const selectedTheme = context.globals.companyTheme || 'default';
  const themeConfig = MOCK_COMPANY_THEMES[selectedTheme as keyof typeof MOCK_COMPANY_THEMES] || MOCK_COMPANY_THEMES.default;

  return React.createElement(
    DynamicThemeProvider,
    { themeData: themeConfig },
    React.createElement(
      'div',
      { 
        className: 'min-h-screen bg-background text-foreground p-8 transition-colors duration-200',
        style: {
          fontFamily: 'var(--font-sans)',
        }
      },
      React.createElement(StoryFn)
    )
  );
};

const preview: Preview = {
  decorators: [withDynamicTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // Disable default backgrounds, use theme system
    },
    layout: 'centered',
    docs: {
      toc: true,
      source: {
        state: 'open',
      },
    },
  },
  globalTypes: {
    companyTheme: {
      description: 'Company Theme Selector',
      defaultValue: 'default',
      toolbar: {
        title: 'Company Theme',
        icon: 'paintbrush',
        items: [
          { 
            value: 'default', 
            title: 'Default',
            left: '🎨',
          },
          { 
            value: 'tech-startup', 
            title: 'Tech Startup',
            left: '🚀',
          },
          { 
            value: 'financial-corp', 
            title: 'Financial Corp',
            left: '🏦',
          },
          { 
            value: 'creative-agency', 
            title: 'Creative Agency',
            left: '🎭',
          },
          { 
            value: 'healthcare', 
            title: 'Healthcare',
            left: '🏥',
          },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;