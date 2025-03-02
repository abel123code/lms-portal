import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authRoutes, publicRoutes } from "@/routes";

export async function middleware(req) {
  console.log("Middleware triggered:", req.nextUrl.pathname);
  const { pathname } = req.nextUrl;

  // 1) Get the JWT token (contains session data)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  //console.log("token from middleware:::", token);

  // 2) Redirect logged-in users away from login/signup pages
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(getRedirectPath(token.role), req.url));
  }

  // 3) Restrict users who are NOT logged in (except for public routes)
  if (!token && !publicRoutes.includes(pathname) && !authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4) Restrict users based on role
  if (token) {
    if (token.vetted === false && pathname !== "/waiting-for-approval") {
      return NextResponse.redirect(new URL("/waiting-for-approval", req.url));
    }

    if (token.role === "student" && pathname.startsWith("/teacher")) {
      return NextResponse.redirect(new URL("/student", req.url));
    }

    if (token.role === "teacher" && pathname.startsWith("/student")) {
      return NextResponse.redirect(new URL("/teacher", req.url));
    }
  }

  // 5) Allow the request to continue
  return NextResponse.next();
}

// Function to determine the correct redirect path based on role
function getRedirectPath(role) {
  if (role === "student") return "/student";
  if (role === "teacher") return "/teacher";
  return "/"; // Default in case of unknown roles
}

// Match protected routes: apply middleware to everything except public files
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Match all pages except API routes, _next, or static files
};
