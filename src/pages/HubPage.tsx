import { useState } from 'react'
import { useWorld }      from '@/context/WorldContext'
import { useMouse }      from '@/hooks/useMouse'
import { useWindowSize } from '@/hooks/useWindowSize'
import type { WorldId }  from '@/services/types'
import { OWNER_NAME }    from '@/config/constants'

interface Portal {
  id:    WorldId
  label: string
  sub:   string
  icon:  string
  clr:   string
  gc:    string
  bg:    string
}

const PORTALS: Portal[] = [
  { id:'physio',  label:'Physiotherapist',       sub:'Evidence-based healing & rehabilitation',   icon:'⊕', clr:'#4FC3F7', gc:'rgba(79,195,247,.22)',   bg:'linear-gradient(145deg,rgba(15,42,72,.9),rgba(2,8,20,.96))' },
  { id:'dev',     label:'Software Developer',     sub:'Full-stack digital systems & architecture', icon:'◈', clr:'#00FF88', gc:'rgba(0,255,136,.20)',    bg:'linear-gradient(145deg,rgba(0,28,12,.9),rgba(0,4,1,.96))' },
  { id:'fitness', label:'Fitness & Weight Loss',  sub:'Science-driven body transformation',        icon:'◉', clr:'#FF4500', gc:'rgba(255,69,0,.22)',    bg:'linear-gradient(145deg,rgba(40,8,0,.9),rgba(6,1,0,.96))' },
  { id:'art',     label:'Visual Artist',          sub:'Expressive work across media & dimensions', icon:'◎', clr:'#FF6B9D', gc:'rgba(255,107,157,.20)', bg:'linear-gradient(145deg,rgba(35,5,22,.9),rgba(6,1,4,.96))' },
]

