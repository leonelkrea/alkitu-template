import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Monitor, Tablet, Smartphone, Tv, Save, RotateCcw, Download, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { CornerRadiusEditor } from "./CornerRadiusEditor";

// Breakpoints
const BREAKPOINTS = [
  { key: 'tv', name: 'TV', icon: Tv, minWidth: 1920, color: 'bg-purple-500' },
  { key: 'desktop', name: 'Desktop', icon: Monitor, minWidth: 1024, color: 'bg-blue-500' },
  { key: 'tablet', name: 'Tablet', icon: Tablet, minWidth: 768, color: 'bg-green-500' },
  { key: 'mobile', name: 'Mobile', icon: Smartphone, minWidth: 0, color: 'bg-orange-500' }
] as const;

// Valores predefindos de radius (px)
const RADIUS_VALUES = [0, 2, 4, 6, 8, 12, 16, 24, 32, 9999]; // 9999 representa "full"

// Tamaños de radius Tailwind
const RADIUS_SIZES = [
  { key: 'xs', name: 'xs', description: '0.125rem' },
  { key: 'sm', name: 'sm', description: '0.25rem' },
  { key: 'md', name: 'md', description: '0.375rem' },
  { key: 'lg', name: 'lg', description: '0.5rem' },
  { key: 'xl', name: 'xl', description: '0.75rem' },
  { key: '2xl', name: '2xl', description: '1rem' },
  { key: '3xl', name: '3xl', description: '1.5rem' },
  { key: '4xl', name: '4xl', description: '2rem' },
] as const;

// Todas las variantes de rounded para preview
const ROUNDED_VARIANTS = [
  { key: 'rounded', name: 'All', description: 'rounded', corners: ['tl', 'tr', 'bl', 'br'] },
  { key: 'rounded-t', name: 'Top', description: 'rounded-t', corners: ['tl', 'tr'] },
  { key: 'rounded-r', name: 'Right', description: 'rounded-r', corners: ['tr', 'br'] },
  { key: 'rounded-b', name: 'Bottom', description: 'rounded-b', corners: ['bl', 'br'] },
  { key: 'rounded-l', name: 'Left', description: 'rounded-l', corners: ['tl', 'bl'] },
  { key: 'rounded-tl', name: 'Top Left', description: 'rounded-tl', corners: ['tl'] },
  { key: 'rounded-tr', name: 'Top Right', description: 'rounded-tr', corners: ['tr'] },
  { key: 'rounded-br', name: 'Bottom Right', description: 'rounded-br', corners: ['br'] },
  { key: 'rounded-bl', name: 'Bottom Left', description: 'rounded-bl', corners: ['bl'] },
] as const;

type BreakpointKey = typeof BREAKPOINTS[number]['key'];
type RadiusKey = typeof RADIUS_SIZES[number]['key'];

// Estado global de radius por breakpoint
type GlobalRadiusState = {
  [K in BreakpointKey]: {
    [R in RadiusKey]: number; // valor en px
  }
}

interface GlobalRadiusEditorProps {
  onChange?: (state: GlobalRadiusState) => void;
  onSave?: (state: GlobalRadiusState) => void;
}

