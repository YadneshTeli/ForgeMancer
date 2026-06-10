"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github, Loader2, Lock, Mail } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"
import { getClientSupabase } from "@/lib/supabase"

interface AuthGateProps {
  onAuthComplete: () => void // Kept for prop compatibility
}

export function AuthGate({ onAuthComplete }: AuthGateProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()
  const { trackEvent } = useAnalytics()
  const supabase = getClientSupabase()

  // Track that the auth gate was shown
  useEffect(() => {
    trackEvent("try_auth_gate_shown")
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?from=try`,
        },
      })

      if (error) {
        setAuthError(error.message)
      } else {
        trackEvent("try_oauth_started", { provider })
      }
    } catch {
      setAuthError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Glassmorphism auth card */}
      <div className="glass-card rounded-2xl border border-primary/20 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/25">
            <Lock className="h-7 w-7 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">
              Sign up to generate your AI plan
            </h3>
            <p className="text-sm text-muted-foreground">
              Create a free account to unlock your personalized project plan
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Error alert */}
          {authError && (
            <Alert variant="destructive">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          {/* Social login buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-11"
              disabled={isLoading}
              onClick={() => handleSocialLogin("github")}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full h-11"
              disabled={isLoading}
              onClick={() => handleSocialLogin("google")}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Dedicated Sign Up / Log In Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full h-11 gradient-bg border-0 text-white font-medium"
              disabled={isLoading}
              onClick={() => router.push("/signup?from=try")}
            >
              <Mail className="mr-2 h-4 w-4" />
              Sign Up with Email
            </Button>

            <div className="text-center text-sm pt-2">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login?from=try")}
                  className="text-primary hover:underline font-semibold"
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust indicator */}
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary flex items-start gap-2">
        <Lock className="h-4 w-4 mt-0.5 shrink-0" />
        <p>Your project details are saved securely. After signing up, we&apos;ll generate your personalized AI plan instantly.</p>
      </div>
    </div>
  )
}
