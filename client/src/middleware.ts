import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

function redirectToSignIn(req: NextRequest) {
  const loginUrl = new URL("/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  console.log("Token from cookie:", token);

  if (!token) return redirectToSignIn(req);

  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in Next.js env");
    }

    const secretKey = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secretKey);

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return redirectToSignIn(req);
  }
}


export const config = {
  matcher: [
    // protect everything except login, forget, register, reset-password, and Next.js static files
    "/((?!login|forget|register|reset-password|_next|favicon.ico).*)",
  ],
};



// export const config = {
//   matcher: [
//      "/",
//     "/dashboard/:path*",
//     "/account/:path*",
//     "/protected/:path*",
//   ],
// };
