/**
 * Theme Builder - Brand Editor Component
 * Component for editing brand assets (logo, colors, text)
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Crop, 
  Check, 
  X, 
  Link, 
  Unlink,
  Download,
  Eye,
  Palette,
  Type,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Local imports
import { useBrandConfig } from '../../contexts/BrandContext';
import { useThemeBuilder } from '../../contexts/ThemeBuilderContext';
import { ColorInput } from '../common/ColorInput';
import { ExpandableSection } from '../common/ExpandableSection';
import { Brand } from '@/components/atomic-design/atoms';
import { ProcessSvgUseCase } from '../../../domain/use-cases/brand/process-svg.use-case';
import { fileValidator, type SvgValidationResult } from '../../../infrastructure/validators/file.validator';
import type { BrandConfig } from '../../../shared/types/theme.types';

/**
 * SVG Cropper Component
 */
interface SVGCropperProps {
  svgContent: string;
  onSave: (croppedSvg: string) => void;
  onCancel: () => void;
}

function SVGCropper({ svgContent, onSave, onCancel }: SVGCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [svgDataUrl, setSvgDataUrl] = useState<string>('');

  React.useEffect(() => {
    // Convert SVG to data URL for preview
    const svgBlob = new Blob(
      [`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`],
      { type: 'image/svg+xml' }
    );
    const url = URL.createObjectURL(svgBlob);
    setSvgDataUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [svgContent]);

  const handleSave = () => {
    // For simplicity, just wrap in a group with transform
    const croppedSvg = `<g transform="translate(${-crop.x}, ${-crop.y}) scale(${zoom})">${svgContent}</g>`;
    onSave(croppedSvg);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Crop Logo Area</h4>
          <p className="text-sm text-muted-foreground">
            Adjust the logo position and zoom
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Check className="w-4 h-4 mr-1" />
            Apply
          </Button>
        </div>
      </div>

      <div className="relative h-[300px] bg-muted/30 border rounded-lg overflow-hidden flex items-center justify-center">
        {svgDataUrl && (
          <img 
            src={svgDataUrl} 
            alt="SVG Preview" 
            className="max-w-full max-h-full"
            style={{
              transform: `translate(${crop.x}px, ${crop.y}px) scale(${zoom})`
            }}
          />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm">Position</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Label className="text-xs">X</Label>
              <Input
                type="number"
                value={crop.x}
                onChange={(e) => setCrop(prev => ({ ...prev, x: Number(e.target.value) }))}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Y</Label>
              <Input
                type="number"
                value={crop.y}
                onChange={(e) => setCrop(prev => ({ ...prev, y: Number(e.target.value) }))}
                className="h-8"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm">Zoom: {Math.round(zoom * 100)}%</Label>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer mt-2"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Brand editor props
 */
export interface BrandEditorProps {
  className?: string;
}

/**
 * Brand editor component
 */
export function BrandEditor({ className }: BrandEditorProps) {
  const { config, updateConfig, relinkToSystem, hasUnsavedChanges, saveBrand } = useBrandConfig();
  const { isDarkMode, getCurrentColors, getAllColorNames } = useThemeBuilder();
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'editing'>('idle');
  const [tempSvgContent, setTempSvgContent] = useState<string>('');
  const [validationResult, setValidationResult] = useState<SvgValidationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const processSvgUseCase = React.useMemo(() => new ProcessSvgUseCase(), []);
  const currentColors = getCurrentColors();

  /**
   * Handles file upload
   */
  const handleFileUpload = async (file: File) => {
    // Validate file first
    const validation = await fileValidator.validateSvgFile(file) as SvgValidationResult;
    setValidationResult(validation);

    if (!validation.isValid) {
      setUploadStatus('error');
      return;
    }

    try {
      const text = await file.text();
      const processedSvg = processSvgUseCase.processSvg(text);
      
      if (processedSvg) {
        setTempSvgContent(processedSvg.content);
        setUploadStatus('editing');
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Error processing SVG:', error);
      setUploadStatus('error');
    }
  };

  /**
   * Handles cropped SVG save
   */
  const handleSaveAreaSelection = (croppedSvg: string) => {
    updateConfig({ customSvg: croppedSvg });
    setUploadStatus('success');
    setTempSvgContent('');
    
    // Clear validation after successful save
    setTimeout(() => {
      setUploadStatus('idle');
      setValidationResult(null);
    }, 2000);
  };

  /**
   * Handles drag over
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  /**
   * Handles drag leave
   */
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  /**
   * Handles file drop
   */
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  /**
   * Handles save
   */
  const handleSave = useCallback(async () => {
    try {
      await saveBrand();
    } catch (error) {
      console.error('Failed to save brand:', error);
    }
  }, [saveBrand]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Brand Editor</h2>
          <p className="text-muted-foreground">
            Customize your brand identity
          </p>
        </div>

        {hasUnsavedChanges && (
          <Button onClick={handleSave}>
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      {/* SVG Cropper Modal */}
      {uploadStatus === 'editing' && tempSvgContent && (
        <Card>
          <CardContent className="p-6">
            <SVGCropper
              svgContent={tempSvgContent}
              onSave={handleSaveAreaSelection}
              onCancel={() => {
                setUploadStatus('idle');
                setTempSvgContent('');
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Logo Upload Section */}
      <ExpandableSection
        title="Logo"
        icon={<ImageIcon className="w-4 h-4" />}
        defaultExpanded
        variant="bordered"
      >
        <div className="space-y-4">
          {/* Upload area */}
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
              isDragOver && 'border-primary bg-primary/5',
              uploadStatus === 'error' && 'border-destructive bg-destructive/5',
              uploadStatus === 'success' && 'border-green-500 bg-green-500/5'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">
              Drop your SVG logo here or click to browse
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose SVG File
            </Button>
          </div>

          {/* Validation messages */}
          {validationResult && (
            <Alert variant={validationResult.isValid ? 'default' : 'destructive'}>
              <AlertDescription>
                {validationResult.errors.map((error, i) => (
                  <div key={i}>{error}</div>
                ))}
                {validationResult.warnings.map((warning, i) => (
                  <div key={i} className="text-yellow-600">{warning}</div>
                ))}
                {validationResult.isValid && uploadStatus === 'success' && (
                  <div className="text-green-600">Logo uploaded successfully!</div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Preview */}
          {config.customSvg && (
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-muted rounded-lg p-4">
                <Brand 
                  config={config}
                  className="w-full h-full"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateConfig({ customSvg: undefined })}
              >
                <X className="w-4 h-4 mr-1" />
                Remove Logo
              </Button>
            </div>
          )}
        </div>
      </ExpandableSection>

      {/* Text Configuration */}
      <ExpandableSection
        title="Text"
        icon={<Type className="w-4 h-4" />}
        defaultExpanded
        variant="bordered"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Primary Text</Label>
              <Input
                value={config.primaryText}
                onChange={(e) => updateConfig({ primaryText: e.target.value })}
                placeholder="Your Brand Name"
              />
            </div>
            <div>
              <Label>Secondary Text</Label>
              <Input
                value={config.secondaryText}
                onChange={(e) => updateConfig({ secondaryText: e.target.value })}
                placeholder="Tagline or Description"
              />
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* Color Configuration */}
      <ExpandableSection
        title="Colors"
        icon={<Palette className="w-4 h-4" />}
        defaultExpanded
        variant="bordered"
      >
        <div className="space-y-6">
          {/* Text Colors */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Text Colors</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <ColorInput
                label="Primary Text Color"
                value={config.primaryTextColor || currentColors.foreground}
                onChange={(value) => updateConfig({ primaryTextColor: value })}
                colorName="primaryTextColor"
                availableColors={getAllColorNames()}
                isLinked={config.primaryTextColorLinked}
                linkedTo={config.primaryTextColorLinkedTo}
                showColorPreview
              />
              <ColorInput
                label="Secondary Text Color"
                value={config.secondaryTextColor || currentColors['muted-foreground']}
                onChange={(value) => updateConfig({ secondaryTextColor: value })}
                colorName="secondaryTextColor"
                availableColors={getAllColorNames()}
                isLinked={config.secondaryTextColorLinked}
                linkedTo={config.secondaryTextColorLinkedTo}
                showColorPreview
              />
            </div>
          </div>

          {/* Icon Colors */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Icon Colors</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <ColorInput
                label="Icon Background"
                value={config.iconBackgroundColor || currentColors.primary}
                onChange={(value) => updateConfig({ iconBackgroundColor: value })}
                colorName="iconBackgroundColor"
                availableColors={getAllColorNames()}
                isLinked={config.iconBackgroundColorLinked}
                linkedTo={config.iconBackgroundColorLinkedTo}
                showColorPreview
              />
              <ColorInput
                label="Icon Color"
                value={config.iconColor || currentColors['primary-foreground']}
                onChange={(value) => updateConfig({ iconColor: value })}
                colorName="iconColor"
                availableColors={getAllColorNames()}
                isLinked={config.iconColorLinked}
                linkedTo={config.iconColorLinkedTo}
                showColorPreview
              />
            </div>
          </div>

          {/* Monochrome Mode */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Monochrome Mode</h4>
            <RadioGroup
              value={config.monochromeMode}
              onValueChange={(value: any) => updateConfig({ monochromeMode: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="mono-none" />
                <Label htmlFor="mono-none">None (Use defined colors)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="white" id="mono-white" />
                <Label htmlFor="mono-white">Force White</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="black" id="mono-black" />
                <Label htmlFor="mono-black">Force Black</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </ExpandableSection>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-8 bg-background rounded-lg border">
              <Brand config={config} className="h-12" />
              <p className="text-xs text-muted-foreground mt-4">Light Mode</p>
            </div>
            <div className="p-8 bg-background rounded-lg border dark">
              <Brand config={config} className="h-12" />
              <p className="text-xs text-muted-foreground mt-4">Dark Mode</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}