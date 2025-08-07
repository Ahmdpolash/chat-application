// middleware

import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", req.url));
};

export const config = {
  matcher: ["/chat"],
};
