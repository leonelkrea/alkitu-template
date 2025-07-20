import React from 'react';
import Typography from '../../atoms/Typography';
import RegisterPage from '../../templates/RegisterPage';

const RegisterPageDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Página de registro:</Typography>
        <div className="border border-border rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <RegisterPage
            onRegister={(data) => console.log('Register:', data)}
            onSwitchToLogin={() => console.log('Cambiar a login')}
            loading={false}
            error=""
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPageDemo;