import { z } from "zod";

/**
 * Matches node-betterAuth-postg-template's user payload: one `role` per user
 * (permissions are derived from it server-side and returned as codes).
 */
export const UserRoleNameSchema = z.enum(["USER", "ADMIN", "SUPER_ADMIN", "DEVELOPER"]);

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  role: UserRoleNameSchema,
  permissions: z.array(z.string()).default([]),
  isActive: z.boolean().optional(),
  lastLoginAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** Backend page envelope (`buildPage` in pagination.helper.ts). */
export const UsersListDataSchema = z.object({
  items: z.array(UserSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const UsersApiResponseSchema = z.object({
  status: z.string().optional(),
  statusCode: z.number().optional(),
  data: UsersListDataSchema,
});

export type UserRoleName = z.infer<typeof UserRoleNameSchema>;
export type User = z.infer<typeof UserSchema>;
export type UsersListData = z.infer<typeof UsersListDataSchema>;
export type UsersApiResponse = z.infer<typeof UsersApiResponseSchema>;
