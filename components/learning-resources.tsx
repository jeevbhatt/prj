"use client"

import { useState } from "react"
import { FileText, Download, Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ResourceType = "pdf" | "doc" | "ppt" | "video" | "link"
type ResourceCategory = "math" | "science" | "english" | "history" | "general"

type Resource = {
  id: number
  title: string
  description: string
  type: ResourceType
  category: ResourceCategory
  size?: string
  uploadDate: string
  url: string
}

// Mock data for learning resources
const learningResources: Resource[] = [
  {
    id: 1,
    title: "Algebra Fundamentals",
    description: "Complete guide to basic algebraic concepts and equations.",
    type: "pdf",
    category: "math",
    size: "2.4 MB",
    uploadDate: "2024-07-15",
    url: "#",
  },
  {
    id: 2,
    title: "Cell Biology Notes",
    description: "Comprehensive notes on cell structure and function.",
    type: "pdf",
    category: "science",
    size: "3.1 MB",
    uploadDate: "2024-07-20",
    url: "#",
  },
  {
    id: 3,
    title: "English Grammar Rules",
    description: "Complete guide to English grammar and punctuation.",
    type: "doc",
    category: "english",
    size: "1.8 MB",
    uploadDate: "2024-07-22",
    url: "#",
  },
  {
    id: 4,
    title: "World History Timeline",
    description: "Interactive timeline of major world history events.",
    type: "ppt",
    category: "history",
    size: "5.2 MB",
    uploadDate: "2024-07-25",
    url: "#",
  },
  {
    id: 5,
    title: "Chemistry Lab Safety",
    description: "Important safety guidelines for chemistry laboratory sessions.",
    type: "pdf",
    category: "science",
    size: "1.5 MB",
    uploadDate: "2024-07-28",
    url: "#",
  },
  {
    id: 6,
    title: "Geometry Formulas",
    description: "Complete list of geometry formulas with examples.",
    type: "pdf",
    category: "math",
    size: "1.2 MB",
    uploadDate: "2024-08-01",
    url: "#",
  },
  {
    id: 7,
    title: "Essay Writing Techniques",
    description: "Learn effective essay writing techniques and structures.",
    type: "doc",
    category: "english",
    size: "2.0 MB",
    uploadDate: "2024-08-05",
    url: "#",
  },
  {
    id: 8,
    title: "Physics Video Lectures",
    description: "Video lectures covering mechanics, thermodynamics, and electromagnetism.",
    type: "video",
    category: "science",
    uploadDate: "2024-08-10",
    url: "#",
  },
  {
    id: 9,
    title: "Study Skills Guide",
    description: "Effective study techniques and time management strategies.",
    type: "pdf",
    category: "general",
    size: "1.7 MB",
    uploadDate: "2024-08-15",
    url: "#",
  },
  {
    id: 10,
    title: "Online Math Practice",
    description: "Link to interactive math practice problems and solutions.",
    type: "link",
    category: "math",
    uploadDate: "2024-08-20",
    url: "#",
  },
]

export function LearningResources() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  // Filter resources based on search query, category, and type
  const filteredResources = learningResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesType = selectedType === "all" || resource.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "doc":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "ppt":
        return <FileText className="h-5 w-5 text-orange-500" />
      case "video":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "link":
        return <ExternalLink className="h-5 w-5 text-green-500" />
    }
  }

  const getTypeLabel = (type: ResourceType) => {
    switch (type) {
      case "pdf":
        return "PDF"
      case "doc":
        return "Document"
      case "ppt":
        return "Presentation"
      case "video":
        return "Video"
      case "link":
        return "External Link"
    }
  }

  const getCategoryLabel = (category: ResourceCategory) => {
    switch (category) {
      case "math":
        return "Mathematics"
      case "science":
        return "Science"
      case "english":
        return "English"
      case "history":
        return "History"
      case "general":
        return "General"
    }
  }

  const handleDownload = (resource: Resource) => {
    // In a real application, this would initiate a download
    alert(`Downloading ${resource.title}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="doc">Document</SelectItem>
              <SelectItem value="ppt">Presentation</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredResources.length} of {learningResources.length} resources
          </p>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {getTypeIcon(resource.type)}
                        <CardTitle className="text-base">{resource.title}</CardTitle>
                      </div>
                      <Badge variant="outline">{getTypeLabel(resource.type)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{getCategoryLabel(resource.category)}</span>
                      {resource.size && <span>{resource.size}</span>}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      onClick={() => handleDownload(resource)}
                      variant="outline"
                      className="w-full flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>{resource.type === "link" ? "Visit Link" : "Download"}</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-muted-foreground">No resources found matching your criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Title</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Category</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Type</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Size</th>
                  <th className="text-left p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <tr key={resource.id} className="hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(resource.type)}
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {getCategoryLabel(resource.category)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell">{getCategoryLabel(resource.category)}</td>
                      <td className="p-3 hidden md:table-cell">{getTypeLabel(resource.type)}</td>
                      <td className="p-3 hidden md:table-cell">{resource.size || "-"}</td>
                      <td className="p-3">
                        <Button
                          onClick={() => handleDownload(resource)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          <span>{resource.type === "link" ? "Visit" : "Download"}</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No resources found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
