export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          provider: string | null
          bio: string | null
          profession: string | null
          skills: string[] | null
          phone: string | null
          location: string | null
          created_at: string
          updated_at: string
          experience_level: string | null
          interests: string[] | null
          preferred_tools: string[] | null
          work_style: string | null
          goals: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          provider?: string | null
          bio?: string | null
          profession?: string | null
          skills?: string[] | null
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
          experience_level?: string | null
          interests?: string[] | null
          preferred_tools?: string[] | null
          work_style?: string | null
          goals?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          provider?: string | null
          bio?: string | null
          profession?: string | null
          skills?: string[] | null
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
          experience_level?: string | null
          interests?: string[] | null
          preferred_tools?: string[] | null
          work_style?: string | null
          goals?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          client_name: string | null
          project_type: string | null
          tech_stack: string[] | null
          experience_level: string | null
          status: string | null
          due_date: string | null
          estimated_time: string | null
          user_id: string | null
          created_at: string
          updated_at: string
          ai_breakdown: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          client_name?: string | null
          project_type?: string | null
          tech_stack?: string[] | null
          experience_level?: string | null
          status?: string | null
          due_date?: string | null
          estimated_time?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
          ai_breakdown?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          client_name?: string | null
          project_type?: string | null
          tech_stack?: string[] | null
          experience_level?: string | null
          status?: string | null
          due_date?: string | null
          estimated_time?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
          ai_breakdown?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string | null
          name: string
          description: string | null
          status: string | null
          priority: string | null
          due_date: string | null
          assigned_to: string | null
          completed: boolean | null
          created_at: string
          updated_at: string
          estimated_duration: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          name: string
          description?: string | null
          status?: string | null
          priority?: string | null
          due_date?: string | null
          assigned_to?: string | null
          completed?: boolean | null
          created_at?: string
          updated_at?: string
          estimated_duration?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          name?: string
          description?: string | null
          status?: string | null
          priority?: string | null
          due_date?: string | null
          assigned_to?: string | null
          completed?: boolean | null
          created_at?: string
          updated_at?: string
          estimated_duration?: string | null
        }
      }
      resources: {
        Row: {
          id: string
          project_id: string
          title: string
          url: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          url: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          url?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string | null
          project_id: string | null
          message: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          project_id?: string | null
          message: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          project_id?: string | null
          message?: string
          role?: string
          created_at?: string
        }
      }
    }
  }
}
