import { cn } from '@/lib/utils';
import React from 'react';
import { Typography } from '../typography';
import { Icon } from '../icons';
import type { BrandProps, BrandVariant, BrandSize, MonochromeMode } from './Brand.types';

// SVG Filters for monochromatic versions
const SVGFilters = () => (
  <svg className="absolute inset-0 w-0 h-0 pointer-events-none" aria-hidden="true">
    <defs>
      {/* Robust white filter */}
      <filter id="white-filter" x="0%" y="0%" width="100%" height="100%">
        <feColorMatrix type="matrix" values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 1 0" />
      </filter>
      {/* Robust black filter */}
      <filter id="black-filter" x="0%" y="0%" width="100%" height="100%">
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0" />
      </filter>
    </defs>
  </svg>
);

const sizeClasses: Record<BrandSize, {
  container: string;
  logo: string;
  text: string;
  tagline: string;
}> = {
  xs: {
    container: 'gap-1.5',
    logo: 'h-4 w-4',
    text: 'text-sm',
    tagline: 'text-xs',
  },
  sm: {
    container: 'gap-2',
    logo: 'h-5 w-5',
    text: 'text-base',
    tagline: 'text-sm',
  },
  md: {
    container: 'gap-2.5',
    logo: 'h-6 w-6',
    text: 'text-lg',
    tagline: 'text-sm',
  },
  lg: {
    container: 'gap-3',
    logo: 'h-8 w-8',
    text: 'text-xl',
    tagline: 'text-base',
  },
  xl: {
    container: 'gap-4',
    logo: 'h-10 w-10',
    text: 'text-2xl',
    tagline: 'text-lg',
  },
};

const variantClasses: Record<BrandVariant, string> = {
  horizontal: 'flex-row items-center',
  vertical: 'flex-col items-center text-center',
  'icon-only': 'flex-row items-center',
  'text-only': 'flex-row items-center',
  stacked: 'flex-col items-start text-left',
  compact: 'flex-row items-center',
};

const baseClasses = 'inline-flex transition-all duration-200 ease-in-out';

