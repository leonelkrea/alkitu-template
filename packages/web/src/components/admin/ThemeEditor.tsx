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
import { Separator } from '@/components/ui/separator';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Palette, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useCompanyTheme } from '@/components/providers/DynamicThemeProvider';
import { ThemePresetSelectorWithArrows } from '@/components/themes/ThemePresetSelectorWithArrows';
import { ColorPicker } from '@/components/ui/simple-color-picker';
import { ColorSelectorPopover } from '@/components/ui/color-selector-popover';
import { ThemeActionBar } from './theme-action-bar';
import { ThemeCodePanel } from './theme-code-panel';
import { ThemePreviewContent } from './theme-preview-content';
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
function BrandEditor() {
  const { config, updateConfig } = useBrandConfig();
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
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Primary Text Color</span>
              {config.primaryTextColorLinked ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    🔗 Linked to system foreground
                  </span>
                  <button
                    onClick={() => updateConfig({ 
                      primaryTextColor: '#000000', // Start with black as default
                      primaryTextColorLinked: false 
                    })}
                    className="text-xs text-orange-600 hover:text-orange-800 underline"
                  >
                    🎨 Customize
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => updateConfig({ 
                    primaryTextColor: '', 
                    primaryTextColorLinked: true 
                  })}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  🔗 Link to system
                </button>
              )}
            </div>
            {!config.primaryTextColorLinked && (
              <EnhancedColorPicker
                name="brand-primary-text"
                label="Custom Primary Color"
                color={config.primaryTextColor}
                onChange={(color) => updateConfig({ primaryTextColor: color })}
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Secondary Text Color</span>
              {config.secondaryTextColorLinked ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    🔗 Linked to system muted-foreground
                  </span>
                  <button
                    onClick={() => updateConfig({ 
                      secondaryTextColor: '#666666', // Start with gray as default
                      secondaryTextColorLinked: false 
                    })}
                    className="text-xs text-orange-600 hover:text-orange-800 underline"
                  >
                    🎨 Customize
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => updateConfig({ 
                    secondaryTextColor: '', 
                    secondaryTextColorLinked: true 
                  })}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  🔗 Link to system
                </button>
              )}
            </div>
            {!config.secondaryTextColorLinked && (
              <EnhancedColorPicker
                name="brand-secondary-text"
                label="Custom Secondary Color"
                color={config.secondaryTextColor}
                onChange={(color) => updateConfig({ secondaryTextColor: color })}
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
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Icon Background Color</span>
              {config.iconBackgroundColorLinked ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    🔗 Linked to system primary
                  </span>
                  <button
                    onClick={() => updateConfig({ 
                      iconBackgroundColor: '#3b82f6', // Start with blue as default
                      iconBackgroundColorLinked: false 
                    })}
                    className="text-xs text-orange-600 hover:text-orange-800 underline"
                  >
                    🎨 Customize
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => updateConfig({ 
                    iconBackgroundColor: '', 
                    iconBackgroundColorLinked: true 
                  })}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  🔗 Link to system
                </button>
              )}
            </div>
            {!config.iconBackgroundColorLinked && (
              <EnhancedColorPicker
                name="brand-icon-background"
                label="Custom Icon Background Color"
                color={config.iconBackgroundColor}
                onChange={(color) => updateConfig({ iconBackgroundColor: color })}
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Icon Color</span>
              {config.iconColorLinked ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    🔗 Linked to system primary-foreground
                  </span>
                  <button
                    onClick={() => updateConfig({ 
                      iconColor: '#ffffff', // Start with white as default
                      iconColorLinked: false 
                    })}
                    className="text-xs text-orange-600 hover:text-orange-800 underline"
                  >
                    🎨 Customize
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => updateConfig({ 
                    iconColor: '', 
                    iconColorLinked: true 
                  })}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  🔗 Link to system
                </button>
              )}
            </div>
            {!config.iconColorLinked && (
              <EnhancedColorPicker
                name="brand-icon-color"
                label="Custom Icon Color"
                color={config.iconColor}
                onChange={(color) => updateConfig({ iconColor: color })}
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
      },
      {
        name: 'input',
        displayName: 'Input',
        value: '#e5e7eb',
        description: 'Input border color',
      },
      {
        name: 'ring',
        displayName: 'Ring',
        value: '#3b82f6',
        description: 'Focus ring color',
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
      },
      {
        name: 'sidebar-border',
        displayName: 'Sidebar Border',
        value: '#e5e7eb',
        description: 'Sidebar border color',
      },
      {
        name: 'sidebar-ring',
        displayName: 'Sidebar Ring',
        value: '#3b82f6',
        description: 'Sidebar focus ring color',
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

// Enhanced color picker component
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
  const [inputValue, setInputValue] = useState(color);

  useEffect(() => {
    setInputValue(color);
  }, [color]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      console.log('EnhancedColorPicker handleInputChange:', { name, newValue });
      setInputValue(newValue);
      onChange(newValue);
    },
    [onChange, name],
  );

  const handleColorChange = useCallback(
    (newColor: string) => {
      console.log('EnhancedColorPicker handleColorChange:', { name, newColor });
      setInputValue(newColor);
      onChange(newColor);
    },
    [onChange, name],
  );

  return (
    <div className="mb-3">
      <div className="mb-1.5 flex items-center justify-between">
        <Label htmlFor={`color-${name}`} className="text-xs font-medium">
          {label}
        </Label>
      </div>
      <div className="relative flex items-center gap-1">
        <div
          className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded border"
          style={{ backgroundColor: color }}
        >
          <input
            type="color"
            id={`color-${name}`}
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="bg-input/25 border-border/20 h-8 flex-1 rounded border px-2 text-sm"
          placeholder="Enter color (hex)"
        />
        <ColorSelectorPopover currentColor={color} onChange={onChange} />
      </div>
      {description && (
        <p className="text-muted-foreground text-xs mt-1">{description}</p>
      )}
    </div>
  );
}

