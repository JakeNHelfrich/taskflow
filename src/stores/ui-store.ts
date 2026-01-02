import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '@/features/tasks/types'

interface UIState {
  sidebarCollapsed: boolean
  commandPaletteOpen: boolean
  activeModal: string | null
  editingTask: Task | null

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  openCommandPalette: () => void
  closeCommandPalette: () => void
  openModal: (modalId: string) => void
  closeModal: () => void
  openEditTaskModal: (task: Task) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      activeModal: null,
      editingTask: null,

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
      openModal: (modalId) => set({ activeModal: modalId }),
      closeModal: () => set({ activeModal: null, editingTask: null }),
      openEditTaskModal: (task) => set({ activeModal: 'edit-task', editingTask: task }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
)
