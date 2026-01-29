
import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient, User } from '@supabase/supabase-js'
import { Database } from '../lib/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

type Profile = Database['public']['Tables']['tracker_profiles']['Row']
type Organization = Database['public']['Tables']['tracker_organizations']['Row']

interface AuthContextType {
    user: User | null
    profile: Profile | null
    organization: Organization | null
    loading: boolean
    signOut: () => Promise<void>
    isAdmin: boolean
    isClient: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [organization, setOrganization] = useState<Organization | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            } else {
                setProfile(null)
                setOrganization(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    async function fetchProfile(userId: string) {
        try {
            const { data, error } = await supabase
                .from('tracker_profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                // If profile doesn't exist (e.g. first login for admin), we might need to handle it.
                // For now, just log error.
                console.error('Error fetching profile:', error)
                setLoading(false)
            } else {
                setProfile(data)
                if (data.organization_id) {
                    fetchOrganization(data.organization_id)
                } else {
                    setLoading(false)
                }
            }
        } catch (error) {
            console.error('Unexpected error fetching profile:', error)
            setLoading(false)
        }
    }

    async function fetchOrganization(orgId: string) {
        try {
            const { data, error } = await supabase
                .from('tracker_organizations')
                .select('*')
                .eq('id', orgId)
                .single()

            if (error) {
                console.error('Error fetching organization:', error)
            } else {
                setOrganization(data)
            }
        } catch (error) {
            console.error('Unexpected error fetching organization:', error)
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        setOrganization(null)
    }

    const value = {
        user,
        profile,
        organization,
        loading,
        signOut,
        isAdmin: profile?.role === 'SUPER_ADMIN' || profile?.role === 'ORG_ADMIN', // Adjust as needed
        isClient: profile?.role === 'CLIENT_USER',
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
