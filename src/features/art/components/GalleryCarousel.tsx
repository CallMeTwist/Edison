import { useState, useRef, useCallback, useEffect } from 'react'
import { ARTWORKS } from '../data'
import { ArtShapeEl } from './ArtShape'
import { useWindowSize } from '@/hooks/useWindowSize'

export const GalleryCarousel: React.FC = () => {
  const [active, setActive]     = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragStart               = useRef(0)
  const dragDelta               = useRef(0)
  const { isMobile }            = useWindowSize()
  const containerRef            = useRef<HTMLDivElement>(null)

  const total = ARTWORKS.length

  const prev = useCallback(() => setActive(a => Math.max(0, a - 1)), [])
  const next = useCallback(() => setActive(a => Math.min(total - 1, a + 1)), [total])

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  /* Wheel navigation */
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaX > 18 || e.deltaY > 18)  next()
    if (e.deltaX < -18 || e.deltaY < -18) prev()
  }

  /* Drag / touch */
  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true)
    dragStart.current = e.clientX
    dragDelta.current = 0
    containerRef.current?.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    dragDelta.current = e.clientX - dragStart.current
  }
  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)
    const threshold = 60
    if (dragDelta.current < -threshold) next()
    else if (dragDelta.current > threshold) prev()
    dragDelta.current = 0
  }

  const artwork = ARTWORKS[active]

  /* Card geometry */
  const CARD_W = isMobile ? 220 : 300
  const CARD_H = isMobile ? 300 : 420
  const GAP    = isMobile ?  20 :  32

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', gap: 24 }}>

      {/* ── Carousel track ── */}
      <div
        className="gallery-carousel"
        ref={containerRef}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position:      'relative',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          height:         CARD_H + 80,
          perspective:   '1200px',
          cursor:         dragging ? 'grabbing' : 'grab',
          userSelect:    'none',
          flexShrink:     0,
        }}
      >
        {ARTWORKS.map((art, i) => {
          const offset = i - active
          const absOff = Math.abs(offset)
          const visible = absOff <= 3

          if (!visible) return null

          /* 3D coverflow transforms */
          const translateX = offset * (CARD_W + GAP)
          const rotateY    = offset === 0 ? 0 : offset < 0 ? 42 : -42
          const scale      = offset === 0 ? 1 : offset === 1 || offset === -1 ? 0.78 : 0.62
          const zIndex     = 20 - absOff
          const opacity    = absOff === 0 ? 1 : absOff === 1 ? 0.72 : absOff === 2 ? 0.45 : 0.2
          const brightness = absOff === 0 ? 1 : 0.55

          return (
            <div
              key={art.id}
              onClick={() => { if (offset !== 0) setActive(i) }}
              style={{
                position:  'absolute',
                width:      CARD_W,
                height:     CARD_H,
                borderRadius: 18,
                overflow:  'hidden',
                transform: `
                  translateX(${translateX}px)
                  rotateY(${rotateY}deg)
                  scale(${scale})
                `,
                transformOrigin: 'center center',
                transition:  dragging
                  ? 'none'
                  : 'transform .55s cubic-bezier(.23,1,.32,1), opacity .55s ease, filter .55s ease',
                zIndex,
                opacity,
                filter:    `brightness(${brightness})`,
                cursor:    offset !== 0 ? 'pointer' : 'grab',
                boxShadow: offset === 0
                  ? `0 32px 80px rgba(0,0,0,.6), 0 0 0 1px ${art.colors.h1}33`
                  : '0 12px 40px rgba(0,0,0,.4)',
                background: `linear-gradient(145deg, ${art.colors.h1}18, ${art.colors.h2}0c, rgba(10,5,18,.92))`,
              }}
            >
              {/* Generative art fill */}
              <ArtShapeEl
                shape={art.shape}
                h1={art.colors.h1}
                h2={art.colors.h2}
                index={i}
              />

              {/* Sketch border on active */}
              {offset === 0 && (
                <svg
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                  viewBox="0 0 100 100" preserveAspectRatio="none"
                >
                  <rect x={1.5} y={1.5} width={97} height={97} rx={6}
                    fill="none" stroke={art.colors.h1} strokeWidth={0.8}
                    strokeDasharray="6 3" opacity={0.55}
                    style={{
                      strokeDashoffset: 500,
                      animation:        'drawStroke 1.6s ease forwards',
                    }}
                  />
                </svg>
              )}

              {/* Available badge */}
              {art.available && offset === 0 && (
                <div style={{
                  position:     'absolute',
                  top:           14,
                  left:          14,
                  padding:      '3px 10px',
                  background:   'rgba(76,175,80,.15)',
                  border:       '1px solid rgba(76,175,80,.4)',
                  borderRadius:  100,
                  color:        '#81C784',
                  fontSize:      9,
                  fontFamily:   "'Space Mono', monospace",
                  letterSpacing: 1,
                }}>
                  FOR SALE
                </div>
              )}

              {/* Bottom gradient label (always visible) */}
              <div style={{
                position:   'absolute',
                inset:       0,
                background: 'linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.3) 45%, transparent 100%)',
                display:    'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding:    '18px 16px',
              }}>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 4 }}>
                  {art.title}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,.5)' }}>
                  {art.medium} · {art.year}
                </div>
              </div>

              {/* Corner dot */}
              <div style={{
                position:     'absolute',
                top:           12,
                right:         12,
                width:          8,
                height:         8,
                borderRadius: '50%',
                background:    art.colors.h1,
                animation:    `breathe ${2 + i * 0.3}s ease-in-out infinite`,
                boxShadow:    `0 0 8px ${art.colors.h1}`,
              }} />
            </div>
          )
        })}
      </div>

      {/* ── Info panel for active artwork ── */}
      <div
        key={active}
        style={{
          flex:      1,
          overflow:  'hidden auto',
          padding:   '0 4px',
          animation: 'inkReveal .4s ease forwards',
        }}
      >
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          {/* Title */}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 6, color: 'rgba(255,107,157,.45)', marginBottom: 8 }}>
            {active + 1} / {total}
          </div>
          <h2 style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 'clamp(26px,3.5vw,44px)', color: '#1a0810', lineHeight: 1, marginBottom: 4 }}>
            {artwork.title}
          </h2>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(20,5,12,.45)', marginBottom: 14 }}>
            {artwork.medium} · {artwork.year}
            {artwork.dimensions && ` · ${artwork.dimensions}`}
          </div>

          {/* SVG underline */}
          <svg viewBox="0 0 160 12" width={160} height={12} style={{ marginBottom: 14, overflow: 'visible' }}>
            <path d={`M4 8 Q80 3 156 8`} fill="none" stroke={artwork.colors.h1} strokeWidth={2}
              strokeLinecap="round"
              style={{ strokeDasharray: 220, strokeDashoffset: 220, animation: 'drawStroke 1.2s .2s ease forwards' }}
            />
          </svg>

          <p style={{ color: 'rgba(20,5,12,.52)', fontSize: 13.5, lineHeight: 1.9, marginBottom: 16 }}>
            {artwork.description}
          </p>

          {/* Action row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {artwork.available && (
              <button style={{
                padding:      '10px 22px',
                background:    '#1a0810',
                border:       'none',
                borderRadius:  100,
                color:        '#FBF0E8',
                cursor:       'pointer',
                fontFamily:   "'Caveat', cursive",
                fontSize:      17,
                transition:   'all .3s ease',
              }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.background = artwork.colors.h1; el.style.transform = 'scale(1.04)' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.background = '#1a0810'; el.style.transform = '' }}
              >
                Enquire to Purchase ✦
              </button>
            )}
            <button style={{
              padding:      '10px 22px',
              background:    'transparent',
              border:       `1px solid rgba(20,5,12,.18)`,
              borderRadius:  100,
              color:        'rgba(20,5,12,.55)',
              cursor:       'pointer',
              fontFamily:   "'Space Mono', monospace",
              fontSize:      10,
              letterSpacing:  1,
              textTransform: 'uppercase',
              transition:   'all .3s ease',
            }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = artwork.colors.h1; el.style.color = artwork.colors.h1 }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(20,5,12,.18)'; el.style.color = 'rgba(20,5,12,.55)' }}
            >
              View Full Res
            </button>
          </div>
        </div>
      </div>

      {/* ── Navigation controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexShrink: 0, paddingBottom: 8 }}>
        <button
          onClick={prev}
          disabled={active === 0}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            border:      '1px solid rgba(20,5,12,.15)',
            background:   'transparent',
            cursor:        active === 0 ? 'not-allowed' : 'pointer',
            color:        'rgba(20,5,12,.55)',
            fontSize:      18,
            opacity:       active === 0 ? 0.25 : 1,
            transition:   'all .25s ease',
            display:      'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ←
        </button>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {ARTWORKS.map((art, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width:        i === active ? 20 : 6,
                height:       6,
                borderRadius:  3,
                border:       'none',
                cursor:       'pointer',
                padding:       0,
                background:    i === active ? art.colors.h1 : 'rgba(20,5,12,.2)',
                transition:   'all .35s cubic-bezier(.23,1,.32,1)',
                boxShadow:     i === active ? `0 0 8px ${art.colors.h1}` : 'none',
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={active === total - 1}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            border:      '1px solid rgba(20,5,12,.15)',
            background:   'transparent',
            cursor:        active === total - 1 ? 'not-allowed' : 'pointer',
            color:        'rgba(20,5,12,.55)',
            fontSize:      18,
            opacity:       active === total - 1 ? 0.25 : 1,
            transition:   'all .25s ease',
            display:      'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          →
        </button>
      </div>
    </div>
  )
}
