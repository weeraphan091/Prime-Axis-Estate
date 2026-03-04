import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/** Supabase client สำหรับ server (upload Storage ฯลฯ) — ใช้ Service Role Key ใน .env */
export function getSupabaseServer() {
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey)
}

export const STORAGE_BUCKET = 'property-images'
