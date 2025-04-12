import { useEffect } from 'react'

export function EnvDebug() {
  useEffect(() => {
    console.log('Environment variables in component:', {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '[EXISTS]' : '[MISSING]',
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '[EXISTS]' : '[MISSING]'
    })
  }, [])

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '20px', borderRadius: '4px' }}>
      <h3>Environment Variables Debug</h3>
      <pre>
        {JSON.stringify({
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '[EXISTS]' : '[MISSING]',
          VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '[EXISTS]' : '[MISSING]'
        }, null, 2)}
      </pre>
    </div>
  )
} 