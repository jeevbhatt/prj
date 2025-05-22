"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for attendance
const mockAttendance = [
  { id: 1, student: "John Doe", grade: "10th", date: "2024-05-15", status: "Present", time: "08:05 AM" },
  { id: 2, student: "Jane Smith", grade: "9th", date: "2024-05-15", status: "Present", time: "07:55 AM" },
  { id: 3, student: "Michael Johnson", grade: "11th", date: "2024-05-15", status: "Absent", time: "-" },
  { id: 4, student: "Emily Williams", grade: "8th", date: "2024-05-15", status: "Late", time: "08:30 AM" },
  { id: 5, student: "David Brown", grade: "12th", date: "2024-05-15", status: "Present", time: "08:00 AM" },
]

export function AdminAttendanceContent() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : mockAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  mockAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.id}</TableCell>
                      <TableCell>{record.student}</TableCell>
                      <TableCell>{record.grade}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === "Present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "Absent"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell>{record.time}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-gray-500 italic">
        <p>
          This is a simplified view. In a complete implementation, you would have options to take attendance and
          generate reports.
        </p>
      </div>
    </div>
  )
}
