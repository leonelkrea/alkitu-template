import React from 'react';
import Typography from '../../atoms/Typography';

const TypographyDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h1">Heading 1 - El título principal</Typography>
        <Typography variant="h2">Heading 2 - Subtítulo importante</Typography>
        <Typography variant="h3">Heading 3 - Sección</Typography>
        <Typography variant="h4">Heading 4 - Subsección</Typography>
        <Typography variant="p">Párrafo regular - Este es el texto principal que se usa para el contenido general de la aplicación.</Typography>
        <Typography variant="p" size="sm" color="muted">Texto pequeño y secundario</Typography>
      </div>
      
      <div className="space-y-6">
        <Typography variant="h4">Variantes de color:</Typography>
        <div className="space-y-3">
          <Typography variant="p" color="primary">Texto primario (#F2AB27)</Typography>
          <Typography variant="p" color="secondary">Texto secundario (#F2921D)</Typography>
          <Typography variant="p" color="muted">Texto silenciado</Typography>
          <Typography variant="p" color="inherit">Texto heredado</Typography>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Pesos de fuente:</Typography>
        <div className="space-y-3">
          <Typography variant="p" weight="regular">Peso regular (400)</Typography>
          <Typography variant="p" weight="medium">Peso medio (500)</Typography>
          <Typography variant="p" weight="bold">Peso bold (700)</Typography>
        </div>
      </div>
    </div>
  );
};

export default TypographyDemo;