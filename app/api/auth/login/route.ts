import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { compare } from "bcrypt"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const body = loginSchema.parse(json)

    const supabase = createServerClient()

    // Find user in database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name, email, password, role")
      .eq("email", body.email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const passwordMatch = await compare(body.password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Sign in with Supabase Auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    })

    if (signInError) {
      console.error("Auth sign in error:", signInError)
      return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Login error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
