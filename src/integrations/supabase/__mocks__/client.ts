import { createClient } from '@supabase/supabase-js';
import type { AuthTokenResponsePassword } from '@supabase/supabase-js';

// Create a mock Supabase client
const mockSupabaseClient = createClient(
  'http://localhost:54321',
  'test-anon-key'
);

// Mock the client methods
jest.spyOn(mockSupabaseClient.auth, 'signInWithPassword').mockImplementation(() =>
  Promise.resolve({
    data: {
      user: null,
      session: null,
    },
    error: null,
  } as AuthTokenResponsePassword)
);

jest.spyOn(mockSupabaseClient.auth, 'signOut').mockImplementation(() =>
  Promise.resolve({ error: null })
);

export const supabase = mockSupabaseClient; 