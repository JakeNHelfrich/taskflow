import { getClient, USE_MOCKS } from '@/lib/mock'
import { createAuthenticatedClient } from '@/lib/supabase/authenticated-client'
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types'
import { priorityToDb, priorityFromDb } from './priority-conversion'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = ReturnType<typeof getClient> & { from: (table: string) => any }

function getTypedClient(accessToken?: string): Client {
  if (USE_MOCKS) {
    return getClient() as Client
  }
  // In production, use authenticated client if token provided
  if (accessToken) {
    return createAuthenticatedClient(accessToken) as Client
  }
  return getClient() as Client
}

// Transform DB row to Task type
function transformDbTask(dbTask: Record<string, unknown>): Task {
  return {
    ...dbTask,
    priority: priorityFromDb(dbTask.priority as number),
    status: dbTask.status as Task['status'],
  } as Task
}

// Get profile UUID from Clerk ID (only needed for inserts in real Supabase)
// Creates a profile if it doesn't exist yet
async function getProfileId(clerkUserId: string, accessToken?: string): Promise<string> {
  if (USE_MOCKS) {
    // In mock mode, the userId is already the profile ID
    return clerkUserId
  }

  const client = getTypedClient(accessToken)

  // First try to get existing profile
  const { data: existingProfile } = await client
    .from('profiles')
    .select('id')
    .eq('clerk_id', clerkUserId)
    .limit(1)

  if (existingProfile && existingProfile.length > 0) {
    return existingProfile[0].id
  }

  // Profile doesn't exist, create one
  const { data: newProfile, error: insertError } = await client
    .from('profiles')
    .insert({
      clerk_id: clerkUserId,
      email: `${clerkUserId}@placeholder.local`, // Placeholder, webhook should update
    })
    .select('id')
    .single()

  if (insertError) {
    throw new Error(`Failed to create profile: ${insertError.message}`)
  }

  return newProfile.id
}

// Fetch all tasks for user
// Note: In production, RLS handles user filtering via JWT
export async function fetchTasks(userId: string, accessToken?: string): Promise<Task[]> {
  const client = getTypedClient(accessToken)

  let query = client.from('tasks').select('*')

  // In mock mode, we need to filter by user_id manually
  // In production, RLS handles this automatically
  if (USE_MOCKS) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.order('sort_order', { ascending: true })

  if (error) throw error
  return (data || []).map(transformDbTask)
}

// Fetch inbox tasks (no scheduled_date, not completed)
export async function fetchInboxTasks(userId: string, accessToken?: string): Promise<Task[]> {
  const client = getTypedClient(accessToken)

  let query = client.from('tasks').select('*')

  if (USE_MOCKS) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
    .is('scheduled_date', null)
    .neq('status', 'completed')
    .neq('status', 'cancelled')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data || []).map(transformDbTask)
}

// Fetch tasks for today
export async function fetchTodayTasks(userId: string, accessToken?: string): Promise<Task[]> {
  const client = getTypedClient(accessToken)
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  let query = client.from('tasks').select('*')

  if (USE_MOCKS) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
    .eq('scheduled_date', today)
    .neq('status', 'cancelled')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data || []).map(transformDbTask)
}

// Create task
export async function createTask(
  userId: string,
  input: CreateTaskInput,
  accessToken?: string
): Promise<Task> {
  const client = getTypedClient(accessToken)

  // Get the profile UUID for the user_id column
  const profileId = await getProfileId(userId, accessToken)

  const taskData = {
    user_id: profileId,
    title: input.title,
    description: input.description ?? null,
    priority: input.priority ? priorityToDb(input.priority) : 0,
    status: 'pending',
    project_id: input.project_id ?? null,
    due_date: input.due_date ?? null,
    due_time: input.due_time ?? null,
    scheduled_date: input.scheduled_date ?? null,
    scheduled_start_time: input.scheduled_start_time ?? null,
    scheduled_end_time: input.scheduled_end_time ?? null,
    is_recurring: input.is_recurring ?? false,
    recurrence_rule: input.recurrence_rule ?? null,
    sort_order: 0, // Default order; tasks ordered by created_at
  }

  const { data, error } = await client
    .from('tasks')
    .insert(taskData)
    .select()
    .single()

  if (error) throw error
  return transformDbTask(data)
}

// Update task
export async function updateTask(
  taskId: string,
  input: UpdateTaskInput,
  accessToken?: string
): Promise<Task> {
  const client = getTypedClient(accessToken)

  const updateData: Record<string, unknown> = { ...input }
  if (input.priority !== undefined) {
    updateData.priority = priorityToDb(input.priority)
  }

  const { data, error } = await client
    .from('tasks')
    .update(updateData)
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error
  return transformDbTask(data)
}

// Delete task
export async function deleteTask(taskId: string, accessToken?: string): Promise<void> {
  const client = getTypedClient(accessToken)
  const { error } = await client.from('tasks').delete().eq('id', taskId)

  if (error) throw error
}

// Complete/uncomplete task
export async function toggleTaskComplete(
  taskId: string,
  completed: boolean,
  accessToken?: string
): Promise<Task> {
  return updateTask(taskId, {
    status: completed ? 'completed' : 'pending',
    completed_at: completed ? new Date().toISOString() : null,
  }, accessToken)
}
