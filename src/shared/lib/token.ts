const TOKEN_KEY = "token";
// Written by older builds that used JWT refresh tokens; cleared on logout.
const LEGACY_REFRESH_TOKEN_KEY = "refresh_token";
const SESSION_COOKIE = "has_session";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Lax`;
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  document.cookie = `${SESSION_COOKIE}=; path=/; SameSite=Lax; Max-Age=0`;
}
