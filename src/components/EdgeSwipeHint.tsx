import type { EdgeSwipeState } from '@/hooks/useEdgeSwipe'

interface Props {
  state:       EdgeSwipeState
  /** Accent of the world the swipe will reveal (or null if there is no neighbor) */
  targetColor: string | null
}

/**
 * Visual feedback for an active edge swipe. Renders a thin colored bar pinned to
 * the active edge that grows and brightens with drag progress. When there is no
 * neighbor world (clamp ends), the bar tints red-ish and resists past 50% width.
 */
export const EdgeSwipeHint: React.FC<Props> = ({ state, targetColor }) => {
  if (!state.side) return null

  const blocked = !targetColor
  const color   = targetColor ?? '#ff3b3b'

  // Width grows with drag, but rubber-bands when blocked
  const maxFrac = blocked ? 0.18 : 0.4
  const width   = Math.min(window.innerWidth * maxFrac, state.delta)
  const opacity = Math.min(1, state.progress * 1.2 + 0.18)

  const sideKey = state.side === 'left' ? 'left' : 'right'

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        top:            0,
        bottom:         0,
        [sideKey]:      0,
        width,
        zIndex:         95,
        pointerEvents: 'none',
        background:    `linear-gradient(${state.side === 'left' ? '90deg' : '270deg'}, ${color}cc, ${color}11)`,
        opacity,
        boxShadow:     `inset ${state.side === 'left' ? '8px' : '-8px'} 0 24px ${color}44`,
        transition:    'opacity .12s linear',
      }}
    >
      {/* Thin solid edge stripe */}
      <div style={{
        position:   'absolute',
        top:         0,
        bottom:      0,
        [sideKey]:   0,
        width:       2,
        background: color,
        boxShadow:  `0 0 18px ${color}`,
      }} />
    </div>
  )
}
