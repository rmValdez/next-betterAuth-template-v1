export const SYSTEM_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  DEVELOPER: "DEVELOPER",
  USER: "USER",
} as const;

export type RoleName = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

// Single source of truth: the Zod contract that validates the backend payload.
export type { User, UsersListData } from "./contracts/users.contract";
