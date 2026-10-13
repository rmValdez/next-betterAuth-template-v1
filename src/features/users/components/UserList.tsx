"use client";

import { Card } from "@/shared/components/ui/Card";
import { ApiError } from "@/shared/errors/api-error";
import { useUsers } from "../hooks/useUsers";
import { UserListSkeleton } from "./UserListSkeleton";

/** Users from `GET /api/v1/users` (ADMIN / SUPER_ADMIN only on the backend). */
export function UserList() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) return <UserListSkeleton />;

  if (error) {
    const forbidden = error instanceof ApiError && error.status === 403;
    return (
      <Card className="p-6 text-sm text-red-500">
        {forbidden
          ? "You need an ADMIN or SUPER_ADMIN role to list users."
          : "Could not load users from the backend."}
      </Card>
    );
  }

  const users = data?.items ?? [];

  return (
    <Card className="p-0">
      <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
        <h2 className="text-sm font-black tracking-tight">Users</h2>
        <span className="text-xs text-[var(--text-tertiary)]">{data?.total ?? 0} total</span>
      </div>
      <ul className="divide-y divide-[var(--border-light)]">
        {users.map((user) => (
          <li key={user.id} className="px-6 py-3 flex items-center justify-between gap-4 text-xs">
            <div className="min-w-0">
              <div className="font-bold truncate">{user.name || user.username || user.email}</div>
              <div className="text-[var(--text-tertiary)] truncate">{user.email}</div>
            </div>
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-[var(--background-secondary)] font-bold">
              {user.role}
            </span>
          </li>
        ))}
        {users.length === 0 && (
          <li className="px-6 py-6 text-center text-xs text-[var(--text-tertiary)]">No users yet</li>
        )}
      </ul>
    </Card>
  );
}
