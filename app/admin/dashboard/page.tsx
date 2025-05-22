"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Menu,
  BarChart,
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  FileText,
  Mail,
  MessageSquare,
  Settings,
  LogOut,
  Sun,
  Moon,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { AdminDashboardContent } from "@/components/admin/dashboard-content"
import { AdminStudentsContent } from "@/components/admin/students-content"
import { AdminTeachersContent } from "@/components/admin/teachers-content"
import { AdminCoursesContent } from "@/components/admin/courses-content"
import { AdminGradesContent } from "@/components/admin/grades-content"
import { AdminAttendanceContent } from "@/components/admin/attendance-content"
import { AdminReportsContent } from "@/components/admin/reports-content"
import { AdminNoticesContent } from "@/components/admin/notices-content"
import { AdminContactContent } from "@/components/admin/contact-content"
import { AdminSettingsContent } from "@/components/admin/settings-content"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

type Section =
  | "dashboard"
  | "students"
  | "teachers"
  | "courses"
  | "grades"
  | "attendance"
  | "reports"
  | "notices"
  | "contact"
  | "settings"

type UserRole = "admin" | "teacher"

// Define role-based permissions
const rolePermissions = {
  admin: [
    "dashboard",
    "students",
    "teachers",
    "courses",
    "grades",
    "attendance",
    "reports",
    "notices",
    "contact",
    "settings",
  ],
  teacher: ["dashboard", "students", "grades", "attendance", "notices", "contact"],
}

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<Section>("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>("admin")
  const [userName, setUserName] = useState<string>("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // After mounting, we can safely show the theme toggle and check login status
  useEffect(() => {
    setMounted(true)

    // Check if user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const role = localStorage.getItem("userRole") as UserRole
    const name = localStorage.getItem("userName") || ""

    setIsLoggedIn(loggedIn)
    if (role) setUserRole(role)
    if (name) setUserName(name)

    if (!loggedIn) {
      router.push("/admin/login")
    }

    // Handle URL parameters for section navigation
    const searchParams = new URLSearchParams(window.location.search)
    const section = searchParams.get("section")
    if (section && isSectionAllowed(section as Section)) {
      setActiveSection(section as Section)
    }
  }, [router])

  // Add a new useEffect to update the URL when the active section changes
  useEffect(() => {
    if (mounted && activeSection) {
      // Update URL without triggering a page reload
      const url = new URL(window.location.href)
      url.searchParams.set("section", activeSection)
      window.history.pushState({}, "", url.toString())
    }
  }, [activeSection, mounted])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/admin/login")
  }

  // Fixed toggle function to ensure it works correctly and responsively
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    // Force a re-render to update UI immediately
    setTimeout(() => {
      document.body.classList.toggle("dark", theme !== "dark")
    }, 0)
  }

  // Check if the current section is allowed for the user's role
  const isSectionAllowed = (section: Section) => {
    return rolePermissions[userRole]?.includes(section) || false
  }

  // If trying to access a section that's not allowed, redirect to dashboard
  useEffect(() => {
    if (mounted && !isSectionAllowed(activeSection)) {
      setActiveSection("dashboard")
    }
  }, [activeSection, userRole, mounted])

  if (!mounted || !isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleSectionChange = (section: Section) => {
    if (isSectionAllowed(section)) {
      setActiveSection(section)
      const url = new URL(window.location.href)
      url.searchParams.set("section", section)
      window.history.pushState({}, "", url.toString())
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black text-white transition-all duration-300 ${
          sidebarCollapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Profile */}
          <div className="p-5 text-center border-b border-gray-700 bg-black/10">
            <div className="flex justify-center mb-3">
              <Image
                src="/images/admin-avatar.png"
                alt="User Avatar"
                width={90}
                height={90}
                className="rounded-full border-3 border-gray-600 transition-all duration-300 hover:border-primary hover:scale-105"
              />
            </div>
            {!sidebarCollapsed && (
              <>
                <h3 className="font-medium text-lg">Welcome, {userName}</h3>
                <p className="text-xs text-gray-400 mt-1 capitalize">{userRole} Account</p>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {/* Only show navigation items that the user has permission to access */}
              {isSectionAllowed("dashboard") && (
                <NavItem
                  icon={<BarChart size={20} />}
                  label="Dashboard"
                  active={activeSection === "dashboard"}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleSectionChange("dashboard")}
                  dataSectionAttr="dashboard"
                />
              )}

              {isSectionAllowed("students") && (
                <NavItem
                  icon={<Users size={20} />}
                  label="Students"
                  active={activeSection === "students"}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleSectionChange("students")}
                  dataSectionAttr="students"
                />
              )}

              {isSectionAllowed("teachers") && (
                <NavItem
                  icon={<Users size={20} />}
                  label="Teachers"
                  active={activeSection === "teachers"}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleSectionChange("teachers")}
                  dataSectionAttr="teachers"
                />
              )}

              {isSectionAllowed("courses") && (
                <NavItem
                  icon={<BookOpen size={20} />}
                  label="Courses"
                  active={activeSection === "courses"}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleSectionChange("courses")}
                  dataSectionAttr="courses"
                />
              )}

              {isSectionAllowed("grades") && (
                <NavItem
                  icon={<GraduationCap size={20} />}
                  label="Grades"
                  active={activeSection === "grades"}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleSectionChange("grades")}
                  dataSectionAttr="grades"
                />
              )}

              {isSectionAllowed("attendance") && (
                <NavItem
                  icon={<Calendar size={20} />}
                  label="Attendance"
                  active={activeSection === "attendance"}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleSectionChange("attendance")}
                  dataSectionAttr="attendance"
                />
              )}

              {isSectionAllowed("reports") && (
                <NavItem
                  icon={<FileText size={20} />}
                  label="Reports"
                  active={activeSection === "reports"}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleSectionChange("reports")}
                  dataSectionAttr="reports"
                />
              )}

              {isSectionAllowed("notices") && (
                <NavItem
                  icon={<Mail size={20} />}
                  label="Notices"
                  active={activeSection === "notices"}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleSectionChange("notices")}
                  dataSectionAttr="notices"
                />
              )}

              {isSectionAllowed("contact") && (
                <NavItem
                  icon={<MessageSquare size={20} />}
                  label="Contact Messages"
                  active={activeSection === "contact"}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleSectionChange("contact")}
                  dataSectionAttr="contact"
                />
              )}

              {isSectionAllowed("settings") && (
                <NavItem
                  icon={<Settings size={20} />}
                  label="Settings"
                  active={activeSection === "settings"}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleSectionChange("settings")}
                  dataSectionAttr="settings"
                />
              )}

              {mounted && (
                <NavItem
                  icon={theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                  label={theme === "dark" ? "Light Mode" : "Dark Mode"}
                  active={false}
                  collapsed={sidebarCollapsed}
                  onClick={toggleTheme}
                />
              )}

              <NavItem
                icon={<LogOut size={20} />}
                label="Logout"
                active={false}
                collapsed={sidebarCollapsed}
                onClick={handleLogout}
              />
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="mr-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <h1 className="text-xl font-semibold">
              {activeSection === "dashboard" && "Dashboard"}
              {activeSection === "students" && "Manage Students"}
              {activeSection === "teachers" && "Manage Teachers"}
              {activeSection === "courses" && "Manage Courses"}
              {activeSection === "grades" && "Manage Grades"}
              {activeSection === "attendance" && "Manage Attendance"}
              {activeSection === "reports" && "Reports"}
              {activeSection === "notices" && "Manage Notices"}
              {activeSection === "contact" && "Contact Messages"}
              {activeSection === "settings" && "Settings"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden md:inline-block capitalize">{userRole} Account</span>

            {/* Theme toggle in header for easy access */}
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">{theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {userRole === "teacher" && (
            <Alert className="mb-6 border-amber-500">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Teacher Account</AlertTitle>
              <AlertDescription>
                You are logged in as a teacher. Some administrative features are limited.
              </AlertDescription>
            </Alert>
          )}

          {/* Dashboard Quick Access Grid */}
          {activeSection === "dashboard" && (
            <div className="grid gap-6 mb-8">
              <h2 className="text-2xl font-semibold">Quick Access</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <DashboardCard
                  title="Students"
                  icon={<Users className="h-8 w-8 text-blue-500" />}
                  onClick={() => handleSectionChange("students")}
                  description="Manage student records, attendance, and information"
                />
                <DashboardCard
                  title="Courses"
                  icon={<BookOpen className="h-8 w-8 text-green-500" />}
                  onClick={() => handleSectionChange("courses")}
                  description="Organize and manage course offerings and schedules"
                />
                <DashboardCard
                  title="Grades"
                  icon={<GraduationCap className="h-8 w-8 text-purple-500" />}
                  onClick={() => handleSectionChange("grades")}
                  description="Record and track student academic performance"
                />
              </div>
            </div>
          )}

          {activeSection === "dashboard" && <AdminDashboardContent userRole={userRole} />}
          {activeSection === "students" && <AdminStudentsContent userRole={userRole} />}
          {activeSection === "teachers" && <AdminTeachersContent />}
          {activeSection === "courses" && <AdminCoursesContent />}
          {activeSection === "grades" && <AdminGradesContent userRole={userRole} />}
          {activeSection === "attendance" && <AdminAttendanceContent userRole={userRole} />}
          {activeSection === "reports" && <AdminReportsContent />}
          {activeSection === "notices" && <AdminNoticesContent userRole={userRole} />}
          {activeSection === "contact" && <AdminContactContent userRole={userRole} />}
          {activeSection === "settings" && <AdminSettingsContent />}
        </main>
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active: boolean
  collapsed: boolean
  onClick: () => void
  dataSectionAttr?: string
}

function NavItem({ icon, label, active, collapsed, onClick, dataSectionAttr }: NavItemProps) {
  return (
    <li>
      <button
        className={`flex items-center w-full p-3 rounded-md transition-all duration-200 ${
          active ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`}
        onClick={onClick}
        data-section={dataSectionAttr}
      >
        <span className="flex items-center justify-center">{icon}</span>
        {!collapsed && <span className="ml-3">{label}</span>}
      </button>
    </li>
  )
}

interface DashboardCardProps {
  title: string
  icon: React.ReactNode
  onClick: () => void
  description: string
}

function DashboardCard({ title, icon, onClick, description }: DashboardCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-muted rounded-full">{icon}</div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
