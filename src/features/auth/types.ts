export interface AuthSession {
  token: string | null;
}

/// Role as selected in the login form (lowercase, UI-level).
export type LoginRole = "user" | "admin" | "super_admin" | "developer";
