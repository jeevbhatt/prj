import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

// GET contact message by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*, message_replies(id, reply_content, sent_at, sent_by, users(name))")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching contact message:", error)
      return NextResponse.json({ error: "Failed to fetch contact message" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Contact message not found" }, { status: 404 })
    }

    // Mark as read if not already
    if (!data.is_read) {
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", id)
    }

    return NextResponse.json({ message: data })
  } catch (error) {
    console.error("Error fetching contact message:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// PUT update contact message (mark as read/unread)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const json = await request.json()
    const body = z
      .object({
        isRead: z.boolean().optional(),
      })
      .parse(json)

    const supabase = createServerClient()

    // Check if message exists
    const { data: existingMessage } = await supabase.from("contact_messages").select("id").eq("id", id).single()

    if (!existingMessage) {
      return NextResponse.json({ error: "Contact message not found" }, { status: 404 })
    }

    // Update message
    const updateData: any = {}
    if (body.isRead !== undefined) updateData.is_read = body.isRead

    const { data, error } = await supabase.from("contact_messages").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating contact message:", error)
      return NextResponse.json({ error: "Failed to update contact message" }, { status: 500 })
    }

    return NextResponse.json({ message: data })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error updating contact message:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// DELETE contact message
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createServerClient()

    // Check if message exists
    const { data: existingMessage } = await supabase.from("contact_messages").select("id").eq("id", id).single()

    if (!existingMessage) {
      return NextResponse.json({ error: "Contact message not found" }, { status: 404 })
    }

    // Delete message
    const { error } = await supabase.from("contact_messages").delete().eq("id", id)

    if (error) {
      console.error("Error deleting contact message:", error)
      return NextResponse.json({ error: "Failed to delete contact message" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting contact message:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
