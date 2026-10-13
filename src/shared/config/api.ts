import { env } from "@/shared/lib/env";

export const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

/**
 * Root backend origin (e.g. "http://localhost:4009" from "http://localhost:4009/api/v1").
 * `fetcher` paths already include `/api/v1/...`, and Socket.IO is served by the
 * same backend, so both use this origin.
 */
export const API_ORIGIN = new URL(env.NEXT_PUBLIC_API_URL).origin;

/** Better Auth server (serves /api/auth/*). Defaults to the backend origin. */
export const AUTH_BASE_URL = env.NEXT_PUBLIC_AUTH_URL || API_ORIGIN;

/** Socket.IO server. Defaults to the backend origin. */
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || API_ORIGIN;
