import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

const themeSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
})

// GET user theme preference
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { theme: "system" }, // Default theme for unauthenticated users
      )
    }

    // Get user from database
    const { data: dbUser } = await supabase.from("users").select("id").eq("email", user.email).single()

    if (!dbUser) {
      return NextResponse.json({ theme: "system" })
    }

    // Get user preference
    const { data: preference } = await supabase
      .from("user_preferences")
      .select("theme")
      .eq("user_id", dbUser.id)
      .single()

    return NextResponse.json({
      theme: preference?.theme || "system",
    })
  } catch (error) {
    console.error("Error fetching theme preference:", error)
    return NextResponse.json(
      { theme: "system" }, // Default theme on error
    )
  }
}

// POST update theme preference
export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const body = themeSchema.parse(json)

    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const { data: dbUser } = await supabase.from("users").select("id").eq("email", user.email).single()

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if preference exists
    const { data: existingPreference } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", dbUser.id)
      .single()

    if (existingPreference) {
      // Update preference
      const { error } = await supabase
        .from("user_preferences")
        .update({ theme: body.theme })
        .eq("id", existingPreference.id)

      if (error) {
        console.error("Error updating theme preference:", error)
        return NextResponse.json({ error: "Failed to update theme preference" }, { status: 500 })
      }
    } else {
      // Create preference
      const { error } = await supabase.from("user_preferences").insert({
        user_id: dbUser.id,
        theme: body.theme,
      })

      if (error) {
        console.error("Error creating theme preference:", error)
        return NextResponse.json({ error: "Failed to create theme preference" }, { status: 500 })
      }
    }

    return NextResponse.json({ theme: body.theme })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error updating theme preference:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
