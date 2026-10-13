"use client";

import { ProfileCard } from "@/features/auth";
import { UserList } from "@/features/users";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";

const USER_ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

export default function DashboardPage() {
  const { roles } = useCurrentUser();
  const canListUsers = roles.some((role) => USER_ADMIN_ROLES.includes(role));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Your session, profile and permissions from the backend.
        </p>
      </div>
      <ProfileCard />
      {/* UI hint only — the backend enforces the role on GET /api/v1/users */}
      {canListUsers && <UserList />}
    </div>
  );
}
