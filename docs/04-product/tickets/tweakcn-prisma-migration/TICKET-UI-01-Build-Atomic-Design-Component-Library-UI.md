### TICKET-UI-01: Construir la UI de la Librería de Componentes de Atomic Design

**Descripción:**
Desarrollar la interfaz de usuario en `packages/tweakcn` que muestre una librería de componentes organizada según los principios de Atomic Design (Átomos, Moléculas, Organismos, Plantillas). Esta UI servirá como la base para el Theme Builder, permitiendo la selección y personalización de cada elemento.

**Tareas:**
- [ ] Diseñar y desarrollar un sidebar de navegación que liste los componentes por categorías: Átomos, Moléculas, Organismos.
- [ ] Implementar las vistas para cada categoría, mostrando los componentes individuales (ej. Botón, Input, Card, Sidebar).
- [ ] Para cada componente, crear una representación visual interactiva que refleje su estado actual y permita la personalización.
- [ ] Asegurar que la UI sea responsiva y fácil de usar.
- [ ] Integrar los componentes existentes de `tweakcn` en esta nueva estructura de librería.

**Componentes a incluir:**

**Átomos:**
- Typography
- Icon
- Badge
- Button
- Input
- Checkbox
- RadioGroup
- Avatar
- PreviewImage
- Spinner
- Tooltip
- Chip

**Moléculas:**
- FormField
- IconButton
- NotificationDot
- Card
- RequestCard
- ServiceCard
- UserMenu
- ToggleSwitch

**Organismos:**
- Sidebar
- Header
- DashboardSummary
- RequestsList
- RequestDetail
- NewRequestWizard
- ProfileForm
- ServicesList
- ServiceEditor
- EmailTemplatesMgr
- UsersList
- CalendarView
- NotificationsPanel
- Table
- HeroSection
- AuthForm
