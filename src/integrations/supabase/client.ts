import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

function isValidHttpUrl(value?: string): value is string {
  if (!value) return false
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

// Prefer environment variables (Vite: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Fallback to known working project credentials if env not configured
if (!isValidHttpUrl(supabaseUrl) || !supabaseAnonKey) {
  console.warn('[Supabase] Using fallback credentials. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env for production.')
  supabaseUrl = 'https://sgslrxsbyxkvtugbllbd.supabase.co'
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnc2xyeHNieXhrdnR1Z2JsbGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mjg0MTYsImV4cCI6MjA3NTUwNDQxNn0.7CfuCjbwZSabmfw9XRqvFv199TUIcixnbjA5F0wpmcM'
}

export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!)