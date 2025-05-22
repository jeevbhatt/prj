import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  rollNo: z.string().min(1, "Roll number is required"),
  grade: z.string().min(1, "Grade is required"),
  section: z.string().min(1, "Section is required"),
  gender: z.string().min(1, "Gender is required"),
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  address: z.string().optional(),
})

// GET all students
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get query parameters
    const url = new URL(request.url)
    const grade = url.searchParams.get("grade")
    const search = url.searchParams.get("search")

    let query = supabase.from("students").select("*")

    // Apply filters if provided
    if (grade && grade !== "all") {
      query = query.eq("grade", grade)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,roll_no.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching students:", error)
      return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
    }

    return NextResponse.json({ students: data })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// POST new student
export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const body = studentSchema.parse(json)

    const supabase = createServerClient()

    // Check if roll number already exists
    const { data: existingStudent } = await supabase.from("students").select("id").eq("roll_no", body.rollNo).single()

    if (existingStudent) {
      return NextResponse.json({ error: "A student with this roll number already exists" }, { status: 400 })
    }

    // Create student
    const { data, error } = await supabase
      .from("students")
      .insert({
        name: body.name,
        roll_no: body.rollNo,
        grade: body.grade,
        section: body.section,
        gender: body.gender,
        phone: body.phone || null,
        email: body.email || null,
        address: body.address || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating student:", error)
      return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
    }

    return NextResponse.json({ student: data })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating student:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
