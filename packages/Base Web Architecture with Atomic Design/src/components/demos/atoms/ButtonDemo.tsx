import React from 'react';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';

const ButtonDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Variantes:</Typography>
        <div className="flex items-center space-x-4 flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Tamaños:</Typography>
        <div className="flex items-center space-x-4">
          <Button variant="primary" size="sm">Pequeño</Button>
          <Button variant="primary" size="md">Medio</Button>
          <Button variant="primary" size="lg">Grande</Button>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Con iconos:</Typography>
        <div className="flex items-center space-x-4 flex-wrap gap-3">
          <Button variant="primary" icon="Plus" iconPosition="left">Agregar</Button>
          <Button variant="outline" icon="Download" iconPosition="right">Descargar</Button>
          <Button variant="secondary" icon="Edit">Editar</Button>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Estados:</Typography>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 flex-wrap gap-3">
            <Button variant="primary" loading>Guardando...</Button>
            <Button variant="outline" disabled>Deshabilitado</Button>
          </div>
          <Button variant="primary" fullWidth>Ancho completo</Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonDemo;