import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://sgslrxsbyxkvtugbllbd.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnc2xyeHNieXhrdnR1Z2JsbGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mjg0MTYsImV4cCI6MjA3NTUwNDQxNn0.7CfuCjbwZSabmfw9XRqvFv199TUIcixnbjA5F0wpmcM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)