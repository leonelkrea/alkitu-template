import React from 'react';
import Typography from '../../atoms/Typography';
import Spinner from '../../atoms/Spinner';

const SpinnerDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Tamaños:</Typography>
        <div className="flex items-center space-x-6">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Colores:</Typography>
        <div className="flex items-center space-x-6">
          <Spinner size="lg" color="primary" />
          <Spinner size="lg" color="secondary" />
          <Spinner size="lg" color="neutral" />
          <Spinner size="lg" color="white" />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Con texto:</Typography>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Spinner size="sm" />
            <Typography variant="p" size="sm">Cargando...</Typography>
          </div>
          <div className="flex items-center space-x-3">
            <Spinner size="md" color="primary" />
            <Typography variant="p">Procesando solicitud...</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinnerDemo;