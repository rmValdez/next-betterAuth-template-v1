"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Code2, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

/** Top bar for signed-in pages: app name, current user, sign-out. */
export function SessionHeader() {
  const router = useRouter();
  const { session, logout, isLoggingOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  return (
    <header className="border-b border-[var(--border-default)] bg-[var(--background-elevated)] h-16 flex items-center">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-black text-lg tracking-tight">
          <Code2 className="w-5 h-5 text-[var(--brand-core)]" />
          <span>
            Next<span className="text-[var(--brand-core)]">Template</span>
          </span>
        </Link>
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs text-[var(--text-secondary)] truncate">
            {session?.user.email}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-[var(--border-default)] bg-[var(--background-tertiary)] hover:bg-[var(--background-secondary)] transition-colors disabled:opacity-60"
          >
            {isLoggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
