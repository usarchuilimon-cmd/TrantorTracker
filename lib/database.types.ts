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
            tracker_action_items: {
                Row: {
                    assigned_to: string
                    due_date: string | null
                    id: string
                    is_critical: boolean | null
                    status: string | null
                    task: string
                }
                Insert: {
                    assigned_to: string
                    due_date?: string | null
                    id: string
                    is_critical?: boolean | null
                    status?: string | null
                    task: string
                }
                Update: {
                    assigned_to?: string
                    due_date?: string | null
                    id?: string
                    is_critical?: boolean | null
                    status?: string | null
                    task?: string
                }
                Relationships: []
            }
            tracker_custom_developments: {
                Row: {
                    delivery_date: string | null
                    description: string | null
                    id: string
                    requested_by: string
                    status: string
                    title: string
                }
                Insert: {
                    delivery_date?: string | null
                    description?: string | null
                    id: string
                    requested_by: string
                    status: string
                    title: string
                }
                Update: {
                    delivery_date?: string | null
                    description?: string | null
                    id?: string
                    requested_by?: string
                    status?: string
                    title?: string
                }
                Relationships: []
            }
            tracker_faqs: {
                Row: {
                    answer: string
                    category: string
                    id: string
                    question: string
                }
                Insert: {
                    answer: string
                    category: string
                    id: string
                    question: string
                }
                Update: {
                    answer?: string
                    category?: string
                    id?: string
                    question?: string
                }
                Relationships: []
            }
            tracker_module_features: {
                Row: {
                    id: string
                    module_id: string | null
                    name: string
                    status: string
                }
                Insert: {
                    id?: string
                    module_id?: string | null
                    name: string
                    status: string
                }
                Update: {
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
                    }
                ]
            }
            tracker_modules: {
                Row: {
                    description: string | null
                    icon: string | null
                    id: string
                    name: string
                    owner: string | null
                    progress: number | null
                    status: string
                }
                Insert: {
                    description?: string | null
                    icon?: string | null
                    id: string
                    name: string
                    owner?: string | null
                    progress?: number | null
                    status: string
                }
                Update: {
                    description?: string | null
                    icon?: string | null
                    id?: string
                    name?: string
                    owner?: string | null
                    progress?: number | null
                    status?: string
                }
                Relationships: []
            }
            tracker_ticket_updates: {
                Row: {
                    author: string
                    date: string | null
                    id: string
                    message: string
                    ticket_id: string | null
                    type: string
                }
                Insert: {
                    author: string
                    date?: string | null
                    id?: string
                    message: string
                    ticket_id?: string | null
                    type: string
                }
                Update: {
                    author?: string
                    date?: string | null
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
                    }
                ]
            }
            tracker_tickets: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    module_id: string | null
                    module_name: string | null
                    priority: string
                    requester: string
                    status: string
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id: string
                    module_id?: string | null
                    module_name?: string | null
                    priority: string
                    requester: string
                    status: string
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    module_id?: string | null
                    module_name?: string | null
                    priority?: string
                    requester?: string
                    status?: string
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_tickets_module_id_fkey"
                        columns: ["module_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_modules"
                        referencedColumns: ["id"]
                    }
                ]
            }
            tracker_timeline_events: {
                Row: {
                    date_range: string | null
                    description: string | null
                    id: string
                    modules_included: string[] | null
                    phase: string
                    status: string
                }
                Insert: {
                    date_range?: string | null
                    description?: string | null
                    id: string
                    modules_included?: string[] | null
                    phase: string
                    status: string
                }
                Update: {
                    date_range?: string | null
                    description?: string | null
                    id?: string
                    modules_included?: string[] | null
                    phase?: string
                    status?: string
                }
                Relationships: []
            }
            tracker_timeline_tasks: {
                Row: {
                    id: string
                    status: string
                    timeline_event_id: string | null
                    title: string
                    week: string | null
                }
                Insert: {
                    id: string
                    status: string
                    timeline_event_id?: string | null
                    title: string
                    week?: string | null
                }
                Update: {
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
                    }
                ]
            }
            tracker_tutorials: {
                Row: {
                    duration: string | null
                    id: string
                    thumbnail_color: string | null
                    title: string
                    type: string | null
                }
                Insert: {
                    duration?: string | null
                    id: string
                    thumbnail_color?: string | null
                    title: string
                    type?: string | null
                }
                Update: {
                    duration?: string | null
                    id?: string
                    thumbnail_color?: string | null
                    title?: string
                    type?: string | null
                }
                Relationships: []
            }
            tracker_users: {
                Row: {
                    avatar: string | null
                    created_at: string | null
                    department: string
                    email: string
                    id: string
                    name: string
                    role: string
                }
                Insert: {
                    avatar?: string | null
                    created_at?: string | null
                    department: string
                    email: string
                    id?: string
                    name: string
                    role: string
                }
                Update: {
                    avatar?: string | null
                    created_at?: string | null
                    department?: string
                    email?: string
                    id?: string
                    name?: string
                    role?: string
                }
                Relationships: []
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
            [_ in never]: never
        }
    }
}
