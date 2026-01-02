export type HabitFrequency = 'daily' | 'weekly' | 'custom'

export interface HabitFrequencyConfig {
  daysOfWeek?: number[] // 0-6, Sunday = 0
  timesPerPeriod?: number
}

export interface Habit {
  id: string
  user_id: string
  name: string
  description: string | null
  frequency: HabitFrequency
  frequency_config: HabitFrequencyConfig | null
  color: string
  icon: string | null
  target_count: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Computed fields
  currentStreak?: number
  longestStreak?: number
  completionsThisPeriod?: number
}

export interface HabitCompletion {
  id: string
  habit_id: string
  completed_date: string
  count: number
  notes: string | null
  created_at: string
}

export interface CreateHabitInput {
  name: string
  description?: string | null
  frequency?: HabitFrequency
  frequency_config?: HabitFrequencyConfig | null
  color?: string
  icon?: string | null
  target_count?: number
}

export interface UpdateHabitInput {
  name?: string
  description?: string | null
  frequency?: HabitFrequency
  frequency_config?: HabitFrequencyConfig | null
  color?: string
  icon?: string | null
  target_count?: number
  is_active?: boolean
}

export interface HabitWithCompletions extends Habit {
  completions: HabitCompletion[]
}
