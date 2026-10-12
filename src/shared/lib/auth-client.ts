import { createAuthClient } from "better-auth/react";
import { AUTH_BASE_URL } from "@/shared/config/api";

/**
 * Better Auth Client for Next.js
 *
 * Configured with root backend origin and credentials: "include"
 * to pass session cookies on cross-origin requests.
 */
export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
