"use client"

import { useState } from "react"
import { Search, Download, FileText, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

type ExamResult = {
  id: number
  studentName: string
  studentId: string
  grade: string
  subject: string
  marks: number
  totalMarks: number
  percentage: number
  term: string
  examDate: string
  status: "pass" | "fail" | "excellent"
}

// Mock data for exam results
const examResults: ExamResult[] = [
  {
    id: 1,
    studentName: "John Doe",
    studentId: "S001",
    grade: "10th",
    subject: "Mathematics",
    marks: 85,
    totalMarks: 100,
    percentage: 85,
    term: "First Term",
    examDate: "2024-09-15",
    status: "excellent",
  },
  {
    id: 2,
    studentName: "John Doe",
    studentId: "S001",
    grade: "10th",
    subject: "Science",
    marks: 78,
    totalMarks: 100,
    percentage: 78,
    term: "First Term",
    examDate: "2024-09-16",
    status: "pass",
  },
  {
    id: 3,
    studentName: "John Doe",
    studentId: "S001",
    grade: "10th",
    subject: "English",
    marks: 82,
    totalMarks: 100,
    percentage: 82,
    term: "First Term",
    examDate: "2024-09-17",
    status: "excellent",
  },
  {
    id: 4,
    studentName: "John Doe",
    studentId: "S001",
    grade: "10th",
    subject: "History",
    marks: 75,
    totalMarks: 100,
    percentage: 75,
    term: "First Term",
    examDate: "2024-09-18",
    status: "pass",
  },
  {
    id: 5,
    studentName: "Jane Smith",
    studentId: "S002",
    grade: "9th",
    subject: "Mathematics",
    marks: 92,
    totalMarks: 100,
    percentage: 92,
    term: "First Term",
    examDate: "2024-09-15",
    status: "excellent",
  },
  {
    id: 6,
    studentName: "Jane Smith",
    studentId: "S002",
    grade: "9th",
    subject: "Science",
    marks: 88,
    totalMarks: 100,
    percentage: 88,
    term: "First Term",
    examDate: "2024-09-16",
    status: "excellent",
  },
  {
    id: 7,
    studentName: "Jane Smith",
    studentId: "S002",
    grade: "9th",
    subject: "English",
    marks: 45,
    totalMarks: 100,
    percentage: 45,
    term: "First Term",
    examDate: "2024-09-17",
    status: "fail",
  },
  {
    id: 8,
    studentName: "Jane Smith",
    studentId: "S002",
    grade: "9th",
    subject: "History",
    marks: 79,
    totalMarks: 100,
    percentage: 79,
    term: "First Term",
    examDate: "2024-09-18",
    status: "pass",
  },
]

export function ExamResults() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTerm, setSelectedTerm] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<string>("all")

  // Get unique terms, subjects, and students
  const terms = [...new Set(examResults.map((result) => result.term))]
  const subjects = [...new Set(examResults.map((result) => result.subject))]
  const students = [...new Set(examResults.map((result) => result.studentId))]

  // Filter results based on search query, term, subject, and student
  const filteredResults = examResults.filter((result) => {
    const matchesSearch =
      result.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.studentId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTerm = selectedTerm === "all" || result.term === selectedTerm
    const matchesSubject = selectedSubject === "all" || result.subject === selectedSubject
    const matchesStudent = selectedStudent === "all" || result.studentId === selectedStudent

    return matchesSearch && matchesTerm && matchesSubject && matchesStudent
  })

  // Group results by student for summary view
  const resultsByStudent = filteredResults.reduce(
    (acc, result) => {
      if (!acc[result.studentId]) {
        acc[result.studentId] = {
          studentName: result.studentName,
          studentId: result.studentId,
          grade: result.grade,
          results: [],
          totalMarks: 0,
          totalOutOf: 0,
        }
      }

      acc[result.studentId].results.push(result)
      acc[result.studentId].totalMarks += result.marks
      acc[result.studentId].totalOutOf += result.totalMarks

      return acc
    },
    {} as Record<
      string,
      {
        studentName: string
        studentId: string
        grade: string
        results: ExamResult[]
        totalMarks: number
        totalOutOf: number
      }
    >,
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 dark:text-green-400"
      case "pass":
        return "text-blue-600 dark:text-blue-400"
      case "fail":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 60) return "bg-blue-500"
    if (percentage >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  const handleDownloadResults = () => {
    // In a real application, this would generate and download a PDF report
    alert("Results download functionality would be implemented here.")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Terms</SelectItem>
              {terms.map((term) => (
                <SelectItem key={term} value={term}>
                  {term}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              {students.map((studentId) => {
                const student = examResults.find((r) => r.studentId === studentId)
                return (
                  <SelectItem key={studentId} value={studentId}>
                    {student?.studentName} ({studentId})
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(resultsByStudent).map((student) => (
          <Card key={student.studentId} className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{student.studentName}</span>
                <span className="text-sm text-muted-foreground">{student.studentId}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Grade: {student.grade}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Overall Performance</span>
                    <span className="text-sm font-medium">
                      {Math.round((student.totalMarks / student.totalOutOf) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(student.totalMarks / student.totalOutOf) * 100}
                    className={getProgressColor(Math.round((student.totalMarks / student.totalOutOf) * 100))}
                  />
                </div>

                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-2 font-medium">Subject</th>
                        <th className="text-right p-2 font-medium">Marks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {student.results.map((result) => (
                        <tr key={result.id}>
                          <td className="p-2">{result.subject}</td>
                          <td className="p-2 text-right">
                            <span className={getStatusColor(result.status)}>
                              {result.marks}/{result.totalMarks}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button onClick={handleDownloadResults} variant="outline" className="w-full flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Results Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden md:table-cell">Term</TableHead>
              <TableHead className="text-right">Marks</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{result.studentName}</p>
                      <p className="text-xs text-muted-foreground">{result.studentId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{result.subject}</TableCell>
                  <TableCell className="hidden md:table-cell">{result.term}</TableCell>
                  <TableCell className="text-right">
                    {result.marks}/{result.totalMarks}
                  </TableCell>
                  <TableCell className="text-right">{result.percentage}%</TableCell>
                  <TableCell className={`hidden md:table-cell ${getStatusColor(result.status)}`}>
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleDownloadResults}>
                          <Download className="h-4 w-4 mr-2" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No results found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
