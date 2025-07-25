/**
 * Theme Builder - Typography Editor Component
 * Component for editing typography styles
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Type, 
  Sparkles, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  Heading5,
  RotateCcw,
  Eye,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Local imports
import { useThemeBuilder } from '../../contexts/ThemeBuilderContext';
import { ExpandableSection } from '../common/ExpandableSection';
import { TypographyEntity } from '../../../domain/entities/typography.entity';
import type { TypographyConfig, TypographyStyle } from '../../../shared/types/common.types';

/**
 * Typography editor props
 */
export interface TypographyEditorProps {
  className?: string;
}

/**
 * Typography categories configuration
 */
const TYPOGRAPHY_CATEGORIES = [
  { id: 'h1', label: 'H1', icon: Heading1, description: 'Main heading', previewText: 'Main Title' },
  { id: 'h2', label: 'H2', icon: Heading2, description: 'Secondary heading', previewText: 'Secondary Title' },
  { id: 'h3', label: 'H3', icon: Heading3, description: 'Tertiary heading', previewText: 'Tertiary Title' },
  { id: 'h4', label: 'H4', icon: Heading4, description: 'Quaternary heading', previewText: 'Quaternary Title' },
  { id: 'h5', label: 'H5', icon: Heading5, description: 'Quinary heading', previewText: 'Quinary Title' },
  { id: 'base', label: 'Paragraph', icon: Type, description: 'Body text', previewText: 'Example paragraph text' },
  { id: 'accent', label: 'Emphasis', icon: Sparkles, description: 'Emphasized text', previewText: 'Special emphasis text' },
  { id: 'quote', label: 'Quotes', icon: Quote, description: 'Blockquotes', previewText: '"Inspirational quote example"' },
] as const;

/**
 * Typography control component
 */
interface TypographyControlProps {
  style: TypographyStyle;
  onChange: (updates: Partial<TypographyStyle>) => void;
  onReset: () => void;
}

function TypographyControl({ style, onChange, onReset }: TypographyControlProps) {
  return (
    <div className="space-y-4">
      {/* Font Family */}
      <div>
        <label className="text-sm font-medium">Font Family</label>
        <input
          type="text"
          value={style.fontFamily}
          onChange={(e) => onChange({ fontFamily: e.target.value })}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          placeholder="Inter, sans-serif"
        />
      </div>

      {/* Font Size */}
      <div>
        <label className="text-sm font-medium">Font Size (px)</label>
        <input
          type="number"
          value={style.fontSize}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          min="8"
          max="128"
        />
      </div>

      {/* Font Weight */}
      <div>
        <label className="text-sm font-medium">Font Weight</label>
        <select
          value={style.fontWeight}
          onChange={(e) => onChange({ fontWeight: e.target.value })}
          className="w-full mt-1 px-3 py-2 border rounded-md"
        >
          <option value="300">Light (300)</option>
          <option value="400">Normal (400)</option>
          <option value="500">Medium (500)</option>
          <option value="600">Semibold (600)</option>
          <option value="700">Bold (700)</option>
          <option value="800">Extra Bold (800)</option>
          <option value="900">Black (900)</option>
        </select>
      </div>

      {/* Line Height */}
      <div>
        <label className="text-sm font-medium">Line Height</label>
        <input
          type="number"
          value={style.lineHeight}
          onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          min="0.8"
          max="3"
          step="0.1"
        />
      </div>

      {/* Letter Spacing */}
      <div>
        <label className="text-sm font-medium">Letter Spacing (em)</label>
        <input
          type="number"
          value={style.letterSpacing}
          onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          min="-0.1"
          max="0.5"
          step="0.01"
        />
      </div>

      {/* Text Transform */}
      <div>
        <label className="text-sm font-medium">Text Transform</label>
        <select
          value={style.textTransform || 'none'}
          onChange={(e) => onChange({ textTransform: e.target.value })}
          className="w-full mt-1 px-3 py-2 border rounded-md"
        >
          <option value="none">None</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>

      {/* Font Style */}
      <div>
        <label className="text-sm font-medium">Font Style</label>
        <select
          value={style.fontStyle || 'normal'}
          onChange={(e) => onChange({ fontStyle: e.target.value })}
          className="w-full mt-1 px-3 py-2 border rounded-md"
        >
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
        </select>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="w-full"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset to Default
      </Button>
    </div>
  );
}

/**
 * Typography preview component
 */
interface TypographyPreviewProps {
  categoryId: string;
  style: TypographyStyle;
  previewText: string;
}

