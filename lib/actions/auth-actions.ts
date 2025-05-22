"use server"

import { createServerClient } from "@/lib/supabase/server"
import { hash, compare } from "bcrypt"
import { z } from "zod"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "teacher"]).default("teacher"),
})

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const result = loginSchema.parse({ email, password })

    const supabase = createServerClient()

    // Find user in database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name, email, password, role")
      .eq("email", result.email)
      .single()

    if (userError || !user) {
      return { error: "Invalid email or password" }
    }

    // Verify password
    const passwordMatch = await compare(result.password, user.password)
    if (!passwordMatch) {
      return { error: "Invalid email or password" }
    }

    // Sign in with Supabase Auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: result.email,
      password: result.password,
    })

    if (signInError) {
      console.error("Auth sign in error:", signInError)
      return { error: "Authentication failed" }
    }

    return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }

    console.error("Login error:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = (formData.get("role") as "admin" | "teacher") || "teacher"

  try {
    const result = registerSchema.parse({ name, email, password, role })

    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", result.email).single()

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await hash(result.password, 10)

    // Create user in database
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        name: result.name,
        email: result.email,
        password: hashedPassword,
        role: result.role,
      })
      .select("id, name, email, role")
      .single()

    if (error) {
      console.error("Error creating user:", error)
      return { error: "Failed to create user" }
    }

    // Create auth user in Supabase
    const { error: authError } = await supabase.auth.admin.createUser({
      email: result.email,
      password: result.password,
      email_confirm: true,
      user_metadata: {
        name: result.name,
        role: result.role,
        db_id: newUser.id,
      },
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      // Rollback user creation in database
      await supabase.from("users").delete().eq("id", newUser.id)
      return { error: "Failed to create auth user" }
    }

    return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }

    console.error("Registration error:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function logout() {
  const supabase = createServerClient()

  await supabase.auth.signOut()

  cookies().delete("supabase-auth-token")

  redirect("/login")
}
