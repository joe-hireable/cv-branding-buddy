/**
 * @file Supabase Types
 * @description Type definitions for Supabase database schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          first_name: string
          last_name: string
          profile_picture: string | null
          role: 'admin' | 'user' | 'recruiter'
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          first_name: string
          last_name: string
          profile_picture?: string | null
          role?: 'admin' | 'user' | 'recruiter'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          first_name?: string
          last_name?: string
          profile_picture?: string | null
          role?: 'admin' | 'user' | 'recruiter'
        }
      }
      cvs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          is_primary: boolean
          content: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          is_primary?: boolean
          content: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          is_primary?: boolean
          content?: Json
        }
      }
      settings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          theme: 'light' | 'dark' | 'system'
          notifications_enabled: boolean
          email_notifications: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          theme?: 'light' | 'dark' | 'system'
          notifications_enabled?: boolean
          email_notifications?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          theme?: 'light' | 'dark' | 'system'
          notifications_enabled?: boolean
          email_notifications?: boolean
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