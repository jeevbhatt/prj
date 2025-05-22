"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MessageSquare, Search, RefreshCw, X, Eye, Check, EyeOff, Send, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock data for contact messages
const mockMessages = [
  {
    id: 1,
    fullname: "John Smith",
    email: "john.smith@example.com",
    message:
      "I would like to inquire about the admission process for my child who will be entering 6th grade next year.",
    isRead: true,
    isReplied: true,
    createdAt: "2024-05-10T09:30:00Z",
    replies: [
      {
        id: 1,
        replyContent:
          "Thank you for your inquiry. Please visit our admissions page for detailed information or call our admissions office at 555-123-4567.",
        sentBy: "Admin User",
        sentAt: "2024-05-10T11:45:00Z",
      },
    ],
  },
  {
    id: 2,
    fullname: "Sarah Johnson",
    email: "sarah.j@example.com",
    message: "Are there any openings for the school basketball team? My son is very interested in joining.",
    isRead: true,
    isReplied: false,
    createdAt: "2024-05-12T14:20:00Z",
    replies: [],
  },
  {
    id: 3,
    fullname: "Michael Brown",
    email: "mbrown@example.com",
    message: "I need information about the upcoming parent-teacher conference. What dates are available?",
    isRead: false,
    isReplied: false,
    createdAt: "2024-05-14T16:45:00Z",
    replies: [],
  },
  {
    id: 4,
    fullname: "Emily Davis",
    email: "emily.davis@example.com",
    message: "I would like to schedule a tour of the school facilities. What are the available dates and times?",
    isRead: false,
    isReplied: false,
    createdAt: "2024-05-15T10:15:00Z",
    replies: [],
  },
  {
    id: 5,
    fullname: "Robert Wilson",
    email: "rwilson@example.com",
    message: "My daughter has dietary restrictions. How does the school cafeteria accommodate special dietary needs?",
    isRead: false,
    isReplied: false,
    createdAt: "2024-05-16T13:30:00Z",
    replies: [],
  },
]

interface AdminContactContentProps {
  userRole: string
}

export function AdminContactContent({ userRole }: AdminContactContentProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Filter messages based on search query and active tab
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return !message.isRead && matchesSearch
    if (activeTab === "replied") return message.isReplied && matchesSearch
    if (activeTab === "unreplied") return !message.isReplied && matchesSearch

    return matchesSearch
  })

  const handleMarkAsRead = (id: number) => {
    setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, isRead: true } : message)))
    toast({
      title: "Message marked as read",
      description: "The message has been marked as read.",
    })
  }

  const handleMarkAsUnread = (id: number) => {
    setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, isRead: false } : message)))
    toast({
      title: "Message marked as unread",
      description: "The message has been marked as unread.",
    })
  }

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message)
    // If message is unread, mark it as read
    if (!message.isRead) {
      handleMarkAsRead(message.id)
    }
  }

  const handleSendReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply message.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newReply = {
        id: Date.now(),
        replyContent,
        sentBy: userRole === "admin" ? "Administrator" : "Teacher",
        sentAt: new Date().toISOString(),
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === selectedMessage.id
            ? {
                ...message,
                isReplied: true,
                replies: [...message.replies, newReply],
              }
            : message,
        ),
      )

      setReplyContent("")
      setIsLoading(false)
      setReplyDialogOpen(false)

      toast({
        title: "Reply sent",
        description: `Your reply has been sent to ${selectedMessage.email}`,
      })
    }, 1000)
  }

  const handleDeleteMessage = () => {
    if (messageToDelete === null) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setMessages((prev) => prev.filter((message) => message.id !== messageToDelete))
      setMessageToDelete(null)
      setDeleteDialogOpen(false)
      setIsLoading(false)

      toast({
        title: "Message deleted",
        description: "The message has been permanently deleted.",
      })
    }, 800)
  }

  const refreshMessages = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Messages refreshed",
        description: "Contact messages have been refreshed.",
      })
    }, 1000)
  }

  const getUnreadCount = () => {
    return messages.filter((message) => !message.isRead).length
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Contact Messages</h2>
          <Badge variant="outline" className="ml-2">
            {filteredMessages.length}
          </Badge>
          {getUnreadCount() > 0 && (
            <Badge variant="destructive" className="ml-1">
              {getUnreadCount()} unread
            </Badge>
          )}
          <Button variant="outline" size="icon" onClick={refreshMessages} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="replied">Replied</TabsTrigger>
          <TabsTrigger value="unreplied">Unreplied</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center">
                          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Loading messages...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">No messages found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMessages.map((message) => (
                      <TableRow key={message.id} className={!message.isRead ? "bg-muted/40" : undefined}>
                        <TableCell>
                          {!message.isRead ? (
                            <Badge variant="secondary">New</Badge>
                          ) : message.isReplied ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Replied
                            </Badge>
                          ) : (
                            <Badge variant="outline">Read</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{message.fullname}</TableCell>
                        <TableCell className="hidden md:table-cell">{message.email}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(new Date(message.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewMessage(message)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            {message.isRead ? (
                              <Button variant="ghost" size="icon" onClick={() => handleMarkAsUnread(message.id)}>
                                <EyeOff className="h-4 w-4" />
                                <span className="sr-only">Mark as unread</span>
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" onClick={() => handleMarkAsRead(message.id)}>
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Mark as read</span>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedMessage(message)
                                setReplyDialogOpen(true)
                              }}
                            >
                              <Send className="h-4 w-4" />
                              <span className="sr-only">Reply</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setMessageToDelete(message.id)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Message Dialog */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage && !replyDialogOpen} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Message from {selectedMessage.fullname}</DialogTitle>
              <DialogDescription>
                Received on {format(new Date(selectedMessage.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">From</Label>
                  <p className="font-medium">{selectedMessage.fullname}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Message</Label>
                <div className="mt-1 p-4 bg-muted rounded-md">
                  <p>{selectedMessage.message}</p>
                </div>
              </div>

              {selectedMessage.replies.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Replies</Label>
                  <div className="space-y-3 mt-1">
                    {selectedMessage.replies.map((reply: any) => (
                      <div key={reply.id} className="p-4 bg-primary/5 rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-sm">{reply.sentBy}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(reply.sentAt), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <p className="text-sm">{reply.replyContent}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setSelectedMessage(null)} className="sm:order-1">
                Close
              </Button>
              <Button
                onClick={() => {
                  setReplyContent("")
                  setReplyDialogOpen(true)
                }}
                className="sm:order-2"
              >
                <Send className="mr-2 h-4 w-4" />
                Reply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.fullname}</DialogTitle>
            <DialogDescription>Send a reply to {selectedMessage?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-1">Original Message:</h4>
              <p className="text-sm">{selectedMessage?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply-content">Your Reply</Label>
              <Textarea
                id="reply-content"
                placeholder="Type your reply here..."
                rows={6}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReply} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message and all its replies.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMessage}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
