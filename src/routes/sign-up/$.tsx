import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/tanstack-react-start'

export const Route = createFileRoute('/sign-up/$')({
  component: SignUpCatchAll,
})

function SignUpCatchAll() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/today"
      />
    </div>
  )
}
