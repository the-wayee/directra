import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/home", "/new", "/projects", "/c", "/settings"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  if (!isProtected) return NextResponse.next()

  // Better Auth stores session in a cookie named "better-auth.session_token"
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/home/:path*", "/new/:path*", "/projects/:path*", "/c/:path*", "/settings/:path*"],
}
