import { NextResponse, NextRequest } from "next/server";
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
    } catch (err) {
        console.log("Catch block", err);
        return NextResponse.redirect(new URL("/", req.url));
    }
    console.log("Close to next");
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
