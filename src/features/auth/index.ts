// src/features/auth/index.ts
export { default as LoginForm } from "./components/LoginForm";
export { default as RegisterWorkflow } from "./components/RegisterWorkflow";
export { AuthGate } from "./components/AuthGate";
export { AuthListener } from "./components/AuthListener";
export { SessionHeader } from "./components/SessionHeader";
export { ProfileCard } from "./components/ProfileCard";

export { useAuth, clearAuthSession } from "./hooks/useAuth";
export { useMe } from "./hooks/useMe";
export { useAuthStore } from "./stores/auth.store";
export * from "./contracts/auth.contract";
export * from "./api/login.api";

// Re-export Better Auth client utilities
export {
  authClient,
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} from "@/shared/lib/auth-client";
