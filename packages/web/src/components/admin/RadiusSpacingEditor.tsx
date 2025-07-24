import { BorderEditor } from "./BorderEditor";
import { toast } from "sonner";

export const RadiusSpacingEditor = () => {
  const handleBorderSave = (borderState: any) => {
    console.log('Guardando configuración de border:', borderState);
    toast.success('Configuración de border guardada exitosamente');
    
    // TODO: Implementar llamada al backend para guardar la configuración
    // TODO: Aplicar las CSS variables al documento
  };

  return (
    <div className="space-y-6">
      {/* Sistema Completo de Border */}
      <BorderEditor
        onChange={(borderState) => {
          // Los cambios se aplican automáticamente en tiempo real
          console.log('Border state changed:', borderState);
        }}
        onSave={handleBorderSave}
      />

    </div>
  );
};