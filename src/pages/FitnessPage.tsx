import { useState, useEffect, useRef } from 'react'
import { useWorld }         from '@/context/WorldContext'
import { useWindowSize }    from '@/hooks/useWindowSize'
import { BackButton }       from '@/components/ui/BackButton'
import { ProgressRing }     from '@/features/fitness/components/ProgressRing'
import { NutritionSection } from '@/features/fitness/components/NutritionSection'
import { RunnerScene }      from '@/features/fitness/components/RunnerScene'
import { PROGRAMS, CLIENT_STATS, CERTIFICATIONS } from '@/features/fitness/data'
import gsap from '@/lib/gsap'

const ACC  = '#FF4500'
const TABS = ['Training', 'Nutrition', 'About Me'] as const
type Tab   = typeof TABS[number]

// Parse numeric value and suffix from strings like '87%', '340+', '90%+'
const parseStatValue = (val: string): { num: number; suffix: string } => {
  const match = val.match(/^(\d+)([%+]*)$/)
  if (match) return { num: parseInt(match[1]), suffix: match[2] }
  return { num: 0, suffix: '' }
}

// Coaching pillars — replaces duplicated stat strip; complements the rings
const PILLARS: { title: string; sub: string }[] = [
  { title: 'Movement First', sub: 'Physio-led programming' },
  { title: 'Custom Macros',  sub: 'TDEE-calibrated nutrition' },
  { title: 'Weekly Check-ins', sub: 'Data-driven adjustments' },
  { title: 'Private 1:1 Chat', sub: 'Direct coach access' },
]

