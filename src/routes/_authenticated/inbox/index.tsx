import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { TaskList } from '@/features/tasks/components'
import { useInboxTasks } from '@/features/tasks/hooks'
import { useUIStore } from '@/stores/ui-store'
import type { Task } from '@/features/tasks/types'

export const Route = createFileRoute('/_authenticated/inbox/')({
  component: InboxPage,
})

function InboxPage() {
  const { data: tasks = [], isLoading, error } = useInboxTasks()
  const { openModal, openEditTaskModal } = useUIStore()

  const handleEditTask = (task: Task) => {
    openEditTaskModal(task)
  }

  const handleAddTask = () => {
    openModal('quick-add-task')
  }

  const handleQuickAddClick = () => {
    openModal('quick-add-task')
  }

  return (
    <div className="container max-w-4xl py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>

      <div className="space-y-2">
        <div
          onClick={handleQuickAddClick}
          className="flex items-center gap-3 p-3 border border-dashed rounded-lg text-muted-foreground hover:border-primary/50 cursor-pointer transition-colors"
        >
          <span className="text-lg">+</span>
          <span>Add a task...</span>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading tasks...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            Failed to load tasks
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            emptyMessage="Your inbox is empty. Tasks without a scheduled date will appear here."
            onEditTask={handleEditTask}
          />
        )}
      </div>
    </div>
  )
}
