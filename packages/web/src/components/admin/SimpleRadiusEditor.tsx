import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Monitor,
  Tablet,
  Smartphone,
  Tv,
  Save,
  RotateCcw,
  Download,
  Settings,
  Link,
  Unlink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Breakpoints
const BREAKPOINTS = [
  { key: 'tv', name: 'TV', icon: Tv, minWidth: 1920, color: 'bg-purple-500' },
  {
    key: 'desktop',
    name: 'Desktop',
    icon: Monitor,
    minWidth: 1024,
    color: 'bg-blue-500',
  },
  {
    key: 'tablet',
    name: 'Tablet',
    icon: Tablet,
    minWidth: 768,
    color: 'bg-green-500',
  },
  {
    key: 'mobile',
    name: 'Mobile',
    icon: Smartphone,
    minWidth: 0,
    color: 'bg-orange-500',
  },
] as const;

// Valores predefinidos comunes
const COMMON_VALUES = [0, 4, 8, 12, 16, 20, 24, 32, 48, 9999]; // 9999 = full

// Esquinas
const CORNERS = [
  { key: 'tl', name: 'Top Left', property: 'borderTopLeftRadius' },
  { key: 'tr', name: 'Top Right', property: 'borderTopRightRadius' },
  { key: 'bl', name: 'Bottom Left', property: 'borderBottomLeftRadius' },
  { key: 'br', name: 'Bottom Right', property: 'borderBottomRightRadius' },
] as const;

type BreakpointKey = (typeof BREAKPOINTS)[number]['key'];
type CornerKey = (typeof CORNERS)[number]['key'];

// Estado simplificado: solo 4 configuraciones
type SimpleRadiusState = {
  [K in BreakpointKey]: {
    isLinked: boolean; // Todas las esquinas iguales
    globalValue: number; // Valor cuando está vinculado
    corners: {
      [C in CornerKey]: number; // Valores individuales por esquina
    };
  };
};

interface SimpleRadiusEditorProps {
  onChange?: (state: SimpleRadiusState) => void;
  onSave?: (state: SimpleRadiusState) => void;
}

