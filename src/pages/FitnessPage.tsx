import { useState } from 'react'
import { useWorld }         from '@/context/WorldContext'
import { useWindowSize }    from '@/hooks/useWindowSize'
import { BackButton }       from '@/components/ui/BackButton'
import { ProgressRing }     from '@/features/fitness/components/ProgressRing'
import { NutritionSection } from '@/features/fitness/components/NutritionSection'
import { PROGRAMS, CLIENT_STATS, CERTIFICATIONS } from '@/features/fitness/data'

const ACC  = '#FF4500'
const TABS = ['Training', 'Nutrition', 'About Me'] as const
type Tab   = typeof TABS[number]

export const FitnessPage: React.FC = () => {
  const { navigateTo } = useWorld()
  const { isMobile }   = useWindowSize()
  const [tab, setTab]  = useState<Tab>('Training')

  return (
    <div style={{
      position:   'fixed',
      inset:       0,
      zIndex:      5,
      animation:  'worldIn .65s ease forwards',
      background: 'radial-gradient(ellipse at 50% 8%,rgba(40,6,0,.98) 0%,rgba(2,0,0,.99) 100%)',
      display:    'flex',
      flexDirection:'column',
      overflow:   'hidden',
    }}>

      {/* Energy field animations */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 50%,rgba(255,69,0,.04) 0%,transparent 65%)', animation:'breathe 3.2s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,69,0,.007) 3px,rgba(255,69,0,.007) 6px)', pointerEvents:'none' }} />

      <BackButton onClick={() => navigateTo('hub')} accent={ACC} />

      {/* World label */}
      <div style={{ position:'absolute', top:24, left:'50%', transform:'translateX(-50%)', textAlign:'center', zIndex:10, pointerEvents:'none', whiteSpace:'nowrap' }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:6, color:'rgba(255,69,0,.45)', marginBottom:4 }}>WORLD 03</div>
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(18px,2.4vw,30px)', color:'#fff', letterSpacing:3 }}>Fitness & Weight Loss</h2>
      </div>

      {/* Main layout */}
      <div style={{
        position:  'relative',
        zIndex:     5,
        height:    '100%',
        display:   'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap:        isMobile ? 0 : 24,
        padding:    isMobile ? '72px 16px 16px' : '72px 4% 20px',
        overflow:  'hidden',
      }}>

        {/* ── Left panel — always visible header + tabs ── */}
        <div style={{
          flex:          isMobile ? '0 0 auto' : '0 0 38%',
          display:       'flex',
          flexDirection: 'column',
          gap:            isMobile ? 12 : 16,
          flexShrink:     0,
        }}>
          {/* Hero text */}
          <div style={{ animation:'fadeUp .8s .2s ease both' }}>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(48px,6vw,76px)', color:'#fff', lineHeight:.88, letterSpacing:2, marginBottom:14 }}>
              TRANSFORM<br />
              <span style={{ background:'linear-gradient(135deg,#FF4500,#FF8C42)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>YOUR BODY</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,.38)', fontSize:13, lineHeight:1.9, maxWidth:380 }}>
              Science-backed coaching and personalised nutrition programming for sustainable body transformation. No fads — only evidence-based results.
            </p>
          </div>

          {/* Tab switcher */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', animation:'fadeUp .8s .35s ease both' }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  padding:'7px 16px',
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
            style={{ padding:'14px 34px', background:'linear-gradient(135deg,#FF4500,#FF6B35)', border:'none', borderRadius:100, color:'#fff', cursor:'pointer', fontFamily:"'Bebas Neue',sans-serif", fontSize:19, letterSpacing:3, width:'fit-content', boxShadow:'0 8px 28px rgba(255,69,0,.3)', animation:'fadeUp .8s .65s ease both', transition:'transform .25s,box-shadow .25s', flexShrink:0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform='scale(1.05)'; (e.currentTarget as HTMLButtonElement).style.boxShadow='0 14px 40px rgba(255,69,0,.45)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform=''; (e.currentTarget as HTMLButtonElement).style.boxShadow='0 8px 28px rgba(255,69,0,.3)' }}
          >
            START TRANSFORMATION →
          </button>

          {/* Certs (always visible in left col on desktop) */}
          {!isMobile && (
            <div style={{ borderTop:'1px solid rgba(255,69,0,.08)', paddingTop:16, animation:'fadeUp .8s .7s ease both' }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:4, color:'rgba(255,69,0,.35)', marginBottom:10 }}>CERTIFICATIONS</div>
              {CERTIFICATIONS.map((c, i) => (
                <div key={c} style={{ padding:'8px 12px', background:'rgba(255,69,0,.03)', border:'1px solid rgba(255,69,0,.08)', borderRadius:8, color:'rgba(255,255,255,.45)', fontSize:11, display:'flex', gap:10, marginBottom:6, alignItems:'center', animation:`fadeUp .6s ${.7+i*.08}s ease both` }}>
                  <span style={{ color:ACC, fontWeight:700, flexShrink:0 }}>✓</span>{c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right scrollable content ── */}
        <div key={tab} style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:20, animation:'fadeIn .35s ease forwards', paddingRight:4, paddingBottom:8 }}>

          {/* ── TRAINING TAB ── */}
          {tab === 'Training' && (
            <>
              {/* Rings */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:isMobile?12:20, flexWrap:'wrap', padding:'12px 0' }}>
                {CLIENT_STATS.slice(0,3).map(({ value, label }, i) => {
                  const sizes = [170, 136, 108]
                  const colors = ['#FF4500','#FF6B35','#FF8C42']
                  const pcts   = [87, 32, 98]
                  return <ProgressRing key={label} pct={pcts[i]} color={colors[i]} size={sizes[i]} label={label} />
                })}
              </div>

              {/* Stats strip */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {CLIENT_STATS.map(s => (
                  <div key={s.label} style={{ padding:'12px 10px', background:'rgba(255,69,0,.04)', border:'1px solid rgba(255,69,0,.1)', borderRadius:10, textAlign:'center' }}>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:ACC, letterSpacing:1 }}>{s.value}</div>
                    <div style={{ fontSize:9.5, color:'rgba(255,255,255,.35)', fontFamily:"'Space Mono',monospace", marginTop:3, lineHeight:1.5 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Program cards */}
              <div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:5, color:'rgba(255,69,0,.35)', marginBottom:12 }}>SIGNATURE PROGRAMS</div>
                <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(2,1fr)', gap:10 }}>
                  {PROGRAMS.map((p, i) => (
                    <div key={p.name} style={{ background:'rgba(255,69,0,.04)', border:'1px solid rgba(255,69,0,.14)', borderRadius:15, padding:'16px', cursor:'pointer', transition:'all .32s cubic-bezier(.23,1,.32,1)', animation:`fadeUp .8s ${.45+i*.1}s ease both` }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor='rgba(255,69,0,.44)'; el.style.transform='translateY(-5px)'; el.style.boxShadow='0 20px 40px rgba(255,69,0,.12)' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor='rgba(255,69,0,.14)'; el.style.transform=''; el.style.boxShadow='' }}
                    >
                      <div style={{ width:6, height:6, borderRadius:'50%', background:p.color, marginBottom:10, animation:`breathe ${2+i*.25}s ease-in-out infinite` }} />
                      <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:17, color:'#fff', letterSpacing:1.5, marginBottom:5 }}>{p.name}</h3>
                      <p style={{ fontSize:11.5, color:'rgba(255,255,255,.38)', lineHeight:1.65, marginBottom:10 }}>{p.desc}</p>
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
            <div style={{ display:'flex', flexDirection:'column', gap:20, animation:'fadeUp .5s ease both' }}>
              <div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:6, color:'rgba(255,69,0,.5)', marginBottom:10 }}>MY STORY</div>
                <p style={{ color:'rgba(255,255,255,.5)', fontSize:13.5, lineHeight:2, maxWidth:520, marginBottom:16 }}>
                  What started as a personal journey from being 32kg overweight at age 19 became a lifelong obsession with human physiology and performance. After 5 years competing in natural bodybuilding and earning a sports science degree, I channelled everything into evidence-based coaching.
                </p>
                <p style={{ color:'rgba(255,255,255,.38)', fontSize:13, lineHeight:2, maxWidth:520 }}>
                  My physiotherapy background means I approach fitness differently — movement quality first, then intensity. Every programme is designed around longevity, not just aesthetics. We build bodies that perform as brilliantly as they look.
                </p>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:10 }}>
                {[
                  { label:'Natural Bodybuilder', sub:'5 competition seasons, 3 podiums' },
                  { label:'Sports Science BSc', sub:'First Class Honours, 2017' },
                  { label:'340+ Clients Coached', sub:'Across 18 countries remotely' },
                  { label:'Online & In-Person', sub:'Lagos · London · Remote' },
                ].map(item => (
                  <div key={item.label} style={{ padding:'14px', background:'rgba(255,69,0,.04)', border:'1px solid rgba(255,69,0,.1)', borderRadius:12 }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:'#fff', marginBottom:4 }}>{item.label}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.38)' }}>{item.sub}</div>
                  </div>
                ))}
              </div>

              {/* Mobile certs */}
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
