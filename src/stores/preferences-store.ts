import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PreferencesState {
  theme: 'light' | 'dark' | 'system'
  defaultView: 'inbox' | 'today' | 'calendar'
  showCompletedTasks: boolean
  focusDuration: number // minutes

  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setDefaultView: (view: 'inbox' | 'today' | 'calendar') => void
  setShowCompletedTasks: (show: boolean) => void
  setFocusDuration: (minutes: number) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      defaultView: 'inbox',
      showCompletedTasks: false,
      focusDuration: 25,

      setTheme: (theme) => set({ theme }),
      setDefaultView: (view) => set({ defaultView: view }),
      setShowCompletedTasks: (show) => set({ showCompletedTasks: show }),
      setFocusDuration: (minutes) => set({ focusDuration: minutes }),
    }),
    {
      name: 'preferences-storage',
    }
  )
)
