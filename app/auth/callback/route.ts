import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  // If there's no code, redirect to login
  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Create a Supabase client for the Server Component
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Check if the user has completed onboarding
    const { data: profile } = await supabase.from("profiles").select("profession, skills").eq("id", user.id).single()

    // If the user doesn't have a profession or skills, redirect to onboarding
    if (!profile?.profession || !profile?.skills || profile.skills.length === 0) {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }

    // Otherwise, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(new URL("/login?error=Something went wrong during authentication", request.url))
  }
}
