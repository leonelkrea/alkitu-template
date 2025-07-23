import React from 'react';
import Typography from '../../atoms/Typography';
import Icon from '../../atoms/Icon';

const IconDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Tamaños:</Typography>
        <div className="flex items-center space-x-6">
          <Icon name="Star" size="xs" />
          <Icon name="Star" size="sm" />
          <Icon name="Star" size="md" />
          <Icon name="Star" size="lg" />
          <Icon name="Star" size="xl" />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Colores:</Typography>
        <div className="flex items-center space-x-6">
          <Icon name="Heart" size="lg" color="primary" />
          <Icon name="Heart" size="lg" color="secondary" />
          <Icon name="Heart" size="lg" color="success" />
          <Icon name="Heart" size="lg" color="warning" />
          <Icon name="Heart" size="lg" color="error" />
          <Icon name="Heart" size="lg" color="muted" />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Iconos comunes:</Typography>
        <div className="grid grid-cols-8 gap-6">
          {[
            'Home', 'User', 'Settings', 'Search', 'Bell', 'Mail', 'Calendar', 'FileText',
            'Edit', 'Trash2', 'Plus', 'Check', 'X', 'ChevronLeft', 'ChevronRight', 'Download'
          ].map((iconName) => (
            <div key={iconName} className="flex flex-col items-center space-y-3">
              <Icon name={iconName as any} size="lg" />
              <Typography variant="p" size="xs" className="text-center">
                {iconName}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconDemo;