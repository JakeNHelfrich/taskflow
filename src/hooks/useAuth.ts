import {
  useAuth as useClerkAuth,
  useUser as useClerkUser,
} from '@clerk/tanstack-react-start'
import { USE_MOCKS, useMockAuth } from '@/lib/mock'

/**
 * Custom auth hook that wraps Clerk's useAuth and useUser hooks.
 * In mock mode, uses the mock auth provider instead.
 * Provides a unified interface for accessing authentication state and user data.
 */
export function useAuth() {
  // In mock mode, use the mock auth hook
  if (USE_MOCKS) {
    return useMockAuth()
  }

  // Production: use Clerk
  const {
    isLoaded: isAuthLoaded,
    isSignedIn,
    userId,
    sessionId,
    getToken,
    signOut,
  } = useClerkAuth()

  const { isLoaded: isUserLoaded, user } = useClerkUser()

  /**
   * Check if both auth and user data are fully loaded
   */
  const isLoaded = isAuthLoaded && isUserLoaded

  /**
   * Get the current user's full name
   */
  const fullName = user?.fullName ?? null

  /**
   * Get the current user's first name
   */
  const firstName = user?.firstName ?? null

  /**
   * Get the current user's last name
   */
  const lastName = user?.lastName ?? null

  /**
   * Get the current user's primary email address
   */
  const email = user?.primaryEmailAddress?.emailAddress ?? null

  /**
   * Get the current user's profile image URL
   */
  const imageUrl = user?.imageUrl ?? null

  return {
    // Loading states
    isLoaded,
    isAuthLoaded,
    isUserLoaded,

    // Auth state
    isSignedIn: isSignedIn ?? false,
    userId,
    sessionId,

    // User data
    user,
    fullName,
    firstName,
    lastName,
    email,
    imageUrl,

    // Actions
    getToken,
    signOut,
  }
}

/**
 * Re-export Clerk's individual hooks for cases where only specific functionality is needed
 */
export { useClerkAuth, useClerkUser }
