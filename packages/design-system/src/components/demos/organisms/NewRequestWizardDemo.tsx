import React from 'react';
import Typography from '../../atoms/Typography';
import NewRequestWizard from '../../organisms/NewRequestWizard';

const NewRequestWizardDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <Typography variant="h4">Asistente de Nueva Solicitud:</Typography>
      <div className="bg-background p-6 rounded-lg">
        <NewRequestWizard
          onSubmit={(data) => {
            console.log('Solicitud enviada:', data);
            alert('Solicitud enviada correctamente');
          }}
          onCancel={() => {
            console.log('Solicitud cancelada');
            alert('Solicitud cancelada');
          }}
        />
      </div>
    </div>
  );
};

export default NewRequestWizardDemo;