export function ThemeEditor() {
  const {
    theme,
    isDarkMode,
    toggleThemeMode,
    applyTheme,
    refreshTheme,
    updateThemeColors,
  } = useCompanyTheme();
  const [activeTab, setActiveTab] = useState<
    'colors' | 'typography' | 'brand' | 'other'
  >('colors');
  const [lightColors, setLightColors] = useState<Record<string, string>>({});
  const [darkColors, setDarkColors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [originalLightColors, setOriginalLightColors] = useState<
    Record<string, string>
  >({});
  const [originalDarkColors, setOriginalDarkColors] = useState<
    Record<string, string>
  >({});
  const [isInitialized, setIsInitialized] = useState(false);

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
      const newLightColors: Record<string, string> = {};
      const newDarkColors: Record<string, string> = {};

      // Load light mode colors from actual theme
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

      // Load colors from the new theme
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

  // Handle color changes with proper theme mode consideration
  const handleColorChange = useCallback(
    (colorName: string, newValue: string) => {
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
    [isDarkMode],
  ); // Removed updateThemeColors from deps

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

      const createThemeMutation = trpc.theme.createTheme.useMutation(); // TODO: Implement this

      await createThemeMutation.mutateAsync({
        name: themeName,
        companyId: theme.companyId,
        createdById: 'default-user', // TODO: Get from auth
        lightModeConfig: lightColors,
        darkModeConfig: darkColors,
        isDefault: false,
      });

      // Update original colors to reflect saved state
      setOriginalLightColors(lightColors);
      setOriginalDarkColors(darkColors);

      toast.success('Theme saved successfully!');
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
                        value as 'colors' | 'typography' | 'brand' | 'other',
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
                          value="other"
                          className="rounded-full px-4 py-1"
                        >
                          Other
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent
                      value="colors"
                      className="mt-1 size-full overflow-hidden"
                    >
                      <ScrollArea className="h-[600px] px-4">
                        {colorSections.map((section) => (
                          <ControlSection
                            key={section.title}
                            title={section.title}
                            expanded={section.expanded}
                          >
                            {section.colors.map((color) => (
                              <EnhancedColorPicker
                                key={color.name}
                                name={color.name}
                                color={currentColors[color.name] || color.value}
                                onChange={(newValue) =>
                                  handleColorChange(color.name, newValue)
                                }
                                label={color.displayName}
                                description={color.description}
                              />
                            ))}
                          </ControlSection>
                        ))}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="typography"
                      className="mt-1 size-full overflow-hidden"
                    >
                      <ScrollArea className="h-[600px] px-4">
                        <div className="bg-muted/50 mb-4 flex items-start gap-2.5 rounded-md border p-3">
                          <AlertCircle className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                          <div className="text-muted-foreground text-sm">
                            <p>
                              Typography controls coming soon. Font family,
                              letter spacing, and other typography settings will
                              be available here.
                            </p>
                          </div>
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="brand"
                      className="mt-1 size-full overflow-hidden"
                    >
                        <ScrollArea className="h-[600px] px-4">
                          <BrandEditor />
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="other"
                      className="mt-1 size-full overflow-hidden"
                    >
                      <ScrollArea className="h-[600px] px-4">
                        <div className="bg-muted/50 mb-4 flex items-start gap-2.5 rounded-md border p-3">
                          <AlertCircle className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                          <div className="text-muted-foreground text-sm">
                            <p>
                              Other controls coming soon. Border radius,
                              spacing, shadows, and other design controls will
                              be available here.
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
