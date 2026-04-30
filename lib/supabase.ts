import { createClient } from "@supabase/supabase-js"
import {
  createBrowserClient,
  createServerClient as createSupabaseServerClient,
  type CookieOptions,
} from "@supabase/ssr"
import type { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

const getSupabaseBrowserConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing public Supabase URL or anon key")
  }

  return { supabaseUrl, supabaseKey }
}

// Create a single supabase client for the entire server-side application
export const createServerClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase URL or anon key")
  }

  return createSupabaseServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server components cannot set cookies; middleware/actions will refresh them.
        }
      },
    },
  })
}

// For client-side usage with auth helpers
export const createClientSupabase = () => {
  const { supabaseUrl, supabaseKey } = getSupabaseBrowserConfig()
  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}

// For direct client-side usage (with RLS policies)
export const createClientSupabaseClient = () => {
  const { supabaseUrl, supabaseKey } = getSupabaseBrowserConfig()
  return createClient<Database>(supabaseUrl, supabaseKey)
}

// Singleton pattern for client-side to prevent multiple instances while keeping
// auth cookies in sync with the SSR proxy.
let clientSupabaseInstance: ReturnType<typeof createClientSupabase>

export const getClientSupabase = () => {
  if (!clientSupabaseInstance) {
    clientSupabaseInstance = createClientSupabase()
  }
  return clientSupabaseInstance
}
