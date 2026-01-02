// Client-side environment variables (must be prefixed with VITE_)
export const env = {
  // Clerk
  clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string,

  // Supabase
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,

  // App
  appUrl: import.meta.env.VITE_APP_URL as string || 'http://localhost:3000',

  // Environment
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const

// Validate required environment variables
export function validateEnv() {
  const required = [
    'clerkPublishableKey',
    'supabaseUrl',
    'supabaseAnonKey',
  ] as const

  const missing = required.filter((key) => !env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
}
