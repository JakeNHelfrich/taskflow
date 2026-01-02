import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'

export const Route = createFileRoute('/_authenticated/today/')({
  component: TodayPage,
})

function TodayPage() {
  const today = new Date()

  return (
    <div className="container max-w-4xl py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Today</h1>
          <p className="text-muted-foreground">
            {format(today, 'EEEE, MMMM d')}
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
          Add Task
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tasks section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Tasks</h2>
          <div className="space-y-2">
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              <p>No tasks scheduled for today</p>
            </div>
          </div>
        </div>

        {/* Time blocks section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Time Blocks</h2>
          <div className="space-y-2">
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              <p>No time blocks for today</p>
              <button className="text-sm text-primary hover:underline mt-2">
                + Add time block
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
