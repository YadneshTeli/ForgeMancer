import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return response
  }

  // Get the pathname
  const { pathname } = request.nextUrl

  // Auth routes that don't require authentication
  const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"]
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Auth callback route
  const isAuthCallback = pathname.startsWith("/auth/callback")

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/about", "/contact", "/pricing", "/blog", "/try"]
  const isPublicFile = /\.(png|jpg|jpeg|gif|svg|ico|txt|xml|html|webmanifest|json)$/i.test(pathname)
  const isPublicRoute =
    publicRoutes.some((route) => pathname === route) || pathname.startsWith("/api/") || isPublicFile

  // Check if any Supabase auth cookies are present in the request
  const allCookies = request.cookies.getAll()
  const hasAuthCookies = allCookies.some(
    (cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token")
  )

  // Fast path: if no auth cookies exist, avoid unnecessary network calls to Supabase
  if (!hasAuthCookies) {
    // Unauthenticated user accessing protected route -> redirect immediately to /login
    if (!isAuthRoute && !isPublicRoute && !isAuthCallback) {
      const redirectUrl = new URL("/login", request.url)
      return NextResponse.redirect(redirectUrl)
    }
    // Public or auth routes -> allow immediately with zero network latency
    return response
  }

  // If auth cookies are present, verify user session with a timeout & try/catch guard
  let user = null
  try {
    const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    })

    // Guard with a 2.5-second timeout so middleware never exhausts Vercel's 10s budget
    const authTimeout = new Promise<{ data: { user: null }; error: Error }>((_, reject) =>
      setTimeout(() => reject(new Error("Supabase auth verification timed out")), 2500)
    )

    const result = (await Promise.race([supabase.auth.getUser(), authTimeout])) as {
      data: { user: any }
      error?: any
    }

    user = result?.data?.user ?? null
  } catch (error) {
    console.error("Middleware Supabase auth verification failed or timed out:", error)
    user = null
  }

  // If user is not authenticated and trying to access a protected route
  if (!user && !isAuthRoute && !isPublicRoute && !isAuthCallback) {
    const redirectUrl = new URL("/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth routes
  if (user && isAuthRoute) {
    const redirectUrl = new URL("/dashboard", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

// Specify which paths this proxy should run on
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
