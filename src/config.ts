// Configuration for both test and browser environments
const getConfig = () => {
  // Handle test environment
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return {
      supabaseUrl: process.env.VITE_SUPABASE_URL || 'https://test-supabase-url.com',
      supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || 'test-anon-key',
      mode: 'test'
    }
  }

  // Handle browser environment
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    mode: import.meta.env.MODE || 'development'
  }
}

export const config = getConfig();

// Log config in development mode
if (import.meta.env.DEV) {
  console.log('Config loaded:', {
    mode: config.mode,
    supabaseUrl: config.supabaseUrl ? '[EXISTS]' : '[MISSING]',
    supabaseAnonKey: config.supabaseAnonKey ? '[EXISTS]' : '[MISSING]'
  });
} 