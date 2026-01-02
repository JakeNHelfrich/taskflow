import { useState, useEffect, useRef, type FormEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdateTask } from '../hooks'
import type { Task, TaskPriority } from '../types'
import { PRIORITY_LABELS, PRIORITY_COLORS } from '@/config/constants'

interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onClose: () => void
}

export function EditTaskDialog({ task, open, onClose }: EditTaskDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('low')
  const [dueDate, setDueDate] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const updateTask = useUpdateTask()

  useEffect(() => {
    if (open && task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setDueDate(task.due_date || '')
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open, task])

  useEffect(() => {
    if (!open) {
      setTitle('')
      setDescription('')
      setPriority('low')
      setDueDate('')
    }
  }, [open])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !task) return

    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        input: {
          title: title.trim(),
          description: description.trim() || null,
          priority,
          due_date: dueDate || null,
        },
      })
      onClose()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={inputRef}
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
          />

          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as TaskPriority)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: PRIORITY_COLORS[p] }}
                      />
                      {PRIORITY_LABELS[p]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-[160px]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || updateTask.isPending}>
              {updateTask.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
