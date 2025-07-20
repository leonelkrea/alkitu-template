import React from 'react';
import Typography from '../../atoms/Typography';
import Tooltip from '../../atoms/Tooltip';
import Button from '../../atoms/Button';
import Icon from '../../atoms/Icon';

const TooltipDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Posiciones:</Typography>
        <div className="flex items-center justify-center space-x-8 py-12">
          <Tooltip content="Tooltip arriba" position="top">
            <Button variant="outline">Arriba</Button>
          </Tooltip>
          <Tooltip content="Tooltip abajo" position="bottom">
            <Button variant="outline">Abajo</Button>
          </Tooltip>
          <Tooltip content="Tooltip izquierda" position="left">
            <Button variant="outline">Izquierda</Button>
          </Tooltip>
          <Tooltip content="Tooltip derecha" position="right">
            <Button variant="outline">Derecha</Button>
          </Tooltip>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Con iconos:</Typography>
        <div className="flex items-center space-x-6">
          <Tooltip content="Información importante">
            <Icon name="Info" size="lg" color="primary" className="cursor-help" />
          </Tooltip>
          <Tooltip content="Configuración">
            <Icon name="Settings" size="lg" color="muted" className="cursor-help" />
          </Tooltip>
          <Tooltip content="Ayuda">
            <Icon name="HelpCircle" size="lg" color="secondary" className="cursor-help" />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default TooltipDemo;