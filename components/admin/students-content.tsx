"use client"

import { useState, useEffect } from "react"
import { Search, Plus, FileText, Trash2, Download, Upload, Filter, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

// Mock data for students
const mockStudents = [
  {
    id: 1,
    name: "John Doe",
    rollNo: "S001",
    grade: "10th",
    section: "A",
    gender: "Male",
    phone: "123-456-7890",
    email: "john@example.com",
    address: "123 Main St",
  },
  {
    id: 2,
    name: "Jane Smith",
    rollNo: "S002",
    grade: "9th",
    section: "B",
    gender: "Female",
    phone: "234-567-8901",
    email: "jane@example.com",
    address: "456 Oak Ave",
  },
  {
    id: 3,
    name: "Michael Johnson",
    rollNo: "S003",
    grade: "11th",
    section: "A",
    gender: "Male",
    phone: "345-678-9012",
    email: "michael@example.com",
    address: "789 Pine Rd",
  },
  {
    id: 4,
    name: "Emily Williams",
    rollNo: "S004",
    grade: "8th",
    section: "C",
    gender: "Female",
    phone: "456-789-0123",
    email: "emily@example.com",
    address: "101 Elm St",
  },
  {
    id: 5,
    name: "David Brown",
    rollNo: "S005",
    grade: "12th",
    section: "B",
    gender: "Male",
    phone: "567-890-1234",
    email: "david@example.com",
    address: "202 Maple Dr",
  },
  {
    id: 6,
    name: "Sarah Miller",
    rollNo: "S006",
    grade: "10th",
    section: "C",
    gender: "Female",
    phone: "678-901-2345",
    email: "sarah@example.com",
    address: "303 Cedar Ln",
  },
  {
    id: 7,
    name: "James Wilson",
    rollNo: "S007",
    grade: "9th",
    section: "A",
    gender: "Male",
    phone: "789-012-3456",
    email: "james@example.com",
    address: "404 Birch Blvd",
  },
  {
    id: 8,
    name: "Emma Taylor",
    rollNo: "S008",
    grade: "11th",
    section: "B",
    gender: "Female",
    phone: "890-123-4567",
    email: "emma@example.com",
    address: "505 Walnut Way",
  },
  {
    id: 9,
    name: "Daniel Anderson",
    rollNo: "S009",
    grade: "8th",
    section: "A",
    gender: "Male",
    phone: "901-234-5678",
    email: "daniel@example.com",
    address: "606 Spruce St",
  },
  {
    id: 10,
    name: "Olivia Martinez",
    rollNo: "S010",
    grade: "12th",
    section: "C",
    gender: "Female",
    phone: "012-345-6789",
    email: "olivia@example.com",
    address: "707 Fir Ave",
  },
]

// Mock data for attendance
const initialAttendanceData = [
  {
    id: 1,
    studentId: 1,
    date: "2024-05-15",
    status: "present",
  },
  {
    id: 2,
    studentId: 2,
    date: "2024-05-15",
    status: "present",
  },
  {
    id: 3,
    studentId: 3,
    date: "2024-05-15",
    status: "absent",
  },
  {
    id: 4,
    studentId: 4,
    date: "2024-05-15",
    status: "present",
  },
  {
    id: 5,
    studentId: 5,
    date: "2024-05-15",
    status: "late",
  },
]

// Expanded grade levels
const gradeOptions = [
  "Nursery",
  "Pre-K",
  "Kindergarten",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
]

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  rollNo: z.string().min(1, "Roll number is required"),
  grade: z.string().min(1, "Grade is required"),
  section: z.string().min(1, "Section is required"),
  gender: z.string().min(1, "Gender is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(1, "Address is required"),
})

type FormValues = z.infer<typeof formSchema>

type AttendanceRecord = {
  id: number
  studentId: number
  date: string
  status: "present" | "absent" | "late"
}

interface AdminStudentsContentProps {
  userRole?: string
}

