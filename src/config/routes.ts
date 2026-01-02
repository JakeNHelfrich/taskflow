// Route paths as constants for type-safe navigation
export const ROUTES = {
  // Public
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',

  // Authenticated
  inbox: '/inbox',
  today: '/today',
  calendar: '/calendar',
  projects: '/projects',
  project: (id: string) => `/projects/${id}` as const,
  habits: '/habits',
  focus: '/focus',
  settings: '/settings',

  // API
  apiWebhookZapier: '/api/webhooks/zapier',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
