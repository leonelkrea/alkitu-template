import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SliderWithInput } from "../ui/slider-with-input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Monitor, Tablet, Smartphone, Tv, Link, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";

// Breakpoints y sus iconos
const BREAKPOINTS = [
  { key: 'tv', name: 'TV', icon: Tv, minWidth: '1920px' },
  { key: 'desktop', name: 'Desktop', icon: Monitor, minWidth: '1024px' },
  { key: 'tablet', name: 'Tablet', icon: Tablet, minWidth: '768px' },
  { key: 'mobile', name: 'Mobile', icon: Smartphone, minWidth: '0px' }
] as const;

// Tamaños de radius disponibles
const RADIUS_SIZES = [
  { key: 'xs', name: 'xs', defaultValue: 2, min: 0, max: 8 },
  { key: 'sm', name: 'sm', defaultValue: 4, min: 0, max: 12 },
  { key: 'md', name: 'md', defaultValue: 6, min: 0, max: 16 },
  { key: 'lg', name: 'lg', defaultValue: 8, min: 0, max: 24 },
  { key: 'xl', name: 'xl', defaultValue: 12, min: 0, max: 32 },
  { key: '2xl', name: '2xl', defaultValue: 16, min: 0, max: 48 },
  { key: '3xl', name: '3xl', defaultValue: 24, min: 0, max: 64 },
  { key: '4xl', name: '4xl', defaultValue: 32, min: 0, max: 96 },
] as const;

type BreakpointKey = typeof BREAKPOINTS[number]['key'];
type RadiusKey = typeof RADIUS_SIZES[number]['key'];

type RadiusState = {
  [K in BreakpointKey]: {
    [R in RadiusKey]: {
      value: number;
      isLinked: boolean; // Si está vinculado al breakpoint superior
    }
  }
}

interface ResponsiveRadiusEditorProps {
  onChange?: (radiusState: RadiusState) => void;
}

