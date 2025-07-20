import React from 'react';
import Typography from '../../atoms/Typography';
import ProfileForm from '../../organisms/ProfileForm';
import ProfileFormMobile from '../../organisms/ProfileFormMobile';
import { useIsMobile } from '../../../../components/ui/use-mobile';

const ProfileFormDemo: React.FC = () => {
  const isMobile = useIsMobile();
  
  const mockUser = {
    name: "Ana García Ruiz",
    email: "ana.garcia@empresa.com",
    department: "Desarrollo de Software",
    phone: "+34 123 456 789",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face"
  };

  const handleSave = (data: any) => {
    console.log('Perfil guardado:', data);
    alert('Perfil actualizado correctamente');
  };

  const handleChangePassword = () => {
    console.log('Cambiar contraseña');
    alert('Funcionalidad de cambiar contraseña');
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="space-y-2">
        <Typography variant="h4">Formulario de Perfil</Typography>
        <Typography variant="p" size="sm" color="muted" className="hidden md:block">
          Componente con versiones separadas para desktop y móvil
        </Typography>
        <Typography variant="p" size="sm" color="muted" className="md:hidden">
          Versión móvil optimizada con campos apilados y botones táctiles
        </Typography>
      </div>

      {/* Demostración del componente */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/30 p-4 border-b border-border">
          <Typography variant="p" size="sm" weight="medium">
            {isMobile ? '📱 Versión Móvil' : '🖥️ Versión Desktop'} - Componente: {isMobile ? 'ProfileFormMobile' : 'ProfileForm'}
          </Typography>
        </div>
        
        <div className="p-0 md:p-6">
          {isMobile ? (
            <ProfileFormMobile
              user={mockUser}
              onSave={handleSave}
              onChangePassword={handleChangePassword}
            />
          ) : (
            <ProfileForm
              user={mockUser}
              onSave={handleSave}
              onChangePassword={handleChangePassword}
            />
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <Typography variant="p" size="sm" weight="medium">
          🎯 Arquitectura de archivos separados:
        </Typography>
        <ul className="space-y-1 pl-4">
          <li className="text-sm text-muted-foreground">• 📁 <code>ProfileForm.tsx</code> - Versión desktop optimizada</li>
          <li className="text-sm text-muted-foreground">• 📁 <code>ProfileFormMobile.tsx</code> - Versión móvil optimizada</li>
          <li className="text-sm text-muted-foreground">• 🔄 <code>useIsMobile()</code> - Hook para detectar dispositivo</li>
          <li className="text-sm text-muted-foreground">• 🎨 Componentes específicos (FormField vs FormFieldMobile)</li>
          <li className="text-sm text-muted-foreground">• 🚀 Mejor rendimiento y mantenibilidad</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileFormDemo;