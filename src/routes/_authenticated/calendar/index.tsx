import { createFileRoute } from '@tanstack/react-router'
import { format, startOfWeek, addDays } from 'date-fns'

export const Route = createFileRoute('/_authenticated/calendar/')({
  component: CalendarPage,
})

function CalendarPage() {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-md">
              <span className="sr-only">Previous week</span>
              ←
            </button>
            <span className="font-medium">
              {format(weekStart, 'MMMM yyyy')}
            </span>
            <button className="p-2 hover:bg-muted rounded-md">
              <span className="sr-only">Next week</span>
              →
            </button>
          </div>
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
          Today
        </button>
      </div>

      {/* Week view */}
      <div className="flex-1 grid grid-cols-7 divide-x">
        {weekDays.map((day) => {
          const isToday =
            format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')

          return (
            <div key={day.toISOString()} className="flex flex-col">
              {/* Day header */}
              <div
                className={`p-2 text-center border-b ${isToday ? 'bg-primary/10' : ''}`}
              >
                <div className="text-xs text-muted-foreground uppercase">
                  {format(day, 'EEE')}
                </div>
                <div
                  className={`text-lg font-semibold ${isToday ? 'text-primary' : ''}`}
                >
                  {format(day, 'd')}
                </div>
              </div>

              {/* Day content */}
              <div className="flex-1 p-1 min-h-[400px]">
                {/* Time blocks would go here */}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
