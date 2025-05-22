import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"
import nodemailer from "nodemailer"

const contactSchema = z.object({
  fullname: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

// GET contact messages
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get query parameters
    const url = new URL(request.url)
    const filter = url.searchParams.get("filter") || "all"
    const search = url.searchParams.get("search")

    let query = supabase
      .from("contact_messages")
      .select("*, message_replies(id, reply_content, sent_at, sent_by, users(name))")

    // Apply filters
    if (filter === "unread") {
      query = query.eq("is_read", false)
    } else if (filter === "replied") {
      query = query.eq("is_replied", true)
    } else if (filter === "unreplied") {
      query = query.eq("is_replied", false)
    }

    if (search) {
      query = query.or(`fullname.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching contact messages:", error)
      return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 })
    }

    return NextResponse.json({ messages: data })
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// POST new contact message
export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const body = contactSchema.parse(json)

    const supabase = createServerClient()

    // Create contact message
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        fullname: body.fullname,
        email: body.email,
        message: body.message,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating contact message:", error)
      return NextResponse.json({ error: "Failed to submit contact message" }, { status: 500 })
    }

    // Send email notification to admin
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: "New Contact Form Submission",
        text: `
          Name: ${body.fullname}
          Email: ${body.email}
          Message: ${body.message}
        `,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${body.fullname}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Message:</strong> ${body.message}</p>
        `,
      })
    } catch (emailError) {
      console.error("Error sending email notification:", emailError)
      // Continue even if email fails
    }

    return NextResponse.json({ message: data })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error submitting contact message:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
