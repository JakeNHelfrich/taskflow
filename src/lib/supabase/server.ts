import { createServerClient } from '@supabase/ssr'
import { getCookie, setCookie } from 'vinxi/http'
import type { Database } from '@/types/database.types'

/**
 * Get a Supabase client for use in server functions (loaders, actions, API routes).
 * This handles cookie management for TanStack Start using vinxi/http.
 *
 * Note: This function must be called within a server context where
 * vinxi/http cookie functions are available.
 */
export function getSupabaseServerClient() {
  return createServerClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Get all cookies by checking for known Supabase cookie names
          const cookieNames = [
            'sb-access-token',
            'sb-refresh-token',
          ]

          const cookies: { name: string; value: string }[] = []

          for (const name of cookieNames) {
            const value = getCookie(name)
            if (value) {
              cookies.push({ name, value })
            }
          }

          // Also check for the auth token cookie pattern
          const authTokenCookie = getCookie('sb-auth-token')
          if (authTokenCookie) {
            cookies.push({ name: 'sb-auth-token', value: authTokenCookie })
          }

          return cookies
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            setCookie(name, value, {
              ...options,
              // Ensure secure defaults for auth cookies
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            })
          }
        },
      },
    }
  )
}

/**
 * Get a Supabase admin client with service role key.
 * Use this only for server-side operations that need to bypass RLS.
 *
 * WARNING: This client bypasses Row Level Security!
 * Only use for admin operations like user management.
 */
export function getSupabaseAdminClient() {
  return createServerClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // Admin client doesn't need to set cookies
        },
      },
    }
  )
}
