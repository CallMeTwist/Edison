import { NAV_WORLDS, WORLD_CONFIG } from '@/config/constants'
import type { WorldId } from '@/services/types'

interface Props {
  current: WorldId
  onGo:    (w: WorldId) => void
}

/**
 * Bottom-right world rail.
 * - Wider, label-bearing pills (≥44px tap targets) replace the previous tiny dots.
 * - A trailing "next world" chevron previews the accent color of the next world,
 *   making the path forward obvious and giving a generous tap target.
 */
export const NavDots: React.FC<Props> = ({ current, onGo }) => {
  if (current === 'hub') return null

  const idx        = NAV_WORLDS.indexOf(current as WorldId)
  const nextWorld  = idx >= 0 && idx < NAV_WORLDS.length - 1 ? NAV_WORLDS[idx + 1] : null
  const nextCfg    = nextWorld ? WORLD_CONFIG[nextWorld] : null

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
        padding:    '8px 10px',
        borderRadius: 999,
        background: 'rgba(8,8,12,.55)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border:     '1px solid rgba(255,255,255,.08)',
        boxShadow:  '0 6px 24px rgba(0,0,0,.45)',
        animation:  'fadeIn .5s ease forwards',
      }}
    >
      {NAV_WORLDS.map(w => {
        const active = w === current
        const cfg    = WORLD_CONFIG[w]
        return (
          <button
            key={w}
            title={cfg.label}
            aria-label={cfg.label}
            aria-current={active ? 'page' : undefined}
            onClick={() => onGo(w)}
            style={{
              minWidth:     active ? 56 : 28,
              height:       28,
              padding:      active ? '0 12px' : 0,
              borderRadius: 999,
              border:       active ? `1px solid ${cfg.accent}66` : '1px solid rgba(255,255,255,.10)',
              cursor:       'pointer',
              transition:   'all 0.35s cubic-bezier(.23,1,.32,1)',
              background:   active ? `${cfg.accent}22` : 'rgba(255,255,255,.06)',
              boxShadow:    active ? `0 0 14px ${cfg.accent}55, inset 0 0 0 1px ${cfg.accent}33` : 'none',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              gap:          6,
              color:        active ? cfg.accent : 'rgba(255,255,255,.6)',
              fontFamily:   "'Space Mono', monospace",
              fontSize:     10,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: active ? cfg.accent : 'rgba(255,255,255,.35)',
              boxShadow: active ? `0 0 8px ${cfg.accent}` : 'none',
              flex: '0 0 auto',
            }} />
            {active && <span>{cfg.label.split(' ')[0]}</span>}
          </button>
        )
      })}

      {nextCfg && nextWorld && (
        <button
          title={`Next: ${nextCfg.label}`}
          aria-label={`Go to ${nextCfg.label}`}
          onClick={() => onGo(nextWorld)}
          style={{
            marginLeft:   4,
            width:        40,
            height:       28,
            padding:      0,
            borderRadius: 999,
            border:       `1px solid ${nextCfg.accent}55`,
            cursor:       'pointer',
            background:   `linear-gradient(90deg, transparent, ${nextCfg.accent}26)`,
            boxShadow:    `0 0 12px ${nextCfg.accent}33`,
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            color:        nextCfg.accent,
            fontSize:     14,
            lineHeight:   1,
            transition:   'all .3s ease',
          }}
        >
          →
        </button>
      )}
    </div>
  )
}
