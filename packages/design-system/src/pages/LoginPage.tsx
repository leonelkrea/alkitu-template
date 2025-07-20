import React, { useState } from 'react';
import AuthLayout from '../components/templates/AuthLayout';
import FormField from '../components/molecules/FormField';
import Typography from '../components/atoms/Typography';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import Icon from '../components/atoms/Icon';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'El email es requerido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', formData);
      setIsLoading(false);
      // Here you would typically redirect to dashboard
    }, 1000);
  };

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Ingresa tus credenciales para acceder a tu cuenta"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="email"
          label="Correo Electrónico"
          type="email"
          value={formData.email}
          placeholder="tu@empresa.com"
          error={errors.email}
          onChange={handleInputChange('email')}
          required
        />

        <FormField
          id="password"
          label="Contraseña"
          type="password"
          value={formData.password}
          placeholder="••••••••"
          error={errors.password}
          onChange={handleInputChange('password')}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-border" />
            <Typography variant="p" size="sm">
              Recordarme
            </Typography>
          </label>
          <Button variant="link" className="text-design-primary p-0 h-auto">
            ¿Olvidaste tu contraseña?
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full bg-design-primary text-neutral-900 hover:bg-design-primary/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Icon name="Loader2" size="sm" className="mr-2 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>

        <div className="relative">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-card px-2 text-sm text-muted-foreground">
              o continúa con
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button">
            <Icon name="Mail" size="sm" className="mr-2" />
            Google
          </Button>
          <Button variant="outline" type="button">
            <Icon name="Github" size="sm" className="mr-2" />
            GitHub
          </Button>
        </div>

        <div className="text-center">
          <Typography variant="p" size="sm" color="muted">
            ¿No tienes una cuenta?{' '}
            <Button variant="link" className="text-design-primary p-0 h-auto">
              Regístrate aquí
            </Button>
          </Typography>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;