import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import Checkbox from '../../atoms/Checkbox';

const CheckboxDemo: React.FC = () => {
  const [checkboxStates, setCheckboxStates] = useState({
    basic: false,
    indeterminate: false,
    checked: true,
    terms: false,
    notifications: true
  });

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Estados:</Typography>
        <div className="space-y-4">
          <Checkbox
            id="checkbox-basic"
            checked={checkboxStates.basic}
            onChange={(checked) => setCheckboxStates(prev => ({ ...prev, basic: checked }))}
            label="Checkbox básico"
          />
          <Checkbox
            id="checkbox-indeterminate"
            checked={checkboxStates.indeterminate}
            indeterminate={true}
            onChange={(checked) => setCheckboxStates(prev => ({ ...prev, indeterminate: checked }))}
            label="Estado indeterminado"
          />
          <Checkbox
            id="checkbox-checked"
            checked={checkboxStates.checked}
            onChange={(checked) => setCheckboxStates(prev => ({ ...prev, checked: checked }))}
            label="Checkbox marcado"
          />
          <Checkbox
            id="checkbox-disabled"
            checked={false}
            disabled
            label="Deshabilitado"
          />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Con descripciones:</Typography>
        <div className="space-y-4">
          <Checkbox
            id="checkbox-terms"
            checked={checkboxStates.terms}
            onChange={(checked) => setCheckboxStates(prev => ({ ...prev, terms: checked }))}
            label="Acepto los términos"
            description="Confirmo que he leído y acepto los términos y condiciones del servicio."
          />
          <Checkbox
            id="checkbox-notifications"
            checked={checkboxStates.notifications}
            onChange={(checked) => setCheckboxStates(prev => ({ ...prev, notifications: checked }))}
            label="Recibir notificaciones"
            description="Enviarme notificaciones por email sobre actualizaciones importantes."
          />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Tamaños:</Typography>
        <div className="space-y-4">
          <Checkbox
            id="checkbox-small"
            checked={true}
            size="sm"
            label="Checkbox pequeño"
            description="Tamaño compacto"
          />
          <Checkbox
            id="checkbox-medium"
            checked={true}
            size="md"
            label="Checkbox mediano"
            description="Tamaño estándar"
          />
          <Checkbox
            id="checkbox-large"
            checked={true}
            size="lg"
            label="Checkbox grande"
            description="Tamaño amplio para mejor visibilidad"
          />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Estado actual:</Typography>
        <div className="bg-neutral-100 p-4 rounded-lg">
          <Typography variant="p" size="sm" className="font-mono">
            {JSON.stringify(checkboxStates, null, 2)}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default CheckboxDemo;