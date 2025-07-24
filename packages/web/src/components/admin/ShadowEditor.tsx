import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SliderWithInput } from '../ui/slider-with-input';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ShadowState {
  color: string;
  opacity: number;
  blur: number;
  spread: number;
  offsetX: number;
  offsetY: number;
}

const DEFAULT_SHADOW_STATE: ShadowState = {
  color: '#000000',
  opacity: 0.1,
  blur: 3,
  spread: 0,
  offsetX: 0,
  offsetY: 1,
};

export const ShadowEditor = () => {
  const [shadowState, setShadowState] =
    useState<ShadowState>(DEFAULT_SHADOW_STATE);

  const updateShadowProperty = (
    property: keyof ShadowState,
    value: number | string,
  ) => {
    setShadowState((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const previewShadow = `${shadowState.offsetX}px ${shadowState.offsetY}px ${shadowState.blur}px ${shadowState.spread}px ${shadowState.color}${Math.round(
    shadowState.opacity * 255,
  )
    .toString(16)
    .padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Vista Previa</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-24 bg-background border rounded-lg flex items-center justify-center"
            style={{
              boxShadow: previewShadow,
            }}
          >
            <span className="text-sm text-muted-foreground">
              Elemento con sombra
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Configuración de Sombra</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="shadow-color" className="text-xs font-medium">
              Color
            </Label>
            <Input
              id="shadow-color"
              type="color"
              value={shadowState.color}
              onChange={(e) => updateShadowProperty('color', e.target.value)}
              className="h-8 w-full mt-1"
            />
          </div>

          <SliderWithInput
            label="Opacidad"
            value={shadowState.opacity}
            onChange={(value) => updateShadowProperty('opacity', value)}
            min={0}
            max={1}
            step={0.01}
            unit=""
          />

          <SliderWithInput
            label="Desenfoque"
            value={shadowState.blur}
            onChange={(value) => updateShadowProperty('blur', value)}
            min={0}
            max={50}
            step={1}
            unit="px"
          />

          <SliderWithInput
            label="Dispersión"
            value={shadowState.spread}
            onChange={(value) => updateShadowProperty('spread', value)}
            min={-12}
            max={4}
            step={1}
            unit="px"
          />

          <SliderWithInput
            label="Desplazamiento X"
            value={shadowState.offsetX}
            onChange={(value) => updateShadowProperty('offsetX', value)}
            min={-25}
            max={25}
            step={1}
            unit="px"
          />

          <SliderWithInput
            label="Desplazamiento Y"
            value={shadowState.offsetY}
            onChange={(value) => updateShadowProperty('offsetY', value)}
            min={-25}
            max={25}
            step={1}
            unit="px"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Configuración CSS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded text-xs font-mono">
            box-shadow: {previewShadow};
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
