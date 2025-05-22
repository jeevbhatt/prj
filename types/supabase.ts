export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          email: string
          name: string
          password: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          email: string
          name: string
          password: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          email?: string
          name?: string
          password?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: number
          name: string
          roll_no: string
          grade: string
          section: string
          gender: string
          phone: string | null
          email: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          roll_no: string
          grade: string
          section: string
          gender: string
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          roll_no?: string
          grade?: string
          section?: string
          gender?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          id: number
          user_id: number
          subject: string
          qualification: string
          experience: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: number
          subject: string
          qualification: string
          experience?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          subject?: string
          qualification?: string
          experience?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: number
          code: string
          name: string
          grade: string
          teacher_id: number | null
          schedule: string | null
          room: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          code: string
          name: string
          grade: string
          teacher_id?: number | null
          schedule?: string | null
          room?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          code?: string
          name?: string
          grade?: string
          teacher_id?: number | null
          schedule?: string | null
          room?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      grades: {
        Row: {
          id: number
          student_id: number
          course_id: number
          grade: string
          percentage: string
          term: string
          remarks: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          student_id: number
          course_id: number
          grade: string
          percentage: string
          term: string
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          student_id?: number
          course_id?: number
          grade?: string
          percentage?: string
          term?: string
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: number
          student_id: number
          date: string
          status: string
          time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          student_id: number
          date: string
          status: string
          time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          student_id?: number
          date?: string
          status?: string
          time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notices: {
        Row: {
          id: number
          title: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: number
          fullname: string
          email: string
          message: string
          is_read: boolean
          is_replied: boolean | null
          created_at: string
        }
        Insert: {
          id?: number
          fullname: string
          email: string
          message: string
          is_read?: boolean
          is_replied?: boolean | null
          created_at?: string
        }
        Update: {
          id?: number
          fullname?: string
          email?: string
          message?: string
          is_read?: boolean
          is_replied?: boolean | null
          created_at?: string
        }
      }
      message_replies: {
        Row: {
          id: number
          message_id: number
          reply_content: string
          sent_by: number | null
          sent_at: string
        }
        Insert: {
          id?: number
          message_id: number
          reply_content: string
          sent_by?: number | null
          sent_at?: string
        }
        Update: {
          id?: number
          message_id?: number
          reply_content?: string
          sent_by?: number | null
          sent_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: number
          user_id: number
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: number
          theme: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          theme?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
