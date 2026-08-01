import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("wishey_session")?.value;

  const session = token ? verifySessionToken(token) : null;

  // Protect Admin routes (/admin, /admin/*, /api/admin/*)
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!session) {
      if (pathname.startsWith("/api/")) {
        return Response.json(
          { success: false, message: "Authentication required for admin access" },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return Response.json(
          { success: false, message: "Admin privileges required" },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect User Wish routes (/wish/list, /wish/create)
  if (pathname.startsWith("/wish/list") || pathname.startsWith("/wish/create")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/wish/list", "/wish/create", "/admin", "/admin/:path*", "/api/admin/:path*"],
};
