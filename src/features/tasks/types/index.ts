export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'inbox' | 'scheduled' | 'completed' | 'archived'
export type TaskFilter = 'inbox' | 'today' | 'upcoming' | 'completed' | 'all'

export interface Label {
  id: string
  name: string
  color: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  color: string
  icon: string | null
  is_archived: boolean
  sort_order: number
}

export interface Task {
  id: string
  user_id: string
  project_id: string | null
  title: string
  description: string | null
  priority: TaskPriority
  status: TaskStatus
  due_date: string | null
  due_time: string | null
  scheduled_date: string | null
  scheduled_start_time: string | null
  scheduled_end_time: string | null
  completed_at: string | null
  sort_order: number
  is_recurring: boolean
  recurrence_rule: string | null
  recurrence_parent_id: string | null
  created_at: string
  updated_at: string
  // Joined relations
  project?: Pick<Project, 'id' | 'name' | 'color'> | null
  labels?: Array<{ label: Label }>
}

export interface CreateTaskInput {
  title: string
  description?: string | null
  priority?: TaskPriority
  project_id?: string | null
  due_date?: string | null
  due_time?: string | null
  scheduled_date?: string | null
  scheduled_start_time?: string | null
  scheduled_end_time?: string | null
  is_recurring?: boolean
  recurrence_rule?: string | null
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  priority?: TaskPriority
  status?: TaskStatus
  project_id?: string | null
  due_date?: string | null
  due_time?: string | null
  scheduled_date?: string | null
  scheduled_start_time?: string | null
  scheduled_end_time?: string | null
  completed_at?: string | null
  sort_order?: number
}
