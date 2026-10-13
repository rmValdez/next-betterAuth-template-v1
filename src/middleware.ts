import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Fast redirect for signed-out visitors. `has_session` is a non-secret hint
 * set by the client on sign-in (src/shared/lib/token.ts); the Better Auth
 * session cookie lives on the backend's domain, so it can't be checked here.
 * <AuthGate> performs the authoritative session check.
 */
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.get("has_session");

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
