import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute
        gcTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
        retry: 1,
      },
      mutations: {
        onError: (error) => {
          console.error('Mutation error:', error)
        },
      },
    },
  })
}

// Create a singleton instance for the app
export const queryClient = createQueryClient()
