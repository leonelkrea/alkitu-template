import React from 'react';
import Typography from '../atoms/Typography';
import MainLayout from './MainLayout';
import ProfileForm from '../organisms/ProfileForm';

export interface ProfilePageProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
    department: string;
    phone: string;
  };
  onNavigate?: (route: string) => void;
  className?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onNavigate,
  className = '',
  ...props
}) => {
  const handleSave = (data: any) => {
    console.log('Guardar perfil:', data);
  };

  const handleChangePassword = () => {
    if (onNavigate) {
      onNavigate('/app/profile/password');
    }
  };

  return (
    <MainLayout
      user={user}
      currentRoute="profile"
      onNavigate={onNavigate}
      className={className}
      {...props}
    >
      <div className="space-y-6">
        <div>
          <Typography variant="h1" weight="bold" className="mb-2">
            Mi Perfil
          </Typography>
          <Typography variant="p" color="muted">
            Gestiona tu información personal y configuración de cuenta
          </Typography>
        </div>

        <ProfileForm
          user={user}
          onSave={handleSave}
          onChangePassword={handleChangePassword}
        />
      </div>
    </MainLayout>
  );
};

export default ProfilePage;