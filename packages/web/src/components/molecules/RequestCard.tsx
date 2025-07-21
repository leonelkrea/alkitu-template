import React from 'react';
import Card from './Card';
import Badge from '../atoms/Badge';
import Typography from '../atoms/Typography';

export interface RequestCardProps {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress';
  requestType: string;
  requestDate: string;
  image?: {
    src: string;
    alt: string;
  };
  priority?: 'low' | 'medium' | 'high';
  onClick?: (id: string) => void;
  className?: string;
}

const RequestCard: React.FC<RequestCardProps> = ({
  id,
  title,
  description,
  status,
  requestType,
  requestDate,
  image,
  priority = 'medium',
  onClick,
  className = '',
  ...restProps
}) => {
  const statusConfig = {
    pending: { variant: 'warning' as const, label: 'Pendiente' },
    approved: { variant: 'success' as const, label: 'Aprobado' },
    rejected: { variant: 'error' as const, label: 'Rechazado' },
    'in-progress': { variant: 'primary' as const, label: 'En Progreso' },
  };

  const priorityConfig = {
    low: { variant: 'neutral' as const, label: 'Baja' },
    medium: { variant: 'warning' as const, label: 'Media' },
    high: { variant: 'error' as const, label: 'Alta' },
  };

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  const metadata = [
    { label: 'Tipo', value: requestType },
    { label: 'Fecha', value: requestDate },
  ];

  // Only pass valid Card props, filter out RequestCard-specific props
  const cardProps = {
    variant: 'vertical' as const,
    title,
    description,
    image,
    metadata,
    onClick: handleClick,
    className,
    // Only pass valid DOM attributes
    ...Object.keys(restProps).reduce(
      (acc, key) => {
        if (
          key.startsWith('data-') ||
          key.startsWith('aria-') ||
          ['id', 'role', 'tabIndex'].includes(key)
        ) {
          acc[key] = restProps[key as keyof typeof restProps];
        }
        return acc;
      },
      {} as Record<string, any>,
    ),
  };

  return (
    <Card {...cardProps}>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center space-x-2">
          <Badge variant={statusConfig[status].variant} size="sm">
            {statusConfig[status].label}
          </Badge>
          <Badge variant={priorityConfig[priority].variant} size="sm">
            Prioridad {priorityConfig[priority].label}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default RequestCard;
