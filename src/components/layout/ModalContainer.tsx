import { useUIStore } from '@/stores/ui-store'
import { QuickAddTaskModal } from '@/features/tasks/components'

export function ModalContainer() {
  const { activeModal, closeModal } = useUIStore()

  return (
    <>
      <QuickAddTaskModal
        open={activeModal === 'quick-add-task'}
        onClose={closeModal}
      />
    </>
  )
}