export const GlobalRadiusEditor = ({ onChange, onSave }: GlobalRadiusEditorProps) => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<BreakpointKey>('desktop');
  const [previewSize, setPreviewSize] = useState<RadiusKey>('lg');
  const [showCornerEditor, setShowCornerEditor] = useState(false);
  
  // Estado inicial con valores por defecto
  const [globalState, setGlobalState] = useState<GlobalRadiusState>(() => {
    const defaultValues = { xs: 2, sm: 4, md: 6, lg: 8, xl: 12, '2xl': 16, '3xl': 24, '4xl': 32 };
    const initialState = {} as GlobalRadiusState;
    
    BREAKPOINTS.forEach(bp => {
      initialState[bp.key] = { ...defaultValues };
    });
    
    return initialState;
  });

  // Función para obtener el estilo de border-radius para una variante específica
  const getVariantStyle = useCallback((variant: typeof ROUNDED_VARIANTS[number], radiusValue: number) => {
    const radius = radiusValue === 9999 ? '50%' : `${radiusValue}px`;
    const style: React.CSSProperties = {};
    
    variant.corners.forEach(corner => {
      switch (corner) {
        case 'tl': style.borderTopLeftRadius = radius; break;
        case 'tr': style.borderTopRightRadius = radius; break;
        case 'bl': style.borderBottomLeftRadius = radius; break;
        case 'br': style.borderBottomRightRadius = radius; break;
      }
    });
    
    return style;
  }, []);

  // Actualizar valor específico
  const updateRadiusValue = (breakpoint: BreakpointKey, size: RadiusKey, value: number) => {
    setGlobalState(prev => ({
      ...prev,
      [breakpoint]: {
        ...prev[breakpoint],
        [size]: value
      }
    }));
  };

  // Aplicar valor a todos los tamaños del breakpoint actual
  const applyToAllSizes = (value: number) => {
    setGlobalState(prev => {
      const newSizes = {} as GlobalRadiusState[BreakpointKey];
      RADIUS_SIZES.forEach(size => {
        newSizes[size.key] = value;
      });
      
      return {
        ...prev,
        [activeBreakpoint]: newSizes
      };
    });
  };

  // Reset a valores por defecto
  const resetToDefaults = () => {
    const defaultValues = { xs: 2, sm: 4, md: 6, lg: 8, xl: 12, '2xl': 16, '3xl': 24, '4xl': 32 };
    setGlobalState(prev => ({
      ...prev,
      [activeBreakpoint]: { ...defaultValues }
    }));
  };

  // Exportar CSS completo
  const exportCSS = () => {
    let css = '/* Border Radius System - Generated by Alkitu Theme Editor */\n\n';
    
    BREAKPOINTS.forEach(bp => {
      css += `/* ${bp.name} - ${bp.minWidth}px+ */\n`;
      css += `@media (min-width: ${bp.minWidth}px) {\n`;
      css += '  :root {\n';
      
      RADIUS_SIZES.forEach(size => {
        const value = globalState[bp.key][size.key];
        const cssValue = value === 9999 ? 'calc(infinity * 1px)' : `${(value / 16).toFixed(3)}rem`;
        css += `    --radius-${size.key}: ${cssValue}; /* ${value === 9999 ? 'full' : `${value}px`} */\n`;
      });
      
      css += '  }\n';
      css += '}\n\n';
    });

    // Crear y descargar archivo
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'radius-system.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Aplicar CSS variables en tiempo real
  const applyCSSVariables = useCallback((state: GlobalRadiusState) => {
    const root = document.documentElement;
    
    // Aplicar variables para el breakpoint activo
    const breakpointState = state[activeBreakpoint];
    RADIUS_SIZES.forEach(size => {
      const value = breakpointState[size.key];
      const cssValue = value === 9999 ? 'calc(infinity * 1px)' : `${(value / 16).toFixed(3)}rem`;
      root.style.setProperty(`--radius-${size.key}`, cssValue);
    });
  }, [activeBreakpoint]);

  // Notificar cambios y aplicar CSS variables
  useEffect(() => {
    applyCSSVariables(globalState);
    onChange?.(globalState);
  }, [globalState, onChange, applyCSSVariables]);

  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-2xl font-bold">Sistema Global de Border Radius</h2>
        <p className="text-muted-foreground">
          Define valores globales por breakpoint. Todas las clases Tailwind usarán estos valores.
        </p>
      </div>

      {/* Selector de Breakpoint */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Breakpoint Activo</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={resetToDefaults}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button size="sm" variant="outline" onClick={exportCSS}>
                <Download className="w-4 h-4 mr-1" />
                Export CSS
              </Button>
              <Button 
                size="sm" 
                variant={showCornerEditor ? "default" : "outline"}
                onClick={() => setShowCornerEditor(!showCornerEditor)}
              >
                <Settings className="w-4 h-4 mr-1" />
                Editor Granular
              </Button>
              <Button size="sm" onClick={() => onSave?.(globalState)}>
                <Save className="w-4 h-4 mr-1" />
                Guardar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {BREAKPOINTS.map((bp) => {
              const Icon = bp.icon;
              return (
                <Button
                  key={bp.key}
                  variant={activeBreakpoint === bp.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveBreakpoint(bp.key)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {bp.name}
                  <Badge variant="secondary" className="text-xs">
                    {bp.minWidth}px+
                  </Badge>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selector de Valores Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Valores Rápidos - Aplicar a Todos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {RADIUS_VALUES.map(value => (
              <Button
                key={value}
                variant="outline"
                size="sm"
                onClick={() => applyToAllSizes(value)}
                className="flex items-center gap-2"
              >
                <div 
                  className="w-4 h-4 bg-primary"
                  style={{ borderRadius: value === 9999 ? '50%' : `${value}px` }}
                />
                {value === 9999 ? 'Full' : `${value}px`}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor de Valores por Tamaño */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Valores por Tamaño - {BREAKPOINTS.find(bp => bp.key === activeBreakpoint)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RADIUS_SIZES.map(size => (
              <div key={size.key} className="space-y-2">
                <div className="text-center">
                  <div className="text-sm font-medium">--radius-{size.key}</div>
                  <div className="text-xs text-muted-foreground">{size.description}</div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {RADIUS_VALUES.map(value => {
                    const isActive = globalState[activeBreakpoint][size.key] === value;
                    return (
                      <Button
                        key={value}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateRadiusValue(activeBreakpoint, size.key, value)}
                        className="h-8 px-2 text-xs"
                      >
                        {value === 9999 ? 'F' : value}
                      </Button>
                    );
                  })}
                </div>
                
                <div className="flex justify-center">
                  <div
                    className="w-8 h-8 bg-primary"
                    style={{ borderRadius: globalState[activeBreakpoint][size.key] === 9999 ? '50%' : `${globalState[activeBreakpoint][size.key]}px` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vista Previa de Todas las Variantes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Vista Previa - Todas las Clases Tailwind</span>
            <div className="flex gap-2">
              <span className="text-xs text-muted-foreground">Previsualizar con:</span>
              <select 
                value={previewSize}
                onChange={(e) => setPreviewSize(e.target.value as RadiusKey)}
                className="text-xs border rounded px-2 py-1"
              >
                {RADIUS_SIZES.map(size => (
                  <option key={size.key} value={size.key}>
                    {size.key} ({globalState[activeBreakpoint][size.key]}px)
                  </option>
                ))}
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {ROUNDED_VARIANTS.map(variant => (
              <div key={variant.key} className="text-center space-y-2">
                <div className="text-xs font-medium">{variant.name}</div>
                <div
                  className="w-16 h-16 bg-primary mx-auto"
                  style={getVariantStyle(variant, globalState[activeBreakpoint][previewSize])}
                />
                <div className="text-xs text-muted-foreground font-mono">
                  {variant.description}-{previewSize}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ejemplos de Componentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Ejemplos de Componentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Botones */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Botones</div>
              <div className="space-y-2">
                {['sm', 'md', 'lg'].map(size => (
                  <Button
                    key={size}
                    variant="outline"
                    size="sm"
                    style={{ borderRadius: `${globalState[activeBreakpoint][size as RadiusKey]}px` }}
                  >
                    Button rounded-{size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Cards</div>
              <div className="space-y-2">
                {['md', 'lg', 'xl'].map(size => (
                  <div
                    key={size}
                    className="p-3 border bg-card text-card-foreground"
                    style={{ borderRadius: `${globalState[activeBreakpoint][size as RadiusKey]}px` }}
                  >
                    <div className="text-xs">Card rounded-{size}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSS Output */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">CSS Variables Generadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded text-xs font-mono space-y-1 max-h-60 overflow-y-auto">
            <div>/* Breakpoint: {BREAKPOINTS.find(bp => bp.key === activeBreakpoint)?.name} - {BREAKPOINTS.find(bp => bp.key === activeBreakpoint)?.minWidth}px+ */</div>
            <div>@media (min-width: {BREAKPOINTS.find(bp => bp.key === activeBreakpoint)?.minWidth}px) {"{"}</div>
            <div className="pl-4">:root {"{"}</div>
            {RADIUS_SIZES.map(size => {
              const value = globalState[activeBreakpoint][size.key];
              const cssValue = value === 9999 ? 'calc(infinity * 1px)' : `${(value / 16).toFixed(3)}rem`;
              return (
                <div key={size.key} className="pl-8">
                  --radius-{size.key}: {cssValue}; /* {value === 9999 ? 'full' : `${value}px`} */
                </div>
              );
            })}
            <div className="pl-4">{"}"}</div>
            <div>{"}"}</div>
          </div>
        </CardContent>
      </Card>

      {/* Editor Granular de Esquinas (Condicional) */}
      {showCornerEditor && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Editor Granular de Esquinas</CardTitle>
          </CardHeader>
          <CardContent>
            <CornerRadiusEditor
              globalValues={globalState}
              onChange={(cornerState) => {
                console.log('Corner state changed:', cornerState);
                // TODO: Integrar con el estado global si es necesario
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};