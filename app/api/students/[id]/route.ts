import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

const studentUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  rollNo: z.string().min(1, "Roll number is required").optional(),
  grade: z.string().min(1, "Grade is required").optional(),
  section: z.string().min(1, "Section is required").optional(),
  gender: z.string().min(1, "Gender is required").optional(),
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  address: z.string().optional(),
})

// GET student by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createServerClient()

    const { data, error } = await supabase.from("students").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching student:", error)
      return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ student: data })
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// PUT update student
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const json = await request.json()
    const body = studentUpdateSchema.parse(json)

    const supabase = createServerClient()

    // Check if student exists
    const { data: existingStudent } = await supabase.from("students").select("id").eq("id", id).single()

    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check if roll number is unique if updating
    if (body.rollNo) {
      const { data: rollNoCheck } = await supabase
        .from("students")
        .select("id")
        .eq("roll_no", body.rollNo)
        .neq("id", id)
        .single()

      if (rollNoCheck) {
        return NextResponse.json({ error: "A student with this roll number already exists" }, { status: 400 })
      }
    }

    // Update student
    const updateData: any = {}
    if (body.name) updateData.name = body.name
    if (body.rollNo) updateData.roll_no = body.rollNo
    if (body.grade) updateData.grade = body.grade
    if (body.section) updateData.section = body.section
    if (body.gender) updateData.gender = body.gender
    if (body.phone !== undefined) updateData.phone = body.phone || null
    if (body.email !== undefined) updateData.email = body.email || null
    if (body.address !== undefined) updateData.address = body.address || null

    const { data, error } = await supabase.from("students").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating student:", error)
      return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
    }

    return NextResponse.json({ student: data })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error updating student:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// DELETE student
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createServerClient()

    // Check if student exists
    const { data: existingStudent } = await supabase.from("students").select("id").eq("id", id).single()

    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Delete student
    const { error } = await supabase.from("students").delete().eq("id", id)

    if (error) {
      console.error("Error deleting student:", error)
      return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
