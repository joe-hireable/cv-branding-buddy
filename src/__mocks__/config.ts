export const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL || 'https://test-supabase-url.com',
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || 'test-anon-key',
  mode: 'test'
}; 