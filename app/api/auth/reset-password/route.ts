import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const body = resetPasswordSchema.parse(json)

    const supabase = createServerClient()

    // Check if user exists
    const { data: user } = await supabase.from("users").select("id").eq("email", body.email).single()

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: "If an account with that email exists, a password reset link has been sent",
      })
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/confirm`,
    })

    if (error) {
      console.error("Password reset error:", error)
      return NextResponse.json({ error: "Failed to send password reset email" }, { status: 500 })
    }

    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Password reset error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
