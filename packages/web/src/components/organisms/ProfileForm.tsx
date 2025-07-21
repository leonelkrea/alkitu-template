import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import FormField from '../molecules/FormField';
import IconButton from '../molecules/IconButton';

export interface ProfileFormProps {
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

const ProfileForm: React.FC<ProfileFormProps> = ({
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
    <div className={`max-w-2xl mx-auto space-y-6 ${className}`} {...props}>
      {/* Header - Desktop */}
      <div className="flex items-center justify-between">
        <Typography variant="h2" weight="medium">
          Mi Perfil
        </Typography>
        <div className="flex space-x-2">
          <IconButton
            icon="Key"
            onClick={onChangePassword}
            tooltip="Cambiar contraseña"
          >
            Cambiar Contraseña
          </IconButton>
          <IconButton
            icon={isEditing ? 'Check' : 'Edit'}
            variant="primary"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? 'Guardar' : 'Editar'}
          </IconButton>
        </div>
      </div>

      {/* Form Content - Desktop */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Nombre completo"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Departamento"
            value={formData.department}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, department: e.target.value }))
            }
          />
          <FormField
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

export default ProfileForm;
