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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"

// Mock data for teachers
const mockTeachers = [
  {
    id: 1,
    name: "Dr. Robert Smith",
    subject: "Mathematics",
    qualification: "Ph.D",
    experience: "10 years",
    email: "robert@schoolms.com",
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "Ms. Jennifer Davis",
    subject: "English",
    qualification: "M.A.",
    experience: "8 years",
    email: "jennifer@schoolms.com",
    phone: "234-567-8901",
  },
  {
    id: 3,
    name: "Mr. Thomas Wilson",
    subject: "Science",
    qualification: "M.Sc.",
    experience: "12 years",
    email: "thomas@schoolms.com",
    phone: "345-678-9012",
  },
  {
    id: 4,
    name: "Mrs. Patricia Moore",
    subject: "History",
    qualification: "Ph.D",
    experience: "15 years",
    email: "patricia@schoolms.com",
    phone: "456-789-0123",
  },
  {
    id: 5,
    name: "Mr. Richard Taylor",
    subject: "Physical Education",
    qualification: "B.Ed.",
    experience: "7 years",
    email: "richard@schoolms.com",
    phone: "567-890-1234",
  },
]

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(1, "Subject is required"),
  qualification: z.string().min(1, "Qualification is required"),
  experience: z.string().min(1, "Experience is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
})

type FormValues = z.infer<typeof formSchema>

export function AdminTeachersContent() {
  const { toast } = useToast()
  const [teachers, setTeachers] = useState<typeof mockTeachers>([])
  const [filteredTeachers, setFilteredTeachers] = useState<typeof mockTeachers>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<(typeof mockTeachers)[0] | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      qualification: "",
      experience: "",
      email: "",
      phone: "",
    },
  })

  useEffect(() => {
    // Simulate API fetch
    const fetchTeachers = async () => {
      try {
        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 800))
        setTeachers(mockTeachers)
        setFilteredTeachers(mockTeachers)
      } catch (error) {
        console.error("Error fetching teachers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeachers()
  }, [])

  useEffect(() => {
    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      const result = teachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(query) ||
          teacher.subject.toLowerCase().includes(query) ||
          teacher.email.toLowerCase().includes(query),
      )
      setFilteredTeachers(result)
    } else {
      setFilteredTeachers(teachers)
    }
  }, [searchQuery, teachers])

  const handleAddTeacher = (data: FormValues) => {
    const newTeacher = {
      id: teachers.length > 0 ? Math.max(...teachers.map((t) => t.id)) + 1 : 1,
      ...data,
    }

    setTeachers([...teachers, newTeacher])
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Teacher added",
      description: `${data.name} has been added successfully`,
    })
  }

  const handleEditTeacher = (data: FormValues) => {
    if (!selectedTeacher) return

    const updatedTeachers = teachers.map((teacher) =>
      teacher.id === selectedTeacher.id ? { ...teacher, ...data } : teacher,
    )

    setTeachers(updatedTeachers)
    setIsEditDialogOpen(false)

    toast({
      title: "Teacher updated",
      description: `${data.name} has been updated successfully`,
    })
  }

  const handleDeleteTeacher = () => {
    if (!selectedTeacher) return

    const updatedTeachers = teachers.filter((teacher) => teacher.id !== selectedTeacher.id)
    setTeachers(updatedTeachers)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Teacher deleted",
      description: `${selectedTeacher.name} has been deleted successfully`,
    })
  }

  const openEditDialog = (teacher: typeof selectedTeacher) => {
    setSelectedTeacher(teacher)
    if (teacher) {
      form.reset(teacher)
      setIsEditDialogOpen(true)
    }
  }

  const openDeleteDialog = (teacher: typeof selectedTeacher) => {
    setSelectedTeacher(teacher)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
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
          Add Teacher
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
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
                ) : filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No teachers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{teacher.id}</TableCell>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.subject}</TableCell>
                      <TableCell>{teacher.qualification}</TableCell>
                      <TableCell>{teacher.experience}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.phone}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(teacher)}>
                            <FileEdit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(teacher)}
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

      {/* Add Teacher Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>Enter the teacher details below to add a new teacher to the system.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddTeacher)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Mathematics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification</FormLabel>
                      <FormControl>
                        <Input placeholder="Ph.D" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Input placeholder="10 years" {...field} />
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
              </div>
              <DialogFooter>
                <Button type="submit">Add Teacher</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>Update the teacher details below.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditTeacher)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Mathematics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification</FormLabel>
                      <FormControl>
                        <Input placeholder="Ph.D" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Input placeholder="10 years" {...field} />
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
              </div>
              <DialogFooter>
                <Button type="submit">Update Teacher</Button>
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
              Are you sure you want to delete {selectedTeacher?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTeacher}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
