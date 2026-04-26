import { useEffect, useRef, useState } from 'react'

export type EdgeSide = 'left' | 'right'

export interface EdgeSwipeState {
  side:    EdgeSide | null
  /** Absolute drag distance in px from the starting edge (always >= 0) */
  delta:   number
  /** Drag progress 0–1 relative to the commit threshold */
  progress: number
}

interface Options {
  /** Distance (px) from edge in which a pointerdown activates the gesture */
  edgeSize?:        number
  /** Drag distance (as fraction of innerWidth) required to commit */
  commitFraction?:  number
  /** Flick velocity (px/ms) that commits regardless of distance */
  commitVelocity?:  number
  /** When true, hook ignores all input (e.g. while veil is animating) */
  disabled?:        boolean
  /** Selectors that, if hit by the start point, abort the gesture */
  ignoreSelectors?: string[]
  /** Fired when the user passes the threshold */
  onCommit:         (side: EdgeSide) => void
}

/**
 * Edge-grab horizontal swipe.
 * - Activates only when pointerdown lands within `edgeSize` of the screen's left or right edge.
 * - Streams progress while dragging so a UI hint can render.
 * - Commits on release if the drag exceeded distance OR flick-velocity threshold.
 *
 * Pointer-fine devices only (skips touch-only browsers, where iOS uses the edge for browser back).
 */
export function useEdgeSwipe({
  edgeSize        = 40,
  commitFraction  = 0.22,
  commitVelocity  = 0.7,
  disabled        = false,
  ignoreSelectors = ['.gallery-carousel', 'canvas'],
  onCommit,
}: Options): EdgeSwipeState {
  const [state, setState] = useState<EdgeSwipeState>({ side: null, delta: 0, progress: 0 })
  const onCommitRef = useRef(onCommit)
  onCommitRef.current = onCommit

  useEffect(() => {
    if (disabled) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let side:        EdgeSide | null = null
    let startX       = 0
    let startY       = 0
    let lastX        = 0
    let lastT        = 0
    let velocity     = 0
    let currentDelta = 0
    let pointerId:   number | null   = null

    const reset = () => {
      side = null
      pointerId = null
      currentDelta = 0
      setState({ side: null, delta: 0, progress: 0 })
    }

    const shouldIgnore = (target: EventTarget | null): boolean =>
      ignoreSelectors.some(sel =>
        (target as Element | null)?.closest?.(sel) !== null
      )

    const onDown = (e: PointerEvent) => {
      if (side !== null) return
      if (shouldIgnore(e.target)) return

      const w = window.innerWidth
      if (e.clientX < edgeSize) side = 'left'
      else if (e.clientX > w - edgeSize) side = 'right'
      else return

      startX = e.clientX
      startY = e.clientY
      lastX  = e.clientX
      lastT  = performance.now()
      velocity = 0
      pointerId = e.pointerId
    }

    const onMove = (e: PointerEvent) => {
      if (side === null || e.pointerId !== pointerId) return

      const dxAbs = e.clientX - startX
      const dyAbs = e.clientY - startY

      // If the gesture turned vertical, abort
      if (Math.abs(dyAbs) > Math.abs(dxAbs) * 1.4 && Math.abs(dyAbs) > 24) {
        reset()
        return
      }

      // We only consider drag *away* from the edge (left edge → drag right, right edge → drag left)
      const directional = side === 'left' ? dxAbs : -dxAbs
      const delta = Math.max(0, directional)

      const now = performance.now()
      const dt  = Math.max(1, now - lastT)
      velocity  = (e.clientX - lastX) / dt
      lastX     = e.clientX
      lastT     = now

      const threshold = window.innerWidth * commitFraction
      currentDelta = delta
      setState({ side, delta, progress: Math.min(1, delta / threshold) })
    }

    const onUp = () => {
      if (side === null) return

      const w          = window.innerWidth
      const threshold  = w * commitFraction
      const distanceOK = currentDelta >= threshold
      const flick      = side === 'left' ? velocity : -velocity
      const flickOK    = flick > commitVelocity && currentDelta > 24

      if (distanceOK || flickOK) {
        const committed = side
        reset()
        onCommitRef.current(committed)
      } else {
        reset()
      }
    }

    window.addEventListener('pointerdown',   onDown, { passive: true })
    window.addEventListener('pointermove',   onMove, { passive: true })
    window.addEventListener('pointerup',     onUp)
    window.addEventListener('pointercancel', reset)

    return () => {
      window.removeEventListener('pointerdown',   onDown)
      window.removeEventListener('pointermove',   onMove)
      window.removeEventListener('pointerup',     onUp)
      window.removeEventListener('pointercancel', reset)
    }
    // We intentionally don't depend on `state.delta` — closure reads from setState callbacks instead
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, edgeSize, commitFraction, commitVelocity, ignoreSelectors])

  return state
}
