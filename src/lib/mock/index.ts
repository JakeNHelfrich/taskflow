/**
 * Mock providers for local development
 *
 * Usage:
 * Set VITE_USE_MOCKS=true in .env.local to use mock implementations
 */

export * from './in-memory-db'
export * from './mock-supabase'
export * from './mock-auth'
export * from './MockAuthProvider'

// Check if mocks should be used
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

// Re-export appropriate clients based on mode
import { createMockSupabaseClient } from './mock-supabase'
import { getSupabaseBrowserClient as getRealSupabaseBrowserClient } from '../supabase/client'

export function getClient() {
  if (USE_MOCKS) {
    return createMockSupabaseClient()
  }
  return getRealSupabaseBrowserClient()
}
