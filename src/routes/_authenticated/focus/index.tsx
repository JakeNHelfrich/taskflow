import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useFocusStore } from '@/features/focus/stores/focus-session'

export const Route = createFileRoute('/_authenticated/focus/')({
  component: FocusPage,
})

function FocusPage() {
  const {
    isActive,
    isPaused,
    elapsedSeconds,
    targetMinutes,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    tick,
  } = useFocusStore()

  const [selectedDuration, setSelectedDuration] = useState(25)

  // Timer tick
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, tick])

  const remainingSeconds = targetMinutes * 60 - elapsedSeconds
  const minutes = Math.floor(Math.max(0, remainingSeconds) / 60)
  const seconds = Math.max(0, remainingSeconds) % 60

  const progress = isActive
    ? (elapsedSeconds / (targetMinutes * 60)) * 100
    : 0

  return (
    <div className="container max-w-2xl py-12 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Focus Mode</h1>

      {/* Timer display */}
      <div className="relative mx-auto w-64 h-64 mb-8">
        {/* Progress ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-primary transition-all duration-1000"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-mono font-bold">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        {!isActive ? (
          <>
            {/* Duration selector */}
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              className="h-10 rounded-md border border-input bg-background px-3 py-2"
            >
              <option value={15}>15 min</option>
              <option value={25}>25 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
            </select>

            <button
              onClick={() => startSession(null, selectedDuration)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Start Focus
            </button>
          </>
        ) : (
          <>
            <button
              onClick={isPaused ? resumeSession : pauseSession}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 border border-input bg-background hover:bg-accent"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={endSession}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              End Session
            </button>
          </>
        )}
      </div>

      {/* Task selection (placeholder) */}
      {!isActive && (
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Select a task to focus on (optional)
          </p>
          <button className="text-sm text-primary hover:underline">
            + Choose a task
          </button>
        </div>
      )}
    </div>
  )
}
