import { z } from "zod";

/**
 * @desc Validation for getting all users (query params)
 */
export const getAllUsersValidation = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().min(1, "Page must be at least 1")),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .pipe(z.number().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100")),
  }),
});

/**
 * @desc Validation for getting a single user by ID (params)
 */
export const getUserByIdValidation = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID format (must be a valid UUID)"),
  }),
});

/**
 * @desc Validation for updating a user's role (params & body)
 */
export const updateUserRoleValidation = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID format (must be a valid UUID)"),
  }),
  body: z.object({
    role: z.enum(["user", "admin", "superadmin"], {
      error: "Role must be 'user', 'admin', or 'superadmin'",
    }),
  }),
});
