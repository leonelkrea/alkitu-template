import React from 'react';
import Card from './Card';
import Badge from '../atoms/Badge';
import Typography from '../atoms/Typography';
import PreviewImage from '../atoms/PreviewImage';

export interface ServiceCardProps {
  id: string;
  title: string;
  description?: string;
  category?: string;
  image: {
    src: string;
    alt: string;
  };
  status?: 'active' | 'inactive' | 'maintenance';
  features?: string[];
  price?: {
    amount: number;
    currency: string;
    period?: string;
  };
  rating?: {
    value: number;
    total: number;
  };
  onClick?: (id: string) => void;
  className?: string;
  variant?: 'full' | 'simple'; // Nueva prop para controlar la variante
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  category,
  image,
  status,
  features,
  price,
  rating,
  onClick,
  className = '',
  variant = 'full',
  ...props
}) => {
  const statusConfig = {
    'active': { variant: 'success' as const, label: 'Activo' },
    'inactive': { variant: 'neutral' as const, label: 'Inactivo' },
    'maintenance': { variant: 'warning' as const, label: 'Mantenimiento' }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  // Variante simple: solo imagen y título
  if (variant === 'simple') {
    return (
      <div 
        className={`bg-card border border-border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:border-design-primary/50 ${className}`}
        onClick={handleClick}
        {...props}
      >
        <div className="aspect-video relative overflow-hidden">
          <PreviewImage
            src={image.src}
            alt={image.alt}
            width="100%"
            height="100%"
            objectFit="cover"
            className="transition-transform duration-200 hover:scale-105"
          />
          {status && (
            <div className="absolute top-3 right-3">
              <Badge variant={statusConfig[status].variant} size="sm">
                {statusConfig[status].label}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <Typography variant="h4" size="sm" weight="medium" className="line-clamp-2">
            {title}
          </Typography>
          {category && (
            <Typography variant="p" size="xs" color="muted" className="mt-1">
              {category}
            </Typography>
          )}
        </div>
      </div>
    );
  }

  // Variante completa (original)
  const metadata = [
    ...(category ? [{ label: 'Categoría', value: category }] : []),
    ...(price ? [{ 
      label: 'Precio', 
      value: `${price.currency}${price.amount}${price.period ? `/${price.period}` : ''}` 
    }] : []),
    ...(rating ? [{ 
      label: 'Calificación', 
      value: `${rating.value}/5 (${rating.total} reviews)` 
    }] : []),
  ];

  return (
    <Card
      variant="vertical"
      title={title}
      description={description}
      image={image}
      metadata={metadata}
      onClick={handleClick}
      className={className}
      {...props}
    >
      <div className="space-y-3 pt-2 border-t border-border">
        {status && (
          <div className="flex items-center justify-between">
            <Badge variant={statusConfig[status].variant} size="sm">
              {statusConfig[status].label}
            </Badge>
          </div>
        )}
        
        {features && features.length > 0 && (
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium" color="muted">
              Características:
            </Typography>
            <div className="space-y-1">
              {features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <Typography variant="p" size="xs" color="inherit">
                    {feature}
                  </Typography>
                </div>
              ))}
              {features.length > 3 && (
                <Typography variant="p" size="xs" color="muted">
                  +{features.length - 3} más
                </Typography>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ServiceCard;