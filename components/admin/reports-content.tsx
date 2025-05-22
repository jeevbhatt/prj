"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Search,
  BarChart3,
  GraduationCap,
  Users,
  CheckCircle2,
} from "lucide-react"

export function AdminReportsContent() {
  const { toast } = useToast()
  const [selectedReportType, setSelectedReportType] = useState("attendance")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("this-month")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setReportGenerated(false)

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      setReportGenerated(true)

      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
      })
    }, 1500)
  }

  const handleExportReport = () => {
    if (!reportGenerated) {
      toast({
        title: "No Report to Export",
        description: "Please generate a report first.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    // Simulate export
    setTimeout(() => {
      setIsExporting(false)

      toast({
        title: "Report Exported",
        description: "Your report has been exported as a CSV file.",
      })
    }, 1000)
  }

  const handlePrintReport = () => {
    if (!reportGenerated) {
      toast({
        title: "No Report to Print",
        description: "Please generate a report first.",
        variant: "destructive",
      })
      return
    }

    setIsPrinting(true)

    // Simulate printing
    setTimeout(() => {
      setIsPrinting(false)

      toast({
        title: "Report Sent to Printer",
        description: "Your report has been sent to the printer.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Generate, export, and print reports based on your school data.</p>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Parameters</CardTitle>
              <CardDescription>Configure the parameters for your report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendance">Student Attendance</SelectItem>
                      <SelectItem value="academic">Academic Performance</SelectItem>
                      <SelectItem value="exam">Exam Results</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class/Grade</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="grade-8">Grade 8</SelectItem>
                      <SelectItem value="grade-9">Grade 9</SelectItem>
                      <SelectItem value="grade-10">Grade 10</SelectItem>
                      <SelectItem value="grade-11">Grade 11</SelectItem>
                      <SelectItem value="grade-12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                    <SelectTrigger id="date-range">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="this-term">This Term</SelectItem>
                      <SelectItem value="this-year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedReportType === "attendance" && (
                <div className="space-y-2">
                  <Label>Additional Options</Label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="include-absent" className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor="include-absent" className="text-sm font-normal">
                        Include absent students only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="include-late" className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor="include-late" className="text-sm font-normal">
                        Include late arrivals
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {selectedReportType === "academic" && (
                <div className="space-y-2">
                  <Label>Additional Options</Label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="include-failing" className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor="include-failing" className="text-sm font-normal">
                        Include failing grades only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="include-improvement" className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor="include-improvement" className="text-sm font-normal">
                        Show improvement over time
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {selectedReportType === "exam" && (
                <div className="space-y-2">
                  <Label>Additional Options</Label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="include-top" className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor="include-top" className="text-sm font-normal">
                        Highlight top performers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="include-subjects" className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor="include-subjects" className="text-sm font-normal">
                        Break down by subjects
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
              <Button onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleExportReport} disabled={isExporting || !reportGenerated}>
                  {isExporting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handlePrintReport} disabled={isPrinting || !reportGenerated}>
                  {isPrinting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Printing...
                    </>
                  ) : (
                    <>
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>

          {reportGenerated && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {selectedReportType === "attendance" && "Student Attendance Report"}
                  {selectedReportType === "academic" && "Academic Performance Report"}
                  {selectedReportType === "exam" && "Exam Results Report"}
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  {selectedDateRange === "today" && "Today"}
                  {selectedDateRange === "this-week" && "This Week"}
                  {selectedDateRange === "this-month" && "This Month"}
                  {selectedDateRange === "this-term" && "This Term"}
                  {selectedDateRange === "this-year" && "This Year"}
                </div>
              </CardHeader>
              <CardContent>
                {selectedReportType === "attendance" && <AttendanceReportTable selectedClass={selectedClass} />}
                {selectedReportType === "academic" && <AcademicReportTable selectedClass={selectedClass} />}
                {selectedReportType === "exam" && <ExamReportTable selectedClass={selectedClass} />}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>Access your previously generated reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search reports..." className="pl-8" />
              </div>

              <div className="mt-4 space-y-4">
                <SavedReportItem
                  title="Monthly Attendance Report"
                  type="attendance"
                  date="May 1, 2024"
                  description="Attendance report for all classes for May 2024"
                />
                <SavedReportItem
                  title="Term 1 Academic Performance"
                  type="academic"
                  date="April 15, 2024"
                  description="Academic performance report for Term 1, 2024"
                />
                <SavedReportItem
                  title="Mid-Term Exam Results"
                  type="exam"
                  date="March 20, 2024"
                  description="Mid-term examination results for all grades"
                />
                <SavedReportItem
                  title="Weekly Attendance Summary"
                  type="attendance"
                  date="March 7, 2024"
                  description="Weekly attendance summary for March 1-7, 2024"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AttendanceReportTable({ selectedClass }: { selectedClass: string }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Present</TableHead>
            <TableHead>Absent</TableHead>
            <TableHead>Late</TableHead>
            <TableHead>Attendance Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { id: 1, name: "John Doe", grade: "10th", present: 18, absent: 1, late: 1 },
            { id: 2, name: "Jane Smith", grade: "10th", present: 20, absent: 0, late: 0 },
            { id: 3, name: "Michael Johnson", grade: "10th", present: 17, absent: 2, late: 1 },
            { id: 4, name: "Emily Williams", grade: "10th", present: 19, absent: 1, late: 0 },
            { id: 5, name: "David Brown", grade: "10th", present: 16, absent: 3, late: 1 },
          ].map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.grade}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                  {student.present}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center">
                  {/* XCircle icon */}
                  {student.absent}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center">
                  {/* Clock icon */}
                  {student.late}
                </div>
              </TableCell>
              <TableCell>
                {Math.round((student.present / (student.present + student.absent + student.late)) * 100)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function AcademicReportTable({ selectedClass }: { selectedClass: string }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Mathematics</TableHead>
            <TableHead>Science</TableHead>
            <TableHead>English</TableHead>
            <TableHead>History</TableHead>
            <TableHead>Average</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { id: 1, name: "John Doe", grade: "10th", math: 85, science: 92, english: 78, history: 88 },
            { id: 2, name: "Jane Smith", grade: "10th", math: 95, science: 90, english: 92, history: 94 },
            { id: 3, name: "Michael Johnson", grade: "10th", math: 75, science: 82, english: 88, history: 79 },
            { id: 4, name: "Emily Williams", grade: "10th", math: 90, science: 85, english: 94, history: 91 },
            { id: 5, name: "David Brown", grade: "10th", math: 82, science: 78, english: 85, history: 80 },
          ].map((student) => {
            const average = Math.round((student.math + student.science + student.english + student.history) / 4)
            return (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{student.math}%</TableCell>
                <TableCell>{student.science}%</TableCell>
                <TableCell>{student.english}%</TableCell>
                <TableCell>{student.history}%</TableCell>
                <TableCell className="font-medium">{average}%</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function ExamReportTable({ selectedClass }: { selectedClass: string }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Class Average</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            {
              id: 1,
              name: "John Doe",
              grade: "10th",
              subject: "Mathematics",
              score: 85,
              letterGrade: "B",
              classAvg: 82,
            },
            {
              id: 2,
              name: "Jane Smith",
              grade: "10th",
              subject: "Mathematics",
              score: 95,
              letterGrade: "A",
              classAvg: 82,
            },
            {
              id: 3,
              name: "Michael Johnson",
              grade: "10th",
              subject: "Mathematics",
              score: 75,
              letterGrade: "C",
              classAvg: 82,
            },
            {
              id: 4,
              name: "Emily Williams",
              grade: "10th",
              subject: "Mathematics",
              score: 90,
              letterGrade: "A-",
              classAvg: 82,
            },
            {
              id: 5,
              name: "David Brown",
              grade: "10th",
              subject: "Mathematics",
              score: 65,
              letterGrade: "D",
              classAvg: 82,
            },
          ].map((result) => (
            <TableRow key={result.id}>
              <TableCell>{result.name}</TableCell>
              <TableCell>{result.grade}</TableCell>
              <TableCell>{result.subject}</TableCell>
              <TableCell>{result.score}%</TableCell>
              <TableCell>{result.letterGrade}</TableCell>
              <TableCell>{result.classAvg}%</TableCell>
              <TableCell>
                {result.score >= result.classAvg ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Above Average
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                    Below Average
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function SavedReportItem({
  title,
  type,
  date,
  description,
}: {
  title: string
  type: "attendance" | "academic" | "exam"
  date: string
  description: string
}) {
  return (
    <div className="flex items-start space-x-4 rounded-lg border p-4">
      <div className="rounded-full bg-primary/10 p-2">
        {type === "attendance" && <Users className="h-5 w-5 text-primary" />}
        {type === "academic" && <GraduationCap className="h-5 w-5 text-primary" />}
        {type === "exam" && <BarChart3 className="h-5 w-5 text-primary" />}
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">Generated on {date}</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <FileText className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
          <span className="sr-only">Download</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Printer className="h-4 w-4" />
          <span className="sr-only">Print</span>
        </Button>
      </div>
    </div>
  )
}
