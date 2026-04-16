import { useEffect, useRef } from 'react'
import { useWorld }      from '@/context/WorldContext'
import { useWindowSize } from '@/hooks/useWindowSize'
import { BackButton }    from '@/components/ui/BackButton'
import { GalleryCarousel } from '@/features/art/components/GalleryCarousel'
import gsap from '@/lib/gsap'

const ACC = '#FF6B9D'

export const ArtPage: React.FC = () => {
  const { navigateTo } = useWorld()
  const { isMobile }   = useWindowSize()
  const blob1Ref = useRef<HTMLDivElement>(null)
  const blob2Ref = useRef<HTMLDivElement>(null)
  const blob3Ref = useRef<HTMLDivElement>(null)

  // Blob morphing animation
  useEffect(() => {
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return
    const blobs = [blob1Ref.current, blob2Ref.current, blob3Ref.current].filter(Boolean) as HTMLDivElement[]
    const tween = gsap.to(blobs, {
      borderRadius: '55% 45% 62% 38% / 40% 58% 42% 60%',
      duration: 7,
      stagger: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    return () => { tween.kill() }
  }, [])

  return (
    <div style={{
      position:      'fixed',
      inset:          0,
      zIndex:         5,
      background:    '#FBF0E8',
      display:       'flex',
      flexDirection: isMobile ? 'column' : 'row',
      animation:     'worldIn .65s ease forwards',
      overflow:      'hidden',
    }}>

      {/* Paper grain */}
      <div style={{
        position:        'absolute',
        inset:            0,
        opacity:          0.048,
        pointerEvents:   'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        zIndex:           1,
      }} />

      {/* Ink blobs */}
      <div ref={blob1Ref} style={{ position:'absolute', top:'-8%', right:'-6%', width:280, height:280, borderRadius:'40% 60% 55% 45% / 45% 55% 40% 60%', background:'rgba(255,107,157,.07)', pointerEvents:'none', zIndex:1 }} />
      <div ref={blob2Ref} style={{ position:'absolute', bottom:'-10%', left:'-5%', width:320, height:320, borderRadius:'60% 40% 45% 55% / 55% 45% 60% 40%', background:'rgba(160,90,210,.05)', pointerEvents:'none', zIndex:1 }} />
      <div ref={blob3Ref} style={{ position:'absolute', top:'40%', right:'20%', width:180, height:180, borderRadius:'50%', background:'rgba(255,107,157,.04)', pointerEvents:'none', zIndex:1 }} />

      <BackButton onClick={() => navigateTo('hub')} accent="rgba(20,5,12,.9)" />

      {/* World label */}
      <div style={{ position:'absolute', top:24, left:'50%', transform:'translateX(-50%)', textAlign:'center', zIndex:10, pointerEvents:'none', whiteSpace:'nowrap' }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:6, color:'rgba(160,60,100,.45)', marginBottom:4 }}>WORLD 04</div>
        <h2 style={{ fontFamily:"'Caveat',cursive", fontSize:'clamp(22px,2.8vw,36px)', fontWeight:700, color:'#1a0810' }}>Visual Artistry</h2>
      </div>

      {/* ── Left info panel ── */}
      <div style={{
        flex:            isMobile ? '0 0 auto' : '0 0 26%',
        display:         'flex',
        flexDirection:   'column',
        justifyContent:  isMobile ? 'flex-start' : 'center',
        gap:              20,
        padding:          isMobile ? '72px 20px 0' : '80px 32px 32px',
        position:        'relative',
        zIndex:           5,
        animation:       'fadeUp .8s .25s ease both',
        flexShrink:       0,
        overflowY:        isMobile ? 'visible' : 'auto',
      }}>

        <div>
          <h1 style={{
            fontFamily:   "'Caveat', cursive",
            fontSize:     'clamp(42px,4.8vw,68px)',
            fontWeight:    700,
            color:        '#1a0810',
            lineHeight:    0.92,
            marginBottom:  14,
          }}>
            Visual<br />Stories
          </h1>

          {/* Animated ink underline */}
          <svg viewBox="0 0 175 14" width={175} height={14} style={{ overflow:'visible', marginBottom:16, display:'block' }}>
            <path d="M4 10 Q88 4 171 10" fill="none" stroke={ACC} strokeWidth={2.5} strokeLinecap="round"
              style={{ strokeDasharray:260, strokeDashoffset:260, animation:'drawStroke 1.4s .6s ease forwards' }} />
          </svg>

          <p style={{ color:'rgba(20,5,12,.44)', fontSize:13, lineHeight:1.9, fontFamily:"'Syne',sans-serif" }}>
            A creative practice spanning digital painting, generative art, mixed media, photography and oil on canvas. Each work is a conversation between intuition and craft.
          </p>
        </div>

        {/* Achievement list */}
        <div style={{ borderTop:'1px solid rgba(20,5,12,.1)', paddingTop:16 }}>
          {[
            '20+ Solo Exhibitions Worldwide',
            'Collected in 14 Countries',
            'Adobe Creative Residency 2023',
            '50K+ Online Art Followers',
            'Available for Commissions',
          ].map((s, i) => (
            <div key={s} style={{ padding:'9px 0', borderBottom:'1px solid rgba(20,5,12,.06)', color:'rgba(20,5,12,.48)', fontSize:12, display:'flex', alignItems:'center', gap:10, animation:`fadeUp .55s ${.4+i*.08}s ease both` }}>
              <span style={{ color:ACC, fontFamily:"'Caveat',cursive", fontSize:22, lineHeight:1, flexShrink:0 }}>✦</span>{s}
            </div>
          ))}
        </div>

        {!isMobile && (
          <>
            <button
              onClick={() => navigateTo('contact')}
              style={{ padding:'12px 26px', background:'#1a0810', border:'none', borderRadius:100, color:'#FBF0E8', cursor:'pointer', fontFamily:"'Caveat',cursive", fontSize:18, transition:'all .3s', width:'fit-content', animation:'fadeUp .8s .85s ease both' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background=ACC; el.style.transform='scale(1.04)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background='#1a0810'; el.style.transform='' }}
            >
              Commission Work ✦
            </button>

            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:3.5, color:'rgba(20,5,12,.28)', lineHeight:1.8, animation:'fadeUp .8s 1s ease both' }}>
              ← Drag · Swipe · Scroll<br />to navigate the gallery
            </div>
          </>
        )}
      </div>

      {/* ── Gallery carousel ── */}
      <div style={{
        flex:       1,
        display:   'flex',
        flexDirection:'column',
        overflow:  'hidden',
        padding:    isMobile ? '16px 0 16px' : '72px 24px 20px 0',
        position:  'relative',
        zIndex:     5,
        minWidth:   0,
      }}>
        <GalleryCarousel />
      </div>

    </div>
  )
}
