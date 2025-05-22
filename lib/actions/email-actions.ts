"use server"

import { z } from "zod"
import { db } from "@/lib/db"
import { contactMessages, messageReplies } from "@/lib/db/schema"

const replySchema = z.object({
  messageId: z.number(),
  replyContent: z.string().min(1, "Reply content cannot be empty"),
  recipientEmail: z.string().email("Invalid email address"),
  recipientName: z.string(),
  sentBy: z.number(),
})

export async function sendEmailReply(formData: FormData) {
  try {
    const messageId = Number.parseInt(formData.get("messageId") as string)
    const replyContent = formData.get("replyContent") as string
    const recipientEmail = formData.get("recipientEmail") as string
    const recipientName = formData.get("recipientName") as string
    const sentBy = Number.parseInt(formData.get("sentBy") as string)

    // Validate the data
    const validatedData = replySchema.parse({
      messageId,
      replyContent,
      recipientEmail,
      recipientName,
      sentBy,
    })

    // In a real application, you would use an email service like SendGrid, Mailgun, etc.
    // For this example, we'll just simulate sending an email
    console.log("Sending email to:", recipientEmail)
    console.log("Email content:", replyContent)

    // Add a delay to simulate sending the email
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update the message status in the database
    await db
      .update(contactMessages)
      .set({ isReplied: true })
      .where(({ id }) => id.equals(messageId))

    // Store the reply in the database
    await db.insert(messageReplies).values({
      messageId,
      replyContent,
      sentBy,
      sentAt: new Date(),
    })

    return { success: true, message: "Email sent successfully" }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Failed to send email" }
  }
}
