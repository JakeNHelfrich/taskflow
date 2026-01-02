import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SignIn } from '@clerk/tanstack-react-start'
import { USE_MOCKS, mockSignIn } from '@/lib/mock'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/sign-in/')({
  component: SignInPage,
})

function MockSignIn() {
  const navigate = useNavigate()

  const handleSignIn = async () => {
    console.log('Sign in clicked, USE_MOCKS:', USE_MOCKS)
    try {
      mockSignIn()
      console.log('Mock sign in successful, navigating...')
      await navigate({ to: '/today' })
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">TaskFlow</CardTitle>
        <CardDescription>Local Development Mode</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Running in mock mode with in-memory database.
          Click below to sign in as the demo user.
        </p>
        <Button type="button" onClick={handleSignIn} className="w-full">
          Sign In as Demo User
        </Button>
      </CardContent>
    </Card>
  )
}

function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      {USE_MOCKS ? (
        <MockSignIn />
      ) : (
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/today"
        />
      )}
    </div>
  )
}
