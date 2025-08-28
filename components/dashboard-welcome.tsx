"use client"

import { useState, useEffect } from "react"
import { getClientSupabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/user-profile"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export function DashboardWelcome() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getClientSupabase()

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)

        // Get user data
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        setUser(user)

        // Get profile data
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profile) {
          setProfile(profile)
        }
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {profile?.full_name || user?.email?.split("@")[0] || "User"}</CardTitle>
          <CardDescription>Here's what's happening with your projects today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/projects">View your projects</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/projects/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create new project
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <UserProfile />

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/dashboard/chat">Start AI chat</Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/dashboard/tasks">View tasks</Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/dashboard/profile">Update profile</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
