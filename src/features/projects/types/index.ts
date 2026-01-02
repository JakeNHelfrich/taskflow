export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  icon: string | null
  is_archived: boolean
  sort_order: number
  created_at: string
  updated_at: string
  // Computed
  taskCount?: number
}

export interface CreateProjectInput {
  name: string
  description?: string | null
  color?: string
  icon?: string | null
}

export interface UpdateProjectInput {
  name?: string
  description?: string | null
  color?: string
  icon?: string | null
  is_archived?: boolean
  sort_order?: number
}
