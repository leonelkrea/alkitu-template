import React from 'react';
import AuthLayout from './AuthLayout';
import AuthForm from '../organisms/AuthForm';

export interface RegisterPageProps {
  onRegister?: (data: { email: string; password: string; confirmPassword: string }) => void;
  onSwitchToLogin?: () => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegister,
  onSwitchToLogin,
  loading = false,
  error,
  className = '',
  ...props
}) => {
  const handleSubmit = (data: any) => {
    if (onRegister) {
      onRegister(data);
    }
  };

  const handleSwitchMode = (mode: 'login' | 'register') => {
    if (mode === 'login' && onSwitchToLogin) {
      onSwitchToLogin();
    }
  };

  return (
    <AuthLayout className={className} {...props}>
      <AuthForm
        type="register"
        onSubmit={handleSubmit}
        onSwitchMode={handleSwitchMode}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
};

export default RegisterPage;