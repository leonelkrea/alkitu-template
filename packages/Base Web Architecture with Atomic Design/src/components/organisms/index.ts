// Exportaciones centralizadas de todos los organismos
export { default as Sidebar } from './Sidebar';
export { default as SidebarMobile } from './SidebarMobile';
export { default as Header } from './Header';
export { default as DashboardSummary } from './DashboardSummary';
export { default as RequestsList } from './RequestsList';
export { default as RequestsListMobile } from './RequestsListMobile';
export { default as RequestDetail } from './RequestDetail';
export { default as NewRequestWizard } from './NewRequestWizard';
export { default as ProfileForm } from './ProfileForm';
export { default as ProfileFormMobile } from './ProfileFormMobile';
export { default as ServicesList } from './ServicesList';
export { default as ServicesListMobile } from './ServicesListMobile';
export { default as ServiceEditor } from './ServiceEditor';
export { default as EmailTemplatesMgr } from './EmailTemplatesMgr';
export { default as UsersList } from './UsersList';
export { default as UsersListMobile } from './UsersListMobile';
export { default as CalendarView } from './CalendarView';
export { default as NotificationsPanel } from './NotificationsPanel';
export { default as NotificationsPanelMobile } from './NotificationsPanelMobile';
export { default as Table } from './Table';
export { default as TableMobile } from './TableMobile';
export { default as AuthForm } from './AuthForm';
export { default as HeroSection } from './HeroSection';
export { default as HeroSectionMobile } from './HeroSectionMobile';

// También exportar las interfaces para uso externo
export type { SidebarProps } from './Sidebar';
export type { HeaderProps } from './Header';
export type { DashboardSummaryProps, DashboardMetric } from './DashboardSummary';
export type { RequestsListProps, Request } from './RequestsList';
export type { RequestsListMobileProps, RequestMobile } from './RequestsListMobile';
export type { RequestDetailProps, RequestDetailData } from './RequestDetail';
export type { NewRequestWizardProps } from './NewRequestWizard';
export type { ProfileFormProps } from './ProfileForm';
export type { ProfileFormMobileProps } from './ProfileFormMobile';
export type { ServicesListProps, Service } from './ServicesList';
export type { ServicesListMobileProps, ServiceMobile } from './ServicesListMobile';
export type { ServiceEditorProps } from './ServiceEditor';
export type { EmailTemplatesMgrProps, EmailTemplate } from './EmailTemplatesMgr';
export type { UsersListProps, User } from './UsersList';
export type { UsersListMobileProps, UserMobile } from './UsersListMobile';
export type { CalendarViewProps, CalendarEvent } from './CalendarView';
export type { NotificationsPanelProps, Notification } from './NotificationsPanel';
export type { NotificationsPanelMobileProps, NotificationMobile } from './NotificationsPanelMobile';
export type { TableProps, TableColumn, TableAction } from './Table';
export type { TableMobileProps, TableMobileColumn, TableMobileAction } from './TableMobile';
export type { HeroSectionProps } from './HeroSection';
export type { HeroSectionMobileProps } from './HeroSectionMobile';