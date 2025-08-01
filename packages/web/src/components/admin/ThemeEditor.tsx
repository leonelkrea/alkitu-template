'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Palette, ChevronDown, ChevronUp } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useCompanyTheme } from '@/components/providers/DynamicThemeProvider';
import { ThemePresetSelectorWithArrows } from '@/components/themes/ThemePresetSelectorWithArrows';
import { ColorPicker } from '@/components/ui/simple-color-picker';
import { ColorSelectorPopover } from '@/components/ui/color-selector-popover';
import { ThemeActionBar } from './theme-action-bar';
import { ThemeCodePanel } from './theme-code-panel';
import { ThemePreviewContent } from './theme-preview-content';
import { ColorEditor } from './ColorEditor';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  importThemeFromFile,
  exportThemeToJson,
  exportThemeToCss,
  validateThemeColors,
} from '@/lib/theme-import-utils';
import { Brand } from '@/components/atomic-design/atoms';
import { Input } from '@/components/ui/input';
import { Upload, Crop, Check, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { BrandProvider, useBrandConfig } from './BrandContext';
import { TypographyEditor } from './TypographyEditor';
import { ShadowEditor } from './ShadowEditor';
import { RadiusSpacingEditor } from './RadiusSpacingEditor';
import { MultiFormatColorInput } from '@/components/ui/multi-format-color-input';

// SVG Cropper Component using react-easy-crop
function SVGCropper({
  svgContent,
  onSave,
  onCancel,
}: {
  svgContent: string;
  onSave: (croppedSvg: string) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<any>(null);
  const [svgDataUrl, setSvgDataUrl] = React.useState<string>('');

  React.useEffect(() => {
    // Convert SVG to data URL for cropper
    const svgBlob = new Blob(
      [
        `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`,
      ],
      {
        type: 'image/svg+xml',
      },
    );
    const url = URL.createObjectURL(svgBlob);
    setSvgDataUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [svgContent]);

  const onCropComplete = React.useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    // Calculate the viewport for the cropped area
    const scaleX = 48 / 300; // Assuming 300px canvas width
    const scaleY = 48 / 300; // Assuming 300px canvas height

    const viewBoxX = croppedAreaPixels.x * scaleX;
    const viewBoxY = croppedAreaPixels.y * scaleY;
    const viewBoxWidth = croppedAreaPixels.width * scaleX;
    const viewBoxHeight = croppedAreaPixels.height * scaleY;

    // Create cropped SVG by adjusting viewBox and adding transform
    const croppedSvg = `<g transform="translate(${-viewBoxX}, ${-viewBoxY}) scale(${48 / viewBoxWidth})">${svgContent}</g>`;
    onSave(croppedSvg);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Crop Logo Area</h4>
          <p className="text-sm text-muted-foreground">
            Drag and zoom to select the logo area
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

      <div className="relative h-[300px] bg-muted/30 border rounded-lg overflow-hidden">
        {svgDataUrl && (
          <Cropper
            image={svgDataUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            objectFit="contain"
            style={{
              containerStyle: {
                background: 'transparent',
              },
            }}
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        <Label className="text-sm">Zoom:</Label>
        <div className="flex-1">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
  );
}

// Brand Editor Component - Left Side  
function BrandEditor({ 
  isDarkMode, 
  darkColors, 
  lightColors, 
  getAllColorNames 
}: {
  isDarkMode: boolean;
  darkColors: Record<string, string>;
  lightColors: Record<string, string>;
  getAllColorNames: () => string[];
}) {
  const { config, updateConfig, relinkToSystem } = useBrandConfig();
  const currentColors = isDarkMode ? darkColors : lightColors;
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState<
    'idle' | 'success' | 'error' | 'editing'
  >('idle');
  const [tempSvgContent, setTempSvgContent] = React.useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('svg')) {
      setUploadStatus('error');
      return;
    }

    try {
      const text = await file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (svgElement) {
        svgElement.setAttribute('viewBox', '0 0 48 48');
        const svgContent = svgElement.innerHTML;
        setTempSvgContent(svgContent);
        setUploadStatus('editing');
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Error processing SVG:', error);
      setUploadStatus('error');
    }
  };

  const handleSaveAreaSelection = (croppedSvg: string) => {
    updateConfig({ customSvg: croppedSvg });
    setUploadStatus('success');
    setTempSvgContent('');
  };

  const handleCancelAreaSelection = () => {
    setUploadStatus('idle');
    setTempSvgContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* SVG Upload */}
      <ControlSection title="Logo Upload" expanded>
        {uploadStatus === 'editing' && tempSvgContent ? (
          <SVGCropper
            svgContent={tempSvgContent}
            onSave={handleSaveAreaSelection}
            onCancel={handleCancelAreaSelection}
          />
        ) : (
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer',
              isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50',
              uploadStatus === 'error' && 'border-destructive bg-destructive/5',
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {config.customSvg ? (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-muted rounded flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                    dangerouslySetInnerHTML={{ __html: config.customSvg }}
                  />
                </div>
                <p className="text-sm text-green-600">SVG uploaded</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateConfig({ customSvg: undefined });
                    setUploadStatus('idle');
                  }}
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-sm font-medium">
                  Drop SVG or click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  Area selection available after upload
                </p>
              </div>
            )}

            {uploadStatus === 'error' && (
              <p className="text-xs text-destructive mt-1">Invalid SVG file</p>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
        />

        {config.customSvg && (
          <>
            <Label className="text-sm font-medium">SVG Filters</Label>
            <div className="flex gap-2">
              <Button
                variant={
                  config.monochromeMode === 'none' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => updateConfig({ monochromeMode: 'none' })}
              >
                Original
              </Button>
              <Button
                variant={
                  config.monochromeMode === 'white' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => updateConfig({ monochromeMode: 'white' })}
              >
                White
              </Button>
              <Button
                variant={
                  config.monochromeMode === 'black' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => updateConfig({ monochromeMode: 'black' })}
              >
                Black
              </Button>
            </div>
          </>
        )}
      </ControlSection>

      {/* Text Configuration */}
      <ControlSection title="Brand Text" expanded>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Primary Text</Label>
            <Input
              value={config.primaryText}
              onChange={(e) => updateConfig({ primaryText: e.target.value })}
              placeholder="Your Brand Name"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Secondary Text</Label>
            <Input
              value={config.secondaryText}
              onChange={(e) => updateConfig({ secondaryText: e.target.value })}
              placeholder="Tagline (optional)"
              className="mt-1"
            />
          </div>
        </div>
      </ControlSection>

      {/* Color Configuration */}
      <ControlSection title="Text Colors" expanded>
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label className="text-xs font-medium">Primary Text Color</Label>
              <ColorLinkingControls
                colorName="brand-primary-text"
                isLinked={config.primaryTextColorLinked}
                linkedTo={config.primaryTextColorLinked ? (config.primaryTextColorLinkedTo || 'foreground') : undefined}
                onLinkTo={(targetColor) => {
                  // Update brand config to link to the selected theme color
                  const targetValue = (isDarkMode ? darkColors : lightColors)[targetColor];
                  if (targetValue) {
                    updateConfig({ 
                      primaryTextColor: targetValue,
                      primaryTextColorLinked: true,
                      primaryTextColorLinkedTo: targetColor
                    });
                  }
                }}
                onUnlink={() => updateConfig({ 
                  primaryTextColor: '#000000',
                  primaryTextColorLinked: false,
                  primaryTextColorLinkedTo: undefined
                })}
                availableColors={getAllColorNames()}
                defaultLinkTarget="foreground"
              />
            </div>
            {!config.primaryTextColorLinked && (
              <EnhancedColorPicker
                name="brand-primary-text"
                label=""
                color={config.primaryTextColor}
                onChange={(color) => updateConfig({ primaryTextColor: color })}
                description="Color for the main brand text"
              />
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label className="text-xs font-medium">Secondary Text Color</Label>
              <ColorLinkingControls
                colorName="brand-secondary-text"
                isLinked={config.secondaryTextColorLinked}
                linkedTo={config.secondaryTextColorLinked ? (config.secondaryTextColorLinkedTo || 'muted-foreground') : undefined}
                onLinkTo={(targetColor) => {
                  // Update brand config to link to the selected theme color
                  const targetValue = (isDarkMode ? darkColors : lightColors)[targetColor];
                  if (targetValue) {
                    updateConfig({ 
                      secondaryTextColor: targetValue,
                      secondaryTextColorLinked: true,
                      secondaryTextColorLinkedTo: targetColor
                    });
                  }
                }}
                onUnlink={() => updateConfig({ 
                  secondaryTextColor: '#666666',
                  secondaryTextColorLinked: false,
                  secondaryTextColorLinkedTo: undefined
                })}
                availableColors={getAllColorNames()}
                defaultLinkTarget="muted-foreground"
              />
            </div>
            {!config.secondaryTextColorLinked && (
              <EnhancedColorPicker
                name="brand-secondary-text"
                label=""
                color={config.secondaryTextColor}
                onChange={(color) => updateConfig({ secondaryTextColor: color })}
                description="Color for the secondary brand text (tagline)"
              />
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>System Colors:</strong> Brand text colors inherit from your global theme colors by default. 
            Primary text uses <code>foreground</code> and secondary text uses <code>muted-foreground</code>. 
          </p>
        </div>
      </ControlSection>

      {/* Icon Color Configuration */}
      <ControlSection title="Icon Colors" expanded>
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label className="text-xs font-medium">Icon Background Color</Label>
              <ColorLinkingControls
                colorName="brand-icon-background"
                isLinked={config.iconBackgroundColorLinked}
                linkedTo={config.iconBackgroundColorLinked ? (config.iconBackgroundColorLinkedTo || 'primary') : undefined}
                onLinkTo={(targetColor) => {
                  // Update brand config to link to the selected theme color
                  const targetValue = (isDarkMode ? darkColors : lightColors)[targetColor];
                  if (targetValue) {
                    updateConfig({ 
                      iconBackgroundColor: targetValue,
                      iconBackgroundColorLinked: true,
                      iconBackgroundColorLinkedTo: targetColor
                    });
                  }
                }}
                onUnlink={() => updateConfig({ 
                  iconBackgroundColor: '#3b82f6',
                  iconBackgroundColorLinked: false,
                  iconBackgroundColorLinkedTo: undefined
                })}
                availableColors={getAllColorNames()}
                defaultLinkTarget="primary"
              />
            </div>
            {!config.iconBackgroundColorLinked && (
              <EnhancedColorPicker
                name="brand-icon-background"
                label=""
                color={config.iconBackgroundColor}
                onChange={(color) => updateConfig({ iconBackgroundColor: color })}
                description="Background color for the icon"
              />
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label className="text-xs font-medium">Icon Color</Label>
              <ColorLinkingControls
                colorName="brand-icon-color"
                isLinked={config.iconColorLinked}
                linkedTo={config.iconColorLinked ? (config.iconColorLinkedTo || 'primary-foreground') : undefined}
                onLinkTo={(targetColor) => {
                  // Update brand config to link to the selected theme color
                  const targetValue = (isDarkMode ? darkColors : lightColors)[targetColor];
                  if (targetValue) {
                    updateConfig({ 
                      iconColor: targetValue,
                      iconColorLinked: true,
                      iconColorLinkedTo: targetColor
                    });
                  }
                }}
                onUnlink={() => updateConfig({ 
                  iconColor: '#ffffff',
                  iconColorLinked: false,
                  iconColorLinkedTo: undefined
                })}
                availableColors={getAllColorNames()}
                defaultLinkTarget="primary-foreground"
              />
            </div>
            {!config.iconColorLinked && (
              <EnhancedColorPicker
                name="brand-icon-color"
                label=""
                color={config.iconColor}
                onChange={(color) => updateConfig({ iconColor: color })}
                description="Color for the icon itself"
              />
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>System Colors:</strong> Icon colors inherit from your global theme colors by default. 
            Background uses <code>primary</code> and icon color uses <code>primary-foreground</code>. 
            When you customize a color, it breaks the link and uses your specific color instead.
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> Custom colors apply to light mode. In dark
            mode, text automatically adapts for proper contrast.
          </p>
        </div>
      </ControlSection>
    </div>
  );
}

// Type for our color configuration
interface ColorConfig {
  name: string;
  displayName: string;
  value: string;
  description: string;
  linkedTo?: string; // Optional: name of color this is linked to
  isLinked?: boolean; // Whether this color is currently linked
  defaultLinkTarget?: string; // Default color to link to (e.g., 'primary' for 'primary-foreground')
}

// Type for color sections
interface ColorSection {
  title: string;
  colors: ColorConfig[];
  expanded?: boolean;
}

// Define the color sections matching tweakcn
const colorSections: ColorSection[] = [
  {
    title: 'Primary Colors',
    expanded: true,
    colors: [
      {
        name: 'primary',
        displayName: 'Primary',
        value: '#f59e0b',
        description: 'Main brand color',
      },
      {
        name: 'primary-foreground',
        displayName: 'Primary Foreground',
        value: '#000000',
        description: 'Text on primary background',
        defaultLinkTarget: 'primary',
      },
    ],
  },
  {
    title: 'Secondary Colors',
    colors: [
      {
        name: 'secondary',
        displayName: 'Secondary',
        value: '#f3f4f6',
        description: 'Secondary brand color',
      },
      {
        name: 'secondary-foreground',
        displayName: 'Secondary Foreground',
        value: '#374151',
        description: 'Text on secondary background',
        defaultLinkTarget: 'secondary',
      },
    ],
  },
  {
    title: 'Accent Colors',
    colors: [
      {
        name: 'accent',
        displayName: 'Accent',
        value: '#e0f2fe',
        description: 'Accent color for highlights',
      },
      {
        name: 'accent-foreground',
        displayName: 'Accent Foreground',
        value: '#0c4a6e',
        description: 'Text on accent background',
        defaultLinkTarget: 'accent',
      },
    ],
  },
  {
    title: 'Base Colors',
    colors: [
      {
        name: 'background',
        displayName: 'Background',
        value: '#ffffff',
        description: 'Main background color',
      },
      {
        name: 'foreground',
        displayName: 'Foreground',
        value: '#374151',
        description: 'Primary text color',
      },
    ],
  },
  {
    title: 'Card Colors',
    colors: [
      {
        name: 'card',
        displayName: 'Card Background',
        value: '#ffffff',
        description: 'Card background color',
      },
      {
        name: 'card-foreground',
        displayName: 'Card Foreground',
        value: '#374151',
        description: 'Text on card background',
        defaultLinkTarget: 'card',
      },
    ],
  },
  {
    title: 'Popover Colors',
    colors: [
      {
        name: 'popover',
        displayName: 'Popover Background',
        value: '#ffffff',
        description: 'Popover background color',
      },
      {
        name: 'popover-foreground',
        displayName: 'Popover Foreground',
        value: '#374151',
        description: 'Text on popover background',
        defaultLinkTarget: 'popover',
      },
    ],
  },
  {
    title: 'Muted Colors',
    colors: [
      {
        name: 'muted',
        displayName: 'Muted',
        value: '#f9fafb',
        description: 'Muted background',
      },
      {
        name: 'muted-foreground',
        displayName: 'Muted Foreground',
        value: '#6b7280',
        description: 'Muted text color',
        defaultLinkTarget: 'muted',
      },
    ],
  },
  {
    title: 'Status Colors',
    colors: [
      {
        name: 'success',
        displayName: 'Success',
        value: '#10b981',
        description: 'Success color',
      },
      {
        name: 'success-foreground',
        displayName: 'Success Foreground',
        value: '#ffffff',
        description: 'Text on success background',
        defaultLinkTarget: 'success',
      },
      {
        name: 'warning',
        displayName: 'Warning',
        value: '#f59e0b',
        description: 'Warning color',
      },
      {
        name: 'warning-foreground',
        displayName: 'Warning Foreground',
        value: '#1f2937',
        description: 'Text on warning background',
        defaultLinkTarget: 'warning',
      },
      {
        name: 'info',
        displayName: 'Info',
        value: '#3b82f6',
        description: 'Info color',
      },
      {
        name: 'info-foreground',
        displayName: 'Info Foreground',
        value: '#ffffff',
        description: 'Text on info background',
        defaultLinkTarget: 'info',
      },
      {
        name: 'destructive',
        displayName: 'Destructive',
        value: '#ef4444',
        description: 'Error color',
      },
      {
        name: 'destructive-foreground',
        displayName: 'Destructive Foreground',
        value: '#ffffff',
        description: 'Text on error background',
        defaultLinkTarget: 'destructive',
      },
    ],
  },
  {
    title: 'Border & Input Colors',
    colors: [
      {
        name: 'border',
        displayName: 'Border',
        value: '#e5e7eb',
        description: 'Default border color',
        defaultLinkTarget: 'primary',
      },
      {
        name: 'input',
        displayName: 'Input',
        value: '#e5e7eb',
        description: 'Input border color',
        defaultLinkTarget: 'muted',
      },
      {
        name: 'ring',
        displayName: 'Ring',
        value: '#3b82f6',
        description: 'Focus ring color',
        defaultLinkTarget: 'primary',
      },
    ],
  },
  {
    title: 'Chart Colors',
    colors: [
      {
        name: 'chart-1',
        displayName: 'Chart 1',
        value: '#3b82f6',
        description: 'Chart color 1',
      },
      {
        name: 'chart-2',
        displayName: 'Chart 2',
        value: '#8b5cf6',
        description: 'Chart color 2',
      },
      {
        name: 'chart-3',
        displayName: 'Chart 3',
        value: '#f59e0b',
        description: 'Chart color 3',
      },
      {
        name: 'chart-4',
        displayName: 'Chart 4',
        value: '#10b981',
        description: 'Chart color 4',
      },
      {
        name: 'chart-5',
        displayName: 'Chart 5',
        value: '#ef4444',
        description: 'Chart color 5',
      },
    ],
  },
  {
    title: 'Sidebar Colors',
    colors: [
      {
        name: 'sidebar',
        displayName: 'Sidebar Background',
        value: '#f9fafb',
        description: 'Sidebar background color',
      },
      {
        name: 'sidebar-foreground',
        displayName: 'Sidebar Foreground',
        value: '#374151',
        description: 'Sidebar text color',
        defaultLinkTarget: 'sidebar',
      },
      {
        name: 'sidebar-primary',
        displayName: 'Sidebar Primary',
        value: '#f59e0b',
        description: 'Sidebar primary color',
      },
      {
        name: 'sidebar-primary-foreground',
        displayName: 'Sidebar Primary Foreground',
        value: '#000000',
        description: 'Sidebar primary text color',
        defaultLinkTarget: 'sidebar-primary',
      },
      {
        name: 'sidebar-accent',
        displayName: 'Sidebar Accent',
        value: '#e0f2fe',
        description: 'Sidebar accent color',
      },
      {
        name: 'sidebar-accent-foreground',
        displayName: 'Sidebar Accent Foreground',
        value: '#0c4a6e',
        description: 'Sidebar accent text color',
        defaultLinkTarget: 'sidebar-accent',
      },
      {
        name: 'sidebar-border',
        displayName: 'Sidebar Border',
        value: '#e5e7eb',
        description: 'Sidebar border color',
        defaultLinkTarget: 'border',
      },
      {
        name: 'sidebar-ring',
        displayName: 'Sidebar Ring',
        value: '#3b82f6',
        description: 'Sidebar focus ring color',
        defaultLinkTarget: 'ring',
      },
    ],
  },
];

// Collapsible section component matching tweakcn
interface ControlSectionProps {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  className?: string;
}

function ControlSection({
  title,
  children,
  expanded = false,
  className,
}: ControlSectionProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className={cn('mb-4 overflow-hidden rounded-lg border', className)}>
      <div
        className="bg-background hover:bg-muted flex cursor-pointer items-center justify-between p-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-medium">{title}</h3>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="bg-background border-t p-3 space-y-3">{children}</div>
      </div>
    </div>
  );
}

// Enhanced color picker component using multi-format input
interface EnhancedColorPickerProps {
  name: string;
  color: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
}

function EnhancedColorPicker({
  name,
  color,
  onChange,
  label,
  description,
}: EnhancedColorPickerProps) {
  const handleChange = useCallback(
    (newValue: string) => {
      console.log('EnhancedColorPicker multi-format change:', { name, newValue });
      onChange(newValue);
    },
    [onChange, name],
  );

  return (
    <div className="mb-3">
      <MultiFormatColorInput
        name={name}
        color={color}
        onChange={handleChange}
        label={label}
        description={description}
        defaultFormat="oklch"
        className="mb-0"
      />
      <div className="mt-2 flex items-center gap-2">
        <ColorSelectorPopover currentColor={color} onChange={onChange} />
      </div>
    </div>
  );
}

// Component for color linking controls
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
                .filter(color => color !== colorName && color !== defaultLinkTarget) // Don't allow self-linking or duplicate default
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

export function ThemeEditor() {
  const {
    theme,
    typography,
    isDarkMode,
    toggleThemeMode,
    refreshTheme,
    updateThemeColors,
    updateTypography,
  } = useCompanyTheme();
  const [activeTab, setActiveTab] = useState<
    'colors' | 'typography' | 'brand' | 'shadow' | 'border' | 'spacing'
  >('colors');
  const [lightColors, setLightColors] = useState<Record<string, string>>({});
  const [darkColors, setDarkColors] = useState<Record<string, string>>({});
  const [colorLinks, setColorLinks] = useState<Record<string, { linkedTo?: string; isLinked: boolean }>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [originalLightColors, setOriginalLightColors] = useState<
    Record<string, string>
  >({});
  const [originalDarkColors, setOriginalDarkColors] = useState<
    Record<string, string>
  >({});
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Material Design color selection state
  const [selectedShadcnColorForMaterial, setSelectedShadcnColorForMaterial] = useState<string | null>(null);
  const [colorSubTab, setColorSubTab] = useState<'shadcn-current' | 'material-design' | 'code'>('shadcn-current');

  // Get current colors based on mode
  const currentColors = useMemo(() => {
    return isDarkMode ? darkColors : lightColors;
  }, [isDarkMode, darkColors, lightColors]);

  // Function to apply current mode colors via theme context
  const applyCurrentModeColors = useCallback(() => {
    const currentModeColors = isDarkMode ? darkColors : lightColors;

    console.log('Applying colors via theme context:', {
      mode: isDarkMode ? 'dark' : 'light',
      colorCount: Object.keys(currentModeColors).length,
    });

    // Use the theme context to apply colors
    updateThemeColors(currentModeColors, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, darkColors, lightColors]); // Removed updateThemeColors from deps

  // Initialize colors from theme
  useEffect(() => {
    console.log(
      '🎨 Theme changed in editor:',
      theme?.name,
      'Initialized:',
      isInitialized,
    );

    if (theme && theme.lightModeConfig) {
      // Start with default colors from colorSections to ensure all colors are available
      const newLightColors: Record<string, string> = {};
      const newDarkColors: Record<string, string> = {};
      
      // First, populate with default values from colorSections
      colorSections.forEach((section) => {
        section.colors.forEach((color) => {
          newLightColors[color.name] = color.value;
          newDarkColors[color.name] = color.value;
        });
      });

      // Then override with actual theme colors
      Object.entries(theme.lightModeConfig).forEach(([name, value]) => {
        newLightColors[name] = value as string;
      });

      // Load dark mode colors (fallback to light if no dark config)
      const darkConfig = theme.darkModeConfig || theme.lightModeConfig;
      Object.entries(darkConfig).forEach(([name, value]) => {
        newDarkColors[name] = value as string;
      });

      console.log('🎨 Loading REAL theme colors:', {
        themeName: theme.name,
        lightCount: Object.keys(newLightColors).length,
        darkCount: Object.keys(newDarkColors).length,
        sampleColors: {
          primary: newLightColors.primary,
          secondary: newLightColors.secondary,
          background: newLightColors.background,
        },
      });

      setLightColors(newLightColors);
      setDarkColors(newDarkColors);
      setOriginalLightColors(newLightColors);
      setOriginalDarkColors(newDarkColors);
      setIsInitialized(true);
    } else if (!isInitialized) {
      // Only use default colors if no theme is loaded yet
      console.log('🎨 No theme loaded, using default colors');
      const defaultColors: Record<string, string> = {};
      colorSections.forEach((section) => {
        section.colors.forEach((color) => {
          defaultColors[color.name] = color.value;
        });
      });
      setLightColors(defaultColors);
      setDarkColors(defaultColors);
      setOriginalLightColors(defaultColors);
      setOriginalDarkColors(defaultColors);
      setIsInitialized(true);
    }
  }, [theme, isInitialized]);

  // Apply colors only when explicitly needed, not on every change
  // This prevents infinite loops since updateThemeColors updates the theme state

  // Apply colors when mode changes (only when mode actually changes)
  const prevModeRef = useRef(isDarkMode);
  useEffect(() => {
    // Only apply when mode actually changes, not on color updates
    if (prevModeRef.current !== isDarkMode && isInitialized) {
      console.log(
        'Mode changed, applying colors for:',
        isDarkMode ? 'dark' : 'light',
      );
      const currentModeColors = isDarkMode ? darkColors : lightColors;
      if (Object.keys(currentModeColors).length > 0) {
        // Apply the colors for the new mode
        updateThemeColors(currentModeColors, isDarkMode ? 'dark' : 'light');
      }
    }
    prevModeRef.current = isDarkMode;
  }, [isDarkMode, isInitialized]);

  // Force refresh colors when theme ID changes (different theme selected)
  useEffect(() => {
    if (theme?.id && isInitialized) {
      console.log(
        '🔄 Theme ID changed, force refreshing colors for:',
        theme.name,
      );

      const newLightColors: Record<string, string> = {};
      const newDarkColors: Record<string, string> = {};

      // First, populate with default values from colorSections
      colorSections.forEach((section) => {
        section.colors.forEach((color) => {
          newLightColors[color.name] = color.value;
          newDarkColors[color.name] = color.value;
        });
      });

      // Then override with actual theme colors
      if (theme.lightModeConfig) {
        Object.entries(theme.lightModeConfig).forEach(([name, value]) => {
          newLightColors[name] = value as string;
        });
      }

      const darkConfig = theme.darkModeConfig || theme.lightModeConfig;
      if (darkConfig) {
        Object.entries(darkConfig).forEach(([name, value]) => {
          newDarkColors[name] = value as string;
        });
      }

      console.log('🔄 Force updating colors:', {
        primary: newLightColors.primary,
        secondary: newLightColors.secondary,
        accent: newLightColors.accent,
      });

      setLightColors(newLightColors);
      setDarkColors(newDarkColors);
      setOriginalLightColors(newLightColors);
      setOriginalDarkColors(newDarkColors);
    }
  }, [theme?.id, isInitialized]);

  // Helper function to get all available colors for linking
  const getAllColorNames = useCallback(() => {
    const allColors: string[] = [];
    colorSections.forEach(section => {
      section.colors.forEach(color => {
        allColors.push(color.name);
      });
    });
    return allColors;
  }, []);

  // Function to link a color to another color
  const linkColorTo = useCallback((colorName: string, targetColor: string) => {
    setColorLinks(prev => ({
      ...prev,
      [colorName]: { linkedTo: targetColor, isLinked: true }
    }));

    // Update the color value to match the target color
    const currentModeColors = isDarkMode ? darkColors : lightColors;
    const targetValue = currentModeColors[targetColor];
    
    
    if (targetValue) {
      if (isDarkMode) {
        setDarkColors(prev => ({ ...prev, [colorName]: targetValue }));
      } else {
        setLightColors(prev => ({ ...prev, [colorName]: targetValue }));
      }
      
      // Apply the change immediately
      updateThemeColors({ [colorName]: targetValue }, isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, darkColors, lightColors, updateThemeColors]);

  // Function to unlink a color
  const unlinkColor = useCallback((colorName: string) => {
    setColorLinks(prev => ({
      ...prev,
      [colorName]: { isLinked: false }
    }));
    
    // Apply the current color value immediately when unlinking
    const currentModeColors = isDarkMode ? darkColors : lightColors;
    const currentValue = currentModeColors[colorName];
    if (currentValue) {
      updateThemeColors({ [colorName]: currentValue }, isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, darkColors, lightColors, updateThemeColors]);

  // Function to check if a color is linked
  const isColorLinked = useCallback((colorName: string) => {
    return colorLinks[colorName]?.isLinked || false;
  }, [colorLinks]);

  // Function to get what a color is linked to
  const getColorLinkTarget = useCallback((colorName: string) => {
    return colorLinks[colorName]?.linkedTo;
  }, [colorLinks]);

  // Handle color changes with proper theme mode consideration
  const handleColorChange = useCallback(
    (colorName: string, newValue: string) => {
      // Automatically unlink color when manually changed
      if (isColorLinked(colorName)) {
        unlinkColor(colorName);
      }

      // Update the appropriate color state
      if (isDarkMode) {
        setDarkColors((prev) => ({ ...prev, [colorName]: newValue }));
      } else {
        setLightColors((prev) => ({ ...prev, [colorName]: newValue }));
      }

      // Use the new updateThemeColors function from context to sync with the entire app
      updateThemeColors(
        { [colorName]: newValue },
        isDarkMode ? 'dark' : 'light',
      );
    },
    [isDarkMode, isColorLinked, unlinkColor, updateThemeColors],
  );

  // Update linked colors when their target colors change
  useEffect(() => {
    Object.entries(colorLinks).forEach(([colorName, linkInfo]) => {
      if (linkInfo.isLinked && linkInfo.linkedTo) {
        const currentModeColors = isDarkMode ? darkColors : lightColors;
        const targetValue = currentModeColors[linkInfo.linkedTo];
        
        if (targetValue && currentModeColors[colorName] !== targetValue) {
          // Update the linked color to match its target
          if (isDarkMode) {
            setDarkColors(prev => ({ ...prev, [colorName]: targetValue }));
          } else {
            setLightColors(prev => ({ ...prev, [colorName]: targetValue }));
          }
          
          // Apply the change immediately
          updateThemeColors({ [colorName]: targetValue }, isDarkMode ? 'dark' : 'light');
        }
      }
    });
  }, [colorLinks, darkColors, lightColors, isDarkMode, updateThemeColors]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    const lightChanged =
      JSON.stringify(lightColors) !== JSON.stringify(originalLightColors);
    const darkChanged =
      JSON.stringify(darkColors) !== JSON.stringify(originalDarkColors);
    return lightChanged || darkChanged;
  }, [lightColors, darkColors, originalLightColors, originalDarkColors]);

  // Reset to original colors
  const handleReset = useCallback(() => {
    setLightColors(originalLightColors);
    setDarkColors(originalDarkColors);

    // Apply the original colors via theme context
    const originalColors = isDarkMode
      ? originalDarkColors
      : originalLightColors;
    updateThemeColors(originalColors, isDarkMode ? 'dark' : 'light');

    toast.success('Theme reset to original state');
  }, [originalLightColors, originalDarkColors, isDarkMode]); // Removed updateThemeColors from deps

  // Handle import theme from JSON or CSS
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.css';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const themeData = await importThemeFromFile(file);
        if (!themeData) return;

        // Validate the imported colors
        const lightErrors = validateThemeColors(themeData.lightModeConfig);
        const darkErrors = validateThemeColors(themeData.darkModeConfig);

        if (lightErrors.length > 0 || darkErrors.length > 0) {
          const allErrors = [...lightErrors, ...darkErrors];
          toast.warning(
            `Theme imported with missing colors: ${allErrors.join(', ')}`,
          );
        }

        // Apply the imported colors
        setLightColors((prev) => ({ ...prev, ...themeData.lightModeConfig }));
        setDarkColors((prev) => ({ ...prev, ...themeData.darkModeConfig }));
        applyCurrentModeColors();

        toast.success(`Theme imported successfully from ${file.name}`);
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to import theme file');
      }
    };
    input.click();
  }, [applyCurrentModeColors]);

  // Handle export theme
  const handleExport = useCallback(
    (format: 'json' | 'css') => {
      const themeData = {
        name: theme?.name || 'Custom Theme',
        lightModeConfig: lightColors,
        darkModeConfig: darkColors,
      };

      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'json') {
        content = exportThemeToJson(themeData);
        filename = `${themeData.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
        mimeType = 'application/json';
      } else {
        content = exportThemeToCss(themeData);
        filename = `${themeData.name.toLowerCase().replace(/\s+/g, '-')}-theme.css`;
        mimeType = 'text/css';
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Theme exported as ${format.toUpperCase()}`);
    },
    [theme, lightColors, darkColors],
  );

  // Handle save theme
  const handleSave = useCallback(async () => {
    if (!theme?.companyId) {
      toast.error('No company found');
      return;
    }

    try {
      const themeName = prompt('Enter theme name:', theme?.name || 'New Theme');
      if (!themeName) return;

      // TODO: Implement theme saving functionality
      // const createThemeMutation = trpc.theme.createTheme.useMutation();
      // await createThemeMutation.mutateAsync({
      //   name: themeName,
      //   companyId: theme?.companyId,
      //   createdById: 'default-user',
      //   lightModeConfig: lightColors,
      //   darkModeConfig: darkColors,
      //   isDefault: false,
      // });

      console.log('Theme would be saved:', {
        name: themeName,
        lightModeConfig: lightColors,
        darkModeConfig: darkColors,
      });

      // Update original colors to reflect saved state
      setOriginalLightColors(lightColors);
      setOriginalDarkColors(darkColors);

      toast.success('Theme export functionality coming soon!');
      await refreshTheme();
    } catch (error) {
      console.error('Failed to save theme:', error);
      toast.error('Failed to save theme');
    }
  }, [theme, lightColors, darkColors, refreshTheme]);

  return (
    <BrandProvider>
    <div className="relative isolate flex flex-1 overflow-hidden">
      {/* Desktop Layout matching tweakcn exactly */}
      <div className="hidden size-full md:block">
        <ResizablePanelGroup direction="horizontal" className="isolate">
          <ResizablePanel
            defaultSize={30}
            minSize={20}
            maxSize={40}
            className="z-1 min-w-[max(20%,22rem)]"
          >
            <div className="relative isolate flex h-full flex-1 flex-col">
              <Card className="h-full rounded-none border-r border-t-0 border-l-0 border-b-0">
                {/* Theme Preset Selector Header with Navigation Arrows */}
                <div className="border-b">
                  <div className="p-4">
                    <ThemePresetSelectorWithArrows
                      onThemeSelect={async (themeId) => {
                        try {
                          console.log('Theme selected in editor:', themeId);
                          // Refresh theme will trigger the useEffect to update colors
                          await refreshTheme();
                          setPreviewMode(false); // Reset preview mode to show applied theme
                        } catch (error) {
                          console.error('Failed to refresh theme:', error);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Theme Control Tabs */}
                <div className="flex min-h-0 flex-1 flex-col">
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                      setActiveTab(
                        value as 'colors' | 'typography' | 'brand' | 'shadow' | 'border' | 'spacing',
                      )
                    }
                    className="flex min-h-0 w-full flex-1 flex-col"
                  >
                    <div className="px-4 pt-4">
                      <TabsList className="bg-background text-muted-foreground inline-flex w-fit items-center justify-center rounded-full px-1">
                        <TabsTrigger
                          value="colors"
                          className="rounded-full px-4 py-1"
                        >
                          Colors
                        </TabsTrigger>
                        <TabsTrigger
                          value="typography"
                          className="rounded-full px-4 py-1"
                        >
                          Typography
                        </TabsTrigger>
                        <TabsTrigger
                          value="brand"
                          className="rounded-full px-4 py-1"
                        >
                          Brand
                        </TabsTrigger>
                        <TabsTrigger
                          value="shadow"
                          className="rounded-full px-4 py-1"
                        >
                          Shadow
                        </TabsTrigger>
                        <TabsTrigger
                          value="border"
                          className="rounded-full px-4 py-1"
                        >
                          Border
                        </TabsTrigger>
                        <TabsTrigger
                          value="spacing"
                          className="rounded-full px-4 py-1"
                        >
                          Spacing
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent
                      value="colors"
                      className="mt-1 size-full overflow-hidden"
                    >
                      {/* Tabs principales para Colors */}
                      <Tabs value={colorSubTab} onValueChange={(value) => setColorSubTab(value as 'shadcn-current' | 'material-design' | 'code')} className="flex flex-col h-full">
                        <div className="px-4 pb-2">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="shadcn-current" className="text-xs">
                              ShadCN + TailwindCSS v4
                            </TabsTrigger>
                            <TabsTrigger value="material-design" className="text-xs">
                              Material Design v3
                            </TabsTrigger>
                            <TabsTrigger value="code" className="text-xs">
                              Code
                            </TabsTrigger>
                          </TabsList>
                        </div>

                        {/* Tab ShadCN Actual */}
                        <TabsContent value="shadcn-current" className="flex-1 overflow-hidden">
                          <ScrollArea className="h-[550px] px-4">
                            {colorSections.map((section) => (
                              <ControlSection
                                key={section.title}
                                title={section.title}
                                expanded={section.expanded}
                              >
                                {section.colors.map((color) => (
                                  <div key={color.name} className="mb-4">
                                    <div className="mb-1.5 flex items-center justify-between">
                                      <Label className="text-xs font-medium">
                                        {color.displayName}
                                      </Label>
                                      <div className="flex items-center gap-2">
                                        <ColorLinkingControls
                                          colorName={color.name}
                                          isLinked={isColorLinked(color.name)}
                                          linkedTo={getColorLinkTarget(color.name)}
                                          onLinkTo={(targetColor) => linkColorTo(color.name, targetColor)}
                                          onUnlink={() => unlinkColor(color.name)}
                                          availableColors={getAllColorNames()}
                                          defaultLinkTarget={color.defaultLinkTarget}
                                        />
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-6 px-2 text-xs"
                                          onClick={() => {
                                            setSelectedShadcnColorForMaterial(color.name);
                                            setActiveTab('colors'); // Ensure we're on colors tab
                                            setColorSubTab('material-design'); // Switch to Material Design tab
                                          }}
                                          title="Link to Material Design 3 color"
                                        >
                                          <Palette className="w-3 h-3 mr-1" />
                                          MD3
                                        </Button>
                                      </div>
                                    </div>
                                    {!isColorLinked(color.name) && (
                                      <EnhancedColorPicker
                                        name={color.name}
                                        color={currentColors[color.name] || color.value}
                                        onChange={(newValue) =>
                                          handleColorChange(color.name, newValue)
                                        }
                                        label=""
                                        description={color.description}
                                      />
                                    )}
                                    {isColorLinked(color.name) && color.description && (
                                      <p className="text-muted-foreground text-xs mt-1">{color.description}</p>
                                    )}
                                  </div>
                                ))}
                              </ControlSection>
                            ))}
                          </ScrollArea>
                        </TabsContent>

                        {/* Tab Material Design v3 */}
                        <TabsContent value="material-design" className="flex-1 overflow-hidden">
                          <ScrollArea className="h-[550px]">
                            <ColorEditor 
                              onChange={(mapping: any) => {
                                console.log('Color mapping changed:', mapping);
                                // TODO: Integrar con el sistema de theme existente
                              }}
                              onSave={(mapping: any) => {
                                console.log('Color mapping saved:', mapping);
                                // TODO: Implementar guardado en el sistema de theme
                              }}
                              onColorChange={handleColorChange}
                              selectedShadcnColor={selectedShadcnColorForMaterial as any}
                              onSelectShadcnColor={setSelectedShadcnColorForMaterial as any}
                              currentThemeColors={currentColors}
                              forceActiveSystem="material"
                            />
                          </ScrollArea>
                        </TabsContent>

                        {/* Tab Code */}
                        <TabsContent value="code" className="flex-1 overflow-hidden">
                          <ScrollArea className="h-[550px]">
                            <ColorEditor 
                              onChange={(mapping: any) => {
                                console.log('Color mapping changed:', mapping);
                              }}
                              onSave={(mapping: any) => {
                                console.log('Color mapping saved:', mapping);
                              }}
                              onColorChange={handleColorChange}
                              selectedShadcnColor={selectedShadcnColorForMaterial as any}
                              onSelectShadcnColor={setSelectedShadcnColorForMaterial as any}
                              currentThemeColors={currentColors}
                              forceActiveSystem="code"
                            />
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                    </TabsContent>

                    <TabsContent
                      value="typography"
                      className="mt-1 size-full overflow-hidden"
                    >
                      <ScrollArea className="h-[600px] px-4">
                        <TypographyEditor
                          typography={typography}
                          onChange={updateTypography}
                          className="pb-4"
                        />
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="brand"
                      className="mt-1 size-full overflow-hidden"
                    >
                        <ScrollArea className="h-[600px] px-4">
                          <BrandEditor 
                            isDarkMode={isDarkMode}
                            darkColors={darkColors}
                            lightColors={lightColors}
                            getAllColorNames={getAllColorNames}
                          />
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="shadow"
                      className="mt-1 size-full overflow-hidden"
                    >
                      <ScrollArea className="h-[600px] px-4">
                        <ShadowEditor />
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="border"
                      className="mt-1 size-full overflow-hidden"
                    >
                      <ScrollArea className="h-[600px] px-4">
                        <RadiusSpacingEditor />
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="spacing"
                      className="mt-1 size-full overflow-hidden"
                    >
                      <ScrollArea className="h-[600px] px-4">
                        <div className="py-4">
                          <div>
                            <h2 className="text-2xl font-bold">Sistema de Espaciado</h2>
                            <p className="text-muted-foreground">
                              Sistema de espaciado próximamente
                            </p>
                          </div>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              </Card>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full flex-col">
              <div className="flex min-h-0 flex-1 flex-col">
                {/* Action Bar positioned at top of right panel like tweakcn */}
                <ThemeActionBar
                  lightColors={lightColors}
                  darkColors={darkColors}
                  isDarkMode={isDarkMode}
                  onToggleMode={toggleThemeMode}
                  onSave={handleSave}
                  onReset={handleReset}
                  onImport={handleImport}
                  onExport={handleExport}
                  onShowCode={() => setShowCodePanel(true)}
                  hasUnsavedChanges={hasUnsavedChanges}
                  previewMode={previewMode}
                  onTogglePreview={() => setPreviewMode(!previewMode)}
                />

                {/* Theme Preview Panel */}
                <div className="flex-1 overflow-hidden">
                  <Card className="h-full rounded-none border-t-0">
                    <CardContent className="p-6 h-full overflow-auto">
                      <ThemePreviewContent />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile Layout */}
      <div className="h-full w-full flex-1 overflow-hidden md:hidden">
        <Tabs defaultValue="controls" className="h-full">
          <TabsList className="w-full rounded-none">
            <TabsTrigger value="controls" className="flex-1">
              Controls
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="controls" className="mt-0 h-[calc(100%-2.5rem)]">
            <div className="flex h-full flex-col">
              {/* Mobile controls content */}
            </div>
          </TabsContent>
          <TabsContent value="preview" className="mt-0 h-[calc(100%-2.5rem)]">
            <div className="flex h-full flex-col overflow-auto p-4">
              <ThemePreviewContent />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Theme Code Panel */}
      <ThemeCodePanel
        open={showCodePanel}
        onOpenChange={setShowCodePanel}
        lightColors={lightColors}
        darkColors={darkColors}
        themeName={theme?.name || 'Custom Theme'}
      />
    </div>
    </BrandProvider>
  );
}
