import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuth = !!token

  // Protect routes that require authentication
  if (!isAuth && (
    request.nextUrl.pathname.startsWith("/teams/new") ||
    request.nextUrl.pathname.startsWith("/teams/") ||
    request.nextUrl.pathname.startsWith("/events/new") ||
    request.nextUrl.pathname.startsWith("/export/")
  )) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/teams/new",
    "/teams/:path*",
    "/events/new",
    "/export/:path*",
  ],
}

