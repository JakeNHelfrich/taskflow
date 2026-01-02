import type { Task } from '@/features/tasks/types'

export interface TimeBlock {
  id: string
  user_id: string
  title: string | null
  date: string
  start_time: string
  end_time: string
  color: string
  created_at: string
  updated_at: string
  // Joined relations
  tasks?: Task[]
}

export interface CreateTimeBlockInput {
  title?: string | null
  date: string
  start_time: string
  end_time: string
  color?: string
}

export interface UpdateTimeBlockInput {
  title?: string | null
  date?: string
  start_time?: string
  end_time?: string
  color?: string
}

export interface CalendarDay {
  date: Date
  timeBlocks: TimeBlock[]
  tasks: Task[]
  isToday: boolean
  isSelected: boolean
}

export type CalendarView = 'day' | 'week' | 'month'
