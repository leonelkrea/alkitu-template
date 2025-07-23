'use client';

import React, { useState, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Button, 
  Typography, 
  Icon, 
  Badge as AtomBadge, 
  Input, 
  Avatar, 
  Spinner, 
  Chip
} from '@/components/atomic-design/atoms';
import { Brand } from '@/components/atomic-design/atoms/brands';
import { useBrandConfig } from './BrandContext';
import { ServiceCard, RequestCard } from '@/components/atomic-design/molecules';
import { cn } from '@/lib/utils';

interface ThemePreviewContentProps {
  className?: string;
}

// Component definitions for search and filtering
const componentDefinitions = {
  atoms: [
    { name: 'Brand', description: 'Complete brand identity system with variants, states, and customization options' },
    { name: 'Typography', description: 'Text components with different variants and styles' },
    { name: 'Buttons', description: 'Interactive button components with different variants' },
    { name: 'Icons', description: 'Icon library with categories and variants' },
    { name: 'Badges', description: 'Status indicators and labels' },
    { name: 'Inputs', description: 'Form input fields with validation states' },
    { name: 'Avatars', description: 'User profile images with fallbacks' },
    { name: 'Spinners', description: 'Loading indicators' },
    { name: 'Chips', description: 'Selectable and deletable tags' }
  ],
  molecules: [
    { name: 'Service Cards', description: 'Cards displaying service information' },
    { name: 'Request Cards', description: 'Cards for request management' },
    { name: 'Form Fields', description: 'Complex form elements built from atoms' }
  ],
  organisms: [
    { name: 'Navigation', description: 'Navigation bars and menus' },
    { name: 'Data Tables', description: 'Complex data display tables' },
    { name: 'Forms', description: 'Complete form layouts' },
    { name: 'Dashboard Widgets', description: 'Dashboard component widgets' }
  ]
};

// Block definitions for search and filtering
const blockDefinitions = [
  { name: 'Header', description: 'Dashboard header with title and actions' },
  { name: 'Stats Cards', description: 'Statistics dashboard with metrics cards' },
  { name: 'Activity Table', description: 'Recent activity table with user actions' }
];

// Icon categories for the library showcase
const iconCategories = {
  navigation: [
    'homeIcon', 'usersIcon', 'userIcon', 'settingsIcon', 'searchIcon', 'filterIcon', 'menuIcon',
    'arrowRightIcon', 'arrowLeftIcon', 'arrowUpIcon', 'arrowDownIcon', 'chevronUpIcon', 'chevronDownIcon',
    'chevronLeftIcon', 'chevronRightIcon', 'layoutIcon', 'sidebarIcon', 'layersIcon'
  ],
  actions: [
    'plusIcon', 'minusIcon', 'xIcon', 'checkIcon', 'editIcon', 'trashIcon', 'saveIcon', 'copyIcon',
    'shareIcon', 'downloadIcon', 'uploadIcon', 'refreshCwIcon', 'playIcon', 'pauseIcon', 'stopIcon',
    'maximizeIcon', 'minimizeIcon', 'moveIcon', 'rotateCcwIcon', 'rotateCwIcon'
  ],
  content: [
    'folderIcon', 'folderOpenIcon', 'fileIcon', 'filesIcon', 'fileTextIcon', 'fileCodeIcon',
    'imageIcon', 'videoIcon', 'musicIcon', 'bookOpenIcon', 'typeIcon', 'boldIcon', 'italicIcon',
    'underlineIcon', 'alignLeftIcon', 'alignCenterIcon', 'alignRightIcon', 'alignJustifyIcon'
  ],
  communication: [
    'mailIcon', 'phoneIcon', 'bellIcon', 'linkIcon', 'unlinkIcon', 'externalLinkIcon',
    'globeIcon', 'wifiIcon', 'cloudIcon'
  ],
  media: [
    'eyeIcon', 'volume2Icon', 'volumeXIcon', 'cameraIcon', 'videoIcon', 'imageIcon', 'musicIcon'
  ],
  system: [
    'lockIcon', 'unlockIcon', 'shieldIcon', 'keyIcon', 'infoIcon', 'alertCircleIcon', 'alertTriangleIcon',
    'checkCircleIcon', 'spinnerIcon', 'monitorIcon', 'smartphoneIcon', 'databaseIcon', 'packageIcon',
    'rocketIcon', 'zapIcon', 'paletteIcon'
  ]
};

