'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TypographyControl } from './TypographyControl';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Type, 
  Sparkles, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  Heading5,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { ThemeTypography, TypographyStyle } from '@/types/typography';
import { DEFAULT_TYPOGRAPHY } from '@/types/typography';
import { cn } from '@/lib/utils';

interface TypographyEditorProps {
  typography: ThemeTypography;
  onChange: (typography: ThemeTypography) => void;
  className?: string;
}

const TYPOGRAPHY_CATEGORIES = [
  { id: 'h1', label: 'H1', icon: Heading1, description: 'Encabezado principal', previewText: 'Título Principal' },
  { id: 'h2', label: 'H2', icon: Heading2, description: 'Encabezado secundario', previewText: 'Título Secundario' },
  { id: 'h3', label: 'H3', icon: Heading3, description: 'Encabezado terciario', previewText: 'Título Terciario' },
  { id: 'h4', label: 'H4', icon: Heading4, description: 'Encabezado cuaternario', previewText: 'Título Cuaternario' },
  { id: 'h5', label: 'H5', icon: Heading5, description: 'Encabezado quinario', previewText: 'Título Quinario' },
  { id: 'base', label: 'Párrafo', icon: Type, description: 'Texto de párrafos', previewText: 'Texto de párrafo ejemplo' },
  { id: 'accent', label: 'Énfasis', icon: Sparkles, description: 'Texto con énfasis', previewText: 'Texto con énfasis especial' },
  { id: 'quote', label: 'Quotes', icon: Quote, description: 'Citas y blockquotes', previewText: '"Cita inspiradora ejemplo"' },
];

// Function to get appropriate preview size for accordion headers
function getAccordionPreviewSize(categoryId: string): number {
  const sizeMap: Record<string, number> = {
    h1: 20,
    h2: 18,
    h3: 16,
    h4: 15,
    h5: 14,
    base: 13,
    accent: 13,
    quote: 12,
  };
  return sizeMap[categoryId] || 14;
}

// Collapsible section component for typography with visual preview
interface TypographyControlSectionProps {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  typography: TypographyStyle;
  previewText: string;
  categoryId: string;
}

