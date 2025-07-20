import React from 'react';
import AuthLayout from './AuthLayout';
import AuthForm from '../organisms/AuthForm';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

export interface PasswordResetPageProps {
  onResetRequest?: (data: { email: string }) => void;
  onBackToLogin?: () => void;
  loading?: boolean;
  error?: string;
  success?: boolean;
  className?: string;
}

const PasswordResetPage: React.FC<PasswordResetPageProps> = ({
  onResetRequest,
  onBackToLogin,
  loading = false,
  error,
  success = false,
  className = '',
  ...props
}) => {
  const handleSubmit = (data: any) => {
    if (onResetRequest) {
      onResetRequest(data);
    }
  };

  const handleSwitchMode = () => {
    if (onBackToLogin) {
      onBackToLogin();
    }
  };

  if (success) {
    return (
      <AuthLayout className={className} {...props}>
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="CheckCircle" size="lg" color="success" />
          </div>
          
          <div className="space-y-3">
            <Typography variant="h2" weight="bold">
              Enlace Enviado
            </Typography>
            <Typography variant="p" color="muted">
              Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.
            </Typography>
          </div>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={onBackToLogin}
          >
            Volver al Inicio de Sesión
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout className={className} {...props}>
      <AuthForm
        type="password-reset"
        onSubmit={handleSubmit}
        onSwitchMode={handleSwitchMode}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
};

export default PasswordResetPage;