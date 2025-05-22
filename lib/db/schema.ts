import { relations } from "drizzle-orm"
import { pgTable, serial, varchar, text, timestamp, boolean, integer } from "drizzle-orm/pg-core"

// Users table (for admin, teachers, etc.)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("teacher"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Students table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  rollNo: varchar("roll_no", { length: 50 }).notNull().unique(),
  grade: varchar("grade", { length: 50 }).notNull(),
  section: varchar("section", { length: 10 }).notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Teachers table
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  qualification: varchar("qualification", { length: 100 }).notNull(),
  experience: varchar("experience", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  grade: varchar("grade", { length: 50 }).notNull(),
  teacherId: integer("teacher_id").references(() => teachers.id),
  schedule: varchar("schedule", { length: 255 }),
  room: varchar("room", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Grades table
export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .references(() => students.id, { onDelete: "cascade" })
    .notNull(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  grade: varchar("grade", { length: 10 }).notNull(),
  percentage: varchar("percentage", { length: 10 }).notNull(),
  term: varchar("term", { length: 50 }).notNull(),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Attendance table
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .references(() => students.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // Present, Absent, Late
  time: varchar("time", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Notices table
export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  fullname: varchar("fullname", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  isReplied: boolean("is_replied").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Message replies table
export const messageReplies = pgTable("message_replies", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id")
    .references(() => contactMessages.id, { onDelete: "cascade" })
    .notNull(),
  replyContent: text("reply_content").notNull(),
  sentBy: integer("sent_by").references(() => users.id),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
})

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  teachers: many(teachers),
  messageReplies: many(messageReplies),
}))

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  courses: many(courses),
}))

export const coursesRelations = relations(courses, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [courses.teacherId],
    references: [teachers.id],
  }),
  grades: many(grades),
}))

export const studentsRelations = relations(students, ({ many }) => ({
  grades: many(grades),
  attendance: many(attendance),
}))

export const gradesRelations = relations(grades, ({ one }) => ({
  student: one(students, {
    fields: [grades.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [grades.courseId],
    references: [courses.id],
  }),
}))

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
}))

export const contactMessagesRelations = relations(contactMessages, ({ many }) => ({
  replies: many(messageReplies),
}))

export const messageRepliesRelations = relations(messageReplies, ({ one }) => ({
  message: one(contactMessages, {
    fields: [messageReplies.messageId],
    references: [contactMessages.id],
  }),
  user: one(users, {
    fields: [messageReplies.sentBy],
    references: [users.id],
  }),
}))
