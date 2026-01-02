import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  isPast,
  differenceInDays,
  parseISO,
  startOfDay,
} from 'date-fns'

export function formatDueDate(dateString: string | null): string {
  if (!dateString) return ''

  const date = parseISO(dateString)

  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isYesterday(date)) return 'Yesterday'

  const daysDiff = differenceInDays(date, startOfDay(new Date()))

  if (daysDiff > 0 && daysDiff <= 7) {
    return format(date, 'EEEE') // Day name
  }

  if (date.getFullYear() === new Date().getFullYear()) {
    return format(date, 'MMM d') // Mar 15
  }

  return format(date, 'MMM d, yyyy') // Mar 15, 2024
}

export function getDueDateStatus(
  dateString: string | null
): 'overdue' | 'today' | 'upcoming' | 'none' {
  if (!dateString) return 'none'

  const date = parseISO(dateString)

  if (isToday(date)) return 'today'
  if (isPast(startOfDay(date))) return 'overdue'
  return 'upcoming'
}

export function getDueDateColor(dateString: string | null): string {
  const status = getDueDateStatus(dateString)

  switch (status) {
    case 'overdue':
      return 'text-red-500'
    case 'today':
      return 'text-blue-500'
    case 'upcoming':
      return 'text-muted-foreground'
    default:
      return 'text-muted-foreground'
  }
}

export function isOverdue(dateString: string | null): boolean {
  return getDueDateStatus(dateString) === 'overdue'
}

export function formatTime(timeString: string | null): string {
  if (!timeString) return ''

  // timeString format: "HH:mm:ss" or "HH:mm"
  const [hours, minutes] = timeString.split(':')
  const date = new Date()
  date.setHours(parseInt(hours!, 10), parseInt(minutes!, 10))

  return format(date, 'h:mm a')
}

export function formatTimeRange(
  startTime: string | null,
  endTime: string | null
): string {
  if (!startTime) return ''
  if (!endTime) return formatTime(startTime)

  return `${formatTime(startTime)} - ${formatTime(endTime)}`
}
