import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

// List of public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/reset-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
  "/api/contact",
]

// Routes that require admin role
const adminRoutes = ["/admin/settings", "/api/users"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // For API routes, check the authorization header
  if (pathname.startsWith("/api/")) {
    const supabase = createServerClient()

    // Verify the session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if admin route
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      // Get user role
      const { data: user } = await supabase.from("users").select("role").eq("email", session.user.email).single()

      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    return NextResponse.next()
  }

  // For non-API routes, redirect to login if not authenticated
  const supabase = createServerClient()

  // Verify the session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session) {
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Check if admin route
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    // Get user role
    const { data: user } = await supabase.from("users").select("role").eq("email", session.user.email).single()

    if (!user || user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
