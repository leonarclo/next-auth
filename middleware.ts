import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path === "/register" ||
    path === "/login" ||
    path === "/verifyEmail" ||
    path === "/password/forget";

  const token = request.cookies.get("token")?.value || "";
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/profile/:path*",
    "/login",
    "/register",
    "/verifyEmail",
    "/password/forget",
  ],
};
