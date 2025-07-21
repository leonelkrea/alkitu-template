import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import ToggleSwitch from '../../molecules/ToggleSwitch';

const ToggleSwitchDemo: React.FC = () => {
  const [toggleStates, setToggleStates] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true
  });

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Switches básicos:</Typography>
        <div className="space-y-4">
          <ToggleSwitch
            checked={toggleStates.notifications}
            onChange={(checked) => setToggleStates(prev => ({ ...prev, notifications: checked }))}
            label="Notificaciones"
            description="Recibir notificaciones por email"
          />
          <ToggleSwitch
            checked={toggleStates.darkMode}
            onChange={(checked) => setToggleStates(prev => ({ ...prev, darkMode: checked }))}
            label="Modo oscuro"
            description="Cambiar al tema oscuro de la aplicación"
          />
          <ToggleSwitch
            checked={toggleStates.autoSave}
            onChange={(checked) => setToggleStates(prev => ({ ...prev, autoSave: checked }))}
            label="Guardado automático"
            description="Guardar cambios automáticamente"
          />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Estados:</Typography>
        <div className="space-y-4">
          <ToggleSwitch
            checked={true}
            disabled
            label="Opción deshabilitada (activa)"
            description="Esta opción no se puede cambiar"
          />
          <ToggleSwitch
            checked={false}
            disabled
            label="Opción deshabilitada (inactiva)"
            description="Esta opción está bloqueada"
          />
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitchDemo;