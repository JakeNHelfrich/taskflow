export const APP_NAME = 'TaskFlow'

export const PRIORITY_COLORS = {
  low: '#6B7280', // gray-500
  medium: '#3B82F6', // blue-500
  high: '#F59E0B', // amber-500
  urgent: '#EF4444', // red-500
} as const

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
} as const

export const STATUS_LABELS = {
  inbox: 'Inbox',
  scheduled: 'Scheduled',
  completed: 'Completed',
  archived: 'Archived',
} as const

export const DEFAULT_PROJECT_COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#F59E0B', // amber
  '#84CC16', // lime
  '#22C55E', // green
  '#14B8A6', // teal
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#A855F7', // purple
  '#EC4899', // pink
] as const

export const DEFAULT_LABEL_COLORS = [
  '#6B7280', // gray
  '#EF4444', // red
  '#F59E0B', // amber
  '#22C55E', // green
  '#3B82F6', // blue
  '#8B5CF6', // violet
] as const

export const FOCUS_DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '25 min', value: 25 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
  { label: '90 min', value: 90 },
] as const

export const KEYBOARD_SHORTCUTS = {
  commandPalette: { key: 'k', mod: true, label: 'Command Palette' },
  quickAdd: { key: 'q', mod: false, label: 'Quick Add Task' },
  newTask: { key: 'n', mod: false, label: 'New Task' },
  focusMode: { key: 'f', mod: false, label: 'Focus Mode' },
  goToInbox: { key: 'g then i', mod: false, label: 'Go to Inbox' },
  goToToday: { key: 'g then t', mod: false, label: 'Go to Today' },
  goToCalendar: { key: 'g then c', mod: false, label: 'Go to Calendar' },
  goToHabits: { key: 'g then h', mod: false, label: 'Go to Habits' },
} as const
