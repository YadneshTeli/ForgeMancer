import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the pathname
  const { pathname } = request.nextUrl

  // Auth routes that don't require authentication
  const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"]
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Auth callback route
  const isAuthCallback = pathname.startsWith("/auth/callback")

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/about", "/contact", "/pricing", "/blog"]
  const isPublicRoute = publicRoutes.some((route) => pathname === route) || pathname.startsWith("/api/")

  // If user is not authenticated and trying to access a protected route
  if (!session && !isAuthRoute && !isPublicRoute && !isAuthCallback) {
    const redirectUrl = new URL("/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth routes
  if (session && isAuthRoute) {
    const redirectUrl = new URL("/dashboard", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

// Specify which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
