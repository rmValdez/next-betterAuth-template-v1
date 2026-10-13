"use client";

import { AuthGate, SessionHeader } from "@/features/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-screen flex flex-col bg-[var(--background-primary)] text-[var(--text-primary)]">
        <SessionHeader />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">{children}</main>
      </div>
    </AuthGate>
  );
}
