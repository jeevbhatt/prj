"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Plus, FileEdit, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"

// Mock data for notices
const mockNotices = [
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

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
})

type FormValues = z.infer<typeof formSchema>

export function AdminNoticesContent() {
  const { toast } = useToast()
  const [notices, setNotices] = useState<typeof mockNotices>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState<(typeof mockNotices)[0] | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

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

  const handleAddNotice = (data: FormValues) => {
    const newNotice = {
      id: notices.length > 0 ? Math.max(...notices.map((n) => n.id)) + 1 : 1,
      title: data.title,
      content: data.content,
      created_at: new Date().toISOString(),
    }

    setNotices([newNotice, ...notices])
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Notice added",
      description: "The notice has been added successfully",
    })
  }

  const handleEditNotice = (data: FormValues) => {
    if (!selectedNotice) return

    const updatedNotices = notices.map((notice) =>
      notice.id === selectedNotice.id ? { ...notice, title: data.title, content: data.content } : notice,
    )

    setNotices(updatedNotices)
    setIsEditDialogOpen(false)

    toast({
      title: "Notice updated",
      description: "The notice has been updated successfully",
    })
  }

  const handleDeleteNotice = () => {
    if (!selectedNotice) return

    const updatedNotices = notices.filter((notice) => notice.id !== selectedNotice.id)
    setNotices(updatedNotices)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Notice deleted",
      description: "The notice has been deleted successfully",
    })
  }

  const openEditDialog = (notice: typeof selectedNotice) => {
    setSelectedNotice(notice)
    if (notice) {
      form.reset({
        title: notice.title,
        content: notice.content,
      })
      setIsEditDialogOpen(true)
    }
  }

  const openDeleteDialog = (notice: typeof selectedNotice) => {
    setSelectedNotice(notice)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            form.reset()
            setIsAddDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Notice
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No notices available. Click "Add Notice" to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <Card key={notice.id} className="transition-all duration-300 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{notice.title}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(notice.created_at), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                    <p className="mt-4 text-gray-700">{notice.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(notice)}>
                      <FileEdit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(notice)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Notice Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Notice</DialogTitle>
            <DialogDescription>Create a new notice to be displayed on the school website.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddNotice)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter notice title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter notice content" className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Notice</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Notice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
            <DialogDescription>Update the notice details.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditNotice)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter notice title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter notice content" className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Notice</Button>
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
              Are you sure you want to delete this notice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteNotice}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
