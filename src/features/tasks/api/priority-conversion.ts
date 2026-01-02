import type { TaskPriority } from '../types'

// DB uses: 0 = none/default, 1 = low, 2 = medium, 3 = high, 4 = urgent
const priorityToNumber: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
}

const numberToPriority: Record<number, TaskPriority> = {
  0: 'low',
  1: 'low',
  2: 'medium',
  3: 'high',
  4: 'urgent',
}

export function priorityToDb(priority: TaskPriority): number {
  return priorityToNumber[priority]
}

export function priorityFromDb(dbPriority: number): TaskPriority {
  return numberToPriority[dbPriority] ?? 'low'
}
