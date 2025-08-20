import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side Supabase client with service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          uid: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          date_of_birth: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          uid: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          date_of_birth?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          uid?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          date_of_birth?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gyms: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string
          phone: string | null
          email: string | null
          logo_url: string | null
          monthly_fee: number
          sinpe_phone: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address: string
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          monthly_fee: number
          sinpe_phone: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          monthly_fee?: number
          sinpe_phone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      gym_administrators: {
        Row: {
          id: string
          user_id: string
          gym_id: string
          role: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gym_id: string
          role?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gym_id?: string
          role?: string
          is_active?: boolean
          created_at?: string
        }
      }
      memberships: {
        Row: {
          id: string
          user_id: string
          gym_id: string
          status: 'pending_payment' | 'active' | 'expired' | 'inactive' | 'cancelled'
          start_date: string | null
          end_date: string | null
          grace_period_end: string | null
          monthly_fee: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gym_id: string
          status?: 'pending_payment' | 'active' | 'expired' | 'inactive' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          grace_period_end?: string | null
          monthly_fee: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gym_id?: string
          status?: 'pending_payment' | 'active' | 'expired' | 'inactive' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          grace_period_end?: string | null
          monthly_fee?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}