export const ThemePreviewContent: React.FC<ThemePreviewContentProps> = ({ className }) => {
  const [viewMode, setViewMode] = useState<'components' | 'blocks'>('components');
  const [componentSearch, setComponentSearch] = useState('');
  const [blockSearch, setBlockSearch] = useState('');
  
  // Now this should work because there's only one BrandProvider
  const { config: brandConfig } = useBrandConfig();
  console.log('ThemePreviewContent using context brandConfig:', brandConfig);

  // Filter components based on search
  const filteredComponents = React.useMemo(() => {
    if (!componentSearch.trim()) return componentDefinitions;
    
    const searchLower = componentSearch.toLowerCase();
    const filtered: typeof componentDefinitions = { atoms: [], molecules: [], organisms: [] };
    
    Object.entries(componentDefinitions).forEach(([category, components]) => {
      const matchingComponents = components.filter(component =>
        component.name.toLowerCase().includes(searchLower) ||
        component.description.toLowerCase().includes(searchLower)
      );
      filtered[category as keyof typeof componentDefinitions] = matchingComponents;
    });
    
    return filtered;
  }, [componentSearch]);

  // Filter blocks based on search
  const filteredBlocks = React.useMemo(() => {
    if (!blockSearch.trim()) return blockDefinitions;
    
    const searchLower = blockSearch.toLowerCase();
    return blockDefinitions.filter(block =>
      block.name.toLowerCase().includes(searchLower) ||
      block.description.toLowerCase().includes(searchLower)
    );
  }, [blockSearch]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h4">Theme Preview</Typography>
            <Typography variant="p" color="muted" className="mt-1">
              Preview how your theme looks with different components and layouts
            </Typography>
          </div>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as typeof viewMode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="blocks">Blocks</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          {viewMode === 'components' ? (
            <div className="relative flex-1 max-w-md">
              <Icon name="searchIcon" size="sm" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search components (atoms, molecules, organisms)..."
                value={componentSearch}
                onChange={(e) => setComponentSearch(e.target.value)}
                className="pl-10"
              />
              {componentSearch && (
                <button
                  onClick={() => setComponentSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Icon name="xIcon" size="sm" />
                </button>
              )}
            </div>
          ) : (
            <div className="relative flex-1 max-w-md">
              <Icon name="searchIcon" size="sm" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search blocks and layouts..."
                value={blockSearch}
                onChange={(e) => setBlockSearch(e.target.value)}
                className="pl-10"
              />
              {blockSearch && (
                <button
                  onClick={() => setBlockSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Icon name="xIcon" size="sm" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Component View */}
      {viewMode === 'components' && (
        <Tabs defaultValue="atoms" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="atoms">Atoms</TabsTrigger>
            <TabsTrigger value="molecules">Molecules</TabsTrigger>
            <TabsTrigger value="organisms">Organisms</TabsTrigger>
          </TabsList>

          {/* Atoms Tab */}
          <TabsContent value="atoms" className="space-y-6">
            {filteredComponents.atoms.length === 0 && (
              <Typography variant="p" color="muted" className="text-center py-8">
                No atomic components match your search criteria.
              </Typography>
            )}

            {/* Brand Section */}
            {filteredComponents.atoms.some(c => c.name === 'Brand') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Brand</CardTitle>
                <CardDescription>Comprehensive brand system with logos, text, colors, and interactive states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Layout Variants */}
                <div>
                  <Typography variant="p" className="mb-4 font-medium">Layout Variants</Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                        <Brand 
                          variant="horizontal" 
                          size="md" 
                          showTagline
                          useSystemColors={false}
                          brandName={brandConfig?.primaryText || "Alkitu"}
                          tagline={brandConfig?.secondaryText || "Design System"}
                          primaryTextColor={brandConfig?.primaryTextColor}
                          secondaryTextColor={brandConfig?.secondaryTextColor}
                          monochromeMode={brandConfig?.monochromeMode || "none"}
                          customSvg={brandConfig?.customSvg}
                          iconBackgroundColor={brandConfig?.iconBackgroundColor}
                          iconColor={brandConfig?.iconColor}
                        />
                      </div>
                      <div className="text-center">
                        <Typography variant="caption" className="font-medium">Horizontal</Typography>
                        <Typography variant="caption" color="muted" className="block text-xs">
                          Perfect for headers and navigation bars
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                        <Brand 
                          variant="vertical" 
                          size="md" 
                          showTagline
                          useSystemColors={false}
                          brandName={brandConfig?.primaryText || "Alkitu"}
                          tagline={brandConfig?.secondaryText || "Design System"}
                          primaryTextColor={brandConfig?.primaryTextColor}
                          secondaryTextColor={brandConfig?.secondaryTextColor}
                          monochromeMode={brandConfig?.monochromeMode || "none"}
                          customSvg={brandConfig?.customSvg}
                          iconBackgroundColor={brandConfig?.iconBackgroundColor}
                          iconColor={brandConfig?.iconColor}
                        />
                      </div>
                      <div className="text-center">
                        <Typography variant="caption" className="font-medium">Vertical</Typography>
                        <Typography variant="caption" color="muted" className="block text-xs">
                          Ideal for hero sections and splash screens
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                        <Brand 
                          variant="stacked" 
                          size="md" 
                          showTagline
                          useSystemColors={false}
                          brandName={brandConfig?.primaryText || "Alkitu"}
                          tagline={brandConfig?.secondaryText || "Design System"}
                          primaryTextColor={brandConfig?.primaryTextColor}
                          secondaryTextColor={brandConfig?.secondaryTextColor}
                          monochromeMode={brandConfig?.monochromeMode || "none"}
                          customSvg={brandConfig?.customSvg}
                          iconBackgroundColor={brandConfig?.iconBackgroundColor}
                          iconColor={brandConfig?.iconColor}
                        />
                      </div>
                      <div className="text-center">
                        <Typography variant="caption" className="font-medium">Stacked</Typography>
                        <Typography variant="caption" color="muted" className="block text-xs">
                          Left-aligned layout for sidebars
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                        <Brand 
                          variant="compact" 
                          size="md"
                          useSystemColors={false}
                          brandName={brandConfig?.primaryText || "Alkitu"}
                          primaryTextColor={brandConfig?.primaryTextColor}
                          monochromeMode={brandConfig?.monochromeMode || "none"}
                          customSvg={brandConfig?.customSvg}
                          iconBackgroundColor={brandConfig?.iconBackgroundColor}
                          iconColor={brandConfig?.iconColor}
                        />
                      </div>
                      <div className="text-center">
                        <Typography variant="caption" className="font-medium">Compact</Typography>
                        <Typography variant="caption" color="muted" className="block text-xs">
                          Space-efficient for constrained layouts
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                        <Brand 
                          variant="icon-only" 
                          size="md"
                          useSystemColors={false}
                          brandName={brandConfig?.primaryText || "Alkitu"}
                          primaryTextColor={brandConfig?.primaryTextColor}
                          monochromeMode={brandConfig?.monochromeMode || "none"}
                          customSvg={brandConfig?.customSvg}
                          iconBackgroundColor={brandConfig?.iconBackgroundColor}
                          iconColor={brandConfig?.iconColor}
                        />
                      </div>
                      <div className="text-center">
                        <Typography variant="caption" className="font-medium">Icon Only</Typography>
                        <Typography variant="caption" color="muted" className="block text-xs">
                          Minimal branding for tight spaces
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                        <Brand 
                          variant="text-only" 
                          size="md" 
                          showTagline
                          useSystemColors={false}
                          brandName={brandConfig?.primaryText || "Alkitu"}
                          tagline={brandConfig?.secondaryText || "Design System"}
                          primaryTextColor={brandConfig?.primaryTextColor}
                          secondaryTextColor={brandConfig?.secondaryTextColor}
                        />
                      </div>
                      <div className="text-center">
                        <Typography variant="caption" className="font-medium">Text Only</Typography>
                        <Typography variant="caption" color="muted" className="block text-xs">
                          Pure typography branding
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Size Scale */}
                <div>
                  <Typography variant="p" className="mb-4 font-medium">Size Scale</Typography>
                  <div className="space-y-4">
                    <div className="flex items-center gap-8 p-4 bg-muted/30 rounded-lg overflow-x-auto">
                      <div className="flex flex-col items-center gap-2 min-w-fit">
                        <Brand 
                          variant="horizontal" 
                          size="xs"
                          useSystemColors={false}
                          brandName={brandConfig?.primaryText || "Alkitu"}
                          primaryTextColor={brandConfig?.primaryTextColor}
                          monochromeMode={brandConfig?.monochromeMode || "none"}
                          customSvg={brandConfig?.customSvg}
                          iconBackgroundColor={brandConfig?.iconBackgroundColor}
                          iconColor={brandConfig?.iconColor}
                        />
                        <Typography variant="caption" color="muted" className="text-xs">XS</Typography>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 min-w-fit">
                        <Brand 
                          variant="horizontal" 
                          size="sm"
                          useSystemColors={false}
                          brandName={brandConfig?.primaryText || "Alkitu"}
                          primaryTextColor={brandConfig?.primaryTextColor}
                          monochromeMode={brandConfig?.monochromeMode || "none"}
                          customSvg={brandConfig?.customSvg}
                          iconBackgroundColor={brandConfig?.iconBackgroundColor}
                          iconColor={brandConfig?.iconColor}
                        />
                        <Typography variant="caption" color="muted" className="text-xs">SM</Typography>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 min-w-fit">
                        <Brand 
                          variant="horizontal" 
                          size="md"
                          useSystemColors={false}
                          brandName={brandConfig?.primaryText || "Alkitu"}
                          primaryTextColor={brandConfig?.primaryTextColor}
                          monochromeMode={brandConfig?.monochromeMode || "none"}
                          customSvg={brandConfig?.customSvg}
                          iconBackgroundColor={brandConfig?.iconBackgroundColor}
                          iconColor={brandConfig?.iconColor}
                        />
                        <Typography variant="caption" color="muted" className="text-xs font-medium">MD (Default)</Typography>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 min-w-fit">
                        <Brand 
                          variant="horizontal" 
                          size="lg"
                          useSystemColors={false}
                          brandName={brandConfig?.primaryText || "Alkitu"}
                          primaryTextColor={brandConfig?.primaryTextColor}
                          monochromeMode={brandConfig?.monochromeMode || "none"}
                          customSvg={brandConfig?.customSvg}
                          iconBackgroundColor={brandConfig?.iconBackgroundColor}
                          iconColor={brandConfig?.iconColor}
                        />
                        <Typography variant="caption" color="muted" className="text-xs">LG</Typography>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 min-w-fit">
                        <Brand 
                          variant="horizontal" 
                          size="xl"
                          useSystemColors={false}
                          brandName={brandConfig?.primaryText || "Alkitu"}
                          primaryTextColor={brandConfig?.primaryTextColor}
                          monochromeMode={brandConfig?.monochromeMode || "none"}
                          customSvg={brandConfig?.customSvg}
                          iconBackgroundColor={brandConfig?.iconBackgroundColor}
                          iconColor={brandConfig?.iconColor}
                        />
                        <Typography variant="caption" color="muted" className="text-xs">XL</Typography>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Interactive States */}
                <div>
                  <Typography variant="p" className="mb-4 font-medium">Interactive States</Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Typography variant="caption" color="muted" className="mb-2 block">Static (Default)</Typography>
                        <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                          <Brand 
                            variant="horizontal" 
                            size="md" 
                            showTagline
                            useSystemColors={false}
                            brandName={brandConfig?.primaryText || "Alkitu"}
                            tagline={brandConfig?.secondaryText || "Design System"}
                            primaryTextColor={brandConfig?.primaryTextColor}
                            secondaryTextColor={brandConfig?.secondaryTextColor}
                            monochromeMode={brandConfig?.monochromeMode || "none"}
                            customSvg={brandConfig?.customSvg}
                            iconBackgroundColor={brandConfig?.iconBackgroundColor}
                            iconColor={brandConfig?.iconColor}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Typography variant="caption" color="muted" className="mb-2 block">Clickable (Hover to see effect)</Typography>
                        <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                          <Brand 
                            variant="horizontal" 
                            size="md" 
                            showTagline
                            clickable
                            useSystemColors={false}
                            brandName={brandConfig?.primaryText || "Alkitu"}
                            tagline={brandConfig?.secondaryText || "Design System"}
                            primaryTextColor={brandConfig?.primaryTextColor}
                            secondaryTextColor={brandConfig?.secondaryTextColor}
                            monochromeMode={brandConfig?.monochromeMode || "none"}
                            customSvg={brandConfig?.customSvg}
                            iconBackgroundColor={brandConfig?.iconBackgroundColor}
                            iconColor={brandConfig?.iconColor}
                            onClick={() => {}}
                          />
                        </div>
                        <Typography variant="caption" color="muted" className="text-xs mt-1 block">
                          ↗️ Includes hover scale and opacity transitions
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Typography variant="caption" color="muted" className="mb-2 block">SVG Monochrome - White</Typography>
                        <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-center">
                          <Brand 
                            variant="horizontal" 
                            size="md" 
                            showTagline
                            useSystemColors={false}
                            brandName={brandConfig?.primaryText || "Alkitu"}
                            tagline={brandConfig?.secondaryText || "Design System"}
                            primaryTextColor="#ffffff"
                            secondaryTextColor="#e2e8f0"
                            monochromeMode="white"
                            customSvg={brandConfig?.customSvg}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Typography variant="caption" color="muted" className="mb-2 block">SVG Monochrome - Black</Typography>
                        <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-center">
                          <Brand 
                            variant="horizontal" 
                            size="md" 
                            showTagline
                            useSystemColors={false}
                            brandName={brandConfig?.primaryText || "Alkitu"}
                            tagline={brandConfig?.secondaryText || "Design System"}
                            primaryTextColor="#1e293b"
                            secondaryTextColor="#64748b"
                            monochromeMode="black"
                            customSvg={brandConfig?.customSvg}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Live Configuration Preview */}
                <div>
                  <Typography variant="p" className="mb-4 font-medium">Live Configuration Preview</Typography>
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6 border-2 border-dashed border-primary/20">
                    <div className="flex items-center justify-center">
                      <Brand 
                        variant="horizontal" 
                        size="lg" 
                        showTagline
                        clickable
                        useSystemColors={false}
                        brandName={brandConfig?.primaryText || "Alkitu"}
                        tagline={brandConfig?.secondaryText || "Design System"}
                        primaryTextColor={brandConfig?.primaryTextColor}
                        secondaryTextColor={brandConfig?.secondaryTextColor}
                        monochromeMode={brandConfig?.monochromeMode || "none"}
                        customSvg={brandConfig?.customSvg}
                        iconBackgroundColor={brandConfig?.iconBackgroundColor}
                        iconColor={brandConfig?.iconColor}
                        onClick={() => {}}
                      />
                    </div>
                    <Typography variant="caption" color="muted" className="text-center block mt-4">
                      🎨 This preview updates automatically as you modify brand settings in the Theme Editor
                    </Typography>
                  </div>
                </div>

              </CardContent>
            </Card>
            )}

            {/* Typography Section */}
            {filteredComponents.atoms.some(c => c.name === 'Typography') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Typography</CardTitle>
                <CardDescription>Text components with different variants and styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Typography variant="h1">Heading 1</Typography>
                  <Typography variant="h2">Heading 2</Typography>
                  <Typography variant="h3">Heading 3</Typography>
                  <Typography variant="h4">Heading 4</Typography>
                  <Typography variant="p">This is a paragraph with regular text content.</Typography>
                  <Typography variant="lead">This is a lead paragraph that stands out.</Typography>
                  <Typography variant="caption" color="muted">Caption text for additional information</Typography>
                  <Typography variant="overline">Overline Text</Typography>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="p" className="mb-2 font-medium">Colors:</Typography>
                    <div className="space-y-1">
                      <Typography color="foreground">Foreground</Typography>
                      <Typography color="muted">Muted</Typography>
                      <Typography color="primary">Primary</Typography>
                      <Typography color="secondary">Secondary</Typography>
                      <Typography color="destructive">Destructive</Typography>
                    </div>
                  </div>
                  <div>
                    <Typography variant="p" className="mb-2 font-medium">Weights:</Typography>
                    <div className="space-y-1">
                      <Typography weight="light">Light</Typography>
                      <Typography weight="normal">Normal</Typography>
                      <Typography weight="medium">Medium</Typography>
                      <Typography weight="semibold">Semibold</Typography>
                      <Typography weight="bold">Bold</Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}


            {/* Buttons Section */}
            {filteredComponents.atoms.some(c => c.name === 'Buttons') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Buttons</CardTitle>
                <CardDescription>Interactive button components with different variants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Typography variant="p" className="mb-3 font-medium">Variants:</Typography>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Typography variant="p" className="mb-3 font-medium">Sizes:</Typography>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Typography variant="p" className="mb-3 font-medium">With Icons:</Typography>
                  <div className="flex flex-wrap gap-3">
                    <Button icon="plusIcon">Add Item</Button>
                    <Button variant="outline" icon="downloadIcon">Download</Button>
                    <Button variant="secondary" icon="arrowRightIcon" iconPosition="right">Continue</Button>
                    <Button variant="ghost" icon="editIcon">Edit</Button>
                    <Button variant="destructive" icon="trashIcon">Delete</Button>
                    <Button variant="outline" icon="shareIcon">Share</Button>
                    <Button variant="primary" icon="saveIcon">Save</Button>
                    <Button variant="secondary" icon="copyIcon">Copy</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Typography variant="p" className="mb-3 font-medium">States:</Typography>
                  <div className="flex flex-wrap gap-3">
                    <Button loading>Loading...</Button>
                    <Button disabled>Disabled</Button>
                    <Button fullWidth>Full Width</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Icons Section */}
            {filteredComponents.atoms.some(c => c.name === 'Icons') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Icons</CardTitle>
                <CardDescription>Icon library with categories and variants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="p" className="font-medium">Icon Library:</Typography>
                  <Typography variant="caption" color="muted">
                    {Object.values(iconCategories).reduce((total, icons) => total + icons.length, 0)} icons available
                  </Typography>
                </div>
                
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="navigation">Navigation</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="communication" className="hidden lg:inline-flex">Communication</TabsTrigger>
                    <TabsTrigger value="media" className="hidden lg:inline-flex">Media</TabsTrigger>
                    <TabsTrigger value="system" className="hidden lg:inline-flex">System</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                      {Object.values(iconCategories).flatMap((icons) =>
                        icons.map((iconName) => (
                          <div key={iconName} className="flex flex-col items-center p-2 rounded-md hover:bg-muted transition-colors group text-foreground">
                            <Icon name={iconName} size="md" className="mb-1" />
                            <Typography variant="caption" className="text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
                              {iconName.replace('Icon', '')}
                            </Typography>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {Object.entries(iconCategories).map(([categoryKey, icons]) => (
                    <TabsContent key={categoryKey} value={categoryKey} className="mt-4">
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                        {icons.map((iconName) => (
                          <div key={iconName} className="flex flex-col items-center p-2 rounded-md hover:bg-muted transition-colors group text-foreground">
                            <Icon name={iconName} size="md" className="mb-1" />
                            <Typography variant="caption" className="text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
                              {iconName.replace('Icon', '')}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
            )}

            {/* Badges Section */}
            {filteredComponents.atoms.some(c => c.name === 'Badges') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Badges</CardTitle>
                <CardDescription>Status indicators and labels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Typography variant="p" className="mb-3 font-medium">Variants:</Typography>
                  <div className="flex flex-wrap gap-3">
                    <AtomBadge variant="default">Default</AtomBadge>
                    <AtomBadge variant="secondary">Secondary</AtomBadge>
                    <AtomBadge variant="success">Success</AtomBadge>
                    <AtomBadge variant="warning">Warning</AtomBadge>
                    <AtomBadge variant="error">Error</AtomBadge>
                    <AtomBadge variant="outline">Outline</AtomBadge>
                  </div>
                </div>

                <Separator />

                <div>
                  <Typography variant="p" className="mb-3 font-medium">Sizes:</Typography>
                  <div className="flex flex-wrap items-center gap-3">
                    <AtomBadge size="sm">Small</AtomBadge>
                    <AtomBadge size="md">Medium</AtomBadge>
                    <AtomBadge size="lg">Large</AtomBadge>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Inputs Section */}
            {filteredComponents.atoms.some(c => c.name === 'Inputs') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inputs</CardTitle>
                <CardDescription>Form input fields with validation states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Typography variant="p" className="mb-3 font-medium">Basic Inputs:</Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Default input" />
                    <Input placeholder="With label" label="Email" />
                  </div>
                </div>

                <Separator />

                <div>
                  <Typography variant="p" className="mb-3 font-medium">States:</Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Disabled input" disabled />
                    <Input placeholder="With error" error="This field is required" />
                  </div>
                </div>

                <Separator />

                <div>
                  <Typography variant="p" className="mb-3 font-medium">With Helper Text:</Typography>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Password" 
                      type="password" 
                      label="Password"
                      helperText="Must be at least 8 characters long"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Avatars Section */}
            {filteredComponents.atoms.some(c => c.name === 'Avatars') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avatars</CardTitle>
                <CardDescription>User profile images with fallbacks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Typography variant="p" className="mb-3 font-medium">Sizes:</Typography>
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" src="" alt="Small avatar" />
                    <Avatar size="md" src="" alt="Medium avatar" />
                    <Avatar size="lg" src="" alt="Large avatar" />
                    <Avatar size="xl" src="" alt="Extra large avatar" />
                  </div>
                </div>

                <Separator />

                <div>
                  <Typography variant="p" className="mb-3 font-medium">Variants:</Typography>
                  <div className="flex items-center gap-3">
                    <Avatar variant="circular" src="" alt="Circular avatar" />
                    <Avatar variant="rounded" src="" alt="Rounded avatar" />
                    <Avatar variant="square" src="" alt="Square avatar" />
                  </div>
                </div>

                <Separator />

                <div>
                  <Typography variant="p" className="mb-3 font-medium">With Fallback:</Typography>
                  <div className="flex items-center gap-3">
                    <Avatar src="" alt="John Doe" fallback="JD" />
                    <Avatar src="" alt="Jane Smith" fallback="JS" />
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Spinners Section */}
            {filteredComponents.atoms.some(c => c.name === 'Spinners') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spinners</CardTitle>
                <CardDescription>Loading indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Typography variant="p" className="mb-3 font-medium">Sizes:</Typography>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Spinner size="sm" />
                      <Typography variant="caption">Small</Typography>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Spinner size="md" />
                      <Typography variant="caption">Medium</Typography>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Spinner size="lg" />
                      <Typography variant="caption">Large</Typography>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Spinner size="xl" />
                      <Typography variant="caption">Extra Large</Typography>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Typography variant="p" className="mb-3 font-medium">Variants:</Typography>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Spinner variant="default" />
                      <Typography variant="caption">Default</Typography>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Spinner variant="primary" />
                      <Typography variant="caption">Primary</Typography>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Spinner variant="secondary" />
                      <Typography variant="caption">Secondary</Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Chips Section */}
            {filteredComponents.atoms.some(c => c.name === 'Chips') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chips</CardTitle>
                <CardDescription>Selectable and deletable tags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Typography variant="p" className="mb-3 font-medium">Variants:</Typography>
                  <div className="flex flex-wrap gap-3">
                    <Chip variant="default">Default</Chip>
                    <Chip variant="primary">Primary</Chip>
                    <Chip variant="secondary">Secondary</Chip>
                    <Chip variant="success">Success</Chip>
                    <Chip variant="warning">Warning</Chip>
                    <Chip variant="error">Error</Chip>
                    <Chip variant="outline">Outline</Chip>
                  </div>
                </div>

                <Separator />

                <div>
                  <Typography variant="p" className="mb-3 font-medium">Interactive:</Typography>
                  <div className="flex flex-wrap gap-3">
                    <Chip deletable onDelete={() => {}}>Deletable</Chip>
                    <Chip onClick={() => {}} selected>Selected</Chip>
                    <Chip onClick={() => {}}>Clickable</Chip>
                    <Chip disabled>Disabled</Chip>
                  </div>
                </div>

                <Separator />

                <div>
                  <Typography variant="p" className="mb-3 font-medium">Sizes:</Typography>
                  <div className="flex flex-wrap items-center gap-3">
                    <Chip size="sm">Small</Chip>
                    <Chip size="md">Medium</Chip>
                    <Chip size="lg">Large</Chip>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

          </TabsContent>

          {/* Molecules Tab */}
          <TabsContent value="molecules" className="space-y-6">
            {filteredComponents.molecules.length === 0 && (
              <Typography variant="p" color="muted" className="text-center py-8">
                No molecular components match your search criteria.
              </Typography>
            )}
            {filteredComponents.molecules.some(c => c.name === 'Service Cards' || c.name === 'Request Cards') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cards</CardTitle>
                <CardDescription>Card components combining multiple atoms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ServiceCard
                    id="sample-1"
                    title="Sample Service"
                    description="This is a sample service card showing how multiple atoms work together."
                    status="active"
                    category="Web Development"
                    pricing="$99/month"
                    image=""
                  />
                  <RequestCard
                    id="sample-2"
                    title="Sample Request"
                    description="This is a sample request card demonstrating molecule composition."
                    status="pending"
                    requestType="Feature Request"
                    priority="high"
                    createdAt="2024-01-15"
                  />
                </div>
              </CardContent>
            </Card>
            )}

            {filteredComponents.molecules.some(c => c.name === 'Form Fields') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Form Components</CardTitle>
                <CardDescription>Complex form elements built from atoms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sample-input-1">Full Name</Label>
                    <Input id="sample-input-1" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sample-input-2">Email Address</Label>
                    <Input id="sample-input-2" type="email" placeholder="Enter your email" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="primary">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
            )}
          </TabsContent>

          {/* Organisms Tab */}
          <TabsContent value="organisms" className="space-y-6">
            {filteredComponents.organisms.length === 0 ? (
              <Typography variant="p" color="muted" className="text-center py-8">
                No organism components match your search criteria.
              </Typography>
            ) : (
              <Typography variant="p" color="muted" className="text-center py-8">
                Organism examples would include complex components like navigation bars, 
                data tables, forms, and dashboard widgets that combine multiple molecules.
              </Typography>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Blocks View */}
      {viewMode === 'blocks' && (
        <div className="space-y-6">
          {filteredBlocks.length === 0 && (
            <Typography variant="p" color="muted" className="text-center py-8">
              No blocks match your search criteria.
            </Typography>
          )}
          
          {/* Header Block */}
          {filteredBlocks.some(b => b.name === 'Header') && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h2">Dashboard Overview</Typography>
                  <Typography variant="p" color="muted">Welcome back! Here&apos;s what&apos;s happening.</Typography>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" icon="refreshCwIcon">Refresh</Button>
                  <Button variant="primary" icon="plusIcon">New Project</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Stats Block */}
          {filteredBlocks.some(b => b.name === 'Stats Cards') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="caption" color="muted">Total Users</Typography>
                    <Typography variant="h3">2,345</Typography>
                  </div>
                  <Icon name="usersIcon" size="lg" variant="primary" />
                </div>
                <Typography variant="caption" color="muted" className="flex items-center gap-1 mt-2">
                  <Icon name="trendingUpIcon" size="sm" variant="success" />
                  +12% from last month
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="caption" color="muted">Revenue</Typography>
                    <Typography variant="h3">$45,231</Typography>
                  </div>
                  <Icon name="dollarSignIcon" size="lg" variant="primary" />
                </div>
                <Typography variant="caption" color="muted" className="flex items-center gap-1 mt-2">
                  <Icon name="trendingUpIcon" size="sm" variant="success" />
                  +20% from last month
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="caption" color="muted">Active Projects</Typography>
                    <Typography variant="h3">12</Typography>
                  </div>
                  <Icon name="folderIcon" size="lg" variant="primary" />
                </div>
                <Typography variant="caption" color="muted" className="flex items-center gap-1 mt-2">
                  <Icon name="trendingDownIcon" size="sm" variant="warning" />
                  -2 from last month
                </Typography>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Table Block */}
          {filteredBlocks.some(b => b.name === 'Activity Table') && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions from your team</CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" src="" alt="User avatar" />
                      <div>
                        <Typography variant="p" className="font-medium">John Doe</Typography>
                        <Typography variant="caption" color="muted">Updated project settings</Typography>
                      </div>
                    </div>
                    <div className="text-right">
                      <AtomBadge variant="success">Completed</AtomBadge>
                      <Typography variant="caption" color="muted" className="block mt-1">2 hours ago</Typography>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          )}
        </div>
      )}
    </div>
  );
  };