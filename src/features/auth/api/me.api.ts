import { fetcher } from "@/shared/lib/http";
import { MeResponseSchema, type Me } from "../contracts/auth.contract";

export const authKeys = {
  me: () => ["auth", "me"] as const,
};

/** `GET /api/v1/auth/me` — the signed-in user's profile and permissions. */
export const getMe = async (): Promise<Me> => {
  const raw = await fetcher<unknown>("/api/v1/auth/me");
  return MeResponseSchema.parse(raw).data;
};
