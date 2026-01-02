import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { USE_MOCKS } from '@/lib/mock'
import {
  fetchTasks,
  fetchInboxTasks,
  fetchTodayTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
} from '../api'
import type { CreateTaskInput, UpdateTaskInput, Task } from '../types'

// Query keys factory
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filter: string) => [...taskKeys.lists(), filter] as const,
  detail: (id: string) => [...taskKeys.all, 'detail', id] as const,
}

// Helper to get Supabase token from Clerk
async function getSupabaseToken(getToken: (opts?: { template?: string }) => Promise<string | null>): Promise<string | undefined> {
  if (USE_MOCKS) return undefined
  // Get token with Supabase template (configured in Clerk Dashboard)
  const token = await getToken({ template: 'supabase' })
  return token || undefined
}

// Fetch all tasks
export function useTasks() {
  const { userId, getToken } = useAuth()

  return useQuery({
    queryKey: taskKeys.list('all'),
    queryFn: async () => {
      const token = await getSupabaseToken(getToken)
      return fetchTasks(userId!, token)
    },
    enabled: !!userId,
  })
}

// Fetch inbox tasks
export function useInboxTasks() {
  const { userId, getToken } = useAuth()

  return useQuery({
    queryKey: taskKeys.list('inbox'),
    queryFn: async () => {
      const token = await getSupabaseToken(getToken)
      return fetchInboxTasks(userId!, token)
    },
    enabled: !!userId,
  })
}

// Fetch today's tasks
export function useTodayTasks() {
  const { userId, getToken } = useAuth()

  return useQuery({
    queryKey: taskKeys.list('today'),
    queryFn: async () => {
      const token = await getSupabaseToken(getToken)
      return fetchTodayTasks(userId!, token)
    },
    enabled: !!userId,
  })
}

// Create task mutation
export function useCreateTask() {
  const queryClient = useQueryClient()
  const { userId, getToken } = useAuth()

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const token = await getSupabaseToken(getToken)
      return createTask(userId!, input, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}

// Update task mutation
export function useUpdateTask() {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async ({ taskId, input }: { taskId: string; input: UpdateTaskInput }) => {
      const token = await getSupabaseToken(getToken)
      return updateTask(taskId, input, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}

// Delete task mutation
export function useDeleteTask() {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (taskId: string) => {
      const token = await getSupabaseToken(getToken)
      return deleteTask(taskId, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}

// Toggle complete mutation with optimistic update
export function useToggleTaskComplete() {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      const token = await getSupabaseToken(getToken)
      return toggleTaskComplete(taskId, completed, token)
    },
    onMutate: async ({ taskId, completed }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() })

      queryClient.setQueriesData<Task[]>(
        { queryKey: taskKeys.lists() },
        (old) =>
          old?.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: completed ? 'completed' : 'pending',
                  completed_at: completed ? new Date().toISOString() : null,
                }
              : task
          )
      )
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}
