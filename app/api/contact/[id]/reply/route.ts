import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"
import nodemailer from "nodemailer"

const replySchema = z.object({
  replyContent: z.string().min(10, "Reply must be at least 10 characters"),
  userId: z.number(),
})

// POST reply to contact message
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messageId = params.id
    const json = await request.json()
    const body = replySchema.parse(json)

    const supabase = createServerClient()

    // Check if message exists and get recipient email
    const { data: message } = await supabase
      .from("contact_messages")
      .select("id, fullname, email")
      .eq("id", messageId)
      .single()

    if (!message) {
      return NextResponse.json({ error: "Contact message not found" }, { status: 404 })
    }

    // Create reply
    const { data: reply, error } = await supabase
      .from("message_replies")
      .insert({
        message_id: Number.parseInt(messageId),
        reply_content: body.replyContent,
        sent_by: body.userId,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating reply:", error)
      return NextResponse.json({ error: "Failed to create reply" }, { status: 500 })
    }

    // Mark message as replied
    await supabase.from("contact_messages").update({ is_replied: true }).eq("id", messageId)

    // Send email to the contact
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
        to: message.email,
        subject: "Response to Your Inquiry",
        text: `
          Dear ${message.fullname},

          Thank you for contacting us. Here is our response to your inquiry:

          ${body.replyContent}

          Best regards,
          School Management System
        `,
        html: `
          <h2>Response to Your Inquiry</h2>
          <p>Dear ${message.fullname},</p>
          <p>Thank you for contacting us. Here is our response to your inquiry:</p>
          <div style="padding: 15px; border-left: 4px solid #0070f3; margin: 20px 0;">
            ${body.replyContent.replace(/\n/g, "<br>")}
          </div>
          <p>Best regards,<br>School Management System</p>
        `,
      })
    } catch (emailError) {
      console.error("Error sending email reply:", emailError)
      // Continue even if email fails
    }

    return NextResponse.json({ reply })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error replying to contact message:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