export const FitnessPage: React.FC = () => {
  const { navigateTo } = useWorld()
  const { isMobile }   = useWindowSize()
  const [tab, setTab]  = useState<Tab>('Training')
  const [energyLevel, setEnergyLevel] = useState(0)
  const programCardsRef = useRef<(HTMLDivElement | null)[]>([])

  // Program card stagger-in on mount
  useEffect(() => {
    const cards = programCardsRef.current.filter(Boolean) as HTMLDivElement[]
    if (cards.length === 0) return
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return
    const tween = gsap.fromTo(
      cards,
      { opacity: 0, y: 28, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.09, duration: 0.5, ease: 'back.out(1.4)' }
    )
    return () => { tween.kill() }
  }, [tab])

  return (
    <div style={{
      position:   'fixed',
      inset:       0,
      zIndex:      5,
      animation:  'worldIn .65s ease forwards',
      background: 'radial-gradient(ellipse at 50% 8%,rgba(40,6,0,.98) 0%,rgba(2,0,0,.99) 100%)',
      display:    'flex',
      flexDirection:'column',
      overflowY:  isMobile ? 'auto' : 'hidden',
      overflowX:  'hidden',
      WebkitOverflowScrolling: 'touch',
    }}>

      {/* Energy field animations */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 50%,rgba(255,69,0,.04) 0%,transparent 65%)', animation:'breathe 3.2s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,69,0,.007) 3px,rgba(255,69,0,.007) 6px)', pointerEvents:'none' }} />

      <BackButton onClick={() => navigateTo('hub')} accent="#FF4500" />

      {/* World label */}
      <div style={{ position:'absolute', top:24, left:'50%', transform:'translateX(-50%)', textAlign:'center', zIndex:10, pointerEvents:'none', whiteSpace:'nowrap' }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:6, color:'rgba(255,69,0,.45)', marginBottom:4 }}> STRENGTH </div>
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(18px,2.4vw,30px)', color:'#fff', letterSpacing:3 }}>Fitness & Weight Loss</h2>
      </div>

      {/* ── Runner Scene — full width, top of page ── */}
      <div style={{ paddingTop: 64, flexShrink: 0, position: 'relative', zIndex: 5 }}>
        <RunnerScene onSpeedChange={s => setEnergyLevel(s)} />
      </div>

      {/* Main layout */}
      <div style={{
        position:  'relative',
        zIndex:     5,
        flex:       isMobile ? '0 0 auto' : 1,
        display:   'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap:        isMobile ? 0 : 24,
        padding:    isMobile ? '12px 16px 32px' : '12px 4% 20px',
        overflow:  isMobile ? 'visible' : 'hidden',
        minHeight:  0,
      }}>

        {/* ── Left panel ── */}
        <div style={{
          flex:          isMobile ? '0 0 auto' : '0 0 38%',
          display:       'flex',
          flexDirection: 'column',
          gap:            isMobile ? 10 : 14,
          flexShrink:     0,
          minHeight:      0,
          maxHeight:      isMobile ? 'none' : '100%',
          overflowY:      isMobile ? 'visible' : 'auto',
          paddingRight:   isMobile ? 0 : 4,
        }}>
          {/* Hero text */}
          <div style={{ animation:'fadeUp .8s .2s ease both' }}>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(40px,5.5vw,70px)', color:'#fff', lineHeight:.88, letterSpacing:2, marginBottom:10 }}>
              TRANSFORM<br />
              <span style={{ background:'linear-gradient(135deg,#FF4500,#FF8C42)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>YOUR BODY</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,.38)', fontSize:12, lineHeight:1.9, maxWidth:360 }}>
              Science-backed coaching and personalised nutrition programming for sustainable body transformation.
            </p>
          </div>

          {/* Tab switcher */}
          <div style={{
            display:'flex', gap:8, flexWrap:'wrap', animation:'fadeUp .8s .35s ease both',
            position: isMobile ? 'sticky' : 'static',
            top: isMobile ? 0 : 'auto',
            zIndex: 6,
            padding: isMobile ? '10px 16px' : 0,
            marginLeft: isMobile ? -16 : 0,
            marginRight: isMobile ? -16 : 0,
            background: isMobile ? 'linear-gradient(to bottom, rgba(8,2,0,.96) 0%, rgba(8,2,0,.92) 70%, rgba(8,2,0,.7) 100%)' : 'transparent',
            backdropFilter: isMobile ? 'blur(10px)' : 'none',
            WebkitBackdropFilter: isMobile ? 'blur(10px)' : 'none',
          }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  padding:'7px 14px',
                  background:  tab===t ? 'rgba(255,69,0,.18)' : 'transparent',
                  border:     `1px solid ${tab===t ? 'rgba(255,69,0,.5)' : 'rgba(255,69,0,.16)'}`,
                  borderRadius: 100,
                  color:        tab===t ? ACC : 'rgba(255,255,255,.38)',
                  cursor:      'pointer',
                  fontFamily:  "'Space Mono',monospace",
                  fontSize:     10,
                  letterSpacing: 1.5,
                  textTransform:'uppercase',
                  transition:  'all .28s ease',
                }}
              >{t}</button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigateTo('contact')}
            style={{ padding:'12px 28px', background:'linear-gradient(135deg,#FF4500,#FF6B35)', border:'none', borderRadius:100, color:'#fff', cursor:'pointer', fontFamily:"'Bebas Neue',sans-serif", fontSize:17, letterSpacing:3, width:'fit-content', boxShadow:'0 8px 28px rgba(255,69,0,.3)', animation:'fadeUp .8s .65s ease both', transition:'transform .25s,box-shadow .25s', flexShrink:0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform='scale(1.05)'; (e.currentTarget as HTMLButtonElement).style.boxShadow='0 14px 40px rgba(255,69,0,.45)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform=''; (e.currentTarget as HTMLButtonElement).style.boxShadow='0 8px 28px rgba(255,69,0,.3)' }}
          >
            START TRANSFORMATION →
          </button>

          {/* Certs desktop */}
          {!isMobile && (
            <div style={{ borderTop:'1px solid rgba(255,69,0,.08)', paddingTop:12, animation:'fadeUp .8s .7s ease both', flexShrink:0, paddingBottom:8 }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:4, color:'rgba(255,69,0,.35)', marginBottom:8 }}>CERTIFICATIONS</div>
              {CERTIFICATIONS.map((c, i) => (
                <div key={c} style={{ padding:'6px 10px', background:'rgba(255,69,0,.03)', border:'1px solid rgba(255,69,0,.08)', borderRadius:8, color:'rgba(255,255,255,.45)', fontSize:10, display:'flex', gap:8, marginBottom:5, alignItems:'center', animation:`fadeUp .6s ${.7+i*.08}s ease both` }}>
                  <span style={{ color:ACC, fontWeight:700, flexShrink:0 }}>✓</span>{c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right scrollable content ── */}
        <div key={tab} style={{ flex: isMobile ? '0 0 auto' : 1, overflowY: isMobile ? 'visible' : 'auto', display:'flex', flexDirection:'column', gap:16, animation:'fadeIn .35s ease forwards', paddingRight: isMobile ? 0 : 4, paddingBottom:8 }}>

          {/* ── TRAINING TAB ── */}
          {tab === 'Training' && (
            <>
              {/* Rings — two true % stats, fat-loss shown as centred callout to avoid a tiny 10% arc */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:isMobile?14:28, flexWrap:'wrap', padding:'8px 0' }}>
                {(() => {
                  const goals    = CLIENT_STATS[0]
                  const fat      = CLIENT_STATS[1]
                  const feedback = CLIENT_STATS[2]
                  const goalsNum    = parseStatValue(goals.value).num
                  const feedbackNum = parseStatValue(feedback.value).num
                  return (
                    <>
                      <ProgressRing pct={goalsNum} color="#FF4500" size={140} label={goals.label} />
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, minWidth:96 }}>
                        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42, color:'#FF6B35', letterSpacing:1, lineHeight:1, textShadow:'0 0 18px rgba(255,107,53,.45)' }}>~{fat.value}</div>
                        <div style={{ fontSize:10, color:'rgba(255,255,255,.38)', textAlign:'center', fontFamily:"'Space Mono',monospace", maxWidth:120, lineHeight:1.55 }}>{fat.label}</div>
                      </div>
                      <ProgressRing pct={feedbackNum} color="#FF8C42" size={140} label={feedback.label} />
                    </>
                  )
                })()}
              </div>

              {/* Coaching pillars — what makes the programme different */}
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap:8 }}>
                {PILLARS.map((p, i) => (
                  <div
                    key={p.title}
                    style={{
                      padding:'10px 10px',
                      background:`rgba(255,69,0,${0.04 + energyLevel * 0.0003})`,
                      border:`1px solid rgba(255,69,0,${0.1 + energyLevel * 0.003})`,
                      borderRadius:10,
                      textAlign:'left',
                      animation:`fadeUp .6s ${.15 + i*.07}s ease both`,
                    }}
                  >
                    <div style={{ width:5, height:5, borderRadius:'50%', background:ACC, marginBottom:7, boxShadow:`0 0 8px ${ACC}`, animation:`breathe ${2.4 + i*.2}s ease-in-out infinite` }} />
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:13, color:'#fff', letterSpacing:1.2, lineHeight:1.1, marginBottom:3 }}>{p.title}</div>
                    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'rgba(255,255,255,.4)', letterSpacing:.5, lineHeight:1.4 }}>{p.sub}</div>
                  </div>
                ))}
              </div>

              {/* Program cards */}
              <div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:5, color:'rgba(255,69,0,.35)', marginBottom:10 }}>SIGNATURE PROGRAMS</div>
                <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(2,1fr)', gap:10 }}>
                  {PROGRAMS.map((p, i) => (
                    <div
                      key={p.name}
                      ref={el => { programCardsRef.current[i] = el }}
                      style={{ background:'rgba(255,69,0,.04)', border:`1px solid rgba(255,69,0,${0.14 + energyLevel * 0.003})`, borderRadius:15, padding:'14px', cursor:'pointer', transition:'border-color .32s, box-shadow .32s, transform .32s' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor='rgba(255,69,0,.44)'; el.style.transform='translateY(-5px)'; el.style.boxShadow='0 20px 40px rgba(255,69,0,.12)' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor=`rgba(255,69,0,${0.14 + energyLevel * 0.003})`; el.style.transform=''; el.style.boxShadow='' }}
                    >
                      <div style={{ width:6, height:6, borderRadius:'50%', background:p.color, marginBottom:8, animation:`breathe ${2+i*.25}s ease-in-out infinite` }} />
                      <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, color:'#fff', letterSpacing:1.5, marginBottom:4 }}>{p.name}</h3>
                      <p style={{ fontSize:11, color:'rgba(255,255,255,.38)', lineHeight:1.65, marginBottom:8 }}>{p.desc}</p>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, fontFamily:"'Space Mono',monospace" }}>
                        <span style={{ color:p.color }}>{p.intensity}</span>
                        <span style={{ color:'rgba(255,255,255,.25)' }}>{p.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── NUTRITION TAB ── */}
          {tab === 'Nutrition' && <NutritionSection />}

          {/* ── ABOUT TAB ── */}
          {tab === 'About Me' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16, animation:'fadeUp .5s ease both' }}>
              <div style={{ display:'flex', flexDirection: isMobile ? 'column' : 'row', gap:20, alignItems:'flex-start' }}>
                <div style={{
                  flex: isMobile ? '0 0 auto' : '0 0 200px',
                  width: isMobile ? '100%' : 200,
                  maxWidth: isMobile ? 240 : 200,
                  aspectRatio: '3 / 4',
                  borderRadius: 14,
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid rgba(255,69,0,.18)',
                  boxShadow: '0 18px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(255,69,0,.08)',
                  alignSelf: isMobile ? 'center' : 'flex-start',
                }}>
                  <img
                    src="/assets/WhatsApp%20Image%202026-04-28%20at%205.00.41%20AM.jpeg"
                    alt="Edison"
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', filter:'contrast(1.05) saturate(1.05)' }}
                  />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.55), transparent 50%)', pointerEvents:'none' }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:6, color:'rgba(255,69,0,.5)', marginBottom:10 }}>MY STORY</div>
                  <p style={{ color:'rgba(255,255,255,.5)', fontSize:13, lineHeight:2, maxWidth:520, marginBottom:14 }}>
                    What started as a personal journey from being 32kg overweight at age 19 became a lifelong obsession with human physiology and performance. After 5 years competing in natural bodybuilding and earning a sports science degree, I channelled everything into evidence-based coaching.
                  </p>
                  <p style={{ color:'rgba(255,255,255,.38)', fontSize:12.5, lineHeight:2, maxWidth:520 }}>
                    My physiotherapy background means I approach fitness differently — movement quality first, then intensity. Every programme is designed around longevity, not just aesthetics.
                  </p>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10 }}>
                {[
                  { label:'Natural Bodybuilder', sub:'5 competition seasons, 3 podiums' },
                  { label:'Sports Science BSc', sub:'First Class Honours, 2017' },
                  { label:'120+ Clients Supported', sub:'Online & in-person, multi-country' },
                  { label:'Online & In-Person', sub:'Lagos · London · Remote' },
                ].map(item => (
                  <div key={item.label} style={{ padding:'12px', background:'rgba(255,69,0,.04)', border:'1px solid rgba(255,69,0,.1)', borderRadius:12 }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:'#fff', marginBottom:3 }}>{item.label}</div>
                    <div style={{ fontSize:10.5, color:'rgba(255,255,255,.38)' }}>{item.sub}</div>
                  </div>
                ))}
              </div>

              {isMobile && (
                <div>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:4, color:'rgba(255,69,0,.35)', marginBottom:10 }}>CERTIFICATIONS</div>
                  {CERTIFICATIONS.map(c => (
                    <div key={c} style={{ padding:'8px 12px', background:'rgba(255,69,0,.03)', border:'1px solid rgba(255,69,0,.08)', borderRadius:8, color:'rgba(255,255,255,.45)', fontSize:11, display:'flex', gap:10, marginBottom:6, alignItems:'center' }}>
                      <span style={{ color:ACC, fontWeight:700 }}>✓</span>{c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom ambience */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:180, background:'linear-gradient(to top,rgba(255,69,0,.05),transparent)', pointerEvents:'none' }} />
    </div>
  )
}
