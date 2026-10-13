import { create } from "zustand";
import {
  getToken,
  setToken as setStorageToken,
  clearToken as clearStorageToken,
} from "@/shared/lib/token";

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

import { setOnTokenClear } from "@/shared/lib/http";

export const useAuthStore = create<AuthState>((set) => ({
  token: getToken(),
  setToken: (token) => {
    if (token) setStorageToken(token);
    else clearStorageToken();
    set({ token });
  },
  clearToken: () => {
    clearStorageToken();
    set({ token: null });
  },
}));

setOnTokenClear(() => {
  useAuthStore.getState().clearToken();
});
