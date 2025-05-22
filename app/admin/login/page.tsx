"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type FormValues = z.infer<typeof formSchema>

// Define user roles and credentials
const userCredentials = {
  admin: { username: "admin", password: "admin", role: "admin" },
  teacher: { username: "teacher", password: "teacher", role: "teacher" },
}

export default function AdminLogin() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("admin")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)

    try {
      // Determine which role the user is trying to log in as
      const roleToCheck = activeTab === "admin" ? "admin" : "teacher"
      const validCredentials = userCredentials[roleToCheck as keyof typeof userCredentials]

      // Check if credentials match
      if (data.username === validCredentials.username && data.password === validCredentials.password) {
        // Store user info in localStorage
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userRole", validCredentials.role)
        localStorage.setItem("userName", validCredentials.username)

        toast({
          title: "Login successful",
          description: `Welcome, ${validCredentials.role}!`,
        })

        // Redirect to dashboard
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image src="/images/sms.png" alt="SMS Logo" width={80} height={80} className="animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">School Management System</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Enter your credentials to access the system</p>
          </div>

          <Tabs defaultValue="admin" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
            </TabsList>
          </Tabs>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter ${activeTab} username`}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          // Auto-fill password with the same value as username for demo
                          if (activeTab === "admin" && e.target.value === "admin") {
                            form.setValue("password", "admin")
                          } else if (activeTab === "teacher" && e.target.value === "teacher") {
                            form.setValue("password", "teacher")
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">

            <Link href="/" className="text-primary hover:underline mt-2 inline-block">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
