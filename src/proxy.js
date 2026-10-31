import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Optimistic check only: redirect unauthenticated visitors away from /admin.
// Real authorization happens in requireAdmin() (src/lib/dal.js).
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get("session")?.value;
  let ok = false;
  if (token && process.env.SESSION_SECRET) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.SESSION_SECRET),
        { algorithms: ["HS256"] },
      );
      ok = payload.role === "admin";
    } catch {}
  }
  if (!ok) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
