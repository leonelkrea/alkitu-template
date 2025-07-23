import React from 'react';
import Typography from '../../atoms/Typography';
import LoginPage from '../../templates/LoginPage';

const LoginPageDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Página de inicio de sesión:</Typography>
        <div className="border border-border rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <LoginPage
            onLogin={(data) => console.log('Login:', data)}
            onSwitchToRegister={() => console.log('Cambiar a registro')}
            loading={false}
            error=""
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPageDemo;