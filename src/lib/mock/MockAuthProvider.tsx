/**
 * Mock Auth Provider for local development
 * Provides the same context API as Clerk but uses mock state
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { initMockAuth, getMockAuthState, mockSignOut, type MockUser } from './mock-auth'

interface MockAuthContextValue {
  isLoaded: boolean
  isSignedIn: boolean
  userId: string | null
  user: MockUser | null
  signOut: () => void
}

const MockAuthContext = createContext<MockAuthContextValue | null>(null)

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<{
    isLoaded: boolean
    isAuthenticated: boolean
    userId: string | null
    user: MockUser | null
  }>({
    isLoaded: false,
    isAuthenticated: false,
    userId: null,
    user: null,
  })

  useEffect(() => {
    // Initialize mock auth on mount
    initMockAuth()
    const state = getMockAuthState()
    setAuthState({
      isLoaded: true,
      isAuthenticated: state.isAuthenticated,
      userId: state.userId,
      user: state.user,
    })
  }, [])

  const signOut = () => {
    mockSignOut()
    setAuthState({
      isLoaded: true,
      isAuthenticated: false,
      userId: null,
      user: null,
    })
    window.location.href = '/sign-in'
  }

  return (
    <MockAuthContext.Provider
      value={{
        isLoaded: authState.isLoaded,
        isSignedIn: authState.isAuthenticated,
        userId: authState.userId,
        user: authState.user,
        signOut,
      }}
    >
      {children}
    </MockAuthContext.Provider>
  )
}

export function useMockAuthContext() {
  const context = useContext(MockAuthContext)
  if (!context) {
    throw new Error('useMockAuthContext must be used within MockAuthProvider')
  }
  return context
}
