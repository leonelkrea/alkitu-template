'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, X, Sun } from 'lucide-react';
import { useThemeEditor } from '../../context/ThemeEditorContext';
import { getContrastRatio, getContrastGrade } from '../../utils/contrast';
import { ThemeColors } from '../../types/theme.types';
import { DesignSystemColorsShowcase } from './DesignSystemColorsShowcase';

interface ContrastPair {
  background: keyof ThemeColors;
  foreground: keyof ThemeColors;
  name: string;
}

interface ContrastCardProps {
  pair: ContrastPair;
  colors: ThemeColors;
}

function ContrastCard({ pair, colors }: ContrastCardProps) {
  const bgColor = colors[pair.background]?.oklchString || colors[pair.background]?.value || 'oklch(1 0 0)';
  const fgColor = colors[pair.foreground]?.oklchString || colors[pair.foreground]?.value || 'oklch(0 0 0)';
  
  const ratio = getContrastRatio(bgColor, fgColor);
  const { grade, largeTextGrade } = getContrastGrade(ratio);
  
  const getGradeIcon = (grade: string) => {
    if (grade === 'AAA' || grade === 'AA') return <Check className="h-3 w-3" />;
    return <X className="h-3 w-3" />;
  };
  
  const getGradeColor = (grade: string) => {
    if (grade === 'AAA') return 'text-primary';
    if (grade === 'AA') return 'text-muted-foreground';
    return 'text-destructive';
  };
  
  return (
    <Card className="p-4 bg-card border-border">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">{pair.name}</h4>
          <Badge 
            variant={grade === 'Fail' ? 'destructive' : 'secondary'}
            className="flex items-center gap-1"
          >
            {getGradeIcon(grade)}
            <span>{ratio.toFixed(2)}</span>
          </Badge>
        </div>
        
        <div 
          className="relative h-24 rounded-md overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <span 
            className="text-2xl font-bold"
            style={{ color: fgColor }}
          >
            Aa
          </span>
          <span 
            className="ml-4 text-sm"
            style={{ color: fgColor }}
          >
            Sample Text
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded border border-border"
              style={{ backgroundColor: bgColor }}
            />
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">Background</p>
              <p className="text-xs text-muted-foreground font-mono">{bgColor}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded border border-border"
              style={{ backgroundColor: fgColor }}
            />
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">Foreground</p>
              <p className="text-xs text-muted-foreground font-mono">{fgColor}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ContrastChecker() {
  const { state } = useThemeEditor();
  // Use current mode colors for contrast checking
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  if (!colors) {
    return (
      <div className="text-center text-muted-foreground">
        No theme colors available
      </div>
    );
  }

  // Define all contrast pairs from the images
  const contentContainers: ContrastPair[] = [
    { background: 'background', foreground: 'foreground', name: 'Base' },
    { background: 'card', foreground: 'cardForeground', name: 'Card' },
    { background: 'popover', foreground: 'popoverForeground', name: 'Popover' },
    { background: 'muted', foreground: 'mutedForeground', name: 'Muted' },
  ];

  const interactiveElements: ContrastPair[] = [
    { background: 'primary', foreground: 'primaryForeground', name: 'Primary' },
    { background: 'secondary', foreground: 'secondaryForeground', name: 'Secondary' },
    { background: 'accent', foreground: 'accentForeground', name: 'Accent' },
  ];

  const navigationFunctional: ContrastPair[] = [
    { background: 'destructive', foreground: 'destructiveForeground', name: 'Destructive' },
    { background: 'sidebar', foreground: 'sidebarForeground', name: 'Sidebar Base' },
    { background: 'sidebarPrimary', foreground: 'sidebarPrimaryForeground', name: 'Sidebar Primary' },
    { background: 'sidebarAccent', foreground: 'sidebarAccentForeground', name: 'Sidebar Accent' },
  ];

  // Calculate total contrast issues
  const allPairs = [...contentContainers, ...interactiveElements, ...navigationFunctional];
  const contrastIssues = allPairs.filter(pair => {
    const bgColor = colors[pair.background]?.oklchString || colors[pair.background]?.value || 'oklch(1 0 0)';
    const fgColor = colors[pair.foreground]?.oklchString || colors[pair.foreground]?.value || 'oklch(0 0 0)';
    const ratio = getContrastRatio(bgColor, fgColor);
    const { grade } = getContrastGrade(ratio);
    return grade === 'Fail';
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Contrast Checker</h3>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="cursor-pointer">All</Badge>
        <Badge 
          variant="outline" 
          className={`cursor-pointer flex items-center gap-1 ${
            contrastIssues > 0 ? 'text-destructive border-destructive/30' : ''
          }`}
        >
          <AlertTriangle className="h-3 w-3" />
          Issues ({contrastIssues})
        </Badge>
      </div>

      {/* Content & Containers */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Content & Containers</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentContainers.map((pair) => (
            <ContrastCard key={pair.name} pair={pair} colors={colors} />
          ))}
        </div>
      </div>

      {/* Interactive Elements */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Interactive Elements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interactiveElements.map((pair) => (
            <ContrastCard key={pair.name} pair={pair} colors={colors} />
          ))}
        </div>
      </div>

      {/* Navigation & Functional */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Navigation & Functional</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigationFunctional.map((pair) => (
            <ContrastCard key={pair.name} pair={pair} colors={colors} />
          ))}
        </div>
      </div>

      {/* Design System Colors Showcase */}
      <DesignSystemColorsShowcase colors={colors} />
    </div>
  );
}