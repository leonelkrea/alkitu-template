import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import type { AvatarProps, AvatarSize, AvatarVariant } from './Avatar.types';

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const variantClasses: Record<AvatarVariant, string> = {
  circular: 'rounded-full',
  rounded: 'rounded-md',
  square: 'rounded-none',
};

const baseClasses = 'relative flex shrink-0 overflow-hidden bg-muted';

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  variant = 'circular',
  fallback,
  className,
  themeOverride,
  useSystemColors = true,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClass = sizeClasses[size];
  const variantClass = variantClasses[variant];

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getFallbackInitials = () => {
    if (fallback) return fallback;
    
    const words = alt.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return alt.substring(0, 2).toUpperCase();
  };

  return (
    <span
      className={cn(baseClasses, sizeClass, variantClass, className)}
      style={themeOverride}
      {...props}
    >
      {src && !imageError ? (
        <img
          className="aspect-square h-full w-full object-cover"
          src={src}
          alt={alt}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-muted font-medium text-muted-foreground">
          {getFallbackInitials()}
        </span>
      )}
    </span>
  );
};

export default Avatar;