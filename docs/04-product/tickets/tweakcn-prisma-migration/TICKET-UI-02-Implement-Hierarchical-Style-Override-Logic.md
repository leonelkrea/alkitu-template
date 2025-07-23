### TICKET-UI-02: Implementar la Lógica de Anulación Jerárquica de Estilos

**Descripción:**
Desarrollar la lógica central del Theme Builder en `packages/tweakcn` que permita la personalización de estilos a diferentes niveles de la jerarquía de Atomic Design (Base, Átomo, Molécula, Organismo) y la anulación de estilos de niveles superiores por los de niveles inferiores. Esto debe incluir soporte para modos claro y oscuro.

**Tareas:**
- [ ] Implementar un sistema de gestión de estados para almacenar la configuración del tema actual (modo claro y oscuro).
- [ ] Desarrollar una función o utilidad que aplique los estilos de forma jerárquica:
  - Estilos base (globales) se aplican primero.
  - Estilos de Átomos anulan los estilos base para ese átomo.
  - Estilos de Moléculas anulan los estilos de Átomos y base para los átomos que contienen.
  - Estilos de Organismos anulan los estilos de Moléculas, Átomos y base para los componentes que contienen.
- [ ] Asegurar que la lógica de anulación funcione correctamente para los modos claro y oscuro de forma independiente.
- [ ] Probar la anulación de estilos con ejemplos concretos (ej. color de botón global vs. color de botón en un componente específico).
- [ ] Implementar la persistencia de la configuración del tema en la base de datos a través de la API.
