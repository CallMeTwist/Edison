import type { CSSProperties } from 'react'
import { useWindowSize } from '@/hooks/useWindowSize'

interface BackButtonProps {
  onClick: () => void
  /** Any CSS colour: hex (#4FC3F7), rgb(), rgba() */
  accent?: string
  style?:  CSSProperties
}

/**
 * Convert any CSS colour to rgba() at a given alpha.
 * Handles hex (#abc, #aabbcc), rgb(), rgba().
 */
function toRgba(color: string, alpha: number): string {
  if (color.startsWith('rgba(')) {
    return color.replace(/[\d.]+\)$/, `${alpha})`)
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
  }
  const short = /^#([0-9A-Fa-f]{3})$/.exec(color)
  if (short) {
    const [, s] = short
    const r = parseInt(s[0] + s[0], 16)
    const g = parseInt(s[1] + s[1], 16)
    const b = parseInt(s[2] + s[2], 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
  const full = /^#([0-9A-Fa-f]{6})$/.exec(color)
  if (full) {
    const [, f] = full
    const r = parseInt(f.slice(0, 2), 16)
    const g = parseInt(f.slice(2, 4), 16)
    const b = parseInt(f.slice(4, 6), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
  return `rgba(255,255,255,${alpha})`
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  accent = '#ffffff',
  style,
}) => {
  const { isMobile } = useWindowSize()

  const bg          = toRgba(accent, 0.07)
  const bgHover     = toRgba(accent, 0.16)
  const borderClr   = toRgba(accent, 0.28)
  const borderHover = toRgba(accent, 0.55)
  const textClr     = toRgba(accent, 0.78)
  const textHover   = toRgba(accent, 1)

  return (
    <button
      onClick={onClick}
      style={{
        position:              'absolute',
        /* Tighter on mobile so it never overlaps the centred world title */
        top:                    isMobile ? 8 : 20,
        left:                   isMobile ? 10 : 20,
        zIndex:                 200,
        background:             bg,
        border:                `1px solid ${borderClr}`,
        color:                  textClr,
        padding:                isMobile ? '7px 16px' : '9px 22px',
        borderRadius:           100,
        cursor:                'pointer',
        fontFamily:            "'Space Mono', monospace",
        fontSize:               isMobile ? 9 : 10,
        letterSpacing:          1.8,
        textTransform:         'uppercase',
        backdropFilter:        'blur(14px)',
        WebkitBackdropFilter:  'blur(14px)',
        transition:            'all 0.28s ease',
        display:               'flex',
        alignItems:            'center',
        gap:                    5,
        whiteSpace:            'nowrap',
        /* Caller overrides go last */
        ...style,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.background  = bgHover
        el.style.borderColor = borderHover
        el.style.color       = textHover
        el.style.transform   = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.background  = bg
        el.style.borderColor = borderClr
        el.style.color       = textClr
        el.style.transform   = ''
      }}
    >
      ← Hub
    </button>
  )
}
