import React from 'react';
import Typography from '../../atoms/Typography';
import Avatar from '../../atoms/Avatar';

const AvatarDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Tamaños:</Typography>
        <div className="flex items-center space-x-4">
          <Avatar
            src="https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face"
            alt="Usuario"
            size="sm"
          />
          <Avatar
            src="https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face"
            alt="Usuario"
            size="md"
          />
          <Avatar
            src="https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face"
            alt="Usuario"
            size="lg"
          />
          <Avatar
            src="https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face"
            alt="Usuario"
            size="xl"
          />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Con fallbacks:</Typography>
        <div className="flex items-center space-x-4">
          <Avatar
            src="imagen-rota.jpg"
            alt="Usuario"
            fallback="AG"
            size="lg"
          />
          <Avatar
            alt="Usuario sin imagen"
            fallback="JS"
            size="lg"
          />
          <Avatar
            alt="Usuario anónimo"
            size="lg"
          />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Con indicadores de estado:</Typography>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Usuario online"
              size="lg"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
          </div>
          <div className="relative">
            <Avatar
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Usuario ocupado"
              size="lg"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-warning rounded-full border-2 border-background"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarDemo;