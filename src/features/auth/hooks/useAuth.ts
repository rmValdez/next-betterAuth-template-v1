import {
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import { login, logout, register } from "../api/login.api";
import { useAuthStore } from "../stores/auth.store";
import { authClient } from "@/shared/lib/auth-client";

export function clearAuthSession(
  setToken: (token: string | null) => void,
  queryClient: QueryClient,
) {
  setToken(null);
  queryClient.clear();
}

export function useAuth() {
  const setToken = useAuthStore((state) => state.setToken);
  const queryClient = useQueryClient();

  // Better Auth React Hook for reactive session observation
  const session = authClient.useSession();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.accessToken) setToken(data.accessToken);
      queryClient.invalidateQueries();
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data.accessToken) setToken(data.accessToken);
      queryClient.invalidateQueries();
    },
  });

  const clearSession = () => clearAuthSession(setToken, queryClient);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: clearSession,
    onError: clearSession,
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    session: session.data,
    isSessionPending: session.isPending,
    sessionError: session.error,
  };
}
