"use client"

import { useEffect, useState } from "react"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

export default function ApiDocs() {
  const [spec, setSpec] = useState<any>(null)

  useEffect(() => {
    fetch("/api/docs")
      .then((response) => response.json())
      .then((data) => setSpec(data))
      .catch((error) => console.error("Error fetching API docs:", error))
  }, [])

  if (!spec) {
    return <div className="p-8">Loading API documentation...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
      <SwaggerUI spec={spec} />
    </div>
  )
}