export const Brand: React.FC<BrandProps> = ({
  variant = 'horizontal',
  size = 'md',
  brandName = 'Alkitu',
  logoUrl,
  showTagline = false,
  tagline = 'Design System',
  onClick,
  clickable = false,
  className,
  themeOverride,
  useSystemColors = true,
  customSvg,
  primaryTextColor,
  secondaryTextColor,
  monochromeMode = 'none',
  iconBackgroundColor,
  iconColor,
  ...props
}) => {

  const sizeConfig = sizeClasses[size];
  const variantClass = variantClasses[variant];
  const isClickable = clickable || !!onClick;
  const clickableClass = isClickable ? 'cursor-pointer hover:opacity-90 hover:scale-105 active:scale-95' : '';

  const handleClick = () => {
    if (onClick && !clickable) return;
    if (onClick) onClick();
  };

  // Helper functions for icon colors
  const getIconBackgroundStyle = () => {
    if (useSystemColors || !iconBackgroundColor) {
      return undefined; // Use system colors (bg-primary class)
    }
    
    // Convert OKLCH or use direct color
    if (iconBackgroundColor.includes('%')) {
      return { backgroundColor: `oklch(${iconBackgroundColor})` };
    }
    
    return { backgroundColor: iconBackgroundColor };
  };

  const getIconColorStyle = () => {
    if (useSystemColors || !iconColor) {
      return undefined; // Use system colors (text-primary-foreground class)
    }
    
    // Convert OKLCH or use direct color
    if (iconColor.includes('%')) {
      return { color: `oklch(${iconColor})` };
    }
    
    return { color: iconColor };
  };

  const renderLogo = () => {
    if (variant === 'text-only') return null;

    // Custom SVG upload has priority
    if (customSvg) {
      const filterId = monochromeMode === 'white' ? 'white-filter' : 
                      monochromeMode === 'black' ? 'black-filter' : undefined;
      
      return (
        <div className={cn(
          sizeConfig.logo,
          'flex items-center justify-center relative overflow-visible'
        )}>
          <SVGFilters />
          <svg
            className="w-full h-full"
            viewBox="0 0 48 48"
            preserveAspectRatio="xMidYMid meet"
            style={{ 
              filter: filterId ? `url(#${filterId})` : undefined,
              display: 'block'
            }}
            dangerouslySetInnerHTML={{ __html: customSvg }}
          />
        </div>
      );
    }

    // Regular image URL
    if (logoUrl) {
      return (
        <img
          src={logoUrl}
          alt={`${brandName} logo`}
          className={cn(sizeConfig.logo, 'object-contain')}
        />
      );
    }

    // Default logo using Icon component with dynamic colors
    const backgroundStyle = getIconBackgroundStyle();
    const iconStyle = getIconColorStyle();
    
    return (
      <div 
        className={cn(
          sizeConfig.logo,
          'rounded-md flex items-center justify-center font-bold',
          sizeConfig.text,
          // Use system classes when no custom colors
          !iconBackgroundColor || useSystemColors ? 'bg-primary' : '',
          !iconColor || useSystemColors ? 'text-primary-foreground' : ''
        )}
        style={backgroundStyle}
      >
        <Icon 
          name="zap" 
          size="sm" 
          className="text-current" 
          style={iconStyle}
        />
      </div>
    );
  };

  const renderText = () => {
    if (variant === 'icon-only') return null;

    // Enhanced color logic for dark mode compatibility with system inheritance
    const getPrimaryStyle = () => {
      if (useSystemColors || !primaryTextColor) {
        return undefined; // Use system colors (text-foreground class)
      }
      
      // Convert OKLCH to CSS custom property for dark mode adaptation
      if (primaryTextColor.includes('%')) {
        // OKLCH format: "50% 0.2 180"
        return {
          color: `oklch(${primaryTextColor})`,
          // Add CSS custom property for dark mode
          '--brand-primary-light': `oklch(${primaryTextColor})`,
          '--brand-primary-dark': `oklch(85% 0.15 ${primaryTextColor.split(' ')[2] || '0'})`,
          color: 'var(--brand-primary-light)',
        } as React.CSSProperties;
      }
      
      return { color: primaryTextColor };
    };

    const getSecondaryStyle = () => {
      if (useSystemColors || !secondaryTextColor) {
        return undefined;
      }
      
      // Convert OKLCH to CSS custom property for dark mode adaptation
      if (secondaryTextColor.includes('%')) {
        // OKLCH format: "50% 0.2 180"
        return {
          color: `oklch(${secondaryTextColor})`,
          // Add CSS custom property for dark mode
          '--brand-secondary-light': `oklch(${secondaryTextColor})`,
          '--brand-secondary-dark': `oklch(70% 0.1 ${secondaryTextColor.split(' ')[2] || '0'})`,
          color: 'var(--brand-secondary-light)',
        } as React.CSSProperties;
      }
      
      return { color: secondaryTextColor };
    };

    const textAlignClass = variant === 'vertical' ? 'text-center' : 
                         variant === 'stacked' ? 'text-left' : '';
    
    return (
      <div className={textAlignClass}>
        <Typography
          variant="span"
          className={cn(
            sizeConfig.text,
            'font-bold',
            primaryTextColor && !useSystemColors 
              ? 'dark:[color:var(--brand-primary-dark)]' 
              : 'text-foreground' // System foreground color that adapts to light/dark
          )}
          style={getPrimaryStyle()}
        >
          {brandName}
        </Typography>
        {showTagline && tagline && (
          <Typography
            variant="span"
            className={cn(
              sizeConfig.tagline,
              'block',
              secondaryTextColor && !useSystemColors 
                ? 'dark:[color:var(--brand-secondary-dark)]' 
                : 'text-muted-foreground' // System muted-foreground that adapts to light/dark
            )}
            style={getSecondaryStyle()}
          >
            {tagline}
          </Typography>
        )}
      </div>
    );
  };

  const Component = isClickable ? 'button' : 'div';

  return (
    <Component
      className={cn(
        baseClasses,
        variantClass,
        sizeConfig.container,
        clickableClass,
        className
      )}
      style={themeOverride}
      onClick={handleClick}
      {...(isClickable && { type: 'button' })}
      {...props}
    >
      {renderLogo()}
      {renderText()}
    </Component>
  );
};

export default Brand;