/**
 * In-memory database for local development without external dependencies
 */

import type {
  Profile,
  Project,
  Label,
  Task,
  TimeBlock,
  Habit,
  HabitCompletion,
  FocusSession,
} from '@/types/database.types'

// Generate unique IDs
let idCounter = 0
export function generateId(): string {
  return `mock-${Date.now()}-${++idCounter}`
}

// In-memory storage
export interface InMemoryDatabase {
  profiles: Map<string, Profile>
  projects: Map<string, Project>
  labels: Map<string, Label>
  tasks: Map<string, Task>
  taskLabels: Map<string, { task_id: string; label_id: string }>
  timeBlocks: Map<string, TimeBlock>
  timeBlockTasks: Map<string, { time_block_id: string; task_id: string; sort_order: number }>
  habits: Map<string, Habit>
  habitCompletions: Map<string, HabitCompletion>
  focusSessions: Map<string, FocusSession>
}

// Create singleton database instance
function createDatabase(): InMemoryDatabase {
  return {
    profiles: new Map(),
    projects: new Map(),
    labels: new Map(),
    tasks: new Map(),
    taskLabels: new Map(),
    timeBlocks: new Map(),
    timeBlockTasks: new Map(),
    habits: new Map(),
    habitCompletions: new Map(),
    focusSessions: new Map(),
  }
}

// Global database instance
export const db = createDatabase()

// Seed data for development
export function seedDatabase(userId: string) {
  const profileId = generateId()
  const now = new Date().toISOString()

  // Create profile
  db.profiles.set(profileId, {
    id: profileId,
    clerk_id: userId,
    email: 'demo@example.com',
    full_name: 'Demo User',
    avatar_url: null,
    timezone: 'UTC',
    created_at: now,
    updated_at: now,
  })

  // Create sample projects
  const projectIds = ['work', 'personal', 'learning'].map((name, index) => {
    const id = generateId()
    db.projects.set(id, {
      id,
      user_id: profileId,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      description: `${name} related tasks`,
      color: ['#3B82F6', '#22C55E', '#8B5CF6'][index]!,
      icon: null,
      is_archived: false,
      sort_order: index,
      created_at: now,
      updated_at: now,
    })
    return id
  })

  // Create sample labels
  const labelIds = ['urgent', 'meeting', 'review'].map((name, index) => {
    const id = generateId()
    db.labels.set(id, {
      id,
      user_id: profileId,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      color: ['#EF4444', '#F59E0B', '#6366F1'][index]!,
      created_at: now,
    })
    return id
  })

  // Create sample tasks
  const sampleTasks = [
    { title: 'Review project requirements', priority: 2, status: 'pending' },
    { title: 'Team standup meeting', priority: 1, status: 'pending' },
    { title: 'Write documentation', priority: 0, status: 'pending' },
    { title: 'Code review for PR #123', priority: 2, status: 'pending' },
    { title: 'Plan weekly goals', priority: 1, status: 'pending' },
  ]

  sampleTasks.forEach((task, index) => {
    const id = generateId()
    db.tasks.set(id, {
      id,
      user_id: profileId,
      project_id: projectIds[index % projectIds.length]!,
      title: task.title,
      description: null,
      priority: task.priority,
      status: task.status,
      due_date: null,
      due_time: null,
      scheduled_date: null,
      scheduled_start_time: null,
      scheduled_end_time: null,
      completed_at: null,
      sort_order: index,
      is_recurring: false,
      recurrence_rule: null,
      recurrence_parent_id: null,
      created_at: now,
      updated_at: now,
    })
  })

  // Create sample habits
  const sampleHabits = [
    { name: 'Exercise', color: '#22C55E' },
    { name: 'Read for 30 minutes', color: '#3B82F6' },
    { name: 'Meditation', color: '#8B5CF6' },
  ]

  sampleHabits.forEach((habit) => {
    const id = generateId()
    db.habits.set(id, {
      id,
      user_id: profileId,
      name: habit.name,
      description: null,
      frequency: 'daily',
      frequency_config: null,
      color: habit.color,
      icon: null,
      target_count: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    })
  })

  return { profileId, projectIds, labelIds }
}

// Reset database (useful for testing)
export function resetDatabase() {
  db.profiles.clear()
  db.projects.clear()
  db.labels.clear()
  db.tasks.clear()
  db.taskLabels.clear()
  db.timeBlocks.clear()
  db.timeBlockTasks.clear()
  db.habits.clear()
  db.habitCompletions.clear()
  db.focusSessions.clear()
}
