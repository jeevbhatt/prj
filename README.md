# School Management System API

This document provides instructions for setting up and configuring the backend API for the School Management System using Supabase and Drizzle ORM.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account
- SMTP server for email functionality

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=noreply@yourschool.com
ADMIN_EMAIL=admin@yourschool.com
\`\`\`

## Database Setup

1. Create a new Supabase project
2. Use the SQL editor to create the necessary tables:

\`\`\`sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'teacher',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  roll_no VARCHAR(50) NOT NULL UNIQUE,
  grade VARCHAR(50) NOT NULL,
  section VARCHAR(10) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Teachers table
CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  subject VARCHAR(100) NOT NULL,
  qualification VARCHAR(100) NOT NULL,
  experience VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  grade VARCHAR(50) NOT NULL,
  teacher_id INTEGER REFERENCES teachers(id),
  schedule VARCHAR(255),
  room VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Grades table
CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  grade VARCHAR(10) NOT NULL,
  percentage VARCHAR(10) NOT NULL,
  term VARCHAR(50) NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Attendance table
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL,
  time VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Notices table
CREATE TABLE notices (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Contact messages table
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  fullname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  is_replied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Message replies table
CREATE TABLE message_replies (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES contact_messages(id) ON DELETE CASCADE NOT NULL,
  reply_content TEXT NOT NULL,
  sent_by INTEGER REFERENCES users(id),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- User preferences table
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  theme VARCHAR(20) NOT NULL DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_students_grade ON students(grade);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX idx_contact_messages_is_replied ON contact_messages(is_replied);
\`\`\`

3. Enable Row Level Security (RLS) for all tables and create appropriate policies

## Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Documentation

The API documentation is available at `/api-docs` when the server is running. This provides a comprehensive overview of all available endpoints, request/response formats, and authentication requirements.

## Authentication

The API uses JWT-based authentication through Supabase Auth. To authenticate:

1. Register a user using the `/api/auth/register` endpoint
2. Login using the `/api/auth/login` endpoint
3. Use the JWT token in the Authorization header for subsequent requests:
   \`\`\`
   Authorization: Bearer your_jwt_token
   \`\`\`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login a user
- POST `/api/auth/logout` - Logout a user
- POST `/api/auth/reset-password` - Request password reset
- POST `/api/auth/update-password` - Update password

### Students
- GET `/api/students` - Get all students
- POST `/api/students` - Create a new student
- GET `/api/students/:id` - Get a student by ID
- PUT `/api/students/:id` - Update a student
- DELETE `/api/students/:id` - Delete a student

### Attendance
- GET `/api/attendance` - Get attendance records
- POST `/api/attendance` - Create/update attendance record

### Contact Messages
- GET `/api/contact` - Get all contact messages
- POST `/api/contact` - Submit a new contact message
- GET `/api/contact/:id` - Get a contact message by ID
- PUT `/api/contact/:id` - Update a contact message
- DELETE `/api/contact/:id` - Delete a contact message
- POST `/api/contact/:id/reply` - Reply to a contact message

### Theme Preferences
- GET `/api/preferences/theme` - Get user theme preference
- POST `/api/preferences/theme` - Update user theme preference

## Error Handling

All API endpoints follow a consistent error handling pattern:

- 400 Bad Request - Invalid input data
- 401 Unauthorized - Missing or invalid authentication
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server-side error

Error responses have the following format:
\`\`\`json
{
  "error": "Error message"
}
\`\`\`

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Row Level Security is implemented in Supabase
- Input validation is performed using Zod
- CORS is configured to restrict access to trusted domains
\`\`\`

This comprehensive backend API implementation provides all the requested functionalities for the school management system, including user authentication, data management, contact form handling, admin panel integration, theme preferences, error handling, and API documentation.
