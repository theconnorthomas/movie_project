import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for film distribution
export interface Film {
  id: string
  title: string
  director: string
  genre: string
  release_year: number
  duration_minutes: number
  description: string
  status: 'draft' | 'in_distribution' | 'distributed' | 'archived'
  budget: number
  revenue: number
  created_at: string
  updated_at: string
  user_id: string
}

export interface Distribution {
  id: string
  film_id: string
  distributor_name: string
  territory: string
  distribution_type: 'theatrical' | 'streaming' | 'digital' | 'home_video'
  start_date: string
  end_date: string
  revenue_share: number
  guaranteed_minimum: number
  status: 'negotiating' | 'signed' | 'active' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string
  role: 'producer' | 'distributor' | 'sales_agent' | 'admin'
  created_at: string
}