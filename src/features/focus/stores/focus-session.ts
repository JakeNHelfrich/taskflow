import { create } from 'zustand'

interface FocusSession {
  id: string | null
  taskId: string | null
  startedAt: Date | null
  targetMinutes: number
  isActive: boolean
  isPaused: boolean
  elapsedSeconds: number
}

interface FocusStore extends FocusSession {
  startSession: (taskId: string | null, targetMinutes?: number) => void
  pauseSession: () => void
  resumeSession: () => void
  endSession: () => void
  tick: () => void
  reset: () => void
}

const initialState: FocusSession = {
  id: null,
  taskId: null,
  startedAt: null,
  targetMinutes: 25,
  isActive: false,
  isPaused: false,
  elapsedSeconds: 0,
}

export const useFocusStore = create<FocusStore>((set, get) => ({
  ...initialState,

  startSession: (taskId, targetMinutes = 25) => {
    set({
      id: crypto.randomUUID(),
      taskId,
      startedAt: new Date(),
      targetMinutes,
      isActive: true,
      isPaused: false,
      elapsedSeconds: 0,
    })
  },

  pauseSession: () => set({ isPaused: true }),

  resumeSession: () => set({ isPaused: false }),

  endSession: () => set(initialState),

  tick: () => {
    const { isActive, isPaused, elapsedSeconds, targetMinutes } = get()
    if (isActive && !isPaused) {
      const newElapsed = elapsedSeconds + 1
      set({ elapsedSeconds: newElapsed })

      // Check if session is complete
      if (newElapsed >= targetMinutes * 60) {
        // Session complete - could trigger notification here
      }
    }
  },

  reset: () => set(initialState),
}))
