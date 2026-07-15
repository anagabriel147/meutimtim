import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'client' | 'supplier' | 'advisor' | 'admin'

export type Profile = {
  id: string
  role: UserRole
  full_name: string
  phone: string | null
  city: string | null
  avatar_url: string | null
  bio: string | null
  verified: boolean
  subscription_plan: 'free' | 'supplier_pro' | 'advisor_pro'
  subscription_expires_at: string | null
  created_at: string
  updated_at: string
}