export const HubPage: React.FC = () => {
  const { navigateTo } = useWorld()
  const [hov, setHov]  = useState<number | null>(null)
  const mouse          = useMouse()
  const { isMobile }   = useWindowSize()

  return (
    <div style={{
      position:       'fixed',
      inset:           0,
      zIndex:          5,
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:         isMobile ? '16px' : '32px',
      animation:      'worldIn .7s ease forwards',
      overflowY:       isMobile ? 'auto' : 'hidden',
    }}>

      {/* ── Background radial ── */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 42%,rgba(18,14,40,.94) 0%,rgba(0,0,0,.98) 100%)', pointerEvents:'none' }} />

      {/* ── Deep portrait silhouette ── */}
      <div style={{
        position:       'absolute',
        top:             '50%',
        left:            '50%',
        transform:      'translate(-50%, -50%)',
        width:           isMobile ? '60vw' : '36vw',
        maxWidth:        520,
        aspectRatio:    '3 / 4',
        zIndex:          1,
        pointerEvents:  'none',
        opacity:         0.065,
        filter:         'blur(1.5px)',
        overflow:       'hidden',
        borderRadius:   '50% 50% 48% 52% / 55% 55% 45% 45%',
      }}>
        {/* SVG silhouette — stylised person shape */}
        <svg viewBox="0 0 300 400" width="100%" height="100%" style={{ display:'block' }}>
          <defs>
            <radialGradient id="pg" cx="50%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#fff" stopOpacity={1} />
              <stop offset="100%" stopColor="#fff" stopOpacity={0} />
            </radialGradient>
          </defs>
          {/* Head */}
          <ellipse cx={150} cy={70} rx={52} ry={62} fill="url(#pg)" />
          {/* Neck */}
          <rect x={133} y={128} width={34} height={30} rx={10} fill="url(#pg)" />
          {/* Shoulders / torso */}
          <path d="M60 158 Q150 138 240 158 L255 340 Q150 360 45 340 Z" fill="url(#pg)" />
        </svg>
      </div>

      {/* ── Subtle portrait outer glow ── */}
      <div style={{
        position:     'absolute',
        top:          '50%', left: '50%',
        transform:    'translate(-50%, -52%)',
        width:         isMobile ? '55vw' : '32vw',
        maxWidth:      480,
        aspectRatio:  '1',
        borderRadius: '50%',
        background:   'radial-gradient(circle, rgba(255,255,255,.04) 0%, transparent 70%)',
        pointerEvents:'none',
        zIndex:        1,
        animation:    'breathe 7s ease-in-out infinite',
      }} />

      {/* ── Corner world glows ── */}
      {PORTALS.map((p, i) => (
        <div key={p.id} style={{
          position:     'fixed',
          [i < 2 ? 'top' : 'bottom']:    '-8%',
          [i % 2 === 0 ? 'left' : 'right']: '-8%',
          width:        '38vw', height: '38vw',
          borderRadius: '50%',
          background:   `radial-gradient(circle,${p.clr}06 0%,transparent 70%)`,
          pointerEvents:'none',
          animation:    `breathe ${3.5 + i * 0.6}s ${i * 0.4}s ease-in-out infinite`,
        }} />
      ))}

      {/* ── Header ── */}
      <div style={{
        position:  'relative',
        textAlign: 'center',
        marginBottom: isMobile ? 28 : 44,
        zIndex:    2,
        transform: isMobile ? 'none' : `translate(${mouse.current.nx * -6}px,${mouse.current.ny * -4}px)`,
        transition: 'transform .12s linear',
        animation: 'fadeUp .9s ease forwards',
      }}>
        <div style={{
          fontFamily:    "'Space Mono', monospace",
          fontSize:       9,
          letterSpacing:  8,
          color:         'rgba(255,255,255,.26)',
          textTransform: 'uppercase',
          marginBottom:   14,
          animation:     'pulse 3s ease-in-out infinite',
        }}>
          Creative Portfolio · 2024
        </div>
        <h1 style={{
          fontFamily:   "'Syne', sans-serif",
          fontSize:     'clamp(46px,7.5vw,100px)',
          fontWeight:    800,
          color:        '#fff',
          lineHeight:    0.9,
          letterSpacing:'-2px',
          marginBottom:  16,
        }}>
          {OWNER_NAME}
        </h1>
        <div style={{
          fontFamily:   "'Space Mono', monospace",
          fontSize:      11,
          letterSpacing:  3,
          color:         'rgba(255,255,255,.3)',
          textTransform: 'uppercase',
        }}>
          Select your dimension ↓
        </div>
      </div>

      {/* ── Portal grid ── */}
      <div style={{
        display:               'grid',
        gridTemplateColumns:    isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap:                    isMobile ? 12 : 16,
        width:                 '100%',
        maxWidth:               800,
        position:              'relative',
        zIndex:                 2,
      }}>
        {PORTALS.map((p, i) => (
          <div
            key={p.id}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            onClick={() => navigateTo(p.id)}
            style={{
              background:  p.bg,
              border:     `1px solid ${hov === i ? p.clr + '55' : 'rgba(255,255,255,.06)'}`,
              borderRadius: 22,
              padding:      isMobile ? '22px 20px' : '32px 28px',
              cursor:      'pointer',
              position:    'relative',
              overflow:    'hidden',
              transform:   hov === i ? 'scale(1.042) translateY(-7px)' : 'scale(1) translateY(0)',
              boxShadow:   hov === i ? `0 24px 60px ${p.gc}, 0 0 0 1px ${p.clr}22` : '0 4px 20px rgba(0,0,0,.4)',
              transition:  'all .42s cubic-bezier(.23,1,.32,1)',
              animation:   `fadeUp .85s ${0.1 + i * 0.12}s ease both`,
            }}
          >
            {/* Glow floor */}
            <div style={{
              position:  'absolute', bottom: 0, left: 0, right: 0, height: '50%',
              background:`radial-gradient(ellipse at 50% 110%,${p.gc},transparent 70%)`,
              opacity:    hov === i ? 1 : 0,
              transition: 'opacity .4s ease',
            }} />

            {/* Scan bar */}
            {hov === i && (
              <div style={{
                position:  'absolute', left: 0, right: 0, height: 1,
                background:`linear-gradient(90deg,transparent,${p.clr}66,transparent)`,
                animation: 'scan 2.5s linear infinite',
              }} />
            )}

            {/* Pulse indicators */}
            <div style={{
              position:     'absolute', top: 18, right: 18,
              width: 8, height: 8, borderRadius: '50%',
              background:    p.clr,
              animation:    `breathe ${2.2 + i * 0.3}s ease-in-out infinite`,
            }} />
            <div style={{
              position:     'absolute', top: 12, right: 12,
              width: 20, height: 20, borderRadius: '50%',
              border:       `1px solid ${p.clr}`,
              opacity:       0.5,
              animation:    `ripple ${2.2 + i * 0.3}s ease-out infinite`,
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 26, marginBottom: 12, color: p.clr }}>{p.icon}</div>
              <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize: isMobile ? 18 : 20, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
                {p.label}
              </h2>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.38)', lineHeight: 1.8, marginBottom: 20 }}>
                {p.sub}
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:8, color:p.clr, fontSize:11, fontFamily:"'Space Mono',monospace", opacity:.8 }}>
                <span>Enter World</span>
                <span style={{ animation:'float 2s ease-in-out infinite' }}>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom hint ── */}
      <div style={{
        marginTop:     isMobile ? 24 : 40,
        fontFamily:   "'Space Mono', monospace",
        fontSize:       9,
        letterSpacing:  5,
        color:         'rgba(255,255,255,.16)',
        textTransform: 'uppercase',
        position:      'relative',
        zIndex:         2,
        animation:     'fadeIn 2s 1.4s ease both',
      }}>
        Scroll · Explore · Discover
      </div>
    </div>
  )
}
