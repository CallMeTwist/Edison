import { useState } from 'react'
import { useWorld }     from '@/context/WorldContext'
import { useWindowSize } from '@/hooks/useWindowSize'
import { BackButton }   from '@/components/ui/BackButton'
import { BodyModel3D }  from '@/features/physio/components/BodyModel3D'
import { BODY_DATA, PHYSIO_SERVICES, PHYSIO_STATS } from '@/features/physio/data'
import type { BodyRegionId } from '@/services/types'

const ACC = '#4FC3F7'

export const PhysioPage: React.FC = () => {
  const { navigateTo }    = useWorld()
  const { isMobile }      = useWindowSize()
  const [sel, setSel]     = useState<BodyRegionId | null>(null)
  const [_hov, setHov]    = useState<BodyRegionId | null>(null)

  const info = sel ? BODY_DATA[sel] : null

  return (
    <div style={{
      position:   'fixed',
      inset:       0,
      zIndex:      5,
      display:    'flex',
      flexDirection: isMobile ? 'column' : 'row',
      animation:  'worldIn .65s ease forwards',
      background: 'radial-gradient(ellipse at 28% 55%,rgba(5,20,45,.97) 0%,rgba(0,2,10,.99) 100%)',
      overflowY:   isMobile ? 'auto' : 'hidden',
    }}>

      {/* Grid overlay */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(79,195,247,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,195,247,.04) 1px,transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none', zIndex:0 }} />

      {/* Scan beam */}
      <div style={{ position:'absolute', left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(79,195,247,.28),transparent)', pointerEvents:'none', zIndex:2, animation:'scan 5.5s linear infinite' }} />

      <BackButton onClick={() => navigateTo('hub')} accent={ACC} />

        

      {/* World label */}
      <div style={{ position:'absolute', top:24, left:'50%', transform:'translateX(-50%)', textAlign:'center', zIndex:10, pointerEvents:'none' }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:6, color:'rgba(79,195,247,.4)', marginBottom:4 }}>WORLD 01</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(18px,2.4vw,30px)', color:'#fff' }}>Physiotherapy</h2>
      </div>

      {/* ── 3D Body Column ── */}
      <div style={{
        flex:            isMobile ? '0 0 auto' : '0 0 44%',
        height:           isMobile ? 360 : '100%',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        paddingTop:       isMobile ? 80 : 72,
        paddingBottom:    isMobile ? 0 : 0,
        position:        'relative',
        zIndex:           5,
        animation:       'fadeUp .8s .2s ease both',
      }}>
        <BodyModel3D onSelect={setSel} onHover={setHov} />

        {!isMobile && (
          <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:3, color:'rgba(79,195,247,.3)', textTransform:'uppercase', textAlign:'center', animation:'pulse 2.5s ease-in-out infinite', whiteSpace:'nowrap' }}>
            Drag · Rotate · Click
          </div>
        )}
      </div>

      {/* ── Info Column ── */}
      <div style={{
        flex:        1,
        display:    'flex',
        flexDirection:'column',
        justifyContent:'center',
        padding:     isMobile ? '24px 20px 32px' : '88px 44px 40px',
        zIndex:       5,
        gap:           22,
        overflowY:   'auto',
        animation:   'fadeUp .8s .35s ease both',
      }}>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {PHYSIO_STATS.map(s => (
            <div key={s.label} style={{ padding:'10px', background:'rgba(79,195,247,.04)', border:'1px solid rgba(79,195,247,.1)', borderRadius:10, textAlign:'center' }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:ACC, marginBottom:3 }}>{s.value}</div>
              <div style={{ fontSize:9.5, color:'rgba(255,255,255,.35)', fontFamily:"'Space Mono',monospace", lineHeight:1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Body region panel */}
        {!info ? (
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(28px,3.5vw,50px)', fontWeight:800, color:'#fff', lineHeight:1.05, marginBottom:16 }}>
              Evidence-Based<br />
              <span style={{ color:ACC }}>Physiotherapy</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,.4)', fontSize:13.5, lineHeight:1.9, maxWidth:400, marginBottom:20 }}>
              Specialising in musculoskeletal rehabilitation, sports injuries, chronic pain management and movement re-education.
            </p>
            <p style={{ color:'rgba(79,195,247,.5)', fontSize:12, fontFamily:"'Space Mono',monospace", animation:'pulse 2s ease-in-out infinite' }}>
              {isMobile ? 'Tap the diagram below' : '← Click a body region on the model'}
            </p>
          </div>
        ) : (
          <div key={sel} style={{ animation:'fadeUp .4s ease forwards' }}>
            <div style={{ fontSize:9, letterSpacing:6, color:'rgba(79,195,247,.5)', fontFamily:"'Space Mono',monospace", textTransform:'uppercase', marginBottom:10 }}>Treatment Focus</div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(22px,2.8vw,38px)', fontWeight:800, color:'#fff', marginBottom:14, lineHeight:1.1 }}>
              {info.label}
            </h2>
            <p style={{ color:'rgba(255,255,255,.46)', fontSize:13.5, lineHeight:1.95, marginBottom:20, maxWidth:420 }}>
              {info.desc}
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:24 }}>
              {info.tags.map(t => (
                <span key={t} style={{ padding:'5px 13px', background:'rgba(79,195,247,.08)', border:'1px solid rgba(79,195,247,.22)', borderRadius:100, color:ACC, fontSize:11 }}>{t}</span>
              ))}
            </div>
            <button
              style={{ padding:'12px 28px', background:'linear-gradient(135deg,rgba(79,195,247,.16),rgba(79,195,247,.04))', border:'1px solid rgba(79,195,247,.38)', borderRadius:100, color:ACC, cursor:'pointer', fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:2, textTransform:'uppercase', transition:'all .3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(79,195,247,.2)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg,rgba(79,195,247,.16),rgba(79,195,247,.04))' }}
            >
              Book Consultation →
            </button>
          </div>
        )}

        {/* Services */}
        <div style={{ borderTop:'1px solid rgba(79,195,247,.08)', paddingTop:20 }}>
          <div style={{ fontSize:9, letterSpacing:5, color:'rgba(79,195,247,.3)', fontFamily:"'Space Mono',monospace", marginBottom:12 }}>SERVICES</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
            {PHYSIO_SERVICES.map(s => (
              <span key={s} style={{ padding:'4px 11px', background:'rgba(79,195,247,.04)', border:'1px solid rgba(79,195,247,.08)', borderRadius:100, color:'rgba(255,255,255,.38)', fontSize:10.5 }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Ambient glow */}
      <div style={{ position:'absolute', top:'30%', left:'22%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(79,195,247,.06) 0%,transparent 70%)', pointerEvents:'none', animation:'breathe 5s ease-in-out infinite' }} />
    </div>
  )
}
