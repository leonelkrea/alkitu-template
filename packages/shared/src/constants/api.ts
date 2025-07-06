// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  // User endpoints
  USERS: {
    ME: "/users/me",
    LIST: "/users",
    CREATE: "/users",
    UPDATE: "/users/:id",
    DELETE: "/users/:id",
    BY_ID: "/users/:id",
  },
  // tRPC endpoints
  TRPC: {
    BASE: "/trpc",
  },
  // GraphQL endpoint
  GRAPHQL: {
    BASE: "/graphql",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: {
    USER_CREATED: "User created successfully",
    USER_UPDATED: "User updated successfully",
    USER_DELETED: "User deleted successfully",
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logout successful",
    EMAIL_SENT: "Email sent successfully",
    EMAIL_VERIFIED: "Email verified successfully",
    PASSWORD_RESET: "Password reset successfully",
  },
  ERROR: {
    USER_NOT_FOUND: "User not found",
    USER_ALREADY_EXISTS: "User already exists",
    INVALID_CREDENTIALS: "Invalid credentials",
    INVALID_TOKEN: "Invalid or expired token",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Forbidden access",
    VALIDATION_ERROR: "Validation error",
    INTERNAL_ERROR: "Internal server error",
  },
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Token expiration times
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: "1h",
  REFRESH_TOKEN: "7d",
  EMAIL_VERIFICATION: "24h",
  PASSWORD_RESET: "1h",
} as const;
