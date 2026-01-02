import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">TaskFlow</h1>
        <p className="text-xl text-slate-300 mb-8">
          Your personal productivity hub
        </p>
        <div className="space-x-4">
          <a
            href="/sign-in"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
          <a
            href="/sign-up"
            className="inline-block px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  )
}
