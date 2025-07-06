import { UserRole } from '@alkitu/shared/enums/user-role.enum';

type ProtectedRoute = {
  path: string;
  roles: UserRole[];
};

export const PROTECTED_ROUTES: ProtectedRoute[] = [
  {
    path: '/dashboard/users', // This path will match /dashboard/admin/users/[userEmail] as well
    roles: [UserRole.ADMIN],
  },
  {
    path: '/dashboard/users/create', // This path will match /dashboard/admin/users/[userEmail] as well
    roles: [UserRole.ADMIN],
  },
  {
    path: '/dashboard',
    roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD],
  },
  {
    path: '/dashboard/profile',
    roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD],
  },
  {
    path: '/dashboard/settings',
    roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD],
  },
  // Add more protected routes here with their required roles
];
