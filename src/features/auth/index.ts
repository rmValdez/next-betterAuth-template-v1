// src/features/auth/index.ts
export { default as LoginForm } from "./components/LoginForm";
export { default as RegisterWorkflow } from "./components/RegisterWorkflow";
export { AdminAuthGate } from "./components/AdminAuthGate";
export { SellerAuthGate } from "./components/SellerAuthGate";
export { AgentAuthGate } from "./components/AgentAuthGate";
export { AuthListener } from "./components/AuthListener";

export { useAuth, clearAuthSession } from "./hooks/useAuth";
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
