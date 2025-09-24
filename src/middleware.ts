import { jwtVerify } from "jose";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;

  // If no token and trying to access protected routes → redirect to login
  if (!token?.trim() && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    if (token) {
      const okUser = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET_KEY!)
      );

      // If user is logged in and tries to access /login → redirect home
      if (pathname === "/login" && okUser) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  } catch {
    // Invalid or expired token → redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:path*/edit/:id",
    "/postads",
    "/profile",
    "/buylater",
    "/login",
    "/settings",
    "/workspace/:path*",
  ],
};
