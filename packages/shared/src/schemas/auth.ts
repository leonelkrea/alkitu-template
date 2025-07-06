import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  contactNumber: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  contactNumber: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const UsersFilterSchema = z.object({
  search: z.string().optional(),
  role: z.enum(["ADMIN", "CLIENT", "EMPLOYEE", "USER", "MODERATOR"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Type inference
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type UsersFilterInput = z.infer<typeof UsersFilterSchema>;
