import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/inbox/')({
  component: InboxPage,
})

function InboxPage() {
  return (
    <div className="container max-w-4xl py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
          Add Task
        </button>
      </div>

      <div className="space-y-2">
        {/* Task quick add */}
        <div className="flex items-center gap-3 p-3 border border-dashed rounded-lg text-muted-foreground hover:border-primary/50 cursor-pointer transition-colors">
          <span className="text-lg">+</span>
          <span>Add a task...</span>
        </div>

        {/* Placeholder tasks */}
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">Your inbox is empty</p>
          <p className="text-sm">
            Tasks without a scheduled date will appear here
          </p>
        </div>
      </div>
    </div>
  )
}
