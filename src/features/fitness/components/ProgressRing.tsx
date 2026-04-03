interface Props {
  pct:   number
  color: string
  size:  number
  label: string
}

export const ProgressRing: React.FC<Props> = ({ pct, color, size, label }) => {
  const r    = size / 2 - 14
  const circ = 2 * Math.PI * r
  const gap  = circ - (pct / 100) * circ

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={11} />
        {/* Fill — animated via CSS */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={11}
          strokeLinecap="round"
          strokeDasharray={circ}
          style={{
            strokeDashoffset:  circ,
            ['--full' as string]: circ,
            ['--gap'  as string]: gap,
            transformOrigin:   'center',
            transform:         'rotate(-90deg)',
            animation:         'ringFill 1.8s .5s cubic-bezier(.23,1,.32,1) forwards',
          }}
        />
        {/* Glow ring */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circ}
          style={{
            strokeDashoffset:  circ,
            ['--full' as string]: circ,
            ['--gap'  as string]: gap,
            transformOrigin:   'center',
            transform:         'rotate(-90deg)',
            animation:         'ringFill 1.8s .5s cubic-bezier(.23,1,.32,1) forwards',
            filter:            `drop-shadow(0 0 8px ${color})`,
            opacity:            0.5,
          }}
        />
        <text
          x={size / 2} y={size / 2 + 5}
          textAnchor="middle"
          fill="#fff"
          fontFamily="'Bebas Neue', sans-serif"
          fontSize={size / 4}
        >
          {pct}%
        </text>
      </svg>
      <span style={{
        fontSize:   10,
        color:      'rgba(255,255,255,.38)',
        textAlign:  'center',
        fontFamily: "'Space Mono', monospace",
        maxWidth:    size,
        lineHeight:  1.55,
      }}>
        {label}
      </span>
    </div>
  )
}
