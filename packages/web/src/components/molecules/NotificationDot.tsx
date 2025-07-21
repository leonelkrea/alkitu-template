import React from 'react';
import Badge from '../atoms/Badge';
import Typography from '../atoms/Typography';

export interface NotificationDotProps {
  count?: number;
  showZero?: boolean;
  max?: number;
  dot?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  // Props para usar el componente como un simple dot sin children
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
}

const NotificationDot: React.FC<NotificationDotProps> = ({
  count = 0,
  showZero = false,
  max = 99,
  dot = false,
  variant = 'error',
  color, // Alias para variant cuando se usa como simple dot
  size = 'sm',
  children,
  className = '',
  ...props
}) => {
  // Si se usa como simple dot sin children
  if (!children && (dot || color)) {
    const dotVariant = color || variant;
    const sizeClasses = {
      'sm': 'w-2 h-2',
      'md': 'w-3 h-3',
      'lg': 'w-4 h-4'
    }[size];

    const colorClasses = {
      'primary': 'bg-design-primary',
      'secondary': 'bg-design-secondary',
      'success': 'bg-success',
      'warning': 'bg-warning',
      'error': 'bg-error',
      'neutral': 'bg-neutral-600'
    }[dotVariant];

    return (
      <div 
        className={`${sizeClasses} ${colorClasses} rounded-full border-2 border-white ${className}`}
        {...props}
      />
    );
  }

  // Uso normal con children
  const shouldShow = dot || count > 0 || (count === 0 && showZero);
  const displayCount = count > max ? `${max}+` : count.toString();

  const positionClasses = {
    'sm': '-top-1 -right-1',
    'md': '-top-1.5 -right-1.5',
    'lg': '-top-2 -right-2'
  }[size];

  const badgeSize = {
    'sm': 'sm' as const,
    'md': 'sm' as const,
    'lg': 'md' as const
  }[size];

  const dotSizeClasses = {
    'sm': 'w-3 h-3',
    'md': 'w-3.5 h-3.5',
    'lg': 'w-4 h-4'
  }[size];

  if (!shouldShow && children) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      {children}
      
      {dot ? (
        <div 
          className={`
            absolute ${positionClasses} ${dotSizeClasses} rounded-full
            ${variant === 'primary' ? 'bg-design-primary' : ''}
            ${variant === 'secondary' ? 'bg-design-secondary' : ''}
            ${variant === 'success' ? 'bg-success' : ''}
            ${variant === 'warning' ? 'bg-warning' : ''}
            ${variant === 'error' ? 'bg-error' : ''}
            ${variant === 'neutral' ? 'bg-neutral-600' : ''}
            border-2 border-white shadow-sm
          `}
        />
      ) : (
        <div className={`absolute ${positionClasses} min-w-max`}>
          <Badge variant={variant} size={badgeSize} className="px-1.5 py-0.5 text-xs min-w-[20px] flex items-center justify-center">
            <Typography variant="p" size="xs" weight="medium">
              {displayCount}
            </Typography>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default NotificationDot;