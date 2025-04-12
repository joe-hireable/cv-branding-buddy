import { createClient } from '@supabase/supabase-js'

declare const __VITE_SUPABASE_URL__: string
declare const __VITE_SUPABASE_ANON_KEY__: string

const supabaseUrl = __VITE_SUPABASE_URL__
const supabaseAnonKey = __VITE_SUPABASE_ANON_KEY__

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseAnonKey ? '[EXISTS]' : '[MISSING]')

// Create a Supabase client for auth checks
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/candidates', '/settings']
const authRoutes = ['/login', '/signup', '/forgot-password']

// Function to check if a path is protected
export function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(route => path.startsWith(route))
}

// Function to check if a path is an auth route
export function isAuthRoute(path: string): boolean {
  return authRoutes.some(route => path.startsWith(route))
}

// Function to check authentication status
export async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Function to handle protected route access
export async function handleProtectedRoute(path: string) {
  const session = await checkAuth()
  
  if (isProtectedRoute(path) && !session) {
    // Redirect to login if accessing protected route without session
    window.location.href = `/login?redirectedFrom=${encodeURIComponent(path)}`
    return false
  }

  if (isAuthRoute(path) && session) {
    // Redirect to dashboard if accessing auth route with active session
    window.location.href = '/dashboard'
    return false
  }

  return true
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 