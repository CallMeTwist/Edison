import { useState, useEffect, useRef } from 'react'
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

const PROXIMITY_RADIUS = 420
const DIM_OPACITY = 0.22
const DIM_BLUR = 2.2

export const HubPage: React.FC = () => {
  const { navigateTo } = useWorld()
  const [hov, setHov] = useState<number | null>(null)
  const { isMobile } = useWindowSize()
  const portalRefs = useRef<(HTMLDivElement | null)[]>([])
  const [proximity, setProximity] = useState<number[]>([0, 0, 0, 0])
  const [scrollHinted, setScrollHinted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  /* Desktop: cursor-proximity bloom */
  useEffect(() => {
    if (isMobile) return
    let raf = 0
    let mx = -9999, my = -9999
    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!scrollHinted) setScrollHinted(true)
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onLeave = () => {
      mx = -9999; my = -9999
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const tick = () => {
      raf = 0
      const next = PORTALS.map((_, i) => {
        const el = portalRefs.current[i]
        if (!el) return 0
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const d = Math.hypot(mx - cx, my - cy)
        return Math.max(0, 1 - d / PROXIMITY_RADIUS)
      })
      setProximity(next)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [isMobile, scrollHinted])

  /* Mobile: hint dismisses on first scroll */
  useEffect(() => {
    if (!isMobile) return
    const el = containerRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (el.scrollTop > 12) setScrollHinted(true)
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => { el.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [isMobile])

  const portalOpacity = (i: number) => {
    if (isMobile) return 1
    return DIM_OPACITY + (1 - DIM_OPACITY) * proximity[i]
  }
  const portalBlur = (i: number) => {
    if (isMobile) return 0
    return DIM_BLUR * (1 - proximity[i])
  }

  return (
    <div ref={containerRef} style={{
      position: 'fixed',
      inset: 0,
      zIndex: 5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: isMobile ? 'flex-start' : 'center',
      padding: isMobile ? '16px' : '32px',
      animation: 'worldIn .7s ease forwards',
      overflowY: isMobile ? 'auto' : 'hidden',
      WebkitOverflowScrolling: 'touch',
      overscrollBehavior: 'contain',
    }}>

      {/* ── Background radial ── */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 42%,rgba(46,32,58,.92) 0%,rgba(14,10,18,.97) 60%,rgba(4,2,6,.99) 100%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── Hero wrapper (mobile only): pins halo/photo/header to first 100dvh, so cards below are reached only by scroll ── */}
      <div style={isMobile
        ? { position: 'relative', width: '100%', height: '100dvh', flex: '0 0 auto', overflow: 'hidden' }
        : { display: 'contents' }
      }>

      {/* ── Portrait halo ── */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '50%' : '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '92vw' : '56vw',
        maxWidth: 780,
        aspectRatio: '3 / 4',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse 60% 70% at 50% 40%, rgba(120,90,120,.18) 0%, rgba(60,40,70,.08) 45%, transparent 75%)',
        pointerEvents: 'none',
        zIndex: 1,
        animation: 'breathe 7s ease-in-out infinite',
        filter: 'blur(20px)',
      }} />

      {/* ── Real photo ── */}
      <div
        style={{
          position: 'absolute',
          top: isMobile ? '54%' : '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '82vw' : '50vw',
          maxWidth: 720,
          aspectRatio: '3 / 4',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <img
          src="/edisonn.jpeg"
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            filter: 'grayscale(1) brightness(0.78) contrast(1.15)',
            maskImage: `radial-gradient(ellipse 68% 76% at 50% 38%, black 32%, transparent 82%)`,
            WebkitMaskImage: `radial-gradient(ellipse 68% 76% at 50% 38%, black 32%, transparent 82%)`,
            opacity: 0.62,
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 55% at 50% 35%, rgba(150,90,120,.14), transparent 72%)',
          pointerEvents: 'none',
          mixBlendMode: 'soft-light',
        }} />
      </div>

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
        position: isMobile ? 'absolute' : 'relative',
        top: isMobile ? '7vh' : 'auto',
        left: isMobile ? 0 : 'auto',
        right: isMobile ? 0 : 'auto',
        textAlign: 'center',
        marginTop: isMobile ? 0 : 0,
        marginBottom: isMobile ? 0 : 44,
        zIndex: 5,
        animation: 'fadeUp .9s ease forwards',
        width: isMobile ? '100%' : '100%',
        pointerEvents: 'none',
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

        {/* Ambient hint — fades out once user interacts */}
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: 3,
          color: 'rgba(255,255,255,.42)',
          textTransform: 'uppercase',
          marginTop: 22,
          opacity: scrollHinted ? 0 : 1,
          transition: 'opacity .6s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}>
          {isMobile ? (
            <>
              <span style={{ animation: 'float 2s ease-in-out infinite' }}>↓</span>
              <span>Scroll to explore</span>
            </>
          ) : (
            <>
              <span>Move cursor to discover</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,.5)', animation: 'breathe 2s ease-in-out infinite' }} />
            </>
          )}
        </div>
      </div>

      </div>{/* end hero wrapper */}

      {/* ── Portal grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? 12 : 16,
        width: isMobile ? '100%' : '100%',
        maxWidth: 800,
        position: 'relative',
        zIndex: isMobile ? 6 : 2,
        marginTop: isMobile ? 0 : 0,
        marginBottom: isMobile ? 28 : 0,
        flex: '0 0 auto',
      }}>
        {PORTALS.map((p, i) => {
          const op = portalOpacity(i)
          const bl = portalBlur(i)
          const lit = !isMobile && proximity[i] > 0.25
          return (
            <div
              key={p.id}
              ref={el => { portalRefs.current[i] = el }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              onClick={() => navigateTo(p.id)}
              style={{
                background: p.bg,
                border: `1px solid ${hov === i || lit ? p.clr + '55' : 'rgba(255,255,255,.06)'}`,
                borderRadius: isMobile ? 16 : 22,
                padding: isMobile ? '18px 20px' : '32px 28px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                opacity: op,
                filter: bl > 0.05 ? `blur(${bl}px)` : 'none',
                transform: hov === i ? 'translateY(-4px)' : 'translateY(0)',
                transformOrigin: 'center',
                boxShadow: hov === i
                  ? `0 22px 48px ${p.gc}, 0 0 0 1px ${p.clr}22`
                  : '0 4px 20px rgba(0,0,0,.4)',
                transition: 'opacity .35s ease, filter .35s ease, transform .55s cubic-bezier(.23,1,.32,1), border-color .35s ease, box-shadow .55s ease',
                animation: `fadeUp .85s ${0.1 + i * 0.12}s ease both`,
              }}
            >
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                background: `radial-gradient(ellipse at 50% 110%,${p.gc},transparent 70%)`,
                opacity: hov === i || (!isMobile && proximity[i] > 0.5) ? 1 : 0,
                transition: 'opacity .4s ease',
              }} />

              {(hov === i || (!isMobile && proximity[i] > 0.6)) && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg,transparent,${p.clr}66,transparent)`,
                  animation: 'scan 2.5s linear infinite',
                }} />
              )}

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
                    <span>Explore</span>
                    <span style={{ animation: 'float 2s ease-in-out infinite' }}>→</span>
                  </div>
                </div>
              </ClickSpark>
            </div>
          )
        })}
      </div>

    </div>
  )
}
