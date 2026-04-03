import { useEffect } from 'react'
import type { WorldId } from '@/services/types'
import { NAV_WORLDS }   from '@/config/constants'

const ALL_WORLDS: WorldId[] = ['hub', ...NAV_WORLDS]

interface Options {
  current:    WorldId
  onNavigate: (next: WorldId) => void
  /** Minimum horizontal distance in px to trigger (default 80) */
  threshold?: number
  /** Maximum ms the swipe can take (default 400) */
  maxTime?:   number
  /** Don't trigger if the swipe starts on these selectors */
  ignoreSelectors?: string[]
}

export function useSwipeNav({
  current,
  onNavigate,
  threshold = 80,
  maxTime   = 400,
  ignoreSelectors = ['.gallery-carousel', 'canvas'],
}: Options) {
  useEffect(() => {
    let startX    = 0
    let startY    = 0
    let startTime = 0
    let active    = false

    const shouldIgnore = (e: PointerEvent): boolean =>
      ignoreSelectors.some(sel =>
        (e.target as Element)?.closest?.(sel) !== null
      )

    const onDown = (e: PointerEvent) => {
      if (shouldIgnore(e)) return
      startX    = e.clientX
      startY    = e.clientY
      startTime = Date.now()
      active    = true
    }

    const onUp = (e: PointerEvent) => {
      if (!active) return
      active = false

      const dx       = e.clientX - startX
      const dy       = e.clientY - startY
      const elapsed  = Date.now() - startTime

      // Must be faster than maxTime
      if (elapsed > maxTime) return
      // Must be more horizontal than vertical
      if (Math.abs(dx) < Math.abs(dy) * 1.5) return
      // Must exceed threshold
      if (Math.abs(dx) < threshold) return

      const idx  = ALL_WORLDS.indexOf(current)
      if (idx === -1) return

      if (dx < 0 && idx < ALL_WORLDS.length - 1) {
        // Swipe left → next world
        onNavigate(ALL_WORLDS[idx + 1])
      } else if (dx > 0 && idx > 0) {
        // Swipe right → previous world
        onNavigate(ALL_WORLDS[idx - 1])
      }
    }

    const onCancel = () => { active = false }

    window.addEventListener('pointerdown',   onDown,   { passive: true })
    window.addEventListener('pointerup',     onUp)
    window.addEventListener('pointercancel', onCancel)

    return () => {
      window.removeEventListener('pointerdown',   onDown)
      window.removeEventListener('pointerup',     onUp)
      window.removeEventListener('pointercancel', onCancel)
    }
  }, [current, onNavigate, threshold, maxTime, ignoreSelectors])
}