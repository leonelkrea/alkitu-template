import React from 'react';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Icon from '../../atoms/Icon';

const CardDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Card básica:</Typography>
        <div className="max-w-md">
          <Card
            title="Título de la tarjeta"
            description="Esta es una descripción de ejemplo para mostrar cómo se ve el contenido en una tarjeta."
          >
            <div className="mt-4">
              <Typography variant="p" size="sm">
                Contenido adicional de la tarjeta puede ir aquí.
              </Typography>
            </div>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Card con imagen:</Typography>
        <div className="max-w-md">
          <Card
            title="Servicios IT"
            description="Soluciones tecnológicas para tu empresa"
            image={{
              src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop",
              alt: "Servicios IT"
            }}
          >
            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size="sm" color="success" />
                <Typography variant="p" size="sm">Soporte 24/7</Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size="sm" color="success" />
                <Typography variant="p" size="sm">Configuración remota</Typography>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Card con acciones:</Typography>
        <div className="max-w-md">
          <Card
            title="Nuevo proyecto"
            description="Crear un nuevo proyecto en el sistema"
            actions={
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Cancelar</Button>
                <Button variant="primary" size="sm">Crear</Button>
              </div>
            }
          >
            <div className="mt-4">
              <Typography variant="p" size="sm" color="muted">
                El proyecto se creará con la configuración por defecto.
              </Typography>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CardDemo;