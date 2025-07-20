import React from 'react';
import Typography from '../../atoms/Typography';
import EmailTemplatesMgr from '../../organisms/EmailTemplatesMgr';

const EmailTemplatesMgrDemo: React.FC = () => {
  const mockTemplates = [
    {
      id: '1',
      name: 'Bienvenida Nuevos Empleados',
      subject: '¡Bienvenido a WorkFlow Pro!',
      body: 'Estimado/a {nombre},\n\n¡Te damos la bienvenida a nuestra empresa! Estamos emocionados de tenerte en nuestro equipo.\n\nTu primer día será el {fecha_inicio}. A las 9:00 AM deberás dirigirte a recepción donde {responsable_rrhh} te estará esperando para el proceso de onboarding.\n\nDurante tu primer día:\n- Completarás la documentación necesaria\n- Conocerás a tu equipo de trabajo\n- Recibirás tu equipo de trabajo\n- Tendrás una sesión de orientación sobre nuestros procesos\n\n¡Esperamos que tengas una excelente experiencia con nosotros!\n\nSaludos cordiales,\nEquipo de Recursos Humanos',
      category: 'RRHH',
      isActive: true,
      lastModified: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Confirmación de Solicitud',
      subject: 'Solicitud #{numero_solicitud} recibida',
      body: 'Estimado/a {nombre_usuario},\n\nHemos recibido tu solicitud #{numero_solicitud} con los siguientes detalles:\n\nTítulo: {titulo_solicitud}\nTipo: {tipo_solicitud}\nPrioridad: {prioridad}\nFecha de solicitud: {fecha_solicitud}\n\nTu solicitud ha sido asignada a {departamento_responsable} y será revisada en un plazo máximo de {tiempo_respuesta}.\n\nPodrás hacer seguimiento del estado de tu solicitud en el portal web o contactando con nosotros.\n\nGracias por utilizar nuestros servicios.\n\nSaludos,\nEquipo de Soporte',
      category: 'Soporte',
      isActive: true,
      lastModified: '2024-01-20T14:15:00Z'
    },
    {
      id: '3',
      name: 'Notificación de Mantenimiento',
      subject: 'Mantenimiento Programado - {fecha}',
      body: 'Estimados usuarios,\n\nLes informamos que se realizará un mantenimiento programado en nuestros sistemas:\n\nFecha: {fecha_mantenimiento}\nHora de inicio: {hora_inicio}\nDuración estimada: {duracion}\nServicios afectados: {servicios_afectados}\n\nDurante este periodo, es posible que experimenten interrupciones en los servicios mencionados.\n\nNos disculpamos por cualquier inconveniente que esto pueda causar.\n\nSaludos,\nEquipo Técnico',
      category: 'Mantenimiento',
      isActive: false,
      lastModified: '2024-01-18T09:45:00Z'
    }
  ];

  return (
    <div className="space-y-8">
      <Typography variant="h4">Gestor de Plantillas de Email:</Typography>
      <EmailTemplatesMgr
        templates={mockTemplates}
        onCreateTemplate={() => {
          console.log('Crear nueva plantilla');
          alert('Crear nueva plantilla de email');
        }}
        onEditTemplate={(id) => {
          console.log('Editar plantilla:', id);
          alert(`Editar plantilla ${id}`);
        }}
        onDeleteTemplate={(id) => {
          console.log('Eliminar plantilla:', id);
          if (confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
            alert(`Plantilla ${id} eliminada`);
          }
        }}
        onToggleActive={(id, isActive) => {
          console.log('Toggle plantilla:', id, isActive);
          alert(`Plantilla ${id} ${isActive ? 'activada' : 'desactivada'}`);
        }}
      />
    </div>
  );
};

export default EmailTemplatesMgrDemo;