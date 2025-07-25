/**
 * Theme Builder - Color Editor Component
 * Main color editing interface with Material Design 3 integration
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, 
  Download, 
  RotateCcw, 
  Palette, 
  Link, 
  Unlink,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Local imports
import { useThemeBuilder } from '../../contexts/ThemeBuilderContext';
import { useColorLinking } from '../../hooks/useColorLinking';
import { ColorInput } from '../common/ColorInput';
import { ExpandableSection } from '../common/ExpandableSection';
import { ValidationMessage } from '../common/ValidationMessage';
import { COLOR_SECTIONS, REQUIRED_COLORS } from '../../../infrastructure/constants/color-defaults';
import { colorValidator } from '../../../infrastructure/validators/color.validator';
import { generateThemeCSSVariables } from '../../../infrastructure/converters/css-converter';
import type { ColorConfig } from '../../../shared/types/theme.types';

/**
 * Color editor props
 */
export interface ColorEditorProps {
  onExport?: (format: 'json' | 'css') => void;
  className?: string;
}

/**
 * Color category for grouping
 */
const COLOR_CATEGORIES = [
  { key: 'surface', label: 'Surface Colors', icon: '🎨' },
  { key: 'brand', label: 'Brand Colors', icon: '🚀' },
  { key: 'feedback', label: 'Feedback Colors', icon: '💬' },
  { key: 'utility', label: 'Utility Colors', icon: '🔧' },
  { key: 'charts', label: 'Chart Colors', icon: '📊' },
  { key: 'sidebar', label: 'Sidebar Colors', icon: '📱' },
  { key: 'custom', label: 'Custom Colors', icon: '✨' }
] as const;

/**
 * Material Design 3 color scales
 */
const MATERIAL_TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const;

/**
 * Color editor component
 */
