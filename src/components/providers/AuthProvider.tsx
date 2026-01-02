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

export function AuthProvider({ children }: AuthProviderProps) {
  if (USE_MOCKS) {
    return <MockAuthProvider>{children}</MockAuthProvider>
  }

  return <ClerkProvider>{children}</ClerkProvider>
}
