import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose"
export const runtime = "nodejs";

const secret = new TextEncoder().encode(`${process.env.JWT_SECRET_KEY}`);
export async function middleware(req: NextRequest) {
   const { pathname } = req.nextUrl;
   const token = req.cookies.get("access_token")?.value;

   if (!token?.trim() && pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
   }

   try {
      if (token) {
         const isAuthenticated = await jwtVerify(token, secret, { algorithms: ["HS256"] });

         if (pathname === "/login" && isAuthenticated) {
            return NextResponse.redirect(new URL("/", req.url));
         }
      }
   } catch {
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.delete("access_token");
      return response;
   }
   return NextResponse.next();
}

export const config = {
    matcher: [
        "/:path*/edit/:id",
        "/post-ads",
        "/profile",
        "/buy-later",
        "/login",
        "/settings",
        "/workspace/:path*",
    ],
};
