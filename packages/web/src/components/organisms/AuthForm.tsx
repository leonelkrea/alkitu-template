import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';

export interface AuthFormProps {
  type: 'login' | 'register' | 'password-reset';
  onSubmit?: (data: any) => void;
  onSwitchMode?: (mode: 'login' | 'register') => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  onSwitchMode,
  loading = false,
  error,
  className = '',
  ...props
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }

    if (type !== 'password-reset') {
      if (!formData.password) {
        errors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (type === 'register') {
        if (!formData.confirmPassword) {
          errors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Las contraseñas no coinciden';
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm() && onSubmit) {
      onSubmit(formData);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'login':
        return 'Iniciar Sesión';
      case 'register':
        return 'Crear Cuenta';
      case 'password-reset':
        return 'Recuperar Contraseña';
      default:
        return '';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'login':
        return 'Accede a tu cuenta de WorkFlow Pro';
      case 'register':
        return 'Únete a WorkFlow Pro y optimiza tu gestión';
      case 'password-reset':
        return 'Te enviaremos un enlace para restablecer tu contraseña';
      default:
        return '';
    }
  };

  const getSubmitText = () => {
    switch (type) {
      case 'login':
        return 'Iniciar Sesión';
      case 'register':
        return 'Crear Cuenta';
      case 'password-reset':
        return 'Enviar Enlace';
      default:
        return '';
    }
  };

  return (
    <div className={`w-full max-w-md space-y-8 ${className}`} {...props}>
      {/* Header */}
      <div className="text-center space-y-3">
        <Typography variant="h2" weight="bold">
          {getTitle()}
        </Typography>
        <Typography variant="p" color="muted">
          {getSubtitle()}
        </Typography>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <Typography variant="p" size="sm" className="text-error">
            {error}
          </Typography>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Correo electrónico"
          required
          error={formErrors.email}
          type="email"
          value={formData.email}
          onChange={(e) =>
            updateField('email', (e.target as HTMLInputElement).value)
          }
          placeholder="tu@email.com"
        />

        {type !== 'password-reset' && (
          <FormField
            label="Contraseña"
            required
            error={formErrors.password}
            type="password"
            value={formData.password}
            onChange={(e) =>
              updateField('password', (e.target as HTMLInputElement).value)
            }
            placeholder="Mínimo 6 caracteres"
          />
        )}

        {type === 'register' && (
          <FormField
            label="Confirmar contraseña"
            required
            error={formErrors.confirmPassword}
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              updateField(
                'confirmPassword',
                (e.target as HTMLInputElement).value,
              )
            }
            placeholder="Confirma tu contraseña"
          />
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          className="mt-8"
        >
          {getSubmitText()}
        </Button>
      </form>

      {/* Switch Mode Links */}
      <div className="text-center space-y-4">
        {type === 'login' && (
          <>
            <button
              type="button"
              onClick={() => onSwitchMode?.('register')}
              className="text-sm text-design-primary hover:text-design-primary/80 transition-colors"
            >
              ¿No tienes cuenta? Regístrate
            </button>
            <br />
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </>
        )}

        {type === 'register' && (
          <button
            type="button"
            onClick={() => onSwitchMode?.('login')}
            className="text-sm text-design-primary hover:text-design-primary/80 transition-colors"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        )}

        {type === 'password-reset' && (
          <button
            type="button"
            onClick={() => onSwitchMode?.('login')}
            className="text-sm text-design-primary hover:text-design-primary/80 transition-colors"
          >
            Volver al inicio de sesión
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
