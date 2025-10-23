// import { NextResponse, NextRequest } from "next/server";
// import { auth } from "./lib/providers/auth";

// export async function middleware(req: NextRequest) {
//     try {
//     const { pathname } = req.nextUrl;
//     const token = req.cookies.get("access_token")?.value;

//     if (!token?.trim() && pathname !== "/login") {
//         return NextResponse.redirect(new URL("/login", req.url));
//     }
    
//     if (token) {
//         const okUser = await auth({ token: token });
//         console.log("auth state", okUser);

//         if (!okUser && pathname !== "/login") {
//             return NextResponse.redirect(new URL("/login", req.url));
//         }

//         if (pathname === "/login" && okUser) {
//             return NextResponse.redirect(new URL("/", req.url));
//         }
//     }
      
//     } catch {
//        return NextResponse.redirect(new URL("/", req.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         "/:path*/edit/:id",
//         "/postads",
//         "/profile",
//         "/buylater",
//         "/login",
//         "/settings",
//         "/workspace/:path*",
//     ],
// };
