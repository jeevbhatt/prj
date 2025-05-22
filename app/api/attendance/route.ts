import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

const attendanceSchema = z.object({
  studentId: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  status: z.enum(["present", "absent", "late"]),
  time: z.string().optional(),
})

// GET attendance records
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get query parameters
    const url = new URL(request.url)
    const date = url.searchParams.get("date")
    const studentId = url.searchParams.get("studentId")

    let query = supabase.from("attendance").select("*, students(name, roll_no, grade, section)")

    // Apply filters if provided
    if (date) {
      query = query.eq("date", date)
    }

    if (studentId) {
      query = query.eq("student_id", studentId)
    }

    const { data, error } = await query.order("date", { ascending: false })

    if (error) {
      console.error("Error fetching attendance:", error)
      return NextResponse.json({ error: "Failed to fetch attendance records" }, { status: 500 })
    }

    return NextResponse.json({ attendance: data })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// POST new attendance record
export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const body = attendanceSchema.parse(json)

    const supabase = createServerClient()

    // Check if student exists
    const { data: student } = await supabase.from("students").select("id").eq("id", body.studentId).single()

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check if attendance record already exists for this student on this date
    const { data: existingRecord } = await supabase
      .from("attendance")
      .select("id")
      .eq("student_id", body.studentId)
      .eq("date", body.date)
      .single()

    if (existingRecord) {
      // Update existing record
      const { data, error } = await supabase
        .from("attendance")
        .update({
          status: body.status,
          time: body.time || null,
        })
        .eq("id", existingRecord.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating attendance:", error)
        return NextResponse.json({ error: "Failed to update attendance record" }, { status: 500 })
      }

      return NextResponse.json({ attendance: data })
    } else {
      // Create new record
      const { data, error } = await supabase
        .from("attendance")
        .insert({
          student_id: body.studentId,
          date: body.date,
          status: body.status,
          time: body.time || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating attendance:", error)
        return NextResponse.json({ error: "Failed to create attendance record" }, { status: 500 })
      }

      return NextResponse.json({ attendance: data })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating attendance:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
