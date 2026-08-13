import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, sessionSecret, verifySessionToken } from "@/lib/auth";

/**
 * Gates every /admin and /api/admin request. Runs on the Edge runtime, so it
 * only uses lib/auth (Web Crypto) — never the Cloudinary SDK. Unauthenticated
 * API calls get 401 JSON; unauthenticated page views redirect to /admin/login.
 * All admin routes are marked noindex.
 */
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // These must be reachable without a session.
  const isPublicAuthRoute =
    pathname === "/api/admin/login" || pathname === "/api/admin/logout" || pathname === "/admin/login";

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = token ? await verifySessionToken(token, sessionSecret()) : false;

  if (!ok && !isPublicAuthRoute) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
