"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CalendarEvent = {
  id: number
  title: string
  date: string
  category: "exam" | "holiday" | "event" | "deadline"
  description: string
}

// Mock data for calendar events
const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "First Term Begins",
    date: "2024-08-15",
    category: "event",
    description: "First day of the academic year. All students must report by 8:00 AM.",
  },
  {
    id: 2,
    title: "Mid-Term Exams",
    date: "2024-09-25",
    category: "exam",
    description: "Mid-term examinations for all grades. Schedule will be posted one week prior.",
  },
  {
    id: 3,
    title: "National Holiday",
    date: "2024-10-02",
    category: "holiday",
    description: "School closed for National Day celebrations.",
  },
  {
    id: 4,
    title: "Project Submission Deadline",
    date: "2024-10-15",
    category: "deadline",
    description: "Last date to submit science and social studies projects.",
  },
  {
    id: 5,
    title: "Parent-Teacher Meeting",
    date: "2024-10-20",
    category: "event",
    description: "Mandatory meeting for parents to discuss student progress. Time: 10:00 AM - 2:00 PM",
  },
  {
    id: 6,
    title: "First Term Exams",
    date: "2024-11-15",
    category: "exam",
    description: "End of first term examinations. Detailed schedule will be provided two weeks in advance.",
  },
  {
    id: 7,
    title: "Winter Break",
    date: "2024-12-20",
    category: "holiday",
    description: "Winter break begins. School will reopen on January 5, 2025.",
  },
  {
    id: 8,
    title: "Second Term Begins",
    date: "2025-01-05",
    category: "event",
    description: "Second term begins. All students must report by 8:00 AM.",
  },
  {
    id: 9,
    title: "Annual Sports Day",
    date: "2025-02-10",
    category: "event",
    description: "Annual sports competition. Parents are invited to attend.",
  },
  {
    id: 10,
    title: "Second Term Exams",
    date: "2025-03-15",
    category: "exam",
    description: "End of second term examinations.",
  },
]

export function AcademicCalendar() {
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Get unique months from events
  const months = [
    ...new Set(
      calendarEvents.map((event) => {
        const date = new Date(event.date)
        return date.toLocaleString("default", { month: "long" })
      }),
    ),
  ].sort((a, b) => {
    const monthOrder = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return monthOrder.indexOf(a) - monthOrder.indexOf(b)
  })

  // Filter events based on selected month and category
  const filteredEvents = calendarEvents
    .filter((event) => {
      const eventDate = new Date(event.date)
      const eventMonth = eventDate.toLocaleString("default", { month: "long" })

      const monthMatch = selectedMonth === "all" || eventMonth === selectedMonth
      const categoryMatch = selectedCategory === "all" || event.category === selectedCategory

      return monthMatch && categoryMatch
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "exam":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "holiday":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "event":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "deadline":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const handleDownloadCalendar = () => {
    // In a real application, this would generate and download a PDF or iCal file
    alert("Calendar download functionality would be implemented here.")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="exam">Exams</SelectItem>
              <SelectItem value="holiday">Holidays</SelectItem>
              <SelectItem value="event">Events</SelectItem>
              <SelectItem value="deadline">Deadlines</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleDownloadCalendar} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Download Calendar</span>
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </div>
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm">{event.description}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-muted-foreground">No events found for the selected filters.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border">
        <div className="flex gap-2">
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Exam</Badge>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Holiday</Badge>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Event</Badge>
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Deadline</Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
