import { useState } from 'react'
import { useWorld } from '@/context/WorldContext'
import { useWindowSize } from '@/hooks/useWindowSize'
import type { WorldId } from '@/services/types'
import { OWNER_NAME } from '@/config/constants'
import ClickSpark from '@/components/ClickSpark'
import BlurText from '@/components/BlurText'

interface Portal {
  id: WorldId
  label: string
  sub: string
  icon: string
  clr: string
  gc: string
  bg: string
}

const PORTALS: Portal[] = [
  { id: 'physio', label: 'Physiotherapist', sub: 'Evidence-based healing & rehabilitation', icon: '01', clr: '#4FC3F7', gc: 'rgba(79,195,247,.22)', bg: 'linear-gradient(145deg,rgba(15,42,72,.9),rgba(2,8,20,.96))' },
  { id: 'dev', label: 'Software Developer', sub: 'Full-stack digital systems & architecture', icon: '02', clr: '#00FF88', gc: 'rgba(0,255,136,.20)', bg: 'linear-gradient(145deg,rgba(0,28,12,.9),rgba(0,4,1,.96))' },
  { id: 'fitness', label: 'Fitness & Weight Loss', sub: 'Science-driven body transformation', icon: '03', clr: '#FF4500', gc: 'rgba(255,69,0,.22)', bg: 'linear-gradient(145deg,rgba(40,8,0,.9),rgba(6,1,0,.96))' },
  { id: 'art', label: 'Visual Artist', sub: 'Expressive work across media & dimensions', icon: '04', clr: '#FF6B9D', gc: 'rgba(255,107,157,.20)', bg: 'linear-gradient(145deg,rgba(35,5,22,.9),rgba(6,1,4,.96))' },
]

export const HubPage: React.FC = () => {
  const { navigateTo } = useWorld()
  const [hov, setHov] = useState<number | null>(null)
  const { isMobile } = useWindowSize()

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '32px',
      animation: 'worldIn .7s ease forwards',
      overflowY: isMobile ? 'auto' : 'hidden',
    }}>

      {/* ── Background radial ── */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 42%,rgba(18,14,40,.94) 0%,rgba(0,0,0,.98) 100%)', pointerEvents: 'none' }} />

      {/* ── Real photo — dissolves at edges via mask ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '62vw' : '38vw',
          maxWidth: 540,
          aspectRatio: '3 / 4',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <img
          src="/portrait.jpg"
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            filter: 'grayscale(1) brightness(0.13) contrast(1.35)',
            maskImage: `radial-gradient(ellipse 78% 82% at 50% 38%, black 32%, transparent 78%)`,
            WebkitMaskImage: `radial-gradient(ellipse 78% 82% at 50% 38%, black 32%, transparent 78%)`,
          }}
        />
      </div>

      {/* ── Subtle portrait outer glow ── */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -52%)',
        width: isMobile ? '55vw' : '32vw',
        maxWidth: 480,
        aspectRatio: '1',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,.04) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
        animation: 'breathe 7s ease-in-out infinite',
      }} />

      {/* ── Corner world glows ── */}
      {PORTALS.map((p, i) => (
        <div key={p.id} style={{
          position: 'fixed',
          [i < 2 ? 'top' : 'bottom']: '-8%',
          [i % 2 === 0 ? 'left' : 'right']: '-8%',
          width: '38vw', height: '38vw',
          borderRadius: '50%',
          background: `radial-gradient(circle,${p.clr}06 0%,transparent 70%)`,
          pointerEvents: 'none',
          animation: `breathe ${3.5 + i * 0.6}s ${i * 0.4}s ease-in-out infinite`,
        }} />
      ))}

      {/* ── Header ── */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        marginBottom: isMobile ? 28 : 44,
        zIndex: 2,
        animation: 'fadeUp .9s ease forwards',
      }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          letterSpacing: 8,
          color: 'rgba(255,255,255,.26)',
          textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          Creative Portfolio
        </div>

        {/* BlurText animated title */}
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(46px,7.5vw,100px)',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 0.9,
          letterSpacing: '-2px',
          marginBottom: 16,
          margin: 0,
          padding: 0,
        }}>
          <BlurText
            text={OWNER_NAME}
            delay={80}
            animateBy="letters"
            direction="top"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(46px,7.5vw,100px)', fontWeight: 800, color: '#fff', lineHeight: 0.9, letterSpacing: '-2px', marginBottom: 16 }}
          />
        </h1>

        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: 3,
          color: 'rgba(255,255,255,.3)',
          textTransform: 'uppercase',
          marginTop: 16,
        }}>
          Select your dimension ↓
        </div>
      </div>

      {/* ── Portal grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? 12 : 16,
        width: '100%',
        maxWidth: 800,
        position: 'relative',
        zIndex: 2,
      }}>
        {PORTALS.map((p, i) => (
            <div
              key={p.id}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              onClick={() => navigateTo(p.id)}
              style={{
                background: p.bg,
                border: `1px solid ${hov === i ? p.clr + '55' : 'rgba(255,255,255,.06)'}`,
                borderRadius: 22,
                padding: isMobile ? '22px 20px' : '32px 28px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transform: hov === i ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hov === i ? `0 22px 48px ${p.gc}, 0 0 0 1px ${p.clr}22` : '0 4px 20px rgba(0,0,0,.4)',
                transition: 'all .55s cubic-bezier(.23,1,.32,1)',
                animation: `fadeUp .85s ${0.1 + i * 0.12}s ease both`,
              }}
            >
              {/* Glow floor */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                background: `radial-gradient(ellipse at 50% 110%,${p.gc},transparent 70%)`,
                opacity: hov === i ? 1 : 0,
                transition: 'opacity .4s ease',
              }} />

              {/* Scan bar */}
              {hov === i && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg,transparent,${p.clr}66,transparent)`,
                  animation: 'scan 2.5s linear infinite',
                }} />
              )}

              {/* Subtle status dot */}
              <div style={{
                position: 'absolute', top: 18, right: 18,
                width: 6, height: 6, borderRadius: '50%',
                background: p.clr,
                opacity: 0.55,
                animation: `breathe ${4 + i * 0.4}s ease-in-out infinite`,
              }} />

              <ClickSpark sparkColor={p.clr} sparkCount={10} sparkSize={8}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, marginBottom: 14, color: p.clr, opacity: 0.7 }}>{p.icon}</div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 18 : 20, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
                    {p.label}
                  </h2>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.38)', lineHeight: 1.8, marginBottom: 20 }}>
                    {p.sub}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: p.clr, fontSize: 11, fontFamily: "'Space Mono',monospace", opacity: .8 }}>
                    <span>Enter World</span>
                    <span style={{ animation: 'float 2s ease-in-out infinite' }}>→</span>
                  </div>
                </div>
              </ClickSpark>
            </div>
        ))}
      </div>

    </div>
  )
}
