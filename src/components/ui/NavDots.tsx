import { NAV_WORLDS, WORLD_CONFIG } from '@/config/constants'
import type { WorldId } from '@/services/types'

interface Props {
  current: WorldId
  onGo:    (w: WorldId) => void
}

export const NavDots: React.FC<Props> = ({ current, onGo }) => {
  if (current === 'hub') return null

  return (
    <div
      style={{
        position:  'fixed',
        bottom:    26,
        right:     26,
        zIndex:    300,
        display:   'flex',
        gap:        8,
        animation: 'fadeIn .5s ease forwards',
      }}
    >
      {NAV_WORLDS.map(w => {
        const active = w === current
        const cfg    = WORLD_CONFIG[w]
        return (
          <button
            key={w}
            title={cfg.label}
            onClick={() => onGo(w)}
            style={{
              width:        active ? 22 : 8,
              height:       8,
              borderRadius: active ? 4 : '50%',
              border:       'none',
              cursor:       'pointer',
              padding:      0,
              transition:   'all 0.35s cubic-bezier(.23,1,.32,1)',
              background:   active
                ? cfg.accent
                : 'rgba(255,255,255,.2)',
              boxShadow: active
                ? `0 0 10px ${cfg.accent}`
                : 'none',
            }}
          />
        )
      })}
    </div>
  )
}
