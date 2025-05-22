import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (supabaseClient === null) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}
