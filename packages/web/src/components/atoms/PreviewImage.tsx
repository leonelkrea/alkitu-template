import React, { useState } from 'react';
import Spinner from './Spinner';
import Icon from './Icon';

export interface PreviewImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  fallback?: React.ReactNode;
  loading?: 'lazy' | 'eager';
  className?: string;
  showOverlay?: boolean;
  onView?: () => void;
  onDownload?: () => void;
}

const PreviewImage: React.FC<PreviewImageProps> = ({
  src,
  alt = '',
  width = 250,  // Default width más razonable
  height = 200, // Default height más razonable
  objectFit = 'cover',
  rounded = 'md',
  fallback,
  loading = 'lazy',
  className = '',
  showOverlay = false,
  onView,
  onDownload,
  ...props
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');

  const roundedClasses = {
    'none': '',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'full': 'rounded-full'
  }[rounded];

  const objectFitClasses = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down'
  }[objectFit];

  const containerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const containerClasses = [
    'relative inline-block overflow-hidden bg-neutral-200',
    roundedClasses,
    className
  ].filter(Boolean).join(' ');

  const handleImageLoad = () => {
    setImageState('loaded');
  };

  const handleImageError = () => {
    setImageState('error');
  };

  const renderContent = () => {
    switch (imageState) {
      case 'loading':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <Spinner size="md" color="primary" />
          </div>
        );

      case 'error':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            {fallback || (
              <div className="flex flex-col items-center space-y-2 text-neutral-500 p-4">
                <Icon name="Image" size="lg" />
                <span className="text-xs text-center">Error al cargar imagen</span>
              </div>
            )}
          </div>
        );

      case 'loaded':
        return null;

      default:
        return null;
    }
  };

  return (
    <div className={containerClasses} style={containerStyle}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={`w-full h-full ${objectFitClasses} ${
          imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-200`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
      {renderContent()}
      
      {/* Overlay de acciones */}
      {showOverlay && imageState === 'loaded' && (
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
          {onView && (
            <button
              onClick={onView}
              className="bg-white text-neutral-900 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              title="Ver imagen"
            >
              <Icon name="Eye" size="sm" />
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              className="bg-white text-neutral-900 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              title="Descargar imagen"
            >
              <Icon name="Download" size="sm" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PreviewImage;