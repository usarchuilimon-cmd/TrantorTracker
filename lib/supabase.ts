import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://erzuccfcabkocmopxftk.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_U_GosiZ6RbhQwMKlJiglhw_7Np-m7wj'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
