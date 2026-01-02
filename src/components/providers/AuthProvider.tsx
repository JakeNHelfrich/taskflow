/**
 * Auth Provider that switches between Clerk and Mock auth based on environment
 */

import type { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import { MockAuthProvider } from '@/lib/mock/MockAuthProvider'
import { USE_MOCKS } from '@/lib/mock'

interface AuthProviderProps {
  children: ReactNode
}

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export function AuthProvider({ children }: AuthProviderProps) {
  if (USE_MOCKS) {
    return <MockAuthProvider>{children}</MockAuthProvider>
  }

  if (!publishableKey) {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable')
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  )
}
