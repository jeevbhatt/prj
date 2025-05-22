"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, FileEdit, Trash2, Search } from "lucide-react"
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

// Mock data for courses
const mockCourses = [
  {
    id: 1,
    code: "MATH101",
    name: "Algebra",
    grade: "9th",
    teacher: "Dr. Robert Smith",
    schedule: "Mon, Wed 9:00-10:30",
    room: "A101",
  },
  {
    id: 2,
    code: "ENG102",
    name: "Literature",
    grade: "10th",
    teacher: "Ms. Jennifer Davis",
    schedule: "Tue, Thu 11:00-12:30",
    room: "B205",
  },
  {
    id: 3,
    code: "SCI103",
    name: "Physics",
    grade: "11th",
    teacher: "Mr. Thomas Wilson",
    schedule: "Mon, Wed, Fri 1:00-2:00",
    room: "C310",
  },
  {
    id: 4,
    code: "HIST104",
    name: "World History",
    grade: "10th",
    teacher: "Mrs. Patricia Moore",
    schedule: "Tue, Thu 2:30-4:00",
    room: "B201",
  },
  {
    id: 5,
    code: "PE105",
    name: "Physical Education",
    grade: "All",
    teacher: "Mr. Richard Taylor",
    schedule: "Fri 9:00-11:00",
    room: "Gym",
  },
]

// Mock data for teachers (for the dropdown)
const mockTeachers = [
  { id: 1, name: "Dr. Robert Smith" },
  { id: 2, name: "Ms. Jennifer Davis" },
  { id: 3, name: "Mr. Thomas Wilson" },
  { id: 4, name: "Mrs. Patricia Moore" },
  { id: 5, name: "Mr. Richard Taylor" },
]

const formSchema = z.object({
  code: z.string().min(1, "Course code is required"),
  name: z.string().min(1, "Course name is required"),
  grade: z.string().min(1, "Grade is required"),
  teacher: z.string().min(1, "Teacher is required"),
  schedule: z.string().min(1, "Schedule is required"),
  room: z.string().min(1, "Room is required"),
})

type FormValues = z.infer<typeof formSchema>

export function AdminCoursesContent() {
  const { toast } = useToast()
  const [courses, setCourses] = useState<typeof mockCourses>([])
  const [filteredCourses, setFilteredCourses] = useState<typeof mockCourses>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<(typeof mockCourses)[0] | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      grade: "",
      teacher: "",
      schedule: "",
      room: "",
    },
  })

  useEffect(() => {
    // Simulate API fetch
    const fetchCourses = async () => {
      try {
        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 800))
        setCourses(mockCourses)
        setFilteredCourses(mockCourses)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      const result = courses.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.code.toLowerCase().includes(query) ||
          course.teacher.toLowerCase().includes(query),
      )
      setFilteredCourses(result)
    } else {
      setFilteredCourses(courses)
    }
  }, [searchQuery, courses])

  const handleAddCourse = (data: FormValues) => {
    const newCourse = {
      id: courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1,
      ...data,
    }

    setCourses([...courses, newCourse])
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Course added",
      description: `${data.name} has been added successfully`,
    })
  }

  const handleEditCourse = (data: FormValues) => {
    if (!selectedCourse) return

    const updatedCourses = courses.map((course) => (course.id === selectedCourse.id ? { ...course, ...data } : course))

    setCourses(updatedCourses)
    setIsEditDialogOpen(false)

    toast({
      title: "Course updated",
      description: `${data.name} has been updated successfully`,
    })
  }

  const handleDeleteCourse = () => {
    if (!selectedCourse) return

    const updatedCourses = courses.filter((course) => course.id !== selectedCourse.id)
    setCourses(updatedCourses)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Course deleted",
      description: `${selectedCourse.name} has been deleted successfully`,
    })
  }

  const openEditDialog = (course: typeof selectedCourse) => {
    setSelectedCourse(course)
    if (course) {
      form.reset(course)
      setIsEditDialogOpen(true)
    }
  }

  const openDeleteDialog = (course: typeof selectedCourse) => {
    setSelectedCourse(course)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button
          onClick={() => {
            form.reset()
            setIsAddDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Room</TableHead>
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
                ) : filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No courses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.id}</TableCell>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.grade}</TableCell>
                      <TableCell>{course.teacher}</TableCell>
                      <TableCell>{course.schedule}</TableCell>
                      <TableCell>{course.room}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(course)}>
                            <FileEdit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(course)}
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

      {/* Add Course Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>Enter the course details below to add a new course to the system.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddCourse)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Code</FormLabel>
                      <FormControl>
                        <Input placeholder="MATH101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Algebra" {...field} />
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
                          <SelectItem value="8th">8th</SelectItem>
                          <SelectItem value="9th">9th</SelectItem>
                          <SelectItem value="10th">10th</SelectItem>
                          <SelectItem value="11th">11th</SelectItem>
                          <SelectItem value="12th">12th</SelectItem>
                          <SelectItem value="All">All Grades</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockTeachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.name}>
                              {teacher.name}
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
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon, Wed 9:00-10:30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <FormControl>
                        <Input placeholder="A101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Add Course</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update the course details below.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditCourse)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Code</FormLabel>
                      <FormControl>
                        <Input placeholder="MATH101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Algebra" {...field} />
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
                          <SelectItem value="8th">8th</SelectItem>
                          <SelectItem value="9th">9th</SelectItem>
                          <SelectItem value="10th">10th</SelectItem>
                          <SelectItem value="11th">11th</SelectItem>
                          <SelectItem value="12th">12th</SelectItem>
                          <SelectItem value="All">All Grades</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockTeachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.name}>
                              {teacher.name}
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
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon, Wed 9:00-10:30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <FormControl>
                        <Input placeholder="A101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Update Course</Button>
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
              Are you sure you want to delete {selectedCourse?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
