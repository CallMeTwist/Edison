import { useState, useEffect } from 'react'
import { TERM_SCRIPT } from '../data'

export const Terminal: React.FC = () => {
  const [typed, setTyped] = useState<typeof TERM_SCRIPT>([])

  useEffect(() => {
    setTyped([])
    let i = 0
    const next = () => {
      if (i >= TERM_SCRIPT.length) return
      setTyped(p => [...p, TERM_SCRIPT[i++]])
      setTimeout(next, 300 + Math.random() * 220)
    }
    const id = setTimeout(next, 700)
    return () => clearTimeout(id)
  }, [])

  return (
    <div style={{
      background:   '#020a04',
      border:       '1px solid rgba(0,255,136,.14)',
      borderRadius: 12,
      overflow:     'hidden',
      flexShrink:    0,
    }}>
      {/* Title bar */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(0,255,136,.08)', display: 'flex', alignItems: 'center', gap: 7 }}>
        {['#FF5F56', '#FFBD2E', '#27C93F'].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <span style={{ color: 'rgba(0,255,136,.3)', fontSize: 10, fontFamily: "'Space Mono', monospace", marginLeft: 8 }}>
          alex@portfolio:~
        </span>
      </div>

      {/* Output */}
      <div style={{ padding: '14px 18px', minHeight: 140 }}>
        {typed.map((ln, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize:   11,
              lineHeight: 2.1,
              animation:  'fadeIn .25s ease forwards',
            }}
          >
            {ln.prompt ? (
              <>
                <span style={{ color: 'rgba(0,255,136,.4)' }}>$ </span>
                <span style={{ color: '#00FF88' }}>{ln.text}</span>
              </>
            ) : (
              <span style={{ color: 'rgba(0,255,136,.6)' }}>{ln.text}</span>
            )}
          </div>
        ))}
        {typed.length < TERM_SCRIPT.length && (
          <span style={{
            display:       'inline-block',
            width:          7,
            height:         13,
            background:    '#00FF88',
            animation:     'blink .8s infinite',
            verticalAlign: 'middle',
          }} />
        )}
      </div>
    </div>
  )
}
