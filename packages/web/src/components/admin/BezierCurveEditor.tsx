'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const PRESET_CURVES = {
  linear: { 
    curve: [0, 0, 1, 1], 
    label: 'Linear',
    description: 'Constant speed'
  },
  ease: { 
    curve: [0.25, 0.1, 0.25, 1], 
    label: 'Ease',
    description: 'Default easing'
  },
  'ease-in': { 
    curve: [0.42, 0, 1, 1], 
    label: 'Ease In',
    description: 'Starts slowly'
  },
  'ease-out': { 
    curve: [0, 0, 0.58, 1], 
    label: 'Ease Out',
    description: 'Ends slowly'
  },
  'ease-in-out': { 
    curve: [0.42, 0, 0.58, 1], 
    label: 'Ease In Out',
    description: 'Slow start and end'
  },
  bounce: { 
    curve: [0.68, -0.55, 0.265, 1.55], 
    label: 'Bounce',
    description: 'Bouncy effect'
  },
  elastic: { 
    curve: [0.175, 0.885, 0.32, 1.275], 
    label: 'Elastic',
    description: 'Elastic effect'
  }
} as const;

interface BezierCurveEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const BezierCurveEditor: React.FC<BezierCurveEditorProps> = ({
  value,
  onChange,
  className
}) => {
  const [currentCurve, setCurrentCurve] = useState<number[]>(() => {
    // Parse current value
    const match = value.match(/cubic-bezier\(([\d.,\s-]+)\)/);
    if (match) {
      return match[1].split(',').map(n => parseFloat(n.trim()));
    }
    return [0.25, 0.1, 0.25, 1]; // default ease
  });

  const [isDragging, setIsDragging] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const updateCurve = useCallback((newCurve: number[]) => {
    setCurrentCurve(newCurve);
    const [x1, y1, x2, y2] = newCurve;
    onChange(`cubic-bezier(${x1.toFixed(3)}, ${y1.toFixed(3)}, ${x2.toFixed(3)}, ${y2.toFixed(3)})`);
  }, [onChange]);

  const handleMouseDown = (controlPoint: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(controlPoint);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging === null || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(-0.5, Math.min(1.5, 1 - (e.clientY - rect.top) / rect.height));

    const newCurve = [...currentCurve];
    if (isDragging === 0) {
      newCurve[0] = x;
      newCurve[1] = y;
    } else if (isDragging === 1) {
      newCurve[2] = x;
      newCurve[3] = y;
    }

    updateCurve(newCurve);
  }, [isDragging, currentCurve, updateCurve]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e as any);
    };
    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    if (isDragging !== null) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const applyPreset = (presetKey: keyof typeof PRESET_CURVES) => {
    updateCurve(PRESET_CURVES[presetKey].curve);
  };

  const generateCurvePath = (curve: number[]) => {
    const [x1, y1, x2, y2] = curve;
    return `M 0,200 C ${x1 * 200},${200 - y1 * 200} ${x2 * 200},${200 - y2 * 200} 200,0`;
  };

  const [x1, y1, x2, y2] = currentCurve;

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Preset Buttons */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Animation Presets</Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(PRESET_CURVES).map(([key, preset]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(key as keyof typeof PRESET_CURVES)}
                className="justify-start h-auto p-2"
              >
                <div className="text-left">
                  <div className="font-medium text-xs">{preset.label}</div>
                  <div className="text-xs text-muted-foreground">{preset.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Visual Editor */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Bezier Curve Editor</Label>
          <div className="border rounded-lg p-4 bg-background">
            <svg
              ref={svgRef}
              width="200"
              height="200"
              viewBox="0 0 200 200"
              className="border border-dashed border-muted cursor-crosshair"
              style={{ background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px' }}
            >
              {/* Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="200" height="200" fill="url(#grid)" />
              
              {/* Curve */}
              <path
                d={generateCurvePath(currentCurve)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              
              {/* Control lines */}
              <line
                x1="0"
                y1="200"
                x2={x1 * 200}
                y2={200 - y1 * 200}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              <line
                x1="200"
                y1="0"
                x2={x2 * 200}
                y2={200 - y2 * 200}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              
              {/* Control points */}
              <circle
                cx={x1 * 200}
                cy={200 - y1 * 200}
                r="6"
                fill="#ef4444"
                stroke="white"
                strokeWidth="2"
                className="cursor-move"
                onMouseDown={handleMouseDown(0)}
              />
              <circle
                cx={x2 * 200}
                cy={200 - y2 * 200}
                r="6"
                fill="#10b981"
                stroke="white"
                strokeWidth="2"
                className="cursor-move"
                onMouseDown={handleMouseDown(1)}
              />
              
              {/* Start/End points */}
              <circle cx="0" cy="200" r="4" fill="#6b7280" />
              <circle cx="200" cy="0" r="4" fill="#6b7280" />
            </svg>
            
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Drag the red and green control points • Start: (0,0) End: (1,1)
            </div>
          </div>
        </div>

        {/* Manual Input */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Manual Values</Label>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">X1</Label>
              <Input
                type="number"
                value={x1.toFixed(3)}
                onChange={(e) => {
                  const newX1 = Math.max(0, Math.min(1, parseFloat(e.target.value) || 0));
                  updateCurve([newX1, y1, x2, y2]);
                }}
                step="0.001"
                min="0"
                max="1"
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Y1</Label>
              <Input
                type="number"
                value={y1.toFixed(3)}
                onChange={(e) => {
                  const newY1 = Math.max(-0.5, Math.min(1.5, parseFloat(e.target.value) || 0));
                  updateCurve([x1, newY1, x2, y2]);
                }}
                step="0.001"
                min="-0.5"
                max="1.5"
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">X2</Label>
              <Input
                type="number"
                value={x2.toFixed(3)}
                onChange={(e) => {
                  const newX2 = Math.max(0, Math.min(1, parseFloat(e.target.value) || 0));
                  updateCurve([x1, y1, newX2, y2]);
                }}
                step="0.001"
                min="0"
                max="1"
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Y2</Label>
              <Input
                type="number"
                value={y2.toFixed(3)}
                onChange={(e) => {
                  const newY2 = Math.max(-0.5, Math.min(1.5, parseFloat(e.target.value) || 0));
                  updateCurve([x1, y1, x2, newY2]);
                }}
                step="0.001"
                min="-0.5"
                max="1.5"
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* Current Value */}
        <div>
          <Label className="text-sm font-medium mb-2 block">CSS Value</Label>
          <div className="bg-muted rounded p-2 font-mono text-sm">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BezierCurveEditor;