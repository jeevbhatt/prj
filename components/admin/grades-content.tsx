"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, FileEdit, Trash2, Search, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Mock data for grades
const mockGrades = [
  {
    id: 1,
    student: "John Doe",
    course: "Algebra",
    grade: "A",
    percentage: "92%",
    term: "First Term",
    remarks: "Excellent",
  },
  {
    id: 2,
    student: "Jane Smith",
    course: "Literature",
    grade: "B+",
    percentage: "88%",
    term: "First Term",
    remarks: "Very Good",
  },
  {
    id: 3,
    student: "Michael Johnson",
    course: "Physics",
    grade: "A-",
    percentage: "90%",
    term: "First Term",
    remarks: "Excellent",
  },
  {
    id: 4,
    student: "Emily Williams",
    course: "World History",
    grade: "B",
    percentage: "85%",
    term: "First Term",
    remarks: "Good",
  },
  {
    id: 5,
    student: "David Brown",
    course: "Physical Education",
    grade: "A",
    percentage: "95%",
    term: "First Term",
    remarks: "Outstanding",
  },
]

// Mock data for students and courses (for dropdowns)
const mockStudents = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Michael Johnson" },
  { id: 4, name: "Emily Williams" },
  { id: 5, name: "David Brown" },
]

const mockCourses = [
  { id: 1, name: "Algebra" },
  { id: 2, name: "Literature" },
  { id: 3, name: "Physics" },
  { id: 4, name: "World History" },
  { id: 5, name: "Physical Education" },
]

const formSchema = z.object({
  student: z.string().min(1, "Student is required"),
  course: z.string().min(1, "Course is required"),
  grade: z.string().min(1, "Grade is required"),
  percentage: z.string().min(1, "Percentage is required"),
  term: z.string().min(1, "Term is required"),
  remarks: z.string().min(1, "Remarks are required"),
})

type FormValues = z.infer<typeof formSchema>

export function AdminGradesContent() {
  const { toast } = useToast()
  const [grades, setGrades] = useState<typeof mockGrades>([])
  const [filteredGrades, setFilteredGrades] = useState<typeof mockGrades>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<(typeof mockGrades)[0] | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student: "",
      course: "",
      grade: "",
      percentage: "",
      term: "",
      remarks: "",
    },
  })

  useEffect(() => {
    // Simulate API fetch
    const fetchGrades = async () => {
      try {
        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 800))
        setGrades(mockGrades)
        setFilteredGrades(mockGrades)
      } catch (error) {
        console.error("Error fetching grades:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrades()
  }, [])

  useEffect(() => {
    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      const result = grades.filter(
        (grade) =>
          grade.student.toLowerCase().includes(query) ||
          grade.course.toLowerCase().includes(query) ||
          grade.grade.toLowerCase().includes(query),
      )
      setFilteredGrades(result)
    } else {
      setFilteredGrades(grades)
    }
  }, [searchQuery, grades])

  const handleAddGrade = (data: FormValues) => {
    const newGrade = {
      id: grades.length > 0 ? Math.max(...grades.map((g) => g.id)) + 1 : 1,
      ...data,
    }

    setGrades([...grades, newGrade])
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Grade added",
      description: `Grade for ${data.student} in ${data.course} has been added successfully`,
    })
  }

  const handleEditGrade = (data: FormValues) => {
    if (!selectedGrade) return

    const updatedGrades = grades.map((grade) => (grade.id === selectedGrade.id ? { ...grade, ...data } : grade))

    setGrades(updatedGrades)
    setIsEditDialogOpen(false)

    toast({
      title: "Grade updated",
      description: `Grade for ${data.student} in ${data.course} has been updated successfully`,
    })
  }

  const handleDeleteGrade = () => {
    if (!selectedGrade) return

    const updatedGrades = grades.filter((grade) => grade.id !== selectedGrade.id)
    setGrades(updatedGrades)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Grade deleted",
      description: `Grade for ${selectedGrade.student} in ${selectedGrade.course} has been deleted successfully`,
    })
  }

  const openEditDialog = (grade: typeof selectedGrade) => {
    setSelectedGrade(grade)
    if (grade) {
      form.reset(grade)
      setIsEditDialogOpen(true)
    }
  }

  const openDeleteDialog = (grade: typeof selectedGrade) => {
    setSelectedGrade(grade)
    setIsDeleteDialogOpen(true)
  }

  const exportGrades = () => {
    // In a real app, this would generate a CSV file
    toast({
      title: "Export started",
      description: "Your grade data is being prepared for download",
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export completed",
        description: "Grade data has been exported successfully",
      })
    }, 1000)
  }

  const getGradeBadge = (grade: string) => {
    if (grade.startsWith("A"))
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">{grade}</Badge>
    if (grade.startsWith("B"))
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">{grade}</Badge>
    if (grade.startsWith("C"))
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">{grade}</Badge>
    if (grade.startsWith("D"))
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">{grade}</Badge>
    return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">{grade}</Badge>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search grades..."
            className="pl-9 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportGrades}>
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
            Add Grade
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Remarks</TableHead>
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
                ) : filteredGrades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No grades found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGrades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>{grade.id}</TableCell>
                      <TableCell>{grade.student}</TableCell>
                      <TableCell>{grade.course}</TableCell>
                      <TableCell>{getGradeBadge(grade.grade)}</TableCell>
                      <TableCell>{grade.percentage}</TableCell>
                      <TableCell>{grade.term}</TableCell>
                      <TableCell>{grade.remarks}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(grade)}>
                            <FileEdit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(grade)}
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

      {/* Add Grade Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Grade</DialogTitle>
            <DialogDescription>Enter the grade details below to add a new grade to the system.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddGrade)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="student"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockStudents.map((student) => (
                            <SelectItem key={student.id} value={student.name}>
                              {student.name}
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
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCourses.map((course) => (
                            <SelectItem key={course.id} value={course.name}>
                              {course.name}
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
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="C+">C+</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="C-">C-</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentage</FormLabel>
                      <FormControl>
                        <Input placeholder="92%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="First Term">First Term</SelectItem>
                          <SelectItem value="Second Term">Second Term</SelectItem>
                          <SelectItem value="Final Term">Final Term</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Input placeholder="Excellent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Add Grade</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Grade Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Grade</DialogTitle>
            <DialogDescription>Update the grade details below.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditGrade)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="student"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockStudents.map((student) => (
                            <SelectItem key={student.id} value={student.name}>
                              {student.name}
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
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCourses.map((course) => (
                            <SelectItem key={course.id} value={course.name}>
                              {course.name}
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
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="C+">C+</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="C-">C-</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentage</FormLabel>
                      <FormControl>
                        <Input placeholder="92%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="First Term">First Term</SelectItem>
                          <SelectItem value="Second Term">Second Term</SelectItem>
                          <SelectItem value="Final Term">Final Term</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Input placeholder="Excellent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Update Grade</Button>
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
              Are you sure you want to delete the grade for {selectedGrade?.student} in {selectedGrade?.course}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGrade}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
