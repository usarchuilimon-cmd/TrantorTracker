export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            tracker_action_items: {
                Row: {
                    assigned_to: string
                    created_at: string
                    due_date: string
                    id: string
                    is_critical: boolean
                    organization_id: string | null
                    status: string | null
                    task: string
                }
                Insert: {
                    assigned_to: string
                    created_at?: string
                    due_date: string
                    id?: string
                    is_critical: boolean
                    organization_id?: string | null
                    status?: string | null
                    task: string
                }
                Update: {
                    assigned_to?: string
                    created_at?: string
                    due_date?: string
                    id?: string
                    is_critical?: boolean
                    organization_id?: string | null
                    status?: string | null
                    task?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_action_items_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_custom_developments: {
                Row: {
                    created_at: string
                    delivery_date: string
                    description: string
                    id: string
                    organization_id: string | null
                    requested_by: string
                    status: string
                    title: string
                }
                Insert: {
                    created_at?: string
                    delivery_date: string
                    description: string
                    id?: string
                    organization_id?: string | null
                    requested_by: string
                    status: string
                    title: string
                }
                Update: {
                    created_at?: string
                    delivery_date?: string
                    description?: string
                    id?: string
                    organization_id?: string | null
                    requested_by?: string
                    status?: string
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_custom_developments_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_faqs: {
                Row: {
                    answer: string
                    category: string
                    created_at: string
                    id: string
                    question: string
                }
                Insert: {
                    answer: string
                    category: string
                    created_at?: string
                    id?: string
                    question: string
                }
                Update: {
                    answer?: string
                    category?: string
                    created_at?: string
                    id?: string
                    question?: string
                }
                Relationships: []
            }
            tracker_invitations: {
                Row: {
                    created_at: string
                    email: string
                    id: string
                    organization_id: string | null
                    role: Database["public"]["Enums"]["user_role"]
                    status: string
                }
                Insert: {
                    created_at?: string
                    email: string
                    id?: string
                    organization_id?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    status?: string
                }
                Update: {
                    created_at?: string
                    email?: string
                    id?: string
                    organization_id?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    status?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_invitations_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    }
                ]
            }
            tracker_module_features: {
                Row: {
                    created_at: string
                    id: string
                    module_id: string | null
                    name: string
                    status: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    module_id?: string | null
                    name: string
                    status: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    module_id?: string | null
                    name?: string
                    status?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_module_features_module_id_fkey"
                        columns: ["module_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_modules"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_modules: {
                Row: {
                    created_at: string
                    description: string
                    icon: string
                    id: string
                    name: string
                    organization_id: string | null
                    owner: string
                    progress: number | null
                    status: string
                    responsibles: string | null
                }
                Insert: {
                    created_at?: string
                    description: string
                    icon: string
                    id?: string
                    name: string
                    organization_id?: string | null
                    owner: string
                    progress?: number | null
                    status: string
                    responsibles?: string | null
                }
                Update: {
                    created_at?: string
                    description?: string
                    icon?: string
                    id?: string
                    name?: string
                    organization_id?: string | null
                    owner?: string
                    progress?: number | null
                    status?: string
                    responsibles?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_modules_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_organizations: {
                Row: {
                    created_at: string
                    id: string
                    name: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    name: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    name?: string
                }
                Relationships: []
            }
            tracker_profiles: {
                Row: {
                    created_at: string
                    full_name: string | null
                    id: string
                    organization_id: string | null
                    role: Database["public"]["Enums"]["user_role"]
                }
                Insert: {
                    created_at?: string
                    full_name?: string | null
                    id: string
                    organization_id?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                }
                Update: {
                    created_at?: string
                    full_name?: string | null
                    id?: string
                    organization_id?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_profiles_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_ticket_updates: {
                Row: {
                    author: string
                    created_at: string
                    date: string
                    id: string
                    message: string
                    ticket_id: string | null
                    type: string
                }
                Insert: {
                    author: string
                    created_at?: string
                    date: string
                    id?: string
                    message: string
                    ticket_id?: string | null
                    type: string
                }
                Update: {
                    author?: string
                    created_at?: string
                    date?: string
                    id?: string
                    message?: string
                    ticket_id?: string | null
                    type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_ticket_updates_ticket_id_fkey"
                        columns: ["ticket_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_tickets"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_tickets: {
                Row: {
                    created_at: string | null
                    description: string
                    id: string
                    module_id: string | null
                    module_name: string
                    organization_id: string | null
                    priority: string
                    requester: string
                    status: string
                    title: string
                    updated_at: string
                }
                Insert: {
                    created_at?: string | null
                    description: string
                    id?: string
                    module_id?: string | null
                    module_name: string
                    organization_id?: string | null
                    priority: string
                    requester: string
                    status: string
                    title: string
                    updated_at: string
                }
                Update: {
                    created_at?: string | null
                    description?: string
                    id?: string
                    module_id?: string | null
                    module_name?: string
                    organization_id?: string | null
                    priority?: string
                    requester?: string
                    status?: string
                    title?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_tickets_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_timeline_events: {
                Row: {
                    created_at: string
                    date_range: string
                    description: string
                    id: string
                    modules_included: string[] | null
                    organization_id: string | null
                    phase: string
                    status: string
                }
                Insert: {
                    created_at?: string
                    date_range: string
                    description: string
                    id?: string
                    modules_included?: string[] | null
                    organization_id?: string | null
                    phase: string
                    status: string
                }
                Update: {
                    created_at?: string
                    date_range?: string
                    description?: string
                    id?: string
                    modules_included?: string[] | null
                    organization_id?: string | null
                    phase?: string
                    status?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_timeline_events_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_timeline_tasks: {
                Row: {
                    created_at: string
                    id: string
                    status: string
                    timeline_event_id: string | null
                    title: string
                    week: string | null
                }
                Insert: {
                    created_at?: string
                    id?: string
                    status: string
                    timeline_event_id?: string | null
                    title: string
                    week?: string | null
                }
                Update: {
                    created_at?: string
                    id?: string
                    status?: string
                    timeline_event_id?: string | null
                    title?: string
                    week?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_timeline_tasks_timeline_event_id_fkey"
                        columns: ["timeline_event_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_timeline_events"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_tutorials: {
                Row: {
                    created_at: string
                    duration: string
                    id: string
                    thumbnail_color: string
                    title: string
                    type: string
                }
                Insert: {
                    created_at?: string
                    duration: string
                    id?: string
                    thumbnail_color: string
                    title: string
                    type: string
                }
                Update: {
                    created_at?: string
                    duration?: string
                    id?: string
                    thumbnail_color?: string
                    title?: string
                    type?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_my_org_id: {
                Args: Record<PropertyKey, never>
                Returns: string
            }
            get_my_role: {
                Args: Record<PropertyKey, never>
                Returns: Database["public"]["Enums"]["user_role"]
            }
        }
        Enums: {
            user_role: "SUPER_ADMIN" | "ORG_ADMIN" | "CLIENT_USER"
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
