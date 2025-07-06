export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  EMPLOYEE = "EMPLOYEE",
  USER = "USER",
  MODERATOR = "MODERATOR",
}

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: UserRole;
  contactNumber?: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
