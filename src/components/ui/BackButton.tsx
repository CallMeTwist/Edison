import type { CSSProperties } from 'react'

interface BackButtonProps {
  onClick:    () => void
  /** Pass a full valid CSS color: hex, rgb(), or rgba() */
  accent?:    string
  /** Override any specific style properties */
  style?:     CSSProperties
}

/**
 * Converts any color value into an rgba string at a given opacity.
 * Works with hex (#4FC3F7), rgb(), and rgba() inputs.
 */
function toRgba(color: string, alpha: number): string {
  // Already rgba — just swap the alpha
  if (color.startsWith('rgba(')) {
    return color.replace(/[\d.]+\)$/, `${alpha})`)
  }
  // Already rgb — convert
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
  }
  // Hex shorthand (#abc)
  if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
    const [r, g, b] = color.slice(1).split('').map(c => parseInt(c + c, 16))
    return `rgba(${r},${g},${b},${alpha})`
  }
  // Hex full (#aabbcc)
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
  // Fallback
  return `rgba(255,255,255,${alpha})`
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  accent = '#ffffff',
  style,
}) => {
  const bg     = toRgba(accent, 0.07)
  const border = toRgba(accent, 0.28)
  const text   = toRgba(accent, 0.75)

  const bgHover     = toRgba(accent, 0.15)
  const borderHover = toRgba(accent, 0.55)
  const textHover   = toRgba(accent, 1)

  return (
    <button
      onClick={onClick}
      style={{
        position:        'absolute',
        top:              24,
        left:             24,
        zIndex:           200,
        background:       bg,
        border:          `1px solid ${border}`,
        color:            text,
        padding:         '9px 22px',
        borderRadius:     100,
        cursor:          'pointer',
        fontFamily:      "'Space Mono', monospace",
        fontSize:         10,
        letterSpacing:    2,
        textTransform:   'uppercase',
        backdropFilter:  'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition:      'all 0.28s ease',
        display:         'flex',
        alignItems:      'center',
        gap:              6,
        ...style,           // caller overrides applied last
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.background   = bgHover
        el.style.borderColor  = borderHover
        el.style.color        = textHover
        el.style.transform    = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.background   = bg
        el.style.borderColor  = border
        el.style.color        = text
        el.style.transform    = ''
      }}
    >
      ← Hub
    </button>
  )
}