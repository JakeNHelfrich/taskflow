import type { TaskPriority } from '../types'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '@/config/constants'

export function getPriorityColor(priority: TaskPriority): string {
  return PRIORITY_COLORS[priority]
}

export function getPriorityLabel(priority: TaskPriority): string {
  return PRIORITY_LABELS[priority]
}

export function getPriorityValue(priority: TaskPriority): number {
  const values: Record<TaskPriority, number> = {
    low: 1,
    medium: 2,
    high: 3,
    urgent: 4,
  }
  return values[priority]
}

export function sortByPriority<T extends { priority: TaskPriority }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const diff = getPriorityValue(a.priority) - getPriorityValue(b.priority)
    return order === 'desc' ? -diff : diff
  })
}
