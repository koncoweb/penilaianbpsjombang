export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      absen: {
        Row: {
          absent_days: number
          created_at: string | null
          created_by: string | null
          employee_id: string
          id: string
          month: number
          year: number
        }
        Insert: {
          absent_days?: number
          created_at?: string | null
          created_by?: string | null
          employee_id: string
          id?: string
          month: number
          year: number
        }
        Update: {
          absent_days?: number
          created_at?: string | null
          created_by?: string | null
          employee_id?: string
          id?: string
          month?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "absen_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          nip: string
          position: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          nip: string
          position: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          nip?: string
          position?: string
        }
        Relationships: []
      }
      kipapp: {
        Row: {
          created_at: string | null
          employee_id: string
          id: string
          kipapp_value: number
          month: number
          year: number
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          id?: string
          kipapp_value: number
          month: number
          year: number
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          id?: string
          kipapp_value?: number
          month?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "kipapp_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      kipapp_quarterly: {
        Row: {
          avg_value: number
          computed_at: string | null
          created_by: string | null
          employee_id: string
          id: string
          quarter: number
          year: number
        }
        Insert: {
          avg_value: number
          computed_at?: string | null
          created_by?: string | null
          employee_id: string
          id?: string
          quarter: number
          year: number
        }
        Update: {
          avg_value?: number
          computed_at?: string | null
          created_by?: string | null
          employee_id?: string
          id?: string
          quarter?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "kipapp_quarterly_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      kipapp_quarterly_stats: {
        Row: {
          avg_value: number | null
          computed_at: string | null
          created_by: string | null
          id: string
          max_value: number | null
          min_value: number | null
          quarter: number
          range_value: number | null
          total_employees: number | null
          year: number
        }
        Insert: {
          avg_value?: number | null
          computed_at?: string | null
          created_by?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          quarter: number
          range_value?: number | null
          total_employees?: number | null
          year: number
        }
        Update: {
          avg_value?: number | null
          computed_at?: string | null
          created_by?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          quarter?: number
          range_value?: number | null
          total_employees?: number | null
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      renak_entries: {
        Row: {
          actual: number
          created_at: string | null
          created_by: string | null
          employee_id: string
          id: string
          month: number
          year: number
        }
        Insert: {
          actual: number
          created_at?: string | null
          created_by?: string | null
          employee_id: string
          id?: string
          month: number
          year: number
        }
        Update: {
          actual?: number
          created_at?: string | null
          created_by?: string | null
          employee_id?: string
          id?: string
          month?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "renak_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      renak_targets: {
        Row: {
          id: string
          month: number
          target: number
          year: number
        }
        Insert: {
          id?: string
          month: number
          target: number
          year: number
        }
        Update: {
          id?: string
          month?: number
          target?: number
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      kipapp_quarterly_stats_realtime: {
        Row: {
          avg_value: number | null
          last_computed_at: string | null
          max_value: number | null
          min_value: number | null
          quarter: number | null
          range_value: number | null
          total_employees: number | null
          year: number | null
        }
        Relationships: []
      }
      renak_monthly_percentages: {
        Row: {
          employee_id: string | null
          month: number | null
          percent: number | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "renak_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      renak_quarterly_averages: {
        Row: {
          avg_percent: number | null
          employee_id: string | null
          quarter: number | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "renak_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      compute_quarterly_kipapp: {
        Args: { p_year: number }
        Returns: undefined
      }
      compute_quarterly_stats: {
        Args: { p_quarter: number; p_year: number }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


