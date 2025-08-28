"use client"

import { useState, useEffect } from "react"
import { getClientSupabase } from "@/lib/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function UserProfile() {
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
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-[250px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[200px]" />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not signed in</CardTitle>
          <CardDescription>Please sign in to view your profile</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>{profile?.provider ? `Connected with ${profile.provider}` : "Email account"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
            <AvatarFallback>
              {profile?.full_name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("") ||
                user.email?.substring(0, 2).toUpperCase() ||
                "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-medium">{profile?.full_name || user.email?.split("@")[0]}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {profile?.provider && (
          <div>
            <Badge variant="outline" className="capitalize">
              {profile.provider}
            </Badge>
          </div>
        )}

        {profile?.bio && (
          <div>
            <h3 className="text-sm font-medium">Bio</h3>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        )}

        {profile?.skills && profile.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-medium">Skills</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
