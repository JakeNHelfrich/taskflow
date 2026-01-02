import { useUIStore } from '@/stores/ui-store'
import { QuickAddTaskModal, EditTaskDialog } from '@/features/tasks/components'

export function ModalContainer() {
  const { activeModal, editingTask, closeModal } = useUIStore()

  return (
    <>
      <QuickAddTaskModal
        open={activeModal === 'quick-add-task'}
        onClose={closeModal}
      />
      <EditTaskDialog
        task={editingTask}
        open={activeModal === 'edit-task'}
        onClose={closeModal}
      />
    </>
  )
}
