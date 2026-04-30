"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

const profilePayloadSchema = z.object({
  fullName: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  profession: z.string().trim().optional(),
  skills: z.array(z.string().trim()).default([]),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  experienceLevel: z.string().trim().optional(),
  workStyle: z.string().trim().optional(),
})

const onboardingPayloadSchema = z.object({
  profession: z.string().trim().min(1, "Profession is required"),
  bio: z.string().trim().optional(),
  skills: z.array(z.string().trim()).min(1, "At least one skill is required"),
  experience: z.string().trim().min(1, "Experience level is required"),
  interests: z.array(z.string().trim()).min(1, "At least one interest is required"),
  location: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  preferredTools: z.array(z.string().trim()).optional(),
  workStyle: z.string().trim().optional(),
  goals: z.string().trim().optional(),
})

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin configuration")
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  if (!user) {
    throw new Error("Not authenticated")
  }

  return user
}

function getProfileFallbacks(user: Awaited<ReturnType<typeof getAuthenticatedUser>>, profile?: Partial<ProfileRow> | null) {
  const metadata = user.user_metadata || {}
  const appMetadata = user.app_metadata || {}
  const fallbackName =
    metadata.full_name ||
    metadata.name ||
    [metadata.first_name, metadata.last_name].filter(Boolean).join(" ") ||
    user.email?.split("@")[0] ||
    ""

  return {
    id: user.id,
    full_name: profile?.full_name || fallbackName,
    avatar_url: profile?.avatar_url || metadata.avatar_url || metadata.picture || null,
    provider: profile?.provider || appMetadata.provider || null,
    bio: profile?.bio || "",
    profession: profile?.profession || "",
    skills: Array.isArray(profile?.skills) ? profile.skills : [],
    phone: profile?.phone || "",
    location: profile?.location || "",
    email: user.email || "",
  }
}

async function getOrCreateProfile(user: Awaited<ReturnType<typeof getAuthenticatedUser>>) {
  const admin = createAdminClient()
  const { data: existingProfile, error: readError } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  if (readError) {
    throw readError
  }

  if (existingProfile) {
    return getProfileFallbacks(user, existingProfile)
  }

  const fallbackProfile = getProfileFallbacks(user, null)
  const { data: createdProfile, error: createError } = await admin
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fallbackProfile.full_name,
      avatar_url: fallbackProfile.avatar_url,
      provider: fallbackProfile.provider,
      bio: fallbackProfile.bio,
      profession: fallbackProfile.profession,
      skills: fallbackProfile.skills,
      phone: fallbackProfile.phone,
      location: fallbackProfile.location,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (createError) {
    throw createError
  }

  return getProfileFallbacks(user, createdProfile)
}

export async function getProfile() {
  try {
    const user = await getAuthenticatedUser()
    const profile = await getOrCreateProfile(user)
    return { profile }
  } catch (error: any) {
    console.error("Profile fetch error:", error)
    return { error: error.message || "Failed to load profile data" }
  }
}

export async function saveProfile(input: z.input<typeof profilePayloadSchema>) {
  try {
    const user = await getAuthenticatedUser()
    const payload = profilePayloadSchema.parse(input)
    const fallbackProfile = getProfileFallbacks(user, null)
    const admin = createAdminClient()

    const { data, error } = await admin
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: payload.fullName || fallbackProfile.full_name,
        avatar_url: fallbackProfile.avatar_url,
        provider: fallbackProfile.provider,
        bio: payload.bio || "",
        profession: payload.profession || "",
        skills: payload.skills,
        phone: payload.phone || "",
        location: payload.location || "",
        experience_level: payload.experienceLevel || undefined,
        work_style: payload.workStyle || undefined,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    revalidatePath("/dashboard/profile")
    return { profile: getProfileFallbacks(user, data) }
  } catch (error: any) {
    console.error("Profile save error:", error)
    return { error: error.message || "Failed to save profile" }
  }
}

export async function completeOnboarding(input: z.input<typeof onboardingPayloadSchema>) {
  try {
    const user = await getAuthenticatedUser()
    const payload = onboardingPayloadSchema.parse(input)
    const fallbackProfile = getProfileFallbacks(user, null)
    const admin = createAdminClient()

    const { error } = await admin
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fallbackProfile.full_name,
        avatar_url: fallbackProfile.avatar_url,
        provider: fallbackProfile.provider,
        profession: payload.profession,
        bio: payload.bio || "",
        skills: payload.skills,
        experience_level: payload.experience,
        interests: payload.interests,
        location: payload.location || "",
        phone: payload.phone || "",
        preferred_tools: payload.preferredTools || [],
        work_style: payload.workStyle || "",
        goals: payload.goals || "",
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (error) {
      throw error
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/profile")
    return { success: true }
  } catch (error: any) {
    console.error("Onboarding save error:", error)
    return { error: error.message || "Failed to save onboarding" }
  }
}
