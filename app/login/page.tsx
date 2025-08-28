"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Github, Loader2 } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { loginSchema } from "@/lib/validations"
import { useAnalytics } from "@/hooks/use-analytics"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const { trackEvent } = useAnalytics()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    // Check if there's an error message in the URL
    const url = new URL(window.location.href)
    const errorDescription = url.searchParams.get("error")
    if (errorDescription) {
      setAuthError(decodeURIComponent(errorDescription))
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setAuthError(error.message)
        return
      }

      trackEvent("login", { method: "email" })
      toast({
        title: "Success",
        description: "You have successfully logged in",
      })

      // Check if user needs to complete onboarding
      if (authData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("profession, skills")
          .eq("id", authData.user.id)
          .single()

        if (!profile?.profession || !profile?.skills || profile.skills.length === 0) {
          router.push("/onboarding")
          return
        }
      }

      router.push("/dashboard")
    } catch (error) {
      setAuthError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setAuthError(error.message)
      } else {
        trackEvent("login", { method: provider })
      }
    } catch (error) {
      setAuthError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-1">
          <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center">
            <span className="font-bold text-white">F</span>
          </div>
          <span className="font-bold text-xl">ForgeMancer</span>
        </Link>
        <ModeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto w-full max-w-md space-y-6 p-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Enter your credentials to sign in</p>
          </div>

          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              disabled={isLoading}
              onClick={() => handleSocialLogin("github")}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full"
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
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
