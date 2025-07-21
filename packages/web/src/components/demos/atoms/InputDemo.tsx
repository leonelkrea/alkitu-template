import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import Input from '../../atoms/Input';
import Icon from '../../atoms/Icon';

const InputDemo: React.FC = () => {
  const [inputValues, setInputValues] = useState({
    basic: '',
    email: '',
    password: '',
    error: 'Texto con error',
    disabled: 'Valor fijo',
  });

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Tipos básicos:</Typography>
        <div className="space-y-4 max-w-md">
          <Input
            placeholder="Texto básico"
            value={inputValues.basic}
            onChange={(e) =>
              setInputValues((prev) => ({ ...prev, basic: e.target.value }))
            }
          />
          <Input
            type="email"
            placeholder="correo@ejemplo.com"
            value={inputValues.email}
            onChange={(e) =>
              setInputValues((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={inputValues.password}
            onChange={(e) =>
              setInputValues((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Estados:</Typography>
        <div className="space-y-4 max-w-md">
          <Input
            placeholder="Campo con error"
            value={inputValues.error}
            onChange={(e) =>
              setInputValues((prev) => ({ ...prev, error: e.target.value }))
            }
            error={true}
          />
          <Input
            placeholder="Campo deshabilitado"
            value={inputValues.disabled}
            disabled
          />
          <Input placeholder="Campo requerido" required />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Con iconos:</Typography>
        <div className="space-y-4 max-w-md">
          <Input placeholder="Buscar..." />
          <Input placeholder="Usuario" />
          <Input placeholder="Correo electrónico" type="email" />
        </div>
      </div>
    </div>
  );
};

export default InputDemo;
