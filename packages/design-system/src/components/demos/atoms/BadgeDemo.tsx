import React from 'react';
import Typography from '../../atoms/Typography';
import Badge from '../../atoms/Badge';
import Icon from '../../atoms/Icon';

const BadgeDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Variantes:</Typography>
        <div className="flex items-center space-x-4">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Tamaños:</Typography>
        <div className="flex items-center space-x-4">
          <Badge variant="primary" size="sm">Pequeño</Badge>
          <Badge variant="primary" size="md">Medio</Badge>
          <Badge variant="primary" size="lg">Grande</Badge>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Uso con números:</Typography>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
              <Icon name="Bell" size="md" />
            </div>
            <Badge variant="error" size="sm" className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
              3
            </Badge>
          </div>
          <div className="relative">
            <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
              <Icon name="Mail" size="md" />
            </div>
            <Badge variant="warning" size="sm" className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
              12
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDemo;