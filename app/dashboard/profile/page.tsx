"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { PageTransition } from "@/components/page-transition"
import { Loader2, Mail, MapPin, Phone } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema } from "@/lib/validations"
import { useToast } from "@/components/ui/use-toast"
import { getClientSupabase } from "@/lib/supabase"
import Image from "next/image"
import { useAnalytics } from "@/hooks/use-analytics"

type ProfileFormData = {
  fullName: string
  email: string
  bio: string
  profession: string
  skills: string
  phone: string
  location: string
}

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const { toast } = useToast()
  const supabase = getClientSupabase()
  const { trackEvent } = useAnalytics()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    setIsMounted(true)
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)

      // Get user data
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setUserData(user)

      // Get profile data
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile) {
        setProfileData(profile)

        // Set form values
        setValue("fullName", profile.full_name || "")
        setValue("bio", profile.bio || "")
        setValue("profession", profile.profession || "")
        setValue("skills", profile.skills ? profile.skills.join(", ") : "")
        setValue("email", user.email || "")
        setValue("phone", profile.phone || "")
        setValue("location", profile.location || "")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    if (!userData) return

    setIsLoading(true)
    try {
      // Update profile
      const { error } = await supabase.from("profiles").upsert({
        id: userData.id,
        full_name: data.fullName,
        bio: data.bio,
        profession: data.profession,
        skills: data.skills.split(",").map((skill) => skill.trim()),
        phone: data.phone,
        location: data.location,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      trackEvent("profile_updated")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and public profile</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      {profileData?.avatar_url ? (
                        <div className="relative h-20 w-20 overflow-hidden rounded-full">
                          <Image
                            src={profileData.avatar_url || "/placeholder.svg"}
                            alt="Profile"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                          <span className="text-2xl font-medium">{profileData?.full_name?.charAt(0) || "U"}</span>
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                          type="button"
                        >
                          Change
                        </Button>
                        {profileData?.provider && (
                          <p className="text-xs text-muted-foreground">Connected with {profileData.provider}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full name</Label>
                      <Input
                        id="fullName"
                        {...register("fullName")}
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        disabled
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    className={`min-h-[100px] ${errors.bio ? "border-red-500" : ""}`}
                    {...register("bio")}
                  />
                  {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    {...register("profession")}
                    className={errors.profession ? "border-red-500" : ""}
                  />
                  {errors.profession && <p className="text-sm text-red-500">{errors.profession.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Textarea
                    id="skills"
                    placeholder="e.g. JavaScript, React, UI/UX Design"
                    className={`min-h-[100px] ${errors.skills ? "border-red-500" : ""}`}
                    {...register("skills")}
                  />
                  {errors.skills && <p className="text-sm text-red-500">{errors.skills.message}</p>}
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{userData?.email || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{profileData?.phone || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{profileData?.location || "Not set"}</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register("phone")} className={errors.phone ? "border-red-500" : ""} />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...register("location")}
                      className={errors.location ? "border-red-500" : ""}
                    />
                    {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                  </div>
                  <Button type="submit" variant="outline" className="w-full" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Contact Info"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!profileData?.provider ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button variant="outline" className="w-full mt-2">
                      Change Password
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-muted-foreground">
                      Password management is handled by your {profileData.provider} account.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
