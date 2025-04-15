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
      settings: {
        Row: {
          id: string
          user_id: string
          default_section_visibility: Json
          default_section_order: Json
          default_anonymise: boolean
          keep_original_files: boolean
          default_export_format: string
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          default_section_visibility?: Json
          default_section_order?: Json
          default_anonymise?: boolean
          keep_original_files?: boolean
          default_export_format?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          default_section_visibility?: Json
          default_section_order?: Json
          default_anonymise?: boolean
          keep_original_files?: boolean
          default_export_format?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cvs: {
        Row: {
          id: string
          candidate_id: string
          uploader_id: string
          original_filename: string
          original_file_storage_path: string
          parsed_data: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          uploader_id: string
          original_filename: string
          original_file_storage_path: string
          parsed_data?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          uploader_id?: string
          original_filename?: string
          original_file_storage_path?: string
          parsed_data?: Json
          status?: string
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
    CompositeTypes: {
      // ... existing composite types ...
    }
  }
}
