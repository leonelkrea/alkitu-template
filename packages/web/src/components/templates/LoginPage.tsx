import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import AuthForm from '../organisms/AuthForm';

export interface LoginPageProps {
  onLogin?: (data: { email: string; password: string }) => void;
  onSwitchToRegister?: () => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onSwitchToRegister,
  loading = false,
  error,
  className = '',
  ...props
}) => {
  const handleSubmit = (data: any) => {
    if (onLogin) {
      onLogin(data);
    }
  };

  const handleSwitchMode = (mode: 'login' | 'register') => {
    if (mode === 'register' && onSwitchToRegister) {
      onSwitchToRegister();
    }
  };

  return (
    <AuthLayout className={className} {...props}>
      <AuthForm
        type="login"
        onSubmit={handleSubmit}
        onSwitchMode={handleSwitchMode}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
};

export default LoginPage;
