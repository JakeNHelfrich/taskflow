import { auth, clerkClient } from '@clerk/tanstack-react-start/server'
import { redirect } from '@tanstack/react-router'

/**
 * Error thrown when a user is not authenticated
 */
export class UnauthenticatedError extends Error {
  constructor(message = 'User is not authenticated') {
    super(message)
    this.name = 'UnauthenticatedError'
  }
}

/**
 * Authenticated user data returned from getAuthenticatedUser
 */
export interface AuthenticatedUser {
  userId: string
  sessionId: string
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    fullName: string | null
    email: string | null
    imageUrl: string
    createdAt: Date
    updatedAt: Date
  }
}

/**
 * Get the authenticated user from a server function or API route.
 * Throws a redirect to /sign-in if the user is not authenticated.
 *
 * @example
 * ```ts
 * const serverFn = createServerFn({ method: 'GET' }).handler(async () => {
 *   const { user, userId } = await getAuthenticatedUser()
 *   // ... use authenticated user data
 * })
 * ```
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  const { isAuthenticated, userId, sessionId } = await auth()

  if (!isAuthenticated || !userId || !sessionId) {
    throw redirect({ to: '/sign-in' })
  }

  const client = await clerkClient()
  const backendUser = await client.users.getUser(userId)

  return {
    userId,
    sessionId,
    user: {
      id: backendUser.id,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      fullName:
        backendUser.firstName && backendUser.lastName
          ? `${backendUser.firstName} ${backendUser.lastName}`
          : backendUser.firstName || backendUser.lastName || null,
      email: backendUser.emailAddresses[0]?.emailAddress ?? null,
      imageUrl: backendUser.imageUrl,
      createdAt: new Date(backendUser.createdAt),
      updatedAt: new Date(backendUser.updatedAt),
    },
  }
}

/**
 * Get the authenticated user ID from a server function or API route.
 * A lighter-weight alternative to getAuthenticatedUser when you only need the userId.
 * Throws a redirect to /sign-in if the user is not authenticated.
 *
 * @example
 * ```ts
 * const serverFn = createServerFn({ method: 'GET' }).handler(async () => {
 *   const userId = await getAuthenticatedUserId()
 *   // ... use userId for database queries
 * })
 * ```
 */
export async function getAuthenticatedUserId(): Promise<string> {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    throw redirect({ to: '/sign-in' })
  }

  return userId
}

/**
 * Check if the current request is authenticated without throwing.
 * Useful for conditional logic where you don't want to redirect.
 *
 * @example
 * ```ts
 * const serverFn = createServerFn({ method: 'GET' }).handler(async () => {
 *   const authState = await checkAuth()
 *   if (authState.isAuthenticated) {
 *     // Handle authenticated user
 *   } else {
 *     // Handle anonymous user
 *   }
 * })
 * ```
 */
export async function checkAuth(): Promise<{
  isAuthenticated: boolean
  userId: string | null
  sessionId: string | null
}> {
  const { isAuthenticated, userId, sessionId } = await auth()

  return {
    isAuthenticated: isAuthenticated ?? false,
    userId: userId ?? null,
    sessionId: sessionId ?? null,
  }
}
