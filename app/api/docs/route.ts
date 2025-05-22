import { NextResponse } from "next/server"
import { createSwaggerSpec } from "next-swagger-doc"

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "School Management System API",
        version: "1.0.0",
        description: "API documentation for the School Management System",
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          description: "Server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  })

  return NextResponse.json(spec)
}
