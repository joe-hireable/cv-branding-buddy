export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      candidates: {
        Row: {
          created_at: string
          current_company: string | null
          current_position: string | null
          first_name: string | null
          id: string
          last_name: string | null
          owner_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          owner_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          owner_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          brand_color: string | null
          created_at: string
          default_cv_template: string | null
          description: string | null
          id: string
          logo_storage_path: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          brand_color?: string | null
          created_at?: string
          default_cv_template?: string | null
          description?: string | null
          id?: string
          logo_storage_path?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          brand_color?: string | null
          created_at?: string
          default_cv_template?: string | null
          description?: string | null
          id?: string
          logo_storage_path?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      cv_analysis_results: {
        Row: {
          created_at: string
          cv_id: string
          id: string
          jd_storage_path: string | null
          model_used: string | null
          result_data: Json | null
          task_type: Database["public"]["Enums"]["analysis_task_type"]
        }
        Insert: {
          created_at?: string
          cv_id: string
          id?: string
          jd_storage_path?: string | null
          model_used?: string | null
          result_data?: Json | null
          task_type: Database["public"]["Enums"]["analysis_task_type"]
        }
        Update: {
          created_at?: string
          cv_id?: string
          id?: string
          jd_storage_path?: string | null
          model_used?: string | null
          result_data?: Json | null
          task_type?: Database["public"]["Enums"]["analysis_task_type"]
        }
        Relationships: [
          {
            foreignKeyName: "cv_analysis_results_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: false
            referencedRelation: "cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_chats: {
        Row: {
          cv_id: string
          id: number
          message_text: string
          sender_type: Database["public"]["Enums"]["chat_sender_type"]
          timestamp: string
          user_id: string | null
        }
        Insert: {
          cv_id: string
          id?: number
          message_text: string
          sender_type: Database["public"]["Enums"]["chat_sender_type"]
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          cv_id?: string
          id?: number
          message_text?: string
          sender_type?: Database["public"]["Enums"]["chat_sender_type"]
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cv_chats_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: false
            referencedRelation: "cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      cvs: {
        Row: {
          candidate_id: string
          created_at: string
          error_message: string | null
          id: string
          original_file_storage_path: string | null
          original_filename: string | null
          parsed_data: Json | null
          status: Database["public"]["Enums"]["cv_status"]
          updated_at: string
          uploader_id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          original_file_storage_path?: string | null
          original_filename?: string | null
          parsed_data?: Json | null
          status?: Database["public"]["Enums"]["cv_status"]
          updated_at?: string
          uploader_id: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          original_file_storage_path?: string | null
          original_filename?: string | null
          parsed_data?: Json | null
          status?: Database["public"]["Enums"]["cv_status"]
          updated_at?: string
          uploader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cvs_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_documents: {
        Row: {
          client_logo_storage_path: string | null
          created_at: string
          cv_id: string
          format: string
          generated_file_storage_path: string
          generator_id: string
          id: string
          included_cover_page: boolean | null
          included_recruiter_branding: boolean | null
          settings_snapshot: Json | null
          template_style: string | null
        }
        Insert: {
          client_logo_storage_path?: string | null
          created_at?: string
          cv_id: string
          format: string
          generated_file_storage_path: string
          generator_id: string
          id?: string
          included_cover_page?: boolean | null
          included_recruiter_branding?: boolean | null
          settings_snapshot?: Json | null
          template_style?: string | null
        }
        Update: {
          client_logo_storage_path?: string | null
          created_at?: string
          cv_id?: string
          format?: string
          generated_file_storage_path?: string
          generator_id?: string
          id?: string
          included_cover_page?: boolean | null
          included_recruiter_branding?: boolean | null
          settings_snapshot?: Json | null
          template_style?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: false
            referencedRelation: "cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auto_optimize_upload: boolean | null
          bio: string | null
          company_id: string | null
          created_at: string
          custom_ai_instructions: string | null
          default_ai_model: string | null
          default_anonymize: boolean | null
          default_email_template: string | null
          default_export_format: string | null
          default_include_cover_page: boolean | null
          default_include_recruiter_details: boolean | null
          default_section_order: Json | null
          default_section_visibility: Json | null
          email: string | null
          email_notifications: boolean | null
          first_name: string | null
          grammar_correction: boolean | null
          id: string
          job_title: string | null
          last_name: string | null
          phone: string | null
          processing_notifications: boolean | null
          smart_keyword_detection: boolean | null
          updated_at: string
        }
        Insert: {
          auto_optimize_upload?: boolean | null
          bio?: string | null
          company_id?: string | null
          created_at?: string
          custom_ai_instructions?: string | null
          default_ai_model?: string | null
          default_anonymize?: boolean | null
          default_email_template?: string | null
          default_export_format?: string | null
          default_include_cover_page?: boolean | null
          default_include_recruiter_details?: boolean | null
          default_section_order?: Json | null
          default_section_visibility?: Json | null
          email?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          grammar_correction?: boolean | null
          id: string
          job_title?: string | null
          last_name?: string | null
          phone?: string | null
          processing_notifications?: boolean | null
          smart_keyword_detection?: boolean | null
          updated_at?: string
        }
        Update: {
          auto_optimize_upload?: boolean | null
          bio?: string | null
          company_id?: string | null
          created_at?: string
          custom_ai_instructions?: string | null
          default_ai_model?: string | null
          default_anonymize?: boolean | null
          default_email_template?: string | null
          default_export_format?: string | null
          default_include_cover_page?: boolean | null
          default_include_recruiter_details?: boolean | null
          default_section_order?: Json | null
          default_section_visibility?: Json | null
          email?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          grammar_correction?: boolean | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          phone?: string | null
          processing_notifications?: boolean | null
          smart_keyword_detection?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          id: string
          name: string
          up_sql: string
          down_sql: string
          status: string
          created_at: string
          applied_at: string | null
          error_message: string | null
        }
        Insert: {
          id?: string
          name: string
          up_sql: string
          down_sql: string
          status?: string
          created_at?: string
          applied_at?: string | null
          error_message?: string | null
        }
        Update: {
          id?: string
          name?: string
          up_sql?: string
          down_sql?: string
          status?: string
          created_at?: string
          applied_at?: string | null
          error_message?: string | null
        }
        Relationships: []
      }
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      exec_sql: {
        Args: {
          sql: string
        }
        Returns: void
      }
    }
    Enums: {
      analysis_task_type: "ps" | "cs" | "ka" | "role" | "scoring"
      chat_sender_type: "user" | "assistant"
      cv_status:
        | "Uploaded"
        | "Parsing"
        | "Parsed"
        | "Optimizing_PS"
        | "Optimizing_CS"
        | "Optimizing_KA"
        | "Optimizing_Role"
        | "Scoring"
        | "OptimizationComplete"
        | "Generating"
        | "Generated"
        | "Error"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
