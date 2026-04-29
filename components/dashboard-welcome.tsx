"use client"

import { useState, useEffect } from "react"
import { getClientSupabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Bot, FolderPlus, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export function DashboardWelcome() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getClientSupabase()

  useEffect(() => {
    async function loadUserData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        if (profile) setProfile(profile)
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadUserData()
  }, [])

  if (loading) {
    return (
      <div className="hero-welcome p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-9 w-72 mb-2" />
        <Skeleton className="h-4 w-96 mb-6" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
      </div>
    )
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const displayName = profile?.full_name?.split(" ")[0] || "there"

  return (
    <div className="hero-welcome animate-fade-in">
      {/* ── Ambient gradient orbs ── */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-3xl -translate-y-1/2 translate-x-1/4"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.6), rgba(99,102,241,0.3), transparent)' }}
      />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-[0.03] blur-3xl translate-y-1/3 -translate-x-1/4"
        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.5), transparent)' }}
      />

      {/* ── Dot pattern ── */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="relative p-6 md:p-8 lg:p-10">
        <div className="flex flex-col gap-6">
          {/* ── Top row: greeting ── */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-glow">
              {greeting()}, <span className="gradient-text">{displayName}</span>
            </h1>
            <p className="text-muted-foreground mt-1.5 text-sm md:text-base max-w-lg">
              Here&apos;s what&apos;s happening with your projects today.
            </p>
          </div>

          {/* ── Quick action pills ── */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/chat" className="pill-action group">
              <Bot className="h-4 w-4 text-primary" />
              <span>AI Chat</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/dashboard/projects/new" className="pill-action-primary group">
              <FolderPlus className="h-4 w-4" />
              <span>New Project</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/dashboard/tasks" className="pill-action group">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Tasks</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
