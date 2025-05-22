"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  Bell,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react"

export function AdminDashboardContent({ userRole = "admin" }: { userRole?: string }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("this-week")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your school system.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {userRole === "admin" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>You are logged in as Administrator</AlertTitle>
          <AlertDescription>
            You have full access to all features and settings of the school management system.
          </AlertDescription>
        </Alert>
      )}

      {userRole === "teacher" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>You are logged in as Teacher</AlertTitle>
          <AlertDescription>You have access to attendance, grades, and student information.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Students"
          value="1,284"
          description="Total enrolled students"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          linkText="Manage Students"
          linkHref="/admin/dashboard?tab=students"
        />
        <DashboardCard
          title="Courses"
          value="42"
          description="Active courses"
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          linkText="View Courses"
          linkHref="/admin/dashboard?tab=courses"
        />
        <DashboardCard
          title="Grades"
          value="3,721"
          description="Grade records"
          icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
          linkText="Manage Grades"
          linkHref="/admin/dashboard?tab=grades"
        />
        <DashboardCard
          title="Attendance"
          value="98.2%"
          description="Average attendance rate"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          linkText="View Attendance"
          linkHref="/admin/dashboard?tab=attendance"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Notices</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <NoticeItem title="End of Term Exams" date="May 25, 2024" status="upcoming" />
                  <NoticeItem title="Parent-Teacher Meeting" date="May 18, 2024" status="upcoming" />
                  <NoticeItem title="Sports Day" date="May 10, 2024" status="completed" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <a href="/admin/dashboard?section=notices">
                    View All Notices
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Overview</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">Grade 10</div>
                    <div className="font-medium">96%</div>
                  </div>
                  <Progress value={96} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">Grade 9</div>
                    <div className="font-medium">94%</div>
                  </div>
                  <Progress value={94} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">Grade 8</div>
                    <div className="font-medium">98%</div>
                  </div>
                  <Progress value={98} />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <a href="/admin/dashboard?section=attendance">
                    View Detailed Attendance
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Distribution</CardTitle>
              <CardDescription>Overview of students by grade level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Grade 12", "Grade 11", "Grade 10", "Grade 9", "Grade 8"].map((grade) => (
                  <div key={grade} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">{grade}</div>
                      <div className="text-muted-foreground">{Math.floor(Math.random() * 100 + 100)} students</div>
                    </div>
                    <Progress value={Math.floor(Math.random() * 40 + 60)} />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/dashboard?section=students">
                  View All Student Data
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>Weekly attendance patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  <div className="text-center">
                    <div className="text-sm font-medium">Mon</div>
                    <div className="mt-1 rounded-full bg-green-100 p-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                    </div>
                    <div className="mt-1 text-xs">97%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Tue</div>
                    <div className="mt-1 rounded-full bg-green-100 p-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                    </div>
                    <div className="mt-1 text-xs">98%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Wed</div>
                    <div className="mt-1 rounded-full bg-green-100 p-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                    </div>
                    <div className="mt-1 text-xs">96%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Thu</div>
                    <div className="mt-1 rounded-full bg-amber-100 p-2">
                      <Clock className="h-4 w-4 text-amber-600 mx-auto" />
                    </div>
                    <div className="mt-1 text-xs">94%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Fri</div>
                    <div className="mt-1 rounded-full bg-green-100 p-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                    </div>
                    <div className="mt-1 text-xs">95%</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/dashboard?section=attendance">
                  View Detailed Attendance
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Grade distribution across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Mathematics", "Science", "English", "History", "Computer Science"].map((subject) => (
                  <div key={subject} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">{subject}</div>
                      <div className="text-muted-foreground">Avg: {Math.floor(Math.random() * 15 + 75)}%</div>
                    </div>
                    <Progress value={Math.floor(Math.random() * 20 + 75)} />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/dashboard?section=grades">
                  View All Performance Data
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DashboardCard({
  title,
  value,
  description,
  icon,
  linkText,
  linkHref,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  linkText: string
  linkHref: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <a href={`/admin/dashboard?section=${title.toLowerCase()}`}>
            {linkText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function NoticeItem({
  title,
  date,
  status,
}: {
  title: string
  date: string
  status: "upcoming" | "completed"
}) {
  return (
    <div className="flex items-center">
      <div className={`rounded-full p-1 mr-3 ${status === "upcoming" ? "bg-blue-100" : "bg-gray-100"}`}>
        {status === "upcoming" ? (
          <Bell className="h-3 w-3 text-blue-500" />
        ) : (
          <CheckCircle2 className="h-3 w-3 text-gray-500" />
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  )
}
