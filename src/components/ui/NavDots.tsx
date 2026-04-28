import { NAV_WORLDS, WORLD_CONFIG } from '@/config/constants'
import type { WorldId } from '@/services/types'

interface Props {
  current: WorldId
  onGo:    (w: WorldId) => void
}

/**
 * Bottom-right world rail.
 * Only shows the *previous* and *next* worlds — the current one isn't rendered
 * (the user is already in it). Each pill is colored with that world's accent
 * so the next destination is unambiguous.
 */
export const NavDots: React.FC<Props> = ({ current, onGo }) => {
  if (current === 'hub') return null

  const idx       = NAV_WORLDS.indexOf(current as WorldId)
  const prevWorld = idx > 0 ? NAV_WORLDS[idx - 1] : null
  const nextWorld = idx >= 0 && idx < NAV_WORLDS.length - 1 ? NAV_WORLDS[idx + 1] : null

  if (!prevWorld && !nextWorld) return null

  const pill = (w: WorldId, dir: 'prev' | 'next') => {
    const cfg = WORLD_CONFIG[w]
    const arrow = dir === 'prev' ? '←' : '→'
    return (
      <button
        key={w}
        title={`${dir === 'prev' ? 'Previous' : 'Next'}: ${cfg.label}`}
        aria-label={`Go to ${cfg.label}`}
        onClick={() => onGo(w)}
        style={{
          height:       32,
          padding:      '0 12px',
          borderRadius: 999,
          border:       `1px solid ${cfg.accent}55`,
          cursor:       'pointer',
          background:   dir === 'prev'
            ? `linear-gradient(90deg, ${cfg.accent}26, transparent)`
            : `linear-gradient(90deg, transparent, ${cfg.accent}26)`,
          boxShadow:    `0 0 12px ${cfg.accent}33`,
          display:      'flex',
          alignItems:   'center',
          gap:          8,
          color:        cfg.accent,
          fontFamily:   "'Space Mono', monospace",
          fontSize:     11,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          flexDirection: dir === 'prev' ? 'row' : 'row-reverse',
          transition:   'transform .25s ease, box-shadow .25s ease',
        }}
      >
        <span style={{ fontSize: 14, lineHeight: 1 }}>{arrow}</span>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: cfg.accent,
          boxShadow:  `0 0 8px ${cfg.accent}`,
          flex: '0 0 auto',
        }} />
      </button>
    )
  }

  return (
    <div
      style={{
        position:  'fixed',
        bottom:    'max(20px, env(safe-area-inset-bottom, 0px))',
        right:     16,
        zIndex:    300,
        display:   'flex',
        alignItems: 'center',
        gap:        8,
        padding:    '6px 8px',
        borderRadius: 999,
        background: 'rgba(8,8,12,.55)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border:     '1px solid rgba(255,255,255,.08)',
        boxShadow:  '0 6px 24px rgba(0,0,0,.45)',
        animation:  'fadeIn .5s ease forwards',
      }}
    >
      {prevWorld && pill(prevWorld, 'prev')}
      {nextWorld && pill(nextWorld, 'next')}
    </div>
  )
}
