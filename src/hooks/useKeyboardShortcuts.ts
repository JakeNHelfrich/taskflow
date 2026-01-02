import { useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUIStore } from '@/stores/ui-store'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const { openCommandPalette, openModal } = useUIStore()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if in input/textarea/contenteditable
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      const isMod = e.metaKey || e.ctrlKey

      // Command palette: Cmd/Ctrl + K
      if (isMod && e.key === 'k') {
        e.preventDefault()
        openCommandPalette()
        return
      }

      // Quick add task: Q
      if (e.key === 'q' && !isMod && !e.shiftKey) {
        e.preventDefault()
        openModal('quick-add-task')
        return
      }

      // New task: N
      if (e.key === 'n' && !isMod && !e.shiftKey) {
        e.preventDefault()
        openModal('new-task')
        return
      }

      // Focus mode: F
      if (e.key === 'f' && !isMod && !e.shiftKey) {
        e.preventDefault()
        navigate({ to: '/focus' })
        return
      }

      // Navigation with G prefix
      if (e.key === 'g' && !isMod) {
        const handleNextKey = (nextEvent: KeyboardEvent) => {
          nextEvent.preventDefault()
          switch (nextEvent.key) {
            case 'i':
              navigate({ to: '/inbox' })
              break
            case 't':
              navigate({ to: '/today' })
              break
            case 'c':
              navigate({ to: '/calendar' })
              break
            case 'h':
              navigate({ to: '/habits' })
              break
            case 'p':
              navigate({ to: '/projects' })
              break
            case 's':
              navigate({ to: '/settings' })
              break
          }
          window.removeEventListener('keydown', handleNextKey)
        }

        // Set a timeout to clear the listener if no second key is pressed
        const timeoutId = setTimeout(() => {
          window.removeEventListener('keydown', handleNextKey)
        }, 1000)

        window.addEventListener('keydown', handleNextKey, { once: true })

        // Clean up timeout if key is pressed
        window.addEventListener(
          'keydown',
          () => clearTimeout(timeoutId),
          { once: true }
        )
        return
      }

      // Escape: Close modals/command palette
      if (e.key === 'Escape') {
        useUIStore.getState().closeModal()
        useUIStore.getState().closeCommandPalette()
        return
      }
    },
    [navigate, openCommandPalette, openModal]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
