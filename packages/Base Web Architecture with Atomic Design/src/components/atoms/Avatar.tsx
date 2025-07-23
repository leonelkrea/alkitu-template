import React, { useState } from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  onClick?: () => void;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({
  src,
  alt,
  fallback,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  onClick,
  ...props
}, ref) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    'xs': 'w-6 h-6 text-xs',
    'sm': 'w-8 h-8 text-sm',
    'md': 'w-10 h-10 text-base',
    'lg': 'w-12 h-12 text-lg',
    'xl': 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  }[size];

  const shapeClasses = {
    'circle': 'rounded-full',
    'square': 'rounded-lg'
  }[shape];

  const statusColors = {
    'online': 'bg-success',
    'offline': 'bg-neutral-500',
    'away': 'bg-warning',
    'busy': 'bg-error'
  };

  // Configuración correcta del status dot usando clases Tailwind válidas
  const statusConfig = {
    'xs': { 
      size: 'w-2 h-2', 
      position: '-top-0.5 -right-0.5', 
      border: 'border'
    },
    'sm': { 
      size: 'w-2.5 h-2.5', 
      position: '-top-0.5 -right-0.5', 
      border: 'border-2'
    },
    'md': { 
      size: 'w-3 h-3', 
      position: '-top-0.5 -right-0.5', 
      border: 'border-2'
    },
    'lg': { 
      size: 'w-3.5 h-3.5', 
      position: '-top-1 -right-1', 
      border: 'border-2'
    },
    'xl': { 
      size: 'w-4 h-4', 
      position: '-top-1 -right-1', 
      border: 'border-2'
    },
    '2xl': { 
      size: 'w-5 h-5', 
      position: '-top-1.5 -right-1.5', 
      border: 'border-2'
    }
  }[size];

  const classes = [
    sizeClasses,
    shapeClasses,
    'relative inline-flex items-center justify-center overflow-hidden bg-accent-light font-medium text-primary-dark transition-all duration-200',
    onClick ? 'cursor-pointer hover:opacity-80' : '',
    className
  ].filter(Boolean).join(' ');

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const showImage = src && !imageError;
  const showFallback = !showImage && fallback;

  return (
    <div ref={ref} className={classes} onClick={onClick} {...props}>
      {showImage && (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className={`w-full h-full object-cover ${shapeClasses} ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      
      {showFallback && (
        <span className="select-none">
          {getInitials(fallback)}
        </span>
      )}

      {!showImage && !showFallback && (
        <div className={`w-full h-full bg-neutral-300 ${shapeClasses} flex items-center justify-center`}>
          <svg
            className="w-1/2 h-1/2 text-neutral-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {status && (
        <div 
          className={`
            absolute ${statusConfig.position} ${statusConfig.size} ${statusColors[status]} 
            rounded-full ${statusConfig.border} border-white z-30 shadow-sm
          `} 
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;