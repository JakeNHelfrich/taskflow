/**
 * Mock authentication for local development
 * Provides the same API as Clerk but uses local state
 */

import { seedDatabase, db } from './in-memory-db'

// Mock user state
let currentUser: MockUser | null = null
let isAuthenticated = false

export interface MockUser {
  id: string
  firstName: string | null
  lastName: string | null
  fullName: string | null
  email: string
  imageUrl: string
}

const defaultMockUser: MockUser = {
  id: 'mock-user-1',
  firstName: 'Demo',
  lastName: 'User',
  fullName: 'Demo User',
  email: 'demo@example.com',
  imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
}

/**
 * Initialize mock auth with a default user
 */
export function initMockAuth() {
  currentUser = defaultMockUser
  isAuthenticated = true

  // Seed the database with sample data for this user
  seedDatabase(currentUser.id)

  return currentUser
}

/**
 * Sign in with mock credentials
 */
export function mockSignIn(email?: string) {
  currentUser = {
    ...defaultMockUser,
    email: email || defaultMockUser.email,
  }
  isAuthenticated = true

  // Check if user already exists, if not seed
  const existingProfile = Array.from(db.profiles.values()).find(
    (p) => p.clerk_id === currentUser!.id
  )
  if (!existingProfile) {
    seedDatabase(currentUser.id)
  }

  return currentUser
}

/**
 * Sign out
 */
export function mockSignOut() {
  currentUser = null
  isAuthenticated = false
}

/**
 * Get current mock auth state
 */
export function getMockAuthState() {
  return {
    isAuthenticated,
    isLoaded: true,
    userId: currentUser?.id ?? null,
    sessionId: isAuthenticated ? 'mock-session-1' : null,
    user: currentUser,
  }
}

/**
 * Get current mock user
 */
export function getMockUser() {
  return currentUser
}

/**
 * Hook replacement for useAuth
 */
export function useMockAuth() {
  const state = getMockAuthState()

  return {
    isLoaded: true,
    isAuthLoaded: true,
    isUserLoaded: true,
    isSignedIn: state.isAuthenticated,
    userId: state.userId,
    sessionId: state.sessionId,
    user: state.user,
    fullName: state.user?.fullName ?? null,
    firstName: state.user?.firstName ?? null,
    lastName: state.user?.lastName ?? null,
    email: state.user?.email ?? null,
    imageUrl: state.user?.imageUrl ?? null,
    getToken: async () => 'mock-token',
    signOut: () => {
      mockSignOut()
      window.location.href = '/sign-in'
    },
  }
}

/**
 * Server-side mock auth
 */
export async function mockAuth() {
  return getMockAuthState()
}

/**
 * Get authenticated user for server functions
 */
export async function getMockAuthenticatedUser() {
  const state = getMockAuthState()

  if (!state.isAuthenticated || !state.user) {
    throw new Error('Not authenticated')
  }

  return {
    userId: state.userId!,
    sessionId: state.sessionId!,
    user: {
      id: state.user.id,
      firstName: state.user.firstName,
      lastName: state.user.lastName,
      fullName: state.user.fullName,
      email: state.user.email,
      imageUrl: state.user.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }
}
