import { env } from "@/shared/lib/env";

export const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

/**
 * Derives root backend origin (e.g. "http://localhost:3002" from "http://localhost:3002/api/v1")
 * directly from NEXT_PUBLIC_API_URL so no extra .env variable is needed.
 */
export const AUTH_BASE_URL = new URL(env.NEXT_PUBLIC_API_URL).origin;
