/**
 * Clerk Configuration
 *
 * This module exports Clerk configuration settings used throughout the application.
 * Environment variables are accessed via Vite's import.meta.env.
 */

/**
 * Clerk publishable key from environment variables.
 * This key is safe to expose in client-side code.
 */
export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

/**
 * Configuration object for ClerkProvider
 */
export const clerkConfig = {
  publishableKey: clerkPublishableKey,
  /**
   * Sign-in URL for redirecting unauthenticated users
   */
  signInUrl: '/sign-in',
  /**
   * Sign-up URL for new user registration
   */
  signUpUrl: '/sign-up',
  /**
   * URL to redirect to after successful sign-in
   */
  afterSignInUrl: '/dashboard',
  /**
   * URL to redirect to after successful sign-up
   */
  afterSignUpUrl: '/dashboard',
} as const

/**
 * Route paths for authentication pages
 */
export const authRoutes = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  afterAuth: '/dashboard',
} as const
