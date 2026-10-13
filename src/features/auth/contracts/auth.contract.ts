import { z } from "zod";

/** Roles assigned by node-betterAuth-postg-template (server-managed). */
export const UserRoleSchema = z.enum(["USER", "ADMIN", "SUPER_ADMIN", "DEVELOPER"]);

/** Result of a Better Auth sign-in / sign-up, normalized for the app. */
export const AuthResultSchema = z.object({
  /** Better Auth session token — sent as `Authorization: Bearer` by `fetcher`. */
  sessionToken: z.string(),
  user: z
    .object({
      id: z.string(),
      email: z.string(),
      name: z.string().nullable().optional(),
      role: UserRoleSchema.optional(),
    })
    .optional(),
});

/** `GET /api/v1/auth/me` — profile plus the permissions derived from the role. */
export const MeSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  role: UserRoleSchema,
  onboardingCompleted: z.boolean().optional(),
  permissions: z.array(z.string()).default([]),
});

export const MeResponseSchema = z.object({
  status: z.string().optional(),
  statusCode: z.number().optional(),
  data: MeSchema,
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type AuthResult = z.infer<typeof AuthResultSchema>;
export type Me = z.infer<typeof MeSchema>;
