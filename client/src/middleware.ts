// middleware
import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  // If not logged in and not already on login/register, go to login
  if (!token && pathname !== "/login" && pathname !== "/register") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in and on login/register, go to home
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/", "/login", "/register"],
};
