import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { TaskList } from '@/features/tasks/components'
import { useTodayTasks } from '@/features/tasks/hooks'
import { useUIStore } from '@/stores/ui-store'

export const Route = createFileRoute('/_authenticated/today/')({
  component: TodayPage,
})

function TodayPage() {
  const today = new Date()
  const { data: tasks = [], isLoading, error } = useTodayTasks()
  const { openModal } = useUIStore()

  const pendingTasks = tasks.filter((t) => t.status !== 'completed')
  const completedTasks = tasks.filter((t) => t.status === 'completed')

  const handleAddTask = () => {
    openModal('quick-add-task')
  }

  return (
    <div className="container max-w-4xl py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Today</h1>
          <p className="text-muted-foreground">{format(today, 'EEEE, MMMM d')}</p>
        </div>
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-4">Tasks</h2>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading tasks...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Failed to load tasks
            </div>
          ) : (
            <div className="space-y-4">
              <TaskList
                tasks={pendingTasks}
                emptyMessage="No tasks scheduled for today"
              />

              {completedTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Completed ({completedTasks.length})
                  </h3>
                  <TaskList tasks={completedTasks} />
                </div>
              )}
            </div>
          )}
        </div>

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