function TypographyControlSection({
  title,
  children,
  expanded = false,
  className,
  icon: Icon,
  typography,
  previewText,
  categoryId,
}: TypographyControlSectionProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className={cn('mb-4 overflow-hidden rounded-lg border', className)}>
      <div
        className="bg-background hover:bg-muted flex cursor-pointer items-center justify-between p-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
          <div className="min-w-0 flex-1">
            <div
              style={{
                fontFamily: typography.fontFamily,
                fontSize: `${getAccordionPreviewSize(categoryId)}px`,
                fontWeight: typography.fontWeight,
                fontStyle: typography.fontStyle,
                textTransform: typography.textTransform as any,
                textDecoration: typography.textDecoration,
                lineHeight: Math.min(typography.lineHeight, 1.3),
                letterSpacing: `${typography.letterSpacing}em`,
                wordSpacing: `${typography.wordSpacing}em`,
              }}
              className="truncate"
            >
              {previewText}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
          </div>
        </div>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
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

// Static data outside component to prevent re-renders
const CONTEXT_EXAMPLES = {
  h1: [
    { context: 'Landing Page', text: 'Transforma tu Negocio Digital', bg: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20' },
    { context: 'Dashboard Header', text: 'Panel de Control', bg: 'bg-muted/30' },
    { context: 'Article Title', text: 'Guía Completa de Diseño', bg: 'bg-white dark:bg-gray-950' }
  ],
  h2: [
    { context: 'Section Title', text: 'Características Principales', bg: 'bg-muted/30' },
    { context: 'Card Header', text: 'Resumen Mensual', bg: 'bg-white dark:bg-gray-950' },
    { context: 'Form Section', text: 'Información Personal', bg: 'bg-gray-50 dark:bg-gray-900' }
  ],
  h3: [
    { context: 'Subsection', text: 'Configuración Avanzada', bg: 'bg-muted/30' },
    { context: 'Widget Title', text: 'Actividad Reciente', bg: 'bg-white dark:bg-gray-950' },
    { context: 'List Header', text: 'Documentos Importantes', bg: 'bg-gray-50 dark:bg-gray-900' }
  ],
  h4: [
    { context: 'Card Subtitle', text: 'Detalles del Proyecto', bg: 'bg-muted/30' },
    { context: 'Form Label', text: 'Datos de Contacto', bg: 'bg-white dark:bg-gray-950' },
    { context: 'Menu Category', text: 'Herramientas', bg: 'bg-gray-50 dark:bg-gray-900' }
  ],
  h5: [
    { context: 'Small Header', text: 'Última Actualización', bg: 'bg-muted/30' },
    { context: 'Tag Label', text: 'Estado: Activo', bg: 'bg-white dark:bg-gray-950' },
    { context: 'Footer Title', text: 'Enlaces Útiles', bg: 'bg-gray-50 dark:bg-gray-900' }
  ],
  base: [
    { context: 'Article Content', text: 'Este es un párrafo de ejemplo que muestra cómo se ve el texto en un artículo o contenido principal. La tipografía debe ser legible y cómoda para la lectura.', bg: 'bg-white dark:bg-gray-950' },
    { context: 'Description', text: 'Descripción detallada del producto con información relevante para el usuario.', bg: 'bg-muted/30' },
    { context: 'Card Content', text: 'Contenido de una tarjeta con información importante y detalles adicionales.', bg: 'bg-gray-50 dark:bg-gray-900' }
  ],
  accent: [
    { context: 'Call to Action', text: '¡Oferta Especial! Ahorra hasta 50% en tu primera compra', bg: 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20' },
    { context: 'Important Note', text: 'Nota importante: Esta configuración afectará todos los usuarios', bg: 'bg-yellow-50 dark:bg-yellow-950/20' },
    { context: 'Highlight Text', text: 'Texto destacado que requiere atención especial del usuario', bg: 'bg-blue-50 dark:bg-blue-950/20' }
  ],
  quote: [
    { context: 'Testimonial', text: '"El diseño no es solo cómo se ve o cómo se siente. El diseño es cómo funciona." - Steve Jobs', bg: 'bg-muted/30' },
    { context: 'Article Quote', text: '"La simplicidad es la máxima sofisticación en el diseño moderno."', bg: 'bg-white dark:bg-gray-950' },
    { context: 'Inspirational', text: '"Cada gran diseño comienza con una historia aún mejor que contar."', bg: 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20' }
  ]
};

const WEIGHT_VARIANTS = [
  { label: 'Light', weight: '300', description: 'Para texto sutil' },
  { label: 'Normal', weight: '400', description: 'Peso estándar' },
  { label: 'Medium', weight: '500', description: 'Peso medio' },
  { label: 'Semibold', weight: '600', description: 'Para énfasis' },
  { label: 'Bold', weight: '700', description: 'Para destacar' }
];

// Helper functions outside component
function getContextExamples(categoryId: string) {
  return CONTEXT_EXAMPLES[categoryId as keyof typeof CONTEXT_EXAMPLES] || CONTEXT_EXAMPLES.base;
}

function getSizeVariants(baseFontSize: number) {
  return [
    { label: 'XS', size: Math.max(baseFontSize * 0.75, 10), description: 'Para elementos muy pequeños' },
    { label: 'SM', size: Math.max(baseFontSize * 0.875, 12), description: 'Para elementos compactos' },
    { label: 'MD', size: baseFontSize, description: 'Tamaño por defecto' },
    { label: 'LG', size: baseFontSize * 1.25, description: 'Para mayor énfasis' },
    { label: 'XL', size: baseFontSize * 1.5, description: 'Para máximo impacto' }
  ];
}

function getContextDescription(context: string): string {
  const descriptions: Record<string, string> = {
    'Landing Page': 'Ideal para páginas de inicio',
    'Dashboard Header': 'Perfecto para encabezados de aplicación',
    'Article Title': 'Excelente para títulos de contenido',
    'Section Title': 'Para organizar secciones',
    'Card Header': 'Títulos de tarjetas y widgets',
    'Form Section': 'Para agrupar campos de formulario',
    'Article Content': 'Ideal para lectura de contenido',
    'Call to Action': 'Para generar acción del usuario',
    'Testimonial': 'Para testimonios y citas'
  };
  return descriptions[context] || 'Uso versátil en diferentes contextos';
}

// Typography Preview Component (similar to Brand preview structure)
interface TypographyPreviewProps {
  categoryId: string;
  typography: TypographyStyle;
  previewText: string;
  description: string;
}

function TypographyPreview({ categoryId, typography, previewText, description }: TypographyPreviewProps) {

  return (
    <div className="mt-8 space-y-6">
      <h4 className="text-sm font-medium text-muted-foreground">
        Vista previa en diferentes contextos
      </h4>
      
      {/* Context Examples */}
      <div>
        <p className="text-sm font-medium mb-4">Ejemplos en Contexto</p>
        <div className="grid grid-cols-1 gap-4">
          {getContextExamples(categoryId).map((example, index) => (
            <div key={index} className="space-y-2">
              <div className={`rounded-lg p-4 ${example.bg}`}>
                <div
                  style={{
                    fontFamily: typography.fontFamily,
                    fontSize: `${typography.fontSize}px`,
                    fontWeight: typography.fontWeight,
                    fontStyle: typography.fontStyle,
                    textTransform: typography.textTransform as any,
                    textDecoration: typography.textDecoration,
                    lineHeight: typography.lineHeight,
                    letterSpacing: `${typography.letterSpacing}em`,
                    wordSpacing: `${typography.wordSpacing}em`,
                  }}
                >
                  {example.text}
                </div>
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{example.context}</p>
                <p className="text-xs text-muted-foreground">
                  {getContextDescription(example.context)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Size Variants */}
      <div>
        <p className="text-sm font-medium mb-4">Variantes de Tamaño</p>
        <div className="flex items-center gap-8 overflow-x-auto pb-4">
          {getSizeVariants(typography.fontSize).map((variant, index) => (
            <div key={index} className="space-y-2 text-center shrink-0">
              <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center min-w-24">
                <div
                  style={{
                    fontFamily: typography.fontFamily,
                    fontSize: `${variant.size}px`,
                    fontWeight: typography.fontWeight,
                    fontStyle: typography.fontStyle,
                    textTransform: typography.textTransform as any,
                    textDecoration: typography.textDecoration,
                    lineHeight: typography.lineHeight,
                    letterSpacing: `${typography.letterSpacing}em`,
                    wordSpacing: `${typography.wordSpacing}em`,
                  }}
                >
                  Aa
                </div>
              </div>
              <div>
                <p className="font-medium text-sm">{variant.label}</p>
                <p className="text-xs text-muted-foreground">{variant.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weight Variants */}
      <div>
        <p className="text-sm font-medium mb-4">Variantes de Peso</p>
        <div className="flex items-center gap-6 overflow-x-auto pb-4">
          {WEIGHT_VARIANTS.map((variant, index) => (
            <div key={index} className="space-y-2 text-center shrink-0">
              <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center min-w-20">
                <div
                  style={{
                    fontFamily: typography.fontFamily,
                    fontSize: `${typography.fontSize}px`,
                    fontWeight: variant.weight,
                    fontStyle: typography.fontStyle,
                    textTransform: typography.textTransform as any,
                    textDecoration: typography.textDecoration,
                    lineHeight: typography.lineHeight,
                    letterSpacing: `${typography.letterSpacing}em`,
                    wordSpacing: `${typography.wordSpacing}em`,
                  }}
                >
                  Aa
                </div>
              </div>
              <div>
                <p className="font-medium text-sm">{variant.label}</p>
                <p className="text-xs text-muted-foreground">{variant.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Configuration Preview */}
      <div>
        <p className="text-sm font-medium mb-4">Configuración Actual</p>
        <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 p-6">
          <div
            style={{
              fontFamily: typography.fontFamily,
              fontSize: `${typography.fontSize}px`,
              fontWeight: typography.fontWeight,
              fontStyle: typography.fontStyle,
              textTransform: typography.textTransform as any,
              textDecoration: typography.textDecoration,
              lineHeight: typography.lineHeight,
              letterSpacing: `${typography.letterSpacing}em`,
              wordSpacing: `${typography.wordSpacing}em`,
            }}
          >
            {previewText}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {description} • Esta configuración se actualiza en tiempo real mientras editas
          </p>
        </div>
      </div>
    </div>
  );
}

export function TypographyEditor({ 
  typography, 
  onChange,
  className 
}: TypographyEditorProps) {

  const handleStyleChange = (category: keyof ThemeTypography, updates: Partial<TypographyStyle>) => {
    onChange({
      ...typography,
      [category]: {
        ...typography[category],
        ...updates,
      },
    });
  };

  const handleResetCategory = (category: keyof ThemeTypography) => {
    onChange({
      ...typography,
      [category]: DEFAULT_TYPOGRAPHY[category],
    });
  };

  const handleResetAll = () => {
    onChange(DEFAULT_TYPOGRAPHY);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Editor de Tipografía</h2>
          <p className="text-muted-foreground">
            Personaliza la tipografía de tu tema
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetAll}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Restablecer todo
        </Button>
      </div>

      <ScrollArea className="h-[600px] px-4">
        {TYPOGRAPHY_CATEGORIES.map((category) => (
          <TypographyControlSection
            key={category.id}
            title={category.label}
            icon={category.icon}
            typography={typography[category.id as keyof ThemeTypography]}
            previewText={category.previewText}
            categoryId={category.id}
            expanded={category.id === 'h1'} // Expand H1 by default
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResetCategory(category.id as keyof ThemeTypography)}
                  className="gap-2"
                >
                  <RotateCcw className="h-3 w-3" />
                  Restablecer
                </Button>
              </div>

              <TypographyControl
                title={category.label}
                value={typography[category.id as keyof ThemeTypography]}
                onChange={(updates) => 
                  handleStyleChange(category.id as keyof ThemeTypography, updates)
                }
              />

              {/* Simple preview for left side */}
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Vista previa básica
                </h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div
                    style={{
                      fontFamily: typography[category.id as keyof ThemeTypography].fontFamily,
                      fontSize: `${typography[category.id as keyof ThemeTypography].fontSize}px`,
                      fontWeight: typography[category.id as keyof ThemeTypography].fontWeight,
                      fontStyle: typography[category.id as keyof ThemeTypography].fontStyle,
                      textTransform: typography[category.id as keyof ThemeTypography].textTransform as any,
                      textDecoration: typography[category.id as keyof ThemeTypography].textDecoration,
                      lineHeight: typography[category.id as keyof ThemeTypography].lineHeight,
                      letterSpacing: `${typography[category.id as keyof ThemeTypography].letterSpacing}em`,
                      wordSpacing: `${typography[category.id as keyof ThemeTypography].wordSpacing}em`,
                    }}
                  >
                    {category.previewText}
                  </div>
                </div>
              </div>
            </div>
          </TypographyControlSection>
        ))}
      </ScrollArea>
    </div>
  );
}

function getPreviewContent(category: string): string {
  const content = {
    base: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    accent: 'Este es un texto importante que necesita destacarse del resto. Úsalo para enfatizar puntos clave o llamadas a la acción.',
    quote: '"El diseño no es solo cómo se ve o cómo se siente. El diseño es cómo funciona." - Steve Jobs',
    h1: 'Construye experiencias increíbles',
    h2: 'Diseña con propósito y precisión',
    h3: 'Herramientas modernas para desarrolladores',
    h4: 'Optimiza tu flujo de trabajo',
    h5: 'Comienza tu proyecto hoy',
  };

  return content[category as keyof typeof content] || content.base;
}