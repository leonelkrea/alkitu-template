import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import FormFieldMobile from '../molecules/FormFieldMobile';
import IconButtonMobile from '../molecules/IconButtonMobile';

export interface ProfileFormMobileProps {
  user: {
    name: string;
    email: string;
    department: string;
    phone: string;
    avatar?: string;
  };
  onSave?: (data: any) => void;
  onChangePassword?: () => void;
  className?: string;
}

const ProfileFormMobile: React.FC<ProfileFormMobileProps> = ({
  user,
  onSave,
  onChangePassword,
  className = '',
  ...props
}) => {
  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    setIsEditing(false);
  };

  return (
    <div className={`w-full space-y-6 px-4 ${className}`} {...props}>
      {/* Header - Mobile */}
      <div className="space-y-4">
        <Typography variant="h2" weight="medium" className="text-center">
          Mi Perfil
        </Typography>
        <div className="flex space-x-3 justify-center">
          <IconButtonMobile
            icon="Key"
            label="Cambiar Contraseña"
            showLabel={true}
            variant="outline"
            size="md"
            onClick={onChangePassword}
          />
          <IconButtonMobile
            icon={isEditing ? 'Check' : 'Edit'}
            label={isEditing ? 'Guardar' : 'Editar'}
            showLabel={true}
            variant="primary"
            size="md"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          />
        </div>
      </div>

      {/* Form Content - Mobile */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-6">
        <div className="space-y-4">
          <FormFieldMobile
            label="Nombre completo"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <FormFieldMobile
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <FormFieldMobile
            label="Departamento"
            value={formData.department}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, department: e.target.value }))
            }
          />
          <FormFieldMobile
            label="Teléfono"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileFormMobile;
