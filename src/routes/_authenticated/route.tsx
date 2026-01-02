import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { USE_MOCKS } from '@/lib/mock'
import { AppShell } from '@/components/layout'

/**
 * Server function to check authentication status (production only).
 */
const getClerkAuthState = createServerFn({ method: 'GET' }).handler(async () => {
  const { auth } = await import('@clerk/tanstack-react-start/server')
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    throw redirect({ to: '/sign-in' })
  }

  return { userId }
})

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    // In mock mode, always return mock user (dev mode - no real auth needed)
    if (USE_MOCKS) {
      return { userId: 'mock-user-1' }
    }

    // Production: use Clerk server auth
    const authState = await getClerkAuthState()
    return {
      userId: authState.userId,
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
