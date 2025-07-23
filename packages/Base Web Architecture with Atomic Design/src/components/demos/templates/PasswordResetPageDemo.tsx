import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';
import PasswordResetPage from '../../templates/PasswordResetPage';

const PasswordResetPageDemo: React.FC = () => {
  const [success, setSuccess] = useState(false);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Typography variant="h4">Página de recuperación de contraseña:</Typography>
          <div className="flex items-center space-x-2">
            <Button
              variant={!success ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSuccess(false)}
            >
              Formulario
            </Button>
            <Button
              variant={success ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSuccess(true)}
            >
              Estado de éxito
            </Button>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <PasswordResetPage
            onResetRequest={(data) => {
              console.log('Password reset:', data);
              setSuccess(true);
            }}
            onBackToLogin={() => {
              console.log('Back to login');
              setSuccess(false);
            }}
            loading={false}
            error=""
            success={success}
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPageDemo;