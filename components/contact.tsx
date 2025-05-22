"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { Send, Loader2 } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  fullname: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email address").max(50),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type FormValues = z.infer<typeof formSchema>

export function Contact() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      message: "",
    },
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("contact")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      // In a real app, you would send this data to your API
      console.log("Form data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      })

      setIsSuccess(true)
      form.reset()

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      className={`py-16 px-4 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Contact Us</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          If you have any questions or need assistance, please reach out to us using the form below. Our team is here to
          help and will respond to your inquiry as soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-xl font-medium mb-2">Message Sent Successfully!</h4>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <Button variant="outline" onClick={() => setIsSuccess(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Write your message here..." className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Address</h4>
                <p className="text-muted-foreground">
                  123 Education Street
                  <br />
                  Learning City, ED 12345
                  <br />
                  United States
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Phone</h4>
                <p className="text-muted-foreground">
                  Main Office: (555) 123-4567
                  <br />
                  Admissions: (555) 123-4568
                  <br />
                  Student Services: (555) 123-4569
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Email</h4>
                <p className="text-muted-foreground">
                  General Inquiries: info@schoolname.edu
                  <br />
                  Admissions: admissions@schoolname.edu
                  <br />
                  Support: support@schoolname.edu
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Office Hours</h4>
                <p className="text-muted-foreground">
                  Monday - Friday: 8:00 AM - 4:30 PM
                  <br />
                  Saturday: 9:00 AM - 12:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
