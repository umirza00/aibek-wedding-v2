import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

// Enhanced client with better error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Utility function to test database connection
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('web_content')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection test failed:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Database connection test successful')
    return { success: true, data }
  } catch (err) {
    console.error('Database connection test error:', err)
    return { success: false, error: String(err) }
  }
}

// Enhanced logging for API calls
export const logSupabaseCall = (operation: string, table: string, data?: any) => {
  console.log(`[SUPABASE] ${operation.toUpperCase()} ${table}:`, {
    timestamp: new Date().toISOString(),
    operation,
    table,
    data
  })
}
export interface RSVPData {
  id?: string
  guest_name: string
  email: string
  phone?: string
  attendance: 'yes' | 'no' | 'maybe'
  number_of_guests: number
  dietary_restrictions?: string
  message?: string
  created_at?: string
}