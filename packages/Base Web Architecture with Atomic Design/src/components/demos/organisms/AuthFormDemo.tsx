import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import AuthForm from '../../organisms/AuthForm';

const AuthFormDemo: React.FC = () => {
  const [authType, setAuthType] = useState<'login' | 'register' | 'password-reset'>('login');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert(`${authType === 'login' ? 'Inicio de sesión' : authType === 'register' ? 'Registro' : 'Envío de enlace'} exitoso!`);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <Typography variant="h4">Formularios de Autenticación:</Typography>
      
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setAuthType('login')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            authType === 'login' 
              ? 'bg-design-primary text-primary-dark' 
              : 'bg-neutral-200 text-foreground hover:bg-neutral-300'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setAuthType('register')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            authType === 'register' 
              ? 'bg-design-primary text-primary-dark' 
              : 'bg-neutral-200 text-foreground hover:bg-neutral-300'
          }`}
        >
          Registro
        </button>
        <button
          onClick={() => setAuthType('password-reset')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            authType === 'password-reset' 
              ? 'bg-design-primary text-primary-dark' 
              : 'bg-neutral-200 text-foreground hover:bg-neutral-300'
          }`}
        >
          Reset Password
        </button>
      </div>

      <div className="flex justify-center">
        <div className="bg-card border border-border rounded-lg p-8">
          <AuthForm
            type={authType}
            onSubmit={handleSubmit}
            onSwitchMode={(mode) => {
              console.log('Switch to mode:', mode);
              setAuthType(mode);
            }}
            loading={loading}
            error={authType === 'login' ? undefined : undefined} // Can simulate error here
          />
        </div>
      </div>
    </div>
  );
};

export default AuthFormDemo;