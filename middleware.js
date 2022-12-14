import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const middleware = async (req) => {
  const session = await getToken({ req, secret: process.env.JWT_SECRET });
  if (!session) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
  // console.dir(session)
  return NextResponse.next();
};

export const config = {
  matcher: [
    "/",
    "/order/:path*",
    // "/dashboard/:path*",
    "/receive/:path*",
    "/stock/:path*",
    // "/report/:path*",
  ],
};

export default middleware;
