import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { hash } from "bcrypt"
import { z } from "zod"

const updatePasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const body = updatePasswordSchema.parse(json)

    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Hash new password
    const hashedPassword = await hash(body.password, 10)

    // Update password in database
    const { error: dbError } = await supabase.from("users").update({ password: hashedPassword }).eq("email", user.email)

    if (dbError) {
      console.error("Error updating password in DB:", dbError)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    // Update password in Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      password: body.password,
    })

    if (authError) {
      console.error("Error updating auth password:", authError)
      return NextResponse.json({ error: "Failed to update authentication password" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Update password error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
