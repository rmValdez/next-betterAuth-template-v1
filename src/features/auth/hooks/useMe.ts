import { useSafeQuery } from "@/shared/query/useSafeQuery";
import { authKeys, getMe } from "../api/me.api";

/** The signed-in user's profile, role and permissions from the backend. */
export function useMe() {
  return useSafeQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
  });
}
