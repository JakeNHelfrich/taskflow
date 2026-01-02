import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Calendar, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Task } from '../types'
import { getPriorityColor, getPriorityLabel } from '../utils/priority'
import { formatDueDate, getDueDateColor } from '../utils/due-date'
import { useToggleTaskComplete, useDeleteTask } from '../hooks'

interface TaskItemProps {
  task: Task
  onEdit?: (task: Task) => void
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const toggleComplete = useToggleTaskComplete()
  const deleteTask = useDeleteTask()
  const isCompleted = task.status === 'completed'

  const handleToggle = () => {
    toggleComplete.mutate({ taskId: task.id, completed: !isCompleted })
  }

  const handleDelete = () => {
    deleteTask.mutate(task.id)
  }

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors',
        isCompleted && 'opacity-60'
      )}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleToggle}
        className="mt-1"
      />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium',
            isCompleted && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {task.priority !== 'low' && (
            <Badge
              variant="outline"
              className="text-xs"
              style={{ borderColor: getPriorityColor(task.priority) }}
            >
              {getPriorityLabel(task.priority)}
            </Badge>
          )}

          {task.due_date && (
            <span
              className={cn(
                'text-xs flex items-center gap-1',
                getDueDateColor(task.due_date)
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDueDate(task.due_date)}
            </span>
          )}

          {task.project && (
            <Badge variant="secondary" className="text-xs">
              <span
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: task.project.color }}
              />
              {task.project.name}
            </Badge>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit?.(task)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
