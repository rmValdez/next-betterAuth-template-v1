import { ApiError } from "@/shared/errors/api-error";
import { env } from "@/shared/lib/env";
import { API_ORIGIN } from "@/shared/config/api";
import { getToken, clearToken } from "@/shared/lib/token";

function classify(
  status: number,
):
  | "AUTH"
  | "FORBIDDEN"
  | "VALIDATION"
  | "NOT_FOUND"
  | "SERVER"
  | "NETWORK"
  | "UNKNOWN" {
  if (status === 401) return "AUTH";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 422) return "VALIDATION";
  if (status >= 500) return "SERVER";
  return "UNKNOWN";
}

let onTokenClearCallback: (() => void) | null = null;
export function setOnTokenClear(cb: () => void) {
  onTokenClearCallback = cb;
}

export async function fetcher<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(env.NEXT_PUBLIC_API_URL.includes("ngrok")
        ? { "ngrok-skip-browser-warning": "true" }
        : {}),
      ...(options?.headers || {}),
    };

    // Callers pass full paths ("/api/v1/users"), so prefix the origin only —
    // NEXT_PUBLIC_API_URL already ends in /api/v1 and would double it.
    const res = await fetch(`${API_ORIGIN}${url}`, {
      credentials: "include",
      ...options,
      headers,
    });

    if (!res.ok) {
      let payload: any = null;

      try {
        payload = await res.json();
      } catch {}

      const category = classify(res.status);
      const message = payload?.message || "Request failed";

      const isAuthError =
        res.status === 401 ||
        (typeof message === "string" &&
          (message.toLowerCase().includes("invalid token") ||
            message.toLowerCase().includes("user not found") ||
            message.toLowerCase().includes("deactivated") ||
            message.toLowerCase().includes("unauthorized")));

      // Better Auth sessions refresh themselves server-side while in use, so a
      // 401 means the session is gone: clear local state and send to login.
      if (isAuthError && !url.includes("/auth/sign-in")) {
        if (typeof window !== "undefined") {
          clearToken();
          localStorage.removeItem("active_store_context_id");
          if (onTokenClearCallback) {
            onTokenClearCallback();
          }

          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
        }
      }

      throw new ApiError(message, category, {
        status: res.status,
        code: payload?.code,
        details: payload?.details,
      });
    }

    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return undefined as T;
    }

    return res.json();
  } catch (err: any) {
    if (err instanceof TypeError) {
      throw new ApiError("Network error", "NETWORK");
    }
    throw err;
  }
}
