export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          status: string;
          age: number;
          points: number;
          role: string;
          created_at: string;
          last_login: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          status?: string;
          age?: number;
          points?: number;
          role?: string;
          created_at?: string;
          last_login?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          status?: string;
          age?: number;
          points?: number;
          role?: string;
          created_at?: string;
          last_login?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 