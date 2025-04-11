import { PostgrestError } from '@supabase/supabase-js'

export class SupabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: string,
    public hint?: string
  ) {
    super(message)
    this.name = 'SupabaseError'
  }
}

export function handleSupabaseError(error: PostgrestError): never {
  throw new SupabaseError(
    error.message,
    error.code,
    error.details,
    error.hint
  )
}

export function isSupabaseError(error: unknown): error is SupabaseError {
  return error instanceof SupabaseError
}

export function handleError(error: unknown): never {
  if (isSupabaseError(error)) {
    throw error
  }
  
  if (error instanceof Error) {
    throw new SupabaseError(
      error.message,
      'UNKNOWN_ERROR',
      error.stack
    )
  }

  throw new SupabaseError(
    'An unknown error occurred',
    'UNKNOWN_ERROR'
  )
} 