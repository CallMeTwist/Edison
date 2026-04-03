import type { CSSProperties } from 'react'

interface BackButtonProps {
  onClick: () => void
  accent?: string
  style?:  CSSProperties
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick, accent = 'rgba(255,255,255,.6)', style,
}) => (
  <button
    onClick={onClick}
    style={{
      position:       'absolute',
      top:            24,
      left:           24,
      zIndex:         200,
      background:     `${accent.replace(')', ',.06)')}`,
      border:         `1px solid ${accent.replace(')', ',.22)')}`,
      color:          accent.replace(')', ',.7)'),
      padding:        '9px 22px',
      borderRadius:   100,
      cursor:         'pointer',
      fontFamily:     "'Space Mono', monospace",
      fontSize:       10,
      letterSpacing:  2,
      textTransform:  'uppercase',
      backdropFilter: 'blur(10px)',
      transition:     'all 0.28s ease',
      ...style,
    }}
    onMouseEnter={e => {
      const el = e.currentTarget
      el.style.opacity     = '1'
      el.style.background  = accent.replace(')', ',.12)')
    }}
    onMouseLeave={e => {
      const el = e.currentTarget
      el.style.opacity    = '0.85'
      el.style.background = accent.replace(')', ',.06)')
    }}
  >
    ← Hub
  </button>
)