export const SimpleRadiusEditor = ({
  onChange,
  onSave,
}: SimpleRadiusEditorProps) => {
  const [activeBreakpoint, setActiveBreakpoint] =
    useState<BreakpointKey>('desktop');
  const [showCornerEditor, setShowCornerEditor] = useState(false);
  const [customValue, setCustomValue] = useState('');

  // Estado inicial: 4 configuraciones simples
  const [radiusState, setRadiusState] = useState<SimpleRadiusState>(() => {
    const initialState = {} as SimpleRadiusState;

    BREAKPOINTS.forEach((bp) => {
      const defaultValue =
        bp.key === 'tv'
          ? 16
          : bp.key === 'desktop'
            ? 12
            : bp.key === 'tablet'
              ? 8
              : 6;
      initialState[bp.key] = {
        isLinked: true,
        globalValue: defaultValue,
        corners: {
          tl: defaultValue,
          tr: defaultValue,
          bl: defaultValue,
          br: defaultValue,
        },
      };
    });

    return initialState;
  });

  // Estado actual del breakpoint activo
  const currentState = radiusState[activeBreakpoint];

  // Toggle vinculación
  const toggleLink = () => {
    setRadiusState((prev) => {
      const newState = { ...prev };
      const current = newState[activeBreakpoint];

      if (current.isLinked) {
        // Desvincular: mantener valores actuales
        newState[activeBreakpoint] = {
          ...current,
          isLinked: false,
        };
      } else {
        // Vincular: usar el valor más común
        const corners = Object.values(current.corners);
        const commonValue =
          corners.find((val) => corners.filter((v) => v === val).length >= 2) ||
          corners[0];

        newState[activeBreakpoint] = {
          ...current,
          isLinked: true,
          globalValue: commonValue,
          corners: {
            tl: commonValue,
            tr: commonValue,
            bl: commonValue,
            br: commonValue,
          },
        };
      }

      return newState;
    });
  };

  // Actualizar valor global (todas las esquinas)
  const updateGlobalValue = (value: number) => {
    setRadiusState((prev) => ({
      ...prev,
      [activeBreakpoint]: {
        ...prev[activeBreakpoint],
        globalValue: value,
        corners: {
          tl: value,
          tr: value,
          bl: value,
          br: value,
        },
      },
    }));
  };

  // Actualizar esquina individual
  const updateCornerValue = (corner: CornerKey, value: number) => {
    setRadiusState((prev) => ({
      ...prev,
      [activeBreakpoint]: {
        ...prev[activeBreakpoint],
        corners: {
          ...prev[activeBreakpoint].corners,
          [corner]: value,
        },
      },
    }));
  };

  // Aplicar valor personalizado
  const applyCustomValue = () => {
    const value = parseFloat(customValue);
    if (!isNaN(value) && value >= 0) {
      updateGlobalValue(value);
      setCustomValue('');
    }
  };

  // Reset a valores por defecto
  const resetToDefaults = () => {
    const defaultValue =
      activeBreakpoint === 'tv'
        ? 16
        : activeBreakpoint === 'desktop'
          ? 12
          : activeBreakpoint === 'tablet'
            ? 8
            : 6;
    updateGlobalValue(defaultValue);
  };

  // Aplicar CSS variables en tiempo real
  const applyCSSVariables = useCallback(() => {
    const root = document.documentElement;

    // Aplicar variables del breakpoint activo a TODAS las clases de radius
    const current = radiusState[activeBreakpoint];
    const corners = current.corners;

    // Variables individuales por esquina (para uso avanzado)
    root.style.setProperty(
      '--radius-tl',
      corners.tl === 9999 ? '50%' : `${corners.tl}px`,
    );
    root.style.setProperty(
      '--radius-tr',
      corners.tr === 9999 ? '50%' : `${corners.tr}px`,
    );
    root.style.setProperty(
      '--radius-bl',
      corners.bl === 9999 ? '50%' : `${corners.bl}px`,
    );
    root.style.setProperty(
      '--radius-br',
      corners.br === 9999 ? '50%' : `${corners.br}px`,
    );

    // Variables globales para todas las clases Tailwind
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
    sizes.forEach((size) => {
      if (current.isLinked) {
        const value =
          current.globalValue === 9999
            ? 'calc(infinity * 1px)'
            : `${(current.globalValue / 16).toFixed(3)}rem`;
        root.style.setProperty(`--radius-${size}`, value);
      } else {
        // En modo individual, usar esquina top-left como referencia base
        const value =
          corners.tl === 9999
            ? 'calc(infinity * 1px)'
            : `${(corners.tl / 16).toFixed(3)}rem`;
        root.style.setProperty(`--radius-${size}`, value);
      }
    });
  }, [radiusState, activeBreakpoint]);

  // Exportar CSS completo
  const exportCSS = () => {
    let css = '/* Border Radius System - Simplified Approach */\n\n';

    BREAKPOINTS.forEach((bp) => {
      const state = radiusState[bp.key];
      css += `/* ${bp.name} - ${bp.minWidth}px+ */\n`;
      css += `@media (min-width: ${bp.minWidth}px) {\n`;
      css += '  :root {\n';

      if (state.isLinked) {
        // Modo vinculado: todas las clases usan el mismo valor
        const value =
          state.globalValue === 9999
            ? 'calc(infinity * 1px)'
            : `${(state.globalValue / 16).toFixed(3)}rem`;
        ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].forEach((size) => {
          css += `    --radius-${size}: ${value};\n`;
        });
      } else {
        // Modo individual: esquinas personalizadas
        css += '    /* Individual corner values */\n';
        Object.entries(state.corners).forEach(([corner, val]) => {
          const cssValue = val === 9999 ? '50%' : `${val}px`;
          css += `    --radius-${corner}: ${cssValue};\n`;
        });
      }

      css += '  }\n';
      css += '}\n\n';
    });

    // Crear y descargar archivo
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'radius-system-simplified.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Aplicar cambios y notificar
  useEffect(() => {
    applyCSSVariables();
    onChange?.(radiusState);
  }, [radiusState, applyCSSVariables, onChange]);

  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-2xl font-bold">
          Sistema Simplificado de Border Radius
        </h2>
        <p className="text-muted-foreground">
          Define 4 configuraciones globales: una por breakpoint. Todas las
          clases Tailwind usarán estos valores.
        </p>
      </div>

      {/* Selector de Breakpoint */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Configuraciones por Breakpoint</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={resetToDefaults}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button size="sm" variant="outline" onClick={exportCSS}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button size="sm" onClick={() => onSave?.(radiusState)}>
                <Save className="w-4 h-4 mr-1" />
                Guardar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BREAKPOINTS.map((bp) => {
              const Icon = bp.icon;
              const state = radiusState[bp.key];
              const displayValue = state.isLinked
                ? state.globalValue === 9999
                  ? 'Full'
                  : `${state.globalValue}px`
                : 'Custom';

              return (
                <Button
                  key={bp.key}
                  variant={activeBreakpoint === bp.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveBreakpoint(bp.key)}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {bp.name}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {displayValue}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Vista Previa del Breakpoint Activo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            <span>
              Vista Previa -{' '}
              {BREAKPOINTS.find((bp) => bp.key === activeBreakpoint)?.name}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant={currentState.isLinked ? 'default' : 'secondary'}>
                {currentState.isLinked ? 'Global' : 'Por Esquinas'}
              </Badge>
              <Button size="sm" variant="outline" onClick={toggleLink}>
                {currentState.isLinked ? (
                  <>
                    <Unlink className="w-4 h-4 mr-1" />
                    Personalizar Esquinas
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4 mr-1" />
                    Usar Valor Global
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div
              className="w-32 h-32 bg-primary border-2 border-primary-foreground relative flex items-center justify-center text-white font-bold"
              style={{
                borderTopLeftRadius:
                  currentState.corners.tl === 9999
                    ? '50%'
                    : `${currentState.corners.tl}px`,
                borderTopRightRadius:
                  currentState.corners.tr === 9999
                    ? '50%'
                    : `${currentState.corners.tr}px`,
                borderBottomLeftRadius:
                  currentState.corners.bl === 9999
                    ? '50%'
                    : `${currentState.corners.bl}px`,
                borderBottomRightRadius:
                  currentState.corners.br === 9999
                    ? '50%'
                    : `${currentState.corners.br}px`,
              }}
            >
              {BREAKPOINTS.find((bp) => bp.key === activeBreakpoint)?.name}
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Este valor se aplicará a <strong>TODAS</strong> las clases:
            rounded-xs, rounded-sm, rounded-md, rounded-lg, rounded-xl,
            rounded-2xl, rounded-3xl, rounded-4xl
          </div>
        </CardContent>
      </Card>

      {/* Controles */}
      {currentState.isLinked ? (
        /* Modo Global */
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Valor Global para{' '}
              {BREAKPOINTS.find((bp) => bp.key === activeBreakpoint)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Valores predeterminados */}
            <div>
              <div className="text-sm font-medium mb-2">Valores Comunes</div>
              <div className="flex flex-wrap gap-2">
                {COMMON_VALUES.map((value) => (
                  <Button
                    key={value}
                    variant={
                      currentState.globalValue === value ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => updateGlobalValue(value)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-4 h-4 bg-primary"
                      style={{
                        borderRadius: value === 9999 ? '50%' : `${value}px`,
                      }}
                    />
                    {value === 9999 ? 'Full' : `${value}px`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Valor personalizado */}
            <div>
              <div className="text-sm font-medium mb-2">
                Valor Personalizado
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Ej: 50"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground">
                  px
                </span>
                <Button onClick={applyCustomValue} disabled={!customValue}>
                  Aplicar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Modo Por Esquinas */
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Control por Esquinas -{' '}
              {BREAKPOINTS.find((bp) => bp.key === activeBreakpoint)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {CORNERS.map((corner) => (
                <div key={corner.key} className="space-y-2">
                  <div className="text-sm font-medium">{corner.name}</div>
                  <div className="flex flex-wrap gap-1">
                    {COMMON_VALUES.map((value) => (
                      <Button
                        key={value}
                        variant={
                          currentState.corners[corner.key] === value
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => updateCornerValue(corner.key, value)}
                        className="text-xs px-2"
                      >
                        {value === 9999 ? 'F' : value}
                      </Button>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Actual:{' '}
                    {currentState.corners[corner.key] === 9999
                      ? 'Full'
                      : `${currentState.corners[corner.key]}px`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
