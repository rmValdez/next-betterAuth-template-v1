"use client";

import { authClient } from "@/shared/lib/auth-client";

/**
 * The signed-in user from the Better Auth session (cookie- or bearer-based).
 * The backend assigns exactly one `role` per user; it is exposed as a
 * one-element `roles` array for role-gating helpers. Read `isHydrated` before
 * branching on `userId` — it is false while the session is loading.
 */
export function useCurrentUser() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as { id: string; role?: string } | undefined;

  return {
    userId: user?.id ?? null,
    roles: user?.role ? [user.role] : [],
    isHydrated: !isPending,
  };
}
