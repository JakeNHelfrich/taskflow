import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

/**
 * Create an authenticated Supabase client with a Clerk JWT token.
 * This allows RLS policies to access the user's Clerk ID via clerk_user_id().
 */
export function createAuthenticatedClient(accessToken: string) {
  return createBrowserClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  )
}