function TypographyPreview({ categoryId, style, previewText }: TypographyPreviewProps) {
  const previewStyle = {
    fontFamily: style.fontFamily,
    fontSize: `${style.fontSize}px`,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textTransform: style.textTransform as any,
    textDecoration: style.textDecoration,
    lineHeight: style.lineHeight,
    letterSpacing: `${style.letterSpacing}em`,
    wordSpacing: `${style.wordSpacing}em`,
  };

  return (
    <div className="space-y-4">
      {/* Context Examples */}
      <div>
        <h4 className="text-sm font-medium mb-3">Context Examples</h4>
        <div className="space-y-3">
          {/* Light Background */}
          <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border">
            <div style={previewStyle}>{previewText}</div>
            <p className="text-xs text-muted-foreground mt-2">On light background</p>
          </div>

          {/* Dark Background */}
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 p-4 rounded-lg">
            <div style={previewStyle}>{previewText}</div>
            <p className="text-xs opacity-70 mt-2">On dark background</p>
          </div>

          {/* Colored Background */}
          <div className="bg-primary text-primary-foreground p-4 rounded-lg">
            <div style={previewStyle}>{previewText}</div>
            <p className="text-xs opacity-80 mt-2">On brand color</p>
          </div>
        </div>
      </div>

      {/* Size Variants */}
      <div>
        <h4 className="text-sm font-medium mb-3">Size Variants</h4>
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {[0.75, 0.875, 1, 1.25, 1.5].map((scale) => (
            <div key={scale} className="text-center flex-shrink-0">
              <div className="bg-muted/30 rounded p-3 mb-1">
                <div style={{ ...previewStyle, fontSize: `${style.fontSize * scale}px` }}>
                  Aa
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{scale}x</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weight Variants */}
      <div>
        <h4 className="text-sm font-medium mb-3">Weight Variants</h4>
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {['300', '400', '500', '600', '700'].map((weight) => (
            <div key={weight} className="text-center flex-shrink-0">
              <div className="bg-muted/30 rounded p-3 mb-1">
                <div style={{ ...previewStyle, fontWeight: weight }}>
                  Aa
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{weight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Typography editor component
 */
export function TypographyEditor({ className }: TypographyEditorProps) {
  const { typography, updateTypography, resetTypography, hasUnsavedChanges, saveTheme } = useThemeBuilder();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ h1: true });
  
  // Create Typography entity
  const typographyEntity = React.useMemo(() => {
    return typography ? new TypographyEntity(typography) : null;
  }, [typography]);

  /**
   * Handles style change for a category
   */
  const handleStyleChange = useCallback((categoryId: string, updates: Partial<TypographyStyle>) => {
    if (!typography) return;
    
    updateTypography({
      ...typography,
      [categoryId]: {
        ...typography[categoryId as keyof TypographyConfig],
        ...updates
      }
    });
  }, [typography, updateTypography]);

  /**
   * Resets a specific category
   */
  const handleResetCategory = useCallback((categoryId: string) => {
    if (!typographyEntity) return;
    
    const defaultStyle = typographyEntity.getDefaultStyle(categoryId);
    handleStyleChange(categoryId, defaultStyle);
  }, [typographyEntity, handleStyleChange]);

  /**
   * Handles save
   */
  const handleSave = useCallback(async () => {
    try {
      await saveTheme();
    } catch (error) {
      console.error('Failed to save typography:', error);
    }
  }, [saveTheme]);

  if (!typography) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <p className="text-muted-foreground">No typography configuration available</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Typography Editor</h2>
          <p className="text-muted-foreground">
            Customize typography styles for your theme
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetTypography}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
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

      {/* Typography Categories */}
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {TYPOGRAPHY_CATEGORIES.map((category) => {
            const categoryStyle = typography[category.id as keyof TypographyConfig] as TypographyStyle;
            if (!categoryStyle) return null;

            return (
              <ExpandableSection
                key={category.id}
                title={category.label}
                expanded={expandedCategories[category.id]}
                onToggle={(expanded) => 
                  setExpandedCategories(prev => ({ ...prev, [category.id]: expanded }))
                }
                icon={<category.icon className="w-4 h-4" />}
                subtitle={category.description}
                variant="bordered"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Controls */}
                  <div>
                    <TypographyControl
                      style={categoryStyle}
                      onChange={(updates) => handleStyleChange(category.id, updates)}
                      onReset={() => handleResetCategory(category.id)}
                    />
                  </div>

                  {/* Preview */}
                  <div>
                    <TypographyPreview
                      categoryId={category.id}
                      style={categoryStyle}
                      previewText={category.previewText}
                    />
                  </div>
                </div>
              </ExpandableSection>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}