"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/shared/lib/auth-client";

/**
 * Renders children only for a signed-in user (Better Auth session);
 * otherwise redirects to /login. `middleware.ts` does a fast cookie check
 * first — this is the authoritative check against the backend.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-tertiary)]" />
      </div>
    );
  }

  return <>{children}</>;
}