export const ResponsiveRadiusEditor = ({ onChange }: ResponsiveRadiusEditorProps) => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<BreakpointKey>('desktop');
  
  // Estado inicial con valores por defecto
  const [radiusState, setRadiusState] = useState<RadiusState>(() => {
    const initialState = {} as RadiusState;
    
    BREAKPOINTS.forEach(bp => {
      initialState[bp.key] = {} as RadiusState[BreakpointKey];
      RADIUS_SIZES.forEach(size => {
        initialState[bp.key][size.key] = {
          value: size.defaultValue,
          isLinked: bp.key !== 'tv' // TV no está vinculado a nada, el resto sí
        };
      });
    });
    
    return initialState;
  });

  // Función para obtener el breakpoint superior
  const getParentBreakpoint = (breakpoint: BreakpointKey): BreakpointKey | null => {
    const currentIndex = BREAKPOINTS.findIndex(bp => bp.key === breakpoint);
    return currentIndex > 0 ? BREAKPOINTS[currentIndex - 1].key : null;
  };

  // Función para obtener breakpoints hijos
  const getChildBreakpoints = (breakpoint: BreakpointKey): BreakpointKey[] => {
    const currentIndex = BREAKPOINTS.findIndex(bp => bp.key === breakpoint);
    return BREAKPOINTS.slice(currentIndex + 1).map(bp => bp.key);
  };

  // Función para obtener el valor efectivo (considerando links)
  const getEffectiveValue = useCallback((breakpoint: BreakpointKey, size: RadiusKey): number => {
    const current = radiusState[breakpoint][size];
    
    if (!current.isLinked) {
      return current.value;
    }
    
    const parent = getParentBreakpoint(breakpoint);
    if (parent) {
      return getEffectiveValue(parent, size);
    }
    
    return current.value;
  }, [radiusState]);

  // Actualizar un valor específico
  const updateRadiusValue = (breakpoint: BreakpointKey, size: RadiusKey, newValue: number) => {
    setRadiusState(prev => {
      const newState = { ...prev };
      
      // Actualizar el valor actual
      newState[breakpoint] = {
        ...newState[breakpoint],
        [size]: {
          ...newState[breakpoint][size],
          value: newValue
        }
      };

      // Si este valor está desvinculado, actualizar todos los hijos vinculados
      const childBreakpoints = getChildBreakpoints(breakpoint);
      childBreakpoints.forEach(childBp => {
        if (newState[childBp][size].isLinked) {
          // Los hijos vinculados heredarán este valor automáticamente
          // No necesitamos cambiar su valor stored, ya que getEffectiveValue se encarga
        }
      });

      return newState;
    });
  };

  // Toggle del estado de vinculación
  const toggleLink = (breakpoint: BreakpointKey, size: RadiusKey) => {
    if (breakpoint === 'tv') return; // TV no se puede vincular

    setRadiusState(prev => {
      const newState = { ...prev };
      const currentIsLinked = newState[breakpoint][size].isLinked;
      
      newState[breakpoint] = {
        ...newState[breakpoint],
        [size]: {
          ...newState[breakpoint][size],
          isLinked: !currentIsLinked,
          // Si se desvincula, copiar el valor efectivo actual
          value: !currentIsLinked ? newState[breakpoint][size].value : getEffectiveValue(breakpoint, size)
        }
      };

      return newState;
    });
  };

  // Notificar cambios
  useEffect(() => {
    onChange?.(radiusState);
  }, [radiusState, onChange]);

  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-2xl font-bold">Sistema de Radius Responsive</h2>
        <p className="text-muted-foreground">
          Configura border-radius para diferentes breakpoints con cascada automática
        </p>
      </div>

      {/* Selector de Breakpoint */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Breakpoints
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
                </Button>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Editando: <strong>{BREAKPOINTS.find(bp => bp.key === activeBreakpoint)?.name}</strong> 
            {activeBreakpoint !== 'tv' && (
              <span> (vinculado por defecto al nivel superior)</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Editor de Radius Sizes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Tamaños de Radius - {BREAKPOINTS.find(bp => bp.key === activeBreakpoint)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {RADIUS_SIZES.map((size) => {
            const current = radiusState[activeBreakpoint][size.key];
            const effectiveValue = getEffectiveValue(activeBreakpoint, size.key);
            const canToggleLink = activeBreakpoint !== 'tv';
            const parentBp = getParentBreakpoint(activeBreakpoint);
            
            return (
              <div key={size.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">--radius-{size.key}</span>
                    <Badge variant="outline" className="text-xs">
                      {(effectiveValue / 16).toFixed(3)}rem
                    </Badge>
                    {current.isLinked && parentBp && (
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        <Link className="w-3 h-3" />
                        De {BREAKPOINTS.find(bp => bp.key === parentBp)?.name}
                      </Badge>
                    )}
                  </div>
                  
                  {canToggleLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLink(activeBreakpoint, size.key)}
                      className="h-6 px-2"
                    >
                      {current.isLinked ? (
                        <><Link className="w-3 h-3 mr-1" /> Vinculado</>
                      ) : (
                        <><Unlink className="w-3 h-3 mr-1" /> Independiente</>
                      )}
                    </Button>
                  )}
                </div>

                <SliderWithInput
                  label=""
                  value={current.isLinked ? effectiveValue : current.value}
                  onChange={(value) => updateRadiusValue(activeBreakpoint, size.key, value)}
                  min={size.min}
                  max={size.max}
                  step={1}
                  unit="px"
                  disabled={current.isLinked}
                />

                {/* Vista previa del tamaño */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 bg-primary shrink-0"
                    style={{ borderRadius: `${effectiveValue}px` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {effectiveValue}px ({(effectiveValue / 16).toFixed(3)}rem)
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Vista previa completa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Vista Previa del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {RADIUS_SIZES.map((size) => (
              <div key={size.key} className="text-center space-y-2">
                <div className="text-xs font-medium text-muted-foreground">{size.key}</div>
                <div
                  className="w-12 h-12 bg-primary mx-auto"
                  style={{ borderRadius: `${getEffectiveValue(activeBreakpoint, size.key)}px` }}
                />
                <div className="text-xs text-muted-foreground">
                  {getEffectiveValue(activeBreakpoint, size.key)}px
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CSS Output */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">CSS Variables Generadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
            <div>{/* Breakpoint: {BREAKPOINTS.find(bp => bp.key === activeBreakpoint)?.name} */}</div>
            <div>@media (min-width: {BREAKPOINTS.find(bp => bp.key === activeBreakpoint)?.minWidth}) {"{"}</div>
            <div className="pl-4">:root {"{"}</div>
            {RADIUS_SIZES.map((size) => (
              <div key={size.key} className="pl-8">
                --radius-{size.key}: {(getEffectiveValue(activeBreakpoint, size.key) / 16).toFixed(3)}rem;
              </div>
            ))}
            <div className="pl-4">{"}"}</div>
            <div>{"}"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};