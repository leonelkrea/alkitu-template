import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { SliderWithInput } from "../ui/slider-with-input";
import { Monitor, Tablet, Smartphone, Tv, RotateCcw, Link, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";

// Breakpoints
const BREAKPOINTS = [
  { key: 'tv', name: 'TV', icon: Tv, minWidth: 1920 },
  { key: 'desktop', name: 'Desktop', icon: Monitor, minWidth: 1024 },
  { key: 'tablet', name: 'Tablet', icon: Tablet, minWidth: 768 },
  { key: 'mobile', name: 'Mobile', icon: Smartphone, minWidth: 0 }
] as const;

// Tamaños de radius
const RADIUS_SIZES = [
  { key: 'xs', name: 'xs' },
  { key: 'sm', name: 'sm' },
  { key: 'md', name: 'md' },
  { key: 'lg', name: 'lg' },
  { key: 'xl', name: 'xl' },
  { key: '2xl', name: '2xl' },
  { key: '3xl', name: '3xl' },
  { key: '4xl', name: '4xl' },
] as const;

// Esquinas individuales
const CORNERS = [
  { key: 'tl', name: 'Top Left', cssProperty: 'borderTopLeftRadius', position: { top: 0, left: 0 } },
  { key: 'tr', name: 'Top Right', cssProperty: 'borderTopRightRadius', position: { top: 0, right: 0 } },
  { key: 'bl', name: 'Bottom Left', cssProperty: 'borderBottomLeftRadius', position: { bottom: 0, left: 0 } },
  { key: 'br', name: 'Bottom Right', cssProperty: 'borderBottomRightRadius', position: { bottom: 0, right: 0 } },
] as const;

type BreakpointKey = typeof BREAKPOINTS[number]['key'];
type RadiusKey = typeof RADIUS_SIZES[number]['key'];
type CornerKey = typeof CORNERS[number]['key'];

// Estado para esquinas individuales
type CornerRadiusState = {
  [K in BreakpointKey]: {
    [R in RadiusKey]: {
      isLinked: boolean; // Si todas las esquinas usan el mismo valor
      globalValue: number; // Valor cuando está vinculado
      corners: {
        [C in CornerKey]: number; // Valores individuales por esquina
      }
    }
  }
}

interface CornerRadiusEditorProps {
  globalValues?: any; // Valores del sistema global
  onChange?: (state: CornerRadiusState) => void;
}

export const CornerRadiusEditor = ({ globalValues, onChange }: CornerRadiusEditorProps) => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<BreakpointKey>('desktop');
  const [activeSize, setActiveSize] = useState<RadiusKey>('lg');
  
  // Estado inicial con valores por defecto
  const [cornerState, setCornerState] = useState<CornerRadiusState>(() => {
    const initialState = {} as CornerRadiusState;
    
    BREAKPOINTS.forEach(bp => {
      initialState[bp.key] = {} as CornerRadiusState[BreakpointKey];
      RADIUS_SIZES.forEach(size => {
        const defaultValue = globalValues?.[bp.key]?.[size.key] || 8;
        initialState[bp.key][size.key] = {
          isLinked: true,
          globalValue: defaultValue,
          corners: {
            tl: defaultValue,
            tr: defaultValue,
            bl: defaultValue,
            br: defaultValue,
          }
        };
      });
    });
    
    return initialState;
  });

  // Obtener el estado actual
  const currentState = cornerState[activeBreakpoint][activeSize];

  // Toggle vinculación global vs individual
  const toggleLink = () => {
    setCornerState(prev => {
      const newState = { ...prev };
      const current = newState[activeBreakpoint][activeSize];
      
      if (current.isLinked) {
        // Desvincular: mantener valores actuales
        newState[activeBreakpoint][activeSize] = {
          ...current,
          isLinked: false
        };
      } else {
        // Vincular: usar el valor más común o el primero
        const corners = Object.values(current.corners);
        const commonValue = corners.find(val => corners.filter(v => v === val).length >= 2) || corners[0];
        
        newState[activeBreakpoint][activeSize] = {
          ...current,
          isLinked: true,
          globalValue: commonValue,
          corners: {
            tl: commonValue,
            tr: commonValue,
            bl: commonValue,
            br: commonValue,
          }
        };
      }
      
      return newState;
    });
  };

  // Actualizar valor global (cuando está vinculado)
  const updateGlobalValue = (value: number) => {
    setCornerState(prev => {
      const newState = { ...prev };
      newState[activeBreakpoint][activeSize] = {
        ...newState[activeBreakpoint][activeSize],
        globalValue: value,
        corners: {
          tl: value,
          tr: value,
          bl: value,
          br: value,
        }
      };
      return newState;
    });
  };

  // Actualizar esquina individual
  const updateCornerValue = (corner: CornerKey, value: number) => {
    setCornerState(prev => {
      const newState = { ...prev };
      newState[activeBreakpoint][activeSize] = {
        ...newState[activeBreakpoint][activeSize],
        corners: {
          ...newState[activeBreakpoint][activeSize].corners,
          [corner]: value
        }
      };
      return newState;
    });
  };

  // Aplicar a todas las esquinas
  const applyToAllCorners = (value: number) => {
    if (currentState.isLinked) {
      updateGlobalValue(value);
    } else {
      setCornerState(prev => {
        const newState = { ...prev };
        newState[activeBreakpoint][activeSize] = {
          ...newState[activeBreakpoint][activeSize],
          corners: {
            tl: value,
            tr: value,
            bl: value,
            br: value,
          }
        };
        return newState;
      });
    }
  };

  // Obtener estilo de preview
  const getPreviewStyle = useCallback(() => {
    const corners = currentState.corners;
    return {
      borderTopLeftRadius: `${corners.tl}px`,
      borderTopRightRadius: `${corners.tr}px`,
      borderBottomLeftRadius: `${corners.bl}px`,
      borderBottomRightRadius: `${corners.br}px`,
    };
  }, [currentState.corners]);

  // Notificar cambios
  useEffect(() => {
    onChange?.(cornerState);
  }, [cornerState, onChange]);

  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-2xl font-bold">Editor Granular de Esquinas</h2>
        <p className="text-muted-foreground">
          Control individual de cada esquina por breakpoint y tamaño
        </p>
      </div>

      {/* Selectores de Breakpoint y Tamaño */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Breakpoint Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Breakpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
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
          </CardContent>
        </Card>

        {/* Size Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tamaño</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {RADIUS_SIZES.map((size) => (
                <Button
                  key={size.key}
                  variant={activeSize === size.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveSize(size.key)}
                >
                  {size.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vista Previa Interactiva */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Vista Previa Interactiva</span>
            <div className="flex items-center gap-2">
              <Badge variant={currentState.isLinked ? "default" : "secondary"}>
                {currentState.isLinked ? "Vinculado" : "Individual"}
              </Badge>
              <Button size="sm" variant="outline" onClick={toggleLink}>
                {currentState.isLinked ? (
                  <>
                    <Unlink className="w-4 h-4 mr-1" />
                    Desvincular
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4 mr-1" />
                    Vincular
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="relative">
              {/* Elemento principal */}
              <div
                className="w-32 h-32 bg-primary border-2 border-primary-foreground relative"
                style={getPreviewStyle()}
              >
                {/* Indicators de esquinas */}
                {CORNERS.map((corner) => (
                  <div
                    key={corner.key}
                    className="absolute w-6 h-6 bg-background border-2 border-primary cursor-pointer hover:bg-primary/20 flex items-center justify-center text-xs font-bold rounded-full"
                    style={{
                      ...corner.position,
                      transform: 'translate(-50%, -50%)',
                      margin: '12px'
                    }}
                    title={`${corner.name}: ${currentState.corners[corner.key]}px`}
                  >
                    {currentState.corners[corner.key]}
                  </div>
                ))}
              </div>
              
              {/* Etiquetas de esquinas */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-center">
                <div>TL: {currentState.corners.tl}px</div>
                <div>TR: {currentState.corners.tr}px</div>
                <div>BL: {currentState.corners.bl}px</div>
                <div>BR: {currentState.corners.br}px</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles */}
      {currentState.isLinked ? (
        /* Modo Vinculado - Control Global */
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Control Global - Todas las Esquinas</CardTitle>
          </CardHeader>
          <CardContent>
            <SliderWithInput
              label="Radius Global"
              value={currentState.globalValue}
              onChange={updateGlobalValue}
              min={0}
              max={64}
              step={1}
              unit="px"
            />
            <div className="mt-3 flex gap-2 flex-wrap">
              {[0, 4, 8, 12, 16, 24, 32].map(value => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => updateGlobalValue(value)}
                >
                  {value}px
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Modo Individual - Control por Esquina */
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Control Individual por Esquina</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {CORNERS.map((corner) => (
              <div key={corner.key}>
                <SliderWithInput
                  label={corner.name}
                  value={currentState.corners[corner.key]}
                  onChange={(value) => updateCornerValue(corner.key, value)}
                  min={0}
                  max={64}
                  step={1}
                  unit="px"
                />
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <div className="text-sm font-medium mb-2">Aplicar a todas las esquinas:</div>
              <div className="flex gap-2 flex-wrap">
                {[0, 4, 8, 12, 16, 24, 32].map(value => (
                  <Button
                    key={value}
                    variant="outline"
                    size="sm"
                    onClick={() => applyToAllCorners(value)}
                  >
                    {value}px
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CSS Output */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">CSS Generado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded text-xs font-mono space-y-1">
            <div>{/* {BREAKPOINTS.find(bp => bp.key === activeBreakpoint)?.name} - radius-{activeSize} */}</div>
            <div>.rounded-{activeSize} {"{"}</div>
            <div className="pl-4">border-top-left-radius: {(currentState.corners.tl / 16).toFixed(3)}rem;</div>
            <div className="pl-4">border-top-right-radius: {(currentState.corners.tr / 16).toFixed(3)}rem;</div>
            <div className="pl-4">border-bottom-left-radius: {(currentState.corners.bl / 16).toFixed(3)}rem;</div>
            <div className="pl-4">border-bottom-right-radius: {(currentState.corners.br / 16).toFixed(3)}rem;</div>
            <div>{"}"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};