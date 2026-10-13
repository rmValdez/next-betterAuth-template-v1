"use client";

import { Card } from "@/shared/components/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { useMe } from "../hooks/useMe";

/**
 * Shows `GET /api/v1/auth/me`: proves the Better Auth session reaches the
 * backend's own API, and shows the role + permissions it resolves.
 */
export function ProfileCard() {
  const { data: me, isLoading, error } = useMe();

  if (isLoading) {
    return (
      <Card className="p-6 space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    );
  }

  if (error || !me) {
    return (
      <Card className="p-6 text-sm text-red-500">
        Could not load your profile from the backend.
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-black tracking-tight">
          {me.name || me.username || me.email}
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">{me.email}</p>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Role</span>
        <span className="px-2 py-0.5 rounded-full bg-[var(--brand-core)]/10 text-[var(--brand-core)] font-bold">
          {me.role}
        </span>
      </div>
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
          Permissions
        </div>
        {me.permissions.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {me.permissions.map((code) => (
              <li
                key={code}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono border border-[var(--border-light)] bg-[var(--background-secondary)]"
              >
                {code}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[var(--text-tertiary)]">None</p>
        )}
      </div>
    </Card>
  );
}
