import React from 'react';
import Typography from '../atoms/Typography';
import PreviewImage from '../atoms/PreviewImage';
import Icon from '../atoms/Icon';

export interface CardProps {
  variant?: 'square' | 'vertical' | 'horizontal';
  title: string;
  subtitle?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  icon?: {
    name: string;
    color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error';
  };
  location?: {
    icon: string;
    text: string;
  };
  metadata?: {
    label: string;
    value: string;
  }[];
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'vertical',
  title,
  subtitle,
  description,
  image,
  icon,
  location,
  metadata,
  onClick,
  className = '',
  children,
  ...restProps
}) => {
  const isClickable = !!onClick;

  const baseClasses = [
    'bg-card border border-border rounded-lg transition-all duration-200',
    isClickable ? 'cursor-pointer hover:shadow-md hover:border-design-primary/30' : '',
    className
  ].filter(Boolean).join(' ');

  // Only pass valid DOM attributes to div elements
  const validDOMProps = Object.keys(restProps).reduce((acc, key) => {
    // Only allow standard HTML attributes and data-* attributes
    if (key.startsWith('data-') || key.startsWith('aria-') || ['id', 'role', 'tabIndex'].includes(key)) {
      acc[key] = restProps[key];
    }
    return acc;
  }, {} as Record<string, any>);

  const renderSquareCard = () => (
    <div className={`${baseClasses} w-64 h-64 overflow-hidden`} onClick={onClick} {...validDOMProps}>
      {/* Image Section */}
      {image && (
        <div className="w-full h-48 overflow-hidden">
          <PreviewImage
            src={image.src}
            alt={image.alt}
            width={256}
            height={192}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Content Section */}
      <div className="p-4 h-16 flex flex-col justify-center">
        <Typography variant="h4" weight="medium" className="truncate">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="p" size="sm" color="muted" className="truncate">
            {subtitle}
          </Typography>
        )}
      </div>
    </div>
  );

  const renderVerticalCard = () => (
    <div className={`${baseClasses} overflow-hidden`} onClick={onClick} {...validDOMProps}>
      {/* Image Section */}
      {image && (
        <div className="w-full h-48 overflow-hidden">
          <PreviewImage
            src={image.src}
            alt={image.alt}
            width={400}
            height={192}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Content Section */}
      <div className="p-6 space-y-3">
        <div className="space-y-2">
          <Typography variant="h3" weight="medium">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="p" size="sm" color="muted">
              {subtitle}
            </Typography>
          )}
        </div>
        
        {description && (
          <Typography variant="p" size="md" color="inherit">
            {description}
          </Typography>
        )}
        
        {metadata && metadata.length > 0 && (
          <div className="space-y-1">
            {metadata.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <Typography variant="p" size="sm" color="muted">
                  {item.label}
                </Typography>
                <Typography variant="p" size="sm" weight="medium">
                  {item.value}
                </Typography>
              </div>
            ))}
          </div>
        )}
        
        {children}
      </div>
    </div>
  );

  const renderHorizontalCard = () => (
    <div className={`${baseClasses} flex overflow-hidden`} onClick={onClick} {...validDOMProps}>
      {/* Icon Section */}
      {icon && (
        <div className="flex-shrink-0 w-16 h-16 bg-accent rounded-lg m-4 flex items-center justify-center">
          <Icon 
            name={icon.name as any} 
            size="lg" 
            color={icon.color || 'primary'} 
          />
        </div>
      )}
      
      {/* Content Section */}
      <div className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          <Typography variant="h4" weight="medium">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="p" size="sm" color="muted">
              {subtitle}
            </Typography>
          )}
        </div>
        
        {location && (
          <div className="flex items-center space-x-2">
            <Icon name={location.icon as any} size="sm" color="muted" />
            <Typography variant="p" size="sm" color="muted">
              {location.text}
            </Typography>
          </div>
        )}
        
        {description && (
          <Typography variant="p" size="sm" color="inherit" className="line-clamp-2">
            {description}
          </Typography>
        )}
        
        {children}
      </div>
    </div>
  );

  switch (variant) {
    case 'square':
      return renderSquareCard();
    case 'horizontal':
      return renderHorizontalCard();
    case 'vertical':
    default:
      return renderVerticalCard();
  }
};

export default Card;