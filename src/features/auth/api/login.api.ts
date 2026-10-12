// src/features/auth/api/login.api.ts
import { authClient } from "@/shared/lib/auth-client";
import {
  type AuthResult,
} from "../contracts/auth.contract";

// Unified role definitions matching backend Prisma UserRole
export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN" | "DEVELOPER";

export interface AuthResponse {
  accessToken?: string;
  hasStoreBranches?: boolean;
}

/**
 * Better Auth Login Handler
 * Uses the Better Auth client to sign in and set session cookies.
 */
export const login = async (
  credentials: Record<string, string>,
  roleName?: UserRole,
): Promise<AuthResult> => {
  const { data, error } = await authClient.signIn.email({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message || "Invalid credentials or login failed.");
  }

  const user = data?.user;
  const sessionToken =
    (data as any)?.token ||
    (data as any)?.session?.token ||
    "better-auth-session";

  const userRole = ((user as any)?.role || roleName || "USER") as string;

  return {
    accessToken: sessionToken,
    refreshToken: undefined,
    hasStores: false,
    user: user
      ? {
          id: user.id,
          email: user.email,
          firstName: (user as any).firstName || (user.name ? user.name.split(" ")[0] : ""),
          lastName: (user as any).lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : ""),
          role: userRole,
        }
      : undefined,
    seller: null,
  };
};

/**
 * Better Auth Registration Handler
 * Creates account on the backend Better Auth instance and starts session.
 */
export const register = async (
  userData: Record<string, string>,
  roleName: UserRole = "USER",
): Promise<AuthResponse> => {
  const fullName =
    `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
    userData.email.split("@")[0];

  const { data, error } = await (authClient.signUp.email as any)({
    email: userData.email,
    password: userData.password,
    name: fullName,
    role: roleName,
  });

  if (error) {
    throw new Error(error.message || "Registration failed.");
  }

  const sessionToken =
    (data as any)?.token ||
    (data as any)?.session?.token ||
    "better-auth-session";

  return {
    accessToken: sessionToken,
    hasStoreBranches: false,
  };
};

/**
 * Better Auth Logout Handler
 * Revokes session cookie and cleans up active session.
 */
export const logout = async (): Promise<void> => {
  await authClient.signOut();
};