export function AdminStudentsContent({ userRole = "admin" }: AdminStudentsContentProps) {
  const { toast } = useToast()
  const [students, setStudents] = useState<typeof mockStudents>([])
  const [filteredStudents, setFilteredStudents] = useState<typeof mockStudents>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkImportDialogOpen, setIsBulkImportDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<(typeof mockStudents)[0] | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("list")
  const [attendanceDate, setAttendanceDate] = useState<Date>(new Date())
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rollNo: "",
      grade: "",
      section: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
    },
  })

  useEffect(() => {
    // Simulate API fetch
    const fetchStudents = async () => {
      try {
        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 800))
        setStudents(mockStudents)
        setFilteredStudents(mockStudents)
        setAttendanceRecords(initialAttendanceData)
      } catch (error) {
        console.error("Error fetching students:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])

  useEffect(() => {
    let result = students

    // Apply grade filter
    if (activeFilter !== "all") {
      result = result.filter((student) => student.grade === activeFilter)
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.rollNo.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query),
      )
    }

    setFilteredStudents(result)
  }, [searchQuery, students, activeFilter])

  const handleAddStudent = (data: FormValues) => {
    const newStudent = {
      id: students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1,
      ...data,
    }

    setStudents([...students, newStudent])
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Student added",
      description: `${data.name} has been added successfully`,
    })
  }

  const handleEditStudent = (data: FormValues) => {
    if (!selectedStudent) return

    const updatedStudents = students.map((student) =>
      student.id === selectedStudent.id ? { ...student, ...data } : student,
    )

    setStudents(updatedStudents)
    setIsEditDialogOpen(false)

    toast({
      title: "Student updated",
      description: `${data.name} has been updated successfully`,
    })
  }

  const handleDeleteStudent = () => {
    if (!selectedStudent) return

    const updatedStudents = students.filter((student) => student.id !== selectedStudent.id)
    setStudents(updatedStudents)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Student deleted",
      description: `${selectedStudent.name} has been deleted successfully`,
    })
  }

  const handleBulkImport = () => {
    // In a real app, this would process the uploaded file
    setIsBulkImportDialogOpen(false)

    toast({
      title: "Bulk import started",
      description: "Your file is being processed. This may take a few moments.",
    })

    // Simulate processing delay
    setTimeout(() => {
      toast({
        title: "Bulk import completed",
        description: "5 new students have been added successfully",
      })
    }, 2000)
  }

  const exportStudents = () => {
    // In a real app, this would generate a CSV file
    toast({
      title: "Export started",
      description: "Your student data is being prepared for download",
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export completed",
        description: "Student data has been exported successfully",
      })
    }, 1000)
  }

  const openEditDialog = (student: typeof selectedStudent) => {
    setSelectedStudent(student)
    if (student) {
      form.reset(student)
      setIsEditDialogOpen(true)
    }
  }

  const openDeleteDialog = (student: typeof selectedStudent) => {
    setSelectedStudent(student)
    setIsDeleteDialogOpen(true)
  }

  const openAttendanceDialog = () => {
    setIsAttendanceDialogOpen(true)
  }

  const handleAttendanceChange = (studentId: number, status: "present" | "absent" | "late") => {
    const dateString = format(attendanceDate, "yyyy-MM-dd")

    // Check if there's an existing record for this student on this date
    const existingRecordIndex = attendanceRecords.findIndex(
      (record) => record.studentId === studentId && record.date === dateString,
    )

    if (existingRecordIndex >= 0) {
      // Update existing record
      const updatedRecords = [...attendanceRecords]
      updatedRecords[existingRecordIndex] = {
        ...updatedRecords[existingRecordIndex],
        status,
      }
      setAttendanceRecords(updatedRecords)
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        id: attendanceRecords.length > 0 ? Math.max(...attendanceRecords.map((r) => r.id)) + 1 : 1,
        studentId,
        date: dateString,
        status,
      }
      setAttendanceRecords([...attendanceRecords, newRecord])
    }
  }

  const getAttendanceStatus = (studentId: number): "present" | "absent" | "late" | null => {
    const dateString = format(attendanceDate, "yyyy-MM-dd")
    const record = attendanceRecords.find((record) => record.studentId === studentId && record.date === dateString)
    return record ? record.status : null
  }

  const getAttendanceStatusBadge = (status: "present" | "absent" | "late" | null) => {
    switch (status) {
      case "present":
        return <Badge variant="success">Present</Badge>
      case "absent":
        return <Badge variant="destructive">Absent</Badge>
      case "late":
        return <Badge variant="warning">Late</Badge>
      default:
        return <Badge variant="outline">Not Marked</Badge>
    }
  }

  // Check if user has permission to edit
  const canEdit = userRole === "admin"

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <TabsList>
            <TabsTrigger value="list">Student List</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2">
            {canEdit && (
              <>
                <Button variant="outline" onClick={() => setIsBulkImportDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" onClick={exportStudents}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={() => {
                    form.reset()
                    setIsAddDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </>
            )}
          </div>
        </div>

        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter: {activeFilter === "all" ? "All Grades" : activeFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Grade</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveFilter("all")}>All Grades</DropdownMenuItem>
                <DropdownMenuSeparator />
                {gradeOptions.map((grade) => (
                  <DropdownMenuItem key={grade} onClick={() => setActiveFilter(grade)}>
                    {grade} Grade
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.rollNo}</TableCell>
                          <TableCell>{student.grade}</TableCell>
                          <TableCell>{student.section}</TableCell>
                          <TableCell>{student.gender}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openEditDialog(student)}
                                disabled={!canEdit}
                              >
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => openDeleteDialog(student)}
                                disabled={!canEdit}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(attendanceDate, "MMMM d, yyyy")}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={attendanceDate}
                    onSelect={(date) => date && setAttendanceDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button onClick={openAttendanceDialog}>Take Attendance</Button>
            </div>

            <div className="flex gap-2">
              <Badge variant="success">Present</Badge>
              <Badge variant="destructive">Absent</Badge>
              <Badge variant="warning">Late</Badge>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.rollNo}</TableCell>
                          <TableCell>{student.grade}</TableCell>
                          <TableCell>{student.section}</TableCell>
                          <TableCell>{getAttendanceStatusBadge(getAttendanceStatus(student.id))}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`present-${student.id}`}
                                  checked={getAttendanceStatus(student.id) === "present"}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      handleAttendanceChange(student.id, "present")
                                    } else {
                                      handleAttendanceChange(student.id, "absent")
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`present-${student.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {getAttendanceStatus(student.id) === "present" ? "Present" : "Absent"}
                                </label>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Students" value={students.length.toString()} />
            <StatsCard
              title="Grade Distribution"
              value={`${students.filter((s) => s.grade === "10th").length} in 10th Grade`}
              description="Largest grade"
            />
            <StatsCard
              title="Gender Ratio"
              value={`${Math.round((students.filter((s) => s.gender === "Male").length / students.length) * 100)}% Male`}
              description={`${Math.round((students.filter((s) => s.gender === "Female").length / students.length) * 100)}% Female`}
            />
            <StatsCard title="Sections" value="3 Active Sections" description="A, B, and C" />
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Student Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Enter the student details below to add a new student to the system.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddStudent)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rollNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="S001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {gradeOptions.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="123-456-7890" {...field} />
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
                        <Input placeholder="john@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Add Student</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update the student details below.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditStudent)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rollNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="S001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {gradeOptions.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="123-456-7890" {...field} />
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
                        <Input placeholder="john@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Update Student</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStudent?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={isBulkImportDialogOpen} onOpenChange={setIsBulkImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bulk Import Students</DialogTitle>
            <DialogDescription>Upload a CSV file with student data to add multiple students at once.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 mb-2">Drag and drop your CSV file here, or click to browse</p>
              <Input type="file" className="hidden" id="file-upload" />
              <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                Browse Files
              </Button>
            </div>

            <div className="bg-muted/50 rounded p-3 text-sm">
              <p className="font-medium mb-1">CSV Format Requirements:</p>
              <p className="text-muted-foreground">
                Your CSV should include columns for: name, rollNo, grade, section, gender, phone, email, address
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkImport}>Import Students</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Take Attendance Dialog */}
      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Take Attendance - {format(attendanceDate, "MMMM d, yyyy")}</DialogTitle>
            <DialogDescription>Mark attendance for all students.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.rollNo}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`attendance-${student.id}`}
                          checked={getAttendanceStatus(student.id) === "present"}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleAttendanceChange(student.id, "present")
                            } else {
                              handleAttendanceChange(student.id, "absent")
                            }
                          }}
                        />
                        <label
                          htmlFor={`attendance-${student.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {getAttendanceStatus(student.id) === "present" ? "Present" : "Absent"}
                        </label>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttendanceDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsAttendanceDialogOpen(false)
                toast({
                  title: "Attendance saved",
                  description: `Attendance for ${format(attendanceDate, "MMMM d, yyyy")} has been saved successfully.`,
                })
              }}
            >
              Save Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatsCard({ title, value, description }: { title: string; value: string; description?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
