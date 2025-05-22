import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createServerClient()

    // Sign out from Supabase Auth
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Logout error:", error)
      return NextResponse.json({ error: "Failed to log out" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
