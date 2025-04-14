import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging
console.log('Supabase Client Configuration:', {
  url: supabaseUrl ? '[EXISTS]' : '[MISSING]',
  anonKey: supabaseAnonKey ? '[EXISTS]' : '[MISSING]',
  fullUrl: supabaseUrl,
})

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Create the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl.trim(),  // Ensure no whitespace
  supabaseAnonKey.trim(),  // Ensure no whitespace
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,  // Explicitly set storage
    },
    global: {
      headers: {
        'x-client-info': 'cv-branding-buddy',
      },
    },
  }
)

// Environment variables for API endpoints
export const PARSE_CV_ENDPOINT = import.meta.env.VITE_CV_OPTIMIZER_GCF_URL || "https://europe-west9-hireable-places.cloudfunctions.net/cv_optimizer"
export const GENERATE_CV_ENDPOINT = "" // To be populated later 