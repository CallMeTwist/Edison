import { useState, useRef, useCallback, useEffect } from 'react'
import { ARTWORKS } from '../data'
import { ArtShapeEl } from './ArtShape'
import { useWindowSize } from '@/hooks/useWindowSize'
import { useWorld } from '@/context/WorldContext'
import gsap from '@/lib/gsap'

export const GalleryCarousel: React.FC = () => {
  const [active, setActive]     = useState(0)
  const [dragging, setDragging] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const dragStart               = useRef(0)
  const dragDelta               = useRef(0)
  const didDrag                 = useRef(false)
  const { isMobile }            = useWindowSize()
  const { navigateTo }          = useWorld()
  const containerRef            = useRef<HTMLDivElement>(null)
  const borderRefs              = useRef<(SVGRectElement | null)[]>([])
  const titleRef                = useRef<HTMLHeadingElement>(null)
  const underlineRef            = useRef<SVGPathElement>(null)
  const infoPanelRef            = useRef<HTMLDivElement>(null)

  const total = ARTWORKS.length

  const prev = useCallback(() => setActive(a => Math.max(0, a - 1)), [])
  const next = useCallback(() => setActive(a => Math.min(total - 1, a + 1)), [total])

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightbox) { setLightbox(false); return }
      if (lightbox) return
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, lightbox])

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
    didDrag.current = false
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    dragDelta.current = e.clientX - dragStart.current
    if (Math.abs(dragDelta.current) > 6) didDrag.current = true
  }
  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)
    const threshold = 60
    if (dragDelta.current < -threshold) next()
    else if (dragDelta.current > threshold) prev()
    dragDelta.current = 0
  }

  /* DrawSVG border animation on active card change */
  useEffect(() => {
    const borderEl = borderRefs.current[active]
    if (!borderEl) return
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return
    const tween = gsap.fromTo(borderEl, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'power1.inOut' })
    return () => { tween.kill() }
  }, [active])

  /* Title animation on active change */
  useEffect(() => {
    if (!titleRef.current) return
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return
    const tween = gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 12, skewX: 3 },
      { opacity: 1, y: 0, skewX: 0, duration: 0.42, ease: 'power3.out' }
    )
    return () => { tween.kill() }
  }, [active])

  /* Underline DrawSVG on active change */
  useEffect(() => {
    if (!underlineRef.current) return
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return
    const tween = gsap.fromTo(
      underlineRef.current,
      { drawSVG: '0%' },
      { drawSVG: '100%', duration: 1.3, delay: 0.2, ease: 'power2.out' }
    )
    return () => { tween.kill() }
  }, [active])

  /* Ink spread on info panel when active changes */
  useEffect(() => {
    if (!infoPanelRef.current) return
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return
    const tween = gsap.fromTo(
      infoPanelRef.current,
      { clipPath: 'circle(0% at 50% 0%)' },
      { clipPath: 'circle(140% at 50% 0%)', duration: 0.65, ease: 'power2.out' }
    )
    return () => { tween.kill() }
  }, [active])

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
              onClick={() => { if (didDrag.current) return; if (offset !== 0) setActive(i); else setLightbox(true) }}
              onMouseEnter={offset !== 0 ? () => {
                const borderEl = borderRefs.current[i]
                if (borderEl) {
                  gsap.fromTo(borderEl,
                    { drawSVG: '0%', opacity: 0.45 },
                    { drawSVG: '40%', duration: 0.5, ease: 'power2.out', opacity: 0.45 }
                  )
                }
              } : undefined}
              onMouseLeave={offset !== 0 ? () => {
                const borderEl = borderRefs.current[i]
                if (borderEl) {
                  gsap.to(borderEl, { drawSVG: '0%', opacity: 0, duration: 0.3, ease: 'power2.in' })
                }
              } : undefined}
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
              {/* Artwork image — fills the card */}
              {art.image ? (
                <img
                  src={art.image}
                  alt={art.title}
                  draggable={false}
                  loading="lazy"
                  style={{
                    position:    'absolute',
                    inset:        0,
                    width:       '100%',
                    height:      '100%',
                    objectFit:   'cover',
                    objectPosition: 'center',
                    display:     'block',
                    pointerEvents: 'none',
                  }}
                />
              ) : (
                <ArtShapeEl
                  shape={art.shape}
                  h1={art.colors.h1}
                  h2={art.colors.h2}
                  index={i}
                />
              )}

              {/* Sketch border — GSAP DrawSVG (active) / hover (non-active) */}
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                viewBox="0 0 100 100" preserveAspectRatio="none"
              >
                <rect
                  ref={el => { borderRefs.current[i] = el }}
                  x={1.5} y={1.5} width={97} height={97} rx={6}
                  fill="none" stroke={art.colors.h1} strokeWidth={0.8}
                  strokeDasharray="6 3" opacity={offset === 0 ? 0.55 : 0}
                />
              </svg>

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

              {/* Bottom gradient label */}
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
        ref={infoPanelRef}
        style={{
          flex:      1,
          overflow:  'hidden auto',
          padding:   '0 4px',
        }}
      >
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          {/* Counter */}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 6, color: 'rgba(255,107,157,.45)', marginBottom: 8 }}>
            {active + 1} / {total}
          </div>

          {/* Title — GSAP animated */}
          <h2
            ref={titleRef}
            style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 'clamp(26px,3.5vw,44px)', color: '#1a0810', lineHeight: 1, marginBottom: 4 }}
          >
            {artwork.title}
          </h2>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(20,5,12,.45)', marginBottom: 14 }}>
            {artwork.medium} · {artwork.year}
            {artwork.dimensions && ` · ${artwork.dimensions}`}
          </div>

          {/* SVG underline — GSAP DrawSVG */}
          <svg viewBox="0 0 160 12" width={160} height={12} style={{ marginBottom: 14, overflow: 'visible' }}>
            <path
              ref={underlineRef}
              d={`M4 8 Q80 3 156 8`}
              fill="none"
              stroke={artwork.colors.h1}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>

          <p style={{ color: 'rgba(20,5,12,.52)', fontSize: 13.5, lineHeight: 1.9, marginBottom: 16 }}>
            {artwork.description}
          </p>

          {/* Action row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {artwork.available && (
              <button
                onClick={() => navigateTo('contact', {
                  service: 'Art Commission',
                  message:
                    `Hi Edison — I'd like to enquire about purchasing "${artwork.title}" ` +
                    `(${artwork.medium}, ${artwork.year}` +
                    `${artwork.dimensions ? `, ${artwork.dimensions}` : ''}). ` +
                    `Could you share availability and pricing?`,
                })}
                style={{
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
            <button
              onClick={() => setLightbox(true)}
              style={{
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

      {/* ── Lightbox modal ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(8,3,6,.88)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? 16 : 48,
            animation: 'fadeIn .35s ease both',
            cursor: 'zoom-out',
          }}
        >
          {/* paper grain over modal */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />

          {/* close button */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(false) }}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 20, right: 20,
              width: 42, height: 42, borderRadius: '50%',
              border: `1px solid ${artwork.colors.h1}55`,
              background: 'rgba(20,5,12,.55)',
              color: '#FBF0E8',
              cursor: 'pointer',
              fontSize: 20, lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Mono',monospace",
              transition: 'all .25s ease',
              zIndex: 2,
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background = artwork.colors.h1; el.style.borderColor = artwork.colors.h1 }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(20,5,12,.55)'; el.style.borderColor = `${artwork.colors.h1}55` }}
          >
            ×
          </button>

          {/* prev */}
          {active > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Previous"
              style={{
                position: 'absolute',
                left: isMobile ? 8 : 24,
                top: '50%', transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: '50%',
                border: `1px solid rgba(255,255,255,.18)`,
                background: 'rgba(20,5,12,.55)',
                color: '#FBF0E8', cursor: 'pointer', fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}
            >←</button>
          )}

          {/* next */}
          {active < total - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Next"
              style={{
                position: 'absolute',
                right: isMobile ? 8 : 24,
                top: '50%', transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: '50%',
                border: `1px solid rgba(255,255,255,.18)`,
                background: 'rgba(20,5,12,.55)',
                color: '#FBF0E8', cursor: 'pointer', fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}
            >→</button>
          )}

          {/* content */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: 1100,
              width: '100%',
              maxHeight: '100%',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 16 : 28,
              alignItems: 'center',
              cursor: 'auto',
              animation: 'fadeUp .45s ease both',
            }}
          >
            <div style={{
              flex: isMobile ? '0 1 auto' : '1 1 auto',
              maxHeight: isMobile ? '60vh' : '88vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 0,
            }}>
              <img
                src={artwork.image}
                alt={artwork.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: isMobile ? '60vh' : '88vh',
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: `0 30px 80px rgba(0,0,0,.7), 0 0 0 1px ${artwork.colors.h1}33`,
                  display: 'block',
                }}
              />
            </div>

            <div style={{
              flex: isMobile ? '0 0 auto' : '0 0 280px',
              color: '#FBF0E8',
              fontFamily: "'Syne',sans-serif",
              maxWidth: isMobile ? '100%' : 280,
            }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: 6, color: `${artwork.colors.h1}cc`, marginBottom: 10 }}>
                {String(active + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}
              </div>
              <h3 style={{
                fontFamily: "'Caveat',cursive",
                fontSize: 'clamp(28px,3.6vw,42px)',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1, marginBottom: 6,
              }}>{artwork.title}</h3>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'rgba(255,255,255,.5)', marginBottom: 14 }}>
                {artwork.medium} · {artwork.year}{artwork.dimensions && ` · ${artwork.dimensions}`}
              </div>
              <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, lineHeight: 1.85 }}>
                {artwork.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
