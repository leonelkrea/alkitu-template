import React from 'react';
import Typography from '../atoms/Typography';

const DefaultDemo: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <Typography variant="p" color="muted">
        Selecciona un componente del sidebar para ver su demo
      </Typography>
    </div>
  );
};

export default DefaultDemo;