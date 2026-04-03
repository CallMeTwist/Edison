interface Props { active: boolean; color: string }

export const TransitionVeil: React.FC<Props> = ({ active, color }) => (
  <div
    aria-hidden="true"
    style={{
      position:       'fixed',
      inset:           0,
      zIndex:          100,
      background:      color,
      opacity:         active ? 1 : 0,
      pointerEvents:  'none',
      transition:     'opacity .32s ease',
    }}
  />
)