export function ColorEditor({ onExport, className }: ColorEditorProps) {
  const {
    lightColors,
    darkColors,
    isDarkMode,
    updateLightColor,
    updateDarkColor,
    getCurrentColors,
    getAllColorNames,
    hasUnsavedChanges,
    saveTheme
  } = useThemeBuilder();

  const colorLinking = useColorLinking(getAllColorNames());

  // Local state
  const [activeTab, setActiveTab] = useState<'edit' | 'material' | 'preview' | 'code'>('edit');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    surface: true,
    brand: true
  });

  // Get current colors based on mode
  const currentColors = getCurrentColors();

  /**
   * Groups colors by category
   */
  const colorsByCategory = useMemo(() => {
    const grouped: Record<string, Array<{ name: string; value: string }>> = {
      surface: [],
      brand: [],
      feedback: [],
      utility: [],
      charts: [],
      sidebar: [],
      custom: []
    };

    Object.entries(currentColors).forEach(([name, value]) => {
      const section = COLOR_SECTIONS.find(s => 
        s.colors.some(c => c === name)
      );

      if (section) {
        grouped[section.category].push({ name, value });
      } else {
        grouped.custom.push({ name, value });
      }
    });

    return grouped;
  }, [currentColors]);

  /**
   * Validates all colors
   */
  const validateAllColors = useCallback(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required colors
    REQUIRED_COLORS.forEach(requiredColor => {
      if (!currentColors[requiredColor]) {
        errors.push(`Missing required color: ${requiredColor}`);
      }
    });

    // Validate color values
    Object.entries(currentColors).forEach(([name, value]) => {
      const validation = colorValidator.validateColor(value);
      if (!validation.isValid) {
        errors.push(`${name}: ${validation.error}`);
      }
    });

    // Check contrast ratios for key pairs
    const colorPairs = [
      ['background', 'foreground'],
      ['primary', 'primary-foreground'],
      ['secondary', 'secondary-foreground']
    ];

    colorPairs.forEach(([bg, fg]) => {
      if (currentColors[bg] && currentColors[fg]) {
        const contrast = colorValidator.validateContrast(currentColors[fg], currentColors[bg]);
        if (!contrast.isAccessible) {
          warnings.push(`Low contrast between ${bg} and ${fg} (${contrast.ratio.toFixed(2)})`);
        }
      }
    });

    return { errors, warnings };
  }, [currentColors]);

  /**
   * Updates a color value
   */
  const updateColor = useCallback((colorName: string, value: string) => {
    if (isDarkMode) {
      updateDarkColor(colorName, value);
    } else {
      updateLightColor(colorName, value);
    }
  }, [isDarkMode, updateLightColor, updateDarkColor]);

  /**
   * Copies color value to clipboard
   */
  const copyColor = useCallback(async (colorName: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedColor(colorName);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (error) {
      console.error('Failed to copy color:', error);
    }
  }, []);

  /**
   * Generates CSS for export
   */
  const generateCSS = useCallback(() => {
    return generateThemeCSSVariables({
      lightModeConfig: lightColors,
      darkModeConfig: darkColors
    });
  }, [lightColors, darkColors]);

  /**
   * Handles save action
   */
  const handleSave = useCallback(async () => {
    try {
      await saveTheme();
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }, [saveTheme]);

  /**
   * Renders color edit tab
   */
  const renderEditTab = () => (
    <div className="space-y-4">
      {COLOR_CATEGORIES.map(category => {
        const colors = colorsByCategory[category.key];
        if (colors.length === 0) return null;

        return (
          <ExpandableSection
            key={category.key}
            title={category.label}
            expanded={expandedCategories[category.key]}
            onToggle={(expanded) => 
              setExpandedCategories(prev => ({ ...prev, [category.key]: expanded }))
            }
            icon={<span className="text-lg">{category.icon}</span>}
            badge={<Badge variant="secondary">{colors.length}</Badge>}
            variant="bordered"
          >
            <div className="grid gap-3 md:grid-cols-2">
              {colors.map(({ name, value }) => (
                <div key={name} className="relative group">
                  <ColorInput
                    label={name}
                    value={value}
                    onChange={(newValue) => updateColor(name, newValue)}
                    colorName={name}
                    availableColors={getAllColorNames()}
                    onLink={colorLinking.linkColor}
                    onUnlink={colorLinking.unlinkColor}
                    isLinked={colorLinking.isColorLinked(name)}
                    linkedTo={colorLinking.getLinkedTo(name)}
                    showColorPreview
                    validate
                    size="sm"
                  />
                  
                  {/* Copy button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyColor(name, value)}
                  >
                    {copiedColor === name ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </ExpandableSection>
        );
      })}
    </div>
  );

  /**
   * Renders Material Design tab
   */
  const renderMaterialTab = () => (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Material Design 3 Integration</h3>
        <p className="text-sm text-muted-foreground">
          Link your colors to Material Design 3 color system for consistent theming.
        </p>
      </div>

      {selectedColor ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Linking: {selectedColor}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select a Material Design tone to link with {selectedColor}
              </p>
              
              <div className="grid grid-cols-13 gap-1">
                {MATERIAL_TONES.map(tone => (
                  <Button
                    key={tone}
                    variant="outline"
                    size="sm"
                    className="aspect-square p-0 text-xs"
                    onClick={() => {
                      // Material linking logic would go here
                      setSelectedColor(null);
                    }}
                  >
                    {tone}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedColor(null)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Select a color from the Edit tab to link it with Material Design 3</p>
        </div>
      )}
    </div>
  );

  /**
   * Renders preview tab
   */
  const renderPreviewTab = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Light mode preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Light Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(lightColors).slice(0, 10).map(([name, value]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-sm">{name}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border" 
                      style={{ backgroundColor: value }}
                    />
                    <code className="text-xs">{value}</code>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dark mode preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Dark Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(darkColors).slice(0, 10).map(([name, value]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-sm">{name}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border" 
                      style={{ backgroundColor: value }}
                    />
                    <code className="text-xs">{value}</code>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  /**
   * Renders code tab
   */
  const renderCodeTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Generated CSS</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport?.('css')}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSS
        </Button>
      </div>

      <ScrollArea className="h-[400px] w-full rounded border bg-muted/30">
        <pre className="p-4 text-xs">
          <code>{generateCSS()}</code>
        </pre>
      </ScrollArea>
    </div>
  );

  // Show validation on mount if there are errors
  useEffect(() => {
    const { errors } = validateAllColors();
    if (errors.length > 0) {
      setShowValidation(true);
    }
  }, []);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Color Editor</h2>
          <p className="text-muted-foreground">
            Customize your theme colors with live preview and validation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowValidation(!showValidation)}
          >
            {showValidation ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>

          {hasUnsavedChanges && (
            <Button
              size="sm"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Validation messages */}
      {showValidation && (
        <ValidationMessage
          items={(() => {
            const { errors, warnings } = validateAllColors();
            return [
              ...errors.map(e => ({ type: 'error' as const, message: e })),
              ...warnings.map(w => ({ type: 'warning' as const, message: w }))
            ];
          })()}
          collapsible
          showCounts
        />
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="material">Material Design</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-6">
          {renderEditTab()}
        </TabsContent>

        <TabsContent value="material" className="mt-6">
          {renderMaterialTab()}
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          {renderPreviewTab()}
        </TabsContent>

        <TabsContent value="code" className="mt-6">
          {renderCodeTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}