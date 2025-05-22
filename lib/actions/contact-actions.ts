"use server"

import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"
import nodemailer from "nodemailer"

const contactSchema = z.object({
  fullname: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactForm(formData: FormData) {
  const fullname = formData.get("fullname") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  try {
    const result = contactSchema.parse({ fullname, email, message })

    const supabase = createServerClient()

    // Create contact message
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        fullname: result.fullname,
        email: result.email,
        message: result.message,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating contact message:", error)
      return { error: "Failed to submit contact message" }
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
          Name: ${result.fullname}
          Email: ${result.email}
          Message: ${result.message}
        `,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${result.fullname}</p>
          <p><strong>Email:</strong> ${result.email}</p>
          <p><strong>Message:</strong> ${result.message}</p>
        `,
      })
    } catch (emailError) {
      console.error("Error sending email notification:", emailError)
      // Continue even if email fails
    }

    return { success: true, message: data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }

    console.error("Error submitting contact message:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function sendEmailReply(messageId: number, replyContent: string, userId: number) {
  try {
    const supabase = createServerClient()

    // Check if message exists and get recipient email
    const { data: message } = await supabase
      .from("contact_messages")
      .select("id, fullname, email")
      .eq("id", messageId)
      .single()

    if (!message) {
      return { error: "Contact message not found" }
    }

    // Create reply
    const { data: reply, error } = await supabase
      .from("message_replies")
      .insert({
        message_id: messageId,
        reply_content: replyContent,
        sent_by: userId,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating reply:", error)
      return { error: "Failed to create reply" }
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

          ${replyContent}

          Best regards,
          School Management System
        `,
        html: `
          <h2>Response to Your Inquiry</h2>
          <p>Dear ${message.fullname},</p>
          <p>Thank you for contacting us. Here is our response to your inquiry:</p>
          <div style="padding: 15px; border-left: 4px solid #0070f3; margin: 20px 0;">
            ${replyContent.replace(/\n/g, "<br>")}
          </div>
          <p>Best regards,<br>School Management System</p>
        `,
      })
    } catch (emailError) {
      console.error("Error sending email reply:", emailError)
      // Continue even if email fails
    }

    return { success: true, reply }
  } catch (error) {
    console.error("Error replying to contact message:", error)
    return { error: "An unexpected error occurred" }
  }
}
