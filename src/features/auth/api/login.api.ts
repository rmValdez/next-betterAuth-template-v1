// src/features/auth/api/login.api.ts
import { authClient } from "@/shared/lib/auth-client";
import type { AuthResult, UserRole } from "../contracts/auth.contract";

function toAuthResult(data: any): AuthResult {
  const user = data?.user;
  return {
    sessionToken: data?.token ?? "",
    user: user
      ? {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          role: user.role as UserRole | undefined,
        }
      : undefined,
  };
}

/**
 * Sign in with email + password via Better Auth. Sets the session cookie and
 * returns the session token (used as a Bearer fallback by `fetcher`).
 */
export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResult> => {
  const { data, error } = await authClient.signIn.email({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message || "Invalid credentials or login failed.");
  }

  return toAuthResult(data);
};

/**
 * Create an account via Better Auth and start a session. Roles are assigned
 * server-side (every new account is a USER); clients cannot choose one.
 */
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> => {
  const { data, error } = await authClient.signUp.email({
    email: userData.email,
    password: userData.password,
    name: userData.name,
  });

  if (error) {
    throw new Error(error.message || "Registration failed.");
  }

  return toAuthResult(data);
};

/** Revoke the Better Auth session and clear its cookie. */
export const logout = async (): Promise<void> => {
  await authClient.signOut();
};
