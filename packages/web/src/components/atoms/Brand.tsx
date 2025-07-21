import React from 'react';
import Icon from './Icon';
import Typography from './Typography';
import { useBranding } from '../../context/BrandingContext';

export interface BrandProps {
  variant?: 'horizontal' | 'vertical' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'default' | 'white' | 'monochrome';
  className?: string;
  // Props opcionales para override manual (útil para casos especiales)
  customSvg?: string;
  customText?: {
    primary: string;
    secondary: string;
  };
  textColors?: {
    primary: string;
    secondary: string;
  };
  iconScale?: number;
  iconOffsetX?: number;
  iconOffsetY?: number;
}

const Brand: React.FC<BrandProps> = ({
  variant = 'horizontal',
  size = 'md',
  color = 'default',
  className = '',
  // Props de override
  customSvg: overrideSvg,
  customText: overrideText,
  textColors: overrideTextColors,
  iconScale: overrideScale,
  iconOffsetX: overrideOffsetX,
  iconOffsetY: overrideOffsetY,
  ...props
}) => {
  // Usar el contexto global de branding
  const { config } = useBranding();

  // Determinar valores finales (prioridad: props > contexto > default)
  const finalSvg = overrideSvg !== undefined ? overrideSvg : config.customSvg;
  const finalText = overrideText || config.customText;
  const finalTextColors = overrideTextColors || config.textColors;
  const finalScale =
    overrideScale !== undefined ? overrideScale : config.iconScale;
  const finalOffsetX =
    overrideOffsetX !== undefined ? overrideOffsetX : config.iconOffsetX;
  const finalOffsetY =
    overrideOffsetY !== undefined ? overrideOffsetY : config.iconOffsetY;

  // Clases de tamaño para el contenedor del icono
  const iconContainerSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Tamaños de texto para las variantes
  const textSizes = {
    sm: { primary: 'sm', secondary: 'xs' },
    md: { primary: 'base', secondary: 'sm' },
    lg: { primary: 'lg', secondary: 'base' },
    xl: { primary: 'xl', secondary: 'lg' },
  };

  // Tamaños de SVG basados en el tamaño del contenedor
  const svgSizes = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 56,
  };

  // Clases de color
  const getColorClasses = () => {
    switch (color) {
      case 'white':
        return {
          container: '',
          primary: 'text-white',
          secondary: 'text-white/80',
          icon: 'text-white',
        };
      case 'monochrome':
        return {
          container: '',
          primary: 'text-neutral-900',
          secondary: 'text-neutral-800',
          icon: 'text-neutral-900',
        };
      default:
        return {
          container: '',
          primary: 'text-foreground',
          secondary: 'text-muted-foreground',
          icon: 'text-design-primary',
        };
    }
  };

  const colorClasses = getColorClasses();

  // Renderizar el icono
  const renderIcon = () => {
    const baseSize = svgSizes[size];
    const scaledSize = Math.round(baseSize * finalScale);

    if (finalSvg) {
      // SVG personalizado - Arreglar overflow
      return (
        <div
          className={`${iconContainerSizes[size]} rounded-xl flex items-center justify-center relative`}
          style={{
            background:
              color === 'white'
                ? 'rgba(255,255,255,0.1)'
                : color === 'monochrome'
                  ? 'transparent'
                  : 'var(--design-primary)',
            // Remover overflow hidden para permitir que el SVG se extienda si es necesario
            overflow: 'visible',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: scaledSize,
              height: scaledSize,
              transform: `translate(${finalOffsetX}px, ${finalOffsetY}px)`,
              // Asegurar que el contenedor del SVG no esté limitado
              overflow: 'visible',
            }}
          >
            <svg
              width={scaledSize}
              height={scaledSize}
              viewBox="0 0 48 48"
              className={colorClasses.icon}
              style={{
                // Arreglar el filtro para tema oscuro y monochrome
                filter:
                  color === 'white'
                    ? 'brightness(0) invert(1)'
                    : color === 'monochrome'
                      ? 'brightness(0)'
                      : 'none',
                // Asegurar que el SVG no se corte
                overflow: 'visible',
              }}
              dangerouslySetInnerHTML={{ __html: finalSvg }}
            />
          </div>
        </div>
      );
    }

    // Icono por defecto
    return (
      <div
        className={`${iconContainerSizes[size]} rounded-xl flex items-center justify-center`}
        style={{
          background:
            color === 'white'
              ? 'rgba(255,255,255,0.1)'
              : color === 'monochrome'
                ? 'transparent'
                : 'var(--design-primary)',
        }}
      >
        <Icon
          name="Zap"
          size={size === 'sm' ? 'sm' : size === 'xl' ? 'lg' : 'md'}
          className={
            color === 'white'
              ? 'text-white'
              : color === 'monochrome'
                ? 'text-neutral-900'
                : 'text-neutral-900'
          }
        />
      </div>
    );
  };

  // Renderizar texto con colores personalizados
  const renderText = () => {
    if (!finalText.primary) return null;

    // Determinar si usar colores personalizados (solo para color 'default')
    const useCustomColors = color === 'default';

    // Clases de centrado para variante vertical
    const centerClasses = variant === 'vertical' ? 'text-center' : '';

    // Clases de color
    const primaryColorClass = useCustomColors ? '' : colorClasses.primary;
    const secondaryColorClass = useCustomColors ? '' : colorClasses.secondary;

    return (
      <div className={centerClasses}>
        <Typography
          variant="h3"
          weight="bold"
          size={textSizes[size].primary as any}
          className={`${primaryColorClass} ${centerClasses}`}
          color={finalTextColors.primary as any}
          align={variant === 'vertical' ? 'center' : undefined}
        >
          {finalText.primary}
        </Typography>
        {finalText.secondary && (
          <Typography
            variant="p"
            size={textSizes[size].secondary as any}
            className={`${secondaryColorClass} ${centerClasses}`}
            color={finalTextColors.secondary as any}
            align={variant === 'vertical' ? 'center' : undefined}
          >
            {finalText.secondary}
          </Typography>
        )}
      </div>
    );
  };

  // Renderizar según la variante
  const renderContent = () => {
    switch (variant) {
      case 'icon':
        return renderIcon();

      case 'vertical':
        return (
          <div className="flex flex-col items-center space-y-3">
            {renderIcon()}
            {renderText()}
          </div>
        );

      case 'horizontal':
      default:
        return (
          <div className="flex items-center space-x-3">
            {renderIcon()}
            {renderText()}
          </div>
        );
    }
  };

  return (
    <div className={`flex-shrink-0 ${className}`} {...props}>
      {renderContent()}
    </div>
  );
};

export default Brand;
