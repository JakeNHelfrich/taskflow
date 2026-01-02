export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface RecurrenceRule {
  frequency: RecurrenceFrequency
  interval: number // every N days/weeks/months/years
  byWeekDay?: number[] // 0-6, Sunday = 0
  byMonthDay?: number[] // 1-31
  until?: string // ISO date string
  count?: number // number of occurrences
}

export interface ParsedRRule {
  frequency: RecurrenceFrequency
  interval: number
  byWeekDay?: number[]
  byMonthDay?: number[]
  until?: Date
  count?: number
}

export const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export const WEEKDAY_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const
