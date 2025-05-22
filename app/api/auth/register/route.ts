import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { hash } from "bcrypt"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "teacher"]).default("teacher"),
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const body = registerSchema.parse(json)

    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", body.email).single()

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(body.password, 10)

    // Create user in database
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role,
      })
      .select("id, name, email, role")
      .single()

    if (error) {
      console.error("Error creating user:", error)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Create auth user in Supabase
    const { error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        name: body.name,
        role: body.role,
        db_id: newUser.id,
      },
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      // Rollback user creation in database
      await supabase.from("users").delete().eq("id", newUser.id)
      return NextResponse.json({ error: "Failed to create auth user" }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Registration error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
