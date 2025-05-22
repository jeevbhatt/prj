"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"

type Notice = {
  id: number
  title: string
  content: string
  created_at: string
}

// Mock data - in a real app, this would come from your API
const mockNotices: Notice[] = [
  {
    id: 1,
    title: "School Reopening After Summer Break",
    content:
      "We are pleased to announce that the school will reopen on August 15th after the summer break. All students are expected to arrive by 8:00 AM in proper uniform.",
    created_at: "2024-07-25T10:30:00Z",
  },
  {
    id: 2,
    title: "Annual Sports Day",
    content:
      "The annual sports day will be held on September 10th. Students interested in participating should register with their physical education teacher by August 30th.",
    created_at: "2024-07-28T14:15:00Z",
  },
  {
    id: 3,
    title: "Parent-Teacher Meeting",
    content:
      "A parent-teacher meeting is scheduled for September 5th from 10:00 AM to 2:00 PM. Parents are requested to attend to discuss their child's academic progress.",
    created_at: "2024-08-01T09:45:00Z",
  },
  {
    id: 4,
    title: "Science Exhibition",
    content:
      "The annual science exhibition will be held on September 20th. Students from grades 8-12 are encouraged to submit their project proposals by September 5th.",
    created_at: "2024-08-05T11:20:00Z",
  },
]

export function NoticesList() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch
    const fetchNotices = async () => {
      try {
        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 800))
        setNotices(mockNotices)
      } catch (error) {
        console.error("Error fetching notices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotices()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (notices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No notices available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {notices.map((notice) => (
        <div
          key={notice.id}
          className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
        >
          <h3 className="text-xl font-semibold mb-3 transition-colors duration-300 hover:text-primary">
            {notice.title}
          </h3>
          <p className="text-gray-700 leading-relaxed">{notice.content}</p>
          <p className="text-right text-gray-500 text-sm italic mt-4">
            {format(new Date(notice.created_at), "MMMM d, yyyy")}
          </p>
        </div>
      ))}
    </div>
  )
}
