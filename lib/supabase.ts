import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Create a single supabase client for the entire server-side application
export const createServerClient = (cookieStore: any) => {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// For client-side usage with auth helpers
export const createClientSupabase = () => {
  return createClientComponentClient<Database>()
}

// For direct client-side usage (with RLS policies)
export const createClientSupabaseClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Singleton pattern for client-side to prevent multiple instances
let clientSupabaseInstance: ReturnType<typeof createClientSupabaseClient>

export const getClientSupabase = () => {
  if (!clientSupabaseInstance) {
    clientSupabaseInstance = createClientSupabaseClient()
  }
  return clientSupabaseInstance
}
